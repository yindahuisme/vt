// 素材文件组件
const metfile_component = Vue.extend({
    template: document.getElementById('vt-main-metfile-template').innerHTML,
    mounted() {
        // 生命周期函数，当组件挂载后调用
        // this.$store.state.axiosInstance.post('/test/test1', {
        //         test: 'yindahu'
        //     })
        //     .then(function (response) {
        //         console.log(response.data['data'])
        //     })
        //     .catch(function (error) {
        //         alert(error.message)
        //     })

        //第一张页面渲染后调用
        this.$nextTick(() => {

            // 音频波形可视化实例
            this.wavesurfer = WaveSurfer.create({
                container: '#vt_main_metfile_preview_audio',
                waveColor: '#00FA9A',
                progressColor: '#00BFBF',
                backgroundColor: '#e9fff6'
            })
            setInterval(() => {
                document.getElementById('vt_main_metfile_preview_audio').innerHTML = ''
                this.wavesurfer.load('/met_file/a.mp3')
            }, 1000)

        })

    },
    // 这里必须用函数，防止多组件共用数据，下同
    data() {
        return {
            vt_main_metfile_list_header_menuOptions: [{
                value: '最后更新时间倒序',
                label: '最后更新时间倒序'
            }, {
                value: '创建时间倒序',
                label: '创建时间倒序'
            }],
            vt_main_metfile_list_header_menuValue: '创建时间倒序',
            vt_main_metfile_list_header_edit_dialogVisible: false,
            vt_main_metfile_list_header_edit_dialog_sqlText: 'test sql',
            vt_main_metfile_list_body_table_date: [{
                type: '视频',
                key: 'test1.mp4'
            }, {
                type: '音频',
                key: 'test2.mp3'
            }, {
                type: '图片',
                key: 'test3.jpg'
            }, {
                type: '音频',
                key: 'test4.mp3'
            }, {
                type: '图片',
                key: 'test5.jpg'
            }],
            vt_main_metfile_list_body_table_currentRow: {
                type: '音频',
                key: ''
            },
            wavesurfer: null
        }
    },
    methods: {
        vt_main_metfile_list_body_table_handleCurrentChange(val) {
            this.vt_main_metfile_list_body_table_currentRow = val;
        },
        vt_main_metfile_list_body_table_rowClassName({
            row
        }) {
            if (row.type == '视频') {
                return 'vedio'
            } else if (row.type == '音频') {
                return 'audio'
            } else if (row.type == '图片') {
                return 'picture'
            } else {
                return ''
            }

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
        <el-card class='box-card vt-main-setting-root_card'>
        <el-divider content-position='center'>常规</el-divider>
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
        // this.csInterface.evalScript('get_project_name()', (data) => {this.vt_header_card_title = data})

    },
    components: {
        metfile_component,
        track_component,
        temdev_component,
        setting_component
    },
    store
})