const db = require('../../utils/db')
const app = getApp()
const getuserinfo = require('../../utils/getuserinfo')

Page({
  data: {
    detail: '',
    screenSize: app.globalData.screenSize
  },

  onLoad: function(options) {
    this.getDetail(options.id)
  },


  getDetail(id) {

    // const openid = this.data.userInfo.

    wx.showLoading({
      title: '加载中...',
    })


    db.getMovieDetail(id)

      .then(res => {
        const summary = res.result.summary.replace(/^\n\s\s/, '')
        res.result.summary = summary

        this.setData({
          detail: res.result
        })
        wx.hideLoading()

        getuserinfo.getUserInfo().then(userInfo => {

          this.setData({
            userInfo
          })

          const movieId = this.data.detail.id

          db.checkMyComment(movieId)
            .then(res => {

              this.setData({
                myComment: res.result.res.data[0]
              })
            })
        })

      })
      .catch(console.error)
  },

  // 跳转影评列表页
  getComments() {
    wx.navigateTo({
      url: '/pages/commentlist/commentlist?movieId=' + this.data.detail.id,
    })
  },


  // 打开 actionsheet
  open: function() {
    var that = this;
    var url = '/pages/addcomment/addcomment?type='

    if (!this.data.myComment) {
      wx.showActionSheet({
        itemList: ['文字', '音频'],
        success: function(res) {
          if (!res.cancel) {
            // console.log(res.tapIndex)
            // console.log(res)
            if (res.tapIndex === 0) {

              wx.navigateTo({
                url: url + 'text',
                success: (res) => {
                  res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: that.data
                  })
                }
              })

            } else {
              wx.navigateTo({
                url: url + 'voice',
                success: (res) => {
                  res.eventChannel.emit('acceptDataFromOpenerPage', {
                    data: that.data
                  })
                }
              })

            }
          }
        }
      });
    }else{

      const commentId = this.data.myComment._id

      wx.navigateTo({
        url: '/pages/commentdetail/commentdetail',
        success: function (res) {
          res.eventChannel.emit('acceptDataFromIndexPage', {
            commentId
          })
        }
      })
    }
  },

})