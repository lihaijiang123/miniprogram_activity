import { HOT_CITY_LIST } from '../../locale/citydata'
import { commonMessage } from '../../locale/commonMessageZhCn'
import utils from '../../utils/utils'

const {
	safeGet,
	getLocationUrl,
	getIndexUrl,
	onFail,
} = utils;



const appInstance = getApp();
const app = getApp()
Page({
	data: {
		hotCityList: HOT_CITY_LIST,
		hotCountryList: [],
		showChosenLetterToast: false,
		city: commonMessage['location.getting'],
		inputName: '',
		auto: true, // 自动手动定位开关
		showFlag: false,
		type: 0,
		show: false,
		columns: [],
	},

	onLoad: function (options) {
		let that = this;
		that.setData({
			type: options.type
		})
		let url = app.globalData.dev_api;
		wx.request({
			url: url + '/hotCountry',
			data: {
				userId: wx.getStorageSync('user_id'),
			},
			success: function (res) {
				// 更多城市
				var citys = res.data.data.city;

				that.setData({
					citys: citys,
					columns: [{
						values: Object.keys(citys),
						className: 'column1',
					},
					{
						values: citys[Object.keys(citys)[0]],
						className: 'column2',
					}],
					hotCountryList: res.data.data.country
				});
			}
		})


		// 定位
		that.getLocation();
	},




	showPopup() {
		this.setData({ show: true });
	},

	onClose() {
		this.setData({ show: false });
	},

	onConfirm(event) {
		const { picker, value, index } = event.detail;
		this.setData({
			auto: false,
			city: value[1],
		})

		appInstance.globalData.defaultCity = value[1]
		wx.setStorageSync('city', value[1]);
		wx.setStorageSync('is_city', 1);

		// 返回首页
		if (this.data.type == 1) {
			wx.reLaunch({ url: getIndexUrl() })
		} else if (this.data.type == 2) {
			wx.reLaunch({ url: '/pages/all_activity/index' })
		}
		
  },


	onChange(event) {
		let that = this;
		const { picker, value, index } = event.detail;
		picker.setColumnValues(1, that.data.citys[value[0]]);
	},

	//选择城市
	chooseCity: function (e) {
		const { city, code } = safeGet(['currentTarget', 'dataset'], e)
		this.setData({
			auto: false,
			city,
		})

		appInstance.globalData.defaultCity = city
		wx.setStorageSync('city', city);
		wx.setStorageSync('is_city', 1);

		// 返回首页
		if (this.data.type == 1) {
			wx.reLaunch({ url: getIndexUrl() })
		} else if (this.data.type == 2) {
			wx.reLaunch({ url: '/pages/all_activity/index' })
		}
	},



	getLocation: function () {
		// console.log(commonMessage['location.city.getting'])
		wx.getLocation({
			type: 'wgs84',
			success: res => {
				this.getLocationFromGeoCoord(res)
			},
			fail: onFail(commonMessage['location.city.fail']),
		})
	},

	getLocationFromGeoCoord: function (geoCoord) {
		const { latitude, longitude } = geoCoord
		// console.log(getLocationUrl(latitude, longitude))
		wx.request({
			url: getLocationUrl(latitude, longitude),
			success: location => this.setCityCounty(location)
		})
	},

	setCityCounty: function (location) {
		const { city, adcode } = safeGet(['data', 'result', 'ad_info'], location)
		if (this.data.auto) { // 如果开始手动选择，以手动为准
			this.setData({
				city,
			})
			appInstance.globalData.defaultCity = city

		}
	},
	reGetLocation: function () {
		const { city } = this.data
		appInstance.globalData.defaultCity = city

		if (city != '定位中') {
			wx.setStorageSync('city', city);
			wx.setStorageSync('is_city', 1);
			//返回首页
			if (this.data.type == 1) {
				wx.reLaunch({ url: getIndexUrl() })
			} else if (this.data.type == 2) {
				wx.reLaunch({ url: '/pages/all_activity/index' })
			}
		} else {
			this.setData({
				showFlag: true,
			})
		}
	},


	delFlag: function () {
		this.setData({
			showFlag: false,
		})
	},

	//用户不允许时的提示,点击时去设置
	handler: function (e) {
		if (e.detail.authSetting["scope.userLocation"]) {
			this.setData({
				showFlag: false
			})
			wx.clearStorageSync('city');
			wx.setStorageSync('is_city', 1);
			//返回时重新刷新首页页面
			if (this.data.type == 1) {
				wx.reLaunch({
					url: '/pages/index/index'
				})
			} else if (this.data.type == 2) {
				wx.reLaunch({
					url: '/pages/all_activity/index'
				})
			}
		}
	},

	// 选择全国或是线上
	getLocationAll: function (e) {
		let text = e.currentTarget.dataset.city;
		// console.log(text);
		wx.setStorageSync('city', text);
		wx.setStorageSync('is_city', 1);
		//返回首页
		if (this.data.type == 1) {
			wx.reLaunch({ url: getIndexUrl() })
		} else if (this.data.type == 2) {
			wx.reLaunch({ url: '/pages/all_activity/index' })
		}
	},
})