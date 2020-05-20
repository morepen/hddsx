//person.js
const app = getApp();
const time = require("../../utils/time.js");

Page({
  data: {
    logs: [],
    tagArr:[],
    cur_item:{},
    cardid:'',
    content:'',
    piclist:[],
    pichost: '',
    commentlist:'',
    cardtime:'',
    isShow:true,
    isShow1: true
  },
  onLoad: function (options) {


    var that = this;
    var cardid
    that.setData({
      cardid: options.cur_item
    })
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/public/GetCardComment',
      data: {
        cardid:that.data.cardid,
        openid: app.globalData.openid
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        if (res.data.code == 200) {
          if (res.data.data.comenttwo.length>0){
            var list_arr = res.data.data.comenttwo;
            that.setData({
              isShow:true,
              isShow1:false
            })

            for (var i = 0; i < list_arr.length; i++) {
              list_arr[i]["createtime"] = time.formatTime(parseInt(list_arr[i]["createtime"]), 'Y-M-D h:m:s');
            }

          }
          that.setData({
            cur_item: res.data.data.comentone[0],
            piclist:JSON.parse(res.data.data.comentone[0].piclist),
            cardtime: time.formatTime(parseInt(res.data.data.comentone[0].createtime),'Y-M-D h:m:s'),
            commentlist: list_arr 
          });
        } else {

        }
      }
    })
  },

  /**
   * 退出登录
   */
  logout: function() {

  },
  setContent:function (e) {
      this.data.content = e.detail.value;
    console.log(this.data.content);
  },

  createComment:function(){
    var that=this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    console.log(that.cardid);
    wx.request({
      url: app.globalData.url + 'createCardComment',
      data: {
        cardid:that.data.cardid,
        content:that.data.content,
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
            title: '成功',
            icon: 'succes',
            duration: 1000,
            mask:true
           })

        } else { 


        }
      }
    })
  }
 

})
