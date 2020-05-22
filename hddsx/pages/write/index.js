const api = require("../../utils/activity_api.js");
const upFiles = require('../../utils/activity_upFiles.js')
const app = getApp();
Page({

  data: {
    title:'',
    address:'',
    people:'10',
    money:'',
    starttime:'群内确定',
    endtime:'群内确定',
    username:'',
    tel:'',
    content:'',
    imageurl:[],
    uploadBtn: true,     //上传数量 >= maxUploadLen  控制 添加按钮 显示隐藏
    uploadProgress: false,   //上传进度显示隐藏
    maxUploadLen: 10,  //固定不变最多上传数量
    chooseCount: 9,    //跟随选择与删除图片事件变化   限制可选图片张数 
    uploadArr: null,     //存储选择图片
    deskid:'',
    uniqueid:'1111111',
    imgData:[],
    multiArray: [['今天', '明天', '3-2', '3-3', '3-4', '3-5'], [0, 1, 2, 3, 4, 5, 6], [0, 10, 20]],
    typeArray:["户外","亲子","读书","健身"],
    typeresult:"请选择",
    typevalue:'-1',
    dsxArray:["大师兄_段茂","大师兄_现代田园"],
    dsxresult:"请选择",
    dsxvalue:'-1'
  },

  onLoad(options) {

  
  

  },
  onShow() {

  },
  bindDateChange1: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      starttime: e.detail.value
    })
  },
  bindDateChange2: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    this.setData({
      endtime: e.detail.value
    })
  },
  bindPickerChange3: function (e) {
   
    console.log('picker发送选择改变，携带值为', e.detail.value)

    
    this.setData({
      typevalue: e.detail.value,
      typeresult: this.data.typeArray[e.detail.value]
    })
    
  },
  bindPickerChange4: function (e) {
   
    console.log('picker发送选择改变，携带值为', e.detail.value)

    
    this.setData({
      dsxvalue: e.detail.value,
      dsxresult: this.data.dsxArray[e.detail.value]
    })
    
  },
  
  //监听账号输入
  setTitle: function (e) {
    this.data.title = e.detail.value;
  },
  setAddress: function (e) {
    this.data.address = e.detail.value;
  },
  setMoney: function (e) {
    this.data.money = e.detail.value;
  },
  setUsername: function (e) {
    this.data.username = e.detail.value;
  },
  setTel: function (e) {
    this.data.tel = e.detail.value;
  },
  
  setContent: function (e) {
    this.data.content = e.detail.value;
  },
  uploadImg() {



    var that = this;
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'],
      sourceType: ['album', 'camera'],
      success: function (res) {
        
        var successUp = 0; //成功
        var failUp = 0; //失败
        var length = that.data.imageurl.length+res.tempFilePaths.length; //总数
        var count = 0; //第几张
        //debugger;
        var _imgurl = that.data.imageurl.concat(res.tempFilePaths);
        that.setData({
          imageurl: _imgurl
        })
        that.uploadOneByOne(res.tempFilePaths, successUp, failUp, count, length);
      },
    });
  },
  /**
    * 采用递归的方式上传多张
    */
  uploadOneByOne(imgPaths, successUp, failUp, count, length) {
    var that = this;
    
    wx.showLoading({
      title: '正在上传第' + count + '张',
    })
    debugger;
    wx.uploadFile({
      url: app.globalData.url +'/public/wxPicUpLoad',
      filePath: imgPaths[count],
          name: 'file',
          formData: {
            file: 'file',
            uniqueid: this.data.uniqueid
          },
      complete: function (e) {
        count++;//下一张
        if (count == length) {
          //上传完毕，作一下提示
            console.log('上传成功' + successUp + ',' + '失败' + failUp);
            wx.showToast({
              title: '上传成功' + successUp,
              icon: 'success',
              duration: 2000
            })
          } else {
            //递归调用，上传下一张
            that.uploadOneByOne(imgPaths, successUp, failUp, count, length);
            console.log('正在上传第' + count + '张');
          }
          },
          success(res) {
            var arr = that.data.imgData;
            debugger;
            arr.push(JSON.parse(res.data).data);
            that.setData({
              imgData: arr
            })
            successUp++;//成功+1
          },
          fail: function () {
            failUp++;
          }
        })
      },
  previewImage(e) {
    var that = this;
    var index = e.currentTarget.dataset.order;
    var imgarr = that.data.imageurl;
    debugger;
    wx.previewImage({
      current: imgarr[index],
      urls: imgarr
    })
  },
  delete: function (e) {
    var that = this;
    var index = e.currentTarget.dataset.order;
    var imgarr = that.data.imageurl;

    var _imgData = that.data.imgData;
    _imgData.splice(index, 1);
    imgarr.splice(index, 1);
    debugger;
    that.setData({
      imageurl: imgarr,
      imgData: _imgData

    })
  },

  isempty(name, tip){
    if (name == null || name == undefined || name == '') {
      wx.showModal({
        content: tip,
        showCancel: false
      })
      return false;
    } else {
      return true;
    }
  },

  // 提交评价  next
  saveFiles() {
    var that=this;
    if (this.data.title == null || this.data.title == undefined || this.data.title == '') {
      wx.showModal({
        content: "标题不能为空",
        showCancel: false
      })
      return false;
    } 
  
    if (this.data.address == null || this.data.address == undefined || this.data.address == '') {
      wx.showModal({
        content: "地址不能为空",
        showCancel: false
      })
      return false;
    } 

    if (this.data.typevalue == "-1") {
      wx.showModal({
        content: "活动类型未选择",
        showCancel: false
      })
      return false;
    } 
   

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

    if (!this.data.imgData || this.data.imgData.length <= 0) {
      wx.showModal({
        content: "照片未选择",
        showCancel: false
      })
      return false;
    }

    if (this.data.content == null || this.data.content == undefined || this.data.content == '') {
      wx.showModal({
        content: "活动内容还未填写",
        showCancel: false
      })
      return false;
    } 
    if (this.data.dsxvalue == "-1") {
      wx.showModal({
        content: "请至少选择一名大师兄参与组建活动",
        showCancel: false
      })
      return false;
    } 
    
          this.setData({
            uploadProgress: false,
            uploadBtn: true,
            uploadArr: null,
          })
          wx.request({
            url: app.globalData.url + '/public/wxCreateActivity',
            data: {
              title:this.data.title,
              people:this.data.people,
              address:this.data.address,
              money:this.data.money,
              starttime:this.data.starttime,
              endtime:this.data.endtime,
              username:this.data.username,
              tel:this.data.tel,
              content:this.data.content,
              imageurl: this.data.imgData,
              typeresult:this.data.typeresult,
              typevalue:this.data.typevalue,
              dsxresult:this.data.dsxresult,
              dsxvalue:this.data.dsxvalue
            },
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (result) {
              debugger;
              wx.hideLoading();
              console.log(result);
              if (result.statusCode == 200) {
                wx.showModal({
                  content: '发布成功',
                  showCancel: false
                })
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


})