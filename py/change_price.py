#edge_dev缩放75
import pyautogui,pyperclip
import time 

while True:
    tmpColor=pyautogui.pixel(49, 392)
    if tmpColor == (133,139,143):
        pyautogui.moveTo(907,259, duration=0.1)
        pyautogui.doubleClick()
        pyperclip.copy(f'49')
        pyautogui.hotkey('ctrl', 'v')
        pyautogui.moveTo(680,664, duration=0.1)
        pyautogui.click()
    time.sleep(1)
    