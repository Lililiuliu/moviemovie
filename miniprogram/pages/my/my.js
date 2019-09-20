const db = require('../../utils/db')

Page({

  data: {

  },

  onLoad: function (options) {
    wx.showLoading({
      title: '加载中...',
    })
    db.getMyComments()
    .then(res=>{
      console.log(res)
      this.setData({
        comments:res.result
      })
      wx.hideLoading()
    })
    .catch(
      console.error
    )
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
      success: function (res) {
        res.eventChannel.emit('acceptDataFromIndexPage', {
          commentId
        })
      }
    })
  }
  
})