//app组件
new Vue({
    el: '#vt',
    data: {
        //异步等待任务数量
        vt_async_task_num: 0,
        //异步处理状态时提示信息
        vt_loadingText:'...',
        //当前激活的功能导航栏
        vt_main_nav_activename: 'metfile',
        //项目标题
        vt_header_card_title: ''
    },
    methods: {

    },
    computed: {
        //此刻是否为异步处理状态
        vt_loading:{
            get: function () {
                if(this.vt_async_task_num>0){
                    return true
                }
                else{
                    return false
                }
            }
        }
    },
    mounted() {
        //注册app组件实例到vuex
        this.$store.state.app_component=this
        //获取项目名
        this.$store.state.csInterface.evalScript('get_project_name()', (data) => {
            this.vt_header_card_title = data
        })

    },
    components: {
        metfile_component,
        track_component,
        temdev_component,
        setting_component
    },
    store
})