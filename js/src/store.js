

var store = new Vuex.Store({
    state: {

        //通用数据
        //adobe cep实例
        csInterface: new CSInterface(),
        //axios 实例
        axiosInstance: axios.create({
            baseURL: 'http://localhost:9999'
        }),
        //素材文件表格当前选项,信息
        matFileBodyTableCurrentRow: {},
        matFileInfo:{},
        //异步等待任务数量
        vtAsyncTaskNum: 0,

        //设置---------------------
        //素材文件目录
        settingMatFilePath: '',
        //mogrt文件目录
        settingMogrtPath: '',
        //卡点时长（ms）
        settingFreePointMs: '',
        //入点快捷键
        settingInPointHotKey: '',
        //变速点快捷键
        settingSpeedPointHotKey: '',
        //出点快捷键
        settingOutPointHotKey: '',
        //转场效果下拉框值
        settingTransformEffectValue: '',
        //转场效果下拉框选项
        settingTransformEffectOptions: [],
        //转场持续时间(ms)
        settingTransformEffectMs: ''
    },
    //同步提交更改
    mutations: {
        

    },
    // 异步的方式提交用这个
    actions: {}
})