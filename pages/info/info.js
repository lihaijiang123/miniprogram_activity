const app = getApp()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    index: 0,
    industryColor: '#333',
    display: 'none',
    data: {},
    array: [],
    error: {
      name: '',
      phone: '',
      email: '',
      industry: ''
    }
  },

  bindPickerChange: function (e) {
    let that = this;
    let index = e.detail.value;


    var industry = 'data.industry';
    that.setData({
      [industry]: that.data.array[index]
    })

    if (that.data.array[index] == "其他") {
      that.setData({
        display: 'block',
      })
    } else {
      that.setData({
        display: 'none',
      })
    }

    that.setData({
      index: index,
      industryColor: '#333'
    })

  },

  formSubmit: function (e) {
    let url = app.globalData.dev_api;
    let that = this;
    let data = e.detail.value;
    let flag = true;
    let error = {};

    if (data.name.length == 0) {
      error = that.mergeJsonObject(error, { name: '请输入姓名' });
      flag = false;
    }
    if (!(/^1[3456789]\d{9}$/.test(data.phone))) {
      error = that.mergeJsonObject(error, { phone: '请输入正确手机号' });
      flag = false;
    }
    if (!(/^([a-zA-Z]|[0-9])(\w|\-)+@[a-zA-Z0-9]+\.([a-zA-Z]{2,4})$/.test(data.email))) {
      error = that.mergeJsonObject(error, { email: '请输入正确的邮箱' });
      flag = false;
    }
    if (that.data.display == 'block' && data.industry_other.length == 0) {
      error = that.mergeJsonObject(error, { industry: '如没有可选项请手动输入' });
      flag = false;
    }

    if (that.data.display != 'block') {
      data.industry_other = null;
    }

    if (!flag) {
      that.setData({
        error: error
      })
      return false;
    } else {
      that.setData({
        error: error
      })
    }

    let serve_id = that.data.serve_id == undefined ? 0 : that.data.serve_id;
    
    // post
    wx.request({
      url: url + '/info',
      data: {
        userId: wx.getStorageSync('user_id'),
        data: data,
        serve_id: serve_id
      },
      success: function (res) {
        wx.showToast({
          title: res.data.msg,
        })
      }
    })
  },

  // mergen 
  mergeJsonObject: function (jsonbject1, jsonbject2) {
    var resultJsonObject = {};
    for (var attr in jsonbject1) {
      resultJsonObject[attr] = jsonbject1[attr];
    }
    for (var attr in jsonbject2) {
      resultJsonObject[attr] = jsonbject2[attr];
    }
    return resultJsonObject;
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let url = app.globalData.dev_api;
    let that = this;


    wx.request({
      url: url + '/getInfo',
      data: {
        userId: wx.getStorageSync('user_id'),
        serve_id: options.id
      },
      success: function (res) {
        if(!res.data.data.info.isNull) {
          if (res.data.data.industry.indexOf(res.data.data.info.industry) < 0) {
            res.data.data.info.industry_other = res.data.data.info.industry;
            res.data.data.info.industry = res.data.data.industry[res.data.data.industry.length - 1];
            that.setData({
              display: 'block'
            })  
          }

        }

        that.setData({
          data: res.data.data.info,
          industryColor: res.data.data.info.industryColor,
          array: res.data.data.industry,
          serve_id: options.id
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