// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const dbc = db.command
  try{
    return await db.collection("comments-"+event.idx).where({
     _id:dbc.eq(event.ipx)
    }).remove().
    then(console.log("delete database successfully")).catch(e=>{throw e})
  }catch(e){
    console.error(e)
  }
}