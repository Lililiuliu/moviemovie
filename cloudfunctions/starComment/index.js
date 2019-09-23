// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const commentId = event.commentId

  const res = await db.collection('starComments').where({
    _openid:openId,
    commentId:commentId
  }).get()

  return res
}