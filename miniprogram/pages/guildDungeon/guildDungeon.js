Page({
  showList: function(e) {
    wx.navigateTo({
      url: '/pages/dungeonList/dungeonList',
      events: {
        // acceptDataFromOpenedPage: function (data) {
        //   console.log(data)
        // }
      },
      success: function(res) {
        // res.eventChannel.emit('acceptDataFromOpenerPage', {
        //   inviteCode:that.data.inviteCode,pnhoneNumber:that.data.phoneNumber, gym:that.data.gym.value})
      }
    })
  },
  formSubmit: function(e) {
    console.log('form发生了submit事件，携带数据为：', e.detail.value)
    wx.cloud.callFunction({
      name: 'cloudDb',
      data: {
        method: "select",
        datasetName: "guildDungeon",
        name: e.detail.value.name,
      },
      success: res => {
        if (res.result.respond.data.length == 0) {
          wx.cloud.callFunction({
            name: 'cloudDb',
            data: {
              method: "insert",
              datasetName: "guildDungeon",
              name: e.detail.value.name,
              class: e.detail.value.class,
              dungeon: e.detail.value.dungeon,
              time: e.detail.value.time,
            },
            success: res => {
              wx.navigateTo({
                url: '/pages/dungeonList/dungeonList',
                events: {
                  // acceptDataFromOpenedPage: function (data) {
                  //   console.log(data)
                  // }
                },
                success: function(res) {
                  // res.eventChannel.emit('acceptDataFromOpenerPage', {
                  //   inviteCode:that.data.inviteCode,pnhoneNumber:that.data.phoneNumber, gym:that.data.gym.value})
                }
              })
            }
          })
        } else {
          wx.cloud.callFunction({
            name: 'cloudDb',
            data: {
              method: "update",
              datasetName: "guildDungeon",
              name: e.detail.value.name,
              newValue: {
                dungeon: e.detail.value.dungeon,
                time: e.detail.value.time,

              }
            },
            success: res => {
              wx.navigateTo({
                url: '/pages/dungeonList/dungeonList',
                events: {
                  // acceptDataFromOpenedPage: function (data) {
                  //   console.log(data)
                  // }
                },
                success: function(res) {
                  // res.eventChannel.emit('acceptDataFromOpenerPage', {
                  //   inviteCode:that.data.inviteCode,pnhoneNumber:that.data.phoneNumber, gym:that.data.gym.value})
                }
              })
            }
          })

        }
      }
    })

  },
  formReset: function() {
    console.log('form发生了reset事件')
  }
})