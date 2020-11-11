// pages/personal/personal.js

const util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {
      avatarUrl:'../../images/nologn.png',
      nickName:'未登录'
    },
    isqrcode:false,
    money:'--',
    ismore:false,
    isqr:false,
    showTel:false,
    tel:wx.getStorageSync('tel')
  },
  tolink: function () {
    wx.navigateTo({
      url: '../weixinlink/weixinlink'
      //  url: '../logs/logs'
    })
  },
  toLife: function (event) {
    wx.navigateTo({
      url: '../booklist/index'
    })
  },
  showlogn:function(){
    var _nickname = wx.getStorageSync('nickname');
    if (_nickname=='') {
      this.setData({
        showAuthorizeStatus:true
      })
    }
  },
  qxlogn:function(){
    this.setData({
      showAuthorizeStatus:false
    })
  },
  showtel:function(){
    this.setData({
      showTel:true
    })
  },
  qxtel: function () {
    this.setData({
      showTel: false
    })
  },
  showQrcode:function(){
    var _nickname = wx.getStorageSync('nickname');
    debugger;
    if (_nickname){
      this.setData({
        isqr: !this.data.isqr
      })
    }else{
      wx.showToast({
        title: "未登录，请先登录！",
        icon: 'none',
      })
      return false
    }
   
  },
  getPhoneNumber: function (e) {//这个事件同样需要拿到e
    var that = this
    var ency = e.detail.encryptedData;
    var iv = e.detail.iv;
    var errMsg = e.detail.errMsg
    if (iv == null || ency == null) {
      wx.showToast({
        title: "授权失败,请重新授权！",
        icon: 'none',
      })
      return false
    }

    //把获取手机号需要的参数取到，然后存到头部data里面
    that.setData({
      ency: ency,
      iv: iv,
      errMsg: errMsg
    })

    that.getTel();//调用手机号授权事件
  },
  getTel: function () {
    var url = app.globalData.url + '/wx/decryptData';
    var that = this;
    wx.request({
      url: url,
      data: {
        encryptedData: that.data.ency,
        iv: that.data.iv,
        sessionkey: wx.getStorageSync('session_key')
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       
        if (res.data.code == 200) {

          var _result = JSON.parse(res.data.data);
          wx.setStorageSync('tel', _result.phoneNumber);
          that.setData({
            tel: _result.phoneNumber,
            countryCode: _result.countryCode,
            showTel: false
          })

          wx.navigateBack({
            delta: 1
          })



        }
      }
    });
  },
  getUser: function (openid) {
    var that = this;
    wx.request({
      url: app.globalData.url + '/wx/getuser',
      data: {
        openid: openid

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

       
        if (res.data.code == 200) {
          that.setData({
            money: res.data.data[0].money,
            qrcode: app.globalData.hosturl + "/nginxImage/" + res.data.data[0].qrcode,
          })
        }
      }
    })
  },
  previewImage1: function (e) {
    var that = this;
    var src = that.data.qrcode;//获取data-src
    var imgList = [that.data.qrcode];//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })

  },
  toLife: function (event) {
    wx.navigateTo({
      url: '../booklist/index'
    })
  },
  toLeftTab: function (event) {
    wx.navigateTo({
      url: '../leftTab/index'
    })
  },
  toCard: function (event) {
    wx.navigateTo({
      url: '../cardlist/index'
    })
  },
  closeBomb: function () {//协议弹框关闭按钮
    var self = this;
    self.setData({
      showBombStatus: false
    });
    setTimeout(
      function () {
        self.setData({
          showBombStatus: true
        });
      }, 100
    )
  },
  agreeBomb: function () {//协议弹框确定按钮
    this.setData({
      showBombStatus: false
    });

    //请求更新已承诺
    // wx.request({
    //   url: app.globalData.service + '/api/personal/updatePromise',
    //   method: 'POST',
    //   data: {
    //     userToken: app.globalData.userToken,
    //     userInfo: app.globalData.userInfo
    //   },
    //   success: function (res) {
    //     //console.log(res);
    //     var data = res.data;
    //     if (data.code == 0) {
    //       app.globalData.isPromise = 1;
    //     }
    //   }
    // })
  },
  toWxAbout: function () {

    

    wx.navigateTo({
      url: '../wxabout/index'
    })
  },
  toGotUserInfo: function (e) {
    var self = this;
    console.log(e.detail)
    if (e.detail.userInfo) {//用户按了允许授权按钮      
      self.setData({
        showAuthorizeStatus: false
      });
      app.globalData.userInfo = e.detail.userInfo;
      console.log("toGotUserInfo" + app.globalData.userInfo);
     
      wx.setStorageSync('nickname', e.detail.userInfo.nickName);
      var inviteCode = '';
      try {
        var inviteCode = self.data.inviteCode
      } catch (e) {
        console.log(e);
      }
      util.userLogin(inviteCode);

      setTimeout(
        function () {
          self.onLoad();
        }
        , 500)

    } else {//用户按了拒绝按钮
      self.setData({
        showAuthorizeStatus: true
      });
    }
  },
  toPersonalInfo: function (e) {
    // wx.navigateTo({
    //   url: "../personalInfo/personalInfo"
    // })
  },
  toAddress: function (e) {
    wx.navigateTo({
      url: "../address/address"
    })
  },
  toInvite: function (e) {
    // var self = this;
    // var newUserVersion = self.data.newUserVersion;

    // if (newUserVersion > app.globalData.userVersion) {
    //   wx.request({
    //     url: app.globalData.service + '/api/invite/updateUserVersion',
    //     method: 'POST',
    //     data: {
    //       userToken: app.globalData.userToken,
    //       userVersion: newUserVersion
    //     },
    //     success: function (res) {
    //       //console.log(res);
    //       self.setData({
    //         inviteDot: false
    //       });
    //       app.globalData.userVersion = newUserVersion;
    //     }
    //   })
    // }

    // wx.navigateTo({
    //   url: "../invite/invite"
    // })
  },
  calling: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.servicePhone,
      success: function () {
        //console.log("拨打电话成功！")
      },
      fail: function () {
        //console.log("拨打电话失败！")
      }
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
   var that=this;
   if (this.data.canIUse) {
      
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
        wx.setStorageSync('nickname', userInfo.nickName);
        that.checkTel();
        that.showUse();

      }
    } else {
      
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
          wx.setStorageSync('nickname', res.userInfo.nickName);
          that.checkTel();
          that.showUse();
        }
      })
    }

    var self = this;
    util.checkUserInfoAuth();
    
 

  },
  checkTel:function(){
    var _tel = wx.getStorageSync('tel');
    if(_tel==''){
      this.setData({
        showTel:true
      })
    }else{
      this.setData({
        showTel:false
      })
    }
  },
  showUse:function(){
    var that = this;
    app.getOpenid().then(function (res) {
      if (res.statusCode == 200) {
        app.globalData.openid = wx.getStorageSync('openid');
        var openid = wx.getStorageSync('openid');
        that.getUser(openid);
      }
      else {
        console.log(res.data);
      }
    })
  },
  exit:function(){
    app.globalData.userInfo={};
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();

    if (app.globalData.userInfo) {
      this.setData({
        showAuthorizeStatus: false
      });
    }
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
  // onShareAppMessage: function () {

  // }
})