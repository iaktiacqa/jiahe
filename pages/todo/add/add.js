// pages/todo/add/add.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    canUpdate: true,
    action: 1, /** 操作类型 1-增加；2-修改 */
    id: 0,
    name: '',
    desc: '',
    gender: "2", /** 任务等级 1-紧急；2-优先；3-普通*/
    taskType: "1", /**任务类型，1-定时任务；2-每天任务 */
    stopdDate: '',
    stopTime: '23:59',
    finished: 0,
    status: 0, /** 状态，1-待完成；2-进行中；3-已完成；*/
    score: 0,
    genderArr: [
      { gender: 1, value: '紧急' },
      { gender: 2, value: '优先', checked: 'true' },
      { gender: 3, value: '普通' },
    ],
    typeArr: [
      { type: 1, value: '定时任务', checked: 'true' },
      { type: 2, value: '每天任务' },
    ],
    scoreArr:[]

  },
  bindName: function (e) {
    this.setData({
      name: e.detail.value
    })
  },
  bindDesc: function (e) {
    this.setData({
      desc: e.detail.value
    });
  },
  selectGender: function (e) {
    this.setData({
      gender: e.detail.value
    })
  },
  selectTaskType: function (e) {
    this.setData({
      taskType: e.detail.value
    })
    console.log(this.data.taskType)
  },
  bindDateChange: function (e) {
    this.setData({
      stopDate: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      stopTime: e.detail.value
    })
  },
  bindScoreChange: function(e) {
    this.setData({
      score: 100 - e.detail.value
    })
  },
  selectedFinished: function (e) {
    this.setData({
      finished: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var scoreArr = [];
    for (var i = 100; i >= 0; i --) {
      scoreArr.push(i);
    }
    this.setData({
      scoreArr: scoreArr
    })
    var action = options.action;
    if (action == 'add') {
      var date = new Date();
      var mon = date.getMonth() + 1;
      var day = date.getDate();
      var nowDay = date.getFullYear() + "-" + (mon < 10 ? "0" + mon : mon) + "-" + (day < 10 ? "0" + day : day);
      this.setData({
        action: 1,
        stopDate: nowDay
      })
    } else {
      var taskId = options.taskid;
      var taskStatus = options.taskstatus;
      console.log(taskId +  "-"+taskStatus)
      this.setData({
        status: taskStatus
      });
      var task;
      var taskData = wx.getStorageSync("taskData");
      if (taskData) {
        var finishingList = taskData.finishingList;
        var todoList = taskData.todoList;
        var finishedList = taskData.finishedList;
        if (taskStatus == 1) {
          for (var i = 0; i < todoList.length; i++) {
            if (taskId == todoList[i].id) {
              task = todoList[i];
              break;
            }
          }
        }
        if (taskStatus == 2) {
          for (var i = 0; i < finishingList.length; i++) {
            if (taskId == finishingList[i].id) {
              task = finishingList[i];
              break;
            }
          }
        }

        if (taskStatus == 3) {
          for (var i = 0; i < finishedList.length; i++) {
            if (taskId == finishedList[i].id) {
              task = finishedList[i];
              break;
            }
          }
        }
      }
      if (taskStatus == 3) {
        this.setData({
          canUpdate: false
        })
      }
      this.setData({
        action: 2,
        id: task.id,
        name: task.name,
        desc: task.desc,
        gender: task.gender,
        taskType: task.taskType,
        stopDate: task.stopDate,
        stopTime: task.stopTime,
        finished: task.finished,
        status: task.status,
        score: task.score
      })
    }

  },
  submitTask: function (e) {
    if (!this.data.name || this.data.name == '') {
      wx.showToast({
        title: '名称不能为空！',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    var data = wx.getStorageSync('taskData');
    var task;
    if (!data) {
      data = {
        finishingList: [],
        finishedList: []
      };
    }
    var todoList = data.todoList;
    var finishingList = data.finishingList;
    var finishedList = data.finishedList;
    // 新增任务
    if (this.data.status == 0) {
      if (!todoList) {
        todoList = [];
      }
      var id = todoList.length + finishingList.length + finishedList.length + 1;
      task = {
        id: id,
        name: this.data.name,
        desc: this.data.desc,
        gender: this.data.gender,
        taskType: this.data.taskType,
        stopDate: this.data.stopDate,
        stopTime: this.data.stopTime,
        finished: this.data.finished,
        status: 1
      };
      var index = 0;
      for (var i = 0; i < todoList.length; i++) {
        if (task.gender <= todoList[i].gender) {
          index = i;
          break;
        }
      }
      if (i == todoList.length) {
        index = i;
      }
      todoList.splice(index, 0, task);
      data['todoList'] = todoList;
    } else {
      var taskId = this.data.id;
      if (this.data.status == 1) {
        for (var i = 0; i < todoList.length; i++) {
          if (taskId == todoList[i].id) {
            task = todoList[i];
            todoList.splice(i, 1);
            break;
          }
        }
      } else if (this.data.status == 2) {
        for (var i = 0; i < finishingList.length; i++) {
          if (taskId == finishingList[i].id) {
            task = finishingList[i];
            finishingList.splice(i, 1);
            break;
          }
        }
      } else if (this.data.status == 3) {
        for (var i = 0; i < finishedList.length; i++) {
          if (taskId == finishedList[i].id) {
            task = finishedList[i];
            finishedList.splice(i, 1);
            break;
          }
        }
      }
      task['name'] = this.data.name;
      task['desc'] = this.data.desc;
      task['gender'] = this.data.gender;
      task['taskType'] = this.data.taskType;
      task['stopDate'] = this.data.stopDate;
      task['stopTime'] = this.data.stopTime;
      task['finished'] = this.data.finished;
      task['status'] = this.data.status;
      task['score'] = this.data.score;
      if (this.data.status == 1) {
        var index = 0;
        for (var i = 0; i < todoList.length; i++) {
          if (task.gender <= todoList[i].gender) {
            index = i;
            break;
          }
        }
        if (i == todoList.length) {
          index = i;
        }
        todoList.splice(index, 0, task);
        data['todoList'] = todoList;
      } else if (this.data.status == 2) {
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
        data['finishingList'] = finishingList;
      } else if (this.data.status == 3) {
        finishedList.unshift(task);
        data['finishedList'] = finishedList;
      }
    }
    // 保存到本地
    wx.setStorageSync('taskData', data);
    app.globalData.todoNeedRefreshData = true;
    console.log(wx.getStorageSync("taskData"));
    wx.navigateBack({
      delta: 1,
    })
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})