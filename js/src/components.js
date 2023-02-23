//素材文件组件
const matFileComponent = Vue.extend({
    template: document.getElementById('matFileTemplate').innerHTML,
    mounted() {
        //初始化

        //同步实际素材文件与表中元数据，使其保持一致

        this.$axiosAsyncExec(
            '/vt/syncMatFileMetaData', {}, (res) => {}
        ).then(res => {
            return this.matFileUpdateSqlMenu()
        })


    },
    data() {
        return {
            //sql筛选项编辑框是否打开
            matFileHeaderEditDialogVisible: false,
            //sql筛选项
            matFileSqlMenuOptions: [],
            //sql筛选项当前选项
            matFileSqlMenuCurOption: '',
            //素材文件列表数据
            matFileTableData: [],
            //筛选对话框sql内容
            matFileHeaderEditDialogSqlText: '',
            //素材文件重命名弹窗style
            matFileRenameStyle: {
                'display': 'none',
                'z-index': '6000',
                'top': '0px',
                'left': '0px'

            },
            //素材文件重命名输入框文本
            matFileRenameText: '',
            //素材文件管理标签弹窗是否展示
            matFileManageTagsStyle: {
                'display': 'none',
                'z-index': '6000',
                'top': '0px',
                'left': '0px'

            },
            //素材文件当前标签
            matFileCurTags: [],
            //素材文件新增标签输入框是否展示
            matFileTagInputVisible: false,
            //素材文件新增标签输入框文本
            matFileTagInputValue: ''
        }
    },
    computed: {
        //sql筛选项当前对象
        matFileSqlMenuCurObj: {
            get: function () {
                return getJsonArrayObj(this.matFileSqlMenuOptions, 'label', this.matFileSqlMenuCurOption)
            }
        },
        //素材文件列表项右键菜单style
        matFileRClickMenuStyle: {
            get: function () {
                return this.$store.state.matFileRClickMenuStyle
            },
            set: function (value) {
                this.$store.state.matFileRClickMenuStyle = value
            }
        }

    },
    methods: {
        //更新素材文件筛选sql菜单
        matFileUpdateSqlMenu() {
            //获取素材文件筛选sql列表
            return this.$axiosAsyncExec(
                    '/vt/getSqlMenuOptions', {}, (res) => {
                        this.matFileSqlMenuOptions = res
                        this.matFileSqlMenuCurOption = this.matFileSqlMenuOptions[0]['label']
                    }
                )
                .then(
                    res => {
                        //更新素材文件列表
                        this.matFileUpdateList()
                    }
                )
        },
        //点击保存sql按钮触发
        matFileSaveSql() {
            this.matFileHeaderEditDialogVisible = false
            this.$axiosAsyncExec(
                '/vt/saveMatFileFilterSql', {
                    'label': this.matFileSqlMenuCurOption,
                    'value': this.matFileHeaderEditDialogSqlText
                }, (res) => {}
            ).then(res => {

                this.matFileSqlMenuCurObj['value'] = this.matFileHeaderEditDialogSqlText

                //更新素材文件列表
                return this.matFileUpdateList()

            }).then(res => {
                this.$vtNotify('success', '提示', '保存成功')
            })
        },
        //点击删除sql按钮触发
        matFileDelSql() {
            if (this.matFileSqlMenuCurOption == '默认') {
                this.$vtNotify('error', '错误', '不能删除[默认]sql筛选项')
            } else {
                this.matFileHeaderEditDialogVisible = false
                this.$axiosAsyncExec(
                    '/vt/delMatFileFilterSql', {
                        'label': this.matFileSqlMenuCurOption
                    }, (res) => {}
                ).then(res => {
                    return this.matFileUpdateSqlMenu()
                }).then(res => {
                    this.$vtNotify('success', '提示', '删除成功')
                })
            }


        },
        //素材文件sql筛选项变化时触发
        matFileSqlMenuChangeEvent(val) {
            //如果新增选项
            if (this.matFileSqlMenuCurObj == null) {
                var tmpNewItem = {
                    'label': this.matFileSqlMenuCurOption,
                    'value': `
select matfile_id as id,
matfile_type as type,
SUBSTRING_INDEX(matfile_full_path,"\\\\",-1) as matFileName, 
duration_second as durationSecond 
from vt.vt_matfile 
where false
order by create_time asc
                                `
                }
                this.matFileSqlMenuOptions.push(tmpNewItem)
            }
            //更新素材文件列表
            this.matFileUpdateList()

        },
        //素材文件sql编辑按钮点击触发
        matFileSqlEditButtonClick() {
            this.matFileHeaderEditDialogVisible = true
            this.matFileHeaderEditDialogSqlText = this.matFileSqlMenuCurObj['value']

        },
        //更新素材文件列表
        matFileUpdateList() {
            this.$axiosAsyncExec(
                '/vt/getSqlData', {
                    'sqlStr': this.matFileSqlMenuCurObj['value']
                }, (res) => {
                    this.matFileTableData = res
                }
            )

        },
        //删除当前素材文件
        matFileDelMatFile() {
            this.$axiosAsyncExec(
                '/vt/delMatFile', {
                    'matFileId': this.$store.state.matFileTableCurrentRow['id']
                }, (res) => {
                    this.$vtNotify('success', '提示', '删除成功')
                    //更新素材文件列表
                    this.matFileUpdateList()

                }
            )
        },
        //素材文件重命名点击触发
        matFileRename(event) {
            this.matFileRenameStyle.top = String(event.clientY) + 'px'
            this.matFileRenameStyle.left = String(event.clientX) + 'px'

            this.matFileRenameText = this.$store.state.matFileTableCurrentRow['matFileName']
            this.matFileRenameStyle.display = 'block'

        },
        //素材文件重命名取消时触发
        matFileRenameCancel() {
            this.matFileRenameStyle.display = 'none'
        },
        //素材文件重命名确定时触发
        matFileRenameConfirm() {
            this.$axiosAsyncExec(
                '/vt/renameMatFile', {
                    'matFileId': this.$store.state.matFileTableCurrentRow['id'],
                    'newName': this.matFileRenameText
                }, (res) => {
                    this.$vtNotify('success', '提示', '重命名成功')

                    this.matFileRenameStyle.display = 'none'
                    //更新素材文件列表
                    this.matFileUpdateList()

                }
            )
        },
        //素材文件管理标签点击触发
        matFileManageTags(event) {
            this.matFileManageTagsStyle.top = String(event.clientY) + 'px'
            this.matFileManageTagsStyle.left = String(event.clientX) + 'px'
            this.matFileManageTagsStyle.display = 'block'

            //获得当前素材文件的标签
            this.$axiosAsyncExec(
                '/vt/getMatFileTags', {
                    'matFileId': this.$store.state.matFileTableCurrentRow['id']
                }, (res) => {
                    this.matFileCurTags = res

                }
            )

        },
        //关闭素材文件标签触发
        matFileCloseTag(tag) {
            this.matFileCurTags.splice(this.matFileCurTags.indexOf(tag), 1);
        },
        //点击标签，展示素材文件标签新增输入框触发
        matFileTagShowInput() {
            this.matFileTagInputVisible = true;
            this.$nextTick(_ => {
                this.$refs.matFileTagInputRef.$refs.input.focus();
            });
        },
        //素材文件标签新增确认时触发
        matFileNewTagConfirm() {
            let inputValue = this.matFileTagInputValue;
            if (inputValue) {
                this.matFileCurTags.push(inputValue);
            }
            this.matFileTagInputVisible = false;
            this.matFileTagInputValue = '';
        },
        //素材文件标签管理取消时触发
        matFileManageTagCancel() {
            this.matFileManageTagsStyle.display = 'none'
        },
        //素材文件标签管理确定时触发
        matFileManageTagConfirm() {
            this.matFileManageTagsStyle.display = 'none'
            this.$axiosAsyncExec(
                '/vt/updateMatFileTags', {
                    'matFileId': this.$store.state.matFileTableCurrentRow['id'],
                    'tags': this.matFileCurTags.join()
                }, (res) => {
                    this.$store.state.matFileInfo.tags = this.matFileCurTags.join()
                    this.$vtNotify('success', '提示', '更新标签成功')

                }
            )
        },
        //当选中素材文件列表的某一项时触发
        matFileTableCurrentChange(val) {
            this.$refs.matFileListRef.setCurrentRow(val)
            this.$store.state.matFileTableCurrentRow = val
            this.$store.state.infoType = '素材文件'
            //清除打点信息
            this.$store.state.prePointedList = []
        },
        //当素材文件列表某一行右击时触发
        matFileTableRowRClickChange(row, column, event) {
            //右键点击也会有选中效果
            this.matFileTableCurrentChange(row)
            //显示右键菜单
            this.matFileRClickMenuStyle.top = String(event.clientY) + 'px'
            this.matFileRClickMenuStyle.left = String(event.clientX) + 'px'
            this.matFileRClickMenuStyle.display = 'block'

        }


    }
})



