# 准备步骤：
# 1.窗口1，打开文件资源管理器
# 2.窗口2，启动init.cmd 
# 3.窗口3，启动vscode 
# 4.窗口4，启动edge,67%缩放
# 5.窗口5，启动pr

import keyword
import pymysql
import time
import requests
import json
import base64
import shutil
import random
import pyautogui
import os
import pyperclip

def save_base64_image(base64_image, file_path):
    with open(file_path, "wb") as f:
        decoded_image = base64.b64decode(base64_image)
        f.write(decoded_image)

def process_point(point_name , repair_fun = None):
    pyautogui.moveTo(*auto_point_dict[point_name]["点位"], duration=0.5)
    if not auto_point_dict[point_name].__contains__("点击类型") or auto_point_dict[point_name]["点击类型"] == '点击':
        pyautogui.click()
    elif auto_point_dict[point_name]["点击类型"] == '双击':
        pyautogui.doubleClick()
    elif auto_point_dict[point_name]["点击类型"] == '三击':
        pyautogui.tripleClick()
    if auto_point_dict[point_name].__contains__("验证点位"):
        while True:
            time.sleep(auto_point_dict[point_name]["验证等待秒"])
            if pyautogui.pixel(*auto_point_dict[point_name]["验证点位"])==auto_point_dict[point_name]["验证颜色"]:
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:切换{point_name}完成\n')
                break
            else:
                if repair_fun == None:
                    pyautogui.click()
                else: 
                    repair_fun()

