// pages/setting/setting.js
//获取应用实例
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    phone: '',
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

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
    this.getPhone()
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

  },
  goTo: function (e) {
    //console.log(e);
    let url = e.currentTarget.dataset.gturl
    wx.navigateTo({
      url: url
    })
  },
  getPhone: function () {
    var that = this
    let url = '/order/customer/main/getBindPhone'
    let data = {}
    function success(res) {
      // console.log(res)
      that.setData({
        phone:res.message
      })
    }
    app._get(url, data, success)
  },
})