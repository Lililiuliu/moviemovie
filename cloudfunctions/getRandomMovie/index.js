// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

const db = cloud.database()


// 云函数入口函数
exports.main = async (event, context) => {
  const wxContext = cloud.getWXContext()
  const res = await db.collection('movieComments')
    .aggregate()
    .sample({
      size: 1
    })
    .end()
  return res
}