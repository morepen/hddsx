//app.js
let scence = 0;
App({
  globalData: {
    url: 'https://www.xdty.net',
    appid: 'wx0affdec7a8911fc3',
    secret: '5829c02512ae28aed3db0df44e5c89bb',
    openid: '',
    address: '',
    userInfo: {
      openid:'-1',
      userid:'-1',
      nickName:'游客',
      avatarUrl:'../../images/default.jpg'
    },
    res: 'ok',
    loginStatus: 0,
    fileStr: ''
  },
  onLaunch: function () {
    // 登录
    var that = this;
    wx.showShareMenu();


  },

  onShow: function () {
  },

  onHide: function () {
    this.globalData.scence = 1;
  }
  
})