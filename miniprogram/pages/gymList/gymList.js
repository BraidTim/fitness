// miniprogram/pages/gymList/gymList.js

const app = getApp()
const db = wx.cloud.database()


Page({

  /**
   * 页面的初始数据
   */
  data: {
    gymListSellInfo : [],
    gymListBuyInfo: [],
    phone:"",
    address:"",
    x:function(e){console.log(e)},
    buyColor:"orange",
    shareColor:"white",
    inviteModule:"block",
    sellList:"none",

    buyList: "block",
    icon:false,
    inviteCode:"",
  },
  clickShare: function (event) {
    this.setData({ buyColor: "white" })
    this.setData({ shareColor: "orange" })
    this.setData({ inviteModule: "none" })
    this.setData({ sellList: "block" })
    this.setData({ buyList: "none" })



  },
  clickBuy: function (event) {
    this.setData({ buyColor: "orange" })
    this.setData({ shareColor: "white" })
    this.setData({ inviteModule: "block" })
    this.setData({ sellList: "none" })
    this.setData({ buyList: "block" })



  },
  clickGymSell:function(event){
    var that = this
    console.log(event.currentTarget.dataset.hi)
    console.log(JSON.stringify(event))
    console.log(this)
    console.log(that.data)
    var tempName = event.currentTarget.dataset.hi
    var tempGymInfo = {}
    for (var i = 0; i < that.data.gymListSellInfo.length; i++){
      console.log(tempName )
      console.log(that.data.gymListSellInfo[i].gymName)
      if (tempName == that.data.gymListSellInfo[i].gymName){
        tempGymInfo = that.data.gymListSellInfo[i]
        console.log("-------------------------------------")

        console.log(tempGymInfo)

        console.log(JSON.stringify(tempGymInfo).replace(/\&/g, "%26"))
        break
      }
    }
    wx.navigateTo({
      url: '/pages/gymDetail/gymDetail?gymInfo=' + JSON.stringify(tempGymInfo).replace(/\&/g, "%26").replace(/\?/g, "%3F").replace(/\=/g, "%3D")+"&type=sell",
    })
  },
  clickGymBuy: function (event) {
    var that = this
    console.log(event.currentTarget.dataset.hi)
    console.log(JSON.stringify(event))
    console.log(this)
    console.log(that.data)
    var tempName = event.currentTarget.dataset.hi
    var tempGymInfo = {}
    for (var i = 0; i < that.data.gymListBuyInfo.length; i++) {
      console.log(tempName)
      console.log(that.data.gymListBuyInfo[i].gymName)
      if (tempName == that.data.gymListBuyInfo[i].gymName) {
        tempGymInfo = that.data.gymListBuyInfo[i]
      }
    }
    wx.navigateTo({
      url: '/pages/gymDetail/gymDetail?gymInfo=' + JSON.stringify(tempGymInfo).replace(/\&/g, "%26").replace(/\?/g, "%3F").replace(/\=/g, "%3D") + "&type=Buy",
    })
  },
  search: function (e) {
    var that = this
    console.log("before")
    console.log(e)
    console.log(that.data.inviteCode)
    this.setData({ inviteCode: e.detail.value.inviteCode })
    console.log("after")
    console.log(that.data.inviteCode)
    app.globalData.inviteCode = e.detail.value.inviteCode
    wx.cloud.callFunction({
      name: "phoneEncrypt",
      data: {
        phoneNumber: that.data.inviteCode,
        method: 2
      },
      success: function (res) {
        console.log(res)
        var decryptedCode = res.result.decryptedPhone
        wx.cloud.callFunction({
          name: "cloudDb",
          data: {
            datasetName: "shareInfo",
            method: "select",
            phoneNumber: decryptedCode
          },
          success: res => {
            if (res.result.respond.data.length == 0) {
              wx.showToast({
                title: "未查到该邀请码的分享信息，请重试",
                icon: "none"
              })
              //
            } else {
              var gyms = []
              var tempItem = []
              var huijiPhoneNumber = res.result.respond.data[0].huijiPhoneNumber
              app.globalData.huijiPhoneNumberBuy = huijiPhoneNumber
              console.log("huijiPhoneNumber Buy")
              console.log(app.globalData.huijiPhoneNumberBuy)
              for (var i = 0; i < res.result.respond.data.length; i++) {
                gyms.push(db.command.eq(res.result.respond.data[i].gym))
              }
              console.log(gyms)
              db.collection("gymList").where({ gymName: db.command.or(gyms) }).get({
                success: function (res) {
                  console.log(res)
                  that.setData({ gymListBuyInfo: res.data })
                  console.log(that.getDate.x(1))
                }
              })
            }

          },
          fail: res => {
            console.log(that.data.inviteCode.substring(0, 11))
          }


        })
      }
    })
    
  },
  toLogin: function (event) {
    wx.navigateTo({
      url: '/pages/index/index',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      },
      success: function (res) {

      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.setData({ icon: app.globalData.hasOwnProperty('phoneNumber') })
    if(this.data.icon){
      var that = this
      this.setData({ inviteCode: options.inviteCode })

      console.log(app.globalData)
      wx.cloud.callFunction({
        name: "cloudDb",
        data: {
          method: "select",
          datasetName: "memberList",
          phoneNumber: app.globalData.phoneNumber
        },
        success: res => {
          console.log(res)
          var tempRes = res
          var gyms = []
          
          for (let i = 0; i < res.result.respond.data[0].vipGymList.length; i++) {
            gyms.push(db.command.eq(res.result.respond.data[0].vipGymList[i]))
          }
          console.log("gyms:")
          console.log(gyms)
          db.collection("gymList").where({ gymName: db.command.or(gyms) }).get({
            success: function (res) {
              console.log(res)
              that.setData({ gymListSellInfo: res.data })
              console.log('----------------------')
              console.log(that.data)
            }
          })


          // wx.cloud.callFunction({
          //   name: "cloudDb",
          //   data: {
          //     method: "select",
          //     datasetName: "gymList",
          //     name: db.command.or(gyms)
          //   },
          //   success:function(res){
          //     console.log(res)
          //     that.setData({gymListInfo:res.result.respond.data})
          //   }
          // })
        }
      })
    }
    
    
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function (options) {
    this.setData({ icon: app.globalData.hasOwnProperty('phoneNumber') })
    if (this.data.icon) {
      var that = this
      this.setData({ inviteCode: options.inviteCode })

      console.log(app.globalData)
      wx.cloud.callFunction({
        name: "cloudDb",
        data: {
          method: "select",
          datasetName: "memberList",
          phoneNumber: app.globalData.phoneNumber
        },
        success: res => {
          console.log(res)
          var tempRes = res
          var gyms = []
          for (let i = 0; i < res.result.respond.data[0].vipGymList.length; i++) {
            gyms.push(db.command.eq(res.result.respond.data[0].vipGymList[i]))
          }
          console.log("gyms:")
          console.log(gyms)
          db.collection("gymList").where({ gymName: db.command.or(gyms) }).get({
            success: function (res) {
              console.log(res)
              that.setData({ gymListSellInfo: res.data })
              console.log('----------------------')
              console.log(that.data)
            }
          })


          // wx.cloud.callFunction({
          //   name: "cloudDb",
          //   data: {
          //     method: "select",
          //     datasetName: "gymList",
          //     name: db.command.or(gyms)
          //   },
          //   success:function(res){
          //     console.log(res)
          //     that.setData({gymListInfo:res.result.respond.data})
          //   }
          // })
        }
      })
    }

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