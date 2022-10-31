//app组件
new Vue({
    el: '#app',
    components: {
            vt_component
        },
    beforeMount(){
        // 注册全局方法
        //弹出提示信息
        Vue.prototype.$vt_notify = function(type, title, message) {
            this.$notify({
                title,message,type
            })

        }
        //封装adobe cep桥接方法
        Vue.prototype.$jsx_exec = function (func_name, func_args, call_back) {
            this.$store.state.vt_async_task_num += 1
            var tmp_func_args = func_name + '("' + func_args + '")'
            //预处理返回结果，如果结果异常，发送通知
            this.$store.state.csInterface.evalScript(tmp_func_args, (data)=>{
                if (data == 'EvalScript error.') {
                    this.$vt_notify('error', '错误', '执行adobe pr脚本异常')
                } else {
                    call_back(data)
                }
                this.$store.state.vt_async_task_num -= 1
            
            })
        }
        //封装axios请求
        Vue.prototype.$axios_exec = async function (path, body, call_back) {
            this.$store.state.vt_async_task_num += 1
            await this.$store.state.axiosInstance.post(path, body)
                .then((res)=>{
                    res_data = res.data
                    this.$store.state.vt_async_task_num -= 1
                    //如果返回码不等于1，请求异常
                    if (res_data.code != 1){
                        this.$vt_notify('error','错误',res_data.message)
                    }
                    else{
                        call_back(res_data.data)
                    }
                })
        }


    },
    store
})