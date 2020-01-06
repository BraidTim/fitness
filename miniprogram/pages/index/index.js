// miniprogram/index/index.js

const app = getApp()

Page({
  data: {
    loadingShare: false,
    loadingBuy: false,
    checkAuth: true,
    checking: "查询会员中..."

  },
  admin: function() {
    wx.navigateTo({
      url: '../admin/admin',
    })
  },
  share: function() {
    this.setData({
      loadingShare: true
    })
    wx.navigateTo({
      url: '../share/share',
    })
    this.setData({
      loadingShare: false
    })
  },
  buy: function() {
    this.setData({
      loadingBuy: true
    })
    wx.navigateTo({
      url: '../buy/buy',
    })
    this.setData({
      loadingBuy: false
    })
  },
  getPhoneNumber:function(e) {
    console.log(e)
    console.log("sessionKey")
    console.log(app.globalData.sessionKey)
    var phoneData = e

    var that = this

    wx.cloud.callFunction({
      name: 'phone',
      data: {
        sessionKey: app.globalData.sessionKey,
        encryptedData: phoneData.detail.encryptedData,
        iv: phoneData.detail.iv
      },
      success: res => {
        console.log("final result")
        console.log(res.result.x.phoneNumber)
        app.globalData.phoneNumber = res.result.x.phoneNumber
        wx.cloud.callFunction({
          name: "cloudDb",
          data: {
            datasetName: "memberList",
            method: "select",
            phoneNumber: app.globalData.phoneNumber
          },
          success: function(res) {
            console.log(res)
            if (res.result.respond.data.length != 0) {
              app.globalData.huijiPhoneNumber = res.result.respond.data[0].huijiPhoneNumber
              app.globalData.myInfo = res.result.respond.data[0]
              //app.globalData.phoneNumber = res.result.respond.data[0].phoneNumber
              wx.cloud.callFunction({
                name: "cloudDb",
                data: {
                  datasetName: "memberList",
                  method: "update",
                  phoneNumber: app.globalData.phoneNumber,
                  newValue: {
                    openid: app.globalData.openid
                  }
                },
                success: function(res) {
                  wx.navigateTo({
                    url: '/pages/loggedIndex/loggedIndex',
                  })
                }
              })

            } else {
              wx.cloud.callFunction({
                name: "cloudDb",
                data: {
                  datasetName: "memberList",
                  method: "insert",
                  phoneNumber: app.globalData.phoneNumber,
                  openid: app.globalData.openid,
                  name: "",
                  character: 3,
                  vipGymList:[]

                },
                success: function(res) {
                  wx.navigateBack({

                  })
                  // wx.navigateTo({
                  //   url: '/pages/loggedIndex/loggedIndex',
                  // })
                }
              })
            }
          }
        })
        that.setData({
          phoneNumber: res.result.x.phoneNumber
        })
        that.setData({
          phoneButton: true
        })
      },
      fail: err => {
        console.log('fail phone')
        console.log(sessionKey)
        console.log(phoneData.detail.encryptedData)
        console.log(phoneData.detail.iv)
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
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
                  method: "select",
                  datasetName: "huijiInfo",
                  phoneNumber: app.globalData.phoneNumber
                },
                success: function (res) {
                  if (res.result.respond.data.length != 0) {
                    app.globalData.huijiInfo = res.result.respond.data[0]
                    //that.setData({ huiji: 1 })
                  }
                  //that.setData({ huijiInfo: res.result.respond.data[0] })
                  console.log("----huijiInfo-----")
                  console.log(res)
                  console.log(that.data.huijiInfo)
                }
              })
              wx.cloud.callFunction({
                name: "cloudDb",
                data: {
                  datasetName: "memberList",
                  method: "select",
                  openid: app.globalData.openid
                },
                success: function(res) {
                  console.log(res)
                  if (res.result.respond.data.length != 0) {
                    app.globalData.phoneNumber = res.result.respond.data[0].phoneNumber
                    app.globalData.huijiPhoneNumber = res.result.respond.data[0].huijiPhoneNumber
                    app.globalData.myInfo = res.result.respond.data[0]
                    wx.navigateBack({
                     
                    })
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})