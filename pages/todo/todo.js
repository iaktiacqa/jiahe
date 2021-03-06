// pages/todo/todo.js
const util = require('../../utils/util.js')
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    scrollviewHeight: 0,
    curStatus: 2,
    taskData: {},
    statusArr: [
      {
        type: 1,
        name: '待完成'
      },
      {
        type: 2,
        name: '进行中'
      },
      {
        type: 3,
        name: '已完成'
      },
    ]
  },
  addTask: function () {
    wx.navigateTo({
      url: '/pages/todo/add/add?action=add'
    })
  },
  selectStatus: function (e) {
    this.setData({
      curStatus: e.currentTarget.dataset.statusId
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        var windowHeight = res.windowHeight;
        var windowWidth = res.windowWidth;
        that.setData({
          scrollviewHeight: windowHeight - 84 * windowWidth / 750.0
        })
      },
    })
    var taskData = wx.getStorageSync('taskData');
    if (taskData) {
      if (taskData.finishingList && taskData.finishingList.length > 0) {
        this.setData({
          curStatus: 2
        })
      } else {
        this.setData({
          curStatus: 1
        })
      }
    } else {
      this.setData({
        curStatus: 1
      })
    }
    this.setData({
      taskData: taskData
    });
  },
  onShow: function (options) {
    if (app.globalData.todoNeedRefreshData) {
      var taskData = wx.getStorageSync('taskData');
      this.setData({
        taskData: taskData
      });
      app.globalData.todoNeedRefreshData = false;
    }
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

  },
  startTask: function (e) {
    var taskId = e.currentTarget.dataset.taskId;
    var taskData = this.data.taskData;
    var todoList = taskData.todoList;
    var task;
    for (var i = 0; i < todoList.length; i++) {
      if (taskId == todoList[i].id) {
        task = todoList[i];
        todoList.splice(i, 1);
      }
    }
    taskData['todoList'] = todoList;
    task['status'] = 2;
    task['startDate'] = util.getDateStr();
    task['startTime'] = util.getTimeStr();
    var finishingList = this.data.taskData.finishingList;
    if (!finishingList) {
      finishingList = [];
    }
    var index = 0;
    for (var i = 0; i < finishingList.length; i++) {
      if (task.gender <= finishingList[i].gender) {
        index = i;
        break;
      }
    }
    if (i == finishingList.length) {
      index = i;
    }
    finishingList.splice(index, 0, task);
    taskData['finishingList'] = finishingList;
    wx.setStorageSync("taskData", taskData)
    this.setData({
      taskData: taskData
    })
    console.log(taskData);
  },

  finishedTask: function (e) {
    var taskId = e.currentTarget.dataset.taskId;
    var taskData = this.data.taskData;
    var finishingList = taskData.finishingList;
    var task;
    for (var i = 0; i < finishingList.length; i++) {
      if (taskId == finishingList[i].id) {
        task = finishingList[i];
        finishingList.splice(i, 1);
      }
    }
    taskData['finishingList'] = finishingList;
    task['status'] = 3;
    task['finishedDate'] = util.getDateStr();
    task['finishedTime'] = util.getTimeStr();
    task['finished'] = 100;
    task['cosumeTime'] = util.getDistanceStr(task.startDate + " " + task.startTime + ":00");
    var finishedList = this.data.taskData.finishedList;
    if (!finishedList) {
      finishedList = [];
    }
    finishedList.unshift(task);
    taskData['finishedList'] = finishedList;
    wx.setStorageSync("taskData", taskData)
    this.setData({
      taskData: taskData
    })
  },
  swiperStatus: function (event) {
    var current = event.detail.current;
    var source = event.detail.source;
    if (source == 'touch') {
      this.setData({
        curStatus: current + 1
      });
    }
  },
  goDetail: function (event) {
    var taskId = event.currentTarget.dataset.taskId;
    var taskStatus = event.currentTarget.dataset.taskStatus;
    wx.navigateTo({
      url: '/pages/todo/add/add?action=update&taskid=' + taskId + '&taskstatus=' + taskStatus,
    })
    console.log('taskId:' + taskId + ',taskStatus:' + taskStatus);
  }
})