import requests,json
#删除空格
import tool.del_space
#同步素材文件到数据库
url = "http://127.0.0.1:8811/vt/syncMatFileMetaData"
data = {
}
requests.post(url, data=json.dumps(data))
#删除背景音乐项目小音乐文件
url = "http://127.0.0.1:8811/vt/tool/delBgMusicSmallFile"
requests.get(url)