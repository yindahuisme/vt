//素材文件组件
const metfile_component = Vue.extend({
    template: document.getElementById('vt-main-metfile-template').innerHTML,
    mounted() {
        //生命周期函数，当组件挂载后调用

        //更新素材文件表格数据
        this.vt_main_metfile_list_body_full_data = this.$store.state.axios_exec()

        

        //第一张页面渲染后调用
        //this.$nextTick(() => {

        //        document.getElementById('vt_main_metfile_preview_audio').innerHTML = ''
        //        //音频波形可视化实例
        //        this.wavesurfer = WaveSurfer.create({
        //            container: '#vt_main_metfile_preview_audio',
        //            waveColor: '#00FA9A',
        //            progressColor: '#00BFBF',
        //            backgroundColor: '#e9fff6',
        //            barWidth: '1'
        //        })
        //        this.vt_main_metfile_preview_audio_wavesurfer.load('/met_file/a.mp3')
            

        //})

        //window.onresize=
        //    function(){
        //        console.log('resize')
        //        document.getElementById('vt_main_metfile_preview_audio').innerHTML = ''
        //        //音频波形可视化实例
        //        this.wavesurfer = WaveSurfer.create({
        //            container: '#vt_main_metfile_preview_audio',
        //            waveColor: '#00FA9A',
        //            progressColor: '#00BFBF',
        //            backgroundColor: '#e9fff6',
        //            barWidth: '1'
        //        })
        //        this.vt_main_metfile_preview_audio_wavesurfer.load('/met_file/a.mp3')
        //    }
        
        

    },
    data() {
        return {
            //素材文件列表区
            // vt_main_metfile_list_header_menuOptions: [{
            //     value: '最后更新时间倒序',
            //     label: '最后更新时间倒序'
            // }, {
            //     value: '创建时间倒序',
            //     label: '创建时间倒序'
            // }],
            //素材文件列表-sql筛选项编辑框是否打开
            vt_main_metfile_list_header_edit_dialogVisible: false,
            //素材文件列表-sql筛选项
            vt_main_metfile_list_header_menuOptions: [],
            //素材文件列表-sql筛选项默认选项
            vt_main_metfile_list_header_menuValue: '',
            //素材文件列表-素材文件完整信息
            vt_main_metfile_list_body_full_data: [],
            //素材文件列表-素材文件表格数据
            vt_main_metfile_list_body_table_data: [],
            //素材文件列表-素材文件表格默认选项
            vt_main_metfile_list_body_table_currentRow: null,
            //素材文件列表-筛选对话框sql内容
            vt_main_metfile_list_header_edit_dialog_sqlText: '',
            // vt_main_metfile_list_body_table_data: [{
            //     type: '视频',
            //     key: 'test1.mp4'
            // }, {
            //     type: '音频',
            //     key: 'test2.mp3'
            // }, {
            //     type: '图片',
            //     key: 'test3.jpg'
            // }, {
            //     type: '音频',
            //     key: 'test4.mp3'
            // }, {
            //     type: '图片',
            //     key: 'test5.jpg'
            // }],
            // vt_main_metfile_list_body_table_currentRow: {
            //     type: '音频',
            //     key: ''
            // },
            vt_main_metfile_preview_audio_wavesurfer: null
        }
    },
    methods: {
        //素材文件列表区
        //当选中素材文件列表的某一项时触发
        vt_main_metfile_list_body_table_handleCurrentChange(val) {
            this.vt_main_metfile_list_body_table_currentRow = val;
        },
        //动态确定素材列表类型
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
    template: document.getElementById('vt-main-setting-template').innerHTML, 
    data() {
        return {

        }
    }
})

