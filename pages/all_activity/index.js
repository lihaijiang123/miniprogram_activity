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

		hold_mode: '',

		no: false,
		
		// title
		title1: '时间',
		title2: '综合排序',
		title3: '价格',
		title4: '活动类别',
		//default value
		value1: 0,
		value2: '10',
    value3: '20',
		value4: '30',
		// option
		option1: [
      { text: '全部', value: 0 },
      { text: '今天', value: 1 },
			{ text: '明天', value: 2 },
      { text: '本周', value: 3 },
      { text: '本月', value: 4 },
      { text: '本年', value: 5 },
      { text: '明年及以后', value: 6 },
      { text: '已结束', value: 7 },
    ],
    option2: [
      { text: '最多浏览', value: '10' },
      { text: '最多收藏', value: '11' },
			{ text: '最多分享', value: '12' },
			{ text: '最新发布', value: '12' },
		],
		option3: [
      { text: '全部', value: '20' },
      { text: '免费', value: '21' },
      { text: '收费', value: '22' },
		],
		option4: [
      { text: '活动类别', value: '30' },
      { text: '好评排序', value: '31' },
      { text: '销量排序', value: '32' },
    ],
		switchTitle1: '包邮',

	},

  onSwitch1Change({ detail }) {
    this.setData({ switch1: detail });
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