

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
# 获取目录的所有作品文件
def get_all_vedio_files(path):
    files = []
    for dirpath, dirnames, filenames in os.walk(path):
        for filename in filenames:
            if filename.endswith('.mp4'):
                files.append(os.path.abspath(os.path.join(dirpath, filename)))
    return files

if __name__ == "__main__":
    # 找到待处理的作品，获取路径
    basePath = 'D:\\vt_data\\matFilePath\\音乐背景\\'
    vedioPathList = get_all_vedio_files(basePath+'动态图片\\成品图\\')
    # 遍历作品路径
    for vedioPath in vedioPathList:
        # 作品文件名
        vedioFileName = vedioPath.split('\\')[-1]
        # 作品名
        tmpVedioName = vedioFileName.split('###')[0].strip()
        with open('proccessedVedioList.txt', 'r',encoding='utf-8') as f:
            # 读取已处理作品列表
            proccessedVedioPathList = f.read().split('\n')
        # 不重复生成
        if tmpVedioName in proccessedVedioPathList:
            continue
        # 上传视频
        # 点击浏览器
        while True:
            time.sleep(1)
            if pyautogui.pixel(100,120)==(51,58,62):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:切换浏览器页面 完成\n')
                break 
            else:
                pyautogui.moveTo(130,755, duration=0.5)
                pyautogui.click()
        
        
        # 点击开始上传视频
        pyautogui.moveTo(543,251, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(433, 16)==(255,255,255):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:点击选择视频按钮 完成\n')
                time.sleep(1)
                break
            else:
                pyautogui.click()
        pyperclip.copy(vedioPath)
        pyautogui.hotkey('ctrl', 'v')
        # 确认
        pyautogui.moveTo(513,449, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(58, 456)==(248,249,250):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:点击确认视频按钮 完成\n')
                break
            else:
                pyautogui.click()
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
            else:
                pyautogui.click()
        # 填写标题
        # 歌曲名长度限制在10个字符内
        tmpVedioNameLimit = vedioFileName.split('###')[0][:18]
        pyautogui.moveTo(615,338, duration=0.5)
        pyautogui.tripleClick()
        pyperclip.copy(tmpVedioNameLimit)
        pyautogui.hotkey('ctrl', 'v')
        # 填写简介
        pyautogui.moveTo(662,360, duration=0.5)
        pyautogui.click()
        pyperclip.copy(f'简约干净的画面，直击灵魂')
        pyautogui.hotkey('ctrl', 'v')
        # 填写关键字
        pyautogui.moveTo(667,400, duration=0.5)
        pyautogui.click()
        tmpFixedKeyWords='粒子 动态背景 动图 led 大屏 舞台 '
        pyperclip.copy(tmpFixedKeyWords+vedioFileName.split('###')[1].replace('-',' '))
        pyautogui.hotkey('ctrl', 'v')
        # 填写价格
        pyautogui.moveTo(805,344, duration=0.5)
        pyautogui.click()
        pyperclip.copy(f'49')
        pyautogui.hotkey('ctrl', 'v')
        # 勾选视频循环
        if str(tmpVedioName).__contains__('可循环'):
            pyautogui.moveTo(820,320, duration=0.5)
            pyautogui.click()
        # 提交
        pyautogui.moveTo(680,536, duration=0.5)
        pyautogui.click()
        while True:
            time.sleep(1)
            if pyautogui.pixel(250, 250)!=(133,139,143):
                print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:填写信息完成,已提交\n')
                break
            else:
                pyautogui.click()
        # 刷新当前页面
        pyautogui.moveTo(73,54, duration=0.5)
        pyautogui.click()
        # 更新状态
        with open('proccessedVedioList.txt', 'a+',encoding='utf-8') as f:
            # 追加
            f.write(tmpVedioName+'\n')
    print(f'{time.strftime("%Y-%m-%d %H:%M:%S", time.localtime())}:处理完成')



        


