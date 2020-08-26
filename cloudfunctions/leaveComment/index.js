// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database();
  const dbc = db.command;
  return db.collection("comments-"+event.idx).where({
    _id:dbc.eq(event.ownerId)
  }).update({
    data:{
      leaveMessage:event.LM
    }
  }).then(
    console.log("更新评论成功")
  ).catch(
    console.log("更新评论失败")
  )
  
}