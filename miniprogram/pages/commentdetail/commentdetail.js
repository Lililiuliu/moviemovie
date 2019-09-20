const db = require('../../utils/db')

Page({

  data: {

  },


  onLoad: function(options) {

    const that = this
    wx.showLoading({
      title: '加载中...',
    })
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromIndexPage', function(data) {
      console.log(data)
      db.getCommentDetail(data.commentId)
        .then(res=>{
          wx.hideLoading()
          console.log(res)
          that.setData({
            comment:res.result.comment,
            detail:res.result.detail
          })
        })
    })



  },

  open: function () {
    var that = this;
    var url = '/pages/addcomment/addcomment?&type='

    wx.showActionSheet({
      itemList: ['文字', '音频'],
      success: function (res) {
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
  }


})