# streamlit run "c:\Program Files (x86)\Common Files\Adobe\CEP\extensions\vt\test\test.py"
# import streamlit as st
# import threading

# def main():
#     st.write("Hello, World!")

#     def sub_thread():
        
#         st.sidebar.success("子线程已完成")

#     t = threading.Thread(target=sub_thread)
#     t.start()

# if __name__ == "__main__":
#     main()

# def fun(a,b):
#     print(a+b)

# fun(*(1,2))



import os
import time
import datetime
import pymysql
import schedule
import threading

def backup():
    # MySQL connection details
    HOST = "localhost"
    PORT = 3306
    USER = "root"
    PASSWORD = "y13440113283"
    DBNAME = "yindahu"  # 确保替换为实际的数据库名称
    TABLE = "music_vedio_item"
    BACKUP_DBNAME = "yindahu"  # 确保替换为实际的备份数据库名称
    DATE = datetime.datetime.now().strftime("%Y%m%d")
    print(f'开始备份{DATE}的数据')

    # Connect to the MySQL server
    connection = pymysql.connect(host=HOST, port=PORT, user=USER, password=PASSWORD, db=DBNAME)
    cursor = connection.cursor()

    # Create a backup table using CREATE TABLE AS
    cursor.execute(f"CREATE TABLE if not exists {BACKUP_DBNAME}.{TABLE}_{DATE} AS SELECT * FROM {TABLE};")

    oldest_backup_date = (datetime.datetime.now() - datetime.timedelta(days=-30)).strftime("%Y%m%d")

    cursor.execute(f"DROP TABLE if exists {BACKUP_DBNAME}.{TABLE}_{oldest_backup_date};")

    # Close the database connection
    cursor.close()
    connection.close()

# Schedule the backup task to run every day at 18:00
schedule.every().day.at("18:00").do(backup)

# Keep the script running as a daemon
while True:
    schedule.run_pending()
    time.sleep(60)  # Wait 60 seconds before checking for new tasks
