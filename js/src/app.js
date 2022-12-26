//app组件
new Vue({
    el: '#app',
    components: {
            vtcomponent:vtComponent
        },
    beforeMount(){
        // 注册全局方法
        //弹出提示信息
        Vue.prototype.$vtNotify = function(type, title, message) {
            this.$notify({
                title,message,type
            })

        }
        //封装adobe cep桥接方法
        Vue.prototype.$jsxExec = function (funcName, funcArgs, callBack) {
            this.$store.state.vtAsyncTaskNum += 1
            var tmpFuncArgs = funcName + '("' + funcArgs + '")'
            //预处理返回结果，如果结果异常，发送通知
            this.$store.state.csInterface.evalScript(tmpFuncArgs, (data)=>{
                if (data == 'EvalScript error.') {
                    this.$vtNotify('error', '错误', '执行adobe pr脚本异常')
                } else {
                    callBack(data)
                }
                this.$store.state.vtAsyncTaskNum -= 1
            
            })
        }
        //封装axios异步请求
        Vue.prototype.$axiosAsyncExec = async function (path, body, callBack) {
            this.$store.state.vtAsyncTaskNum += 1
            await this.$store.state.axiosInstance.post(path, body)
                .then((res)=>{
                    resData = res.data
                    this.$store.state.vtAsyncTaskNum -= 1
                    //如果返回码不等于1，请求异常
                    if (resData.code != 1){
                        this.$vtNotify('error','错误',resData.message)
                    }
                    else{
                        callBack(resData.data)
                    }
                })
        }
        //根据素材文件路径获得url
        Vue.prototype.$getMatFileUrl = function (path) {
            var matFilePathList = this.$store.state.settingMatFilePath.split('\n')
            for (i = 0; i < matFilePathList.length; i++) { 
                if(path.startsWith(matFilePathList[i])){
                    var tmpFileName = path.replace(matFilePathList[i],'')
                    return `http://localhost:880${i}/${tmpFileName}`
                }
             }
            this.$vtNotify('error','错误','素材文件路径解析异常')
            return ''
        }

    },
    store
})