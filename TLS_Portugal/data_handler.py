import os
import re
import pandas as pd
from typing import List, Dict, Any, Tuple, Optional

class DataIngestor:
    """
    General File Parser for Omni-Booking Suite.
    Dynamically handles required columns, rejecting invalid files, 
    and gracefully skipping invalid rows with warnings.
    """

    def __init__(self, target_columns: Optional[List[str]] = None) -> None:
        # إذا لم يمرر المستخدم أعمدة مطلوبة، نعتمد الحساب والباسورد كأعمدة إجبارية فقط
        self.required_columns: List[str] = target_columns or ['Account', 'Password']

    def _sanitize_and_parse(self, df: pd.DataFrame) -> Tuple[bool, List[Dict[str, Any]], str, List[str]]:
        """
        Internal method to safely validate and parse dataframe.
        Returns: (Success_Boolean, Parsed_Data_List, Error_Message, Warnings_List)
        """
        # 1. فحص مستوى الملف (File Level Validation)
        missing_cols = [col for col in self.required_columns if col not in df.columns]
        if missing_cols:
            # رفض الملف بالكامل إذا غابت الأعمدة الأساسية
            return False, [], f"File rejected. Missing required columns: {', '.join(missing_cols)}", []

        parsed_data = []
        warnings = []

        # 2. فحص مستوى الصفوف (Row Level Validation)
        for index, row in df.iterrows():
            try:
                row_is_valid = True
                
                # أ. التأكد من أن جميع الأعمدة المطلوبة تحتوي على بيانات في هذا الصف
                for req_col in self.required_columns:
                    val = row.get(req_col)
                    if pd.isna(val) or str(val).strip() == '' or str(val).strip().lower() == 'nan':
                        warnings.append(f"Row {index + 2} skipped: Missing required value for '{req_col}'.")
                        row_is_valid = False
                        break # exist if condition .. 
                
                if not row_is_valid:
                    continue # تخطي الصف بالكامل

                # ب. استخراج البيانات الإجبارية (نحن متأكدون الآن أنها موجودة وصالحة)
                account = str(row['Account']).strip()
                password = str(row['Password']).strip()

                # ج. معالجة الأعمدة الاختيارية (Optional Columns)
                
                # معالجة الثواني
                second = 0
                if 'Second' in df.columns and not pd.isna(row['Second']):
                    second = int(pd.to_numeric(row['Second'], errors='coerce'))
                    if pd.isna(second): second = 0
                
                # معالجة الملي ثانية
                millisecond = 0
                if 'Millisecond' in df.columns and not pd.isna(row['Millisecond']):
                    millisecond = int(pd.to_numeric(row['Millisecond'], errors='coerce'))
                    if pd.isna(millisecond): millisecond = 0

                # معالجة وقت البداية والنهاية
                start_time = row.get('Start Time', None)
                end_time = row.get('End Time', None)
                if pd.isna(start_time): start_time = None
                if pd.isna(end_time): end_time = None

                # معالجة الدولة (Country Logic)
                if 'Country' not in df.columns:
                    country = None  # العمود غير موجود إطلاقاً في الملف
                else:
                    c_val = row['Country']
                    if pd.isna(c_val) or str(c_val).strip() == '':
                        country = "blank"  # العمود موجود لكن الخلية فارغة
                    else:
                        country = str(c_val).strip()

                # معالجة المنصة
                platform = 'TLS_Germany'
                if 'Platform' in df.columns:
                    p_val = row['Platform']
                    if not pd.isna(p_val) and str(p_val).strip() != '' and str(p_val).strip().lower() != 'nan':
                        platform = str(p_val).strip()

                # د. تجميع الصف السليم وإضافته للقائمة
                parsed_data.append({
                    'Account': account,
                    'Password': password,
                    'Second': second,
                    'Millisecond': millisecond,
                    'Start Time': start_time,
                    'End Time': end_time,
                    'Country': country,
                    'Platform': platform
                })

            except Exception as e:
                # إذا حدث خطأ غير متوقع في التحويل، نضيفه للتحذيرات ونتخطى الصف
                warnings.append(f"Row {index + 2} skipped due to formatting error: {str(e)}")
                
        return True, parsed_data, "", warnings

    def load_from_csv(self, file_path: str) -> Tuple[bool, List[Dict[str, Any]], str, List[str]]:
        if not os.path.exists(file_path):
            return False, [], "The selected CSV file does not exist.", []
        try:
            return self._sanitize_and_parse(pd.read_csv(file_path))
        except Exception as e:
            return False, [], f"Failed to read CSV file: {str(e)}", []

    def load_from_excel(self, file_path: str) -> Tuple[bool, List[Dict[str, Any]], str, List[str]]:
        if not os.path.exists(file_path):
            return False, [], "The selected Excel file does not exist.", []
        try:
            return self._sanitize_and_parse(pd.read_excel(file_path))
        except Exception as e:
            return False, [], f"Failed to read Excel file: {str(e)}", []
    def load_from_google_sheet(self, url: str) -> Tuple[bool, List[Dict[str, Any]], str, List[str]]:
            """
            يستقبل رابط جوجل شيت العادي (من شريط المتصفح أو زر Share)
            ويقوم بتحويله تلقائياً إلى رابط تحميل مباشر بصيغة CSV.
            """
            import re
            import pandas as pd

            # 1. استخراج الـ ID الخاص بالشيت من الرابط
            id_match = re.search(r'/d/([a-zA-Z0-9-_]+)', url)
            if not id_match:
                return False, [], "Invalid Google Sheets URL. Could not find Spreadsheet ID.", []
            
            spreadsheet_id = id_match.group(1)

            # 2. استخراج الـ gid (إن وجد)
            gid_match = re.search(r'[#&?]gid=([0-9]+)', url)
            
            # 3. بناء الرابط بذكاء (إذا لم نجد gid، لا نكتبه، وجوجل ستحمل أول صفحة تلقائياً)
            if gid_match:
                gid = gid_match.group(1)
                export_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&gid={gid}"
            else:
                export_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv"

            print(f"[🌐] Fetching Google Sheet: {export_url}") # سطر للمراقبة في التيرمينال

            try:
                # 4. قراءة الرابط المباشر
                # نضيف User-Agent لمنع جوجل من حظر الطلب في بعض الأحيان
                storage_options = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
                df = pd.read_csv(export_url, storage_options=storage_options)
                return self._sanitize_and_parse(df)
            except Exception as e:
                hint = ""
                if "HTTP Error 400" in str(e):
                    hint = "\n[Hint]: Ensure the Google Sheet is set to 'Anyone with the link can view'."
                return False, [], f"Failed to fetch Google Sheet data: {str(e)}{hint}", []

