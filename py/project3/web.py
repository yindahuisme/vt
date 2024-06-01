# 运行命令：
# streamlit run "c:\Program Files (x86)\Common Files\Adobe\CEP\extensions\vt\py\project3\web.py" 

import streamlit as st
import pyperclip
import json
from PIL import ImageGrab
import pymysql
from io import BytesIO
import base64
from datetime import datetime
import pandas as pd

def tab1_copy_click():
    """文本大模型提示词复制到剪贴板
    """
    pyperclip.copy(f"""
目的：目前网络上有很多流行，经典，广为传唱的中文歌曲，我想用ai生图给描述”{tab1_content}“的歌曲配上背景图
步骤：
1.已确定歌曲内容方向：{tab1_content}
2.针对歌曲内容方向，生成20段文生图提示词，展开想象，多描述细节，每段提示词30字符左右。例如：一个小孩拿着气球和一只小柯基追逐打闹
3.为当前内容找出30首当今热门，经典的中文歌曲名(注意不要重复)，格式：歌名##原唱版时长秒
4.根据提示词内容，总结提取关键字，空格分隔, 必须低于60个字符，例如：小孩，气球，柯基，追逐打闹
json格式输出：
{{
"内容方向": "乡村惬意的生活",
"文生图提示词": [
"清晨的露珠挂在绿叶上，阳光透过树叶洒在地面上",
"鸟儿的歌声唤醒沉睡的人们，新的一天开始了",
"蜿蜒的小径穿过金黄的麦田，通往远方的山丘",
"河边的垂柳轻轻摇曳，水面泛起阵阵涟漪",
"村民们忙着收割庄稼，脸上洋溢着丰收的喜悦",
"孩子们在空地上放风筝，欢声笑语回荡在空中",
"老人们在树荫下悠闲地抽着旱烟，谈论着家常琐事",
"夕阳下的村庄显得格外宁静，炊烟袅袅升起",
"归家的牧童赶着牛羊，踏着夕阳的余晖",
"夜幕降临，满天繁星闪烁，村民们围坐在一起讲述美好的故事",
"月光下的稻田泛着银白色的光芒，蛙鸣声此起彼伏",
"夏日的午后，蝉鸣声声，村民们享受着片刻的宁静",
"秋风拂过，金黄的落叶铺满了乡间小路",
"冬日的暖阳洒在雪后的村庄，一切都显得那么祥和",
"村民们聚在一起，围着篝火共度寒冷的冬夜",
"孩子们在雪地里堆雪人，打雪仗，尽情玩耍",
"清晨的集市上，村民们熙熙攘攘，交流着新鲜的见闻",
"傍晚时分，家家户户的灯火通明，温馨的氛围弥漫在整个村庄",
"乡间的小路上，一辆马车缓缓驶过，留下一串串蹄印",
"夜晚的田野上，萤火虫闪烁着微弱的光芒，如同夜空中的星星"
],
"歌曲列表": [
    "孤城##243",
    "偏向##187"
...大概30首歌，仅歌名
],
"关键字": "清晨 露珠 绿叶 阳光 麦田 小径 垂柳 村民们 庄稼 丰收 孩子们 风筝 树荫 夕阳 牛羊 稻田 蛙鸣 夏日 蝉鸣 落叶 暖阳 雪地 集市 灯火 萤火虫"
}}
不要抄袭上面示例，生成另一组json结果：
    """)

def tab1_paste_click():
    """将文本大模型结果应用到《生成图片》
    """
    source_text=pyperclip.paste()
    data = json.loads(source_text)

    st.session_state["content_title"]=data["内容方向"]
    st.session_state["key_words_str"]=data["关键字"]
    st.session_state["music_name_list"]=data["歌曲列表"]

    result = []
    for hint in data["文生图提示词"]:
        item = {
            "内容方向": data["内容方向"],
            "图片风格": tab1_pic_style,
            "图片色调": tab1_pic_color,
            "文生图提示词": hint
        }
        result.append(item)
    
    # 清空图片列表
    st.session_state["pic_list"]={}
    return result


def tab2_copy_click(item_str):
    """将生成图片提示词复制到剪贴板
    """
    pyperclip.copy(item_str)

def submit_data_to_db(author, submit_time, content_title, item_type, item_value, is_finish):
    """提交数据到数据库
    """
    cursor.execute("""
    INSERT INTO yindahu.music_vedio_item (author, submit_time, content_title, item_type, item_value, is_finish)
    VALUES (%s, %s, %s, %s, %s, %s)
    """, (author, submit_time, content_title, item_type, item_value, is_finish))
    conn.commit()

def delete_record(author, submit_time, content_title):
    """删除记录
    """
    cursor.execute("""
    DELETE FROM yindahu.music_vedio_item
    WHERE author = %s AND submit_time = %s AND content_title = %s
    """, (author, submit_time, content_title))
    conn.commit()

