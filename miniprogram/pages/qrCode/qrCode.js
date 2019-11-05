var QRCode = require('./weAppQrcode.js');
var qrcode;

Page({
  data:{
    inviteCode:"",
    phoneNumber:"",
    gym:"",
    date:"9102-07-04",
    message:"正在搜索分享记录"
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
        phoneNumber: that.data.phoneNumber.substring(0,11),
        payState:"1",
        useState:"0"
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