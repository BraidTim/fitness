// 云函数入口文件
// const sync = require('xd-synchttp');
const cloud = require('wx-server-sdk')
var querystring = require('querystring');
//https://api.weixin.qq.com/sns/jscode2session?appid=wx2c2bdfe3e7a50db2&secret=0a39303f761cda47c9d67febb87e42b4&js_code=' + code +'&grant_type=authorization_code
const https = require("https");
var http = require('http');

var myrequest = function (code) {
  return new Promise((resolve, reject) => {
    var html = ''
    https.get('https://api.weixin.qq.com/sns/jscode2session?appid=wx2c2bdfe3e7a50db2&secret=0a39303f761cda47c9d67febb87e42b4&js_code=' + code +'&grant_type=authorization_code', function (res) {

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
    log+='error'
    
  });
  })
}
cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  var html = ''
  var log = ''
  //html = sync.http_get('http://www.csdn.net', 0);
  var temp = await myrequest(event.code)
  // await https.get('https://api.weixin.qq.com/sns/jscode2session?appid=wx2c2bdfe3e7a50db2&secret=0a39303f761cda47c9d67febb87e42b4&js_code=' + event.code +'&grant_type=authorization_code', function (res) {
  //   log+=res

  //   res.on('data', function (data) {
  //     html += data;
  //   });

  //   res.on('end', function () {
  //     console.log(html);
  //   });
  // }).on('error', function () {
  //   console.log('出错！');
  //   log+='error'
  // });
  
  return {
    temp:temp,
    html:html,
    log:log
  }
}