//预览组件
const preComponent = Vue.extend({
    template: document.getElementById('preTemplate').innerHTML,
    mounted() {
        //初始化


        //开启定时器，更新项目指针当前时间
        setInterval(this.updatePrTimeLineSecond, 500)

        //注册全局按钮事件，用于打点
        document.onkeydown = this.preKeyDown

    },
    methods: {
        //更新音频波形
        preUpdateAudioWave() {
            this.$nextTick(() => {
                var audioEle = document.getElementById('preAudio')
                if (audioEle == null) {
                    return
                }
                audioEle.innerHTML = ''
                //音频波形可视化实例
                this.preAudioWavesurfer = WaveSurfer.create({
                    container: '#preAudio',
                    waveColor: '#00FA9A',
                    progressColor: '#00BFBF',
                    backgroundColor: '#e9fff6',
                    barWidth: '1'
                })
                this.preAudioWavesurfer.on('finish', () => {
                    this.prePlay()
                })
                this.preAudioWavesurfer.load(this.$getMatFileUrl(this.matFileInfo['matfile_full_path']))
            })

        },
        //更新当前项目中的轨道
        preUpdateTraks() {
            var vts = []
            var ats = []
            this.$jsxExec('getProjectTracks', '视频', (data) => {
                vts = data.split(',')
                this.$jsxExec('getProjectTracks', '音频', (data) => {
                    ats = data.split(',')
                    this.preMainTrackOptions = vts.concat(ats)
                    this.preCurTrackOptions = vts.concat(ats)
                })
            })
        },
        //保存打点信息到素材
        preSave(isCommit) {
            if (this.prePointedListSorted.length < 2) {
                this.$vtNotify('error', '错误', '失败, 打点应该大等于2个')
                return
            }
            if (this.preMatMatchInfo && this.prePointedListSorted.length != this.preMatMatchInfo[1].split(',').length) {
                this.$vtNotify('error', '错误', '失败，打点个数不匹配')
                return
            }
            //轨道素材入点
            var tmpTrackMatInPointTime = 0
            //轨道素材点位列表
            var tmpTrackMatPointList = []

            //当前批次打点段
            var tmpPointTimeList = []
            //判断提交为自由点还是卡点
            if (this.preMatMatchInfo) {
                //卡点
                tmpTrackMatInPointTime = Math.min(...this.preMatMatchInfo[0].split(',').map(v => parseFloat(v)))
                tmpTrackMatPointList = this.preMatMatchInfo[1].split(',').map(v => parseFloat(v))
            } else {
                //自由点
                tmpTrackMatInPointTime = parseFloat(this.vtPrTimeLineSecond)
                tmpTrackMatPointList = this.prePointedListSorted.map(v=>v['pointSecond'])
            }
            var tmpPointType = this.prePointedListSorted[0]['type']
            for (let point_ind in this.prePointedListSorted) {
                var point = this.prePointedListSorted[point_ind]

                //自由点根据打点间隔插入轨道
                if (!this.preMatMatchInfo) {
                    tmpTrackMatPointList = tmpPointTimeList
                }

                tmpPointTimeList.push(point['pointSecond'])
                if (point['type'] != tmpPointType) {
                    //打点类型
                    tmpPointType = point['type']
                    //打点时长
                    var tmpDurationSeconds = Math.max(...tmpPointTimeList) - Math.min(...tmpPointTimeList)

                    //保存素材
                    if (!isCommit) {
                        if (this.$store.state.infoType == '素材文件') {
                            //插入素材信息
                            this.$axiosAsyncExec(
                                '/vt/insertMat', {
                                    'matType': this.matFileTableCurrentRow['type'],
                                    'matFileId': this.matFileTableCurrentRow['id'],
                                    'pointInfo': tmpPointTimeList.join()
                                }, (res) => {

                                    //更新素材列表数据
                                    this.$axiosAsyncExec(
                                        '/vt/getMatViaMatFile', {
                                            'matFileId': this.matFileTableCurrentRow['id']
                                        }, (res) => {
                                            this.$store.state.matTableData = res
                                        }
                                    )
                                }
                            )
                        }
                        if (this.$store.state.infoType == '素材') {
                            var tmpCurPointMatId = this.matTableCurrentRow['id']

                            //更新素材信息
                            this.$axiosAsyncExec(
                                '/vt/updateMat', {
                                    'matId': tmpCurPointMatId,
                                    'pointInfo': tmpPointTimeList.join()
                                }, (res) => {

                                }
                            )

                            //更新素材列表数据
                            this.$store.state.matTableData = this.matTableData.map(v => {
                                if (v['id'] == this.matTableCurrentRow['id']) {
                                    v['startTime'] = Math.min(...tmpPointTimeList)
                                    v['durationSecond'] = tmpDurationSeconds.toFixed(3)
                                    v['pointNum'] = tmpPointTimeList.length
                                }
                                return v
                            })

                        }
                    } 
                    //提交操作到pr
                    else {
                        var curType = {
                            '视频': '视频,音频',
                            '图片': '视频',
                            '音频': '音频'
                        } [this.matFileTableCurrentRow['type']]
                        if (!curType.includes(this.preCurTrackValue.split(' ')[0])) {
                            this.$vtNotify('error', '错误', '失败，当前轨道类型与素材类型不符')
                            return
                        }

                        //轨道match点位
                        var tmpTrackMatchInfo = []
                        var tmpDelta = 0
                        for (var matchPoint of tmpTrackMatPointList) {
                            tmpDelta = matchPoint - tmpTrackMatPointList[0]
                            tmpTrackMatchInfo.push((tmpTrackMatInPointTime + tmpDelta).toFixed(3))
                        }
                        tmpTrackMatInPointTime += tmpDelta
                        //当前毫秒时间戳
                        var tmpCurMilTimeStamp = (new Date().getTime()).toString()
                        //更新项目数据库
                        this.$axiosAsyncExec(
                            '/vt/insertProTrackMat', {
                                'proName': this.$store.state.vtTitle,
                                'trackName': this.preCurTrackValue,
                                'pointInfo': tmpPointTimeList.join(','),
                                'matfileFullPath': this.$store.state.matFileInfo['matfile_full_path'],
                                'matchPoint': tmpTrackMatchInfo.join(','),
                                'freePointSpeed': this.preFreePointSpeed,
                                'curTimeStamp': tmpCurMilTimeStamp
                            }, (res) => {

                            }
                        )
                        //开始插入轨道素材
                        var tmpPrInsertArgs = `${this.preCurTrackValue}#${tmpTrackMatchInfo.join(',')}#${tmpPointTimeList.join(',')}#${this.$store.state.matFileInfo['matfile_full_path']}#${this.preFreePointSpeed}#${tmpCurMilTimeStamp}`
                        this.$jsxExec('insertTrackMats', tmpPrInsertArgs.replace(/\\/g, '\\\\'), (data) => {

                        })
                        //修改项目轨道素材列表内存数据结构
                        var tmpMatList = this.$store.getters.preTrackMatList(this.preCurTrackValue)
                        tmpMatList.push([tmpTrackMatchInfo.join(','), tmpPointTimeList.join(','), this.$store.state.matFileInfo['matfile_full_path'], tmpCurMilTimeStamp])
                        //触发监听
                        var tmpMatListObj = {
                            ...this.$store.state.preTrackMatInfo
                        }
                        this.$store.state.preTrackMatInfo = tmpMatListObj
                    }
                    tmpPointTimeList = [point['pointSecond']]

                    if (this.$store.state.infoType == '素材') {
                        //素材只保留第一段
                        break
                    }
                }
            }

            //清空打点列表
            this.prePointedList = []
            if (isCommit) {
                this.$vtNotify('success', '提示', '轨道素材新增成功')
            } else {
                this.$vtNotify('success', '提示', '保存素材成功')
            }
        },
        //时间线向左移动
        preTimeLeft() {
            if (this.matFileTableCurrentRow['type'] == '音频') {
                var tmpDurationSeconds = this.preAudioWavesurfer.getDuration()
                var tmpProgress = (this.preAudioWavesurfer.getCurrentTime() - parseFloat(this.preTimeLeftValue)) / tmpDurationSeconds
                this.preAudioWavesurfer.seekTo(Math.max(Math.min(tmpProgress, 1), 0))

            }
            if (this.matFileTableCurrentRow['type'] == '视频') {
                var tmpDurationSeconds = this.$refs.preVideoRef.duration
                var tmpProgress = 100 * (this.$refs.preVideoRef.currentTime - parseFloat(this.preTimeLeftValue)) / tmpDurationSeconds
                this.preVideoSliderValue = Math.max(Math.min(tmpProgress, 100), 0)

            }
        },
        //时间线向右移动
        preTimeRight() {
            if (this.matFileTableCurrentRow['type'] == '音频') {
                var tmpDurationSeconds = this.preAudioWavesurfer.getDuration()
                var tmpProgress = (this.preAudioWavesurfer.getCurrentTime() + parseFloat(this.preTimeRightValue)) / tmpDurationSeconds
                this.preAudioWavesurfer.seekTo(Math.max(Math.min(tmpProgress, 1), 0))
            }
            if (this.matFileTableCurrentRow['type'] == '视频') {
                var tmpDurationSeconds = this.$refs.preVideoRef.duration
                var tmpProgress = 100 * (this.$refs.preVideoRef.currentTime + parseFloat(this.preTimeRightValue)) / tmpDurationSeconds
                this.preVideoSliderValue = Math.max(Math.min(tmpProgress, 100), 0)

            }
        },
        //播放按钮触发
        prePlay(event) {
            var mediaType = ''
            if (typeof (event) != 'string') {
                mediaType = this.matFileTableCurrentRow['type']
            } else {
                mediaType = event
            }
            this.prePlayStatus = 1 - this.prePlayStatus
            if (mediaType == '音频') {
                if (this.prePlayStatus == 1) {
                    //播放
                    this.preAudioWavesurfer.play()

                } else {
                    //暂停
                    this.preAudioWavesurfer.pause()

                }
            }
            if (mediaType == '视频') {
                if (this.prePlayStatus == 1) {
                    //播放
                    this.$refs.preVideoRef.play()

                } else {
                    //暂停
                    this.$refs.preVideoRef.pause()

                }
            }

        },
        //更新待匹配素材信息
        updateMatMatchInfo() {
            //清空打点列表
            this.prePointedList = []

            if (this.preMainTrackValue != '') {
                var tmpMatList = []
                if (this.$store.state.preTrackMatInfo && this.preCurTrackValue != this.preMainTrackValue) {
                    tmpMatList = this.$store.getters.preTrackMatList(this.preMainTrackValue)
                }
                if (!tmpMatList || tmpMatList.length == 0) {
                    this.preMatMatchInfo = null
                    return
                }
                //素材按创建时间倒序
                tmpMatList.sort((a, b) => {
                    return b[3] >= a[3]
                })
                for (let item_ind in tmpMatList) {
                    var item = tmpMatList[item_ind]
                    var tmpList = item[0].split(',').map(v => parseFloat(v))
                    var tmpStartTime = Math.min(...tmpList)
                    var tmpEndTime = Math.max(...tmpList)
                    if (this.vtPrTimeLineSecond <= tmpEndTime && this.vtPrTimeLineSecond >= tmpStartTime) {
                        this.preMatMatchInfo = item
                        return
                    }
                }
                this.preMatMatchInfo = null
            }
        },
        //更新项目指针当前时间
        updatePrTimeLineSecond() {
            this.$store.state.csInterface.evalScript("getTimeLineSecond(\"\")", (data) => {
                if (this.vtPrTimeLineSecond != data) {
                    this.vtPrTimeLineSecond = data
                }
            })
        },
        //删除打点触发
        preDelPoint(pointItem) {
            this.prePointedList.splice(getIndexOfArrayObj(this.prePointedList, pointItem), 1);
        },
        //按键按下，触发打点
        preKeyDown(event) {
            //屏蔽正在输入的情况
            var curFocusTag = document.activeElement.tagName
            if (curFocusTag == 'INPUT' || curFocusTag == 'TEXTAREA') {
                return
            }
            //确定打点时间
            var tmpTime = 0
            if (this.matFileTableCurrentRow['type'] == '视频') {
                tmpTime = parseFloat((this.preVideoSliderValue * this.$refs.preVideoRef.duration / 100).toFixed(3))
            } else if (this.matFileTableCurrentRow['type'] == '音频') {
                tmpTime = parseFloat((this.preAudioWavesurfer.getCurrentTime()).toFixed(3))
            } else {
                this.$vtNotify('error', '错误', '当前素材不支持打点')
                return
            }

            //控制打点间隔
            var tmpPointBef = -999
            var tmpFilterPointList = this.prePointedListSorted.map(v => parseFloat(v['pointSecond'])).filter(v => v <= tmpTime)
            if (tmpFilterPointList.length > 0) {
                var tmpPointBef = Math.max(...tmpFilterPointList)
            }

            if (tmpTime - tmpPointBef < 0.1 ) {
                this.$vtNotify('error', '错误', '失败，打点间隔必须大于0.1s')
                return
            }

            //入点
            if (event.keyCode == parseInt(this.$store.state.settingInPointHotKey)) {
                this.prePointedList.push({
                    'pointSecond': tmpTime,
                    'type': ''
                })
            }
            //出点
            if (event.keyCode == parseInt(this.$store.state.settingOutPointHotKey)) {
                this.prePointedList.push({
                    'pointSecond': tmpTime,
                    'type': 'success'
                })


            }
            this.$nextTick(function () {
                //滚动到底部
                this.$refs.vtRightScrollRef.scrollTop = this.$refs.vtRightScrollRef.scrollHeight
            })



        },
        //删除轨道素材
        preDelTrackMat() {
            //删除pr轨道素材 
            this.$jsxExec('delTrackMats', `${this.preCurTrackValue}#${this.preCursorOnTrackMat[3]}`, (data) => {

            })
            //数据库删除项目轨道素材信息
            this.$axiosAsyncExec(
                '/vt/delProTrackMat', {
                    'curTimeStamp': this.preCursorOnTrackMat[3],
                    'track': this.preCurTrackValue
                }, (res) => {
                    this.$vtNotify('success', '提示', '轨道素材删除成功')
                }
            )
            //删除项目轨道素材信息内存结构
            var tmpMatList = this.$store.getters.preTrackMatList(this.preCurTrackValue)
            tmpMatList = tmpMatList.splice(getIndexOfArrayObj(tmpMatList, this.preCursorOnTrackMat), 1)
            //触发监听
            var tmpMatListObj = {
                ...this.$store.state.preTrackMatInfo
            }
            this.$store.state.preTrackMatInfo = tmpMatListObj

        },
        //更新当前pr光标所处轨道的素材
        preUpdateCursorOnTrackMat() {
            if (!this.$store.state.preTrackMatInfo) {
                return
            }
            var tmpMatList = this.$store.getters.preTrackMatList(this.preCurTrackValue)
            if (!tmpMatList || tmpMatList.length == 0) {
                this.preCursorOnTrackMat = null
                return
            }
            //素材按创建时间倒序
            tmpMatList.sort((a, b) => {
                return b[3] >= a[3]
            })
            for (let item_ind in tmpMatList) {
                var item = tmpMatList[item_ind]
                var tmpList = item[0].split(',').map(v => parseFloat(v))
                var tmpStartTime = Math.min(...tmpList)
                var tmpEndTime = Math.max(...tmpList)
                if (this.vtPrTimeLineSecond <= tmpEndTime && this.vtPrTimeLineSecond >= tmpStartTime) {
                    this.preCursorOnTrackMat = item
                    return
                }
            }
            this.preCursorOnTrackMat = null
        },
        //滑块改变进度
        preSliderValueChangeClick(val) {
            if (this.matFileTableCurrentRow['type'] == '视频') {
                this.preVideoSliderValue = val / this.$refs.preVideoRef.duration * 100
            } else if (this.matFileTableCurrentRow['type'] == '音频') {
                var tmpDurationSeconds = this.preAudioWavesurfer.getDuration()
                var tmpProgress = val / tmpDurationSeconds
                this.preAudioWavesurfer.seekTo(Math.max(Math.min(tmpProgress, 1), 0))
            } else {
                return
            }
        },
        //打点标志提示
        prePointInfoTips(index){
            return this.preMatMatchInfo?this.preMatMatchInfo[0].split(',')[index]:''

        }

    },
    computed: {
        ...Vuex.mapState([
            // 素材文件-表格当前选项
            'matFileTableCurrentRow',
            // 素材文件-表格当前选项
            'matTableCurrentRow',
            // 当前素材文件信息
            'matFileInfo',
            //素材列表数据
            'matTableData',
            //当前轨道素材信息
            'preTrackMatInfo'
        ]),
        //播放按钮图标
        prePlayIco() {
            icoList = ['el-icon-video-play', 'el-icon-video-pause']
            return icoList[this.prePlayStatus]
        },
        //视频进度滑动条值
        preVideoSliderValueCompute: {
            set(value) {
                //计算出了视频时长，在执行
                if (this.preVideoSliderValueUpdateFlag && !(this.$refs.preVideoRef.duration != this.$refs.preVideoRef.duration)) {
                    this.$refs.preVideoRef.currentTime = Math.floor(value * 10 * this.$refs.preVideoRef.duration) / 1000
                } else {
                    this.preVideoSliderValueUpdateFlag = true
                }
                this.preVideoSliderValue = value
            },
            get() {
                return this.preVideoSliderValue
            }
        },
        //匹配点位是否完成状态列表
        preMatMatchPointIsFinish() {
            if (this.preMatMatchInfo) {
                var tmpPointArray = new Array(this.preMatMatchInfo[0].split(',').length).fill('')
                tmpPointArray = tmpPointArray.map((item, index) => index < this.prePointedListSorted.length ? 'success' : '')
                return tmpPointArray
            } else {
                return []
            }
        },
        //当前已打点列表排序
        prePointedListSorted() {
            return this.prePointedList.sort(function (a, b) {
                return a['pointSecond'] - b['pointSecond']
            })
        },
        //当前打点列表
        prePointedList: {
            set(value) {
                this.$store.state.prePointedList = value
            },
            get() {
                return this.$store.state.prePointedList
            }
        },
        //卡点变速
        preFreePointSpeed: {
            set(value) {
                this.$store.state.preFreePointSpeed = value
            },
            get() {
                return this.$store.state.preFreePointSpeed
            }
        }
    },
    data() {
        return {
            //音频波形渲染对象
            preAudioWavesurfer: null,
            //主轨道值
            preMainTrackValue: '',
            //主轨道选项
            preMainTrackOptions: [],
            //当前轨道值
            preCurTrackValue: '',
            //当前轨道选项
            preCurTrackOptions: [],
            //保存按钮style
            preSaveStyle: {
                display: 'block'
            },
            //当前播放状态，0暂停，1播放
            prePlayStatus: 0,
            //时间线左移量
            preTimeLeftValue: '0',
            //时间线右移量
            preTimeRightValue: '0',
            //视频进度条值
            preVideoSliderValue: 0,
            //是否可以更新视频进度条值
            preVideoSliderValueUpdateFlag: true,
            //当前项目指针停留时间
            vtPrTimeLineSecond: 0,
            //当前待匹配素材信息
            preMatMatchInfo: null,
            //pr光标停留的素材
            preCursorOnTrackMat: null



        }
    },
    watch: {
        matFileTableCurrentRow(curValue, oldValue) {
            //暂停播放
            if (this.prePlayStatus == 1) {
                this.prePlay(oldValue['type'])
            }
            //清除素材列表状态
            this.$store.state.matTableCurrentRow = null


            //素材文件id
            var tmpMatFileId = '-1'
            if (curValue) {
                tmpMatFileId = curValue['id'].toString()
            }
            //获得当前素材文件信息
            this.$axiosAsyncExec(
                '/vt/getMatFileInfo', {
                    'matFileId': tmpMatFileId
                }, (res) => {
                    this.$store.state.matFileInfo = res
                    if (curValue && curValue['type'] == '音频') {
                        this.preSaveStyle.display = 'block'
                        this.preUpdateAudioWave()

                        //更新当前项目中的轨道
                        this.preUpdateTraks()
                    }
                    if (curValue && curValue['type'] == '视频') {
                        this.preSaveStyle.display = 'block'
                        //初始化视频播放进度
                        this.preVideoSliderValue = 0
                        this.$nextTick(() => {
                            this.$refs.preVideoRef.onended = this.prePlay
                            this.$refs.preVideoRef.ontimeupdate = () => {
                                var tmpVedioObj = this.$refs.preVideoRef
                                if (tmpVedioObj.currentTime) {
                                    var tmpSliderValue = Math.floor(tmpVedioObj.currentTime * 100000 / tmpVedioObj.duration) / 1000
                                    this.preVideoSliderValueUpdateFlag = false
                                    this.preVideoSliderValue = tmpSliderValue

                                }
                            }
                        })

                    }
                    if (curValue && curValue['type'] == '图片') {
                        this.preSaveStyle.display = 'none'
                        //当素材文件类型为图片时，自动填充打点
                        if (this.preMatMatchInfo) {
                            var tmpPointList = []

                            var tmpMatchPointList = this.preMatMatchInfo[0].split(',').map(v => parseFloat(v))
                            for (let point_ind in tmpMatchPointList) {
                                var point = tmpMatchPointList[point_ind]
                                tmpPointList.push({
                                    'pointSecond': point - tmpMatchPointList[0],
                                    'type': point_ind == tmpMatchPointList.length - 1 ? 'success' : ''
                                })
                            }
                            this.prePointedList = tmpPointList
                        }
                    }
                }
            )


        },
        //主轨道值改变时触发
        preMainTrackValue(curValue, oldValue) {
            this.updateMatMatchInfo()

        },
        //当前轨道值改变时触发
        preCurTrackValue(curValue, oldValue) {
            this.preUpdateCursorOnTrackMat()
            this.updateMatMatchInfo()

        },
        //项目时间轴指针时间改变时触发
        vtPrTimeLineSecond(curValue, oldValue) {
            this.updateMatMatchInfo()
            this.preUpdateCursorOnTrackMat()

        },
        //项目轨道信息改变时触发
        preTrackMatInfo: {
            handler(newName, oldName) {
                this.updateMatMatchInfo()
                this.preUpdateCursorOnTrackMat()
            },
            deep: false
        }
    }
})

