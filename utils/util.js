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
/* 
  网络请求公共方法
 */
function request(url, data, successCallback, failCallback, completeCallback) {
  wx.showNavigationBarLoading();
  var app = getApp();
  var BASE_URL = 'https://xrdff.cn';
  if (!data) {
    data = {}
  }
  //公共参数
  data.v = '0.1'
  //data.userId = app.globalData.userId
  //data.brandId = app.globalData.brandId

  wx.request({
    url: BASE_URL + url,
    data: data,
    method: 'POST',
    header: {
      'auth-josan-key': '5a719fb440d9aeff87b86feccb218a76',
      'content-type': 'application/x-www-form-urlencoded'
    },
    success: function (res) {
      wx.hideNavigationBarLoading();
      typeof successCallback == 'function' && successCallback(res)
    },
    fail: function (res) {
      wx.hideNavigationBarLoading();
      typeof failCallback == 'function' && failCallback(res)
    },
    complete: function () {
      wx.hideNavigationBarLoading();
      typeof completeCallback == 'function' && completeCallback()
    }
  })
}
/**
 * 2018-01-01
 */
function getDateStr() {
  var date = new Date();
  var year = date.getFullYear();
  var mon = date.getMonth() + 1;
  var date = date.getDate();
  var nowDay = year + "-" + (mon < 10 ? "0" + mon : mon) + "-" + (date < 10 ? "0" + date : date);
  return nowDay;
}
/**
 * 12:12
 */
function getTimeStr() {
  var date = new Date();
  var hour = date.getHours();
  var min = date.getMinutes();
  return (hour < 10 ? '0' + hour : hour) + ':' + (min < 10 ? '0' + min : min);
}

/**
 * 
 */
function getDistanceStr(startDateStr, endDateStr) {
  var startDate = new Date(startDateStr);
  var endDate;
  if (endDateStr) {
    endDate = new Date(endDateStr)
  } else {
    endDate = new Date();
  }

  var dateDiff = endDate.getTime() - startDate.getTime();
  var dayDiff = Math.floor(dateDiff / (24 * 3600 * 1000));//计算出相差天数
  var leave1 = dateDiff % (24 * 3600 * 1000)    //计算天数后剩余的毫秒数
  var hours = Math.floor(leave1 / (3600 * 1000))//计算出小时数
  //计算相差分钟数
  var leave2 = leave1 % (3600 * 1000)    //计算小时数后剩余的毫秒数
  var minutes = Math.floor(leave2 / (60 * 1000))//计算相差分钟数
  //计算相差秒数
  var leave3 = leave2 % (60 * 1000)      //计算分钟数后剩余的毫秒数
  var seconds = Math.round(leave3 / 1000)
  var result = '';
  if (dayDiff > 0) {
    result = dayDiff + "天" + hours + "小时";
    
  } else if (hours > 0){
    result = hours + "小时 " + minutes + "分钟";
  } else if (minutes > 0) {
    result = minutes + "分钟" + seconds + "秒";
  } else if (seconds > 0) {
    result = seconds + "秒";
  }
  return result;
}

module.exports = {
  formatTime: formatTime,
  request: request,
  getDateStr: getDateStr,
  getTimeStr: getTimeStr,
  getDistanceStr: getDistanceStr
}
