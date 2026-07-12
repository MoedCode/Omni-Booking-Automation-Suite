"""
Omni-Booking-Automation-Suite/TLS_Germany/core/data_handler.py
"""

import os
import re
import pandas as pd
from typing import List, Dict, Any, Optional

class DataIngestor:
    """
    General File Parser for Omni-Booking Suite.
    Dynamically handles required columns, rejects invalid files, 
    and gracefully skips invalid rows while capturing all dynamic columns.
    """

    def __init__(self, target_columns: Optional[List[str]] = None) -> None:
        # Default mandatory columns if none are provided
        self.required_columns: List[str] = target_columns or ['Account', 'Password']

    def _sanitize_and_parse(self, df: pd.DataFrame) -> Dict[str, Any]:
        """
        Internal method to safely validate and parse the dataframe dynamically.
        Returns a structured dictionary with execution results.
        """
        # Clean column headers (removes accidental trailing spaces like "IP Address ")
        df.columns = df.columns.str.strip()

        # 1. File Level Validation
        missing_cols = [col for col in self.required_columns if col not in df.columns]
        if missing_cols:
            return {
                "success": False,
                "data": [],
                "error": f"File rejected. Missing required columns: {', '.join(missing_cols)}",
                "warnings": []
            }

        parsed_data = []
        warnings = []

        # 2. Row Level Validation & Dynamic Parsing
        for index, row in df.iterrows():
            try:
                row_dict = row.to_dict()
                row_is_valid = True
                
                # A. Validate mandatory columns
                for req_col in self.required_columns:
                    val = row_dict.get(req_col)
                    if pd.isna(val) or str(val).strip() == '' or str(val).strip().lower() == 'nan':
                        warnings.append(f"Row {index + 2} skipped: Missing required value for '{req_col}'.")
                        row_is_valid = False
                        break 
                
                if not row_is_valid:
                    continue

                # B. Dynamically clean and build the row payload
                cleaned_row = {}
                for key, val in row_dict.items():
                    if pd.isna(val):
                        cleaned_row[key] = None
                    elif isinstance(val, str):
                        cleaned_row[key] = val.strip()
                    else:
                        cleaned_row[key] = val

                # C. Ensure timing values are integers if they exist, otherwise default to 0
                for time_col in ['Second', 'Millisecond']:
                    if time_col in cleaned_row and cleaned_row[time_col] is not None:
                        try:
                            cleaned_row[time_col] = int(float(cleaned_row[time_col]))
                        except ValueError:
                            cleaned_row[time_col] = 0
                    elif time_col not in cleaned_row:
                        cleaned_row[time_col] = 0

                # D. Apply specific business logic fallbacks
                if 'Platform' not in cleaned_row or not cleaned_row['Platform']:
                    cleaned_row['Platform'] = 'TLS_Germany'
                    
                if 'Country' in cleaned_row and not cleaned_row['Country']:
                    cleaned_row['Country'] = 'blank'

                # Append the fully dynamic row dictionary
                parsed_data.append(cleaned_row)

            except Exception as e:
                warnings.append(f"Row {index + 2} skipped due to unexpected error: {str(e)}")
                
        return {
            "success": True,
            "data": parsed_data,
            "error": "",
            "warnings": warnings
        }

    def load_from_csv(self, file_path: str) -> Dict[str, Any]:
        if not os.path.exists(file_path):
            return {"success": False, "data": [], "error": "The selected CSV file does not exist.", "warnings": []}
        try:
            return self._sanitize_and_parse(pd.read_csv(file_path))
        except Exception as e:
            return {"success": False, "data": [], "error": f"Failed to read CSV file: {str(e)}", "warnings": []}

    def load_from_excel(self, file_path: str) -> Dict[str, Any]:
        if not os.path.exists(file_path):
            return {"success": False, "data": [], "error": "The selected Excel file does not exist.", "warnings": []}
        try:
            return self._sanitize_and_parse(pd.read_excel(file_path))
        except Exception as e:
            return {"success": False, "data": [], "error": f"Failed to read Excel file: {str(e)}", "warnings": []}

    def load_from_google_sheet(self, url: str) -> Dict[str, Any]:
        """
        Extracts data from a standard Google Sheets share link.
        Automatically converts the URL to a CSV export endpoint.
        """
        # Extract the Spreadsheet ID
        id_match = re.search(r'/d/([a-zA-Z0-9-_]+)', url)
        if not id_match:
            return {"success": False, "data": [], "error": "Invalid Google Sheets URL. Could not find Spreadsheet ID.", "warnings": []}
        
        spreadsheet_id = id_match.group(1)

        # Extract the GID (sheet page identifier) if present
        gid_match = re.search(r'[#&?]gid=([0-9]+)', url)
        
        if gid_match:
            gid = gid_match.group(1)
            export_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv&gid={gid}"
        else:
            export_url = f"https://docs.google.com/spreadsheets/d/{spreadsheet_id}/export?format=csv"

        print(f"[🌐] Fetching Google Sheet: {export_url}")

        try:
            storage_options = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
            df = pd.read_csv(export_url, storage_options=storage_options)
            return self._sanitize_and_parse(df)
        except Exception as e:
            hint = "\n[Hint]: Ensure the Google Sheet is set to 'Anyone with the link can view'." if "HTTP Error 400" in str(e) else ""
            return {"success": False, "data": [], "error": f"Failed to fetch Google Sheet data: {str(e)}{hint}", "warnings": []}


if __name__ == "__main__":
    ingestor = DataIngestor()
    
    sheet_url = "https://docs.google.com/spreadsheets/d/12N0onox6RMsgRJ9uzzSGMkrKVqcCdfEnLm-GAsJyqPs/edit?usp=sharing"
    
    # Store the returned dictionary
    result = ingestor.load_from_google_sheet(sheet_url)
    
    if result["success"]:
        print(f"✅ Success! Loaded {len(result['data'])} accounts:\n")
        for row in result["data"]:
            print(row)
    else:
        print(f"❌ Critical Error: {result['error']}")
        
    if result["warnings"]:
        print("\n⚠️ Warnings (Skipped Rows):")
        for warn in result["warnings"]:
            print(f"- {warn}")