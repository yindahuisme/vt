//app组件
new Vue({
    el: '#vt',
    data: {
        //异步等待任务数量
        vt_async_task_num: 0,
        //当前激活的功能导航栏
        vt_main_nav_activename: 'metfile',
        //项目标题
        vt_header_card_title: ''
    },
    methods: {

    },
    mounted() {
        //生命周期函数，当组件挂载后调用
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