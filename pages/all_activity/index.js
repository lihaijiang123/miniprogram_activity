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

		categoryClickId: -1,
		typeClickId: -1,


		// title
		title1: '时间',
		title2: '综合排序',
		title3: '价格',
		title4: '活动类别',
		//default value
		value: 0,


		// option
		option1: [
			{ text: '全部', value: '1' },
			{ text: '今天', value: '2' },
			{ text: '明天', value: '3' },
			{ text: '本周', value: '4' },
			{ text: '本月', value: '5' },
			{ text: '本年', value: '6' },
			{ text: '明年及以后', value: '7' },
			{ text: '已结束', value: '8' },
		],
		option2: [
			{ text: '最多浏览', value: '101' },
			{ text: '最多收藏', value: '102' },
			{ text: '最多分享', value: '103' },
			{ text: '最新发布', value: '104' },
		],
		option3: [
			{ text: '全部', value: '201' },
			{ text: '免费', value: '202' },
			{ text: '收费', value: '203' },
		],


	},

	// 下拉框前三个
	change: function ({ detail }) {
		let url = app.globalData.dev_api;
		let that = this;
		this.setData({
			no: false
		})
		wx.request({
			url: url + '/test',
			data: {
				userId: wx.getStorageSync('user_id'),
				city: that.data.city,
				type: 'list',
				flag: detail
			},
			success: function (res) {
				let data = res.data.data;
				if (data.active_list.length > 0) {
					data.active_list.forEach(item => {
						item.serve_type = item.serve_type.split(',')
					})
					that.setData({
						list_data: data,
						value: detail,
						page: 1,
						typeClickId: -1,
						categoryClickId: -1
					})
				} else {
					that.setData({
						no: true
					})
				}

				that.gotop()
			}
		})

	},

	// 下拉框最后一个
	dropdownClick: function (event) {
		let that = this;
		let url = app.globalData.dev_api;
		let flag = event.currentTarget.dataset.flag;
		let id = event.currentTarget.dataset.id;

		this.setData({
			no: false
		})

		if (flag == 'category' && id != that.data.categoryClickId) {
			this.setData({
				categoryClickId: id,
				typeClickId: -1
			})
		}

		if (flag == 'type' && id != that.data.typeClickId) {
			this.setData({
				typeClickId: id,
				categoryClickId: -1
			})
		}

		let detail = flag + '-' + id;

		this.selectComponent('#item').toggle();

		wx.request({
			url: url + '/test',
			data: {
				userId: wx.getStorageSync('user_id'),
				city: that.data.city,
				type: 'list',
				flag: detail
			},
			success: function (res) {
				let data = res.data.data;
				if (data.active_list.length > 0) {
					data.active_list.forEach(item => {
						item.serve_type = item.serve_type.split(',')
					})
					that.setData({
						list_data: data,
						value: detail,
					})
				} else {
					that.setData({
						no: true,
					})
				}
				that.gotop()
			}
		})
	},

	// 回到最顶部
	gotop: function () {
		wx.pageScrollTo({
			scrollTop: 0
		})
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
			url: '/pages/search/index?type=list',
		})
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
		} else {
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
			} else if (is_city == 2) {
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
		// console.log('show')
		// this.setData({
		// 	typeClickId: -1,
		// 	categoryClickId: -1
		// })
		this.selectComponent('#item1').toggle(false);
		this.selectComponent('#item2').toggle(false);
		this.selectComponent('#item3').toggle(false);

		this.selectComponent('#item').toggle(false);
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

		let that = this;

		page++
		wx.request({
			url: url + '/test',
			data: {
				userId: wx.getStorageSync('user_id'),
				city: that.data.city,
				page: page,
				type: 'list',
				flag: that.data.value
			},
			success: function (res) {
				if (res.data.data.active_list.length <= 0) {
					wx.showToast({
						title: '已加载全部',
						icon: 'none'
					})
				} else {
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