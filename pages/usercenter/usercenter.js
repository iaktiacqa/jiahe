const app = getApp()
Page({
  data: {
    userInfo: {},
    avatar: '',
    phone: '',
    text: "Page usercenter",
  },
  onLoad: function (options) {
     var that = this;
    // 如果用户昵称和头像有一个为空，则弹框绑定微信信息
    if (!app.globalData.userInfo.nickName
      || !app.globalData.userInfo.avatarUrl) {
      that.checkSession(that);
    } else {
      this.setData({
        userInfo: app.globalData.userInfo
      })
      //this.getUserCenterInfo(that);
      console.log(this.data.userInfo)
    }
  },
  checkSession: function (that) {
    wx.checkSession({
      success: function () {
        that.getUserInfo(that);
      },
      fail() {
        wx.login({
          success: function (res) {
            that.getUserInfo(that);
          }
        })
      }
    });
  },
  // 得到个人中心信息
  getUserCenterInfo: function (that) {
    var userCenterUrl = '/selfshopping/openapi/user/detail';
    app.request(userCenterUrl, null, function (res) {
      //console.log(res);
      app.globalData.userInfo = res.data;
      that.setData({
        userInfo: res.data
      })
    });
  },
  getUserInfo: function (that) {
    wx.getUserInfo({
      withCredentials: false,
      success: function (res) {
        if (res.errMsg === 'getUserInfo:ok') {
          this.globalData.userInfo = res.userInfo;
          this.setData({
            userInfo: res.userInfo
          });
          // 需要更新用户的头像和昵称
          // var updateUrl = '/selfshopping/openapi/user/update';
          // var updateData = {
          //   'nickName': res.userInfo.nickName,
          //   'avatarUrl': res.userInfo.avatarUrl
          // }
          // app.request(updateUrl, updateData, function (res) {
          //   if (res.data.errno === 0) {
          //     that.getUserCenterInfo(that);
          //   }
          // });
        }
      },
      fail: function (res) {
        if (res.errMsg === 'getUserInfo:fail auth deny') {
        }
      }
    });
  },
  // 显示转发按钮
  onShareAppMessage: function () {
    return app.globalData.shareInfo
  }
})