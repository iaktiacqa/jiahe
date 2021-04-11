//app.js
const util = require('utils/util.js')
App({
  onLaunch: function () {
    // // 展示本地存储能力
    this.processLogin();
  },
  processLogin() {
    var app = this;
    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        console.log(res);
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
        var data = {
          'appid': app.globalData.appId,
          'secret': app.globalData.secret,
          'code': res.code
        };
        // var url = '/wx?action=getopenid'
        // // 换取openId和sessionKey
        // app.request(url, data, function (result) {
        //   if (result.errMsg === 'request:ok') {
        //     app.globalData.sessionKey = result.data.session_key;
        //     app.globalData.openId = result.data.openid;
        //   }
        // });
        wx.getUserInfo({
          success: res => {
            // 可以将 res 发送给后台解码出 unionId
            this.globalData.userInfo = res.userInfo
            // 由于 getUserInfo 是网络请求，可能会在 Page.onLoad 之后才返回
            // 所以此处加入 callback 以防止这种情况
            if (this.userInfoReadyCallback) {
              this.userInfoReadyCallback(res)
            }
          }
        })
      }
    })
  },
  request: function (url, data, successCallback, failCallback, completeCallback) {
    util.request(url, data, successCallback, failCallback, completeCallback)
  },
  globalData: {
    userInfo: null,
    appId: 'wx0c967f7bdebc64d2',
    secret: 'ac081e067e1e4b701b231e34acb895b8',
    sessionKey: '',
    openId: '',
    todoNeedRefreshData: false,
  }
})