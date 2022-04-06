var csInterface = new CSInterface();


// 嫁接js与jsx函数
function jsx_invoke(fun_name,args_str) {
    csInterface.evalScript(fun_name+"('"+args_str+"')",(data)=>console.log("数据："+data))

    csInterface.evalScript("alert('hi')")
    csInterface.evalScript("alert('hi1')")
}