// pages/all_activity/index.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		// 城市
		location: "定位中",
		city: "",

		// 筛选
		tab_active: 0,

		// 列表
		list_data: [],

		// page
		page: 1,

		is_options: false,
		options_index: 0,

		begin_time__desc: 0,
		hold_mode: '',

		sj: '',
		cs: '',

		no: false,
	},

	// goCity
	goCity: function () {
		wx.navigateTo({
			url: '/pages/city/city?type=2',
		})
	},

	// goSearch
	goSearch: function () {
		wx.navigateTo({
			url: '/pages/search/index',
		})
	},

	// setTabIndex
	setTabIndex: function (e) {
		let index = e.currentTarget.dataset.index;
		this.setData({
			tab_active: index,
			is_options: false,
			options_index: 0,
		})
		wx.pageScrollTo({
			scrollTop: 0,
			duration: 300,
		})
		let that = this;
		setTimeout(() => {
			let url = app.globalData.dev_api;
			wx.request({
				url: url + '/test',
				data: {
					userId: wx.getStorageSync('user_id'),
					city: that.data.city,
					serve_type_id: that.data.tab_active,
					type: 'list',
				},
				success: function (res) {
					let data = res.data.data;
					if (data.active_list.length <= 0) {
						that.setData({
							no: true,
						})
					}else {
						that.setData({
							no: false,
						})
					}
					data.active_list.forEach(item => {
						item.serve_type = item.serve_type.split(',')
					})
					that.setData({
						list_data: data,
						begin_time__desc: 0,
						hold_mode: '',
						page: 1,
						sj: '',
						cs: '',
					})
				}
			})
		}, 300)
	},

	// goDetail
	goDetail: function (e) {
		let id = e.currentTarget.dataset.id;
		wx.navigateTo({
			url: '/pages/content/index?id=' + id,
		})
	},

	// pageInit
	pageInit: function () {
		let url = app.globalData.dev_api;
		let that = this;
		wx.request({
			url: url + '/test',
			data: {
				userId: wx.getStorageSync('user_id'),
				city: that.data.city,
				type: 'list',
			},
			success: function (res) {
				let data = res.data.data;
				data.active_list.forEach(item => {
					item.serve_type = item.serve_type.split(',')
				})
				that.setData({
					list_data: data,
				})
			}
		})
	},

	// clickHandler
	// clickHandler: function (e) {
	// 	let index = e.currentTarget.dataset.index;
	// 	this.setData({
	// 		options_index: index,
	// 		is_options: true,
	// 	})
	// },

	// delHandler
	// delHandler: function () {
	// 	this.setData({
	// 		options_index: 0,
	// 		is_options: false,
	// 	})
	// },

	// clickShJi
	// clickShJi: function (e) {
	// 	let index = e.currentTarget.dataset.index;
	// 	let url = app.globalData.dev_api;
	// 	let that = this;
	// 	wx.pageScrollTo({
	// 		scrollTop: 0,
	// 		duration: 300,
	// 	})
	// 	setTimeout(() => {
	// 		wx.request({
	// 			url: url + '/search',
	// 			data: {
	// 				userId: 1,
	// 				hold_mode: that.data.hold_mode,
	// 				order: index,
	// 				serve_type_id: that.data.tab_active
	// 			},
	// 			success: function (res) {
	// 				let data = res.data.data;
	// 				data.active_list.data.forEach(item => {
	// 					item.serve_type = item.serve_type.split(',')
	// 				})
	// 				that.setData({
	// 					list_data: data,
	// 					begin_time__desc: index,
	// 					is_options: false,
	// 					options_index: 0,
	// 					page: 1,
	// 				})
	// 				if (that.data.begin_time__desc == 0) {
	// 					that.setData({
	// 						sj: ''
	// 					})
	// 				} else if (that.data.begin_time__desc == 'begin_time__asc') {
	// 					that.setData({
	// 						sj: '升序'
	// 					})
	// 				} else if (that.data.begin_time__desc == 'begin_time__desc') {
	// 					that.setData({
	// 						sj: '降序'
	// 					})
	// 				}
	// 			}
	// 		})
	// 	}, 300)
	// },

	// clickXsX
	// clickXsX: function (e) {
	// 	let index = e.currentTarget.dataset.index;
	// 	let url = app.globalData.dev_api;
	// 	let that = this;
	// 	wx.pageScrollTo({
	// 		scrollTop: 0,
	// 		duration: 300,
	// 	})
	// 	setTimeout(() => {
	// 		wx.request({
	// 			url: url + '/search',
	// 			data: {
	// 				userId: 1,
	// 				hold_mode: index,
	// 				order: that.data.begin_time__desc,
	// 				serve_type_id: that.data.tab_active
	// 			},
	// 			success: function (res) {
	// 				let data = res.data.data;
	// 				data.active_list.data.forEach(item => {
	// 					item.serve_type = item.serve_type.split(',')
	// 				})
	// 				that.setData({
	// 					list_data: data,
	// 					hold_mode: index,
	// 					is_options: false,
	// 					options_index: 0,
	// 					page: 1,
	// 				})
	// 				if (that.data.hold_mode == 0) {
	// 					that.setData({
	// 						cs: ''
	// 					})
	// 				} else if (that.data.hold_mode == '1') {
	// 					that.setData({
	// 						cs: '线上'
	// 					})
	// 				} else if (that.data.hold_mode == '2') {
	// 					that.setData({
	// 						cs: '线下'
	// 					})
	// 				}
	// 			}
	// 		})
	// 	}, 300)
	// },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let city = wx.getStorageSync('city');
		let is_city = wx.getStorageSync('is_city');
		let that = this;
		if (city) {
			this.setData({
				location: city
			})
		}
		if (city && city != '请选择') {
			this.setData({
				city: city
			})
			if (!wx.getStorageSync('user_id')) {
				app.getOpenid().then(function (res) {
					that.pageInit();
				});
			} else {
				that.pageInit();
			}
		}else {
			if (is_city == 1) {
				//调用获取城市接口
				wx.request({
					url: 'https://apis.map.qq.com/ws/location/v1/ip?key=5CMBZ-BDLKJ-7IKFI-K5YSX-Z7HWE-EFBMG',
					success: (res) => {
						that.setData({
							location: res.data.result.ad_info.city,
							city: res.data.result.ad_info.city
						})
						wx.setStorageSync('is_city', 1);
						wx.setStorageSync('city', res.data.result.ad_info.city)
						if (!wx.getStorageSync('user_id')) {
							app.getOpenid().then(function (res) {
								that.pageInit();
							});
						} else {
							that.pageInit();
						}
					}
				})
			}else if (is_city == 2) {
				if (!wx.getStorageSync('user_id')) {
					app.getOpenid().then(function (res) {
						that.pageInit();
					});
				} else {
					that.pageInit();
				}
			}
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
		let page = this.data.page;
		let serve_type_id = this.data.tab_active || '';
		let that = this;
		page++
		wx.request({
			url: url + '/test',
			data: {
				userId: wx.getStorageSync('user_id'),
				city: that.data.city,
				hold_mode: that.data.hold_mode,
				order: that.data.begin_time__desc,
				serve_type_id: serve_type_id,
				page: page,
				type: 'list',
			},
			success: function (res) {
				if (res.data.data.active_list.length <= 0) {
					wx.showToast({
						title: '已加载全部',
						icon: 'none'
					})
				}else {
					let list = that.data.list_data.active_list;
					res.data.data.active_list.forEach(item => {
						item.serve_type = item.serve_type.split(',')
						list.push(item);
					})
					let data = that.data.list_data;
					data.active_list = list;
					that.setData({
						list_data: data,
						page: page,
					})
				}
			}
		})
	},

	// /**
	//  * 用户点击右上角分享
	//  */
	// onShareAppMessage: function () {

	// }
})