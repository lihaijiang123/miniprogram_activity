// pages/organize/detail/index.js
const app = getApp()

Page({

  /**
   * 页面的初始数据
   */
  data: {
    info: [],
    organize_id: ''
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = app.globalData.dev_api;
    let that = this;
    that.data.organize_id = options.organize_id;
    wx.request({
      url: url + '/organizeInfo',
      data: {
        userId: wx.getStorageSync('user_id'),
        organize_id: options.organize_id
      },
      success: function (res) {
        that.setData({
          info: res.data.data
        })

        wx.setNavigationBarTitle({ title: that.data.info.name })

      }
    })

  },

  // 主办方列表页
  organizeList: function () {
    let that = this;

    wx.navigateTo({
      url: '/pages/organize/list/index?organize_id=' + that.data.organize_id + '&name=' + that.data.info.name
    })
  },


  // 关注
  attention: function () {
    let url = app.globalData.dev_api;
    let that = this;
    wx.request({
      url: url + '/attention',
      data: {
        userId: wx.getStorageSync('user_id'),
        organize_id: that.data.organize_id
      },
      success: function (res) {
        let data = that.data.info;
        if (data.attention) {
          wx.showToast({
            title: '取消关注',
          })
        } else {
          wx.showToast({
            title: '关注成功',
          })
        }
        data.attention = !data.attention;
        that.setData({
          info: data
        })
      }
    })
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})