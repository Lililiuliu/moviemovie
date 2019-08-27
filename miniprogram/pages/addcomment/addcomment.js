const app = getApp()
const db = require('../../utils/db')

Page({

  data: {
    detail: {},

    comment: {
      text: null,
      type: null,
    }

  },

  onLoad: function (options) {

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromOpenerPage', function (data) {
      console.log(data)
    })
    
    this.setData({
      'comment.type':options.type,
    })
    this.setDetail()
  },

  setDetail() {
    this.setData({
      detail: app.globalData.detail
    })
    app.globalData.detail = null;
  },

  getText(event) {
    this.setData({
      'comment.text': event.detail.value
    })
  },

  done() {
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
  }

})