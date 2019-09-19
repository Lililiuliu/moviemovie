const app = getApp()
const db = require('../../utils/db')
import lottie from '../lottie-miniprogram'
const recorderManager = wx.getRecorderManager()
const innerAudioContext = wx.createInnerAudioContext()

Page({

  data: {
    detail: {},
    comment: {
      text: null,
      type: null,
      record: null,
    },
    anihidden: false,
    playIcon: '/images/play-circle.png',
    pauseIcon: '/images/pause-circle-outline.png',
    playing:false


  },

  onLoad: function (options) {

    this.setData({
      'comment.type': options.type,
    })
    this.setDetail()
  },

  setDetail() {
    var that = this
    var eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      that.setData({
        detail: data.data.detail
      })
    })
  },

  getText(event) {
    this.setData({
      'comment.text': event.detail.value
    })
  },

  // 点击完成按钮
  done(event) {

    // 获取用户信息
    this.setData({
      'comment.userInfo': event.detail.userInfo
    })

    const comment = this.data.comment
    // const detail = this.data.detail
    const that = this

    // wx.showLoading({
    //   title: '正在提交...',
    // })
    if (comment.text || comment.record) {
      // 跳转影评预览，并进行数据通信
      wx.navigateTo({
        url: '/pages/commentpreview/commentpreview',
        success: function (res) {
          res.eventChannel.emit('acceptDataFromAddcommentPage', {
            data: that.data
          })
        }
      })
    } else wx.showToast({
      title: '请输入影评内容',
      icon: 'none',
    })
  },

  // 按下录音按钮
  touchStart() {
    console.log(1)
    var that = this
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.record']) {
          wx.authorize({
            scope: 'scope.record',
            success() {
              wx.showToast({
                title: '授权成功',
              })
            }
          })
        } else that.startRecord()
      }
    })
  },

  startRecord: function () {
    recorderManager.onStart(() => {
      console.log('recorder start')
      this.init()
    })

    const options = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'mp3',
      frameSize: 50
    }
    recorderManager.start(options)

    this.setData({
      anihidden: false
    })

    // this.init()
    innerAudioContext.stop()
  },

  endRecord() {
    var that = this
    // 停止录音
    recorderManager.stop()
    // 监听录音停止
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      that.setData({
        'comment.record': res,
        'comment.record.duration': Math.ceil(res.duration / 1000),
        anihidden: true,
      })
    })

  },


  // lottie动画初始化
  init() {
    if (this._inited) {
      return
    }
    wx.createSelectorQuery().selectAll('#c1').node(res => {
      const canvas = res[0].node
      const context = canvas.getContext('2d')

      canvas.width = 100
      canvas.height = 100

      lottie.setup(canvas)
      this.ani = lottie.loadAnimation({
        loop: true,
        autoplay: true,
        animationData: require('../json/grunt.js'),
        rendererSettings: {
          context,
        },
      })
      this._inited = true
    }).exec()
  },

  playVoice() {
    const src = this.data.comment.record.tempFilePath
    const time = this.data.comment.record.duration
    innerAudioContext.src = src

    if (!this.data.playing) {
      innerAudioContext.play({complete:innerAudioContext.stop()})
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
    
  }

})