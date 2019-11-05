// import md5 from './md5'
// var md5 = require('./md5')
var crypto = require('crypto');

// 云函数入口文件
const cloud = require('wx-server-sdk')
const secretKey = '0a39303f761cda47c9d67febb87e42b4'
const https = require("https");
var http = require('http');

cloud.init()
var select = function(e){
  return new Promise((resolve, reject) => {
    
    //delete userInfo
    const db = cloud.database()
    console.log(e)
    if(e!=0){
      console.log("in")
      db.collection("buyInfo").where({
        // data 字段表示需新增的 JSON 数据

        payState: "0",
        orderId:e.toString()
         

      }).get().then((res) => { console.log(res);resolve(res) })
    }else{
      db.collection("buyInfo").where({
        // data 字段表示需新增的 JSON 数据

        payState: "0"

      }).get().then((res) => { resolve(res) })
    }
    
    
  }
)}
var update = function (option) {
  return new Promise((resolve, reject) => {

    //delete userInfo
    const db = cloud.database()
    console.log("---------------")
    console.log(option)
    db.collection("buyInfo").where({orderId:option.orderId}).update({
      data: {payState:"1"}
    }).then((res) => { resolve(res) })

  })
}
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

var xmlReaderSyn = function (code) {
  return new Promise((resolve, reject) => {
    var xmlreader = require("xmlreader");
    xmlreader.read(code, function (errors, response) {
      if (null !== errors) {
        console.log(errors)
        return;
      }
      console.log(response.xml.trade_state.text());
      // console.log(response);
      resolve(response.xml.trade_state.text())
    });
  })
}
var myrequest2 = function (code) {
  return new Promise((resolve, reject) => {
    const request = require('request')
    request.post('https://api.mch.weixin.qq.com/pay/orderquery', {
      json: code
    }, async function (error, res, body) {
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
    str += arr[i] + "=" + obj[arr[i]] + "&";
  }
  str += "key=zdi50hfalouehqg0983508wbwlfnfls8"
  console.log(str)
  // var utilMd5 = require('./md5.js');
  // var encrypted = utilMd5.hexMD5(str + secret); 
  var md5 = crypto.createHash('md5');
  var encrypted = md5.update(str).digest('hex')
  // var encrypted = new md5(str + secret);
  return encrypted;
}
// ---------------------
//   作者：武当山道士
// 来源：CSDN
// 原文：https://blog.csdn.net/abs1004/article/details/79105046 
// 版权声明：本文为博主原创文章，转载请附上博文链接！

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var sel = await select(0|event.orderId)
  console.log(0 | event.orderId)
  console.log(sel)
  if(sel.data.length==0){
    console.log("no new record")
    return
  }
  var orderId = sel.data[0].orderId


  var tsorder = Math.floor(Date.now() / 1000).toString()
  var signString = {
    appid: "wx2c2bdfe3e7a50db2",
    mch_id: "1543142891",
    out_trade_no: orderId,
    nonce_str: "q1w2e3r4t5y6zaxscdvfbgnh",
    sign_type: "MD5"
  }
  // var encrypted = md5.update(signString).digest('hex');
  var encrypted = sign(signString)
  var xmlString = "<xml>" + "<appid>" + "wx2c2bdfe3e7a50db2" + "</appid>"
    + "<mch_id>" + "1543142891" + "</mch_id>"
    + "<nonce_str>" + "q1w2e3r4t5y6zaxscdvfbgnh" + "</nonce_str>"
    + "<out_trade_no>" + orderId + "</out_trade_no>"
    + "<sign_type>" + "MD5" + "</sign_type>"
    + "<sign>" + encrypted.toUpperCase() + "</sign>"
    + "</xml>";

  console.log(xmlString)

  var payResult = await myrequest2(xmlString)
  if (payResult=="SUCCESS"){
    var log = await update(orderId)
  }


  return {
    sel,
    log,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}