#edge_dev缩放100
import pyautogui,pyperclip
import time 

time.sleep(3)

while True:
    pyautogui.moveTo(319,515, duration=0.5)
    time.sleep(1)
    pyautogui.click()
    pyautogui.moveTo(786,483, duration=0.5)
    pyautogui.click()
    time.sleep(0.5)
    pyperclip.copy(f'511023')
    pyautogui.hotkey('ctrl', 'v')
    time.sleep(2)

    