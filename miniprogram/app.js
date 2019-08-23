//app.js
App({

  globalData: {
    screenSize:'',
    res:null
  },



  onLaunch: function () {
    
    var that = this;

    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      
      wx.cloud.init({
        env: 'note-qx722',
        traceUser: true,
      })
    }

    wx.getSystemInfo({
      success: function(res) {
        if(res.screenWidth < 375 ){
          that.globalData.screenSize = true
        }else{
          that.globalData.screenSize = false
        }
      },
    })
   
  },

  
})
