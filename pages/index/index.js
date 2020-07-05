// pages/index/index.js
const app = getApp()
const {
    globalData: {
        defaultCity,
        defaultCounty
    }
} = app
Page({

    /**
     * 页面的初始数据
     */
    data: {
        // 城市
        location: "定位中",
        city: "",

        // 筛选
        tab_list: [],
        tab_active: 0,
        type_id: "",

        // 活动
        list_data: [],

        // swiper
        banner_data: [],
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 700,

        page: 1,

        no: false,
        showFlag: false,
    },

    // goCity
    goCity: function() {
        wx.navigateTo({
            url: '/pages/city/city?type=1',
        })
    },

    // goSearch
    goSearch: function() {
        wx.navigateTo({
            url: '/pages/search/index',
        })
    },

    // setTabIndex
    setTabIndex: function(e) {
        let index = e.currentTarget.dataset.index;
        let id = e.currentTarget.dataset.id;
        this.setData({
            tab_active: index,
            type_id: id,
        })
        wx.pageScrollTo({
            scrollTop: 0,
            duration: 300,
        })
        setTimeout(() => {
            this.pageInit();
        }, 300)
    },

    // goDetail
    goDetail: function(e) {
        let id = e.currentTarget.dataset.id;
        wx.navigateTo({
            url: '/pages/content/index?id=' + id,
        })
    },

    // pageInit
    pageInit: function() {
        let url = app.globalData.dev_api;
        let that = this;
        wx.request({
            url: url + '/test',
            data: {
                userId: wx.getStorageSync('user_id'),
				type: 'index',
                // page: page,
                city: that.data.city,
                serve_type_id: that.data.type_id
            },
            success: function(res) {
                if (res.data.code == -2) {
                    app.getOpenid().then(res => {
                        that.pageInit();
                    })
                }
                if (res.data.code == 0) {
                    if (res.data.data.active_list.length <= 0) {
                        that.setData({
                            no: true,
                        })
                    } else {
                        that.setData({
                            no: false,
                        })
                    }
                    that.setData({
                        tab_list: res.data.data.active_types,
                        banner_data: res.data.data.banners,
                        list_data: res.data.data.active_list,
                        page: 1,
                    })
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function(options) {
        let that = this;

        wx.getLocation({
            // type: 'wgs84', //返回可以用于wx.openLocation的经纬度
            //获取地理位置成功时
            success: function(res) {
                let city = wx.getStorageSync('city');
                console.log(city);

                if (false ||city && city != '请选择') {
                    that.setData({
                        location: city,
                        city: city
                    })
                    if (!wx.getStorageSync('user_id')) {
                        app.getOpenid().then(function(res) {
                            that.pageInit();
                        });
                    } else {
                        that.pageInit();
                    }
                } else {
                    //调用获取城市接口
                    wx.request({
                        url: 'https://apis.map.qq.com/ws/location/v1/ip?key=5CMBZ-BDLKJ-7IKFI-K5YSX-Z7HWE-EFBMG',
                        success: (res) => {
                            that.setData({
                                location: res.data.result.ad_info.city,
                                city: res.data.result.ad_info.city
                            })
                            wx.setStorageSync('is_city', 1);
                            wx.setStorageSync('city', res.data.result.ad_info.city);
                            if (!wx.getStorageSync('user_id')) {
                                app.getOpenid().then(function(res) {
                                    that.pageInit();
                                });
                            } else {
                                that.pageInit();
                            }
                        }
                    })
                }
            },
            //获取地理位置失败(用户点击不允许)时执行
            fail: function(err) {
                let is_city = wx.getStorageSync('is_city') || false;
                let city_default = wx.getStorageSync('city');
                that.setData({
                    location: city_default,
                })
                if (!is_city) {
                    wx.setStorageSync('is_city', 2);
                    wx.setStorageSync('city', '请选择');
                    wx.showToast({
                        title: '请手动选择城市',
                        icon: 'none'
                    })
                    let city = wx.getStorageSync('city');
                    that.setData({
                        location: city,
                    })
                    if (!wx.getStorageSync('user_id')) {
                        app.getOpenid().then(function(res) {
                            that.pageInit();
                        });
                    } else {
                        that.pageInit();
                    }
                } else {
					let city = wx.getStorageSync('city');
					if (city != '请选择') {
						that.setData({
							city: city
						})
					}
                    if (!wx.getStorageSync('user_id')) {
                        app.getOpenid().then(function(res) {
                            that.pageInit();
                        });
                    } else {
                        that.pageInit();
                    }
                }
            }
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
        // let city = wx.getStorageSync('city');
        // let is_city = wx.getStorageSync('is_city');
        // let that = this;
        // if (city) {
        // 	this.setData({
        // 		location: city,
        // 	})
        // 	if (city != '请选择') {
        // 		this.setData({
        // 			city: city
        // 		})
        // 	}
        // 	if (!wx.getStorageSync('user_id')) {
        // 		app.getOpenid().then(function (res) {
        // 			that.pageInit();
        // 		});
        // 	} else {
        // 		that.pageInit();
        // 	}
        // }
        // if (is_city && is_city == 1) {
        // 	if (city == '请选择' || city == '获取失败') {
        // 		// console.log(1);
        // 		const {
        // 			globalData: {
        // 				defaultCity,
        // 				defaultCounty
        // 			}
        // 		} = app
        // 		if (defaultCity) {
        // 			that.setData({
        // 				location: defaultCity,
        // 				county: defaultCounty
        // 			})
        // 		} else {
        // 			//调用获取城市接口
        // 			wx.request({
        // 				url: 'https://apis.map.qq.com/ws/location/v1/ip?key=5CMBZ-BDLKJ-7IKFI-K5YSX-Z7HWE-EFBMG',
        // 				success: (res) => {
        // 					that.setData({
        // 						location: res.data.result.ad_info.city,
        // 						city: res.data.result.ad_info.city
        // 					})
        // 					wx.setStorageSync('is_city', 1);
        // 					wx.setStorageSync('city', res.data.result.ad_info.city)
        // 					if (!wx.getStorageSync('user_id')) {
        // 						app.getOpenid().then(function (res) {
        // 							that.pageInit();
        // 						});
        // 					} else {
        // 						that.pageInit();
        // 					}
        // 				}
        // 			})
        // 		}
        // 	}
        // }
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
        let url = app.globalData.dev_api;
        let that = this;
        let page = this.data.page;
        page++;
        wx.request({
            url: url + '/test',
            data: {
                userId: wx.getStorageSync('user_id'),
				type: 'index',
                page: page,
                city: that.data.city,
                serve_type_id: that.data.type_id
            },
            success: function(res) {
                if (res.data.data.active_list.length <= 0) {
                    wx.showToast({
                        title: '已加载全部',
                        icon: 'none'
                    })
                } else {
                    let list_data = that.data.list_data;
                    if (res.data.data.active_list.length > 0) {
                        res.data.data.active_list.forEach(item => {
                            list_data.push(item);
                        })
                    }
                    that.setData({
                        tab_list: res.data.data.active_types,
                        banner_data: res.data.data.banners,
                        list_data: list_data,
                        page: page,
                    })
                }
            }
        })
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function() {

    }
})