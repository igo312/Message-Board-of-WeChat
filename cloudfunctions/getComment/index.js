// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init({
  env: cloud.DYNAMIC_CURRENT_ENV
})
const db = cloud.database()
const MAX_LIMIT = 100
/*
exports.main = async(event, context) => {
  data = 
  return await 
}
*/

/*
//简易版加载，耗时差不多
exports.main = async (event, context) => {
  return await db.collection('comments-'+event.idx).get()
}
*/

exports.main = async (event, context) => {
  // 先取出集合记录总数
  const countResult = await db.collection('comments-'+event.idx).count()
  const total = countResult.total
  // 计算需分几次取
  const batchTimes = Math.ceil(total / 100)
  // 承载所有读操作的 promise 的数组
  const tasks = []
  for (let i = 0; i < batchTimes; i++) {
    const promise = db.collection('comments-'+event.idx).skip(i * MAX_LIMIT).limit(MAX_LIMIT).get()
    tasks.push(promise)
  }
  // 等待所有
  return (await Promise.all(tasks)).reduce((acc, cur) => {
    return {
      data: acc.data.concat(cur.data),
      errMsg: acc.errMsg,
    }
  })

}

