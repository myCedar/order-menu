// pages/previewOrder/previewOrder.js
const app = getApp()
Page({
  /**
   * 页面的初始数据
   */
  data: {
    cartList:{},
    phone:'',
    remarke:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let agrs = JSON.parse(options.agrs)
    // console.log(options)
    this.data.order = options.order || ""
    // this.data.cartList = agrs
    this.setData({
      cartList: agrs
    })
    this.getPhone()
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

  },
  changePhone(e){
    this.setData({
      phone: e.detail.value
    })
  },
  changeRemark(e) {
    this.setData({
      remarke: e.detail.value
    })
  },
  goback(){
    wx.navigateBack({
      delta: 1
    })
  },
  goorder(){
    //  /food/order
    let that = this
    let url = '/order/customer/food/order'
    let data = {  }
    if (app.globalData.table_id){
      data = {
        table_id: app.globalData.table_id,
        order:that.data.order,
        phone:that.data.phone,
        message: that.data.remarke,
        foods: JSON.stringify(that.data.cartList.list) 
      }
    }else{
      data={
        store_id: app.globalData.store_id,
        phone: that.data.phone,
        message: that.data.remarke,
        foods: JSON.stringify(that.data.cartList.list)
      }
    }
    function success(res) {
      console.log(res)
      if(res.status == 0){
        wx.switchTab({
          url: '/pages/order/order'
        }) 
      }
    }
    app._post(url, data, success)
  },
  getPhone: function () {
    var that = this
    let url = '/order/customer/main/getBindPhone'
    let data = {}
    function success(res) {
      // console.log(res)
      that.setData({
        phone: res.message
      })
    }
    app._get(url, data, success)
  }
})