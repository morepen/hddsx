// var util = require('../../utils/util');
// var menu = require("../cardlist/cardlist");

// var pageObj = {
//   data: {

//   }
// }
// // 合并子组件data值及方法
// util.mergeComponents(pageObj, menu);
// Page(pageObj);
//person.js
const time = require("../../utils/time.js");
const app = getApp();

Page({
  data: {
    title:'关于我们',
    showAuthorizeStatus: true,
    logs: [],
    tagArr: [],
    groupArr: [],
    groupname: '',
    groupnum: 10,
    isgroup: 0,
    isshow: true,
    deskid: '',
    isroot: 1,
    pichost: app.globalData.url,
    aboutinfo:{}
  
  },
  onLoad: function (options) {
   



  },
  onShow: function () {
    var that = this;
    that.getwxabout();
   
   
  },
  getwxabout: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/public/getwxabout',
      data: {
        activityid:"-1"
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
             
          that.setData({
             aboutinfo:res.data.data
            });
        }
      }
    })
  },
  onShareAppMessage: function () {
    return {
      title: '活动大师兄',
      path: 'pages/wxabout/index',
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  onShareTimeline: () => {
    return {
      title: "活动大师兄-"+this.data.title,
      query: "",
      imageUrl: "https://www.sxbbt.net/qrcode/hddsx.jpg"
    }
  }



})
