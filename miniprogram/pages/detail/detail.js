const db = require('../../utils/db')
const app = getApp()

Page({
  data: {
    detail: '',
    screenSize: app.globalData.screenSize
  },

  onLoad: function(options) {
    this.getDetail(options.id)
  },

  // 获取 detail 数据
  getDetail(id) {

    wx.showLoading({
      title: '加载中...',
    })

    db.getMovieDetail(id)
      .then(res => {
        const summary = res.result.summary.replace(/^\n\s\s/,'')
        res.result.summary = summary

        this.setData({
          detail: res.result
        })
        wx.hideLoading()
      })
      .catch(console.error)
  },


  // 打开 actionsheet
  open: function() {
    var that = this;
    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: function(res) {
        if (!res.cancel) {
          // console.log(res.tapIndex)
          // console.log(res)
          if (res.tapIndex === 0) {
            
            const url = '/pages/addcomment/addcomment?&type='
          
            wx.navigateTo({
              url: url + 'text',
              success: (res) => {
                res.eventChannel.emit('acceptDataFromOpenerPage', { data: that.data })
              }
            })
            app.globalData.detail = that.data.detail
            app.globalData.addCommentType = "text"
            
          } else {
            wx.navigateTo({
              url: '/pages/addcomment/addcomment?&type=',
            })
            app.globalData.detail = that.data.detail
            app.globalData.addCommentType = "voice"
          }
        }
      }
    });
  }

})