const time = require("../../utils/time.js");
var util = require("../../utils/public.js");
const app = getApp();
var WxParse = require('../../pages/wxParse/wxParse.js');
Page( {
    data: {
       title:'攻略',
       picurl: app.globalData.url,
       detailObj:[]

    },
    onLoad: function( options ) {
        // 页面初始化 options 为页面跳转所带来的参数
        var that = this
        var id = options.id;
        that.setData({
            id: id
          })
        wx.setStorageSync('articleid',id);

      wx.showLoading({
        title: '加载中...',
        mask: true
      })
      var url = app.globalData.url + '/public/GetArticleDetail';

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
            var _result=res.data.data[0];
            _result.content=that.replaceDetail(_result.content);
            _result.createtime=time.formatTime(parseInt(_result.createtime), 'Y-M-D h:m:s');
            that.setData({
              article: _result
            })
            wx.setStorageSync('articletitle',_result.title);
          }
        }
      })


     
        


    },
  replaceDetail:function(details){
      var texts='';//待拼接的内容
      while(details.indexOf('<img')!=-1){//寻找img 循环
        texts+=details.substring('0',details.indexOf('<img')+4);//截取到<img前面的内容
        details = details.substring(details.indexOf('<img')+4);//<img 后面的内容
        if(details.indexOf('style=')!=-1 && details.indexOf('style=')<details.indexOf('>')){
          texts+=details.substring(0,details.indexOf('style="')+7)+"max-width:100%;height:auto;margin:0 auto;";//从 <img 后面的内容 截取到style= 加上自己要加的内容
          details=details.substring(details.indexOf('style="')+7); //style后面的内容拼接
        }else{
          texts+=' style="max-width:100%;height:auto;margin:0 auto;" ';
        }
      }
      texts+=details;//最后拼接的内容
      return texts
    },
  toBook:function(){
    this.setData({
      isicon:false,
      isshade:true

    })
  },
  toGroup: function () {
    this.setData({
      isicon: false,
      isshade1: true

    })
  },
  closeBook:function(){
    this.setData({
      isicon: true,
      isshade: false

    })
  },
  closeGroup: function () {
    this.setData({
      isicon: true,
      isshade1: false

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
  previewImage: function (e) {
    var that=this;
    var src = that.data.imgPath;//获取data-src
    var imgList = [that.data.imgPath];//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })

  },
  saveImg(e) {
    let url = e.currentTarget.dataset.cur;
    wx.saveImageToPhotosAlbum({
      filePath: url,
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res);
      }
    })
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
            title:wx.getStorageSync('articletitle')
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
    },
    onShareAppMessage: function () {
   

      var _id=wx.getStorageSync('articleid');
      return {
        title: '活动大师兄',
        path: 'pages/ways/detail?id='+_id,
        success: function (res) {
          // 分享成功
        },
        fail: function (res) {
          // 分享失败
        }
      }
    },
    onShareTimeline: () => {

      var _title=wx.getStorageSync('articletitle');
      var _id=wx.getStorageSync('articleid');
      return {
        title: _title,
        query: "id="+_id,
        imageUrl: "https://www.sxbbt.net/qrcode/hddsx.jpg"
      }
    }
})