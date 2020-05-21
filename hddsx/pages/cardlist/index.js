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
    pichost: app.globalData.url+'/upload/images/',
    defaultavatarUrl:'../../images/default.jpg',
    currentItem:''
  },
  onLoad: function (options) {
   



  },
  onShow: function () {
    var that = this;
    that.getList();
   
   
  },
  getList: function () {
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/public/GetCardAddress',
      data: {
        deskid: that.data.deskid,
        openid: app.globalData.openid,
        // openid: "o6y8j0SypTdpoj46qdEleESQ"

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
       
        wx.hideLoading();
        console.log(res.data);
        if (res.data.code == 200) {

          that.data.tagArr = res.data.data.list;
          for (var i = 0; i < that.data.tagArr.length; i++) {
            that.data.tagArr[i]["createtime"] = time.formatTime(parseInt(that.data.tagArr[i]["createtime"]), 'Y-M-D h:m:s');
          }
          that.setData({
            list: that.data.tagArr,
            isroot: res.data.data.isgroup
          });

        } else { }
      }
    })
  },

  /**
   * 退出登录
   */
  logout: function () {

  },
  toPerson: function() {
    wx.reLaunch({
      url: '/pages/usercenter/usercenter'
    })
    
  },
  toCard: function (event) {
    wx.navigateTo({
      url: '../card/index'
    })
  },
  toComment: function (event) {
    var cur_item = event.currentTarget.dataset.cur;
    wx.navigateTo({
      url: '/pages/life/comment?cur_item=' + cur_item
    })
  },
  toLike: function (event) {
    var cardid = event.currentTarget.dataset.id;
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/public/createCardLike',
      data: {
        cardid: cardid,
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res.data);
        if (res.data.code == 200) {
          that.zan(cardid);
          debugger;
          wx.showToast({
            title: '操作成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })

        } else {


        }
      }
    })


  },
  zan:function(id){
    var listArr=this.data.list;
    for (var j = 0; j < listArr.length; j++) {
      if (listArr[j].id == id) {
         listArr[j].iszan=1;
      }      
     }
     debugger;
    this.setData({
      list: listArr
    });

  },
  toWrite: function () {
    

  
    wx.navigateTo({
        url: '/pages/mood/write?deskid=1'
      })
   
    
  },
  previewImg: function (e) {
    // var src = event.currentTarget.dataset.src;//获取data-src
    // var imgList = event.currentTarget.dataset.list;//获取data-list
    // //图片预览
    // wx.previewImage({
    //   current: src, // 当前显示图片的http链接
    //   urls: imgList // 需要预览的图片http链接列表
    // })
    var that = this;
    var index = e.currentTarget.dataset.order;
    var imgarr = e.currentTarget.dataset.arr;
    console.log(that.data.pichost + imgarr[index]);
    wx.previewImage({
      current: imgarr[index],
      urls: [that.data.pichost + imgarr[index]]
    })



  },
  getUserInfo: function () {
    var that = this;
    // that.setData({
    //   showAuthorizeStatus: false
    // })
    wx.getUserInfo({
      success: res => {
        app.globalData.userInfo = res.userInfo
        that.setData({
          userInfo: res.userInfo,
          showAuthorizeStatus: false
        })
      }
    })
  },
  JoinMember: function () {
    wx.navigateTo({
      url: '/pages/square/square'
    })

    return false;



    var that = this;
    if (that.data.group_zu == 1) {
      wx.showModal({
        title: '提示',
        content: '您是圆桌管理员，您确定解散该圆桌',
        success: function (res) {
          if (res.confirm) {
            console.log('用户点击确定')
            retuen;
          } else {
            console.log('用户点击取消')
          }

        }
      })
    }


    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    // console.log(that.data.isgroup);
    // debugger;
    wx.request({
      url: app.globalData.url + 'JoinMember',
      data: {
        deskid: that.data.deskid,
        openid: app.globalData.openid,
        type: that.data.isgroup,
        nickName: app.globalData.userInfo.nickName,
        avatarUrl: app.globalData.userInfo.avatarUrl

      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        console.log(res.data);
        if (res.data.code == 200) {
          wx.showToast({
            title: '操作成功',
            icon: 'succes',
            duration: 1000,
            mask: true
          })

        }
      }
    })
  }

})