def update_record(author, submit_time, content_title, key_words, music_list):
    """更新记录
    """
    cursor.execute("""
    UPDATE yindahu.music_vedio_item
    SET item_value = %s
    WHERE author = %s AND submit_time = %s AND content_title = %s AND item_type = '关键字'
    """, (key_words, author, submit_time, content_title))
    cursor.execute("""
    DELETE FROM yindahu.music_vedio_item
    WHERE author = %s AND submit_time = %s AND content_title = %s AND item_type = '歌曲名' and is_finish = 0
    """, (author, submit_time, content_title))
    for music_name in music_list:
        cursor.execute("""
        INSERT INTO yindahu.music_vedio_item (author, submit_time, content_title, item_type, item_value, is_finish)
        VALUES (%s, %s, %s, %s, %s, %s)
        """, (author, submit_time, content_title, "歌曲名", music_name, 0))
    conn.commit()

if __name__ == "__main__":
    author = st.selectbox("创作者：",[
        "尹大虎"
        ],
        index=0)
    # 设置页面标题
    st.write("操作步骤：")
    st.write("1.在《确定方向》页签输入内容方向，生成文本提示词，复制后提交大模型，然后将结果粘贴回来")
    st.write("2.在《生成图片》页签依次复制图片提示词，提交大模型后，将图片粘贴回来")
    st.write("3.在《提交》页签检查信息，然后提交")
    st.write("4.在《提交记录》查看已提交项")

    # 待生成图片提示词列表
    if 'pic_prompt_list' not in st.session_state:
        st.session_state["pic_prompt_list"]=[]
    # 已生成图片列表
    if 'pic_list' not in st.session_state:
        st.session_state["pic_list"]={}
    # 内容方向
    if 'content_title' not in st.session_state:
        st.session_state["content_title"]=""
    # 关键字
    if 'key_words_str' not in st.session_state:
        st.session_state["key_words_str"]=""
    # 歌曲列表
    if 'music_name_list' not in st.session_state:
        st.session_state["music_name_list"]=[]

    tab1, tab2, tab3, tab4 = st.tabs(["确定方向","生成图片","提交","提交记录"])

    # 确定方向
    with tab1:
        tab1_content=st.text_input("内容方向：")
        tab1_pic_style=st.selectbox("图片风格：",[
            "写实",
            "卡通",
            "黑白",
            "油画",
            "手绘",
            "剪纸",
            "q版3d",
            "像素"
        ],
        index=0)
        tab1_pic_color=st.selectbox("图片色调：",[
            "无",
            "黑",
            "粉红",
            "红",
            "橙",
            "金黄",
            "蓝",
            "绿",
            "青",
            "紫",
            "鲜艳"
        ],
        index=0)
        col1, col2 = st.columns(2)
        with col1:
            if st.button("复制",key="tab1_buttom_copy"):
                tab1_copy_click()
        with col2:
            if st.button("粘贴",key="tab1_buttom_paste"):
                st.session_state["pic_prompt_list"] = list(map(lambda item: 
                    f"""画一幅关于{item["内容方向"]}的画, {item["文生图提示词"]}, 风格为{item["图片风格"]}, {item["图片色调"]}"""
                    ,tab1_paste_click()))
    # 生成图片
    with tab2:
        for index,item in enumerate(st.session_state["pic_prompt_list"]):
            st.header(index+1)
            col1, col2 = st.columns([3,1])
            with col1:
                st.text(item)
            with col2:
                if st.button("复制",key=f"tab2_buttom_copy_{index}"):
                    tab2_copy_click(item)
            img_columns = st.columns(4)
            for img_index, col in enumerate(img_columns, start=1):
                img_id=f"{index}_{img_index}"
                with col:
                    img_buttom_col1,img_buttom_col2,img_buttom_space = st.columns([3,3,1])
                    with img_buttom_col1:
                        if st.button("粘贴", key=f"tab2_buttom_paste_{img_id}"):
                            st.session_state["pic_list"][img_id] = ImageGrab.grabclipboard()
                    with img_buttom_col2:
                        if st.button("删除", key=f"tab2_buttom_delete_{img_id}"):
                            if img_id in st.session_state["pic_list"]:
                                del st.session_state["pic_list"][img_id]
                    if img_id in st.session_state["pic_list"]:
                        st.image(st.session_state["pic_list"][img_id])
            st.divider()
    # 提交
    with tab3:
        content_title = st.session_state["content_title"]
        st.text(f"内容方向：{content_title}")
        st.text(f"图片数：{len(st.session_state['pic_list'])}")
        tab3_pic_particle_affect=st.selectbox("粒子特效：",[
            "淡进粉红透明爱心_粒子",
            "飘雪_粒子",
            "上升金色圆形_粒子",
            "上升蓝色圆形_粒子"
        ])
        st.session_state['key_words_str'] = st.text_area(f"关键字(60字符内)：",st.session_state['key_words_str'])
        st.session_state['music_name_list'] = st.text_area(f"歌曲列表：",",".join(st.session_state['music_name_list'])).split(",")
        if st.button("提交", key=f"tab3_buttom_commit"):
            conn = pymysql.connect(host="118.25.84.13", user="root", password="y13440113283", database="yindahu")
            cursor = conn.cursor()
            # 插入信息到数据库
            submit_time = datetime.now().strftime("%Y-%m-%d %H:%M:%S")

            if content_title=="" or len(st.session_state['pic_list'])==0 or st.session_state['key_words_str']=="" or len(st.session_state['music_name_list'])==0:
                st.error("提交信息不完整，请检查")
            elif len(st.session_state['key_words_str']) > 90:
                st.error("关键字字符数超过60")
            else:
                # 插入歌曲列表
                for music_name in st.session_state["music_name_list"]:
                    submit_data_to_db(author, submit_time, content_title, "歌曲名", music_name, 0)

                # 插入粒子特效
                submit_data_to_db(author, submit_time, content_title, "粒子特效", tab3_pic_particle_affect, 1)

                # 插入关键字
                submit_data_to_db(author, submit_time, content_title, "关键字", st.session_state["key_words_str"], 1)

                # 插入图片
                for img_id, img in st.session_state["pic_list"].items():
                    buffered = BytesIO()
                    img.save(buffered, format="JPEG")
                    img_str = base64.b64encode(buffered.getvalue()).decode("utf-8")
                    submit_data_to_db(author, submit_time, content_title, "图片base64", img_str, 1)

                # 清空 session_state
                st.session_state["content_title"] = ""
                st.session_state["key_words_str"] = ""
                st.session_state["music_name_list"] = []
                st.session_state["pic_list"] = {}
                st.session_state["pic_prompt_list"] = []
            
            
            cursor.close()
            conn.close()
            st.experimental_rerun()

    # 查看提交记录
    with tab4:
        conn = pymysql.connect(host="118.25.84.13", user="root", password="y13440113283", database="yindahu")
        cursor = conn.cursor()
        
        records = []
        cursor.execute(f"""
            SELECT author, submit_time, content_title, count(*) as total_num, sum(is_finish) as finish_num
            FROM yindahu.music_vedio_item 
            where author = '{author}'
            and item_type = '歌曲名'
            GROUP BY author, submit_time, content_title
            """)
        for row in cursor.fetchall():
            records.append(row)

        if len(records) == 0:
            st.write("暂无提交记录")
        else:
            st.write("已提交的记录：")
            for record in records:
                author, submit_time, content_title, total_num, finish_num = record
                st.write(f'''内容方向:{content_title},  完成数/总歌曲数:{finish_num}/{total_num},  作者:{author},  提交时间:{submit_time}
''')
                node_id = f'{author}_{submit_time}_{content_title}'
                col1,col2 = st.columns(2)
                with col1:
                    if st.button(f"删除", key=f"delete_button_{node_id}"):
                        delete_record(author, submit_time, content_title)
                        st.experimental_rerun()
                with col2:
                    if st.button(f"编辑", key=f"edit_button_{node_id}"):
                        st.session_state[f"is_{node_id}_edit_mode"] = True
                    if st.session_state.__contains__(f"is_{node_id}_edit_mode") and st.session_state[f"is_{node_id}_edit_mode"]:
                        edit_record = {
                            "author": author,
                            "submit_time": submit_time,
                            "content_title": content_title
                        }
                        cursor.execute(f"""
                            SELECT item_value 
                            FROM yindahu.music_vedio_item 
                            WHERE author = '{edit_record['author']}' 
                            AND submit_time = '{edit_record['submit_time']}' 
                            AND content_title = '{edit_record['content_title']}' 
                            AND item_type = '关键字'
                            """)
                        key_words = cursor.fetchone()[0]
                        cursor.execute(f"""
                            SELECT GROUP_CONCAT(item_value SEPARATOR ',')  
                            FROM yindahu.music_vedio_item 
                            WHERE author = '{edit_record['author']}' 
                            AND submit_time = '{edit_record['submit_time']}' 
                            AND content_title = '{edit_record['content_title']}' 
                            AND item_type = '歌曲名'
                            and is_finish = 0
                            """)
                        edit_unfinished_music_list = cursor.fetchone()[0]
                        key_words = st.text_area("修改关键字(60字符内)：", key_words, key=f"edit_key_words_{node_id}")
                        edit_unfinished_music_list = st.text_area("修改未完成的歌曲列表：", edit_unfinished_music_list, key=f"edit_unfinished_music_list_{node_id}")
                        if st.button("提交编辑", key=f"submit_edit_{node_id}"):
                            if len(key_words) > 60:
                                st.error("关键字字符数需低于60")
                            else:
                                update_record(
                                    edit_record["author"],
                                    edit_record["submit_time"],
                                    edit_record["content_title"],
                                    key_words,
                                    edit_unfinished_music_list.split(',')
                                )
                                st.session_state[f"is_{node_id}_edit_mode"] = False
                                st.experimental_rerun()
                st.divider()
        conn.close()
