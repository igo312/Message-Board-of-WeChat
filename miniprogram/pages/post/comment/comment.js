// pages/comment/comment.js
import {comments} from '../../../data/data'
import {itPost} from '../../../item/item-post'
import {getDiffTime, login, randomString} from '../../../utils/util'
var app = getApp(); 
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
    storageKeyName:"comments"
  },

  /**获取用户信息**/
  onGetUserInfo:function(e){
    login(this);
    // console.log(userInfo);
    
  },

  /*
    页面函数
  */
  //实现模块上下移动
  translateYDown:function(){
    this.animation.translateY(0).step();
    this.setData({
      animation:this.animation.export(),
      keyboardInput:"",
      keyboardStatus:false,
      postStatus:!this.data.postStatus
    });
  },

  translateYUp:function(){
    //console.log("进行向上移动")
    this.animation.translateY(-this.data.uploadHeight).step();
    this.setData({
      animation:this.animation.export(),
      postStatus:!this.data.postStatus
    });
  },

  // 实现信息的发送以及数据库的更新
  sendMoreMsg: function(){
    var res = this.data.keyboardInput;
    var time = parseInt(new Date()/1000);
    var that = this.data.userInfo;
    var post = {
      "_id":randomString(),
      "username":that.nickName,
      "avatar":that.avatarUrl,
      "create_time":time,
      "formatedDate": getDiffTime(time, true),
      "content":{txt:res},
      "upInfo":{
        "upNum":0,
        "upStatus":false,
        "upUserList":[]
      }
    } ;

    console.log(post);
    res = this.comment_post.updateCommentStorage(post, this.idx);
    this.setData({
      comments: res,
      keyboardInput:""
    })
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
      keyboardStatus:true
    })
    }else{
      this.setData({
        keyboardStatus:false
      })
    }
  },

  // 点赞功能的实现
  setUp: function(event){
    var idx = event.currentTarget.dataset.commentIdx;
    console.log("comment id is "+idx);
    var res = this.comment_post.upUpdate(idx, this.userOpenId);
    this.setData({
      comments:res
    });
  },
  
  //进行评论与用户信息的初始化
  initInfo: async function(e){
    // 评论数据初始化
    await this.comment_post.commentFromCloud(e.idx, this);
    //获取用户信息
    await login(this);
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 清空本地缓存，加载最新的消息
    wx.clearStorageSync();
    // 设置idx，在卸载页面中使用到
    this.idx = options.idx
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
    this.animation = wx.createAnimation({
      duration:250,
      timingFunction:"linear"
    });
    var query = wx.createSelectorQuery();
    var that = this;
    query.select("#upload").boundingClientRect();
    
    // query自动保存了boundingClientRect执行后的参数,作为形参可自动传入exec
    query.exec(function(rect){
      if(rect[0] === null){
        console.log("Cannot get the upload height")
      }
      else{
        console.log("Get the page(height,width...) property successfully");//观察数据
        that.setData({
          uploadHeight:rect[0].height
        });
      }
    })
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