// pages/order/balance/balance.js

const utils = require('../../../utils/util.js')

Page({

  /**
   * 页面的初始数据
   */
  data: {
    cartList: [],
    sumMonney: 0,
    cutMonney: 0,
    cupNumber: 0,
    orderParams: {}, // 支付发起参数
    orderResults: {}, // 支付结果
    preparePay: false, // 控制 payjs 组件的创建与销毁
    paying: false, // 可选：如需知晓用户是否「已经跳转到了 PAYJS 小程序还未返回」的状态则可通过事件处理函数监听事件内的 paying 数据
  
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.setNavigationBarTitle({
      title: '订单详情'
    })
    this.setData({
      cartList: wx.getStorageSync('cartList'),
      sumMonney: wx.getStorageSync('sumMonney'),
      cutMonney: wx.getStorageSync('sumMonney') > 19 ? 3 : 0,
      cupNumber: wx.getStorageSync('cupNumber'),
    })

  },
  gopay: function () {
    // 事件处理函数 - 点击支付按钮
    this.setData({ preparePay: true })
   // this.setData({
     // preparePay: true,
     // orderParams: {
        // 这里传入【后端返回并签名完毕】的支付发起参数
      //}
   // })
  },

  /**
  * 支付成功的事件处理函数
  * 
  * res.detail 为 PAYJS 小程序返回的订单信息
  * 
  * 可通过 res.detail.payjsOrderId 拿到 PAYJS 订单号
  * 可通过 res.detail.responseData 拿到详细支付信息
  */
  bindPaySuccess(res) {
    console.log('success', res)
    console.log('[支付成功] PAYJS 订单号：', res.detail.payjsOrderId)
    this.setData({
      orderResults: res.detail,
      needRefreshOrderParams: true
    })
    wx.showModal({
      title: '支付成功',
      content: 'PAYJS 订单号：' + res.detail.payjsOrderId,
      showCancel: false
    })
  },
  /**
    * 支付失败的事件处理函数
    * 
    * res.detail.error 为 true 代表传入小组件的参数存在问题
    * res.detail.navigateSuccess 代表了是否成功跳转到 PAYJS 小程序
    * res.detail.info 可能存有失败的原因
    * 
    * 如果下单成功但是用户取消支付则可在 res.detail.info.payjsOrderId 拿到 payjs 订单号
    */
  bindPayFail(res) {
    console.log('fail', res)
    if (res.detail.error) {
      console.error('发起支付失败', res.detail.info)
    } else if (res.detail.navigateSuccess) {
      console.log('[取消支付] PAYJS 订单号：', res.detail.info.payjsOrderId)
    }
  },
  /**
    * 支付完毕的事件处理函数
    * 
    * 无论支付成功或失败均会执行
    * 应当在此销毁 payjs 组件
    */
  bindPayComplete() {
    console.log('complete')
    this.setData({
      preparePay: false, // 销毁 payjs 组件
    })
  },
  /**
    * 【可选】组件内部数据被修改时的事件
    * 
    * 当前仅用于监听 paying 数据
    * 当用户跳转到 PAYJS 小程序并等待返回的过程中 paying 值为 true
    */
  bindDataChange(res) {
    if (res.detail.paying) {
      this.setData({
        paying: res.detail.paying
      })
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
    // 若处于支付中状态则交由 payjs 支付组件处理
    if (this.data.paying) return;

    // 尚未支付
    // 获取、设置支付参数
    let orderParams = utils.getOrderParams()
    this.setData({ orderParams })
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