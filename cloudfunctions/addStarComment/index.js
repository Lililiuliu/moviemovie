// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  const res = await db.collection('starComments').add({
    data:{
      _openid:openId,
      comment:event.comment,
      detail:event.detail,
      commentId:event.commentId
    }
  })

  return res
}