//信息组件
const infoComponent = Vue.extend({
    template: document.getElementById('infoTemplate').innerHTML,
    mounted() {
        //初始化

    },
    methods: {

    },
    data() {
        return {}
    },
    computed: {
        ...Vuex.mapState([
            // 当前素材文件信息
            'matFileInfo',
            // 当前素材信息
            'matInfo',
            // 当前信息展示类型
            'infoType'
        ])
    }
})

//素材组件
const matComponent = Vue.extend({
    template: document.getElementById('matTemplate').innerHTML,
    mounted() {
        //初始化

    },
    computed: {
        ...Vuex.mapState([
            // 素材文件-表格当前选项
            'matFileTableCurrentRow',
            // 素材-表格当前选项
            'matTableCurrentRow'
        ]),
        //素材列表项右键菜单style
        matRClickMenuStyle: {
            get: function () {
                return this.$store.state.matRClickMenuStyle
            },
            set: function (value) {
                this.$store.state.matRClickMenuStyle = value
            }
        },
        //素材列表数据
        matTableData: {
            get: function () {
                return this.$store.state.matTableData
            },
            set: function (value) {
                this.$store.state.matTableData = value
            }
        },
        //素材列表数据排序
        matTableDataSorted() {
            return this.matTableData.sort(function (a, b) {
                return a['startTime'] - b['startTime']
            })
        }
    },
    watch: {
        //素材文件-表格当前选项
        matFileTableCurrentRow(curValue, oldValue) {
            //更新素材列表
            this.matUpdateList()


        },
        //素材-表格当前选项
        matTableCurrentRow(curValue, oldValue) {


        }
    },
    methods: {
        //删除当前素材
        matDelMat() {
            this.$axiosAsyncExec(
                '/vt/delMat', {
                    'matId': this.$store.state.matTableCurrentRow['id']
                }, (res) => {
                    this.$vtNotify('success', '提示', '删除成功')
                    //更新素材列表
                    this.matUpdateList()

                }
            )
        },
        //更新素材列表
        matUpdateList() {
            var tmpMatFileId = '-1'
            if (this.matFileTableCurrentRow) {
                tmpMatFileId = this.matFileTableCurrentRow['id']
            }
            this.$axiosAsyncExec(
                '/vt/getMatViaMatFile', {
                    'matFileId': tmpMatFileId
                }, (res) => {
                    this.matTableData = res
                }
            )

        },
        //素材管理标签点击触发
        matManageTags(event) {
            this.matManageTagsStyle.bottom = String(innerHeight - event.clientY) + 'px'
            this.matManageTagsStyle.right = String(innerWidth - event.clientX) + 'px'
            this.matManageTagsStyle.display = 'block'

            //获得当前素材的标签
            this.$axiosAsyncExec(
                '/vt/getMatTags', {
                    'matId': this.$store.state.matTableCurrentRow['id']
                }, (res) => {
                    this.matCurTags = res

                }
            )

        },
        //关闭素材标签触发
        matCloseTag(tag) {
            this.matCurTags.splice(this.matCurTags.indexOf(tag), 1);
        },
        //点击标签，展示素材标签新增输入框触发
        matTagShowInput() {
            this.matTagInputVisible = true;
            this.$nextTick(_ => {
                this.$refs.matTagInputRef.$refs.input.focus();
            });
        },
        //素材标签新增确认时触发
        matNewTagConfirm() {
            let inputValue = this.matTagInputValue;
            if (inputValue) {
                this.matCurTags.push(inputValue);
            }
            this.matTagInputVisible = false;
            this.matTagInputValue = '';
        },
        //素材标签管理取消时触发
        matManageTagCancel() {
            this.matManageTagsStyle.display = 'none'
        },
        //素材标签管理确定时触发
        matManageTagConfirm() {
            this.matManageTagsStyle.display = 'none'
            this.$axiosAsyncExec(
                '/vt/updateMatTags', {
                    'matId': this.$store.state.matTableCurrentRow['id'],
                    'tags': this.matCurTags.join()
                }, (res) => {
                    this.$store.state.matInfo.tags = this.matCurTags.join()
                    this.$vtNotify('success', '提示', '更新标签成功')

                }
            )
        },
        //当选中素材列表的某一项时触发
        matTableCurrentChange(val) {
            this.$refs.matListRef.setCurrentRow(val)
            this.$store.state.matTableCurrentRow = val
            this.$store.state.infoType = '素材'
            //素材id
            var tmpMatId = val['id'].toString()

            //获得当前素材信息
            this.$axiosAsyncExec(
                '/vt/getMatInfo', {
                    'matId': tmpMatId
                }, (res) => {
                    this.$store.state.matInfo = res
                    //改变打点信息
                    this.$store.state.prePointedList = this.$store.state.matInfo['point_info'].split(',')
                        .map((v, i, a) => {
                            return {
                                'pointSecond': parseFloat(v),
                                'type': i == a.length - 1 ? 'success' : ''
                            }
                        })
                })
        },
        //当素材列表某一行右击时触发
        matTableRowRClickChange(row, column, event) {
            //右键点击也会有选中效果
            this.matTableCurrentChange(row)
            //显示右键菜单
            this.matRClickMenuStyle.bottom = String(innerHeight - event.clientY) + 'px'
            this.matRClickMenuStyle.right = String(innerWidth - event.clientX) + 'px'
            this.matRClickMenuStyle.display = 'block'
        }

    },
    data() {
        return {

            //筛选对话框sql内容
            matHeaderEditDialogSqlText: '',
            //素材管理标签弹窗是否展示
            matManageTagsStyle: {
                'display': 'none',
                'z-index': '6000',
                'bottom': '0px',
                'right': '0px'

            },
            //素材当前标签
            matCurTags: [],
            //素材新增标签输入框是否展示
            matTagInputVisible: false,
            //素材新增标签输入框文本
            matTagInputValue: ''
        }
    }
})


