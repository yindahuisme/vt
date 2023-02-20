import os


# 定义一个函数，用于去掉指定目录下所有文件和目录名中的空格
def remove_whitespace(directory):
    # 去掉目录名称中的空格
    new_directory = directory.replace(" ", "")
    if directory != new_directory:
        os.rename(directory, new_directory)
        directory = new_directory

    for filename in os.listdir(directory):
        # 构建完整的文件路径
        filepath = os.path.join(directory, filename)

        # 如果是目录，则递归调用本函数
        if os.path.isdir(filepath):
            remove_whitespace(filepath)

        # 如果是文件，则去掉文件名中的空格
        elif os.path.isfile(filepath):
            # 去掉文件名中的空格
            new_filename = filename.replace(" ", "")
            if new_filename != filename:
                new_filepath = os.path.join(directory, new_filename)
                # 如果新文件名已经存在，则覆盖已有的文件
                if os.path.exists(new_filepath):
                    os.remove(new_filepath)
                os.rename(filepath, new_filepath)

# 指定要处理的目录
directory = "D:\\vt_data\\matFilePath"

# 调用 remove_whitespace() 函数
remove_whitespace(directory)
