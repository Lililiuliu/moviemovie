const db = require('../../utils/db')

Page({

  data: {

  },

  onLoad: function (options) {
    const movieId = options.movieId
    this.setData({
      movieId
    })
    this.getComments(movieId)
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
          commentId
        })
      }
    })
  },

  getComments(movieId,callback){
    const that = this

    wx.showLoading({
      title: '加载中...',
    })

    db.getCommentsList(movieId)
      .then(res => {
        wx.hideLoading()
        this.setData({
          comments: res.result
        })
      })

    callback && callback()
  },

  onPullDownRefresh() {
    const movieId = this.data.movieId
    this.getComments(movieId,() => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '加载完成',
        icon: 'success',
        duration: 1000
      })
    })
  },



})