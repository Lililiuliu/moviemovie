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

  onLoad: function () {
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
    wx.showLoading({
      title: '正在提交...',
    })
    if (comment.text) {
    db.addComment(comment, detail)
      .then(res => {
        console.log(res)
        wx.hideLoading()
        wx.navigateTo({
          url: '/pages/index/index',
        })
      })
      .catch(console.error)
    } else wx.showToast({
      title: '请输入影评内容',
      icon:'none',
    })
  }

})