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

// const util = require('util');

// console.log(util.isDeepStrictEqual({
//     'a': 1.234,
//     'b': 'hi'
// } , {
//     'a': 1.234,
//     'b': 'hi3'
// }))
// var tmpList=[{'point':1.1,'t':'11'},{'point':2.04335,'t':'11'}]
// console.log(tmpList.splice(tmpList.indexOf({'point':2.04335,'t':'11'}), 1))

// //获得json数组的指定一层对象
// const getJsonArrayObj = function(targetArr,key,value){
//     for (let item of targetArr){
//         if (item[key] == value){
//             return item
//         }
//     }
//     return null
// }

// var tmpArray=[{'1':1}]
// var tmpArray1=getJsonArrayObj(tmpArray,'1',1)
// tmpArray1={ '1': 2 }
// console.log(tmpArray)

// const util = require('util')

// //获得数组中指定元素的下标
// const getIndexOfArrayObj = function(targetArr,obj){
//     for (var i = 0; i < targetArr.length; i ++) {  
//         if (util.isDeepStrictEqual(targetArr[i],obj))  
//             {
//                 return i
//             }
//     }
//     return -1
// }

// var tmpList = [[1,'1'],[2,'2']]
// var tmpList2 = [2,'2']
// tmpList.splice(getIndexOfArrayObj(tmpList,tmpList2),1)
// // console.log(getIndexOfArrayObj(tmpList,tmpList2))
// console.log(tmpList)


// function fun1(){
//     var a=1
//     fun2()

//     function fun2(){
//         console.log(a)
//     }
// }



// fun1()

// prePointedList = [['a','b'],['c','a'],['b','c']]

// console.log(prePointedList.sort().map(v=>v[1]))

// var a = {'a':1}

// var b = {...a}

// b['a']=b['a'].toFixed(3)
// console.log(b)

// var a = [1,2,'34']
// var b=[...a]
// console.log(b)

// var b=new Array(2)
// var a = b.map((v,i)=>i>[1].length?'true':'false')
// console.log(a)

var a = parseFloat((30 * 1.2 / 100).toFixed(3))
console.log(a)