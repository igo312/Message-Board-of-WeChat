// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  // API 调用都保持和云函数当前所在环境一致
  env: cloud.DYNAMIC_CURRENT_ENV
})

// 云函数入口函数
exports.main = async (event, context) => {
  const db = cloud.database()
  const dbc = db.command
  try{
    if(typeof(event.lIdx)=="number"){
      return await db.collection("comments-"+event.idx).where({
        _id:dbc.eq(event.ipx)
      }).update({
        data:{
          leaveMessage:event.res 
        }
      }).then(console.log('delete leaveMessage from comments successfully')).catch(e=>{throw e})
    }else{
      return await db.collection("comments-"+event.idx).where({
      _id:dbc.eq(event.ipx)
      }).remove().
      then(console.log("delete database successfully")).catch(e=>{throw e})
    }
  }catch(e){
    console.error(e)
  }
}