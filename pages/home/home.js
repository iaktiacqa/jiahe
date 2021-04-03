// pages/home/home.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    weekArr: ['周一', '周二', '周三', '周四', '周五', '周六', '周日'],
    dateArr: [],
    dateLines: 5,
    startIndex: 0,
    curMonthDays: 0,
    year: 0,
    month: 0,
    date: 0,
    nowYear:0,
    nowMonth:0,
    nowDate: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化当前日期
    this.initNowDate();
  },
  /**
   * 初始化当前数据
   */
  initNowDate() {
    var curDate = new Date();
    this.setData({
      year: curDate.getFullYear(),
      month: curDate.getMonth() + 1,
      date: curDate.getDate(),
      day: curDate.getDay(),
      nowYear: curDate.getFullYear(),
      nowMonth: curDate.getMonth() + 1,
      nowDate: curDate.getDate(),
    })
    this.getDateArr(curDate.getFullYear(), curDate.getMonth() + 1);
  },
  /**
   * 上一个月
   */
  preMonth: function() {
    var curMonth = this.data.month
    if ( curMonth > 1) {
      this.setData({
        month: curMonth - 1
      })
      this.getDateArr(this.data.year, this.data.month);
    } else if (curMonth === 1){
      var curYear = this.data.year;
      this.setData({
        month: 12,
        year: curYear - 1
      });
      this.getDateArr(this.data.year, this.data.month);
    }
  },
  /**
   * 下一个月
   */
  nextMonth: function () {
    var curMonth = this.data.month
    if (curMonth < 12) {
      this.setData({
        month: curMonth + 1
      })
      this.getDateArr(this.data.year, this.data.month);
    } else if (curMonth === 12) {
      var curYear = this.data.year;
      this.setData({
        month: 1,
        year: curYear + 1
      });
      this.getDateArr(this.data.year, this.data.month);
    }
  },
/**
 * 得到当前月的日期数组
 */
  getDateArr: function(year, month) {
    // 一个月的总天数
    var curMonthDays = this.getCurMonthDays(year, month);
    // 开始的天数, 0 开始
    var startIndex = this.getStartIndex(year, month) - 1 ;
    // 需要总共的行数，5或6
    var dateLines = 5;
    if (curMonthDays + startIndex > 35) {
      dateLines = 6;
    }
    this.setData({
      curMonthDays: curMonthDays,
      startIndex: startIndex,
      dateLines: dateLines
    })
    var curDateArr = [];
    // 构造数据
    for (var i = 1; i <= curMonthDays; i++){
      console.log(this.data.nowDate)
      if (year === this.data.nowYear 
        && month === this.data.nowMonth 
        && i === this.data.nowDate) {
        curDateArr.push({
          yangli: i,
          isNow: true
        })
      } else {
        curDateArr.push({
          yangli: i,
          isNow: false
        })
      }
    }
    this.setData({
      dateArr: curDateArr
    })
    console.log(this.data)
  },
  /**
   * 得到一个月开始的天数
   */
  getStartIndex: function (year, month) {
    var firstDate = new Date(year + '-' + month + '-01');
    var day = firstDate.getDay();
    if (day === 0) {
      day = 7;
    }
    return day;
  },
  /**
   * 得到当前也的天数
   */
  getCurMonthDays: function (year, month) {
    if (month === 2) {
      return 28;
    } else if (month === 1 || month === 2
      || month === 3 || month === 5
      || month === 7 || month === 8
      || month === 10 || month === 12) {
      return 31;
    } else {
      return 30;
    }
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
  
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
  
  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {
  
  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
  
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
  
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }

})