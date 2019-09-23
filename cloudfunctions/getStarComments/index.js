// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'note-qx722',
  traceUser: true,
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const openId = wxContext.OPENID

  const res = await db.collection('starComments').where({ _openid: openId }).get()
  const comments = res.data
  return comments
}