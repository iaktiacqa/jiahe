// pages/home/home.js
var dateUtil = require('date.js')
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
    day: 0,
    nowYear: 0,
    nowMonth: 0,
    nowDate: 0,
    lastX: 0,
    lastY:0,
    moveSwitch: false,
  },
  handletouchmove:function(event) {
    if (!this.data.moveSwitch) {
      return;
    }
    console.log('handletouchmove');
    let currentX = event.touches[0].pageX
    let currentY = event.touches[0].pageY
    if ((currentX - this.data.lastX) < -20 || (currentY - this.data.lastY)<-20 ) {
      this.setData({
        moveSwitch: false,
      })
      this.nextMonth();
    } else if (((currentX - this.data.lastX) > 20) ||(currentY - this.data.lastY) > 20) {
      this.setData({
        moveSwitch: false,
      })
      this.preMonth();
    }
    this.setData({
      lastX: currentX,
      lastY: currentY
    })
  },
  handletouchtart: function (event) {
    this.setData({
      moveSwitch: true,
      lastX: event.touches[0].pageX,
      lastY: event.touches[0].pageY
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 初始化当前日期
    //this.initNowDate();
  },
  onShow: function (options) {
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
  goNow: function() {
    this.initNowDate();
  },
  /**
   * 上一个月
   */
  preMonth: function () {
    var curMonth = this.data.month
    if (curMonth > 1) {
      this.setData({
        month: curMonth - 1
      })
      this.getDateArr(this.data.year, this.data.month);
    } else if (curMonth === 1) {
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
  getDateArr: function (year, month) {
    // 一个月的总天数
    var curMonthDays = this.getCurMonthDays(year, month);
    // 开始的天数, 0 开始
    var startIndex = this.getStartIndex(year, month) - 1;
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
    for (var i = 1; i <= curMonthDays; i++) {
      // 农历月日
      var ylMonthAndDate = dateUtil.GetLunarDay(year, month, i);
      var ylMonth = ylMonthAndDate.split('-')[0];
      var ylDate = ylMonthAndDate.split('-')[1];
      var date = {};
      date['yangli'] = i;
      // 得到农历，这里是一个对象
      date['yinli'] = this.processYinliDate(ylMonth, ylDate);
      // 判断是不是今天
      if (this.isNow(year, month, i)) {
        date['isNow'] = true;
      } else {
        date['isNow'] = false;
      }
      // 判断有没有生日
      var birthday = this.hasBirthday(ylMonth, ylDate);
      if (birthday) {
        date['birthday'] = birthday;
      }
      curDateArr.push(date);
    }
    this.setData({
      dateArr: curDateArr
    })
    //console.log(this.data)
  },
  /**
   * 处理农历
   */
  processYinliDate(ylMonth, ylDate) {
    var yinli = {};
    yinli['showtext'] = ylDate;
    if (ylDate === '初一') {
      if (ylMonth === '正月') {
        yinli['showtext'] = '春节';
      } else {
        yinli['showtext'] = ylMonth;
      }
      yinli['isFirst'] = true;
    }
    return yinli;
  },
  /**
   * 判断是不是今天
   */
  isNow: function (year, month, date) {
    if (year === this.data.nowYear
      && month === this.data.nowMonth
      && date === this.data.nowDate) {
        return true;
    } else {
      return false;
    }
  },
  /**
   * 判断有没有生日(暂时支持只农历)
   */
  hasBirthday: function (ylmonth, ylday) {
    var birthdayArr = [
      {
        'month':12,
        'date':11,
        'isYinLi': true,
        'name':'唐江玲',
        'nickname': '姐',
        'avatar': '/images/jiejie.jpg',
        'phone': '18075778126'
      },
      {
        'month': 3,
        'date': 12,
        'isYinLi': true,
        'name': '唐国元',
        'nickname': '爸',
        'avatar': '/images/ba.jpg',
        'phone': '17707737661'
      },
      {
        'month': 9,
        'date': 4,
        'isYinLi': true,
        'name': '唐仕云',
        'nickname': '妈',
        'avatar': '/images/ma.jpg',
        'phone': '15878351921'
      },
      {
        'month': 8,
        'date': 4,
        'isYinLi': true,
        'name': '唐江旭',
        'nickname': '我',
        'avatar': '/images/wo.jpg',
        'phone': '15021016721'
      },
      {
        'month': 3,
        'date': 10,
        'isYinLi': true,
        'name': '罗艳文',
        'nickname': '姐夫',
        'avatar': '/images/jiefu.jpg',
        'phone': '17358806816'
      }

    ];
    var monthArr = ['正月', '二月', '三月', '四月', '五月', '六月', '七月', '八月', '九月', '十月','冬月', '腊月'];
    
    var dateArr = ['初一', '初二', '初三', '初四', '初五', '初六', '初七', '初八', '初九', '初十',
      '十一', '十二', '十三', '十四', '十五', '十六', '十七', '十八', '十九', '廿',
      '廿一', '廿二', '廿三', '廿四', '廿五', '廿六', '廿七', '廿八', '廿九', '三十',]
    var month = monthArr.indexOf(ylmonth) + 1;
    var date = dateArr.indexOf(ylday) + 1;
    for (var i = 0; i < birthdayArr.length;i++) {
      var birthday = birthdayArr[i];
      if (birthday.month === month && birthday.date === date) {
        return birthday;
      }
    }

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
      if (this.isLeap(year)) {
        return 29;
      } else {
        return 28;
      }
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
   * 是否是闰年
   */
  isLeap: function (year) {
    if ((year % 4 === 0 && year % 100 !== 0)
      || (year % 400 === 0)) {
      return true;
    } else {
      return false;
    }
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  },
})