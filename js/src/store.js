

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
        vt_async_task_num: 0,

        //设置---------------------
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
    },
    //同步提交更改
    mutations: {
        

    },
    // 异步的方式提交用这个
    actions: {}
})