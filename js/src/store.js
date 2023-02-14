var store = new Vuex.Store({
    state: {

        //通用---------------------------------------------
        //adobe cep实例
        csInterface: new CSInterface(),
        //axios 实例
        axiosInstance: axios.create({
            baseURL: 'http://localhost:9999'
        }),
        //素材文件--------------------------------------------
        //素材文件表格当前选项,信息
        matFileTableCurrentRow: null,
        matFileInfo: null,
        //素材文件列表项右键菜单style
        matFileRClickMenuStyle: {
            'display': 'none',
            'z-index': '5000',
            'top': '0px',
            'left': '0px'
        },
        //素材---------------------------------------------
        //素材列表数据
        matTableData: [],
        //素材表格当前选项,信息
        matTableCurrentRow: null,
        matInfo: null,
        //素材列表项右键菜单style
        matRClickMenuStyle: {
            'display': 'none',
            'z-index': '5000',
            'bottom': '0px',
            'right': '0px'
        },
        //vt-------------------------------------------
        //异步等待任务数量
        vtAsyncTaskNum: 0,
        //项目标题
        vtTitle: '-',
        //预览-------------------------------------------
        //轨道素材信息
        preTrackMatInfo: null,
        //当前打点列表
        prePointedList: [],
        //信息-------------------------------------------
        // 当前信息展示类型,素材文件或素材
        infoType: '',

        //设置----------------------------------------
        //素材文件目录
        settingMatFilePath: '',
        //mogrt文件目录
        settingMogrtPath: '',
        //卡点时长（ms）
        settingFreePointSecond: '',
        //入点快捷键
        settingInPointHotKey: '',
        //出点快捷键
        settingOutPointHotKey: '',
        //卡点快捷键
        settingPointHotKey: ''
    },
    getters: {
        preTrackMatList(state) {
            return function (trackName) {
                var tmpList = state.preTrackMatInfo[trackName]
                if (tmpList == undefined) {
                    tmpList = []
                    state.preTrackMatInfo[trackName] = tmpList
                }
                return tmpList
            }
        }
    },
    //同步提交更改
    mutations: {


    },
    // 异步的方式提交用这个
    actions: {}
})