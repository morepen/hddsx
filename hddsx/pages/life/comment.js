//person.js
const app = getApp();
const time = require("../../utils/time.js");

Page({
  data: {
    title:'活动评论',
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
    isShow1: true,
    pichost: app.globalData.url+'/upload/images/',
    defaultavatarUrl:'../../images/default.jpg',
    _nickname:wx.getStorageSync('nickname')
  },
  onLoad: function (options) {


    var that = this;
    var cardid;

    that.setData({
      cardid: options.id
    })
    
    wx.setStorageSync('commentid',options.id);
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    wx.request({
      url: app.globalData.url + '/public/GetCardComment',
      data: {
        cardid:that.data.cardid
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
          var imagelist = JSON.parse(res.data.data.comentone[0].piclist);

          var imgArr = [];
          for (var i = 0; i < imagelist.length; i++) {

            var _img = app.globalData.hosturl + "/nginxImage/images/" + imagelist[i];
            imgArr.push(_img);
          }
          
          that.setData({
            cur_item: res.data.data.comentone[0],
            piclist: imgArr,
            cardtime: time.formatTime(parseInt(res.data.data.comentone[0].createtime),'Y-M-D h:m:s'),
            commentlist: list_arr 
          });
          wx.setStorageSync('commenttitle',res.data.data.comentone[0].content);
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
  },

  createComment:function(){
    var that=this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    
    var _nickname=wx.getStorageSync('nickname');
    if(_nickname==''){
      wx.navigateTo({
        url: '../usercenter/usercenter'
      })
    }else{



    if (this.data.content == null || this.data.content == undefined || this.data.content == '') {
      wx.showModal({
        content: "评论内容不能为空",
        showCancel: false
      })
      return false;
    } 
    var _openid = wx.getStorageSync('openid');
    var _nickname = wx.getStorageSync('nickname');
    wx.request({
      url: app.globalData.url + '/public/createCardComment',
      data: {
        cardid:that.data.cardid,
        content:that.data.content,
        nickName: _nickname != '' ? _nickname:'匿名用户',
        openid: _openid,
        avatarUrl: app.globalData.userInfo.avatarUrl
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        wx.hideLoading();
        
     

        if (res.data.code == 200) {

         
          wx.showToast({
            title: '评论已提交审核，通过后可见！',
            icon: 'succes',
            duration: 1000,
            mask: true
          })

          var cur_item={
            content:that.data.content,
            nickName: _nickname,
            avatarUrl: app.globalData.userInfo.avatarUrl,
            createtime:"刚刚"
          }
          var coment_Arr=that.data.commentlist;
          coment_Arr.push(cur_item);
          that.setData({
            commentlist: coment_Arr  
          });
          that.setData({
            content: ""  
          });
          
          wx.navigateBack({
            delta: 1
          })


          

        } else { 
          wx.showToast({
            title: '操作失败',
            icon: 'succes',
            duration: 1000,
            mask:true
           })

        }
        
      }
    })


   }
  },
  onShareAppMessage: function () {
    var _id=wx.getStorageSync('commentid');
    return {
      title: '活动大师兄',
      path: 'pages/life/comment?id='+_id,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
  onShareTimeline: () => {

    var _title=wx.getStorageSync('commenttitle');
    var _id=wx.getStorageSync('commentid');
    debugger;
    return {
      title:"[评论]"+_title,
      query: "id="+_id,
      imageUrl: "https://www.sxbbt.net/qrcode/hddsx.jpg"
    }
  }
 

})
