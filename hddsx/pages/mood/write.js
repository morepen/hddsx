const api = require("../../utils/activity_api.js");
const upFiles = require('../../utils/activity_upFiles.js')
const app = getApp();
Page({

  data: {

    title:'发布精彩瞬间',
    content:'',
    uploadBtn: true,     //上传数量 >= maxUploadLen  控制 添加按钮 显示隐藏
    uploadProgress: false,   //上传进度显示隐藏
    maxUploadLen: 10,  //固定不变最多上传数量
    chooseCount: 9,    //跟随选择与删除图片事件变化   限制可选图片张数 
    uploadArr: null,     //存储选择图片
    deskid:''
  },

  onLoad(options) {

    var deskid = options.deskid;
    var that = this;
    that.setData({
      deskid: options.deskid
    })

    wx.navigateTo({
      url: '/pages/index/index',
    })


  },
  onShow() {

  },
  //监听账号输入
  setTitle: function (e) {
    this.data.title = e.detail.value;
  },

  //监听密码输入
  setContent: function (e) {
    this.data.content = e.detail.value;
  },

  // 预览图片
  previewImg: function (e) {
    let imgsrc = e.currentTarget.dataset.presrc;
    let _this = this;
    let arr = _this.data.uploadArr;
    let preArr = [];
    arr.map(function (v, i) {
      preArr.push(v.path)
    })
    //   console.log(preArr)
    wx.previewImage({
      current: imgsrc,
      urls: preArr
    })
  },
  // 删除上传图片 
  delFile: function (e) {
    let _this = this;
    wx.showModal({
      title: '提示',
      content: '您确认删除吗？',
      success: function (res) {
        if (res.confirm) {
          let delNum = e.currentTarget.dataset.index;
          let delType = e.currentTarget.dataset.type;
          let uploadArr = _this.data.uploadArr;
          let upVideoArr = _this.data.upVideoArr;

          uploadArr.splice(delNum, 1)
          _this.setData({
            uploadArr: uploadArr,
          })

          let upFilesArr = upFiles.getPathArr(_this);


          if (upFilesArr.length < _this.data.maxUploadLen) {
            _this.setData({
              uploadBtn: true,
              chooseCount: _this.data.maxUploadLen - upFilesArr.length
            })
          }

        } else if (res.cancel) {
          // console.log('用户点击取消')
        }
      }
    })


  },
  // 选择图片
  uploadFiles: function (e) {
    var _this = this;
    upFiles.chooseImage(_this, _this.data.maxUploadLen)
  },
  // 上传文件
  subFormData() {
    let _this = this;
    return new Promise(function (resolve, reject) {

      let upData = {};
      let uploadArr = _this.data.uploadArr;
      let upVideoArr = _this.data.upVideoArr;
      _this.setData({
        uploadProgress: true,
      })
      upData['url'] = api.activity_upFiles.url;
      console.log(api.activity_upFiles.url);
      upFiles.upFilesFun(_this, upData, function (res) {
      
        console.log('上传失败001',res)
        if (res.index < uploadArr.length) {
          uploadArr[res.index]['progress'] = res.progress
          _this.setData({
            uploadArr: uploadArr,
          })
        } else {
          let i = res.index - uploadArr.length;
          upVideoArr[i]['progress'] = res.progress
          _this.setData({
            upVideoArr: upVideoArr,
          })
        }
        //   console.log(res)
      }, function (err) {

        resolve({ code: 1, result: err })
        console.log('上传返回结果002', err)

      })


    })

  },

  // 提交评价  next
  saveFiles() {
    var that=this;
    console.log("saveFiles");
    if (!this.data.uploadArr || this.data.uploadArr.length <= 0) {
      console.log('没选图片')
      return false;
    }
    // let upFilesArr_str = upFiles.getPicArr(that);
    // debugger;

    console.log('选择图片了', this.data.uploadArr)
      this.subFormData().then((res) => {
        console.log(res, " 上传结果")
        //code 为上传成功 图片
        if (res.code == 1) {
          this.setData({
            uploadProgress: false,
            uploadBtn: true,
            uploadArr: null,
          })
          console.log(that.data.deskid);
          wx.request({
            url: app.globalData.url + '/public/wxAddCard',
            data: {
              openid: app.globalData.openid,
              piclist: app.globalData.fileStr,
              content: that.data.content,
              title: that.data.title,
              nickName: app.globalData.userInfo.nickName,
              avatarUrl: app.globalData.userInfo.avatarUrl,
              address: app.globalData.address,
              deskid:that.data.deskid
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (result) {
              debugger;
              wx.hideLoading();
              console.log(result);
              if (result.statusCode == 200) {

                //wx.showToast({
                  //title: '内容已提交审核中，审核通过后可见！',
                  //icon: 'succes',
                  //duration: 4000,
                  //mask: true
                //})

                wx.showModal({
                  content: '发布成功',
                  showCancel: false
                })
                var pages = getCurrentPages();
                var beforePage = pages[pages.length - 2];
                beforePage.initData();
                wx.navigateBack({
                  delta: 1
                })
          

              }
              else {
                wx.showModal({
                  content: '发布失败',
                  showCancel: false
                })
              }
            }
          }); 
        

        }
      })

  

  },
  onGotUserInfo(e) {
    console.log(e.detail.errMsg)
    console.log(e.detail.userInfo)
    console.log(e.detail.rawData)
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true
    })
  },
  onShareAppMessage: function () {
    return {
      title: '活动大师兄',
      path: 'pages/mood/write',
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