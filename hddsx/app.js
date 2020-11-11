//app.js
let scence = 0;
App({
  globalData: {
    url: 'https://www.sxbbt.net/hddsx',
    hosturl:'https://www.sxbbt.net',
    openid:"",
    appid: 'wxb7f08a20c68b7e70',
    secret: 'fd40ee2d37dae06252eafa98dbc8b97e',
    openid: '-1',
    address: '',
    userInfo: {
      openid:'-1',
      userid:'-1',
      nickName:'',
      avatarUrl:'../../images/default.jpg'
    },
    res: 'ok',
    loginStatus: 0,
    fileStr: ''
  },
  getOpenid: function () {
    var that = this;
    return new Promise(function (resolve, reject) {
      wx.login({
        success: function (res) {
          //code 获取用户信息的凭证
          if (res.code) {

        
            //请求获取用户openid
            wx.request({
              url: that.globalData.url +'/public/GetOpenid',
              data: {
                appid: that.globalData.appid,
                secret: that.globalData.secret,
                js_code: res.code
              },
              header: {
                'content-type': 'application/json' // 默认值
              },
              success: function (res) {
                var openid = JSON.parse(res.data.data).openid;
                var session_key = JSON.parse(res.data.data).session_key;
                that.globalData.openid = openid;
                that.globalData.session_key = session_key
                wx.setStorageSync('openid', openid);//存储openid
                wx.setStorageSync('session_key', session_key);//存储session_key
                resolve(res);
              }
            })
          }
          else {
            console.log('获取用户登录态失败！' + res.errMsg)
            reject('error');
          }
        }
      })
    });
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