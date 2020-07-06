// pages/my/my.js
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        userInfo: "",
        add: false
    },

    help: function() {
        wx.navigateTo({
          url: '/pages/help/help',
        });
    },

    feedback: function() {
        wx.navigateTo({
            url: '/pages/feedback/index',
        })
    },

	// goList
	goList: function (e) {
        let url = e.currentTarget.dataset.url;
		wx.navigateTo({
			url: '/pages/list/index?type=' + url,
		})
	},

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
		let userInfo = wx.getStorageSync('userInfo') || '';
		if (userInfo) {
			this.setData({
				userInfo: JSON.parse(userInfo)
			})
        }

    },

	onGotUserInfo: function (e) {
		if (e.detail.userInfo) {
			let url = app.globalData.dev_api;
			let that = this;
			wx.request({
				url: url + '/setinfo',
				data: {
					userId: wx.getStorageSync('user_id'),
					pic: e.detail.userInfo.avatarUrl,
					userName: e.detail.userInfo.nickName
				},
				success: function (res) {
					console.log(res);
				}
			})
			wx.setStorageSync('userInfo', JSON.stringify(e.detail.userInfo));
			this.setData({
				userInfo: e.detail.userInfo
			})
		}
    },
    
    addMine: function() {
        this.setData({
            add : !this.data.add
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function() {
        this.setData({
            add: false
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload: function() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh: function() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom: function() {

    },

    /**
     * 用户点击右上角分享
     */
    // onShareAppMessage: function(option) {
    //     // var that = this;
    //     // console.log(that.data.id);
    //     // return {
    //     // 	title: '北美留学大讲堂',
    //     // 	path: "pages/index/index",
    //     // }
    // }
})