// pages/organize/focus/index.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    no: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = app.globalData.dev_api;
    let that = this;

    wx.request({
      url: url + '/myOrganize',
      data: {
        userId: wx.getStorageSync('user_id'),
      },
      success: function (res) {
        console.log(res);
        if (res.data.data.length <= 0) {
          that.setData({
            no: true,
          })
        } else {
          that.setData({
            list: res.data.data,
            no: false,
          })
        }
      }
    })


  },

  goOrangize: function(e) {
    let id = e.currentTarget.dataset.id;
    let name = e.currentTarget.dataset.name;
    wx.navigateTo({
			url: '/pages/organize/list/index?organize_id=' + id + '&name=' + name
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