//设置组件
const settingComponent = Vue.extend({
    template: document.getElementById('settingTemplate').innerHTML,
    mounted() {
        //初始化

        //获取设置选项

        this.$axiosAsyncExec(
            '/vt/getSettingProperties', {}, (res) => {
                var settingProperties = res
                //初始化配置
                this.$store.state.settingMatFilePath = settingProperties.settingMatFilePath
                this.$store.state.settingInPointHotKey = settingProperties.settingInPointHotKey
                this.$store.state.settingOutPointHotKey = settingProperties.settingOutPointHotKey
                this.$store.state.settingMogrtPath = settingProperties.settingMogrtPath
            }
        )
    },
    methods: {
        //更新配置
        settingUpdateProperty(value, key) {
            eval(`this.$store.state.${key} = value`)
        },
        //设置选项值改变时触发更新
        settingChangeSettingValue(key) {
            eval(`var value = this.${key}`)

            this.$axiosAsyncExec(
                '/vt/setSettingProperty', {
                    'key': key,
                    'value': value
                }, (res) => {
                    this.$vtNotify('success', '提示', '设置更新成功')
                })
        }

    },
    data() {
        return {
            //设置面板是否展开
            settingDialogVisible: false

        }
    },
    computed: {
        settingMatFilePath: {
            set: function (value) {
                this.settingUpdateProperty(value, 'settingMatFilePath')
            },
            get: function () {
                return this.$store.state.settingMatFilePath
            }
        },
        settingMogrtPath: {
            set: function (value) {
                this.settingUpdateProperty(value, 'settingMogrtPath')
            },
            get: function () {
                return this.$store.state.settingMogrtPath
            }
        },
        settingInPointHotKey: {
            set: function (value) {
                this.settingUpdateProperty(value, 'settingInPointHotKey')
            },
            get: function () {
                return this.$store.state.settingInPointHotKey
            }
        },
        settingOutPointHotKey: {
            set: function (value) {
                this.settingUpdateProperty(value, 'settingOutPointHotKey')
            },
            get: function () {
                return this.$store.state.settingOutPointHotKey
            }
        }
    }
})

