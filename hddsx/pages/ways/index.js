const time = require("../../utils/time.js");
const util = require('../../utils/util.js');
var WxParse = require('../../pages/wxParse/wxParse.js');
const app = getApp();

Page({
    data: {
      title:'攻略',
      hosturl:app.globalData.url,
      articleList:[]
    },
    onPullDownRefresh() {
      
    },

    /** 
     * 页面初始化
     * options 为页面跳转所带来的参数
     */
    onLoad: function (options) {
     
      this.getWays("11");
     
    },
    getWays: function (developid){
      var that = this;
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      
      wx.request({
        url: app.globalData.url + '/public/ArticleDevelopList',
        data: {
          developid: developid,
          typevalue:"1"

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            var res_Arr = res.data.data;
            for (var i = 0; i < res_Arr.length; i++) {
              res_Arr[i]["createtime"] = time.formatTime(parseInt(res_Arr[i]["createtime"]), 'Y-M-D');
            }
            that.setData({
              WaysList: res_Arr
            })

          } else {

          }

        }
      })
    },
    toWays: function (event) {
  
      var cur_item = event.currentTarget.dataset.cur;
      wx.navigateTo({
        url: '../ways/detail?id=' + cur_item
      })
    },
    onShareAppMessage: function () {
      return {
        title: '活动大师兄',
        path: 'pages/ways/index',
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