// pages/todo/add/add.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: 1,
    name: '',
    desc: '',
    gender: "2", /** 任务等级 1-紧急；2-优先；3-普通*/
    taskType: "1", /**任务类型，1-定时任务；2-每天任务 */
    finishedDate: '',
    finishedTime: '23:59',
    finshed: 0,
    status: 0, /** 状态，1-待完成；2-进行中；3-已完成；*/
    genderArr: [
      { gender: 1, value: '紧急' },
      { gender: 2, value: '优先', checked: 'true' },
      { gender: 3, value: '普通' },
    ],
    typeArr: [
      { type: 1, value: '定时任务', checked: 'true' },
      { type: 2, value: '每天任务' },
    ],

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
      finishedDate: e.detail.value
    })
  },
  bindTimeChange: function (e) {
    this.setData({
      finishedTime: e.detail.value
    })
  },
  selectedFinished: function (e) {
    this.setData({
      finshed: e.detail.value
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log(options.taskid)

    var date = new Date();
    var mon = date.getMonth() + 1;
    var day = date.getDate();
    var nowDay = date.getFullYear() + "-" + (mon < 10 ? "0" + mon : mon) + "-" + (day < 10 ? "0" + day : day);
    this.setData({
      finishedDate: nowDay
    })
  },
  submitTask: function (e) {
    console.log('提交任务')
    if (!this.data.name || this.data.name == '') {
      wx.showToast({
        title: '名称不能为空！',
        icon: 'none',
        duration: 2000,
      })
      return;
    }
    var data = wx.getStorageSync('taskData');
    if (!data) {
      data = {
        finishingList: [],
        finishedList: []
      };
    }
    var todoList = data.todoList;
    var finishingList = data.finishingList;
    var finishedList = data.finishedList;
    if (!todoList) {
      todoList=[];
    }
    var id = todoList.length + finishingList.length +  finishedList.length + 1;
    var task = {
      id: id,
      name: this.data.name,
      desc: this.data.desc,
      gender: this.data.gender,
      taskType: this.data.taskType,
      finishedDate: this.data.finishedDate,
      finishedTime: this.data.finishedTime,
      finshed: this.data.finshed,
      status: 1
    };
    
    todoList.push(task);
    data['todoList'] = todoList;
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