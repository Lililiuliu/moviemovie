const db = require('../../utils/db')
const innerAudioContext = wx.createInnerAudioContext()

Page({

  data: {
    detail: null,
    comment: null,
  },

  onLoad(options) {
    const that = this
    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromAddcommentPage', function(data) {
      console.log(data)
      that.setData({
        detail: data.data.detail,
        comment: data.data.comment
      })
    })
    console.log(this.data)
  },

  back() {
    wx.navigateBack({
      delta: 1
    })
  },

  playVoice() {
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

  send() {
    const comment = this.data.comment
    const detail = this.data.detail
    const that = this

    wx.showLoading({
      title: '正在提交...',
    })

    if (comment.type == 'voice') {
      console.log('上传临时文件')
      const filePath = comment.record.tempFilePath
      const cloudPath = `${that.guid()}${filePath.match(/\.[^.]+?$/)[0]}`;
      //上传临时文件，获取地址
      wx.cloud.uploadFile({
        cloudPath, // 上传至云端的路径
        filePath: comment.record.tempFilePath, // 小程序临时文件路径
        success: res => {
          comment.record.tempFilePath = res.fileID
        },
        fail: console.error
      })
    }

    db.addComment(comment, detail)
      .then(res => {
        console.log(res)
        wx.hideLoading()
        wx.navigateBack({
          delta: 2
        })
        wx.showToast({
          title: '提交成功',
          icon: 'success',
        })
      })
    .catch(() => {
      wx.showToast({
        icon: 'none',
        title: '提交失败，稍后重试',
      });
    })

  },

  guid() {
    return  'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) =>  {
      const  r  = Math.random() * 16 | 0,
        v =  c  == 'x'  ? r  : (r & 0x3 | 0x8);

      return v.toString(16);
    });
  }

})