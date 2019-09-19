const db = require('../../utils/db')

Page({

  data: {

  },


  onLoad: function(options) {

    const that = this

    const eventChannel = this.getOpenerEventChannel()
    eventChannel.on('acceptDataFromIndexPage', function(data) {
      db.getCommentDetail(data.commentId)
        .then(res=>{
          console.log(res)
        })

    })

  },


})