const db = require('../../utils/db')
const getuserinfo = require('../../utils/getuserinfo')

Page({

  data: {
    type:'mycomments',
    tag:'发布的影评'
  },

  onLoad: function(options) {

    this.getMyComments()

  },

  onShow() {
    getuserinfo.getUserInfo().then(userInfo => {
      this.setData({
        userInfo
      })
    })
  },

  onTapLogin(event) {
    this.setData({
      userInfo: event.detail.userInfo
    })
  },

  home() {
    wx.navigateBack({
      delta: 1
    })
  },

  tap(event) {
    console.log(event)

    const that = this
    const commentId = event.currentTarget.id

    wx.navigateTo({
      url: '/pages/commentdetail/commentdetail',
      success: function(res) {
        res.eventChannel.emit('acceptDataFromIndexPage', {
          commentId
        })
      }
    })
  },

  getMyComments(callback) {

    wx.showLoading({
      title: '加载中...',
    })

    const type = this.data.type

    if (type == 'mycomments') {

      db.getMyComments()
        .then(res => {
          console.log(res)
          this.setData({
            comments: res.result
          })
          wx.hideLoading()
        })
        .catch(
          console.error
        )

    } else {

      db.getStarComments()
        .then(res => {
          console.log(res)
          this.setData({
            comments: res.result
          })
          wx.hideLoading()
        })
        .catch(
          console.error
        )

    }

    callback && callback()
  },

  onPullDownRefresh() {
    
    this.getMyComments(() => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '加载完成',
        icon: 'success',
        duration: 1000
      })
    })
  },

  switchAction(){
    if (this.data.type == 'mycomments'){
      this.setData({
        type:'starcomments',
        tag:'收藏的影评'
      })
      this.getMyComments()
    } else {
      this.setData({
        type: 'mycomments',
        tag: '发布的影评'
      })
      this.getMyComments()
    }
  }

})