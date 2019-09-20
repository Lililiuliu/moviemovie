// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init({
  env: 'note-qx722',
  traceUser: true,
})

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const openId = event.openId
  const res = await db.collection('movieComments').where({openId: openId}).get()
  const comments = res.data
  return await comments
}