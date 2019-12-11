var QRCode = require('./weAppQrcode.js');
var qrcode;
let app = getApp();
var code = ""
Page({
  data: {
    img: "/images/dh.gif",
    inviteCode: "",
    gym: [],
    boughtFriends: [],
    encryptedCode: "正在生成邀请码...",
  },
  clipboard: function() {
    wx.setClipboardData({
      data: this.data.encryptedCode,
      success(res) {
        wx.getClipboardData({
          success(res) {
            console.log(res.data) // data
          }
        })
      }
    })
  },
  cancle: function() {
    var that = this
    wx.cloud.callFunction({
      name: "cloudDb",
      data: {
        method: "delete",
        datasetName: "shareInfo",
        phoneNumber: app.globalData.phoneNumber,
        gym: that.data.gym
      },
      success: function() {
        wx.showToast({
          title: 'cancled',

        })
        var begin = Date.now()
        console.log(begin)
        while (Date.now() - begin < 1000) {

        }
        wx.navigateBack({
          delta: 1
        })
      }
    })
  },
  onLoad(option) {
    var that = this
    this.setData({
      inviteCode: option.inviteCode
    })
    this.setData({
      gym: option.gym
    })

    console.log("naviData")
    console.log(option.inviteCode)
    code = option.inviteCode
    wx.cloud.callFunction({
      name: "phoneEncrypt",
      data: {
        phoneNumber: option.inviteCode,
        method: 1
      },
      success: function(res) {
        console.log(res)
        that.setData({
          encryptedCode: res.result.encryptedPhone
        })
        qrcode = new QRCode('canvas', {
          text: JSON.stringify(res.result.encryptedPhone),
          width: 120,
          height: 120,
          colorDark: "#000000",
          colorLight: "#ffffff",
          correctLevel: QRCode.CorrectLevel.H,
        });
      }
    })

    wx.cloud.callFunction({
      name: "cloudDb",
      data: {
        method: "select",
        datasetName: "buyInfo",
        inviteCode: app.globalData.phoneNumber,
        gym: option.gym
      },
      success: function(res) {
        that.setData({
          boughtFriends: res.result.respond.data
        })
      }
    })
  },
  showShareMenu() {
    wx.showShareMenu();
    console.log("显示了当前页面的转发按钮");
  },
  hideShareMenu() {
    wx.hideShareMenu();
    console.log("隐藏了当前页面的转发按钮");
  },
  onShareAppMessage: function(event) {
    //var that = this
    console.log("---share---")
    console.log(this)
    var tempPath = '/pages/gymList/gymList?inviteCode=' + this.data.encryptedCode
    if (event.from === 'button') {
      console.log("来自页面内转发按钮");
      console.log(event.target);
    } else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: '共享健身',
      path: tempPath,
      imageUrl: "https://6d65-meeu-0624-1259514512.tcb.qcloud.la/haoran1.jpg?sign=fcaf620c8004d40d7db2f4993933cc1f&t=1576056770",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})