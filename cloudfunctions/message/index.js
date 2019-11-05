const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  try {
    console.log("recieved message")
    console.log(event)
    const result = await cloud.openapi.templateMessage.send({
      touser: event.openid,
      page: 'index',
      data: {
        keyword1: {
          value: event.prepay_id
        },
        keyword2: {
          value: "0.2 RMB"
        },
        keyword3: {
          value: Date()
        },
        keyword4: {
          value: '广州市海珠区新港中路397号'
        }
      },
      templateId: 'wIBVzV5E6ynjHQ0FrKkeQtHwCuSe4brp24zLHLSrvxM',
      formId: event.prepay_id,
      emphasisKeyword: 'keyword1.DATA'
    })
    console.log(result)
    return result
  } catch (err) {
    console.log(err)
    return err
  }
}
