// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  var dict = ['S', 'B', 'R', 'D', 'X', 'F', 'V', 'H', 'N', 'K']
  var dict2 = {'S':0,'B':1,'R':2,'D':3,'X':4,'F':5,'V':6,'H':7,'N':8,'K':9}
  var phone = ''
  if(event.method==1){
    phone = event.phoneNumber.split('')
    var encryptedPhone = ['', '', '', '', '', '', '', '', '', '']
    for (var i = 0; i < 10; i++) {
      if (i % 2 == 0) {
        encryptedPhone[9 - i] = dict[phone[i + 1]]

      } else {
        encryptedPhone[9 - i] = phone[i + 1]
      }
    }
    encryptedPhone = encryptedPhone.join('')
    return {
      encryptedPhone,
    }
  }else{
    phone = event.phoneNumber.split('')
    var decryptedPhone = ['', '', '', '', '', '', '', '', '', '']
    for (var i = 0; i < 10; i++) {
      if (i % 2 != 0) {
        decryptedPhone[9 - i] = dict2[phone[i]]

      } else {
        decryptedPhone[9 - i] = phone[i]
      }
    }
    decryptedPhone = decryptedPhone.join('')
    decryptedPhone = '1' + decryptedPhone
    return {
      decryptedPhone,
    }
  }
  
}