if __name__ == "__main__":
    # 1. إنشاء الكائن
    ingestor = DataIngestor()
    
    # 2. تحديد الملف الموجود عندك
    file_path = "https://docs.google.com/spreadsheets/d/12N0onox6RMsgRJ9uzzSGMkrKVqcCdfEnLm-GAsJyqPs/edit?usp=sharing"
    
    # 3. تحميل البيانات
    success, data_list, error_msg, warnings = ingestor.load_from_google_sheet(file_path)
    
    # 4. طباعة النتائج في الـ Terminal
    if success:
        print(f"✅ Success! Loaded {len(data_list)} accounts:\n")
        for row in data_list:
            print(row)
    else:
        print(f"❌ Critical Error: {error_msg}")
        
    if warnings:
        print("\n⚠️ Warnings (Skipped Rows):")
        for warn in warnings:
            print(f"- {warn}")
'''
if __name__ == "__main__":
    ingestor = DataIngestor() # يعتمد على الأعمدة الافتراضية 'Account', 'Password'
    success, data_list, error_msg, warnings = ingestor.load_from_excel(file_path)

    if not success:
        # الملف نفسه مرفوض (لا يحتوي على عمود Account أصلاً)
        messagebox.showerror("Critical Error", error_msg)
    else:
        # تم قبول الملف، واستخراج الحسابات السليمة
        for row in data_list:
            self.add_account_to_ui(row) # دالة إضافة الحساب للواجهة
            
        # إذا كانت هناك تحذيرات (صفوف تم تخطيها لأن الباسورد أو الإيميل فارغ)
        if warnings:
            warnings_text = "\n".join(warnings)
            messagebox.showwarning(
                "Partial Success", 
                f"Loaded {len(data_list)} accounts successfully.\n\nHowever, some rows were skipped:\n{warnings_text}"
            )
'''