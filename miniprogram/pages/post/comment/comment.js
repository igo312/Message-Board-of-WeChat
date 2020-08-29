
// pages/comment/comment.js
import {comments} from '../../../data/data'
import {itPost} from '../../../item/item-post'
import {getDiffTime, login, randomString} from '../../../utils/util'
var app = getApp(); 
/*
const origin_style = {
  'style':'background-color: #EAE8E8;',
  'longTap':false,
};
const changed_style = {
  'style':'background-color: #A5D9EE;',
  'longTap':true,
}
*/
// todo:动画的位置直接去了1200px，这是ipad pro的尺寸
Page({
 
  /**
   * 页面的初始数据
   */
  data: {
    emojiStatus:false,
    keyboardInput:"",
    keyboardStatus:false,
    postStatus:false,
    userInfo:"",
    storageKeyName:"comments",
    moreDeleteStatus:false,
    //留言板的位置和大小调整，使初始化不出错
    commentStyle:"height: 0px; bottom:-1200px;",
    txtBottom:"bottom: -1200px;",
    //comment_style:origin_style,
  },

  /**获取用户信息**/
  onGetUserInfo:function(e){
    login(this);
    // console.log(userInfo);
    
  },

  /*
    页面函数
  */

  /*
  用于评论框的变蓝进行设定，但做的还不好，看wxml
  longTapDelete:function(){
    this.setData({
      comment_style:changed_style
    })
  },

  longTapReturn:function(){
    this.setData({
      comment_style:origin_style
    })
  },
  */
  //setData 以及获取最新的页面高度
  setHeight:function(id){
    var key = id||"#mainPage"
    var that = this;
    var query = wx.createSelectorQuery();
    query.select(key).boundingClientRect();
    query.exec(function(rect){
      if(rect[0] === null){
        console.log("Cannot get the main height, id is "+key)
      }
      else{
        console.log("Get the page(height,width...) property successfully");//观察数据
        //console.log(rect[0])
        if(rect[0].height<1200)rect[0].height=1200; // 1200 is ipad pro inch 
        that.setData({
          uploadHeight:rect[0].height,
          txtHeight:"height:"+rect[0].height+"px; ",
          txtBottom:"bottom:-"+rect[0].height+"px; ",
          commentStyle:"bottom:-"+rect[0].height+"px; "+"height:"+parseInt(that.windowHeight*0.7)+"px;"
        });
      }
    })
    
 
    // query自动保存了boundingClientRect执行后的参数,作为形参可自动传入exec
  },

  /*********更多选择************/
  //点击“更多”拉起更多选择
  up_moreFunction:function(event){
    var idx = event.currentTarget.dataset.moreIdx;
    var lidx = null||event.currentTarget.dataset.lIdx;
    var userID = this.data.userOpenId;

    const cStatus = this.data.comments[idx].openID==userID
    const lStatus = this.data.comments[idx].leaveMessage[lidx] && this.data.comments[idx].leaveMessage[lidx].openID
    if(cStatus||lStatus){
      this.setData({
        moreDeleteStatus:true,
      })
    }else{
      this.setData({
        moreDeleteStatus:false,
      })
    }
    this.moreFunctionAnimation.translateY(-this.data.uploadHeight).step();
    this.setData({
      moreMessage: this.data.comments[idx].username+":"+this.data.comments[idx].content.txt,
      moreIdx:idx,
      lIdx: lidx,
      moreFunctionAnimation:this.moreFunctionAnimation.export(),
      keyboardInput:"",
      keyboardStatus:false,
      postStatus:!this.data.postStatus,
      moreStatus:true,
    });
  },
  
  //“更多中的”点赞功能实现
  moreFunction_up:function(event){
    var idx = this.data.moreIdx;
    var lIdx = this.data.lIdx
    console.log("comment id is "+idx);
    var res = this.comment_post.upUpdate(idx, lIdx, this.userOpenId);
    this.setData({
      comments:res
    });
    this.translateYDown();
    if(res[idx].upInfo.upStatus){
      wx.showToast({
        title: '点赞成功',
        duration: 800,
        icon: "success"
      })
  }else{
    wx.showToast({
      title: '点赞取消',
      duration: 800,
      icon: "none"
    })
  }
  },
  
  //"更多中的"删除功能实现
  moreFunction_delete:function(event){
    var idx = this.data.moreIdx;
    var lIdx = this.data.lIdx;
    const ipx = this.data.comments[idx]._id
    console.log(`_id is ${ipx} id is ${idx}`)
    if(typeof(lIdx)=="number"){
      this.data.comments[idx].leaveMessage.splice(lIdx, 1)
    }else{
      this.data.comments.splice(idx, 1)
    }
    //删除评论采用更新数据的方法，删除整个回复使用remove方法
    this.comment_post.deleteBase(this.idx, lIdx, ipx, this.data.comments[idx].leaveMessage);
    this.setData({
      comments:this.data.comments
    })
    wx.setStorageSync('comments', this.data.comments)
    wx.showToast({
      title: '删除成功',
      icon: "success",
      duration: 1000
    })
    this.translateYDown();
  },

  //"更多中的"留言功能实现
  moreFunction_leave:function(){
    this.translateYDown()
    this.translateYUp()
    this.setData({
      sendStatus:false,
      moreIdx:this.data.moreIdx,
    })
  },
  /*************end***************/

  /*************输入框部分**********/
  //实现模块上下移动
  translateSendUp:function(){
    this.translateYUp()
    this.setData({
      sendStatus:true,
    })
  },
  
  translateLeaveUp:function(event){
    this.translateYUp()
    this.setData({
      sendStatus:false,
      moreIdx:event.currentTarget.dataset.moreIdx,
    })
  },

  translateYDown:function(){
    if(!this.data.moreStatus){
      this.animation.translateY(0).step();
      this.setData({
        animation:this.animation.export(),
        keyboardInput:"",
        keyboardStatus:false,
        postStatus:!this.data.postStatus
      });
    }else{
      this.moreFunctionAnimation.translateY(0).step();
      this.setData({
        moreFunctionAnimation:this.moreFunctionAnimation.export(),
        keyboardInput:"",
        keyboardStatus:false,
        postStatus:!this.data.postStatus
      });
    }
  },

  translateYUp:function(){
    //console.log("进行向上移动")
    this.animation.translateY(-this.data.uploadHeight).step();
    this.setData({
      moreStatus:false,
      animation:this.animation.export(),
      postStatus:!this.data.postStatus
    });
  },

  // 实现对用户的回复
  leaveMoreMsg: function(){
    var res = this.data.keyboardInput;
    var time = parseInt(new Date()/1000);
    var that = this.data.userInfo;
    var idx = this.data.moreIdx;
    const id = this.data.comments[idx]._id;
    var post = {
      "openID":this.data.userOpenId,
      "ownerId":id,
      "username":that.nickName,
      "comment":res,
      "time":time,
      "upInfo":{
        "upNum":0,
        "upStatus":false,
        "upUserList":[]
      }
    } ;

    console.log(post);
    res = this.comment_post.updateLeaveStorage(post, idx, id, this.idx);
    this.setData({
      keyboardInput:"",
      comments:res
    })
    this.setHeight();
    wx.showToast({
      title: '评论成功',
      icon: "success",
      duration: 1000
    })
    this.translateYDown();
  },

  // 实现信息的发送以及数据库的更新
  sendMoreMsg: function(){
    var res = this.data.keyboardInput;
    var time = parseInt(new Date()/1000);
    var that = this.data.userInfo;
    var post = {
      "_id":randomString(),
      "username":that.nickName,
      "openID":this.userOpenId,
      "avatar":that.avatarUrl,
      "create_time":time,
      "formatedDate": getDiffTime(time, true),
      "content":{txt:res},
      "upInfo":{
        "upNum":0,
        "upStatus":false,
        "upUserList":[]
      },
      "leaveMessage":[]
    } ;

    console.log(post);
    res = this.comment_post.updateCommentStorage(post, this.idx);
    this.setData({
      keyboardInput:"",
      comments:res
    })
    this.setHeight();
    wx.showToast({
      title: '评论成功',
      icon: "success",
      duration: 1000
    })
    this.translateYDown();
  },

  bindCommentInput: function(event){
    var res = event.detail.value;
    // console.log(res);
    this.data.keyboardInput = res;
    if(res != ""){
    this.setData({
      keyboardStatus:true,
      SEND:true&&this.data.sendStatus,
      LEAVE:true&&!this.data.sendStatus
    })
    }else{
      this.setData({
        keyboardStatus:false,
        SEND:false&&this.data.sendStatus,
        LEAVE:false&&!this.data.sendStatus
      })
    }
  },
  /**************end***************/

  // 点赞功能的实现
  setUp: function(event){
    var idx = event.currentTarget.dataset.commentIdx;
    var lIdx;
    console.log("comment id is "+idx);
    var res = this.comment_post.upUpdate(idx, lIdx, this.userOpenId);
    this.setData({
      comments:res
    });
  },
  
  lSetUp: function(event){
    var idx = event.currentTarget.dataset.commentIdx;
    var lIdx = event.currentTarget.dataset.lIdx
    console.log("comment id is "+idx+" lidx is "+lIdx);
    var res = this.comment_post.upUpdate(idx, lIdx, this.userOpenId);
    this.setData({
      comments:res
    });
  
  },

  //进行评论与用户信息的初始化
  initInfo: async function(e){
    // 评论数据初始化
    await this.comment_post.commentFromCloud(e.idx, this);
    //获取用户信息
    // await login(this);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 清空本地缓存，加载最新的消息
    wx.clearStorageSync();
    // 设置idx，在卸载页面中使用到
    this.idx = options.idx
    //设置留言框的高度
    this.windowHeight = wx.getSystemInfoSync().windowHeight;
    console.log("the windowHeight is "+this.windowHeight)
   
    // itPost是数据相关的类
    this.comment_post = new itPost();
    this.initInfo(options)

    // 判断是否得到用户信息
    var user = wx.getStorageSync('userInfo');
    if(!user){
      this.setData({
        userStatus:false
      })
    }else{
      this.setData({
        userStatus:true,
        userInfo:user
      })
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 用于留言框的动画
    this.animation = wx.createAnimation({
      duration:250,
      timingFunction:"linear"
    });

    // 用于更多功能点击的动画
    this.moreFunctionAnimation = wx.createAnimation({
      duration:250,
      timingFunction:"linear"
    });

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    //this.comment_post.updateCloud(this.idx)
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
    // this.comment_post.updateCloud(this.idx);
    this.comment_post.updateUp(this.idx)
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})


/*
  getEmoji: function(event){
    var emojiStatus = this.data.emojiStatus;
    this.setData({
      emojiStatus:!emojiStatus
    });
  },

  getKeyboard: function(event){
    console.log("Get in the getKeyboard function")
    var emojiStatus = this.data.emojiStatus;
    console.log(emojiStatus)
    this.setData({
      emojiStatus:!emojiStatus
    });
  },
*/