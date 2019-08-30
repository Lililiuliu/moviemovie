const app = getApp()
const db = require('../../utils/db')
import lottie from '../lottie-miniprogram'
const recorderManager = wx.getRecorderManager()

Page({

  data: {
    detail: {},

    comment: {
      text: null,
      type: null,
      record: {},
    },
    anihidden:false,
  

  },

  onLoad: function (options) {
    
    this.setData({
      'comment.type':options.type,
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

// 点击完成按钮提交影评
  done(userinfo) {
    console.log(userinfo)
    const comment = this.data.comment
    const detail = this.data.detail
    const that = this
    wx.showLoading({
      title: '正在提交...',
    })
    if (comment.text) {
    db.addComment(comment, detail)
      .then(res => {
        console.log(res)
        wx.hideLoading()
        wx.navigateTo({
          url: '/pages/commentpreview/commentpreview',
          success:function(res){
            res.eventChannel.emit('acceptDataFromOpenerPage', {data: that.data})
          }
        })
      })
      .catch(()=>
        {
        wx.showToast({
          icon: 'none',
          title: '提交失败，稍后重试',
        });
        }
      )
    } else wx.showToast({
      title: '请输入影评内容',
      icon:'none',
    })
  },

// 按下录音按钮
  touchStart(){
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

  startRecord:function(){
    recorderManager.onStart(() => {
      console.log('recorder start')
      // wx.showToast({
      //   title: '长按录音,松开结束',
      //   duration: 60000,
      //   icon:'none'
      // })

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
      anihidden:false
    })

    this.init()
  },

  endRecord(){
    var that = this
    // 停止录音
    recorderManager.stop()
    // 监听录音停止
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      that.setData({
        'comment.record' : res,
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

})