const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

/*
 *根据客户端的时间信息得到发表评论的时间格式
 *多少分钟前，多少小时前，然后是昨天，然后再是月日
 * Para :
 * recordTime - {float} 时间戳
 * yearsFlag -{bool} 是否要年份
 */
function getDiffTime(recordTime,yearsFlag) {
  if (recordTime) {
      recordTime=new Date(parseFloat(recordTime)*1000);
      var minute = 1000 * 60,
          hour = minute * 60,
          day = hour * 24,
          now=new Date(),
          diff = now -recordTime;
      var result = '';
      if (diff < 0) {
          return result;
      }
      var weekR = diff / (7 * day);
      var dayC = diff / day;
      var hourC = diff / hour;
      var minC = diff / minute;
      if (weekR >= 1) {
          var formate='MM-dd hh:mm';
          if(yearsFlag){
              formate='yyyy-MM-dd hh:mm';
          }
          return recordTime.format(formate);
      }
      else if (dayC == 1 ||(hourC <24 && recordTime.getDate()!=now.getDate())) {
          result = '昨天'+recordTime.format('hh:mm');
          return result;
      }
      else if (dayC > 1) {
          var formate='MM-dd hh:mm';
          if(yearsFlag){
              formate='yyyy-MM-dd hh:mm';
          }
          return recordTime.format(formate);
      }
      else if (hourC >= 1) {
          result = parseInt(hourC) + '小时前';
          return result;
      }
      else if (minC >= 1) {
          result = parseInt(minC) + '分钟前';
          return result;
      } else {
          result = '刚刚';
          return result;
      }
  }
  return '';
}

/*
 *拓展Date方法。得到格式化的日期形式
 *date.format('yyyy-MM-dd')，date.format('yyyy/MM/dd'),date.format('yyyy.MM.dd')
 *date.format('dd.MM.yy'), date.format('yyyy.dd.MM'), date.format('yyyy-MM-dd HH:mm')
 *使用方法 如下：
 *                       var date = new Date();
 *                       var todayFormat = date.format('yyyy-MM-dd'); //结果为2015-2-3
 *Parameters:
 *format - {string} 目标格式 类似('yyyy-MM-dd')
 *Returns - {string} 格式化后的日期 2015-2-3
 *
 */
(function initTimeFormat(){
  Date.prototype.format = function (format) {
      var o = {
          "M+": this.getMonth() + 1, //month
          "d+": this.getDate(), //day
          "h+": this.getHours(), //hour
          "m+": this.getMinutes(), //minute
          "s+": this.getSeconds(), //second
          "q+": Math.floor((this.getMonth() + 3) / 3), //quarter
          "S": this.getMilliseconds() //millisecond
      }
      if (/(y+)/.test(format)) format = format.replace(RegExp.$1,
          (this.getFullYear() + "").substr(4 - RegExp.$1.length));
      for (var k in o) if (new RegExp("(" + k + ")").test(format))
          format = format.replace(RegExp.$1,
              RegExp.$1.length == 1 ? o[k] :
                  ("00" + o[k]).substr(("" + o[k]).length));
      return format;
  };
})()


const returnComments= function(){
    var comments = wx.getStorageSync('comments');
    const openId = wx.getStorageSync('userOpenId');
    for(let i=0; i<comments.length; i++){
        if(comments[i].upInfo.upUserList.find(res=>{return res==openId})){
            comments[i].upInfo.upStatus = true
        }
    }
    wx.setStorageSync("comments", comments)
    return comments
}


async function login(cWindow){
    var that = this;
    return wx.getSetting({
        success (res){
          console.log("login Part")
          if (res.authSetting['scope.userInfo']){
            wx.getUserInfo({
              //getUserInfo的回调函数，调用了cloud.callFunction
              success: function (res){
                const userinfo = res.userInfo;
                cWindow.setData({
                    userInfo:userinfo,
                    userStatus:true,
                })
                console.log("init1: User is authorized")
                wx.setStorageSync('userInfo', userinfo)

                // 实现openId的获取
                wx.cloud.callFunction({
                  name:"login",
                  // callFunction的回调函数,并进行openid的设置以及点赞数据的更新
                  success:function (res){
                    wx.setStorageSync('userOpenId', res.result.openid)
                    const comments = returnComments();
                    console.log("init1: login true setdata")
                    cWindow.userOpenId = res.result.openid;
                    cWindow.setData({
                        userOpenId:res.result.openid,
                        comments:comments
                    })
                    cWindow.setHeight();
                  }})}})}
                },
        fail (res){
            console.log("授权失败!")
        },
      })
}

// 生成随机字符串，默认为32位长度
function randomString(len) {
    　　len = len || 32;
    　　var $chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';    /****默认去掉了容易混淆的字符oOLl,9gq,Vv,Uu,I1****/
    　　var maxPos = $chars.length;
    　　var pwd = '';
    　　for (let i = 0; i < len; i++) {
    　　　　pwd += $chars.charAt(Math.floor(Math.random() * maxPos));
    　　}
    　　return pwd;
    }

module.exports = {
  formatTime: formatTime,
  getDiffTime: getDiffTime,
  login: login,
  randomString:randomString
}
