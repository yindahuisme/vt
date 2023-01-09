const util = require('util')


//获得json数组的指定一层对象
const getJsonArrayObj = function(targetArr,key,value){
    for (let item of targetArr){
        if (item[key] == value){
            return item
        }
    }
    return null
}


//获得数组中指定元素的下标
const getIndexOfArrayObj = function(targetArr,obj){
    for (var i = 0; i < targetArr.length; i ++) {  
        if (util.isDeepStrictEqual(targetArr[i],obj))  
            {
                return i
            }
    }
    return -1
}
