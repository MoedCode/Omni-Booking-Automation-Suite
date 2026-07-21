import os

def create_context_file(output_file="project_context.md"):
    # المجلدات التي سيتم تجاهلها بالكامل
    exclude_dirs = {'.git', '__pycache__', 'venv', 'wenv', '.env', '.idea', '.vscode', 'downloaded_files'}
    
    # الامتدادات التي نريد تضمينها
    include_extensions = ('.py', '.qss', '.md')
    
    with open(output_file, 'w', encoding='utf-8') as outfile:
        outfile.write("# Project Context File\n\n")
        
        for root, dirs, files in os.walk('.'):
            # استبعاد المجلدات المحددة من البحث
            dirs[:] = [d for d in dirs if d not in exclude_dirs]
            
            for file in files:
                if file.endswith(include_extensions):
                    file_path = os.path.join(root, file)
                    
                    # استخراج الامتداد لتحديد نوع الكود في الماركدوان
                    ext = os.path.splitext(file)[1][1:]
                    
                    outfile.write(f"\n\n## FILE: {file_path}\n\n")
                    outfile.write(f"```{ext}\n")
                    
                    try:
                        with open(file_path, 'r', encoding='utf-8') as infile:
                            outfile.write(infile.read())
                    except Exception as e:
                        outfile.write(f"Error reading file: {e}")
                        
                    outfile.write(f"\n```\n")
                    
    print(f"✅ تم إنشاء الملف بنجاح: {output_file}")

if __name__ == "__main__":
    create_context_file()