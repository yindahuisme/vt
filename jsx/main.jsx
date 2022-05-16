// 获取当前项目名
// 参数：
function get_project_name(argc){
    var app_name = app.project.name
    return app_name.split('.')[0]
}