// pages/personal/personal.js

const util = require('../../utils/util.js');
var app = getApp();

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userInfo: {}
  },
  toLife: function (event) {
    wx.navigateTo({
      url: '../life/life'
    })
  },
  toCard: function (event) {
    wx.navigateTo({
      url: '../card/index'
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
  toGotUserInfo: function (e) {
    var self = this;
    console.log(e.detail)
    if (e.detail.userInfo) {//用户按了允许授权按钮      
      self.setData({
        showAuthorizeStatus: false
      });
      app.globalData.userInfo = e.detail.userInfo;
      console.log("toGotUserInfo" + app.globalData.userInfo);
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

    if (app.globalData.userInfo) {
      this.setData({
        userInfo: app.globalData.userInfo
      })
    } else if (this.data.canIUse) {
      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      app.userInfoReadyCallback = res => {
        this.setData({
          userInfo: res.userInfo
        })
      }
    } else {
      // 在没有 open-type=getUserInfo 版本的兼容处理
      wx.getUserInfo({
        success: res => {
          app.globalData.userInfo = res.userInfo
          this.setData({
            userInfo: res.userInfo
          })
        }
      })
    }

    var self = this;
    //请求收货地址列表数据
    // wx.request({
    //   url: app.globalData.service + '/api/personal/init',
    //   method: 'POST',
    //   data: {
    //     userToken: app.globalData.userToken
    //   },
    //   success: function (res) {
    //     //console.log(res);
    //     var data = res.data;
    //     if (data.code == 0) {
    //       //设置收货地址列表数据
    //       //self.data.indexImg = data.result;
    //       if (data.result) {
    //         var newUserVersion = data.result.newUserVersion;

    //         self.setData({
    //           servicePhone: data.result.servicePhone,
    //           newUserVersion: newUserVersion
    //         });

    //         //判断邀请红点是否出现
    //         if (newUserVersion > app.globalData.userVersion) {
    //           self.setData({
    //             inviteDot: true
    //           });
    //         } else {
    //           self.setData({
    //             inviteDot: false
    //           });
    //         }
    //       }
    //     }
    //     else {
    //       // alert(res.data.msg);
    //     }
    //   }
    // })

    util.checkUserInfoAuth();
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