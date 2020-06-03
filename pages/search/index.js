// pages/search/search.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		search: '',
		search_arr: [],

		list_data: [],
		page: 1,

		isSearch: false,
	},

	// go
	go: function () {
		let search_arr = wx.getStorageSync('search_arr') || [];
		if (search_arr.length > 0) {
			this.setData({
				search_arr: search_arr,
			})
		}
		this.setData({
			isSearch: true
		})
	},

	to: function () {
		let that = this;
		setTimeout(() => {
			that.setData({
				isSearch: false,
			})
		}, 500)
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
		
	},

	onShow: function () {
		let search_arr = wx.getStorageSync('search_arr') || [];
		if (search_arr.length > 0) {
			this.setData({
				search_arr: search_arr,
			})
		}
	},

	// 监听input
	changeSearch: function (e) {
		let value = e.detail.value;
		this.setData({
			search: value,
		})
	},

	itemSearch: function (e) {
		let index = e.currentTarget.dataset.index;
		let search_arr = this.data.search_arr;
		this.setData({
			search: search_arr[index]
		})
		this.goSearch();
	},

	// 清除搜索历史
	removeDel: function () {
		this.setData({
			search_arr: [],
		})
		wx.removeStorageSync('search_arr');
	},

	// 搜索
	goSearch: function () {
		let that = this;
		let url = app.globalData.dev_api;
		let keywords = that.data.search;
		wx.request({
			url: url + '/test',
			data: {
				userId: wx.getStorageSync('user_id'),
				city: wx.getStorageSync('city'),
				keywords: keywords,
			},
			success: function (res) {
				let data = res.data.data.active_list;
				let search_arr = wx.getStorageSync('search_arr') || [];
				if (search_arr.length <= 0) {
					search_arr.push(keywords)
				}else {
					if (search_arr.indexOf(keywords) == -1) {
						search_arr.push(keywords)
					}
				}
				wx.setStorageSync('search_arr', search_arr);
				if (data.length <= 0) {
					wx.showToast({
						title: '没有查到数据~',
						icon: 'none'
					})
					that.setData({
						list_data: [],
						page: 1,
						isSearch: false,
					})
				}else {
					data.forEach(function (item) {
						item.serve_type = item.serve_type.split(",")
					})
					that.setData({
						list_data: data,
						page: 1,
						isSearch: false,
					})
				}
			}
		})
	},

	/**
	 * 页面上拉触底事件的处理函数
	 */
	onReachBottom: function () {
		let that = this;
		let url = app.globalData.dev_api;
		let keywords = that.data.search;
		let page = that.data.page;
		page++;
		wx.request({
			url: url + '/test',
			data: {
				userId: wx.getStorageSync('user_id'),
				keywords: keywords,
				city: wx.getStorageSync('city'),
				page: page,
			},
			success: function (res) {
				let old_data = that.data.list_data;
				let data = res.data.data.active_list;
				if (data.length <= 0) {
					wx.showToast({
						title: '没有更多数据~',
						icon: 'none'
					})
				}else {
					data.forEach(function (item) {
						item.serve_type = item.serve_type.split(",")
						old_data.push(item);
					})
					that.setData({
						list_data: old_data,
						page: page,
					})
				}
			}
		})
	},
})