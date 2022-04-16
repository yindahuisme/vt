//素材文件组件
const metfile_component = Vue.extend({
    template: document.getElementById("vt-main-metfile-template").innerHTML,
    // 这里必须用函数，防止多组件共用数据，下同
    data() {
        return {

        }
    }
})


//轨道组件
const track_component = Vue.extend({
    template: `
        <h1> track </h1>
        `,
    data() {
        return {

        }
    }
})


//模板开发组件
const temdev_component = Vue.extend({
    template: `
        <h1> tem_dev </h1>
        `,
    data() {
        return {

        }
    }
})

//设置组件
const setting_component = Vue.extend({
    template: `
    <div>
        <el-card class="box-card vt-main-setting-root_card">
        <el-divider content-position="center">常规</el-divider>
        <span>hi</span>
        </el-card>
    </div>
        `,
    data() {
        return {

        }
    }
})

// app组件
new Vue({
    el: '#vt',
    data: {
        vt_main_nav_activename: 'metfile',
        vt_header_card_title: ''
    },
    methods: {

    },
    mounted() {
        // 生命周期函数，当组件挂载后调用
        // 获取项目名
        this.vt_header_card_title = ''
        csInterface.evalScript('get_project_name()', (data) => this.vt_header_card_title = data)
        // 
    },
    components: {
        metfile_component,
        track_component,
        temdev_component,
        setting_component
    }
})