// pages/order/order.js
const app=getApp()
Page({
  /**
  * 页面的初始数据
  */
  data: {
    currentTab: 0,//当前页签
    nopayPage:0,//未付款页码
    haspayPage: 0,//已付款页码
    haspayData:false,//已付款还有数据
    nopayData: false,//未付款还有数据
    nopayList: [],//未付款列表
    haspayList: [],//已付款列表
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // this.getPayList(0,this.data.nopayPage);
    // this.getPayList(1,this.data.haspayPage);
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
    this.data.nopayPage = 0,//未付款页码
    this.data.haspayPage = 0,//已付款页码
    this.data.nopayList = [],//未付款列表
    this.data.haspayList = [],//已付款列表
    this.getPayList(0, this.data.nopayPage);
    this.getPayList(1, this.data.haspayPage);
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
  noDo(){},
  /**
  * 滑动切换tab
  */
  bindChange: function (e) {
    var that = this;
    that.setData({ currentTab: e.detail.current });
  },
  /**
   * 点击tab切换
   */
  swichNav: function (e) {
    var that = this;
    if (this.data.currentTab === e.target.dataset.current) {
      return false;
    } else {
      that.setData({
        currentTab: e.target.dataset.current
      })
    }
  },
  // 触底加载
  notPayToBottom () {
    this.data.nopayPage++
    this.getPayList(0, this.data.nopayPage)
  },
  // 触底加载
  hasPayToBottom () {
    this.data.haspayPage++
    this.getPayList(1, this.data.haspayPage)
  },
  //获取订单
  getPayList(status, page){
    let that = this
    let url = '/order/customer/food/getOrders'
    let data = {
      status: status,
      page: page,
      count:20
    }
    function success(res) {
      // console.log(res)
      if (status == 0){
        if (!res.message.length){
          that.setData({
            nopayData: true,
            nopayList: that.data.nopayList
          })
          return
        }else{
          that.setData({
            nopayData: false
          })
        }
        if (that.data.nopayList.length){
          that.setData({
            nopayList: that.data.nopayList.concat(res.message),//未付款列表
          })
        }else{
          that.setData({
            nopayList: res.message,//未付款列表
          })
        }
      }
      if (status == 1){
        if (!res.message.length) {
          that.setData({
            haspayData : true,
            haspayList: that.data.haspayList
          })
          return
        } else {
          that.setData({
            haspayData: false
          })
        }
        if (that.data.haspayList.length) {
          that.setData({
            haspayList: that.data.haspayList.concat(res.message),//未付款列表
          })
        } else {
          that.setData({
            haspayList: res.message,//未付款列表
          })
        }
      }
    }
    app._post(url, data, success)
  },
  //跳转订单详情
  goToDetail(e){
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/orderDetail/orderDetail?order='+id
    })
  },
  // 取消 订单  food/cancelOrder
  cancelOrder(e){
    let that = this
    let id = e.currentTarget.dataset.id
    let itemList=['点错了','有急事','不想要了','上菜太慢了']
    wx.showActionSheet({
      itemList: itemList,
      success(res) {
        console.log(res.tapIndex)
        let url = '/order/customer/food/cancelOrder'
        let data = {
          id: id,
          reason: itemList[res.tapIndex],
        }
        function success(res) {
          // console.log(res)
          app.showSuccess('取消成功')
          that.data.nopayPage = 0,//未付款页码
          that.data.nopayList = [],//未付款列表
          that.getPayList(0, this.data.nopayPage);
        }
        app._post(url, data, success)
      },
      fail(res) {
        console.log(res.errMsg)
      }
    })
  },
  // evaluate
  evaluate (e) {
    let id = e.currentTarget.dataset.id
    wx.navigateTo({
      url: '/pages/evaluate/evaluate?order=' + id,
    })
  },
  // 付款（假得）
  goPay(e) {
    let that = this
    let id = e.currentTarget.dataset.id
    let url = '/order/customer/food/orderPay'
    let data = {
     id:id
    }
    function success(res) {
      wx.navigateTo({
        url: '/pages/orderDetail/orderDetail?order=' + id
      })
    }
    app._post(url, data, success)
  },
})