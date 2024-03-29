// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {

  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID
  const commentId = event.comment
  const detail = event.detail

  const res = await db.collection('movieComments').add({
    data:{
      openId: openId,
      comment:comment,
      detail:detail,
      date:Date.now()
    }
  })
  return res
}