if __name__ == "__main__":
    # 项目根目录
    base_path = 'D:\\vt_data\\matFilePath\\音乐背景\\图库\\'
    # 作者
    author = ['尹大虎'][0]
    # 自动化点位信息
    auto_point_dict = {
    "点击pr":{
        "点位":(510,2110),
        "验证点位":(1764,371),
        "验证颜色":(103, 194, 58),
        "验证等待秒":1
    },
    "点击pr重做":{
        "点位":(1794,244),
        "验证点位":(1764,371),
        "验证颜色":(103, 194, 58),
        "验证等待秒":1
    },
    "点击pr导出页面":{
        "点位":(324,122),
        "验证点位":(3788,1972),
        "验证颜色":(20, 115, 230),
        "验证等待秒":1
    },
    "点击pr导出":{
        "点位":(3788,1972),
        "验证点位":(1750,1134),
        "验证颜色":(255, 255, 255),
        "验证等待秒":1
    },
    "点击浏览器":{
        "点位":(420,2100),
        "验证点位":(500,500),
        "验证颜色":(254, 254, 254),
        "验证等待秒":1
    },
    "点击上传视频":{
        "点位":(2340,876),
        "验证点位":(159,983),
        "验证颜色":(240, 240, 240),
        "验证等待秒":1
    },
    "三击上传视频确认输入框":{
        "点位":(600,960),
        "点击类型":"三击"
    },
    "点击上传视频确认":{
        "点位":(1578,1020),
        "验证点位":(500,500),
        "验证颜色":(254, 254, 254),
        "验证等待秒":1
    },
    "点击填写信息":{
        "点位":(1174,1194),
        "验证点位":(500,500),
        "验证颜色":(110, 110, 110),
        "验证等待秒":1
    },
    "三击标题输入框":{
        "点位":(1730,517),
        "点击类型":"三击"
    },
    "点击简介输入框":{
        "点位":(1760,655)
    },
    "点击关键字输入框":{
        "点位":(1737,884)
    },
    "点击ai标识":{
        "点位":(2270,937)
    },
    "点击价格输入框":{
        "点位":(2340,490)
    },
    "点击提交":{
        "点位":(1880,1700),
        "验证点位":(500,500),
        "验证颜色":(254, 254, 254),
        "验证等待秒":1
    },
    "点击浏览器刷新":{
        "点位":(143,100)
    },
    }
    while True:
        time.sleep(10)
        print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:({author})阶段开始------------------------------------------------------------')
        # 清理项目
        url = "http://127.0.0.1:8811/vt/auto/clearMusicProject"
        requests.get(url)
        time.sleep(3)
        # pr点击重做------------------------------------------------------------
        process_point("点击pr")
        process_point("点击pr重做")
        # 移开pr焦点以删除素材文件
        process_point("点击浏览器")
        # 清空目录
        auto_path = base_path + 'auto\\'
        while os.path.exists(auto_path):
            os.system(f'DEL /F /A /Q \\\\?\\{auto_path}')
            os.system(f'RD /S /Q \\\\?\\{auto_path}')
            time.sleep(1)
        os.makedirs(auto_path)
        # 拉取作者最早一个主题数据
        conn = pymysql.connect(host="118.25.84.13", user="root", password="y13440113283", database="yindahu")
        cursor = conn.cursor()
        cursor.execute(f'''
        select A.content_title ,
        	A.item_type,
        	A.item_value,
            A.submit_time
        from yindahu.music_vedio_item A
        where A.author = '{author}'
        and not (A.item_type = '歌曲名' and is_finish = 1)
        and A.submit_time = (
        	select min(submit_time)
        	from yindahu.music_vedio_item 
        	where author = '{author}'
        	and is_finish = 0
        	and item_type = '歌曲名' 
            )
        ''')
        cursor.close()
        conn.close()
        # 待处理的音乐名列表
        music_name_list = []
        # 标题
        title = ''
        # 提交时间
        submit_time = ''
        # 关键字
        key_words = ''
        # 初始化
        tmp_data = cursor.fetchall()
        if len(tmp_data) == 0:
            break
        for row in tmp_data:
            title = row[0]
            submit_time = row[3]
            if row[1] == '歌曲名':
                music_name_list.append(row[2])
            if row[1] == '关键字':
                key_words = row[2]
            if row[1] == '图片base64':
                save_base64_image(row[2], auto_path + f'{time.time_ns()}.jpg')
                time.sleep(0.1)
            if row[1] == '粒子特效':
                shutil.copy(base_path + row[2] + '.mp4', auto_path)
        if len(music_name_list) == 0 or title == '' or key_words == '':
            raise RuntimeError('拉下的数据有问题，请检查')
        
        # 同步素材文件
        url = "http://127.0.0.1:8811/vt/syncMatFileMetaData"
        headers = {"Content-Type": "application/json"}
        data = {
        }
        requests.post(url, headers=headers, data=json.dumps(data))
        time.sleep(3)

        for music_name in music_name_list:
            print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:开始创作 {title}-{music_name}')
            tmp_music_name = music_name.split('##')[0]
            tmp_music_seconds = int(music_name.split('##')[1]) + random.randint(50, 60)

            # 请求后端，生成项目数据
            url = "http://127.0.0.1:8811/vt/auto/new_songBGV"
            headers = {"Content-Type": "application/json"}
            data = {
                "songName":'音乐背景',
                "baseStyle":'auto',
                "songSeconds":tmp_music_seconds
            }
            requests.post(url, headers=headers, data=json.dumps(data))
            time.sleep(3)
            # 再次点击pr重做--------------------------------------------------
            process_point("点击pr")
            process_point("点击pr重做")
            # 生成视频
            targetVedioPath = 'D:\\vt_data\\pr_project\\音乐背景_1.mp4'
            if os.path.exists(targetVedioPath):
                os.remove(targetVedioPath)
            # 开始导出视频(pr导出)
            process_point("点击pr导出页面")
            process_point("点击pr导出")
            while True:
                time.sleep(3)
                if os.path.exists(targetVedioPath):
                    print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:导出完成，检测到目标视频文件')
                    break
            # 上传视频
            # 点击浏览器
            process_point("点击浏览器")
            # 点击开始上传视频
            process_point("点击上传视频")
            pyperclip.copy(targetVedioPath)
            pyautogui.hotkey('ctrl', 'v')
            # 确认
            def tmp_confirm_fun():
                process_point("三击上传视频确认输入框")
                pyautogui.hotkey('ctrl', 'v')
                process_point("点击上传视频确认")
            process_point("点击上传视频确认", repair_fun = tmp_confirm_fun)
                
            # 点击填写信息
            process_point("点击填写信息")
            # 填写标题
            # 歌曲名长度限制在10个字符内
            tmpMusicNameLimit = music_name[:10]
            process_point("三击标题输入框")
            pyperclip.copy(f'音乐背景《{tmpMusicNameLimit}》成品')
            pyautogui.hotkey('ctrl', 'v')
            # 填写简介
            process_point("点击简介输入框")
            pyperclip.copy(f'简约干净的画面，直击灵魂')
            pyautogui.hotkey('ctrl', 'v')
            # 填写关键字
            process_point("点击关键字输入框")
            pyperclip.copy(f'{tmpMusicNameLimit} 音乐背景 led大屏幕 led视频 歌曲背景 {title} {key_words}')
            pyautogui.hotkey('ctrl', 'v')
            # 填写价格
            process_point("点击价格输入框")
            pyperclip.copy(f'49')
            pyautogui.hotkey('ctrl', 'v')
            # 勾选ai标识
            process_point("点击ai标识")
            # 提交
            process_point("点击提交")
            # 更新状态
            conn = pymysql.connect(host="118.25.84.13", user="root", password="y13440113283", database="yindahu")
            cursor = conn.cursor()
            cursor.execute(f'''
            update yindahu.music_vedio_item 
            set is_finish = 1
            where author = '{author}'
            and item_type = '歌曲名' 
            and item_value = '{music_name}' 
            and submit_time = '{submit_time}'
            ''')
            conn.commit()
            cursor.close()
            conn.close()
            # 刷新当前页面
            process_point("点击浏览器刷新")
    print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:处理完成')



        


