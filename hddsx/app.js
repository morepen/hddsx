//app.js
let scence = 0;
App({
  globalData: {
    url: 'http://192.168.1.15:80',
    appid: 'wx0affdec7a8911fc3',
    secret: '5829c02512ae28aed3db0df44e5c89bb',
    openid: '',
    address: '',
    userInfo: null,
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