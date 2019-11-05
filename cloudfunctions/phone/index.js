// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

function mines(sessionKeyIn,encryptedDataIn,ivIn){
  var WXBizDataCrypt = require('./WXBizDataCrypt')

  var appId = 'wx2c2bdfe3e7a50db2'
  var sessionKey = sessionKeyIn
  var encryptedData = encryptedDataIn
  var iv = ivIn||'r7BXXKkLb8qrSNn05n0qiA=='

  var pc = new WXBizDataCrypt(appId, sessionKey)

  var data = pc.decryptData(encryptedData, iv)

  console.log('解密后 data: ', data)
  return data
// 解密后的数据为
//
// data = {
//   "nickName": "Band",
//   "gender": 1,
//   "language": "zh_CN",
//   "city": "Guangzhou",
//   "province": "Guangdong",
//   "country": "CN",
//   "avatarUrl": "http://wx.qlogo.cn/mmopen/vi_32/aSKcBBPpibyKNicHNTMM0qJVh8Kjgiak2AHWr8MHM4WgMEm7GFhsf8OYrySdbvAMvTsw3mo8ibKicsnfN5pRjl1p8HQ/0",
//   "unionId": "ocMvos6NjeKLIBqg5Mr9QjxrP1FA",
//   "watermark": {
//     "timestamp": 1477314187,
//     "appid": "wx4f4bc4dec97d474b"
//   }
// }

}
var update = function (phoneNumber,openid) {
  return new Promise((resolve, reject) => {

    //delete userInfo
    const db = cloud.database()
    console.log("---------------")
    //console.log(option)
    db.collection("vip").where({ phoneNumber: phoneNumber }).update({
      data: { openid: openid }
    }).then((res) => { resolve(res) })

  })
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var temp = mines(event.sessionKey, event.encryptedData, event.iv)
  console.log(temp)
  console.log(wxContext)
  var updateOpenId = await update(temp.phoneNumber,wxContext.OPENID)
  return {
    x: temp
  }
}