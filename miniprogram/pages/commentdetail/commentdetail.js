const db = require('../../utils/db')
const innerAudioContext = wx.createInnerAudioContext()
const getuserinfo = require('../../utils/getuserinfo')


Page({

  data: {
    playing: false
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
            commentId : res.result._id,
            comment:res.result.comment,
            detail:res.result.detail
          })

          getuserinfo.getUserInfo().then(userInfo => {

            that.setData({
              userInfo
            })

            const movieId = that.data.detail.id

            db.checkMyComment(movieId)
              .then(res => {

                that.setData({
                  myComment: res.result.res.data[0]
                })
              })
          })
        })
    })
  },

  open: function () {
    var that = this;
    var url = '/pages/addcomment/addcomment?&type='

    if (!this.data.myComment) {
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
    } else {

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

  // 播放音频 
  playVoice() {
    console.log("点击播放按钮")

    const src = this.data.comment.record.tempFilePath
    const time = this.data.comment.record.duration
    innerAudioContext.src = src

    if (!this.data.playing) {
      innerAudioContext.play({
        complete: innerAudioContext.stop()
      })
    } else {
      innerAudioContext.stop()
    }

    innerAudioContext.onPlay(() => {
      console.log('开始播放')
      this.setData({
        playing: true
      })
    })

    innerAudioContext.onStop(() => {
      console.log('停止播放')
      this.setData({
        playing: false
      })
    })
  },

  // 
  starComment(){
    const commentId = this.data.commentId
    console.log('C1' + commentId)
    const comment = this.data.comment
    const detail = this.data.detail

    db.starComment(commentId)
    .then(res=>{
      console.log(res.result.data.length)
        if (res.result.data.length){
          wx.showToast({
            title: '已收藏'
          })
        } else {
          console.log('C2' + commentId)
          db.addStarComment(commentId,comment,detail)
          .then(res=>{wx.showToast({
            title: '已收藏',
          })})
        }
    })
  }


})