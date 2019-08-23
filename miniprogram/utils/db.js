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
    const movieID = detail.id
    const text = comment.text
    return wx.cloud.callFunction({
      name: 'addComment',
      data:{
        movieID: movieID,
        text:text,
      },
    })
  },

  // 随机获取评论

}