import os

# Путь к папке src (относительно текущего скрипта)
SRC_DIR = os.path.dirname(os.path.abspath(__file__))

# Путь к выходному файлу
OUTPUT_FILE = os.path.join(SRC_DIR, "project_files.txt")

# Расширения файлов, которые нужно включать (например, только код)
INCLUDE_EXTENSIONS = {".tsx", ".ts", ".js", ".jsx", ".css"}

# Расширения файлов, которые нужно игнорировать (например, бинарные файлы)
EXCLUDE_EXTENSIONS = {".png", ".jpg", ".jpeg", ".gif", ".svg", ".ico", ".woff", ".woff2", ".ttf", ".eot"}

# Папки, которые нужно игнорировать (например, node_modules)
EXCLUDE_DIRS = {"node_modules", "__pycache__", ".git"}

def collect_files():
    with open(OUTPUT_FILE, "w", encoding="utf-8") as outfile:
        # Рекурсивно обходим папку src
        for root, dirs, files in os.walk(SRC_DIR):
            # Пропускаем исключённые папки
            dirs[:] = [d for d in dirs if d not in EXCLUDE_DIRS]

            for file in files:
                # Получаем расширение файла
                _, ext = os.path.splitext(file)

                # Пропускаем файлы с исключёнными расширениями
                if ext.lower() in EXCLUDE_EXTENSIONS:
                    continue

                # Включаем только файлы с нужными расширениями
                if ext.lower() not in INCLUDE_EXTENSIONS:
                    continue

                # Получаем полный путь к файлу
                file_path = os.path.join(root, file)

                # Получаем путь относительно src
                relative_path = os.path.relpath(file_path, SRC_DIR)

                # Записываем заголовок с путём
                outfile.write(f"### File: src/{relative_path}\n")

                try:
                    # Читаем содержимое файла
                    with open(file_path, "r", encoding="utf-8") as infile:
                        content = infile.read()
                        outfile.write(content)
                        outfile.write("\n\n")
                except Exception as e:
                    outfile.write(f"Error reading file: {e}\n\n")

if __name__ == "__main__":
    print(f"Collecting files from {SRC_DIR}...")
    collect_files()
    print(f"Done! Output written to {OUTPUT_FILE}")