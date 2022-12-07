

//素材文件组件
const matFileComponent = Vue.extend({
    template: document.getElementById('matFileTemplate').innerHTML,
    mounted() {
        //初始化
        console.log('初始化素材文件组件')
        
        window.onclick=()=>{
            // 点击事件关闭菜单
            this.matFileRClickMenuStyle.display='none'
        }
        
        //同步实际素材文件与表中元数据，使其保持一致
        console.log('api:同步实际素材文件与表中元数据')
        this.$axiosAsyncExec(
            '/vt/syncMetFileMetaData', {}, (res) => {
            }
        ).then(res => {
            //获取素材文件筛选sql列表
            return this.$axiosAsyncExec(
                '/vt/getSqlMenuOptions', {}, (res) => {
                    this.matFileSqlMenuOptions = res
                    this.matFileSqlMenuCurOption = this.matFileSqlMenuOptions[0]['label']
                }
            )
        }
        ).then(
            res =>{
                //更新素材文件列表
                this.matFileUpdateList()
            }
        )


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
            matFileBodyTableData: [],
            //筛选对话框sql内容
            matFileHeaderEditDialogSqlText: '',
            //素材文件列表项右键菜单style
            matFileRClickMenuStyle:{
                'display': 'none',
                'z-index':'5000',
                'top':'0px',
                'left':'0px'
            }
        }
    },
    computed: {
        //sql筛选项当前对象
        matFileSqlMenuCurObj: {
            get: function () {
                return getJsonArrayObj(this.matFileSqlMenuOptions,'label',this.matFileSqlMenuCurOption) 
            }
        }
        
    },
    methods: {

        
        //当选中素材文件列表的某一项时触发
        matFileBodyTableHandleCurrentChange(val) {
            this.$store.state.matFileBodyTableCurrentRow=val
        },
        //当素材文件列表某一行右击时触发
        matFileBodyTableRowRClickChange(row,column,event){
            //右键点击也会有选中效果
            this.$refs.matFileListRef.setCurrentRow(row)
            //显示右键菜单
            this.matFileRClickMenuStyle.top=String(event.clientY)+'px'
            this.matFileRClickMenuStyle.left=String(event.clientX)+'px'
            this.matFileRClickMenuStyle.display='block'

        },
        //动态确定素材列表类型
        matFileBodyTableRowClassName({
            row
        }) {
            if (row.type == '视频') {
                return 'vedio'
            } else if (row.type == '音频') {
                return 'audio'
            } else if (row.type == '图片') {
                return 'picture'
            } else {
                return ''
            }

        },
        //点击保存sql按钮触发
        matFileSaveSql(){
            this.matFileHeaderEditDialogVisible = false
            this.$axiosAsyncExec(
                '/vt/saveMetFileFilterSql', {'label':this.matFileSqlMenuCurOption,'value':this.matFileHeaderEditDialogSqlText}, (res) => {
                }
            ).then(res => {
               
                this.matFileSqlMenuCurObj['value'] = this.matFileHeaderEditDialogSqlText

                //更新素材文件列表
                return this.matFileUpdateList()

            }
            ).then(res =>{
                this.$vtNotify('success','提示','保存成功')
            }
            )
        },
        //点击删除sql按钮触发
        matFileDelSql(){
            this.matFileHeaderEditDialogVisible = false

            this.$axiosAsyncExec(
                '/vt/delMetFileFilterSql', {'label':this.matFileSqlMenuCurOption}, (res) => {
                }
            ).then(res => {
                this.matFileSqlMenuOptions.forEach((item,index,arr) => {
                    if(item['label'] == this.matFileSqlMenuCurOption){
                        arr.splice(index,1)
                    }
                })

                this.matFileSqlMenuCurOption = this.matFileSqlMenuOptions[0]['label']
                //更新素材文件列表
                return this.matFileUpdateList()

            }
            ).then(res =>{
                this.$vtNotify('success','提示','删除成功')
            }
            )
            
        },
        //更新素材文件列表
        matFileUpdateList(){
            this.$axiosAsyncExec(
                '/vt/getSqlData', {'sqlStr':this.matFileSqlMenuCurObj['value']}, (res) => {
                    this.matFileBodyTableData = res
                }
            )
            
        },
        //素材文件sql筛选项变化时触发
        matFileSqlMenuChangeEvent(val){
            //如果新增选项
            if (this.matFileSqlMenuCurObj === null){
                var tmpNewItem = {'label':this.matFileSqlMenuCurOption,'value':`
select matfile_id as id,
matfile_type as type,
SUBSTRING_INDEX(matfile_full_path,"\\\\",-1) as matFileName, 
duration_second as durationSecond 
from vt.vt_matfile 
where false
order by create_time asc
                                `}
                this.matFileSqlMenuOptions.push(tmpNewItem)
            }
            //更新素材文件列表
            this.matFileUpdateList()

        },
        //素材文件sql编辑按钮点击触发
        matFileSqlEditButtonClick(){
            this.matFileHeaderEditDialogVisible = true
            this.matFileHeaderEditDialogSqlText =this.matFileSqlMenuCurObj['value']

        },
        //删除当前素材文件
        matFileDelMatFile(){
            this.$axiosAsyncExec(
                '/vt/delMatFile', {'matFileId':this.$store.state.matFileBodyTableCurrentRow['id']}, (res) => {
                    this.$vtNotify('success','提示','删除成功')
                }
            )
        }


    }
})



