

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
        metfile_component: null,
        track_component: null,
        temdev_component: null,
        setting_component: null,
        vt_component: null,

        //通用方法
        //弹出提示信息
        notify: function(type, title, message) {
            this.vt_component.$notify({
                title,message,type
            })

        },
        //封装adobe cep桥接方法
        jsx_exec: function (func_name, func_args, call_back) {
            this.vt_component.vt_async_task_num += 1
            var tmp_func_args = func_name + '("' + func_args + '")'
            //预处理返回结果，如果结果异常，发送通知
            this.csInterface.evalScript(tmp_func_args, (data)=>{
                if (data == 'EvalScript error.') {
                    this.notify('error', '错误', '执行adobe pr脚本异常')
                } else {
                    call_back(data)
                }
                this.vt_component.vt_async_task_num -= 1
            
            })
        },
        //封装axios请求
        axios_exec: async function (path, body, call_back) {
            this.vt_component.vt_async_task_num += 1
            await this.axiosInstance.post(path, body)
                .then(call_back)
                .catch( (error) => {
                    this.notify('error','错误',error.message)
                })
            this.vt_component.vt_async_task_num -= 1
        }


    },
    mutations: {},
    actions: {}
})