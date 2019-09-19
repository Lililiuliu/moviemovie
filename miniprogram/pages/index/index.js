const app = getApp()
const db = require('../../utils/db')

Page({

  onLoad(){

    wx.showLoading({
      title: '加载中...',
    })

    db.getRandomMovie()
    .then(res=>{
      console.log(res)
      const data = res.result.list[0]
      this.setData({
        poster: data.detail.img,
        name: data.detail.name,
        movieId: data.detail.id,
        userAvatar: data.comment.userInfo.avatarUrl,
        userName: data.comment.userInfo.nickName,
        commentId: data._id
      })
      wx.hideLoading()
    })
  },

  tapUser(){
    const that = this

    wx.navigateTo({
      url: '/pages/commentdetail/commentdetail',
      success: function (res) {
        res.eventChannel.emit('acceptDataFromIndexPage', {
          commentId: that.data.commentId
        })
      }
    })
  }



})
