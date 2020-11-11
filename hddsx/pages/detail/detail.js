const time = require("../../utils/time.js");
var util = require("../../utils/public.js");
const utils = require('../../utils/util.js');
const app = getApp();
var WxParse = require('../../pages/wxParse/wxParse.js');
Page( {
    data: {
       title:'活动详情',
       picurl: app.globalData.url,
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
        openid:'',
        username: app.globalData.userInfo.nickName,
        tel: wx.getStorageSync('tel'),
        nickname:wx.getStorageSync('nickname'),
        isshade1:false,
        isicon:true,
        imgPath:'',
        wxqueue:"",
        imagePath: '',
        maskHidden:false,
        coverpic: "",
        qrcode:"",
        coverpic_path:'',
        qrcode_path:'',
        phoneNumber:'',
        countryCode: '',
        showAuthorizeStatus:true,
        isshade2:false


    },
    onLoad: function(options) {
        // 页面初始化 options 为页面跳转所带来的参数
        var that = this
        var id = options.id;
        
        that.setData({
            id: id
          })
        wx.setStorageSync('detailid',id);
        that.checkAuth();
        wx.showShareMenu({
            withShareTicket: true,
            menus: ['shareAppMessage', 'shareTimeline']
        });
            
            
  
      
     

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
            
           
            
            res.data.data[0].createtime = time.formatTime(res.data.data[0].createtime*1, 'Y-M-D h:m:s');
            var tomorrow = new Date().getTime() + 24*60*60*1000;
            var _tomorrow= time.formatTime(tomorrow * 1, 'Y-M-D ');
            var _time=res.data.data[0].starttime=='群内确定'?_tomorrow:res.data.data[0].starttime;
            var _time1=res.data.data[0].endtime=='群内确定'?_tomorrow:res.data.data[0].endtime;
            res.data.data[0].starttime = _time;
            res.data.data[0].endtime = _time1;
            var imagelist =JSON.parse(res.data.data[0].pics);
          
            var imgArr=[];
            for (var i = 0; i < imagelist.length; i++){
             
              var _img = app.globalData.hosturl + "/nginxImage/" + imagelist[i];
              imgArr.push(_img);
            }
           
            that.setData({
              title:res.data.data[0].title,
              article: res.data.data[0],
              qrcode: app.globalData.hosturl + "/nginxImage/" + res.data.data[0].qrcode,
              coverpic: app.globalData.hosturl + "/nginxImage/" + imagelist[0],
              imgPath:app.globalData.hosturl+ res.data.data[0].wxgroup,
              wxqueue:app.globalData.hosturl+"/nginxImage/" + res.data.data[0].wxqueue,
              imgUrl:imgArr
            })

            wx.setStorageSync('detailtitle',res.data.data[0].title);
          }
        }
      })


     
        


    },
  checkAuth:function(){
    var _openid=wx.getStorageSync('openid');
    var _nickname=wx.getStorageSync('nickname');
    var _tel=wx.getStorageSync('tel');
    var flag=_openid&&_nickname&&_tel;

    if(!flag||flag==''){
      
      //var _path='../detail/detail';
      
      wx.navigateTo({
        url: '../usercenter/usercenter'
      })
    }
  },
  getDetailId:function(){
     return this.data.id;
  },
  getGoodsImgPath: function () {
    return new Promise((success, fail) => {
      if (this.data.coverpic_path) {
        success(this.data.coverpic_path);
      } else {
        wx.getImageInfo({
          src: this.data.coverpic,
          success: res => {
            this.setData({
              coverpic_path: res.path
            })
            success(res.path);
          },
          fail: res => {
            fail(res);
          }
        })
      }
    });
  },
  getGoodsImgPath1: function () {
    return new Promise((success, fail) => {
      if (this.data.qrcode_path) {
        success(this.data.qrcode_path);
      } else {
        wx.getImageInfo({
          src: this.data.qrcode,
          success: res => {
            this.setData({
              qrcode_path: res.path
            })
            success(res.path);
          },
          fail: res => {
            fail(res);
          }
        })
      }
    });
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
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
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
        wx.hideLoading();
        if (res.data.code == 200) {
          
          var _result = JSON.parse(res.data.data);
          wx.setStorageSync('tel', _result.phoneNumber);
          that.setData({
            tel: _result.phoneNumber,
            countryCode: _result.countryCode,
            showAuthorizeStatus: false
          })
         

        }
      }
    });
  },
  showUse: function () {
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
  PayBook: function () {
   
    var that = this;
    if (this.data.nickname == null || this.data.nickname == undefined || this.data.nickname == '') {
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
    if (this.data.tel.length != 11) {
      wx.showModal({
        content: "请填写正确的电话号码",
        showCancel: false
      })
      return false;
    }
    app.getOpenid().then(function (res) {
      if (res.statusCode == 200) {
        app.globalData.openid = wx.getStorageSync('openid');
        var openid = wx.getStorageSync('openid');

        if(openid){
          that.setData({
            openid:openid
          })
          that.showpayitem();
          //that.handlepay(openid);
        }else{
          wx.navigateTo({
            url: '../usercenter/usercenter'
          })
        }
        
      }
      else {
        //console.log(res.data);
      }
    })
  },
  showpayitem:function(){
   
    this.setData({
      isshade:false,
      isshade2: true
    })
  },
  JfBook:function(){
    var _openid=wx.getStorageSync('openid');
    if(!_openid){
      wx.navigateTo({
        url: '../usercenter/usercenter'
      })
    }
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
  
    var url = app.globalData.url + '/pay/jfpay';
    wx.request({
      url: url,
      data: {
        activityid:that.data.id,
        openid:_openid,
        total_fee: that.data.article.money*10
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var _obj = res.data.data;

        wx.hideLoading();
        if (res.data.code == 200) {
          debugger;
          that.AddBook(2);
        }else{
          debugger;
          that.setData({

            isshade2:false
      
          })
          wx.showModal({
            content: res.data.msg,
            showCancel: false
          })
          return false;
        }
      }
    });
  },
  wxBook: function () {
    var _openid=wx.getStorageSync('openid');
    if(!_openid){
      wx.navigateTo({
        url: '../usercenter/usercenter'
      })
    }
    var that = this;
    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var _str = "";  //订单号
    for (var i = 0; i < 16; i++) //16位随机数，用以加在时间戳后面。
    {
      _str += Math.floor(Math.random() * 10);
    }
    var outTradeNo = "HD" + time.onetime() + _str;
    var url = app.globalData.url + '/pay/getsmall';
    wx.request({
      url: url,
      data: {
        openid:_openid,
        total_fee: that.data.article.money,
        token: 'oU3PAjpiOub05GR56oTRgK85kDak',
        out_trade_no: outTradeNo
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var _obj = res.data.data;

        wx.hideLoading();
        if (res.data.code == 200) {
          var timestamp = Date.parse(new Date());
          timestamp = timestamp / 1000;

          wx.requestPayment(
            {
              'timeStamp': _obj.timeStamp,
              'nonceStr': _obj.nonceStr,
              'package': _obj.package,
              'signType': _obj.signType,
              'paySign': _obj.sign,
              'success': function (res) {
                that.AddBook(1);
              },
              'fail': function (res) {
                
                console.log(res);
                //wx.showModal({
                //content: res.errMsg,
                //showCancel: false
                // })

              },
              'complete': function (res) {

              }
            })



        }
      }
    });
  },
  createpic:function(url){
    var that=this;
    wx.downloadFile({
      url: url,//网络路径
      success: res => {
        let path = res.tempFilePath //临时本地路径
        that.data.coverpic = res.tempFilePath;
      }
    })
  },
  toHideHb: function () {
    this.setData({
      ishb:true
    });
  },
  //点击生成海报
  toShowHb: function (e) {

    var that = this;
    this.setData({
      maskHidden: false,
      isshade: false,
      ishb:false
    });
    wx.showToast({
      title: '正在生成中...',
      icon: 'loading',
      duration: 1000
    });
    setTimeout(function () {
      wx.hideToast()
      that.createNewImg();
      that.setData({
        maskHidden: true
      });
    }, 1000)
  }, 

  createNewImg: function () {
    var that = this;
    that.getGoodsImgPath().then((res) => {
      that.getGoodsImgPath1().then((res) => {
        var context = wx.createCanvasContext('mycanvas');
        //context.setFillStyle("#03b349")
        context.setFillStyle("#ffffff")
        context.fillRect(0, 0, 375, 667)

        //var path1 = that.data.imgUrl[0];

        context.drawImage(that.data.coverpic_path, 0, 0, 375, 200);

      


        context.setFontSize(16);
        context.setFillStyle('#333');
        context.setTextAlign('left');
        var str1 = "活动主题:" + that.data.article.title;
        context.fillText(str1, 20, 250);
        context.stroke();

        context.setFontSize(16);
        context.setFillStyle('#333');
        context.setTextAlign('left');
        var str2 = "活动时间:" + that.data.article.starttime;
        context.fillText(str2, 20, 300);
        context.stroke();

        context.setFontSize(16);
        context.setFillStyle('#333');
        context.setTextAlign('left');
        var str3 = "活动地点:" + that.data.article.address;
        context.fillText(str3, 20, 350);
        context.stroke();

        context.setFontSize(16);
        context.setFillStyle('#333');
        context.setTextAlign('left');
        var str4 = "联系方式：" + that.data.article.contactname + "/" + that.data.article.contacttel;
        context.fillText(str4, 20, 400);
        context.stroke();


        var path5 = that.data.qrcode_path;
        context.drawImage(path5, 115, 440, 140, 140);

        context.setFontSize(14);
        context.setFillStyle('#333');
        context.setTextAlign('left');
        var str5 = "长按识别二维码，查看我小程序官网";
        context.fillText(str5, 80, 610);
        context.stroke();


        context.draw();

        //将生成好的图片保存到本地，需要延迟一会，绘制期间耗时
        setTimeout(function () {
          wx.canvasToTempFilePath({
            canvasId: 'mycanvas',
            success: function (res) {
              var tempFilePath = res.tempFilePath;

              that.setData({
                imagePath: tempFilePath,
                maskHidden: true
              });

            },
            fail: function (res) {
              console.log(res);
            }
          });
        }, 200);
      })
    })
   
  },
  //点击保存到相册
  baocun: function () {

   

    var that = this
    wx.saveImageToPhotosAlbum({
      filePath: that.data.imagePath,
      success(res) {
        wx.showModal({
          content: '图片已保存到相册，赶紧发送好朋友或分享朋友圈吧~',
          showCancel: false,
          confirmText: '好的',
          confirmColor: '#333',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定');
              /* 该隐藏的隐藏 */
              that.setData({
                maskHidden: false,
                isicon: true,
                isshade: false
              })
            }
          }, fail: function (res) {
            console.log(11111)
          }
        })
      }
    })
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
  closeShade2:function(){
    this.setData({
      isicon: true,
      isshade2: false

    })
  },
  setUsername: function (e) {
    this.data.username = e.detail.value;
  },
  setTel: function (e) {
    this.data.tel = e.detail.value;
  },
  AddBook: function (type) {



    wx.showLoading({
      title: '加载中...',
      mask: true
    })
    var url = app.globalData.url + '/public/bookActivity';
    var that = this;
    wx.request({
      url: url,
      data: {
        id: this.data.id,
        openid:wx.getStorageSync('openid'),
        username: this.data.nickname,
        tel: this.data.tel,
        paytype:type
      },
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {

        wx.hideLoading();
        if (res.data.code == 200) {
          that.setData({
            isshade: false,
            isshade2:false
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
  previewImage1: function (e) {
    var that=this;
    var src = that.data.wxqueue;//获取data-src
    var imgList = [that.data.wxqueue];//获取data-list
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
       


    },
    onShow: function() {
      
    },
    onHide: function() {
        // 页面隐藏
    },
    onUnload: function() {
        // 页面关闭
    },
    onShareAppMessage: function () {
      return {
        title: '活动大师兄',
        path: "pages/detail/detail?id="+this.data.id,
        success: function (res) {
          // 分享成功
        },
        fail: function (res) {
          // 分享失败
        }
      }
    },
    onShareTimeline: () => {
      var _title=wx.getStorageSync('detailtitle');
      var _id=wx.getStorageSync('detailid');
      return {
        title:_title,
        query: "id="+_id,
        imageUrl: "https://www.sxbbt.net/qrcode/hddsx.jpg"
      }
    }
})