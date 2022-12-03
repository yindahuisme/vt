//素材文件组件
const matfile_component = Vue.extend({
    template: document.getElementById('vt_main_matFile_template').innerHTML,
    created(){
        //初始化(before)
        console.log('初始化(before)素材文件组件')

        
    },
    mounted() {
        //初始化
        console.log('初始化素材文件组件')
        
        //同步实际素材文件与表中元数据，使其保持一致
        console.log('api:同步实际素材文件与表中元数据')
        this.$axios_async_exec(
            '/vt/syncMetFileMetaData', {}, (res) => {
            }
        ).then(res => {
            //获取素材文件筛选sql列表
            return this.$axios_async_exec(
                '/vt/getSqlMenuOptions', {}, (res) => {
                    this.vt_main_matFile_sqlMenuOptions = res
                    this.vt_main_matFile_sqlMenuCurOption = this.vt_main_matFile_sqlMenuOptions[0]['label']
                }
            )
        }
        ).then(
            res =>{
                //更新素材文件列表
                this.vt_main_matFile_updateList()
            }
        )


    },
    data() {
        return {
            //sql筛选项编辑框是否打开
            vt_main_matFile_headerEditDialogVisible: false,
            //sql筛选项
            vt_main_matFile_sqlMenuOptions: [],
            //sql筛选项当前选项
            vt_main_matFile_sqlMenuCurOption: '',
            //素材文件列表数据
            vt_main_matFile_bodyTableData: [],
            //筛选对话框sql内容
            vt_main_matFile_headerEditDialogSqlText: ''
        }
    },
    computed: {
        //sql筛选项当前对象
        vt_main_matFile_sqlMenuCurObj: {
            get: function () {
                return getJsonArrayObj(this.vt_main_matFile_sqlMenuOptions,'label',this.vt_main_matFile_sqlMenuCurOption) 
            }
        }
        
    },
    methods: {

        
        //当选中素材文件列表的某一项时触发
        vt_main_matFile_bodyTableHandleCurrentChange(val) {
            this.$store.state.vt_main_matFile_bodyTableCurrentRow=val
        },
        //动态确定素材列表类型
        vt_main_matFile_bodyTableRowClassName({
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
        vt_main_matFile_saveSql(){
            this.vt_main_matFile_headerEditDialogVisible = false
            this.$axios_async_exec(
                '/vt/saveMetFileFilterSql', {'label':this.vt_main_matFile_sqlMenuCurOption,'value':this.vt_main_matFile_headerEditDialogSqlText}, (res) => {
                }
            ).then(res => {
               
                this.vt_main_matFile_sqlMenuCurObj['value'] = this.vt_main_matFile_headerEditDialogSqlText

                //更新素材文件列表
                return this.vt_main_matFile_updateList()

            }
            ).then(res =>{
                this.$vt_notify('success','提示','保存成功')
            }
            )
        },
        //点击删除sql按钮触发
        vt_main_matFile_delSql(){
            this.vt_main_matFile_headerEditDialogVisible = false

            this.$axios_async_exec(
                '/vt/delMetFileFilterSql', {'label':this.vt_main_matFile_sqlMenuCurOption}, (res) => {
                }
            ).then(res => {
                this.vt_main_matFile_sqlMenuOptions.forEach((item,index,arr) => {
                    if(item['label'] == this.vt_main_matFile_sqlMenuCurOption){
                        arr.splice(index,1)
                    }
                })

                this.vt_main_matFile_sqlMenuCurOption = this.vt_main_matFile_sqlMenuOptions[0]['label']
                //更新素材文件列表
                return this.vt_main_matFile_updateList()

            }
            ).then(res =>{
                this.$vt_notify('success','提示','删除成功')
            }
            )
            
        },
        //更新素材文件列表
        vt_main_matFile_updateList(){
            this.$axios_async_exec(
                '/vt/getSqlData', {'sql_str':this.vt_main_matFile_sqlMenuCurObj['value']}, (res) => {
                    this.vt_main_matFile_bodyTableData = res
                }
            )
            
        },
        //素材文件sql筛选项变化时触发
        vt_main_matFile_sqlMenuChangeEvent(val){
            //如果新增选项
            if (this.vt_main_matFile_sqlMenuCurObj === null){
                var tmp_new_item = {'label':this.vt_main_matFile_sqlMenuCurOption,'value':`
select '' as type,
'' as metFileName, 
'' as durationSecond 
from vt.vt_met_file 
where false
order by create_time asc
                                `}
                this.vt_main_matFile_sqlMenuOptions.push(tmp_new_item)
            }
            //更新素材文件列表
            this.vt_main_matFile_updateList()

        },
        //素材文件sql编辑按钮点击触发
        vt_main_matFile_sqlEditButtonClick(){
            this.vt_main_matFile_headerEditDialogVisible = true
            this.vt_main_matFile_headerEditDialogSqlText =this.vt_main_matFile_sqlMenuCurObj['value']

        }


    }
})


//预览组件
const pre_component = Vue.extend({
    template: document.getElementById('vt_main_pre_template').innerHTML,
    mounted() {
        //初始化
        console.log('初始化预览组件')
        //this.$nextTick(() => {

        //        document.getElementById('vt_main_pre_audio').innerHTML = ''
        //        //音频波形可视化实例
        //        this.wavesurfer = WaveSurfer.create({
        //            container: '#vt_main_pre_audio',
        //            waveColor: '#00FA9A',
        //            progressColor: '#00BFBF',
        //            backgroundColor: '#e9fff6',
        //            barWidth: '1'
        //        })
        //        this.vt_main_pre_audioWavesurfer.load('/met_file/a.mp3')


        //})

        //window.onresize=
        //    function(){
        //        console.log('resize')
        //        document.getElementById('vt_main_pre_audio').innerHTML = ''
        //        //音频波形可视化实例
        //        this.wavesurfer = WaveSurfer.create({
        //            container: '#vt_main_pre_audio',
        //            waveColor: '#00FA9A',
        //            progressColor: '#00BFBF',
        //            backgroundColor: '#e9fff6',
        //            barWidth: '1'
        //        })
        //        this.vt_main_pre_audioWavesurfer.load('/met_file/a.mp3')
        //    }

    },
    methods: {

    },
    computed: {
        ...Vuex.mapState([
            // 素材文件-表格默认选项
            'vt_main_matFile_bodyTableCurrentRow'
        ])
    },
    data() {
        return {

            vt_main_pre_audioWavesurfer: null
        }
    }
})

//详情组件
const info_component = Vue.extend({
    template: document.getElementById('vt_main_info_template').innerHTML,
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
const mat_component = Vue.extend({
    template: document.getElementById('vt_main_mat_template').innerHTML,
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
const setting_component = Vue.extend({
    template: document.getElementById('vt_main_setting_template').innerHTML,
    mounted() {
        //初始化
        console.log('初始化设置组件')
        //获取设置选项
        console.log('api:获取配置表的值')
        this.$axios_async_exec(
            '/vt/getSettingProperties', {}, (res) => {
                var vt_main_setting_properties = res
                //初始化配置
                this.$store.state.vt_main_setting_metFilePath = vt_main_setting_properties.vt_main_setting_metFilePath
                this.$store.state.vt_main_setting_freePointMs = vt_main_setting_properties.vt_main_setting_freePointMs
                this.$store.state.vt_main_setting_inPointHotKey = vt_main_setting_properties.vt_main_setting_inPointHotKey
                this.$store.state.vt_main_setting_speedPointHotKey = vt_main_setting_properties.vt_main_setting_speedPointHotKey
                this.$store.state.vt_main_setting_outPointHotKey = vt_main_setting_properties.vt_main_setting_outPointHotKey
                this.$store.state.vt_main_setting_transformEffectValue = vt_main_setting_properties.vt_main_setting_transformEffectValue
                this.$store.state.vt_main_setting_transformEffectOptions = vt_main_setting_properties.vt_main_setting_transformEffectOptions.split(',')
                this.$store.state.vt_main_setting_transformEffectMs = vt_main_setting_properties.vt_main_setting_transformEffectMs
                this.$store.state.vt_main_setting_mogrtPath = vt_main_setting_properties.vt_main_setting_mogrtPath
            }
        )
    },
    methods: {
        //更新配置
        update_property(value,key){
            // var tmp_value = value.replace('\\','/')
            eval(`this.$store.state.${key} = value` )
            },
        //设置选项值改变时触发更新
        change_setting_value(key){
            eval(`var value = this.${key}`)
            console.log(`api:更新配置：${key}=${value}`)
            this.$axios_async_exec(
                '/vt/setSettingProperty', {'key':key,'value':value}, (res) => {
        })
        }
    
    },
    data() {
        return {
            //设置面板是否展开
            vt_header_settingDialogVisible:false

        }
    },
    computed:{
        vt_main_setting_metFilePath:{
            set:function(value){ this.update_property(value,'vt_main_setting_metFilePath')},
            get:function() {return this.$store.state.vt_main_setting_metFilePath}
        },
        vt_main_setting_mogrtPath:{
            set:function(value){ this.update_property(value,'vt_main_setting_mogrtPath')},
            get:function() {return this.$store.state.vt_main_setting_mogrtPath}
        },
        vt_main_setting_freePointMs:{
            set:function(value){ this.update_property(value,'vt_main_setting_freePointMs')},
            get:function() {return this.$store.state.vt_main_setting_freePointMs}
        },
        vt_main_setting_inPointHotKey:{
            set:function(value){ this.update_property(value,'vt_main_setting_inPointHotKey')},
            get:function() {return this.$store.state.vt_main_setting_inPointHotKey}
        },
        vt_main_setting_speedPointHotKey:{
            set:function(value){ this.update_property(value,'vt_main_setting_speedPointHotKey')},
            get:function() {return this.$store.state.vt_main_setting_speedPointHotKey}
        },
        vt_main_setting_outPointHotKey:{
            set:function(value){ this.update_property(value,'vt_main_setting_outPointHotKey')},
            get:function() {return this.$store.state.vt_main_setting_outPointHotKey}
        },
        vt_main_setting_transformEffectValue:{
            set:function(value){ this.update_property(value,'vt_main_setting_transformEffectValue')},
            get:function() {return this.$store.state.vt_main_setting_transformEffectValue}
        },
        vt_main_setting_transformEffectOptions:{
            set:function(value){ this.update_property(value,'vt_main_setting_transformEffectOptions')},
            get:function() {return this.$store.state.vt_main_setting_transformEffectOptions}
        },
        vt_main_setting_transformEffectMs:{
            set:function(value){ this.update_property(value,'vt_main_setting_transformEffectMs')},
            get:function() {return this.$store.state.vt_main_setting_transformEffectMs}
        }
    }
})

//vt组件
const vt_component = Vue.extend({
    template: document.getElementById('vt').innerHTML,
    data() {
        return {
            
            //异步处理状态时提示信息
            vt_loadingText: '...',
            //项目标题
            vt_header_card_title: '-'
        }

    },
    methods: {

    },
    computed: {
        //此刻是否为异步处理状态
        vt_loading: {
            get: function () {
                if (this.vt_async_task_num > 0) {
                    return true
                } else {
                    return false
                }
            }
        },
        ...Vuex.mapState([
            // 异步等待任务数量
            'vt_async_task_num'
        ])
        
    },
    mounted() {
        //初始化
        //获取项目名
        this.$jsx_exec('get_project_name', '', (data) => {
            this.vt_header_card_title = data
        })

    },
    components: {
        setting_component,
        matfile_component,
        mat_component,
        pre_component,
        info_component
    }
})