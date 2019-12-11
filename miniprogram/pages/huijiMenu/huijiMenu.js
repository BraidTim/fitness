// miniprogram/pages/huijiMenu/huijiMenu.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    huijiInfo:{},
    AList: [],
    icon:false,
    shareSwitch:0,

  },
  shareSwitchButton:function(event){
    if (this.data.shareSwitch==1){
      this.setData({
        shareSwitch: 0
      })
    }else{
      this.setData({
        shareSwitch: 1
      })
    }
  },
  toB:function(event){
    console.log("------AList------")
    console.log(this.data.AList)
    console.log("------toB------")
    console.log(event.currentTarget.dataset.hi)
    app.globalData.tempBList = this.data.AList[event.currentTarget.dataset.hi].BList
    console.log("--global BList--")
    console.log(app.globalData.tempBList)
    wx.navigateTo({
      url: '/pages/huijiBList/huijiBList',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      },
      success: function (res) {

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
  scanQRcode: function() {
    wx.scanCode({
      onlyFromCamera: true,
      success(ress) {
        console.log(ress)
        wx.cloud.callFunction({
          name: "cloudDb",
          data: {
            method: "select",
            datasetName: "buyInfo",
            orderId: ress.result.replace(/"/g, '')
          },
          success: function(res) {
            console.log('---!!!---')
            console.log(res)
            if (res.result.respond.data.length < 1) {
              wx.showToast({
                title: '二维码有误！',
                icon: "none"
              })
            } else if (res.result.respond.data[0].useState == 0) {
              wx.cloud.callFunction({
                name: "cloudDb",
                data: {
                  method: "update",
                  datasetName: "buyInfo",
                  orderId: res.result.respond.data[0].orderId,
                  newValue: {
                    useState: 1
                  }
                },
                success: function(res) {
                  wx.showToast({
                    title: '入场成功！',
                  })
                }
              })
            } else if (res.result.respond.data[0].useState == 1) {
              wx.showToast({
                title: '该二维码已使用！',
                icon: "none"

              })
            }
          }
        })
      }
    })
  },
  remind: function(event) {
    console.log(event)
    wx.cloud.callFunction({
      name: "message",
      data: {
        openid: event.currentTarget.dataset.openid,
        prepay_id: event.currentTarget.dataset.prepay
      },
      success: res => {
        console.log("message sent")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var that = this
    this.setData({ icon: app.globalData.hasOwnProperty('phoneNumber') })
    if(this.data.icon==true){
      
      wx.cloud.callFunction({
        name: "cloudDb",
        data: {
          method: "select",
          datasetName: "memberList",
          huijiPhoneNumber: app.globalData.phoneNumber
        },
        success: function (res) {
          console.log("-----res-----")
          console.log(res)
          console.log("---------------")
          that.setData({
            AList: res.result.respond.data
          })
          console.log("-----Alist-----")
          console.log(that.data.AList)
          console.log("---------------")

          var temp = []
          for (var i = 0; i < res.result.respond.data.length; i++) {
            temp.push([])
          }
          console.log("loop begin:")
          console.log(res.result.respond.data.length)
          console.log("---------------------------------")
          var inviteCodes = []
          for (var i = 0; i < res.result.respond.data.length; i++) {
            inviteCodes.push(res.result.respond.data[i].phoneNumber)
            //AList[i].BList=[]
            var index = "AList[" + i + "].BList"
            that.setData({ [index]: [] })
            var index2 = "AList[" + i + "].shared"
            that.setData({ [index2]: -1 })
          }

          console.log("-------inviteCodes-------:")
          console.log(inviteCodes)
          console.log("------------gym---------------------")
          console.log(app.globalData.huijiInfo)

          var index2 = "AList[" + i + "].shared"
          wx.cloud.callFunction({
            name: "cloudDb",
            data: {
              method: "select",
              datasetName: "shareInfo",
              phoneNumber: inviteCodes,
              include: 1
            },
            success: function (ress) {
              console.log("-------shareres-------:")
              console.log(ress)
              for (var j = 0; j < ress.result.respond.data.length; j++) {
                var why = that.data.AList.length
                for (var k = 0; k < why; k++) {

                  if (that.data.AList[k].phoneNumber == ress.result.respond.data[j].phoneNumber && app.globalData.huijiInfo.gym == ress.result.respond.data[j].gym) {
                    var index2 = "AList[" + k + "].shared"
                    that.setData({ [index2]: 0 })
                    // console.log("------tempList------")
                    // console.log(tempList)
                    // console.log(index)
                    // that.setData({ [index]: tempList})
                  }
                }
              }
              wx.cloud.callFunction({
                name: "cloudDb",
                data: {
                  method: "select",
                  datasetName: "buyInfo",
                  inviteCode: inviteCodes,
                  //gym: app.globalData.huijiInfo.gym,
                  include: 1
                },
                success: function (ress) {
                  console.log("-------Bres-------:")
                  console.log(ress)
                  console.log("---------------------------------")
                  for (var j = 0; j < ress.result.respond.data.length; j++) {
                    console.log("------AList length------")
                    console.log(that.data.AList)
                    var why = that.data.AList.length
                    for (var k = 0; k < why; k++) {
                      // console.log(k)
                      // //console.log(wtf[k].BList)
                      // console.log(ress.result.respond.data[j])
                      // var tempList = wtff.push(ress.result.respond.data[j])
                      // console.log("---tp---")
                      // console.log(tempList)
                      // // console.log("------tempList------") 
                      // // console.log(tempList) 
                      // // console.log(index) 
                      // // that.setData({ [index]: tempList}) 
                      // console.log("------compare------")
                      // console.log(that.data.AList[k].phoneNumber)
                      // console.log(ress.result.respond.data[j].inviteCode)

                      if (that.data.AList[k].phoneNumber == ress.result.respond.data[j].inviteCode) {
                        console.log("------in AList length------")
                        console.log(that.data.AList)
                        var index = "AList[" + k + "].BList"
                        var wtf = that.data.AList
                        var wtff = wtf[k].BList
                        console.log("------index wtf-----")
                        console.log(index)
                        console.log(k)
                        console.log(wtf[k].BList)
                        console.log(ress.result.respond.data[j])
                        var tempList = wtff.push(ress.result.respond.data[j])
                        console.log("---tp---")
                        console.log(tempList)
                        var index2 = "AList[" + k + "].shared"
                        var currentShared = wtf[k].shared + 1
                        console.log("---shared---")
                        console.log(wtf[k].shared)
                        that.setData({ [index2]: currentShared })
                        // console.log("------tempList------") 
                        // console.log(tempList) 
                        // console.log(index) 
                        // that.setData({ [index]: tempList}) 
                      }
                    }
                  }
                  //temp[tempI] = ress.result.respond.data 
                  // var tempA = that.data.AList[x] 

                  // var index = "AList[" + x + "].BList" 
                  // that.setData({ 
                  //   [index]: ress.result.respond.data 
                  // }) 
                  console.log("------AList------")
                  console.log(that.data.AList)
                }
                //temp[tempI] = ress.result.respond.data 
                // var tempA = that.data.AList[x] 

                // var index = "AList[" + x + "].BList" 
                // that.setData({ 
                //   [index]: ress.result.respond.data 
                // }) 
              })
            }
          })
          
          // while(1){
          //   var prepared = 1
          //   for (var i = 0; i < res.result.respond.data.length; i++) {
          //     if(temp[i].length == 0){
          //       prepared = 0
          //       break
          //     }
          //   }
          //   if(prepared ==1){
          //     break
          //   }
          // }

          // that.setData({ BList: temp })


        }
      })

    }
    

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
    this.setData({ icon: app.globalData.hasOwnProperty('phoneNumber') })

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