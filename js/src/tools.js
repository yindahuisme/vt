//获得json数组的指定对象
const getJsonArrayObj = function(targetArr,key,value){
    for (let item of targetArr){
        if (item[key] == value){
            return item
        }
    }
    return null
}