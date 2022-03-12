//素材文件组件
const metfile_component = Vue.extend({
    template: `
    <div>
    <div class="vt-main-metfile-list">
    </div>
    <div class="vt-main-metfile-preview">
    </div>
    <div class="vt-main-metfile-info">
    </div>
    <div class="vt-main-metfile-met">
    </div>
    </div>`,
    data(){
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

//特效组件
const affect_component = Vue.extend({
    template: `
        <h1> affect </h1>
        `,
    data() {
        return {

        }
    }
})

//模板开发组件
const temdev_component = Vue.extend({
    template: `
        <h1> temDev </h1>
        `,
    data() {
        return {

        }
    }
})

//设置组件
const setting_component = Vue.extend({
    template: `
        <h1> setting </h1>
        `,
    data() {
        return {

        }
    }
})

// app组件
new Vue({
    el: "#vt",
    data: {
        vt_main_nav_activename: 'metfile',
        vt_header_card_title: '项目名'
    },
    methods: {
        vt_main_nav_click(tab, event) {
            console.log(tab, event);
        }
    },
    components: {
        metfile_component,
        track_component,
        affect_component,
        temdev_component,
        setting_component
    }
})