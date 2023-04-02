// 加载素材文件到项目
//var project = app.project
// project.importFiles(['F:\\pictures\\a.jpg'], true, project.rootItem, true)
// pr启动的毫秒数
// AppLaunchMetrics.getProcessUpTime()
//渲染视频
//app.encoder.encodeSequence(sequence, 'C:\\Users\\Administrator\\Desktop\\pr_plugin\\samples\\out\\test1.mp4'
//     , 'C:\\Users\\Administrator\\Documents\\Adobe\\Adobe Media Encoder\\15.0\\Presets\\test.epr', 0, 0)
// app.encoder.startBatch()
// 当前使用的sequence
//app.project.activeSequence
//当前项目名
//app.project.name
//当前项目路径
//app.project.path
//当前素材文件根路径
//app.project.rootItem
//创建序列，阻塞，手动选择预设
//app.project.createNewSequence('hi','sequence_id')
//删除序列
//app.project.deleteSequence('hi')
//保存项目
//app.project.save()
//当前player光标位置
//qe.project.getActiveSequence().CTI.ticks
//测试时，允许快速加载
// app.setExtensionPersistent('com.adobe.PProPanel', 0);





// var project = app.project
// var sequence = project.activeSequence


// app.encoder.launchEncoder()

// app.encoder.encodeSequence(sequence,'C:\\Users\\Administrator\\Desktop\\pr_plugin\\samples\\out\\test1.mp4'
//     ,'C:\\Users\\Administrator\\Documents\\Adobe\\Adobe Media Encoder\\15.0\\Presets\\test.epr',0,0)

// app.encoder.startBatch()

// var project = app.project
// var project_items = project.rootItem.children

// app.encoder.encodeProjectItem(tmp_item, 'C:\\Users\\Administrator\\Desktop\\pr_plugin\\samples\\out\\test1.mp4'
//     , 'C:\\Users\\Administrator\\Documents\\Adobe\\Adobe Media Encoder\\15.0\\Presets\\test.epr', 0, 0)
// app.encoder.launchEncoder()



// app.encoder.startBatch()

// for (var i=0; i<project_items.length;i++){
//     var tmp_item = project_items[i]
//     alert(tmp_item.type.toString())
// app.encoder.encodeProjectItem(tmp_item, 'C:\\Users\\Administrator\\Desktop\\pr_plugin\\samples\\out\\test1.mp4'
//     , 'C:\\Users\\Administrator\\Documents\\Adobe\\Adobe Media Encoder\\15.0\\Presets\\test.epr', 0, 0)
// }

//app.anywhere.openProduction('C:\\Users\\Administrator\\Documents\\Adobe\\Premiere Pro\\15.0\\test.prproj')

//app.metadata.getMetadata
//app.metadata.addMarker('hello')
//app.metadata.setMarkerData('hi','yindahu')

//ClientInfo.application
//Component
//--------------------------------------------------
// var trackName = '视频 1'
// app.enableQE()



// var tmpActiveSequence = qe.project.getActiveSequence()
// if (trackName.split(' ')[0] == '视频') {
//     var tracksLength = tmpActiveSequence.numVideoTracks
//     for (var i = tracksLength - 1; i >= 0; i--) {
//         if (tmpActiveSequence.getVideoTrackAt(i).name == trackName) {
//             var trackItemLength = tmpActiveSequence.getVideoTrackAt(i).numItems
//             for (var j = trackItemLength - 1; j >= 0; j--) {
//                 var curCursorTicks = tmpActiveSequence.CTI.ticks
//                 var tmpItem = tmpActiveSequence.getVideoTrackAt(i).getItemAt(j)
//                 if (curCursorTicks >= tmpItem.start.ticks && curCursorTicks <= tmpItem.end.ticks) {
//                     tmpItem.remove()
//                 }

//             }

//         }
//     }

// } else {
//     if (trackName.split(' ')[0] == '音频') {
//         var tracksLength = tmpActiveSequence.numAudioTracks
//         for (var i = tracksLength - 1; i >= 0; i--) {
//             if (tmpActiveSequence.getAudioTrackAt(i).name == trackName) {
//                 var trackItemLength = tmpActiveSequence.getAudioTrackAt(i).numItems
//                 for (var j = trackItemLength - 1; j >= 0; j--) {
//                     var curCursorTicks = tmpActiveSequence.CTI.ticks
//                     var tmpItem = tmpActiveSequence.getAudioTrackAt(i).getItemAt(j)
//                     if (curCursorTicks >= tmpItem.start.ticks && curCursorTicks <= tmpItem.end.ticks) {
//                         tmpItem.remove()
//                     }
//                 }

//             }
//         }
//     }
// }




var tmpMatInfo='视频 1#3#2,3#1,3#0.3#D:\\vt_data\\matFilePath\\search.mp4'

app.project.importFiles(['D:\\vt_data\\matFilePath\\星辰大海.mp3'])





var tmpActiveSequence = qe.project.getActiveSequence()


var in_point = new Time()
in_point.seconds = 1
target_project_item.setInPoint(in_point)
var out_point = new Time()
out_point.seconds = 2
target_project_item.setEndTime(out_point)
app.project.activeSequence.videoTracks[0].insertClip(target_project_item,1)



var tmpClip = getTrackItemByName(trackName, tmpClipName)
        var tmpTrackItem = clip.projectItem.getVideoTrackItem(tmpClip);
        tmpTrackItem.enableTimeRemapping()
         for (var i = 0; i < tmpClip.components.numItems; i++) {
                    var tmpComponent = tmpClip.components[i]
                    $.write(tmpComponent.displayName)
                    if (tmpComponent.displayName == "Time Remapping") {
                        
                        for (var j = 0; j < tmpComponent.properties.numItems; j++) {
                        var tmpProperty = tmpComponent.properties[j];
                        if (tmpProperty.displayName == "Speed") {
                            tmpProperty.setValue(pointSpeed*100)
                        }
                    }
                
                    }
                }



                app.project.activeSequence.videoTracks[0].clips[0].components[0].properties[1].getValue()