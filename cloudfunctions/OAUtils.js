/*
1.获取当前文章页面的id返回给小程序
2.（监听）当公众号的文章列表更新时，添加项目
*/

// 云函数入口文件
const cloud = require('wx-server-sdk') //这是一个帮助我们在云函数中操作数据库、存储以及调用其他云函数的微信提供的库

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()

  return {
    event,
    openid: wxContext.OPENID,
    appid: wxContext.APPID,
    unionid: wxContext.UNIONID,
  }
}