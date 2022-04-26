// vuex插件
Vue.use(Vuex)

var store = new Vuex.Store({
    state: {
        // adobe cep实例
        // csInterface : new CSInterface(),
        // axios 实例
        axiosInstance : axios.create({
            baseURL: 'http://localhost:9999'
        })
    },
    mutations: {
    },
    actions: {
    }
})