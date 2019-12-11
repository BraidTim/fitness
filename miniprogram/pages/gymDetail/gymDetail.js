// miniprogram/pages/gymDetail/gymDetail.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    gymInfo:{},
    type:"",
    icon:false,
    decodePhone:"",
  },
  toCall:function(){
    wx.makePhoneCall({
      phoneNumber: this.data.gymInfo.gymPhone //仅为示例，并非真实的电话号码
    })
  },
  toMap:function(){
    wx.navigateTo({
      url: '/pages/map/map',
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
  sell:function(){
    var that = this
    console.log("123123123")
    console.log(app.globalData)
    var today = new Date()
    var month = today.getMonth() + 1
    var pre = ''
    var preD = ''
    if(month<10){
      pre = '0'
    }
    if (today.getDate() < 10) {
      preD = '0'
    }
    var dateString = (today.getYear() + 1900).toString() + pre + (today.getMonth() + 1).toString() + preD + today.getDate().toString()
    wx.cloud.callFunction({
      name: 'cloudDb',
      data: {
        method: "insert",
        datasetName: "shareInfo",
        phoneNumber: app.globalData.phoneNumber,
        gym: that.data.gymInfo.gymName,
        huijiPhoneNumber: app.globalData.huijiPhoneNumber,
        shareDate: dateString,
        shareState:1
      },
      success: res => {
        wx.showToast({
          title: '分享成功',
        })
        that.setData({ shareToFriend: "分享" })
        wx.navigateTo({
          url: '/pages/shareToFriend/shareToFriend?inviteCode=' + app.globalData.phoneNumber + "&gym=" + that.data.gymInfo.name,
          events: {
            // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
          },
          success: function (res) {

          }
        })
      }
    })
  },
  buy: function (event) {
    if (!app.globalData.hasOwnProperty('phoneNumber')){
      wx.navigateTo({
        url: '/pages/index/index',
        events: {
          // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
        },
        success: function (res) {

        }
      })
    }else{
      const db = wx.cloud.database()
      var that = this
      wx.cloud.callFunction({
        name: "orderCreate",
        data: {
          openid: app.globalData.openid
        },
        success: res => {
          var orderIdTemp = res.result.orderId
          var prepay_id = res.result.prepay_id
          var today = new Date()
          var month = today.getMonth() + 1
          var pre = ''
          var preD = ''
          if (month < 10) {
            pre = '0'
          }
          if (today.getDate() < 10) {
            preD = '0'
          }
          var dateString = (today.getYear() + 1900).toString() + pre + (today.getMonth() + 1).toString() + preD + today.getDate().toString()
          console.log(dateString)
          
          wx.requestPayment({
            timeStamp: res.result.timeStamp,
            nonceStr: '5K8264ILTKCH16CQ2502SI8ZNMTM67VS',
            package: 'prepay_id=' + res.result.prepay_id,
            signType: 'MD5',
            paySign: res.result.paySign,
            success: res => {
              wx.cloud.callFunction({
                name: "cloudDb",
                data: {
                  method: "insert",
                  datasetName: "buyInfo",
                  phoneNumber: app.globalData.phoneNumber,
                  gym: that.data.gymInfo.gymName,
                  gymAddress: that.data.gymInfo.gymAddress,
                  gymPhone: that.data.gymInfo.gymPhone,
                  gymLocation: that.data.gymInfo.gymLocation,
                  inviteCode: that.data.decodePhone,
                  orderId: orderIdTemp,
                  prepay_id: prepay_id,
                  payState: "1",
                  useState: "0",
                  huijiPhoneNumber: app.globalData.huijiPhoneNumberBuy,
                  buyDate: dateString,

                },
                success: res => {
                  wx.showToast({
                    title: '购买成功',
                  })
                  wx.cloud.callFunction({
                    name: "message",
                    data: {
                      openid: app.globalData.openid,
                      prepay_id: prepay_id
                    },
                    success: res => {
                      console.log("message sent")
                    }
                  })
                  wx.navigateTo({
                    url: '/pages/qrCode/qrCode?phoneNumber=' + app.globalData.phoneNumber,
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
              console.log("!!!!!!!!!!!!!!orderId")
              console.log(res)
              
              // wx.cloud.callFunction({
              //   name: "orderCheck",
              //   data: {
              //     orderId: orderIdTemp
              //   },
              //   success: res => {
              //     wx.navigateTo({
              //       url: '/pages/qrCode/qrCode?phoneNumber=' + app.globalData.phoneNumber,
              //       events: {
              //         // acceptDataFromOpenedPage: function (data) {
              //         //   console.log(data)
              //         // }
              //       },
              //       success: function (res) {
              //         // res.eventChannel.emit('acceptDataFromOpenerPage', {
              //         //   inviteCode:that.data.inviteCode,pnhoneNumber:that.data.phoneNumber, gym:that.data.gym.value})
              //       }
              //     })
              //   }
              // })

            }
          })
        }
      })
    }
    



  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ icon: app.globalData.hasOwnProperty('phoneNumber') })
    console.log("```````````options___________")
    console.log(options)
    this.setData({ decodePhone: options.inviteCode })

    console.log("gymDetail")
    console.log(options.gymInfo.replace("%26", "&").replace("%3F", "?").replace("%3D", "="))
      
    var tempSet = JSON.parse(options.gymInfo.replace(/%26/g, "&").replace(/%3F/g, "?").replace(/%3D/g, "="))
    tempSet.gymDetail = tempSet.gymDetail.replace(/钅/g, "\n").replace(/辶/g, "&emsp;&emsp;")
    this.setData({ gymInfo: tempSet})
    // this.setData({ gymInfo.gymPhoto: JSON.parse(options.gymInfo).gymPhoto.replace(" % 26", /\&/g).replace(" % 3F", /\?/g).replace(" % 3D", /\=/g) })


    this.setData({ type: options.type})
    var that = this
    var picList = []
    console.log("-----photo------")
    console.log(that.data.gymInfo.gymPhoto)
    // picList.push("https://6d65-meeu-0624-1259514512.tcb.qcloud.la/haoran1.jpg?sign=34b0b4ab7b82fe04ee3611dda5b7c735&t=1572490181")
    // picList.push("https://6d65-meeu-0624-1259514512.tcb.qcloud.la/haoran4.jpg?sign=1d656e1a5b4965b34ebcb917197cc00c&t=1573627212")
    // picList.push("https://6d65-meeu-0624-1259514512.tcb.qcloud.la/haoran3.jpg?sign=211beadf40549d5e82c6f82ec4b7a985&t=1572490217")
    // picList.push("https://6d65-meeu-0624-1259514512.tcb.qcloud.la/haoran5.jpg?sign=1f35dd495b9053c810e49220b8d385db&t=1573627242")
    picList = that.data.gymInfo.gymPhoto
    that.setData({
      picList: picList,
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
    this.setData({ icon: app.globalData.hasOwnProperty('phoneNumber') })

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