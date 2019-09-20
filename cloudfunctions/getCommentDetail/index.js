
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const commentId = event.commentId
  const res = await db.collection('movieComments').where({ _id: commentId }).get()
  const commentDetail = res.data[0]
  return commentDetail
}