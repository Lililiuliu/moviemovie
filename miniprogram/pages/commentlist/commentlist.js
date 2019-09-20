const db = require('../../utils/db')

Page({

  data: {

  },

  onLoad: function (options) {
    const that = this
    const movieId = options.movieId

    wx.showLoading({
      title: '加载中...',
    })

    db.getCommentsList(movieId)
    .then( res =>{
      wx.hideLoading()

      this.setData({
        comments:res.result
      })
    })
  },

  home() {
    wx.navigateBack({
      delta: 2
    })
  },

  tap(event){
    console.log(event)

    const that = this
    const commentId = event.currentTarget.id

    wx.navigateTo({
      url: '/pages/commentdetail/commentdetail',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromIndexPage', {
          commentId: that.data.commentId
        })
      }
    })
  }


})