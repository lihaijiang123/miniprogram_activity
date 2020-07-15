const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    let url = app.globalData.dev_api;
    let that = this;
    wx.request({
      url: url + '/home/login/openId',
      success: function (res) {
        console.log(res.data.data)
        if (res.data.data > 0) {
          wx.switchTab({
            url: '/pages/index/index'
          })
        } else {
          that.setData({
            show: true
          })
        }
      }
    })



  }
})