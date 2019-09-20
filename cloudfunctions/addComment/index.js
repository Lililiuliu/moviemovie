// 云函数入口文件
const cloud = require('wx-server-sdk')
cloud.init()
const db = cloud.database()

// 云函数入口函数
exports.main = async (event, context) => {
  // const text = event.text
  // const movieID = event.movieID
  // const type = event.type
  const comment = event.comment
  const detail = event.detail
  const res = await db.collection('movieComments').add({
    data:{
      //text: text,
      // movieID: movieID,
      openId: event.openId,
      comment:comment,
      detail:detail,
      date:Date.now()
    }
  })
  return res
}

