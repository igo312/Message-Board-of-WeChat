// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env:cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database()
// 云函数入口函数
exports.main = async (event, context) => {
  
  // 更新点赞数
  const comments = event.comments;
  const dbc = db.command;
  const task = [];
  for(let i=0; i<comments.length; i++){
    console.log(`id is ${i} ${comments[i].upInfo}`)
    const promise = db.collection("comments-"+event.idx).where({
      _id:dbc.eq(comments[i]._id)
    }).update({
      data:{
        upInfo:dbc.set({
          "upUserList":comments[i].upInfo.upUserList,
          "upNum":comments[i].upInfo.upNum,
        }),
        leaveMessage:comments[i].leaveMessage,
      }
    })
    task.push(promise)
    
  }
  return  (
    await Promise.all(task).then(res=>{console.log("Database \
    updated successfully")}).catch(e=>{
    throw e
  })
  )
}