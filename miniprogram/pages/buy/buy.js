// miniprogram/pages/buy/buy.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:"135XXXXXXXX",
    items: [{ name: 'USA', value: '等待查询好友的分享信息' }],
    gym:[],
    inviteCode : "这儿是输入框",
    sharedMessage:"",
    HJPhoneNumber:""
  },
  getPhoneNumber(e) {
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
        that.setData({ phoneNumber: res.result.x.phoneNumber })
      },
      fail: err => {
        console.log('fail phone')
        console.log(sessionKey)
        console.log(phoneData.detail.encryptedData)
        console.log(phoneData.detail.iv)
      }
    })
  },
  search: function (e) {
    var that = this
    console.log("before")
    console.log(e)
    console.log(that.data.inviteCode)
    this.setData({ inviteCode: e.detail.value.inviteCode})
    console.log("after")
    console.log(that.data.inviteCode)
    const db = wx.cloud.database()

    wx.cloud.callFunction({
      name:"cloudDb",
      data:{
        datasetName: "shareInfo",
        method:"select",
        phoneNumber: that.data.inviteCode.substring(0,11)
      },
      success:res=>{
        var gym = res.result.respond.data[0].gym
        var tempItem = []
        // console.log(gym)
        // console.log(tempItem)
        for (var i = 0; i < gym.length; i++) {
          tempItem.push({ name: gym[i], value: gym[i] })
        }
        console.log(tempItem)
        that.setData({
          items: tempItem
        })
        that.setData({
          HJPhoneNumber: res.result.respond.data[0].HJPhoneNumber
        })
      },
      fail:res=>{
        console.log(that.data.inviteCode.substring(0, 11))
      }
      

    })
    // db.collection('shareInfo').where({
    //   phoneNumber: that.data.inviteCode
    // }).get({
    //   success: res => {
    //     console.log("1")
    //     console.log(res)
    //     var gym = res.data[0].gym
    //     var tempItem = []
    //     console.log(gym)
    //     console.log(tempItem)
    //     for (var i = 0; i < gym.length; i++) {
    //       tempItem.push({ name: gym[i], value: gym[i] })
    //     }
    //     console.log(tempItem)
    //     that.setData({
    //       items: tempItem
    //     })
    //     console.log('[数据库] [查询记录] 成功: ', res)
    //   },
    //   fail: err => {
    //     wx.showToast({
    //       icon: 'none',
    //       title: '查询记录失败'
    //     })
    //     console.error('[数据库] [查询记录] 失败：', err)
    //   }
    // })
  },
  query: function(e){
    wx.navigateTo({
      url: '/pages/qrCode/qrCode?phoneNumber='+this.data.phoneNumber,
      events: {
        // acceptDataFromOpenedPage: function (data) {
        //   console.log(data)
        // }
      },
      success: function (res) {
        // res.eventChannel.emit('acceptDataFromOpenerPage', {
        //   inviteCode:that.data.inviteCode,pnhoneNumber:that.data.phoneNumber, gym:that.data.gym.value})
      }
    })
  },
  buy: function (e) {
    const db = wx.cloud.database()
    var that = this
    console.log("???")
    console.log(that)
    console.log(e)
    console.log("test")
    console.log(e.detail.value)
    that.setData({gym:e.detail.value.checkBox[0]})
    wx.cloud.callFunction({
      name:"orderCreate",
      data:{
        openid:app.globalData.openid
      },
      success:res=>{
        var orderIdTemp = res.result.orderId
        console.log("~!~!~!~!~!~!~!~!")
        console.log(orderIdTemp)
        console.log(res)
        console.log(res.result.prepay_id)
        console.log(res.result.paySign)
        console.log("My Phone:"+that.data.phoneNumber.substring(0, 11))
        wx.cloud.callFunction({
          name: "cloudDb",
          data: {
            method: "insert",
            datasetName: "buyInfo",
            phoneNumber: that.data.phoneNumber.substring(0, 11),
            gym: e.detail.value.checkBox,
            inviteCode: that.data.inviteCode,
            orderId:res.result.orderId,
            prepay_id:res.result.prepay_id,
            payState:"0",
            useState:"0",
            HJPhoneNumber: that.data.HJPhoneNumber
          },
          success: res => {
          }
        })
        wx.requestPayment({
          timeStamp: res.result.timeStamp,
          nonceStr: '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
          package: 'prepay_id='+res.result.prepay_id,
          signType: 'MD5',
          paySign: res.result.paySign,
          success: res => {
            console.log("!!!!!!!!!!!!!!orderId")
            console.log(res)
            wx.showToast({
              title: '购买成功',
            })
            wx.cloud.callFunction({
              name:"orderCheck",
              data:{
                orderId: orderIdTemp
              },
              success:res=>{
                wx.navigateTo({
                  url: '/pages/qrCode/qrCode?phoneNumber=' + that.data.phoneNumber.substring(0,11),
                  events: {
                    // acceptDataFromOpenedPage: function (data) {
                    //   console.log(data)
                    // }
                  },
                  success: function (res) {
                    // res.eventChannel.emit('acceptDataFromOpenerPage', {
                    //   inviteCode:that.data.inviteCode,pnhoneNumber:that.data.phoneNumber, gym:that.data.gym.value})
                  }
                })
              }
            })
            
          }
        })
      }
    })


    
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this

    this.setData({inviteCode:options.inviteCode})
    console.log("fromNavi")
    console.log(options)
    wx.checkSession({
      success() {
        console.log("session remain")
        if (typeof (app.globalData.sessionKey)=="undefined"){
          wx.login({
            success(ress) {
              var sessionKey = ''
              if (ress.code) {
                console.log(ress)
                //发起网络请求
                wx.cloud.callFunction({
                  name: 'decode',
                  data: {
                    code: ress.code
                  },
                  success: res => {
                    //console.log(res)
                    console.log(JSON.parse(res.result.temp).session_key)
                    app.globalData.sessionKey = JSON.parse(res.result.temp).session_key
                    app.globalData.openid = JSON.parse(res.result.temp).openid
                    wx.cloud.callFunction({
                      name: "cloudDb",
                      data: {
                        method: "select",
                        datasetName: "vip",
                        openid: app.globalData.openid
                      },
                      success: res => {
                        if (res.result.respond.data[0].hasOwnProperty("phoneNumber") != false) {
                          that.setData({ phoneNumber: res.result.respond.data[0].phoneNumber + "(saved)" })
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
        }else{
          wx.cloud.callFunction({
            name: "cloudDb",
            data: {
              method: "select",
              datasetName: "vip",
              openid: app.globalData.openid
            },
            success: res => {
              if (typeof (res.result.respond.data[0].phoneNumber) != "undefined") {
                that.setData({ phoneNumber: res.result.respond.data[0].phoneNumber + "(saved)" })
              }
            }
          })
        }
        //session_key 未过期，并且在本生命周期一直有效
        
      },
      fail() {
        console.log("session over")
        // session_key 已经失效，需要重新执行登录流程
        wx.login({
          success(ress) {
            var sessionKey = ''
            if (ress.code) {
              console.log(ress)
              //发起网络请求
              wx.cloud.callFunction({
                name: 'decode',
                data: {
                  code: ress.code
                },
                success: res => {
                  //console.log(res)
                  console.log(JSON.parse(res.result.temp).session_key)
                  app.globalData.sessionKey = JSON.parse(res.result.temp).session_key
                  app.globalData.openid = JSON.parse(res.result.temp).openid


                  wx.cloud.callFunction({
                    name:"cloudDb",
                    data:{
                      method:"select",
                      datasetName:"vip",
                      openid:app.globalData.openid
                    },
                    success:res=>{
                      if(typeof(res.result.respond.data[0].phoneNumber)!="undefined"){
                        that.setData({ phoneNumber: res.result.respond.data[0].phoneNumber+"(saved)"})
                      }
                    }
                  })
                  // wx.navigateTo({
                  //   url: '../buy/buy',
                  // })
                  //that.setData({ sessionKey: JSON.parse(res.result.temp).session_key})

                  // wx.cloud.callFunction({
                  //   name: 'phone',
                  //   data: {
                  //     sessionKey: sessionKey,
                  //     encryptedData: phoneData.detail.encryptedData,
                  //     iv: phoneData.detail.iv
                  //   },
                  //   success: res => {
                  //     console.log("final result")
                  //     console.log(res.result.x.phoneNumber)
                  //     that.setData({ phoneNumber: res.result.x.phoneNumber })
                  //   },
                  //   fail: err => {
                  //     console.log('fail phone')
                  //     console.log(sessionKey)
                  //     console.log(phoneData.detail.encryptedData)
                  //     console.log(phoneData.detail.iv)
                  //   }
                  // })
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