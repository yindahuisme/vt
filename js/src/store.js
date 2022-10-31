

var store = new Vuex.Store({
    state: {

        //通用数据
        //adobe cep实例
        csInterface: new CSInterface(),
        //axios 实例
        axiosInstance: axios.create({
            baseURL: 'http://localhost:9999'
        }),
        //素材文件-表格默认选项
        vt_main_matFile_bodyTableCurrentRow: {
            type: '',
            key: ''
        },
        //异步等待任务数量
        vt_async_task_num: 0
    },
    //提交更改
    mutations: {
        //修改素材文件-表格默认选项
        vt_main_matFile_bodyTableCurrentRow: function(state,val){
            state.vt_main_matFile_bodyTableCurrentRow=val
        },

        //修改异步等待任务数量
        vt_async_task_num: function(state,val){
            state.vt_async_task_num=val
        }
    },
    // 异步的方式提交用这个
    actions: {}
})