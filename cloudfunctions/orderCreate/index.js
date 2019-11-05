// import md5 from './md5'
// var md5 = require('./md5')
var crypto = require('crypto');

// 云函数入口文件
const cloud = require('wx-server-sdk')
const secretKey = '0a39303f761cda47c9d67febb87e42b4'
const https = require("https");
var http = require('http');

cloud.init()

var myrequest = function (code) {
  return new Promise((resolve, reject) => {
    var html = ''
    https.get('https://api.weixin.qq.com/sns/jscode2session?appid=wx2c2bdfe3e7a50db2&secret=0a39303f761cda47c9d67febb87e42b4&js_code=' + code + '&grant_type=authorization_code', function (res) {

      res.on('data', function (data) {
        html += data;
      });

      res.on('end', function () {
        console.log('-----------')
        console.log(res);
        console.log('-----------')
        resolve(html)
      });
    }).on('error', function () {
      console.log('出错！');
      log += 'error'

    });
  })
}

var xmlReaderSyn = function (code){
  return new Promise((resolve, reject) => {
    var xmlreader = require("xmlreader");
    xmlreader.read(code, function (errors, response) {
      if (null !== errors) {
        console.log(errors)
        return;
      }
      console.log(response.xml.prepay_id.text());
      // console.log(response);
      resolve(response.xml.prepay_id.text())
    });
  })
}
var myrequest2 = function(code){
  return new Promise((resolve, reject) => {
    const request = require('request')
    request.post('https://api.mch.weixin.qq.com/pay/unifiedorder', {
      json: code
    }, async function (error, res, body)  {
      if (error) {
        console.error(error)
        return
      }
      console.log(`statusCode: ${res.statusCode}`)
      console.log(body)
      var temp = await xmlReaderSyn(body)
      resolve(temp)
    })
  })
}
function sign(obj) {
  if (!obj) { console.log('需要加密的数组对象为空') }
  var str = '';
  var secret = "zdi50hfalouehqg0983508wbwlfnfls8";
  if (!secret) { console.log('密钥未获取'); }
  //生成key升序数组
  var arr = Object.keys(obj);
  arr.sort();
  for (var i in arr) {
    str += arr[i] + "="+obj[arr[i]]+"&";
  }
  str +="key=zdi50hfalouehqg0983508wbwlfnfls8"
  console.log(str)
  // var utilMd5 = require('./md5.js');
  // var encrypted = utilMd5.hexMD5(str + secret); 
  var md5 = crypto.createHash('md5');
  var encrypted = md5.update(str).digest('hex')
  // var encrypted = new md5(str + secret);
  return encrypted;
}

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  console.log("!!!event!!!")
  console.log(event)

  var tsorder = Math.floor(Date.now() / 1000).toString() 
  var fee_option = "1"
  var signString = {
    appid: "wx2c2bdfe3e7a50db2",
    body:"simple describe xxx",
    mch_id: "1543142891",
    nonce_str : "q1w2e3r4t5y6zaxscdvfbgnh",
    notify_url: "http://www.weixin.qq.com/wxpay/pay.php",
    openid: event.userInfo.openId,
    out_trade_no: tsorder,
    spbill_create_ip: "121.32.128.81",
    total_fee: fee_option,
    trade_type:"JSAPI"
  }
  // var encrypted = md5.update(signString).digest('hex');
  var encrypted = sign(signString)
  var xmlString = "<xml>" + "<appid>" + "wx2c2bdfe3e7a50db2" + "</appid>"
    + "<body><![CDATA[" + "simple describe xxx" + "]]></body>"
    + "<mch_id>" + "1543142891" + "</mch_id>"
    + "<nonce_str>" + "q1w2e3r4t5y6zaxscdvfbgnh" + "</nonce_str>"
    + "<notify_url>" + "http://www.weixin.qq.com/wxpay/pay.php" + "</notify_url>"
    + "<openid>" + event.userInfo.openId + "</openid>"
    + "<out_trade_no>" + tsorder + "</out_trade_no>"
    + "<spbill_create_ip>" + "121.32.128.81" + "</spbill_create_ip>"
    + "<total_fee>" + fee_option + "</total_fee>"
    + "<trade_type>" + "JSAPI" + "</trade_type>"
    + "<sign>" + encrypted.toUpperCase() + "</sign>"
    + "</xml>";

  console.log(xmlString)
  var encrypted = await myrequest2(xmlString)


  //第二次sign
  console.log(Math.floor(Date.now() / 1000).toString())
  var ts = Math.floor(Date.now() / 1000).toString() 
  var signString2 = {
    appId: "wx2c2bdfe3e7a50db2",
    timeStamp: ts,
    nonceStr: "5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
    package: "prepay_id=" + encrypted,
    signType: "MD5"
  }
  console.log(signString2)
  var encrypted2 = sign(signString2)

  return {
    prepay_id: encrypted,
    paySign: encrypted2.toUpperCase(),
    timeStamp: Math.floor(Date.now() / 1000).toString() ,
    nonceStr:"5K8264ILTKCH16CQ2502SI8ZNMTM67VS",
    orderId: tsorder,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}