let app = getApp();
var code =""
Page({
  data: {
    img: "/images/dh.gif",
    inviteCode:"",
    gym:[]
  },
  onLoad(option) {
    this.setData({inviteCode:option.inviteCode})
    this.setData({ gym: option.gym })

    console.log("naviData")
    console.log(option.inviteCode)
    code = option.inviteCode
  },
  showShareMenu() {
    wx.showShareMenu();
    console.log("显示了当前页面的转发按钮");
  },
  hideShareMenu() {
    wx.hideShareMenu();
    console.log("隐藏了当前页面的转发按钮");
  },
  onShareAppMessage: (res) => {
    //var that = this
    var tempPath = '/pages/buy/buy?inviteCode=' + code
    if (res.from === 'button') {
      console.log("来自页面内转发按钮");
      console.log(res.target);
    }
    else {
      console.log("来自右上角转发菜单")
    }
    return {
      title: '共享健身',
      path: tempPath,
      imageUrl: "/images/1.jpg",
      success: (res) => {
        console.log("转发成功", res);
      },
      fail: (res) => {
        console.log("转发失败", res);
      }
    }
  }
})