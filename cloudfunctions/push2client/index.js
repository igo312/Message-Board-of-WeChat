
// 饼子屋的appid wx38010b72717b8b6b
// oFZxX42Hb3ZvBtX2uWn1Hx0Bw8oA
const cloud = require('wx-server-sdk')
cloud.init()
exports.main = async (event, context) => {
  var task = []

  for(let i=0; i<event.idList.length; i++){
    console.log("push openId is"+event.idList[i])
    const promise = cloud.openapi.subscribeMessage.send({
        touser: event.idList[i],
        page: 'pages/post/comment/comment?idx='+event.idx,
        lang: 'zh_CN',
        data: {
          name1: {
            value: event.usrname
          },
          thing2: {
            value: event.txt
          },
          time3: {
            value: event.time
          },
        },
        templateId: '2hbfH7DgzeI4CJQsKe0ItawTlGK4hK1ls6Lg2HD_ui8',
        miniprogramState: 'formal'
      })
    task.push(promise)
  }
  return  (
    await Promise.all(task).then(res=>{console.log("Information \
    push to client successfully")}).catch(e=>{
    throw e
  })
  )

}