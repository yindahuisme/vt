// 获取当前项目名
// 参数：
function getProjectName(argc){
    var appName = app.project.name
    return appName.split('.')[0]
}