// pages/organize/list/index.js
const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    organize_id: '',
    page: 1
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = app.globalData.dev_api;
    let that = this;
    that.data.organize_id = options.organize_id;

    wx.setNavigationBarTitle({ title: options.name })

    wx.request({
      url: url + '/organizeList',
      data: {
        userId: wx.getStorageSync('user_id'),
        organize_id: options.organize_id
      },
      success: function (res) {
        that.setData({
          list: res.data.data
        })
      }
    })

  },

  // goDetail
  goDetail: function (e) {
    let id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/content/index?id=' + id,
    })
  },


  // 主办方详情页
  organizeInfo: function () {
    let that = this;
    wx.navigateTo({
      url: '/pages/organize/detail/index?organize_id=' + that.data.organize_id,
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
    let url = app.globalData.dev_api;
    let that = this;
    let page = that.data.page;
    page++;
    wx.request({
      url: url + '/organizeList',
      data: {
        userId: wx.getStorageSync('user_id'),
        organize_id: that.data.organize_id,
        page: page
      },
      success: function (res) {


        if (res.data.data.length <= 0) {

          wx.showToast({
            title: '已加载全部',
            icon: 'none'
          })

        } else {
          let list = that.data.list;
          res.data.data.forEach(item => {
            list.push(item);
          })

          that.setData({
            list: list,
            page: page,
          })
        }

      }
    })
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})