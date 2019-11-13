// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const wxContext = cloud.getWXContext()
const db = cloud.database()



var myrequest = function(event) {
  // const wxContext = cloud.getWXContext()
  // const db = cloud.database()
  // db.collection('counters').add({
  //   // data 字段表示需新增的 JSON 数据
  //   data: tempData,
  //   success: function (res) {
  //     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
  //     respond = res
  //     console.log(res)
  //     resolve(res)
  //   }
  // })
  return new Promise((resolve, reject) => {
    console.log(event)
    if (event.method == "insert") {
      console.log("insert")

      delete event.method
      var datasetName = event.datasetName
      delete event.datasetName
      var tempData = {}
      var keys = Object.keys(event)
      for (var i = 0; i < keys.length; i++) {
        tempData[keys[i]] = event[keys[i]]
      }

      //delete userInfo
      db.collection(datasetName).add({
        // data 字段表示需新增的 JSON 数据
        data: tempData
      }).then((res) => {
        resolve(res)
      })
    }
    if (event.method == "update") {
      delete event.method
      var datasetName = event.datasetName
      delete event.datasetName
      var newValue = event.newValue
      delete event.newValue
      var tempData = {}
      var keys = Object.keys(event)
      if (keys.indexOf("orderId") > -1) {
        tempData.orderId = event.orderId
      }
      if (keys.indexOf("name") > -1) {
        tempData.name = event.name
      }

      if (keys.indexOf("phoneNumber") > -1) {
        tempData.phoneNumber = event.phoneNumber
      }
      if (keys.indexOf("inviteCode") > -1) {
        tempData.inviteCode = event.inviteCode
      }
      if (keys.indexOf("gym") > -1) {
        tempData.gym = event.gym
      }
      if (keys.indexOf("payState") > -1) {
        tempData.payState = event.payState
      }
      if (keys.indexOf("useState") > -1) {
        tempData.useState = event.useState
      }
      if (keys.indexOf("dungeon") > -1) {
        tempData.dungeon = event.dungeon
      }
      console.log(tempData)
      console.log(newValue)
      //db.collection(datasetName).where(tempData).get().then((res) => { resolve(res) })
      db.collection(datasetName).where(tempData).update({
        data: newValue
      }).then((res) => {
        resolve(res)
      })
    }
    if (event.method == "delete") {
      delete event.method
      var datasetName = event.datasetName
      delete event.datasetName
      var tempData = {}
      var keys = Object.keys(event)
      // for (var i = 0; i < keys.length; i++) {
      //   tempData[keys[i]] = event[keys[i]]
      // }
      if (keys.indexOf("phoneNumber") > -1) {
        tempData.phoneNumber = event.phoneNumber
      }
      if (keys.indexOf("inviteCode") > -1) {
        tempData.inviteCode = event.inviteCode
      }
      if (keys.indexOf("gym") > -1) {
        tempData.gym = event.gym
      }
      if (keys.indexOf("payState") > -1) {
        tempData.payState = event.payState
      }
      if (keys.indexOf("useState") > -1) {
        tempData.useState = event.useState
      }
      if (keys.indexOf("openid") > -1) {
        tempData.openid = event.openid
        console.log("WTF_hidden_openId")
      }
      db.collection(datasetName).where(tempData).remove().then((res) => {
        resolve(res)
      })

    }
    if (event.method == "select") {
      var include = 0
      delete event.method
      var datasetName = event.datasetName
      delete event.datasetName
      var tempData = {}
      var keys = Object.keys(event)
      // for (var i = 0; i < keys.length; i++) {
      //   tempData[keys[i]] = event[keys[i]]
      // }
      if (keys.indexOf("include") > -1) {
        include = 1
        if (keys.indexOf("inviteCode") > -1) {
          tempData.inviteCode = db.command.in(event.inviteCode) 
        }
        if (keys.indexOf("phoneNumber") > -1) {

          tempData.phoneNumber = db.command.in(event.phoneNumber) 
        }

      }else{
        if (keys.indexOf("inviteCode") > -1) {
          tempData.inviteCode = event.inviteCode
        }
        if (keys.indexOf("phoneNumber") > -1) {
          tempData.phoneNumber = event.phoneNumber
        }
      }
      
      
      
      if (keys.indexOf("gym") > -1) {
        tempData.gym = event.gym
      }
      if (keys.indexOf("gymName") > -1) {
        tempData.gymName = event.gymName
      }
      if (keys.indexOf("name") > -1) {
        tempData.name = event.name
      }
      if (keys.indexOf("orderId") > -1) {
        tempData.orderId = event.orderId
      }
      if (keys.indexOf("payState") > -1) {
        tempData.payState = event.payState
      }
      if (keys.indexOf("useState") > -1) {
        tempData.useState = event.useState
      }
      if (keys.indexOf("huijiPhoneNumber") > -1) {
        tempData.huijiPhoneNumber = event.huijiPhoneNumber
      }
      if (keys.indexOf("openid") > -1) {
        tempData.openid = event.openid
        console.log("WTF_hidden_openId")
      }
      
      //delete userInfo
      //db.collection(datasetName).get().then((res) => { resolve(res) })
      console.log(tempData)
      if(include==1){
        db.collection(datasetName).where(tempData).get().then((res) => {
          resolve(res)
        })
      }else{
        db.collection(datasetName).where(tempData).get().then((res) => {
          resolve(res)
        })
      }
      
    }


  })
}

// 云函数入口函数
exports.main = async(event, context) => {
  var respond = "init"
  respond = await myrequest(event)
  // var respond = "init"
  // if(event.method = "insert"){
  //   delete event.method
  //   var tempData = {}
  //   var keys = Object.keys(event)
  //   for (var i = 0; i < keys.length; i++) {
  //     tempData[keys[i]] = event[keys[i]]
  //   }

  // }
  // if (event.method = "select"){
  //   delete event.method

  //   await db.collection('counters').where(event).get({
  //     success: res => {
  //       this.setData({
  //         queryResult: JSON.stringify(res.data, null, 2)
  //       })
  //       console.log('[数据库] [查询记录] 成功: ', res)
  //     },
  //     fail: err => {
  //       wx.showToast({
  //         icon: 'none',
  //         title: '查询记录失败'
  //       })
  //       console.error('[数据库] [查询记录] 失败：', err)
  //     }
  //   })
  // }

  // db.collection('counters').add({
  //   // data 字段表示需新增的 JSON 数据
  //   data: tempData,
  //   success: function (res) {
  //     // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
  //     console.log(res)
  //   }
  // })
  return {
    respond,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}