//预览组件
const preComponent = Vue.extend({
    template: document.getElementById('preTemplate').innerHTML,
    mounted() {
        //初始化
        console.log('初始化预览组件')
        //this.$nextTick(() => {

        //        document.getElementById('preAudio').innerHTML = ''
        //        //音频波形可视化实例
        //        this.wavesurfer = WaveSurfer.create({
        //            container: '#preAudio',
        //            waveColor: '#00FA9A',
        //            progressColor: '#00BFBF',
        //            backgroundColor: '#e9fff6',
        //            barWidth: '1'
        //        })
        //        this.preAudioWavesurfer.load('/matfile/a.mp3')


        //})

        //window.onresize=
        //    function(){
        //        console.log('resize')
        //        document.getElementById('preAudio').innerHTML = ''
        //        //音频波形可视化实例
        //        this.wavesurfer = WaveSurfer.create({
        //            container: '#preAudio',
        //            waveColor: '#00FA9A',
        //            progressColor: '#00BFBF',
        //            backgroundColor: '#e9fff6',
        //            barWidth: '1'
        //        })
        //        this.preAudioWavesurfer.load('/matfile/a.mp3')
        //    }

    },
    methods: {

    },
    computed: {
        ...Vuex.mapState([
            // 素材文件-表格默认选项
            'matFileBodyTableCurrentRow'
        ])
    },
    data() {
        return {

            preAudioWavesurfer: null
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
        return {

        }
    }
})

//素材组件
const matComponent = Vue.extend({
    template: document.getElementById('matTemplate').innerHTML,
    mounted() {
        //初始化
        console.log('初始化素材组件')
    },
    methods: {


    },
    data() {
        return {

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
                this.$store.state.settingFreePointMs = settingProperties.settingFreePointMs
                this.$store.state.settingInPointHotKey = settingProperties.settingInPointHotKey
                this.$store.state.settingSpeedPointHotKey = settingProperties.settingSpeedPointHotKey
                this.$store.state.settingOutPointHotKey = settingProperties.settingOutPointHotKey
                this.$store.state.settingTransformEffectValue = settingProperties.settingTransformEffectValue
                this.$store.state.settingTransformEffectOptions = settingProperties.settingTransformEffectOptions.split(',')
                this.$store.state.settingTransformEffectMs = settingProperties.settingTransformEffectMs
                this.$store.state.settingMogrtPath = settingProperties.settingMogrtPath
            }
        )
    },
    methods: {
        //更新配置
        settingUpdateProperty(value,key){
            eval(`this.$store.state.${key} = value` )
            },
        //设置选项值改变时触发更新
        settingChangeSettingValue(key){
            eval(`var value = this.${key}`)
            console.log(`api:更新配置：${key}=${value}`)
            this.$axiosAsyncExec(
                '/vt/setSettingProperty', {'key':key,'value':value}, (res) => {
        })
        }
    
    },
    data() {
        return {
            //设置面板是否展开
            settingDialogVisible:false

        }
    },
    computed:{
        settingMatFilePath:{
            set:function(value){ this.settingUpdateProperty(value,'settingMatFilePath')},
            get:function() {return this.$store.state.settingMatFilePath}
        },
        settingMogrtPath:{
            set:function(value){ this.settingUpdateProperty(value,'settingMogrtPath')},
            get:function() {return this.$store.state.settingMogrtPath}
        },
        settingFreePointMs:{
            set:function(value){ this.settingUpdateProperty(value,'settingFreePointMs')},
            get:function() {return this.$store.state.settingFreePointMs}
        },
        settingInPointHotKey:{
            set:function(value){ this.settingUpdateProperty(value,'settingInPointHotKey')},
            get:function() {return this.$store.state.settingInPointHotKey}
        },
        settingSpeedPointHotKey:{
            set:function(value){ this.settingUpdateProperty(value,'settingSpeedPointHotKey')},
            get:function() {return this.$store.state.settingSpeedPointHotKey}
        },
        settingOutPointHotKey:{
            set:function(value){ this.settingUpdateProperty(value,'settingOutPointHotKey')},
            get:function() {return this.$store.state.settingOutPointHotKey}
        },
        settingTransformEffectValue:{
            set:function(value){ this.settingUpdateProperty(value,'settingTransformEffectValue')},
            get:function() {return this.$store.state.settingTransformEffectValue}
        },
        settingTransformEffectOptions:{
            set:function(value){ this.settingUpdateProperty(value,'settingTransformEffectOptions')},
            get:function() {return this.$store.state.settingTransformEffectOptions}
        },
        settingTransformEffectMs:{
            set:function(value){ this.settingUpdateProperty(value,'settingTransformEffectMs')},
            get:function() {return this.$store.state.settingTransformEffectMs}
        }
    }
})

//vt组件
const vtComponent = Vue.extend({
    template: document.getElementById('vt').innerHTML,
    data() {
        return {
            
            //异步处理状态时提示信息
            vtLoadingText: '...',
            //项目标题
            vtTitle: '-'
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

    },
    components: {
        settingcomponent:settingComponent,
        matfilecomponent:matFileComponent,
        matcomponent:matComponent,
        precomponent:preComponent,
        infocomponent:infoComponent
    }
})

