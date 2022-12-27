// 获取当前项目名
// 参数：
function getProjectName(argc) {
    var appName = app.project.name
    return appName.split('.')[0]
}

// 获取当前项目轨道
// 参数：1.轨道类型
function getProjectTracks(argc) {
    var tracks = []
    if (argc == '视频') {
        var vts = app.project.activeSequence.videoTracks
        for (var i = 0; i < vts.length; i++) {
            tracks.push(vts[i].name)
        }
        return tracks.join()
    } else if (argc == '音频') {

        var ats = app.project.activeSequence.audioTracks
        for (var i = 0; i < ats.length; i++) {
            tracks.push(ats[i].name)
        }
        return tracks.join()
    } else {
        return tracks.join()
    }
}