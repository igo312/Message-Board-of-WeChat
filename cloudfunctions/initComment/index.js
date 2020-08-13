// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  await db.createCollection("comments-"+event.idx)
  await db.collection("comments-"+event.idx).add({
    data:event.initData
  }).catch(console.error)
  return 
}

