module.exports = {
  getUserInfo() {
    return new Promise((resolve, reject) => {
      wx.getSetting({
        success(res) {
          if (res.authSetting['scope.userInfo'] === false) {
            // 已拒绝授权
            reject()
          } else {
            wx.getUserInfo({
              success(res) {
                const userInfo = res.userInfo
                resolve(userInfo)
              }
            })
          }
        }
      })
    })
  },
}