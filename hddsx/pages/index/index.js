const time = require("../../utils/time.js");
const util = require('../../utils/util.js');
var WxParse = require('../../pages/wxParse/wxParse.js');
const app = getApp();

Page({
    data: {
      title:'活动大师兄',
      imgUrl: [
        { url: "../../images/tab/1.png" },
        { url: "../../images/tab/1.png" },
        { url: "../../images/tab/1.png" },
      ],
      indicatorDots: true,
      autoplay: true,
      interval: 4000,
      duration: 1000,
      coverList:[],
      WaysList:[],
      hosturl:app.globalData.url
    },
    onPullDownRefresh() {
      



    
 
    },

    /** 
     * 页面初始化
     * options 为页面跳转所带来的参数
     */
    onLoad: function (options) {
      this.getCoverList("1");
      this.getList("9");
      this.getWays("11");
      var that=this;
      app.getOpenid().then(function (res) {
        if (res.statusCode == 200) {
          var openid = wx.getStorageSync('openid');
          app.globalData.openid = wx.getStorageSync('openid');
          that.checkUser(openid);
        }
        else {
          //console.log(res.data);
        }
      })
     
    },
    checkUser: function (openid) {
      var that = this;
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
  
      wx.request({
        url: app.globalData.url + '/wx/checkUser',
        data: {
          openid: openid,
          tel: wx.getStorageSync('tel'),
          nickname: wx.getStorageSync('nickname')
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          
          wx.hideLoading();
          if (res.data.code == 200) {
           
          }
        }
       })
      },
  getList: function (developid){
      var that = this;
      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      
      wx.request({
        url: app.globalData.url + '/public/getActivityList',
        data: {
          developid: developid,
          typevalue:"-1"

        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            var res_Arr = res.data.data;
            for (var i = 0; i < res_Arr.length; i++){
              //res_Arr[i].pics = app.globalData.hosturl+"/nginxImage/" + JSON.parse(res_Arr[i].pics)[0];
              res_Arr[i].pics = app.globalData.hosturl+"/nginxImage/" + JSON.parse(res_Arr[i].pics)[0];
              var tomorrow = new Date().getTime() + 24*60*60*1000;
              var _tomorrow=time.formatTime(tomorrow * 1, 'Y-M-D'); 
              var _time=res_Arr[i].starttime=='群内确定'?_tomorrow:res_Arr[i].starttime;
              res_Arr[i].starttime = _time
              if (res_Arr[i].money==0||res_Arr[i].money==null){
                res_Arr[i].money="免费"
              }else{
                res_Arr[i].money = "活动费用:¥" + res_Arr[i].money+"元/"+ res_Arr[i].cell;
              }
            }
            that.setData({
              articleList: res_Arr
            })

          } else {

          }

        }
      })
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
          typevalue:"0"

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
  getCoverList: function (type) {
    var that = this;
   
    wx.request({
      url: app.globalData.url + '/public/getCoverList',
      data: {
        type: 1

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       
       
        if (res.data.code == 200) {
          var res_Arr = res.data.data;
          that.setData({
            coverList: res_Arr
          })

        } else {

        }

      }
    })
  },
     
        
    onReady: function () {
        // 页面渲染完成
        var that = this;

        // 数据加载完成后 延迟隐藏loading
        setTimeout(function () {
            that.setData({
                hidden: true
            })
        }, 500);


    },
    moreWays: function () {
    

      wx.navigateTo({
        url: '../ways/index'
      })
    },
  toLeftTab: function (event) {
    var cur_item = event.currentTarget.dataset.cur;

    wx.navigateTo({
      url: '../leftTab/index'
    })
  },
  toDeskList: function () {
    

    wx.navigateTo({
      url: '../desklist/index'
    })
  },
    toLife: function (event) {
      var cur_item = event.currentTarget.dataset.cur;
  
      wx.navigateTo({
        url: '../life/life'
      })
    },
  toWrite: function (event) {
    var cur_item = event.currentTarget.dataset.cur;

    wx.navigateTo({
      url: '../write/index'
    })
  },
  toWxAbout: function () {
  

    wx.navigateTo({
      url: '../wxabout/index'
    })
  },
  toMap: function () {
  

    wx.navigateTo({
      url: '../card/index'
    })
  },
  toCard: function () {
    wx.navigateTo({
      url: '../webview/index?type=2'
    })
  },
  toDetail: function (event) {
 
    var cur_item = event.currentTarget.dataset.cur;
    wx.navigateTo({
      url: '../detail/detail?id=' + cur_item
    })
  },
  toWays: function (event) {
  
    var cur_item = event.currentTarget.dataset.cur;
    wx.navigateTo({
      url: '../ways/detail?id=' + cur_item
    })
  },
    /**
     * 事件处理
     * scrolltolower 自动加载更多
     */
    scrolltolower: function (e) {

        var that = this;

        // 加载更多 loading
        that.setData({
            hothidden: true
        })

        var currentDate = this.data.dataListDateCurrent;

        // 如果加载数据超过10条
        if (this.data.dataListDateCount >= 8) {

            // 加载更多 loading
            that.setData({
                hothidden: false
            });

        } else {

            /**
             * 发送请求数据
             */
            util.AJAX("news/before/" + currentDate, function (res) {

                var arr = res.data;
                var format = util.getFormatDate(arr.date);

                // 格式化日期方便加载指定日期数据
                // 格式化日期获取星期几方便显示
                arr["dateDay"] = format.dateDay;

                // 获取当前数据进行保存
                var list = that.data.datalist;
                // 然后重新写入数据
                that.setData({
                    datalist: list.concat(arr),                              // 存储数据
                    dataListDateCurrent: arr.date,
                    dataListDateCount: that.data.dataListDateCount + 1      // 统计加载次数
                });
            });
        }
    },
    /**
     * 滑动切换tab
     */
    bindChange: function (e) {

        var that = this;
        that.setData({ currentTab: e.detail.current });

    },
    /**
     * 点击tab切换
     */
    swichNav: function (e) {

        var that = this;

        if (this.data.currentTab === e.target.dataset.current) {
            return false;
        } else {
            that.setData({
                currentTab: e.target.dataset.current
            })

        }
      wx.navigateTo({
        url: '../news/index'
      })

    },
    onShareAppMessage: function () {
      return {
        title: '活动大师兄',
        path: 'pages/index/index',
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
        title: "活动大师兄",
        query: "",
        imageUrl: "https://www.sxbbt.net/qrcode/hddsx.jpg"
      }
    }
})