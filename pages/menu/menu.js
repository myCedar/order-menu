const app = getApp()
Page({
  data: {
    socketTask:null,// 互动
    animation1:'',//动画
    rects:null,//食物列表位置属性
    heaerderHeight:0,//店铺头部的高度
    classifyViewed:'f0',//选择的类目
    classifySeleted:'f0',//滑动的类目
    alertinfo:'',//提示信息
    order:'',//下单凭证
    store: {
      store_name: '店面名称',
      headPictureUrl: '',
      description:''
    },
    tableName:'',//餐桌名称
    hasOrder:'',//排队序号
    foodList:[],
    cartList: {
      count: 0,
      total: 0,
      list: []
    },
    showCartDetail: false,
    conetNum:0
  },
  // 生命周期函数--监听页面加载
  // 一个页面只会调用一次。
  onLoad: function (options) {
    this.getFoodList()
  },
  // 生命周期函数--监听页面初次渲染完成
  onReady: function () { 
   
  },
  // 生命周期函数--监听页面显示
  // 每次打开页面都会调用一次
  onShow: function () {
    // this.setData({
    //   classifySeleted: this.data.goodsList[0].id
    // });
  },
  // 生命周期函数--监听页面隐藏
  // 当navigateTo或底部tab切换时调用
  onHide: function () { },
  // 生命周期函数--监听页面卸载
  /**
   * 关闭soket
   */
  onUnload: function () { 
    let socketTask = this.data.socketTask
    if (socketTask){
      socketTask.close()
    }
  },
  // 页面下拉刷新事件的处理函数
  onPullDownRefresh: function () {
    let socketTask = this.data.socketTask
    if (socketTask) {
      socketTask.close()
    }
    this.getFoodList(true)
  },
  // 开发者可以添加任意的函数或数据到
  tapAddCart: function (e) {
    let that = this
    let id = e.target.dataset.id
    if (app.globalData.store_id){
      that.addCart(id)
    }else{
      let socketTask = this.data.socketTask
      let sendItem = { id: id, type: 1, change: 1 }
      if (socketTask) {
        socketTask.send({
          data: JSON.stringify(sendItem),
          success(res) {
            // console.log(res)
            // that.addCart(id);
          }
        })
      } 
    }  
  },
  tapReduceCart: function (e) {
    let that = this
    let id = e.target.dataset.id
    if (app.globalData.store_id){
      that.reduceCart(id)
    }else{
      let socketTask = this.data.socketTask
      let sendItem = { id: id, type: 1, change: -1 }
      if (socketTask) {
        socketTask.send({
          data: JSON.stringify(sendItem),
          success(res) {
            // console.log(res)
            // that.reduceCart(id);
          }
        })
      } 
    }  
  },
  addCart: function (id) {
    let item = {}
    for (var i = 0; i < this.data.foodList.length; i++) {
      let food = this.data.foodList[i].food
      for (var j = 0; j < food.length; j++) {
        if (food[j].id == id) {
          item = {
            id: food[j].id,
            name: food[j].f_name,
            price: food[j].price,
            count: 1
          }
        }
      }
    }
    this.data.cartList.count++
    let lists = this.data.cartList
    let canPUsh = true
    let total= 0
    for (var i = 0; i < lists.list.length; i++) {
      if (lists.list[i].id == id) {
        lists.list[i].count++
        canPUsh= false
      }
      total += lists.list[i].count * lists.list[i].price
    }
    if (canPUsh){
      lists.list.push(item)
      total += item.count * item.price
    }
    lists.total = Math.round(total * 100) / 100
    this.setData({
      cartList: lists,
    });
  },
  reduceCart: function (id) {
    this.data.cartList.count--
    let lists = this.data.cartList
    let total = this.data.cartList.total
    lists.list.forEach((item, index) => {
      if (item.id == id && item.count>1){
        item.count--
        total -= item.price
      } else if (item.id == id && item.count == 1){
        lists.list.splice(index,1)
        total -= item.price
      }
    })
    this.data.cartList.total = Math.round(total * 100) / 100
    this.setData({
        cartList: lists,
    });
  },
  // 滚动部分
  onGoodsScroll: function (e) {
    let heaerderHeight = 0
    let that = this
    //收缩上方
    if (e.detail.scrollTop > 10 && !this.data.scrollDown) {
      var query = wx.createSelectorQuery();
      query.select('.header').boundingClientRect()
      query.exec(function (res) {
        // console.log(res);
        // console.log(res[0].height);
        that.setData({
          scrollDown: true,
          heaerderHeight: -res[0].height
        });
      })
    } else if (e.detail.scrollTop < 10 && this.data.scrollDown) {
      this.setData({
        scrollDown: false,
        heaerderHeight:0
      });
    }
    //设置当前active
    var scrollTop = e.detail.scrollTop,
      h = 0,
      classifyViewed = '';
    for (let i = 0; i<this.data.rects.length;i++){
      // console.log(e.detail.scrollTop)
      if (h + this.data.rects[i].height > e.detail.scrollTop+100) {
        classifyViewed = this.data.rects[i].id;
        break;
      }
      h += this.data.rects[i].height
    }
    // console.log(classifyViewed)
    this.setData({
      classifyViewed: classifyViewed
    });
  },
  //点击分类
  tapClassify: function (e) {
    var id = e.target.dataset.id;
    console.log(id)
    this.setData({
      classifyViewed: id,
    });
    var self = this;
    setTimeout(function () {
      self.setData({
        classifySeleted: id
      });
    }, 100);
  },
  // 显示 购物车
  showCartDetail: function () {
    this.setData({
      showCartDetail: !this.data.showCartDetail
    });
  },
  // 隐藏 购物车
  hideCartDetail: function () {
    this.setData({
      showCartDetail: false
    });
  },
  // 提交 订单
  submit: function (e) {
    var agrs = JSON.stringify(this.data.cartList);
    let str = '/pages/previewOrder/previewOrder?agrs=' + agrs
    if(this.data.order){
      str +='&order='+this.data.order
    }
    wx.navigateTo({
      url: str
    })
  },
  // 获取食物列表
  getFoodList(refresh = false){
    let  that = this
    let url = '/order/customer/food/getFoods'
    let data = {}
    if (app.globalData.table_id){
      data = {
        table_id: app.globalData.table_id
      }
    }else{
      data = {
        store_id: app.globalData.store_id
      }
    }
    function success(res) {
      if (refresh){
        wx.stopPullDownRefresh();
      }
      // console.log(res)
      let foodlist=[]
      let top10 = []
      res.message.foods.forEach((item)=>{
        item.picture_url = app.appConfig.apiroot +'/'+ item.picture_url
        if (top10.length<10){
          top10.push(item)
        }
        let canPush = true
        for (var i = 0; i < foodlist.length;i++){
          if (foodlist[i].id == item.classify_id){
            foodlist[i].food.push(item)
            canPush = false
          }
        }
        if (canPush){
          foodlist.push({ id: item.classify_id, name: item.classify_name, food: [item] })
        }
      })
      that.setData({
        foodList:foodlist,
        top10: top10,
        count:res.message.count,
        store: res.message.store||'',
        tableName:res.message.tableName||"",
        hasOrder: res.message.hasOrder || "0"
      })
      setTimeout(function(){
        that.getAllRects()
        if (app.globalData.table_id) {
          that.creatSoket()
        }
      }, 100)
    }
    app._post(url, data, success)
  },
  /**
  * 创建soket
  */
  creatSoket() {
    let that = this
    let nikename = app.globalData.username || app.globalData.userInfo.nickName
    this.data.socketTask = wx.connectSocket({
      url: 'wss://www.cwscwh.xyz/order/customer/ws?nickname=' + nikename + '&tableid=' + app.globalData.table_id,//?nickName=aa&table_id=0
      header: {
        'content-type': 'application/json',
        'token': wx.getStorageSync('token') || '',
        // "nickname": app.globalData.userInfo.nickName,
        // "tableid": app.globalData.table_id
      },
      // protocols: ['protocol1'],
      method: "GET"
    })
    let socketTask = this.data.socketTask
    if (!socketTask){
      return
    }
    socketTask.onOpen((res)=>{
      // console.log(res)
      // wx.setStorage({
      //   key: "ordertime",
      //   data: new Date()
      // })
    })
    socketTask.onMessage((res) => {
      // console.log(JSON.parse(res.data))
      let data = JSON.parse(res.data)
      if (data.type == 2){
        if (data.foods != 0){
          let foodItem=[],count=0,total=0
          for (var i = 0; i < data.foods.length;i++){
            foodItem.push(that.carListItem(data.foods[i].id, data.foods[i].change))
          }
          foodItem.forEach((item)=>{
            count += item.count;
            total += item.count * item.price
          })
          that.setData({
            cartList: {
              count: count,
              total: Math.round(total * 100) / 100,
              list: foodItem
            }
          })
        }else if (data.foods == 0){
          that.setData({
            cartList: {
              count: 0,
              total: 0,
              list: []
            }
          })
        }
      } else if (data.type == 5) {
        that.data.order = data.order
        that.setData({
          cartList: {
            count: 0,
            total: 0,
            list: []
          }
        })
      } else if (data.type == 4){
        that.data.order = data.order
        if (data.foods != 0){
          let time = wx.getStorageSync('ordertime')
          let myTime = new Date()
          if (myTime - time > 1000 * 60 * 60){
            wx.showModal({
              title: '您好',
              content: '购物车中已包含商品，是否清空，重新点单？',
              success(res) {
                if (res.confirm) {
                  socketTask.send({ data: JSON.stringify({ type: 3 }) })
                } else if (res.cancel) {
                  let foodItem = [], count = 0, total = 0
                  for (var i = 0; i < data.foods.length; i++) {
                    foodItem.push(that.carListItem(data.foods[i].id, data.foods[i].change))
                  }
                  foodItem.forEach((item) => {
                    count += item.count;
                    total += item.count * item.price
                  })
                  that.setData({
                    cartList: {
                      count: count,
                      total: Math.round(total * 100) / 100,
                      list: foodItem
                    }
                  })
                }
              }
            })
          }else{
            let foodItem = [], count = 0, total = 0
            for (var i = 0; i < data.foods.length; i++) {
              foodItem.push(that.carListItem(data.foods[i].id, data.foods[i].change))
              // console.log(data.foods[i].id, data.foods[i].change)
              // console.log(that.carListItem(data.foods[i].id, data.foods[i].change))
            }
            foodItem.forEach((item) => {
              count += item.count;
              total += item.count * item.price
            })
            that.setData({
              cartList: {
                count: count,
                total: Math.round(total * 100) / 100,
                list: foodItem
              }
            })
          }
        }
      }else{
        let str = ''
        if (data.type == 0){
          str = data.name +'加入了点餐'
        } else if (data.type == 3){
          str = data.name + '清空了购物车'
          that.setData({
            cartList:{
              count:0,
              total:0,
              list:[]
            }
          })
        } else {
          if (data.change == 1){
            str = that.carListItem(data.id).name + '+1(' + data.nickname + ")"
          }else{
            str = that.carListItem(data.id).name + '-1(' + data.nickname + ")"
          }
        }
        //创建动画
        let animation1 = wx.createAnimation({
          duration: 5000,
          timingFunction: "linear",
          delay: 0,
          transformOrigin: "50% 50%",
        })
        animation1.opacity(1).translateX(0).step({ duration: 100 }).translateX(-800).step()
        that.setData({
          animation1: animation1,
          alertinfo: str
        })
      }
      wx.setStorage({
        key: "ordertime",
        data: new Date()
      })
    })
    socketTask.onClose(function(res){
      // console.log(res)
      // that.data.conetNum++
      // if (that.data.conetNum <= 3){
      //   setTimeout(that.creatSoket, 30000)
      // }
    })
  },
  carListItem (id,count){
    let item = {}
    for (var i = 0; i < this.data.foodList.length; i++) {
      let food = this.data.foodList[i].food
      for (var j = 0; j < food.length; j++) {
        if (food[j].id == id) {
          item = {
            id: food[j].id,
            name: food[j].f_name,
            price: food[j].price,
            count: count||1
          }
        }
      }
    }
    return item
  },
  //获取滚动区域 dom 元素
  getAllRects() {
    let that = this
    wx.createSelectorQuery().selectAll('.food-list').boundingClientRect(function (rects) {
      that.data.rects = rects
      // console.log(rects)
    }).exec()
  }
});