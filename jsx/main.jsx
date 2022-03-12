
// var project = app.project
// var sequence = project.activeSequence


// app.encoder.launchEncoder()

// app.encoder.encodeSequence(sequence,'C:\\Users\\Administrator\\Desktop\\pr_plugin\\samples\\out\\test1.mp4'
//     ,'C:\\Users\\Administrator\\Documents\\Adobe\\Adobe Media Encoder\\15.0\\Presets\\test.epr',0,0)

// app.encoder.startBatch()

var project = app.project
var project_items = project.rootItem.children

app.encoder.launchEncoder()
for (var i=0; i<project_items.length;i++){
    var tmp_item = project_items[i]
    alert(tmp_item.type.toString())
    // app.encoder.encodeProjectItem(tmp_item, 'C:\\Users\\Administrator\\Desktop\\pr_plugin\\samples\\out\\test1.mp4'
    //     , 'C:\\Users\\Administrator\\Documents\\Adobe\\Adobe Media Encoder\\15.0\\Presets\\test.epr', 0, 0)
}


app.encoder.startBatch()
