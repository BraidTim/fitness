// miniprogram/pages/loggedIndex/loggedIndex.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    image_address:'',
  },

  gymList:function(res){
    wx.navigateTo({
      url: '/pages/gymList/gymList',
    })
  },
  myInfo:function(res){
    wx.navigateTo({
      url: '/pages/myInfo/myInfo',
    })
  },
  huijiMenu:function(res){
    wx.navigateTo({
      url: '/pages/huijiMenu/huijiMenu',
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    that.setData({
      checkAuth: true
    })
    wx.login({
      success(ress) {
        console.log("logined")
        console.log(ress)
        var sessionKey = ''
        if (ress.code) {
          wx.cloud.callFunction({
            name: 'decode',
            data: {
              code: ress.code
            },
            success: res => {
              app.globalData.openid = JSON.parse(res.result.temp).openid
              app.globalData.sessionKey = JSON.parse(res.result.temp).session_key
              wx.cloud.callFunction({
                name: "cloudDb",
                data: {
                  datasetName: "memberList",
                  method: "select",
                  openid: app.globalData.openid
                },
                success: function (res) {
                  console.log(res)
                  if (res.result.respond.data.length != 0) {
                    app.globalData.phoneNumber = res.result.respond.data[0].phoneNumber
                    app.globalData.huijiPhoneNumber = res.result.respond.data[0].huijiPhoneNumber
                    app.globalData.myInfo = res.result.respond.data[0]
                    // wx.navigateBack({

                    // })
                    /*
                    wx.navigateTo({
                      url: '/pages/loggedIndex/loggedIndex',
                    })
                    */
                  } else {
                    that.setData({
                      checkAuth: false
                    })
                    that.setData({
                      checking: "没找到记录，如果是初次试用请授权！"
                    })

                    console.log(that.data)
                  }
                }
              })
            },
            fail: err => {
              console.log('fail decode')
            }
          })
        } else {
          console.log('登录失败！' + res.errMsg)
        }
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})