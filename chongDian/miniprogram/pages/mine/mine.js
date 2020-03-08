// miniprogram/pages/mine/mine.js
const db = wx.cloud.database()
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    // 用户图片
    userPhoto: "/images/user/user-unlogin.png",
    nickName: "",
    logged:false,
    disabled:true
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    // 使用云函数登陆功能，拿到openid读取数据库
    wx.cloud.callFunction({
      name:'login',
      data: {}
    }).then((res)=>{
      db.collection('mine').where({
        _openid:res.result.openid
      }).get().then((res)=>{
        if (res.data.length) {
          app.userInfo = Object.assign(app.userInfo, res.data[0]);
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            logged: true,
            id: app.userInfo._id
          });
        }
        else {
          this.setData({
            disabled: false
          });
        }
      })
      
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.setData({
      userPhoto: app.userInfo.userPhoto,
      nickName: app.userInfo.nickName,
      id: app.userInfo._id
    });
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

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

  },
  bindGetUserInfo(val) {
    //用户登陆/写入用户信息
    
    let userInfo = val.detail.userInfo
    if(!this.data.logged && userInfo) {
      db.collection('mine').add({ //插入数据
        data: {
          userPhoto: userInfo.avatarUrl,
          nickName: userInfo.nickName,
          tel:'',
          wxCount:'',
          time:new Date(),
        }
      }).then((res)=>{
        db.collection('mine').doc(res._id).get().then((res)=>{//读取数据
          app.userInfo = Object.assign(app.userInfo, res.data);
          this.setData({
            userPhoto: app.userInfo.userPhoto,
            nickName: app.userInfo.nickName,
            logged: true,
            id: app.userInfo._id
          });
          
        })
      })
    }
  }
})