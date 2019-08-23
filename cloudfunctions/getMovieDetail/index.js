// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  const id = event.id
  const res = await db.collection('hotMovies').where({id:id}).get()
  const detail = res.data[0]
  return detail
}