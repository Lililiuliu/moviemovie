// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  const movieId = event.movieId

  const res = await db.collection('movieComments').where({
    detail:{id:movieId},
    openId:openId,
  }).get()

  return {'res':res,'openId':openId,'movieId':movieId}
}