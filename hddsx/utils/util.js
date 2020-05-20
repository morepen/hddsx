const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

const showMsg = function (title) {
  wx.showToast({
    title: title,
    icon: 'none'
  })
}


const validatemobile = function (mobile) {//手机号码校验
  if (mobile == undefined || mobile == '') {
    showMsg('请输入手机号！')
    return false;
  }
  if (mobile.length != 11) {
    showMsg('手机号长度有误！')
    return false;
  }
  var myreg = /^(((13[0-9]{1})|(15[0-9]{1})|(18[0-9]{1})|(17[0-9]{1}))+\d{8})$/;
  if (!myreg.test(mobile)) {
    showMsg('手机号有误！')
    return false;
  }
  return true;
}

const isEmpty = function (obj, msg) {//为空判断
  if (obj == undefined || obj == '') {
    showMsg(msg + '不能为空！')
    return false;
  }
  return true;
}

const getUserMsg = function (fn) {//获取用户信息并登录
  var app = getApp();
  wx.getUserInfo({
    //调用 getUserInfo 获取头像昵称
    success: res => {
      // 可以将 res 发送给后台解码出 unionId
      app.globalData.userInfo = res.userInfo;

      //userLogin(fn);

      // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
      // 所以此处加入 callback 以防止这种情况
      if (app.userInfoReadyCallback) {
        app.userInfoReadyCallback(res)
      }
    }
  })
}

const userLogin = function (fn) {
  // var app = getApp();
  // var pages = getCurrentPages()    //获取加载的页面
  // var currentPage = pages[pages.length - 1]
  
  // if (app.globalData.userToken == null || app.globalData.isPromise != 1) {    
  //   // 登录
  //   wx.login({
  //     success: res => {
  //       // 发送 res.code 到后台换取 openId, sessionKey, unionId
  //       if (res.code) {
  //         var code = res.code;

  //         getUserMsg(fn);

  //         //发起网络请求
  //         //请求banner和简介数据
  //         wx.request({
  //           url: app.globalData.service + '/api/index/onLogin',
  //           method: 'POST',
  //           data: {
  //             code: code,
  //             userInfo: app.globalData.userInfo,
  //             inviteCode: fn
  //           },
  //           success: function (res) {
  //             console.log(res);
  //             var data = res.data;
  //             if (data.code == 0) {
  //               //self.data.indexImg = data.result;
  //               app.globalData.userToken = data.result.userToken;
  //               app.globalData.isPromise = data.result.isPromise;
  //               app.globalData.servicePhone = data.result.servicePhone;
  //               app.globalData.userVersion = data.result.userVersion;

  //               if (data.result.isPromise == 0) {
  //                 currentPage.setData({
  //                   showBombStatus: true
  //                 });
  //               }
  //             }
              
  //           }
            
  //         })
  //       } else {
  //         console.log('登录失败！' + res.errMsg)
  //       }
  //     }
  //   })
  // }
}

// const showAuthModal = function (fn) {
//   var app = getApp();
//   wx.showModal({
//     title: '提示',
//     content: '产融通需要获取您的"用户信息"授权方能正常使用',
//     showCancel: false,
//     success: function (res) {
//       setTimeout(function (res) {
//         wx.openSetting({
//           success: function (data) {
//             if (data) {
//               if (data.authSetting['scope.userInfo']) {
//                 getUserMsg(fn);

//                 var pages = getCurrentPages()    //获取加载的页面
//                 var currentPage = pages[pages.length - 1]

//                 if (app.globalData.isPromise == 0) {
//                   currentPage.setData({
//                     showBombStatus: true
//                   });
//                 }

//               } else {
//                 showAuthModal(fn);
//                 // wx.switchTab({
//                 //   url: '/pages/index/index'
//                 // })
//               }
//             }
//           },
//           fail: function () {
//             showAuthModal(fn);
//             // wx.switchTab({
//             //   url: '/pages/index/index'
//             // })
//           }
//         })
//       }, 100)
//     }
//   })
// }

// const checkUserInfoAuth = function (fn) {//授权判断和处理
//   var app = getApp();
//   console.log('inviteCode=>' + fn);
//   wx.getSetting({
//     success(res) {
//       if (!res.authSetting['scope.userInfo']) {        
//         wx.authorize({
//           scope: 'scope.userInfo',
//           success() {
//             getUserMsg(fn);

//             var pages = getCurrentPages()    //获取加载的页面
//             var currentPage = pages[pages.length - 1]

//             if (app.globalData.isPromise == 0) {
//               currentPage.setData({
//                 showBombStatus: true
//               });
//             }
//           },
//           fail() {
//             //wx.openSetting(); 
//             showAuthModal(fn);
//           }
//         })
//       } else {        
//         getUserMsg(fn);

//         var pages = getCurrentPages()    //获取加载的页面
//         var currentPage = pages[pages.length - 1]

//         if (app.globalData.isPromise == 0) {
//           currentPage.setData({
//             showBombStatus: true
//           });
//         }
//       }
//     }
//   });
// }

const checkUserInfoAuth = function (fn) {//授权判断和处理
  var app = getApp();
  var pages = getCurrentPages()    //获取加载的页面
  var currentPage = pages[pages.length - 1]

  // 查看是否授权
  wx.getSetting({
    success: function (res) {

      if (res.authSetting['scope.userInfo']) {
        wx.getUserInfo({
          success: function (res) {
            //console.log(res.userInfo)
            //用户已经授权过 
            currentPage.setData({
              showAuthorizeStatus: false
            });            
          }
        })
      } else {
        currentPage.setData({
          showAuthorizeStatus: true
        });
      }

      userLogin(fn);
    }
  })
}


const mergeComponents=function() {
  let pageObj = arguments[0];
  let length = arguments.length;
  for (let i = 1; i < length; i++) {
    let compObj = arguments[i];
    for (let compKey in compObj) {
      if (compKey == 'data') {
        // 合并页面中的data
        let data = compObj[compKey];
        for (let dataKey in data) {
          pageObj.data[dataKey] = data[dataKey];
        }
      } else {
        // 合并页面中的方法
        pageObj[compKey] = compObj[compKey];
      }
    }
  }
}

module.exports = {
  formatTime: formatTime,
  showMsg: showMsg,
  validatemobile: validatemobile,
  isEmpty: isEmpty,
  getUserMsg: getUserMsg,
  userLogin: userLogin,
  checkUserInfoAuth: checkUserInfoAuth,
  mergeComponents: mergeComponents

}