//vt组件
const vtComponent = Vue.extend({
    template: document.getElementById('vt').innerHTML,
    data() {
        return {

            //异步处理状态时提示信息
            vtLoadingText: '...'
        }

    },
    methods: {
        //根据数据库的数据重做项目
        vtRedoAllTrack() {
            //获取项目各轨道信息
            this.$axiosAsyncExec(
                '/vt/getProjectTrackInfo', {
                    'proName': this.$store.state.vtTitle
                }, (res) => {
                    this.$store.state.preTrackMatInfo = res
                    //拼接轨道素材信息参数
                    var trackMatInfoArgs = []
                    for (let key in this.$store.state.preTrackMatInfo) {
                        var val = this.$store.state.preTrackMatInfo[key]
                        for (let item of val) {
                            trackMatInfoArgs.push([item[3], `${key}#${item[0]}#${item[1]}#${item[2]}#${item[4]}#${item[3]}`])
                        }
                    }
                    this.$jsxExec('cleanProject', '', (data) => {
                        if (trackMatInfoArgs.length != 0) {
                            this.$jsxExec('insertTrackMats', trackMatInfoArgs.sort().map(v => v[1])
                                .join('|')
                                .replace(/\\/g, '\\\\'), (data) => {

                                })
                        }
                    })

                    this.$vtNotify('success', '提示', '重做成功')
                })



        }
    },
    computed: {
        //此刻是否为异步处理状态
        vtIsLoading: {
            get: function () {
                if (this.vtAsyncTaskNum > 0) {
                    return true
                } else {
                    return false
                }
            }
        },
        //项目标题
        vtTitle: {
            get: function () {
                return this.$store.state.vtTitle
            },
            set: function (value) {
                this.$store.state.vtTitle = value
            }
        },
        ...Vuex.mapState([
            // 异步等待任务数量
            'vtAsyncTaskNum'
        ])

    },
    mounted() {
        //初始化
        //获取项目名
        this.$jsxExec('getProjectName', '', (data) => {
            this.vtTitle = data
            //获取项目各轨道信息
            this.$axiosAsyncExec(
                '/vt/getProjectTrackInfo', {
                    'proName': this.$store.state.vtTitle
                }, (res) => {
                    this.$store.state.preTrackMatInfo = res
                })
        })
        //启动文件web服务
        this.$axiosAsyncExec(
            '/vt/startFileWebServer', {}, (res) => {

            })

    },
    components: {
        settingcomponent: settingComponent,
        matfilecomponent: matFileComponent,
        matcomponent: matComponent,
        precomponent: preComponent,
        infocomponent: infoComponent
    }
})