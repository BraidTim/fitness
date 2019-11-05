// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()
var myrequest = function (code) {
  return new Promise((resolve, reject) => {
    cloud.callFunction({
      name: "cloudDb",
      data: {
        method: "insert",
        datasetName: "periodTest",
        useStateL: "0"
      },
      success: res => {
        resolve(res)
      },
      fail:res=>{
        reject(res)
      }
    })
    resolve()
  })
}

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()

  const wxContext = cloud.getWXContext()
  await myrequest()
  // db.collection("periodTest").add({
  //   // data 字段表示需新增的 JSON 数据
  //   data: {a:1},
  //   success: res => {
  //     // 在返回结果中会包含新创建的记录的 _id
      
  //     console.log('[数据库] [新增记录] 成功，记录 _id: ', res._id)
  //   },
  //   fail: err => {
      
  //     console.error('[数据库] [新增记录] 失败：', err)
  //   }
  // })
  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}