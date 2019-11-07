// miniprogram/pages/share/share.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    phoneNumber:"手机号码",
    phoneH3:"",
    phoneT4:"",
    items: [
      { name: 'USA', value: '获取您的手机后能查到你持有会员的健身房' }
    ],
    gym:[],
    shareToFriend:"",
    shareDisable:true,
    HJPhoneNumber:""
  },
  
  checkboxChange: function (e) {
    console.log('checkbox发生change事件，携带value值为：', e.detail.value)
  },
  gymList:res=>{
    wx.navigateTo({
      url: '/pages/gymList/gymList',
    })
  },
  formSubmit: function(e){
    console.log("LookHere:" + e.detail.value.checkBox)
    const db = wx.cloud.database()
    var that = this
    if (e.detail.value.checkBox.length==0){
      wx.showToast({
        title: '请选择一个健身房',
        icon: 'none'
      })
      return
    }
    wx.cloud.callFunction({
      name: 'cloudDb',
      data: {
        method: "select",
        datasetName: "shareInfo",
        phoneNumber: that.data.phoneNumber.substring(0, 11)
      },
      success:res=>{
        if(res.result.respond.data.length!=0){
          wx.showToast({
            title: '您已有分享记录，新纪录已覆盖旧记录',
            icon:"none"
          })
          wx.cloud.callFunction({
            name:"cloudDb",
            data:{
              datasetName: "shareInfo",
              method:"delete",
              phoneNumber: that.data.phoneNumber.substring(0, 11)
            }            
          })
        }
        that.setData({ gym: e.detail.value.checkBox })
        wx.cloud.callFunction({
          name: 'cloudDb',
          data: {
            method: "insert",
            datasetName: "shareInfo",
            phoneNumber: that.data.phoneNumber.substring(0, 11),
            gym: e.detail.value.checkBox,
            HJPhoneNumber:that.data.HJPhoneNumber
          },
          success: res => {
            wx.showToast({
              title: '分享成功',
            })
            that.setData({ shareToFriend: "分享" })
            wx.navigateTo({
              url: '/pages/shareToFriend/shareToFriend?inviteCode=' + that.data.phoneNumber.substring(0, 11) + "&gym=" + that.data.gym,
              events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
              },
              success: function (res) {

              }
            })
          }
        })
      }
    })



    
  },
  showRecord:function(e){
    var that = this
    console.log("!@!:"+that)
    wx.cloud.callFunction({
      name:"cloudDb",
      data:{
        method:"select",
        datasetName:"shareInfo",
        phoneNumber:that.data.phoneNumber.substring(0,11)
      },
      success:res=>{
        if(res.result.respond.data.length==0){
          wx.showToast({
            title: '无分享记录',
          })
        }else{
          that.setData({ gym: res.result.respond.data[0].gym })

          wx.navigateTo({
            url: '/pages/shareToFriend/shareToFriend?inviteCode=' + that.data.phoneNumber.substring(0, 11) + "&gym=" + that.data.gym,
            events: {
              // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            },
            success: function (res) {
              // 通过eventChannel向被打开页面传送数据

            }
          })
        }
      }
    })
  },
  getPhoneNumber(e) {
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
        that.setData({ phoneH3: res.result.x.phoneNumber.substring(0,3) })
        that.setData({ phoneT4: res.result.x.phoneNumber.substring(7,11) })


        const db = wx.cloud.database()
        console.log("???")
        // 查询当前用户所有的 counters
        console.log("query:")
        console.log(that.data.phoneNumber)
        wx.cloud.callFunction({
          name:'cloudDb',
          data:{
            
            method: 'select',
            datasetName: 'vip',
            phoneNumber: that.data.phoneNumber
          
          },
          success:res=>{
            console.log(res)
            if (res.result.respond.data.length==0){
              
            }else{
              var gym = res.result.respond.data[0].gym
              var tempItem = []
              for (var i = 0; i < gym.length; i++) {
                tempItem.push({ name: gym[i], value: gym[i] })
              }
              that.setData({
                items: tempItem
              })
              that.setData({shareDisable:false})
              that.setData({HJPhoneNumber:res.result.respond.data[0].HJPhoneNumber})
            }
            
          },
          fail:res=>{
            console.log("why failed:")
            console.log(res)
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
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this
    console.log("### openid sent:" + app.globalData.openid)
    wx.cloud.callFunction({
      name:"cloudDb",
      data:{
        method:"select",
        datasetName:"vip",
        openid:app.globalData.openid
      },
      success:res=>{
        if (res.result.respond.data[0].hasOwnProperty("phoneNumber")!=false){
          that.setData({ phoneNumber: res.result.respond.data[0].phoneNumber+"(saved)"})
          that.setData({ phoneH3: res.result.respond.data[0].phoneNumber.substring(0, 3) })
          that.setData({ phoneT4: res.result.respond.data[0].phoneNumber.substring(7, 11) })

          const db = wx.cloud.database()
          wx.cloud.callFunction({
            name: 'cloudDb',
            data: {

              method: 'select',
              datasetName: 'vip',
              phoneNumber: res.result.respond.data[0].phoneNumber

            },
            success: res => {
              console.log(res)
              var gym = res.result.respond.data[0].gym
              var tempItem = []
              for (var i = 0; i < gym.length; i++) {
                tempItem.push({ name: gym[i], value: gym[i] })
              }
              that.setData({
                items: tempItem
              })
              that.setData({ shareDisable: false })
              that.setData({ HJPhoneNumber: res.result.respond.data[0].HJPhoneNumber })


            },
            fail: res => {
              console.log("why failed:")
              console.log(res)
            }
          })
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