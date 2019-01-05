//index.js
//获取应用实例
const app = getApp()

Page({
  data: {
    motto: '欢迎来到点不点小程序',
    userInfo: {},
    hasUserInfo: false,
    inputValue:'',
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  //事件处理函数
  onLoad: function () {
    this.setData({
      inputValue:app.globalData.username || '',
      store_id: app.globalData.store_id
    })
    if (!this.data.canIUse){
      app.showError('微信版本太低啦，请先升级微信！')
    }
    this.data.tableId = app.globalData.table_id
  },
  getUserInfo: function(e) {
    app.globalData.userInfo = e.detail.userInfo
    this.setData({
      userInfo: e.detail.userInfo,
      hasUserInfo: true,
      inputValue: e.detail.userInfo.nickName
    })
    app.globalData.username = e.detail.userInfo.nickName
  },
  changeModal() {
    this.data.modal = !this.data.modal
    if (this.data.modal) {
      app.globalData.store_id = null
      app.globalData.table_id = '1065438863889010688'
    } else {
      app.globalData.store_id = 'oU__W5WMiaSVIhreaIyLEHPI3apY'
      app.globalData.table_id = null
    }
    this.setData({
      table_id: app.globalData.table_id,
      store_id: app.globalData.store_id
    })
  },
  beginOrder(){
    wx.switchTab({
      url: '/pages/menu/menu',
    })
  },
  changeInput(e){
    this.setData({
      inputValue: e.detail.value
    })
    app.globalData.username = e.detail.value
  }
})
