// pages/all_activity/index.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		list_data: [],

		type: '',
		keywords: '',
		page: 1,

		no: false,
	},

	// setTabIndex
	setTabIndex: function (e) {
		let index = e.currentTarget.dataset.index;
		this.setData({
			tab_active: index,
		})
	},

	// goDetail
	goDetail: function (e) {
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/content/index?id=' + id,
		})
	},

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let type = options.type;
		this.setData({
			type: type
		})
		let url = app.globalData.dev_api;
		let that = this;
		if (type == 1) {
			if (JSON.parse(options.data).length <= 0) {
				wx.showToast({
					title: '已加载全部',
					icon: 'none'
				})
				that.setData({
					no: true,
				})
			}else {
				let data = JSON.parse(options.data);
				data.forEach(item => {
					item.serve_type = item.serve_type.split(',')
				})
				that.setData({
					list_data: data,
					keywords: options.keywords,
					no: false,
				})
			}
		}else {
			wx.request({
				url: url + '/activity',
				data: {
					userId: wx.getStorageSync('user_id'),
					orderType: type
				},
				success: function (res) {
					console.log(res);
					if (res.data.data.data.length <= 0) {
						wx.showToast({
							title: '已加载全部',
							icon: 'none'
						})
						that.setData({
							no: true,
						})
					}else {
						let data = res.data.data.data;
						data.forEach(item => {
							item.serve_type = item.serve_type.split(',')
						})
						that.setData({
							list_data: data,
							no: false,
						})
					}
				}
			})
		}
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
		if (that.data.type == 1) {
			wx.request({
				url: url + '/search',
				data: {
					userId: wx.getStorageSync('user_id'),
					keywords: that.data.keywords,
					page: page,
				},
				success: function (res) {
					console.log(res);
					if (res.data.data.active_list.data.length <= 0) {
						wx.showToast({
							title: '已加载全部',
							icon: 'none'
						})
					} else {
						let data = that.data.list_data;
						res.data.data.active_list.data.forEach(item => {
							item.serve_type = item.serve_type.split(',')
							data.push(item)
						})
						that.setData({
							list_data: data,
							page: page,
						})
					}
				}
			})
		}else {
			wx.request({
				url: url + '/activity',
				data: {
					userId: wx.getStorageSync('user_id'),
					orderType: that.data.type,
					page: page,
				},
				success: function (res) {
					console.log(res);
					if (res.data.data.data.length <= 0) {
						wx.showToast({
							title: '已加载全部',
							icon: 'none'
						})
					} else {
						let data = that.data.list_data;
						res.data.data.data.forEach(item => {
							item.serve_type = item.serve_type.split(',')
							data.push(item)
						})
						that.setData({
							list_data: data,
							page: page,
						})
					}
				}
			})
		}
	},

	/**
	 * 用户点击右上角分享
	 */
	// onShareAppMessage: function () {

	// }
})