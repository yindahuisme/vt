

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

        //通用方法
        //弹出提示信息
        notify: function(type, title, message) {
            this.vt_component.$notify({
                title,message,type
            })

        },
        //封装adobe cep桥接方法
        jsx_exec: function (func_name, func_args, call_back) {
            this.vt_async_task_num += 1
            var tmp_func_args = func_name + '("' + func_args + '")'
            //预处理返回结果，如果结果异常，发送通知
            this.csInterface.evalScript(tmp_func_args, (data)=>{
                if (data == 'EvalScript error.') {
                    this.notify('error', '错误', '执行adobe pr脚本异常')
                } else {
                    call_back(data)
                }
                this.vt_async_task_num -= 1
            
            })
        },
        //封装axios请求
        axios_exec: async function (path, body, call_back) {
            this.vt_async_task_num += 1
            await this.axiosInstance.post(path, body)
                .then(call_back)
                .catch( (error) => {
                    this.notify('error','错误',error.message)
                })
            this.vt_async_task_num -= 1
        }


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