

# 前提：
# 1.寻找音乐，分类放到画面基调目录下
# 2.打开音乐人声分离软件(任务栏第一个页签)，紧贴画面左上角
# 3.打开edge dev浏览器(任务栏第二个页签)，全屏，点到上传素材页面,页内缩放33%
# 4.打开adobe tool工具（任务栏第三个页签），全屏
# 5.启动后端
# 6.打开pr音乐背景项目(任务栏第八个页签，且保证为最后一个页签)，全屏,不要动默认布局
# 脚本处理
import time, os
import pyautogui
import pyperclip
import shutil
import requests
import json
# 获取目录的所有子音乐文件的绝对路径
def get_all_music_files(path):
    files = []
    proccessedFiles = []
    for dirpath, dirnames, filenames in os.walk(path):
        for filename in filenames:
            if filename.endswith('vocals.wav'):
                proccessedFiles.append(os.path.abspath(os.path.join(dirpath, filename)))
            if filename.endswith('.mp3'):
                files.append(os.path.abspath(os.path.join(dirpath, filename)))
    return (files,proccessedFiles)

if __name__ == "__main__":
    # 找到待处理的音乐，获取路径
    basePath = 'D:\\vt_data\\matFilePath\\音乐背景\\'
    musicPathList = get_all_music_files(basePath+'图库\\')[0]
    # 遍历音乐路径
    for musicPath in musicPathList:
        # 画面基调
        baseStyle = musicPath.split('\\')[-2]
        # if baseStyle != '写实漫画-古风':
        #     continue
        # 歌曲文件名
        musicFileName = musicPath.split('\\')[-1]
        # 歌曲名
        if str(musicFileName).__contains__('-'):
            tmpMusicName = musicFileName.split('-')[0].strip()
        else:
            tmpMusicName = musicFileName.split('.')[0].strip()
        with open('proccessedSongList.txt', 'r',encoding='utf-8') as f:
            # 读取已处理歌曲列表
            proccessedMusicPathList = f.read().split('\n')
        # 不重复生成
        if f'{baseStyle}##{tmpMusicName}' in proccessedMusicPathList:
            continue
        print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:正在创作：{tmpMusicName}\n')
        # 点击人声分离软件
        pyautogui.moveTo(91,751, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(286, 16)==(255,255,255):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:切换人声分离软件页面 完成\n')
                break
        # 点击选择音乐文件
        pyautogui.moveTo(266,350, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(96, 446)==(240,240,240):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:点击选择音乐按钮 完成\n')
                time.sleep(1)
                break
        # 输入音乐路径,确定
        targetMusicPath = f'{basePath}歌曲\\'
        proccessedMusicPath = f'{targetMusicPath}{musicFileName.rsplit(".", 1)[0]}\\'
        if os.path.exists(proccessedMusicPath):
            shutil.rmtree(proccessedMusicPath, ignore_errors=True)
        pyperclip.copy(musicPath)
        pyautogui.hotkey('ctrl', 'v')
        pyautogui.moveTo(504,446, duration=0.5)
        pyautogui.click()
        print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:开始人声分离\n')
        # 等待，直到人声分离文件生成成功
        accompanimentMusicPath = proccessedMusicPath+'accompaniment.wav'
        while True:
            time.sleep(1)
            if os.path.isfile(accompanimentMusicPath):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:人声分离成功，文件已生成')
                break
        time.sleep(3)
        # 移动伴奏，原曲音乐文件
        shutil.move(accompanimentMusicPath, targetMusicPath + '音乐背景伴奏.wav')
        shutil.rmtree(proccessedMusicPath, ignore_errors=True)
        shutil.copy(musicPath, targetMusicPath + '音乐背景原声.mp3')
        # 请求后端，生成项目数据
        url = "http://127.0.0.1:8811/vt/auto/songBGV"
        headers = {"Content-Type": "application/json"}
        data = {
            "songName":'音乐背景',
            "baseStyle":baseStyle,
            "intervalSeconds":5,
            "songSuffix":"伴奏.wav"
        }
        requests.post(url, headers=headers, data=json.dumps(data))
        time.sleep(3)
        
        # pr重做
        # 点击pr
        pyautogui.moveTo(317,757, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(629, 427)==(255,255,255):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:切换pr页面 完成\n')
                break
        # 点击重做
        pyautogui.moveTo(645,136, duration=0.5)
        pyautogui.click()
        pyautogui.moveTo(745,136, duration=0.5)
        # 等待视频重做完成
        while True:
            time.sleep(1)
            tmpColor=pyautogui.pixel(658, 157)
            if tmpColor == (64,158,255):
                break
        # 生成视频
        targetVedioPath = 'D:\\vt_data\\pr_project\\音乐背景_1.mp4'
        if os.path.exists(targetVedioPath):
            os.remove(targetVedioPath)
        # 开始导出视频(pr导出)
        pyautogui.moveTo(207,60, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(1289, 686)==(20,115,230):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:切换pr导出页面 完成\n')
                break
        pyautogui.moveTo(1312,685, duration=0.5)
        pyautogui.click()
        # 等待视频导出完成
        while True:
            time.sleep(3)
            if pyautogui.pixel(549, 385)==(35,35,35):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:正在导出视频...\n')
                break
        while True:
            time.sleep(3)
            if pyautogui.pixel(549, 385)==(255,255,255) and os.path.exists(targetVedioPath):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:导出完成，检测到目标视频文件')
                break
        # 上传视频
        # 点击浏览器
        pyautogui.moveTo(130,755, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(47, 47)==(247,247,247):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:切换浏览器页面 完成\n')
                break
        # 点击开始上传视频
        pyautogui.moveTo(543,251, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(433, 16)==(255,255,255):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:点击选择视频按钮 完成\n')
                time.sleep(1)
                break
        pyperclip.copy(targetVedioPath)
        pyautogui.hotkey('ctrl', 'v')
        # 确认
        pyautogui.moveTo(513,449, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(58, 456)==(248,249,250):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:点击确认视频按钮 完成\n')
                break
        # 开始上传
        pyautogui.moveTo(684,375, duration=0.5)
        pyautogui.click()
        print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:开始上传视频\n')
        # 等待上传完成
        while True:
            time.sleep(1)
            tmpColor=pyautogui.pixel(569, 485)
            if tmpColor != (248,249,250) and tmpColor != (254,254,254):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:上传视频完成\n')
                break
        # 点击填写信息
        pyautogui.moveTo(534,470, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(250,250)==(133,139,143):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:填写信息窗口打开完成\n')
                break
        # 填写标题
        # 歌曲名长度限制在10个字符内
        tmpMusicNameLimit = tmpMusicName[:10]
        pyautogui.moveTo(615,338, duration=0.5)
        pyautogui.tripleClick()
        pyperclip.copy(f'音乐背景《{tmpMusicNameLimit}》成品')
        pyautogui.hotkey('ctrl', 'v')
        # 填写简介
        pyautogui.moveTo(662,360, duration=0.5)
        pyautogui.click()
        pyperclip.copy(f'简约干净的画面，直击灵魂')
        pyautogui.hotkey('ctrl', 'v')
        # 填写关键字
        tmpKeyDict = {
            '3d卡通-甜蜜爱情':f'{tmpMusicNameLimit} 3d 配乐成品 led大屏幕 led视频 粒子 歌曲背景 表演 彩带 气球 阳光 湖 花朵 粉色 爱心 天空 伴奏 歌曲 蝴蝶 爱情 甜蜜 温馨'
            ,'3d卡通-伤感爱情':f'{tmpMusicNameLimit} 3d 配乐成品 led大屏幕 led视频 粒子 歌曲背景 表演 桥 笔 信 街道 下雨 失落 压抑 失恋 爱情 黑暗 天空 草地 海边 背影 玫瑰 玻璃杯'
            ,'3d卡通-励志':f'{tmpMusicNameLimit} 3d 配乐成品 led大屏幕 led视频 粒子 歌曲背景 表演 足球 山 励志 气势 夕阳 阳光 奔跑 海边 正能量 希望 拼搏 '
            ,'艳丽卡通-校园青春':f'{tmpMusicNameLimit} 3d 配乐成品 led大屏幕 led视频 粒子 歌曲背景 表演 校园 青春 风景 爱情 活力 回忆 甜蜜 卡通 教室 自行车 夜色 窗户 天空 牵手 学习 公路'
            ,'漫画-甜蜜爱情':f'{tmpMusicNameLimit} 3d 配乐成品 led大屏幕 led视频 粒子 歌曲背景 表演 牵手 动漫 卡通 爱情 花朵 艳丽 草地 蝴蝶 浪漫 女孩 自行车 菊花 麦穗 爱心 玻璃瓶 温馨 青春 田野 风景'
            ,'手绘-伤感':f'{tmpMusicNameLimit} 3d 配乐成品 led大屏幕 led视频 粒子 歌曲背景 表演 动漫 手绘 女孩 花朵 海 夜空 山 流星 阳光 灯塔 月亮 伤感 猫咪 海滩 雨伞 雨天 玻璃瓶 男孩 海鸥 鸟 美景 雪'
            ,'梦幻写实-甜蜜爱情':f'{tmpMusicNameLimit} 3d 配乐成品 led大屏幕 led视频 粒子 歌曲背景 表演 粉色 心动 520 表白 牵手 动漫 卡通 爱情 艳丽 草地 蝴蝶 浪漫 自行车 菊花 麦穗 玻璃瓶 青春 田野 风景'
            ,'写实漫画-古风':f'{tmpMusicNameLimit} 3d 配乐成品 led大屏幕 led视频 粒子 歌曲背景 表演 古风 船 山 云 雾 阳光 桃花 船帆 宏伟 山水 鸟 亭子 塔 灯笼 下雪 '
            ,'抽象漫画-儿童':f'{tmpMusicNameLimit} 3d 配乐成品 led大屏幕 led视频 粒子 歌曲背景 表演 牵手 动漫 卡通 儿童 草地 玩耍 欢快 玩具 郊游 唯美 阳光 微笑 儿歌'
}
        pyautogui.moveTo(667,400, duration=0.5)
        pyautogui.click()
        pyperclip.copy(tmpKeyDict[baseStyle])
        pyautogui.hotkey('ctrl', 'v')
        # 填写价格
        pyautogui.moveTo(805,344, duration=0.5)
        pyautogui.click()
        pyperclip.copy(f'49')
        pyautogui.hotkey('ctrl', 'v')
        # 提交
        pyautogui.moveTo(680,536, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(250, 250)!=(133,139,143):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:填写信息完成,已提交\n')
                break
        # 更新状态
        with open('proccessedSongList.txt', 'a+',encoding='utf-8') as f:
            # 追加：风格##歌曲名
            f.write(baseStyle+'##'+tmpMusicName+'\n')
        # 刷新当前页面
        pyautogui.moveTo(73,54, duration=0.5)
        pyautogui.click()
        # 清理项目
        url = "http://127.0.0.1:8811/vt/auto/clearMusicProject"
        requests.get(url)
        time.sleep(3)
        # 点击pr
        pyautogui.moveTo(317,757, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(629, 427)==(255,255,255):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:切换pr页面 完成\n')
                break
        # 点击重做
        pyautogui.moveTo(645,136, duration=0.5)
        pyautogui.click()
        # 点击adobe tool工具
        pyautogui.moveTo(166,760, duration=0.5)
        pyautogui.click()
        # 删除素材clip片段
        pyautogui.moveTo(815,77, duration=0.5)
        pyautogui.click()
    print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:处理完成')



        


