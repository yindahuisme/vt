//素材文件组件
const matFileComponent = Vue.extend({
    template: document.getElementById('matFileTemplate').innerHTML,
    mounted() {
        //初始化
        console.log('初始化素材文件组件')

        //同步实际素材文件与表中元数据，使其保持一致
        console.log('api:同步实际素材文件与表中元数据')
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
                this.$store.state.matFileRClickMenuStyle=value
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
                    this.$vtNotify('success', '提示', '更新标签成功')

                }
            )
        },
        //当选中素材文件列表的某一项时触发
        matFileTableCurrentChange(val) {
            this.$store.state.matFileTableCurrentRow = val
        },
        //当素材文件列表某一行右击时触发
        matFileTableRowRClickChange(row, column, event) {
            //右键点击也会有选中效果
            this.$refs.matFileListRef.setCurrentRow(row)
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
        console.log('初始化预览组件')
        //获取项目各轨道信息
        this.$axiosAsyncExec(
            '/vt/getProjectTrackInfo', {
                'proName': this.$store.state.vtTitle
            }, (res) => {
                this.$store.state.vtTrackMatInfo = res
            })
        //开启定时器，更新项目指针当前时间
        setInterval(this.updatePrTimeLineSecond, 500)

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
                    if (this.matFileTableCurrentRow.type == '视频' || this.matFileTableCurrentRow.type == '图片') {
                        this.preCurTrackOptions = vts
                    } else if (this.matFileTableCurrentRow.type == '音频') {
                        this.preCurTrackOptions = ats
                    } else {
                        this.preCurTrackOptions = []
                    }
                })
            })
        },
        //保存
        preSave() {

        },
        //提交
        preCommit() {

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
            if (this.preMainTrackValue != '') {
                var tmpMatList = this.$store.state.vtTrackMatInfo[this.preMainTrackValue]
                if (typeof (tmpMatList) == 'undefined') {
                    tmpMatList = []
                }
                var tmpMatListFilter = tmpMatList.filter(item => parseFloat(item[0]) <= this.vtPrTimeLineSecond)

                var tmpMatItem = []
                tmpMatListFilter.forEach(item => tmpMatItem = tmpMatItem.length == 0 || parseFloat(item[0]) > parseFloat(tmpMatItem[0]) ? item : tmpMatItem)

                if (tmpMatItem.length == 0) {
                    this.preMatMatchInfo = {}
                } else {
                    //获取素材信息，更新待匹配素材信息
                    this.$axiosAsyncExec(
                        '/vt/getMatInfo', {
                            'matId': tmpMatItem[1].toString()
                        }, (res) => {
                            this.preMatMatchInfo = res

                        })

                }

            }
        },
        //更新项目指针当前时间
        updatePrTimeLineSecond() {
            this.$store.state.csInterface.evalScript("getTimeLineSecond(\"\")", (data) => {
                if (this.vtPrTimeLineSecond != data) {
                    this.vtPrTimeLineSecond = data
                }

            })
        }
    },
    computed: {
        ...Vuex.mapState([
            // 素材文件-表格当前选项
            'matFileTableCurrentRow',
            // 当前素材文件信息
            'matFileInfo'
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
        //待匹配点位信息
        preMatMatchPointInfo() {
            if (typeof (this.preMatMatchInfo['pointInfo']) != 'undefined') {
                var tmpPointArray = new Array(this.preMatMatchInfo['pointInfo'].length)
                tmpPointArray.map((item, index) => index < this.prePointedList.length ? 'success' : '')
                return tmpPointArray
            } else {
                return []
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
            //当前待匹配素材信息
            preMatMatchInfo: {},
            //当前项目时间线指针当前停留时间
            vtPrTimeLineSecond: 0,
            //当前已打点列表
            prePointedList: []



        }
    },
    watch: {
        matFileTableCurrentRow(curValue, oldValue) {
            //暂停播放
            if (this.prePlayStatus == 1) {
                this.prePlay(oldValue['type'])
            }
            //判断特使情况异常赋值
            if (!curValue) {
                this.$store.state.matFileTableCurrentRow = {}

                this.$store.state.infoType = ''
                return
            }

            if (typeof (curValue['id']) != 'undefined') {
                this.$store.state.infoType = '素材文件'
                //获得当前素材文件信息
                this.$axiosAsyncExec(
                    '/vt/getMatFileInfo', {
                        'matFileId': curValue['id'].toString()
                    }, (res) => {
                        this.$store.state.matFileInfo = res
                        if (curValue['type'] == '音频') {
                            this.preSaveStyle.display = 'block'
                            this.preUpdateAudioWave()

                            //更新当前项目中的轨道
                            this.preUpdateTraks()
                        }
                        if (curValue['type'] == '视频') {
                            this.preSaveStyle.display = 'block'
                            //初始化视频播放进度
                            this.preVideoSliderValue = 0
                            this.$nextTick(() => {
                                this.$refs.preVideoRef.onended = this.prePlay
                                this.$refs.preVideoRef.ontimeupdate = () => {
                                    var tmpVedioObj = this.$refs.preVideoRef
                                    if (tmpVedioObj) {
                                        var tmpSliderValue = Math.floor(this.$refs.preVideoRef.currentTime * 100000 / this.$refs.preVideoRef.duration) / 1000
                                        this.preVideoSliderValueUpdateFlag = false
                                        this.preVideoSliderValue = tmpSliderValue

                                    }
                                }
                            })

                        }
                        if (curValue['type'] == '图片') {
                            this.preSaveStyle.display = 'none'

                        }
                    }
                )
            }


        },
        //主轨道值改变时触发
        preMainTrackValue() {
            this.updateMatMatchInfo()

        },
        //项目时间轴指针时间改变时触发
        vtPrTimeLineSecond() {
            this.updateMatMatchInfo()

        }
    }
})

//详情组件
const infoComponent = Vue.extend({
    template: document.getElementById('infoTemplate').innerHTML,
    mounted() {
        //初始化
        console.log('初始化详情组件')
    },
    methods: {

    },
    data() {
        return {}
    },
    computed: {
        ...Vuex.mapState([
            // 素材文件-表格当前选项
            'matFileTableCurrentRow',
            // 当前素材文件信息
            'matFileInfo',
            // 当前详情展示类型
            'infoType'
        ])
    }
})

//素材组件
const matComponent = Vue.extend({
    template: document.getElementById('matTemplate').innerHTML,
    mounted() {
        //初始化
        console.log('初始化素材组件')
    },
    computed:{
        //素材列表项右键菜单style
        matRClickMenuStyle: {
            get: function () {
                return this.$store.state.matRClickMenuStyle
            },
            set: function (value) {
                this.$store.state.matRClickMenuStyle=value
            }
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
        //更新素材列表 todo
        matUpdateList() {
            this.$axiosAsyncExec(
                '/vt/getSqlData', {
                    'sqlStr': this.matSqlMenuCurObj['value']
                }, (res) => {
                    this.matTableData = res
                }
            )

        },
        //素材重命名点击触发
        matRename(event) {
            this.matRenameStyle.top = String(event.clientY) + 'px'
            this.matRenameStyle.left = String(event.clientX) + 'px'

            this.matRenameText = this.$store.state.matTableCurrentRow['matName']
            this.matRenameStyle.display = 'block'

        },
        //素材重命名取消时触发
        matRenameCancel() {
            this.matRenameStyle.display = 'none'
        },
        //素材重命名确定时触发
        matRenameConfirm() {
            this.$axiosAsyncExec(
                '/vt/renameMat', {
                    'matId': this.$store.state.matTableCurrentRow['id'],
                    'newName': this.matRenameText
                }, (res) => {
                    this.$vtNotify('success', '提示', '重命名成功')

                    this.matRenameStyle.display = 'none'
                    //更新素材列表
                    this.matUpdateList()

                }
            )
        },
        //素材管理标签点击触发
        matManageTags(event) {
            this.matManageTagsStyle.top = String(event.clientY) + 'px'
            this.matManageTagsStyle.left = String(event.clientX) + 'px'
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
                    this.$vtNotify('success', '提示', '更新标签成功')

                }
            )
        },
        //当选中素材列表的某一项时触发
        matTableCurrentChange(val) {
            this.$store.state.matTableCurrentRow = val
        },
        //当素材列表某一行右击时触发
        matTableRowRClickChange(row, column, event) {
            //右键点击也会有选中效果
            this.$refs.matListRef.setCurrentRow(row)
            //显示右键菜单
            this.matRClickMenuStyle.top = String(event.clientY) + 'px'
            this.matRClickMenuStyle.left = String(event.clientX) + 'px'
            this.matRClickMenuStyle.display = 'block'

        }

    },
    data() {
        return {
            //素材列表数据
            matTableData: [],
            //筛选对话框sql内容
            matHeaderEditDialogSqlText: '',
            //素材管理标签弹窗是否展示
            matManageTagsStyle: {
                'display': 'none',
                'z-index': '6000',
                'top': '0px',
                'left': '0px'

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
        console.log('初始化设置组件')
        //获取设置选项
        console.log('api:获取配置表的值')
        this.$axiosAsyncExec(
            '/vt/getSettingProperties', {}, (res) => {
                var settingProperties = res
                //初始化配置
                this.$store.state.settingMatFilePath = settingProperties.settingMatFilePath
                this.$store.state.settingFreePointSecond = settingProperties.settingFreePointSecond
                this.$store.state.settingInPointHotKey = settingProperties.settingInPointHotKey
                this.$store.state.settingOutPointHotKey = settingProperties.settingOutPointHotKey
                this.$store.state.settingPointHotKey = settingProperties.settingPointHotKey
                this.$store.state.settingTransformEffectValue = settingProperties.settingTransformEffectValue
                this.$store.state.settingTransformEffectOptions = settingProperties.settingTransformEffectOptions.split(',')
                this.$store.state.settingTransformEffectMs = settingProperties.settingTransformEffectMs
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
            console.log(`api:更新配置：${key}=${value}`)
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
        settingFreePointSecond: {
            set: function (value) {
                this.settingUpdateProperty(value, 'settingFreePointSecond')
            },
            get: function () {
                return this.$store.state.settingFreePointSecond
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
        },
        settingPointHotKey: {
            set: function (value) {
                this.settingUpdateProperty(value, 'settingPointHotKey')
            },
            get: function () {
                return this.$store.state.settingPointHotKey
            }
        },
        settingTransformEffectValue: {
            set: function (value) {
                this.settingUpdateProperty(value, 'settingTransformEffectValue')
            },
            get: function () {
                return this.$store.state.settingTransformEffectValue
            }
        },
        settingTransformEffectOptions: {
            set: function (value) {
                this.settingUpdateProperty(value, 'settingTransformEffectOptions')
            },
            get: function () {
                return this.$store.state.settingTransformEffectOptions
            }
        },
        settingTransformEffectMs: {
            set: function (value) {
                this.settingUpdateProperty(value, 'settingTransformEffectMs')
            },
            get: function () {
                return this.$store.state.settingTransformEffectMs
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