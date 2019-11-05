// miniprogram/pages/admin/admin.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    title:"",
    log:"扫码信息结果显示",
    buyerPhoneNumber:"",
    sharerPhoneNumber:"",
    gym:"",
    orderId:"",
    auth:false,
    phoneNumber:""
  },
  shareInfo:function(){
    
    wx.navigateTo({
      url: '../huijiShareInfo/huijiShareInfo?phoneNumber=' + this.data.phoneNumber,
    })
  },
  buyInfo: function (){
    console.log(this.data)
    wx.navigateTo({
      url: '../huijiBuyInfo/huijiBuyInfo?phoneNumber=' + this.data.phoneNumber,
    })
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
        wx.cloud.callFunction({
          name:"cloudDb",
          data:{
            method:"update",
            datasetName:"huijiInfo",
            phoneNumber: res.result.x.phoneNumber,            
            newValue: { openid: app.globalData.openid }
          },
          success:res=>{
            that.onLoad()
          }
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
  enter:function(){
    var that = this
    wx.cloud.callFunction({
      name:"cloudDb",
      data:{
        method:"update",
        datasetName:"buyInfo",
        orderId:that.data.orderId,
        newValue:{useState:"1"}
      },
      success:res=>{
        wx.showToast({
          title: '确认成功',
        })
      }
    })
  },
  scan:function(res){
    var that = this
    wx.scanCode({
      success(res) {
        console.log(res)
        that.setData({log:res.result})
        wx.cloud.callFunction({
          name:"cloudDb",
          data:{
            method: "select",
            datasetName: "buyInfo",
            phoneNumber: res.result.phoneNumber,
            payState: "1",
            useState: "0",
          },
          
          success:res=>{
            that.setData({buyerPhoneNumber:res.result.respond.data[0].buyerPhoneNumber})
            that.setData({ sharerPhoneNumber: res.result.respond.data[0].sharerPhoneNumber })
            that.setData({ gym: res.result.respond.data[0].gym })
            that.setData({ orderId: res.result.respond.data[0].orderId })


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
    console.log(this)
    wx.cloud.callFunction({
      name:"cloudDb",
      data:{
        method:"select",
        datasetName:"huijiInfo",
        openid: app.globalData.openid
      },
      success:res=>{
        if(res.result.respond.data.length!=0){
          that.setData({ gym: res.result.respond.data[0].gym})
          that.setData({ phoneNumber: res.result.respond.data[0].phoneNumber })
          that.setData({ name: res.result.respond.data[0].name })

          that.setData({ title: res.result.respond.data[0].gym + "会籍:" + res.result.respond.data[0].name + "(" + res.result.respond.data[0].phoneNumber+")"+",您好！"})
          that.setData({auth:true})
        }else{
          that.setData({ title: "请授权查询您的会籍信息！" })
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