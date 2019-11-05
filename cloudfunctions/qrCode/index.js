// 云函数入口文件
const cloud = require('wx-server-sdk')
var qr = require('qr-image');
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var qr_svg = qr.image('I love QR!', { type: 'svg' });
  qr_svg.pipe(require('fs').createWriteStream('i_love_qr.svg'));
  console.log("created")
  // const filePath = res.tempFilePaths[0]
  //cloud.uploadFile()
  // // 上传图片
  // const cloudPath = 'my-image' + filePath.match(/\.[^.]+?$/)[0]
  cloud.uploadFile({
    cloudPath:"cloud://",
    filePath:"i_love_qr.svg",
    success: res => {
      console.log('[上传文件] 成功：', res)
    },
    fail: e => {
      console.error('[上传文件] 失败：', e)
      wx.showToast({
        icon: 'none',
        title: '上传失败',
      })
    },
    complete: () => {
      wx.hideLoading()
    }
  })
  return {
    x:1
  }
}