// miniprogram/pages/myInfo/myInfo.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    myInfo:"",
    sharedList:"",
    boughtList:"",
    dis:"block",
    dis2: "block",
  },
  showBuyHis: function (event) {
    if(this.data.dis=="block"){
      this.setData({ dis: "none" });
    }else{
      this.setData({ dis: "block" });
    }

  }  ,
  showShareHis: function (event) {
    if (this.data.dis2 == "block") {
      this.setData({ dis2: "none" });
    } else {
      this.setData({ dis2: "block" });
    }

  },
  tapShared:function(event){
    console.log(event.currentTarget.dataset.hi)
    wx.navigateTo({
      url: '/pages/shareToFriend/shareToFriend?inviteCode=' + app.globalData.phoneNumber + "&gym=" +          event.currentTarget.dataset.hi,
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      },
      success: function (res) {

      }
    })
  },
  tapBought:function(event){
    wx.navigateTo({
      url: '/pages/qrCode/qrCode?phoneNumber=' + this.data.phoneNumber + "&gym=" + event.currentTarget.dataset.hi,
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
  /**
   * 生命周期函数--监听页面加载
   */
  getSharedBoughtList:function(){
    var that = this
    wx.cloud.callFunction({
      name: "cloudDb",
      data: {
        method: "select",
        datasetName: "shareInfo",
        phoneNumber: app.globalData.phoneNumber
      },
      success: function (res) {
        console.log(res)

        that.setData({ sharedList: res.result.respond.data })
      }
    })
    wx.cloud.callFunction({
      name: "cloudDb",
      data: {
        method: "select",
        datasetName: "buyInfo",
        phoneNumber: app.globalData.phoneNumber
      },
      success: function (res) {
        console.log(res)

        that.setData({ boughtList: res.result.respond.data })
      }
    })
  },
  onLoad: function (options) {
    var that = this
    this.setData({myInfo:JSON.stringify(app.globalData.myInfo)})
    console.log("stopped?")
    this.getSharedBoughtList()
    
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
    this.getSharedBoughtList()

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