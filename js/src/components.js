//素材文件组件
const matfile_component = Vue.extend({
    template: document.getElementById('vt_main_matFile_template').innerHTML,
    mounted() {
        //初始化
        //更新素材文件表格数据
        // this.vt_main_matFile_bodyFullData = this.$axios_exec()

    },
    data() {
        return {
            // vt_main_matFile_headerMenuOptions: [{
            //     value: '最后更新时间倒序',
            //     label: '最后更新时间倒序'
            // }, {
            //     value: '创建时间倒序',
            //     label: '创建时间倒序'
            // }],
            //sql筛选项编辑框是否打开
            vt_main_matFile_headerEditDialogVisible: false,
            //sql筛选项
            vt_main_matFile_headerMenuOptions: [],
            //sql筛选项默认选项
            vt_main_matFile_headerMenuValue: '',
            //完整信息
            vt_main_matFile_bodyFullData: [],
            //表格数据
            vt_main_matFile_bodyTableData: [{
                type: '视频',
                key: 'test1.mp4'
            }, {
                type: '音频',
                key: 'test2.mp3'
            }, {
                type: '图片',
                key: 'test3.jpg'
            }, {
                type: '音频',
                key: 'test4.mp3'
            }, {
                type: '图片',
                key: 'test5.jpg'
            }],
            //筛选对话框sql内容
            vt_main_matFile_headerEditDialogSqlText: ''
        }
    },
    methods: {

        //获取素材文件列表数据
        get_vt_main_matFile_bodyTableData(data_path) {
            // this.$axios_exec(
            //     '/vt/getSettingProperties', {}, (res) => {
            //         this.vt_main_setting_properties = res.data.data
            //         //更新项目数据目录
            //         this.vt_main_setting_metFilePath = this.vt_main_setting_properties.projectDataPath
            //     }
            // )
        },
        //当选中素材文件列表的某一项时触发
        vt_main_matFile_bodyTableHandleCurrentChange(val) {
            this.$store.commit('vt_main_matFile_bodyTableCurrentRow',val);
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

        }

    }
})


//预览组件
const pre_component = Vue.extend({
    template: document.getElementById('vt_main_pre_template').innerHTML,
    mounted() {
        //初始化
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
        //获取配置项
        this.$axios_exec(
            '/vt/getSettingProperties', {}, (res) => {
                console.log('获取配置')
                this.vt_main_setting_properties = res
                //初始化配置
                this.vt_main_setting_metFilePath = this.vt_main_setting_properties.vt_main_setting_metFilePath
                this.vt_main_setting_freePointMs = this.vt_main_setting_properties.vt_main_setting_freePointMs
                this.vt_main_setting_inPointHotKey = this.vt_main_setting_properties.vt_main_setting_inPointHotKey
                this.vt_main_setting_speedPointHotKey = this.vt_main_setting_properties.vt_main_setting_speedPointHotKey
                this.vt_main_setting_outPointHotKey = this.vt_main_setting_properties.vt_main_setting_outPointHotKey
                this.vt_main_setting_transformEffectValue = this.vt_main_setting_properties.vt_main_setting_transformEffectValue
                this.vt_main_setting_transformEffectOptions = this.vt_main_setting_properties.vt_main_setting_transformEffectOptions.split(',')
                this.vt_main_setting_transformEffectMs = this.vt_main_setting_properties.vt_main_setting_transformEffectMs
                this.vt_main_setting_mogrtPath = this.vt_main_setting_properties.vt_main_setting_mogrtPath
            }
        )
    },
    methods: {
        //更新配置
        update_property(cur_value,key){
            this.$axios_exec(
                '/vt/setSettingProperty', {'key':key,'value':cur_value}, (res) => {
        })}
    
    },
    data() {
        return {
            //设置面板是否展开
            vt_header_settingDialogVisible:false,
            //项目配置项
            vt_main_setting_properties: [],
            //素材文件目录
            vt_main_setting_metFilePath: '',
            //mogrt文件目录
            vt_main_setting_mogrtPath: '',
            //卡点时长（ms）
            vt_main_setting_freePointMs: '',
            //入点快捷键
            vt_main_setting_inPointHotKey: '',
            //变速点快捷键
            vt_main_setting_speedPointHotKey: '',
            //出点快捷键
            vt_main_setting_outPointHotKey: '',
            //转场效果下拉框值
            vt_main_setting_transformEffectValue: '',
            //转场效果下拉框选项
            vt_main_setting_transformEffectOptions: [],
            //转场持续时间(ms)
            vt_main_setting_transformEffectMs: ''

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
        matfile_component,
        pre_component,
        info_component,
        mat_component,
        setting_component
    }
})