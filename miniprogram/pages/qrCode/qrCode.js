var QRCode = require('./weAppQrcode.js');
var qrcode;
const app = getApp()
Page({
  data:{
    inviteCode:"",
    phoneNumber:"",
    gym:"",
    buyDate:"",
    message:"正在搜索分享记录",
    payState:"waiting",
    useState:"waiting",
    gymAddress:"",
    gymPhone:""
  },
  toCall: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.gymInfo.gymPhone //仅为示例，并非真实的电话号码
    })
  },
  toMap: function () {
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
  backHome: function (option) {
    wx.navigateTo({
      url: '/pages/loggedIndex/loggedIndex',
      events: {
        // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
      },
      success: function (res) {

      }
    })
  },
  onLoad: function (option) {
    console.log(option)
    this.setData({phoneNumber:option.phoneNumber.substring(0,11)})
    var that = this
    wx.cloud.callFunction({
      name: "cloudDb",
      data: {
        method: "select",
        datasetName: "buyInfo",
        phoneNumber: app.globalData.phoneNumber,
        gym:option.gym
      },
      success: res => {
        console.log(res)
        if(res.result.respond.data.length==0){
          that.setData({message:"暂无分享记录"})
          
        } else if (res.result.respond.data[0].payState="1"){

          that.setData({ message: "已查到分享记录" })

          console.log("DDF")
          console.log(option)
          this.setData({ inviteCode: res.result.respond.data[0].inviteCode })
          this.setData({ phoneNumber: res.result.respond.data[0].phoneNumber })
          this.setData({ gym: res.result.respond.data[0].gym })
          this.setData({ payState: res.result.respond.data[0].payState })

          this.setData({ useState: res.result.respond.data[0].useState })
          this.setData({ buyDate: res.result.respond.data[0].buyDate })


          const eventChannel = this.getOpenerEventChannel()
          // eventChannel.emit('acceptDataFromOpenedPage', { data: 'test' });
          // eventChannel.on('acceptDataFromOpenerPage', function (data) {
          //   console.log(data)
          // })
          qrcode = new QRCode('canvas', {
            text: JSON.stringify(res.result.respond.data[0].orderId),
            width: 150,
            height: 150,
            colorDark: "#000000",
            colorLight: "#ffffff",
            correctLevel: QRCode.CorrectLevel.H,
          });
          wx.cloud.callFunction({
            name: "cloudDb",
            data: {
              method: "select",
              datasetName: "gymList",
              gymName: that.data.gym
            },
            success: res => {
              that.setData({ gymAddress: res.result.respond.data[0].gymAddress })
              that.setData({ gymPhone: res.result.respond.data[0].gymPhone })
            }
          })
          //qrcode.makeCode(JSON.stringify(res.result.respond.data[0]));  //用元素对应的code更新二维码
        }
      }
    })


    
  },
  check:function(e){
    wx.cloud.callFunction({
      name:"orderCheck"
    })
  },
  tapHandler: function (e) {
    
  }
});