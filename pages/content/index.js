// pages/content/index.js
const app = getApp()
Page({

	/**
	 * 页面的初始数据
	 */
	data: {
		detail_data: {},
		id: '',
	},

	// goHome
	goHome: function () {
		wx.switchTab({
			url: '/pages/index/index'
		})
	},

	// want join
	wantJoin: function () {
		let url = app.globalData.dev_api;
		let that = this;
		wx.request({
			url: url + '/join',
			data: {
				userId: wx.getStorageSync('user_id'),
				serve_id: that.data.id
			},
			success: function (res) {
				let data = that.data.detail_data;
				if (data.join) {
					wx.showToast({
						title: '不想参加',
					})
				}else {
					wx.showToast({
						title: '想参加',
					})
				}
				data.join = !data.join;
				that.setData({
					detail_data: data
				})
			}
		})
	},

	// cang
	cang: function () {
		let url = app.globalData.dev_api;
		let that = this;
		wx.request({
			url: url + '/collection',
			data: {
				userId: wx.getStorageSync('user_id'),
				serve_id: that.data.id
			},
			success: function (res) {
				let data = that.data.detail_data;
				if (data.cang) {
					wx.showToast({
						title: '取消收藏',
					})
				}else {
					wx.showToast({
						title: '收藏成功',
					})
				}
				data.cang = !data.cang;
				that.setData({
					detail_data: data
				})
			}
		})
	},

	copyUrl: function () {
		let that = this
    wx.showToast({
      title: '复制成功',
    })
    wx.setClipboardData({
      data: that.data.detail_data.url,
    })
  },

	/**
	 * 生命周期函数--监听页面加载
	 */
	onLoad: function (options) {
		let url = app.globalData.dev_api;
		let that = this;
		wx.request({
			url: url + '/actdetail',
			data: {
				userId: wx.getStorageSync('user_id'),
				activity: options.id
			},
			success: function (res) {
				res.data.data.content = res.data.data.content.replace(/\<img/g, '<img style="max-width:100%;height:auto;display:inline-block;"');
				that.setData({
					detail_data: res.data.data
				})
			}
		})
		this.setData({
			id: options.id
		})
	},

	imgShow: function (event) {
		var that=this;
    var src = that.data.detail_data.share_img;//获取data-src
    var imgList = [that.data.detail_data.share_img];//获取data-list
    //图片预览
    wx.previewImage({
      current: src, // 当前显示图片的http链接
      urls: imgList // 需要预览的图片http链接列表
    })
	},

	realImageLoad: function(e) {
		let $width=e.detail.width,    //获取图片真实宽度
				$height=e.detail.height   //获取图片真实宽度
				var ratio=$width/$height;    //图片的真实宽高比例
				console.log(ratio)
				var viewWidth=690,           //设置图片显示宽度，左右留有16rpx边距
				viewHeight=viewWidth/ratio;    //计算的高度值
				console.log(viewHeight)
		var image = this.data.detail_data.share_img; 
			image={
				width: viewWidth,
				height: viewHeight         //viewHeight
			}
		 this.setData({
			image:image
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
	onShareAppMessage: function (option) {
		var that = this;
		let url = app.globalData.dev_api;
		wx.request({
			url: url + '/share',
			data: {
				userId: wx.getStorageSync('user_id'),
				serve_id: that.data.id,
			},
			success: function (res) {
				console.log(res);
			}
		})
		return {
			title: that.data.detail_data.title,
			imageUrl: that.data.detail_data.pic,
			path: "pages/content/index?id=" + that.data.id
		}
	}
})