const db = require('../../utils/db')

Page({
  data: {
    movies: []

  },

  onLoad: function(options) {
    this.getMovies()
  },

  // 下拉刷新
  onPullDownRefresh(){
    this.getMovies(() => {
      wx.stopPullDownRefresh()
      wx.showToast({
        title: '加载完成',
        icon: 'success',
        duration: 1000
      })
    })
  },


   // 获取电影列表
  getMovies(callback){

    wx.showLoading({
      title: '加载中...',
    })

    db.getMovies().then(result => {

      wx.hideLoading()

      console.log(result)
      const data = result.data
      this.setData({
        movies: data
      })

      callback && callback()
    })

  },



})