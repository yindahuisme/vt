歌曲背景视频生成项目
输入：歌曲名，画面基调，图片间隔秒
输出：背景视频

准备工作步骤细分：
1.利用stable diffusion文图模型为画面基调生成20-100张1920*1080分辨率的图片，放入data\音乐背景\图库\{画面基调}\ 目录作为图库，后续会不断扩充画面基调。发挥想象力，同一画面基调生成风格统一的素材。如果本机显卡算力不足，可白嫖stable diffusion官网（https://stablediffusionweb.com/#demo）算力，但有分辨率512*512等参数限制
2.准备润色粒子特效，黑底，放入data\音乐背景\图库\{画面基调}\xxx_粒子.mp4，后续通过滤色融入画面(小技巧：粒子特效视频一般较短，可以使用ffmpeg循环拼接延长时间:"C:\Program Files (x86)\Common Files\Adobe\CEP\extensions\vt\lib\ffmpeg-master-latest-win64-gpl\bin\ffmpeg.exe" -stream_loop 12 -i "粉红透明爱心_粒子.mp4" -c copy "D:\vt_data\matFilePath\音乐背景\图库\甜蜜卡通\淡进粉红透明爱心_粒子.mp4")

常规工作步骤细分：
1.前往https://www.gequbao.com/music/2902562下载原版歌曲，放在data\音乐背景\歌曲\{歌曲名.xxx}
2.将歌曲文件消人声处理，可在这里处理：https://vocalremover.org/
3.填写{歌曲名}，{画面基调}-切图间隔秒，执行脚本
4.打开pr,新建项目，项目名为：音乐背景-{歌曲名}，然后新建1080p序列
5.点击导航栏->窗口->拓展->vt,然后点击重做。等待视频生成
6.导出:音乐背景-{歌曲名}.mp4
7.上传光场等素材网，素材关键字可借鉴同品类爆款


标题：《歌曲名》歌曲伴奏成品
简介：简约干净的画面，直击灵魂
关键字：歌曲名 画面风格 画面内容 感受 配乐成品 led大屏幕 led视频 粒子 歌曲背景 表演

new bing找歌prompt:
我有一个歌曲背景视频，是关于甜蜜爱情的，请结合歌词内容和歌曲的创作背景给我列举50首中文名歌曲匹配这个视频内容，列出歌曲名和相关歌词内容，歌曲的选择要求是：热门，经典，ktv，流行。注意，排除掉那些小众歌曲，思考一下在回答

I want to create some static beauty with stable diffusio, please help me to write 10 groups of prompt words in English, write in English:
