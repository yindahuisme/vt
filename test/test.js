// let sleepFun = (time) => new Promise((resolve) => setTimeout(resolve, time))
// console.log(1)
// sleepFun(10000).then(()=>console.log('hi'))
// console.log(2)

// var return_value = '未赋值！'
// setTimeout( () => return_value = '1',10000)
// while (return_value == '未赋值！') {
//     //js是单线程调度，用空跑代替sleep
//     console.log('空跑')
// }

// tmp={}.id
// console.log(tmp)
// if(typeof(tmp) == 'undefined'){
//     console.log('yes')
// }else{
//     console.log('no')
// }

// console.log(parseFloat(Math.floor(0/100)))

// var tmpList = [{'a':1.234,'b':'hi'},{'a':2.234,'b':'hi'}]
// var ind =tmpList.indexOf({'a':1.234,'b':'hi'})

// console.log(ind)
// tmpList.splice(ind,1)
// console.log(tmpList)


// var tmpList = [1,2,3]
// console.log(tmpList.indexOf(2))
// tmpList.splice(tmpList.indexOf(2),1)
// console.log(tmpList)

// function objEquals(object1, object2) {
//     var keys1 object.keys(object1)
//     var keys2 Object.keys(object2)

//     if (keys1.length != keys2.length) {
//         return false
//     }

//     for (let key of keys1) {
//         if (object1[key] != object2[key]) {
//             return false
//         }
//     }
//     return true
// }

const util = require('util');

console.log(util.isDeepStrictEqual({
    'a': 1.234,
    'b': 'hi'
} , {
    'a': 1.234,
    'b': 'hi3'
}))
var tmpList=[{'point':1.1,'t':'11'},{'point':2.04335,'t':'11'}]
console.log(tmpList.splice(tmpList.indexOf({'point':2.04335,'t':'11'}), 1))
