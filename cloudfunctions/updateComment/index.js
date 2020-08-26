// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})

const db = cloud.database();
// 云函数入口函数
exports.main = async (event, context) => {
  //使用循环添加数据库
  const task = [];
  console.log(`updated data is${event.newdata}, key name is ${"comments-"+event.idx}`);
  // 更新新增的评论
  for(let i=0; i<event.newdata.length; i++){
    const promise = db.collection("comments-"+event.idx).add({
      data:event.newdata[i],
    }).catch(console.error)
    task.push(promise)
  }

  return (
    await Promise.all(task).then(res=>{console.log("Database \
    updated successfully")}).catch(e=>{
    throw e
  })
  )
}

