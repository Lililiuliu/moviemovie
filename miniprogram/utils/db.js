const db = wx.cloud.database({
  env:"note-qx722"
})

module.exports = {

  // 从云数据库获取电影列表
  getMovies(){
    return db.collection('hotMovies').get()
  },

  // 调用云函数，获取电影详情
  getMovieDetail(id){
    return wx.cloud.callFunction({
      name: 'getMovieDetail',
      data: {
        id: id
      },
    })
  },

  // 调用云函数，添加评论
  addComment(comment,detail){
    // const movieID = detail.id
    const text = comment.text
    return wx.cloud.callFunction({
      name: 'addComment',
      data:{
        // movieID: movieID,
        text:text,
        comment:comment,
        detail:detail,
      },
    })
  },

  // 随机获取评论
  getRandomMovie(){
    return wx.cloud.callFunction({
      name:'getRandomMovie'
    })
  },

  // 获取评论详情
  getCommentDetail(commentId){
    return wx.cloud.callFunction({
      name:'getCommentDetail',
      data:{
        commentId
      }
    })
  },

  // 查询电影影评列表
  getCommentsList(movieId){
    return wx.cloud.callFunction({
      name: 'getCommentsList',
      data: {
        movieId
      }
    })
  },
  
  // 查询创建的影评
  getMyComments() {
    return wx.cloud.callFunction({
      name: 'getMyComments'
    })
  },
  // 查询收藏的影评
  getStarComments() {
    return wx.cloud.callFunction({
      name: 'getStarComments'
    })
  },

 // 查询我的影评
  checkMyComment(movieId) {
    return wx.cloud.callFunction({
      name: 'checkMyComment',
      data: {
        movieId
      }
    })
  },

  starComment(commentId){
    return wx.cloud.callFunction({
      name: 'starComment',
      data: {
        commentId
      }
    })
  },

  addStarComment(commentId, comment, detail){
    return wx.cloud.callFunction({
      name: 'addStarComment',
      data: {
        commentId,
        comment,
        detail
      }
    })
  }
}