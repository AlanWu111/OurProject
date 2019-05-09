// pages/index/index.js
//获取用户实例
var app = getApp()

Page({

  goToNoonPage: function (param) {
    wx.navigateTo({
      url: '/pages/index/noon',
    })
  },
  goToNightPage: function (param) {
    wx.navigateTo({
      url: '/pages/index/night',
    })
  },
  goToMidNightPage: function (param) {
    wx.navigateTo({
      url: '/pages/index/midnight',
    })
  },
   
  /**
   * 页面的初始数据
   */
  data: {


      noonsrc1: '../images/zuixin.png',
      noonsrc2: '../images/zuixin.png',
      noonsrc3: '../images/zuire.png',
 
      nightsrc1: '../images/zuixin.png',
      nightsrc2: '../images/zuixin.png',
      nightsrc3: '../images/zuire.png',
 
      midnightsrc1: '../images/zuixin.png',
      midnightsrc2: '../images/zuixin.png',
      midnightsrc3: '../images/zuire.png',

      movies:[
        { url:'cloud://test-project1-271a69.7465-test-project1-271a69/file_5b87bcf657acc.png'},
        { url:'cloud://test-project1-271a69.7465-test-project1-271a69/file_5b87bcf657acc.png'},
        { url:'cloud://test-project1-271a69.7465-test-project1-271a69/摄图网_500201108.jpg'},
      ],
 

      // tab切换
     currentTab: 0
  },

  swichNav: function (e) {

    console.log(e);

    var that = this;

    if (this.data.currentTab === e.target.dataset.current) {

      return false;

    } else {

      that.setData({

        currentTab: e.target.dataset.current,

      })

    }

  },

  swiperChange: function (e) {

    console.log(e);

    this.setData({

      currentTab: e.detail.current,

    })


  },

   
 
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    wx.request({
      url: 'https://www.jiashisudi.cn/test.php',//此处填写你后台请求地址
      method: 'GET',
      header: { 'Content-Type': 'application/json' },
      data: {},
      success: function (res) {
        // success
        console.log(res.data);//打印请求返回的结果
        that.setData({ item_list: res.data })

      },
      fail: function (res) {
        // fail
      },
      complete: function (res) {
        // complete
      }
    })
 
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