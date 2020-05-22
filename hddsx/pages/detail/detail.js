const time = require("../../utils/time.js");
var util = require("../../utils/public.js");
const app = getApp();
var WxParse = require('../../pages/wxParse/wxParse.js');
Page( {
    data: {
        imgUrl: [
          { url: "../../images/tab/1.png" },
          { url: "../../images/tab/1.png" },
          { url: "../../images/tab/1.png" },
        ],
        indicatorDots: true,
        autoplay: true,
        interval: 4000,
        duration: 1000,
        // text:"这是一个页面"
        data: [],
        databody: null,
        comments : [],  // 评论
        article:[],
        contents:'',
        winHeight: 0,   // 设备高度

        // 弹窗
        modalHidden: true,
        modalValue: null,

        /**
         * 分享配置
         */
        shareShow: 'none',
        shareOpacity: {},
        shareBottom: {},
        id:'',
        title:'',
        isshade:false,
        username:'',
        tel:''

    },
    onLoad: function( options ) {
        // 页面初始化 options 为页面跳转所带来的参数
        var that = this
        var id = options.id;
        that.setData({
            id: id
          })


      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      var url = app.globalData.url + '/public/getActivityDetail';

      wx.request({
        url:url,
        data: {
          id: id
        },
        header: {
          'content-type': 'application/json' // 默认值
        },
        success: function (res) {
          wx.hideLoading();
          if (res.data.code == 200) {
            console.log(res.data.data[0].content);
    
            
            res.data.data[0].createtime = time.formatTime(res.data.data[0].createtime*1, 'Y-M-D h:m:s');
            //res.data.data[0].starttime = time.formatTime(res.data.data[0].starttime * 1, 'Y-M-D h:m:s');
            //res.data.data[0].endtime = time.formatTime(res.data.data[0].endtime * 1, 'Y-M-D h:m:s');
            var imagelist =JSON.parse(res.data.data[0].pics);
            var imgArr=[];
            for (var i = 0; i < imagelist.length; i++){
              var _img = app.globalData.url + "/upload/" + imagelist[i];
              imgArr.push(_img);
            }
            that.setData({
              article: res.data.data[0],
              imgUrl:imgArr
             
            })
          }
        }
      })


     
        


    },
  toBook:function(){
    this.setData({
      isshade:true

    })
  },
  closeBook:function(){
    this.setData({
      isshade: false

    })
  },
  setUsername: function (e) {
    this.data.username = e.detail.value;
  },
  setTel: function (e) {
    this.data.tel = e.detail.value;
  },
  AddBook:function(){

    if (this.data.username == null || this.data.username == undefined || this.data.username == '') {
      wx.showModal({
        content: "联系人不能为空",
        showCancel: false
      })
      return false;
    }

    if (this.data.tel == null || this.data.tel == undefined || this.data.tel == '') {
      wx.showModal({
        content: "联系电话不能为空",
        showCancel: false
      })
      return false;
    } 
    if (this.data.tel.length!=11) {
      wx.showModal({
        content: "请填写正确的电话号码",
        showCancel: false
      })
      return false;
    } 


    debugger;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var url = app.globalData.url + 'bookActivity';
    var that=this;
    wx.request({
      url: url,
      data: {
        id: this.data.id,
        username: this.data.username,
        tel:this.data.tel
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        debugger;
        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            isshade: false

          })

          wx.showModal({
            content: '报名成功',
            showCancel: false
          })


        }
      }
    });


  },
  onShareAppMessage: function () {
    var that=this;
    return {
      title: that.data.title,
      path: "pages/detail/detail?id="+that.data.id,
      success: function (res) {
        // 分享成功
      },
      fail: function (res) {
        // 分享失败
      }
    }
  },
    /**
     * 显示分享
     */
    showShare: function( e ) {

        // 创建动画
        var animation = wx.createAnimation( {
            duration: 100,
            timingFunction: "ease",
        })
        this.animation = animation;

        var that = this;
        that.setData( {
            shareShow: "block",
        });

        setTimeout( function() {
            that.animation.bottom( 0 ).step();
            that.setData( {
                shareBottom: animation.export()
            });
        }.bind( this ), 400 );

        // 遮罩层
        setTimeout( function() {
            that.animation.opacity( 0.3 ).step();
            that.setData( {
                shareOpacity: animation.export()
            });
        }.bind( this ), 400 );

    },

    /**
     * 关闭分享
     */
    shareClose: function() {
        // 创建动画
        var animation = wx.createAnimation( {
            duration: 0,
            timingFunction: "ease"
        })
        this.animation = animation;

        var that = this;

        setTimeout( function() {
            that.animation.bottom( -210 ).step();
            that.setData( {
                shareBottom: animation.export()
            });
        }.bind( this ), 500 );

        setTimeout( function() {
            that.animation.opacity( 0 ).step();
            that.setData( {
                shareOpacity: animation.export()
            });
        }.bind( this ), 500 );

        setTimeout( function() {
            that.setData( {
                shareShow: "none",
            });
        }.bind( this ), 1500 );
    },

    /**
     * 点击分享图标弹出层
     */
    modalTap: function( e ) {
        var that = this;
        that.setData( {
            modalHidden: false,
            modalValue: e.target.dataset.share
        })
    },
    
    /**
     * 关闭弹出层
     */
    modalChange: function( e ) {
        var that = this;
        that.setData( {
            modalHidden: true
        })
    },

    onReady: function() {
        // 页面渲染完成
        // 修改页面标题
        wx.setNavigationBarTitle( {
            title: this.data.data.title
        })


    },
    onShow: function() {







        // 页面显示
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    }
})