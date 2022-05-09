//vuex插件
Vue.use(Vuex)

var store = new Vuex.Store({
    state: {

        //通用数据
        //adobe cep实例
        csInterface: new CSInterface(),
        //axios 实例
        axiosInstance: axios.create({
            baseURL: 'http://localhost:9999'
        }),
        //各组件实例对象
        metfile_component: metfile_component,
        track_component: track_component,
        temdev_component: temdev_component,
        setting_component: setting_component,
        app_component,

        //通用方法
        //封装adobe cep桥接方法
        jsx_exec: async function (func_name, func_args, call_back) {
            this.app_component.vt_async_task_num += 1
            var tmp_func_args = func_name + '("' + func_args + '")'
            await this.csInterface.evalScript(tmp_func_args, call_back)
            this.app_component.vt_async_task_num -= 1
        },
        //封装axios请求
        axios_exec: async function (path, body, call_back) {
            this.app_component.vt_async_task_num += 1
            await this.axiosInstance.post(path, body)
                .then(call_back)
                .catch(function (error) {
                    alert(error.message)
                })
            this.app_component.vt_async_task_num -= 1
        }


    },
    mutations: {},
    actions: {}
})