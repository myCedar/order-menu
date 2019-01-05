// pages/evaluate/evaluate.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getList(options.order)
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
  //获取列表
  getList(id){
    let that = this
    let url = '/order/customer/food/getOrderEvaluate'
    let data = {
      id: id
    }
    function success(res) {
      if (res.message.pictures){
        for (var i = 0; i < res.message.pictures.length;i++){
          res.message.pictures[i] = app.appConfig.apiroot + '/' + res.message.pictures[i]
        }
      }
      //console.log(res)
      that.setData(res.message)
    }
    app._post(url, data, success)
  },
  //选择图片
  choosePic(){
    let that = this
    wx.chooseImage({
      count: 3,
      sizeType: ['compressed'],
      sourceType: ['album', 'camera'],
      success(res) {
        // tempFilePath可以作为img标签的src属性显示图片
        const tempFilePaths = res.tempFilePaths
        let imglist = []
        // filePathList.forEach(function(item){
        //   imglist.push(item)
        // })
        imglist = tempFilePaths.concat(that.data.pictures)

        if (imglist.length > 3){
          imglist.length = 3
        }
        that.setData({
          pictures: imglist
        })
      }
    })
  },
  //输入变化
  textareaInput(e){
    this.setData({
      message: e.detail.value
    })
  },
  // 提交评价
  comitEvaluate(){
    let that = this
    let url = '/order/customer/food/orderEvaluate'
    let sendFoods = []
    this.data.foodSales.forEach((item)=>{
      sendFoods.push({
        food_id: item.food_id,
        praise: item.praise || "2",
      })
    })
    let data = { 
      id: that.data.order_id,
      type: that.data.praise || 2,
      message:that.data.message || "",
      foods:JSON.stringify(sendFoods)
      }
    function success(res) {
      that.getList(that.data.order_id)
    }
    app._post(url, data, success)
  },
  //  提交图片
  submitPic(){
    let that = this
    let url = '/order/customer/food/uploadEvaluatePicture'
    let name = 'picture'
    let formData = { id: that.data.order_id }
    let filePathList = this.data.pictures
    function success(res) {
      that.comitEvaluate()
    }
    function fail() {
      
    }
    if (filePathList.length){
      app.uploadPic(url, filePathList, name, success, fail, formData)
    }else{
      that.comitEvaluate()
    }
  },
  switchChange(e){
    let id = e.currentTarget.dataset.id
    let ischeck = e.detail.value
    // console.log(ischeck, id)
    if (id == 'order_id'){
      if (ischeck){
        this.data.praise = 1
      }else{
        this.data.praise = 2
      }
    }else{
      this.data.foodSales.forEach(function(item){
        if (item.food_id == id){
          if (ischeck) {
            item.praise = 1
          } else {
            item.praise = 2
          }
        }
      })
    }
  }
})