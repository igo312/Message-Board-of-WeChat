var db = wx.cloud.database()
var comments_db = db.collection("comments")

var comments = [{data:{
      username: '青石',
      avatar: '/images/avatar/avatar-3.png',
      create_time: '1484723344',
      upNum:3,
      upStatus:false,
      content: {
          txt: ' 那一年的毕业季，我们挥挥手，来不及说再见，就踏上了远行的火车。',
          img: [],
          audio: null
      }
  }}, {data:{
      username: '水清',
      avatar: '/images/avatar/avatar-2.png',
      create_time: '1481018319',
      upNum:31,
      artIdx:1,
      upStatus:false,
      content: {
          txt: '夏日的蝉鸣与夜晚的火车，时长会在未来无数的日子里不断的在我耳边响起，难以忘怀',
          img: [],
          audio: null,
      }
  }}, 
  {
      username: '赤墨',
      avatar: '/images/avatar/avatar-1.png',
      create_time: '1484496000',
      upNum:312,
      upStatus:false,
      content: {
          txt: '时光的湮染，自然的吞噬，让太多的老火车站也消失得无影无踪',
          img: [],
          audio: null,
      }
  },
  {
    username: '青石',
    avatar: '/images/avatar/avatar-3.png',
    create_time: '1484723344',
    upNum:3,
    upStatus:false,
    content: {
        txt: ' 那一年的毕业季，我们挥挥手，来不及说再见，就踏上了远行的火车。',
        img: [],
        audio: null
    }
}, {
    username: '水清',
    avatar: '/images/avatar/avatar-2.png',
    create_time: '1481018319',
    upNum:31,
    upStatus:false,
    content: {
        txt: '夏日的蝉鸣与夜晚的火车，时长会在未来无数的日子里不断的在我耳边响起，难以忘怀',
        img: [],
        audio: null,
    }
}, 
{
    username: '赤墨',
    avatar: '/images/avatar/avatar-1.png',
    create_time: '1484496000',
    upNum:312,
    upStatus:false,
    content: {
        txt: '时光的湮染，自然的吞噬，让太多的老火车站也消失得无影无踪',
        img: [],
        audio: null,
    }
},
{
    username: '青石',
    avatar: '/images/avatar/avatar-3.png',
    create_time: '1484723344',
    upNum:3,
    upStatus:false,
    content: {
        txt: ' 那一年的毕业季，我们挥挥手，来不及说再见，就踏上了远行的火车。',
        img: [],
        audio: null
    }
}, {
    username: '水清',
    avatar: '/images/avatar/avatar-2.png',
    create_time: '1481018319',
    upNum:31,
    upStatus:false,
    content: {
        txt: '夏日的蝉鸣与夜晚的火车，时长会在未来无数的日子里不断的在我耳边响起，难以忘怀',
        img: [],
        audio: null,
    }
}, 
{
    username: '赤墨',
    avatar: '/images/avatar/avatar-1.png',
    create_time: '1484496000',
    upNum:312,
    upStatus:false,
    content: {
        txt: '时光的湮染，自然的吞噬，让太多的老火车站也消失得无影无踪',
        img: [],
        audio: null,
    }
},
]


module.exports = {
  comments:comments
}