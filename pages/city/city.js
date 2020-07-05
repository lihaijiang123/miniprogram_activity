import { LETTERS, HOT_CITY_LIST } from '../../locale/citydata'
import { commonMessage } from '../../locale/commonMessageZhCn'
import { AutoPredictor } from '../../utils/autoPredictor'
import utils from '../../utils/utils'

const {
	isNotEmpty,
	safeGet,
	getCityListSortedByInitialLetter,
	getLocationUrl,
	getCountyListUrl,
	getIndexUrl,
	onFail,
} = utils;
const appInstance = getApp();

Page({
	data: {
		sideBarLetterList: [],
		winHeight: 0,
		cityList: [],
		hotCityList: HOT_CITY_LIST,
		hotCountryList: [{ cityCode: 110000, city: '美国' }, { cityCode: 310000, city: '日本' }, { cityCode: 440100, city: '英国' }, { cityCode: 440300, city: '马来西亚' }, { cityCode: 310000, city: '日本' }, { cityCode: 440100, city: '英国' }, { cityCode: 440300, city: '马来西亚' }, { cityCode: 310000, city: '日本' }, { cityCode: 440100, city: '英国' }, { cityCode: 440300, city: '马来西亚' }],
		showChosenLetterToast: false,
		scrollTop: 0,//置顶高度
		scrollTopId: '',//置顶id
		city: commonMessage['location.getting'],
		currentCityCode: '',
		inputName: '',
		completeList: [],
		county: '',
		showCountyPicker: false,
		auto: true, // 自动手动定位开关
		showFlag: false,

		type: 0,
	},
	onLoad: function (options) {
		this.setData({
			type: options.type
		})

		// 生命周期函数--监听页面加载
		const cityListSortedByInitialLetter = getCityListSortedByInitialLetter();
		const sysInfo = wx.getSystemInfoSync();
		const winHeight = sysInfo.windowHeight;
		const sideBarLetterList = LETTERS.map(letter => ({ name: letter }));
		this.setData({
			winHeight,
			sideBarLetterList,
			cityList: cityListSortedByInitialLetter
		});
		// 定位
		this.getLocation();
	},

	touchSideBarLetter: function (e) {
		const chosenLetter = safeGet(['currentTarget', 'dataset', 'letter'], e)
		this.setData({
			toastShowLetter: chosenLetter,
			showChosenLetterToast: true,
			scrollTopId: chosenLetter,
		})
		// close toast of chosenLetter
		setTimeout(() => { this.setData({ showChosenLetterToast: false }) }, 500)
	},
	//选择城市
	chooseCity: function (e) {
		const { city, code } = safeGet(['currentTarget', 'dataset'], e)
		this.setData({
			auto: false,
			// showCountyPicker: true,
			city,
			currentCityCode: code,
			scrollTop: 0,
			completeList: [],
			county: ''
		})
		// this.getCountyList()

		appInstance.globalData.defaultCity = city
		appInstance.globalData.defaultCounty = ''
		wx.setStorageSync('city', city);
		wx.setStorageSync('is_city', 1);

		// 返回首页
		if (this.data.type == 1) {
			wx.reLaunch({ url: getIndexUrl() })
		} else if (this.data.type == 2) {
			wx.reLaunch({ url: '/pages/all_activity/index' })
		}
	},

	chooseCounty: function (e) {
		const county = safeGet(['currentTarget', 'dataset', 'city'], e)
		this.setData({ county })
		appInstance.globalData.defaultCounty = county
		// 返回首页
		if (this.data.type == 1) {
			wx.reLaunch({ url: getIndexUrl() })
		}else if (this.data.type == 2) {
			wx.reLaunch({ url: '/pages/all_activity/index' })
		}
	},

	//点击热门城市回到顶部
	hotCity: function () {
		this.setData({ scrollTop: 0 })
	},
	bindScroll: function (e) {
		// console.log(e.detail)
	},
	getCountyList: function () {
		console.log(commonMessage['location.county.getting']);
		const code = this.data.currentCityCode

		wx.request({
			url: getCountyListUrl(code),
			success: res => this.setCountyList(res),
			fail: onFail(commonMessage['location.county.fail']),
		})
	},

	setCountyList: function (res) {
		const resultArray = safeGet(['data', 'result'], res)
		const countyList = isNotEmpty(resultArray) ? resultArray[0] : []
		this.setData({ countyList })
	},

	getLocation: function () {
		// console.log(commonMessage['location.city.getting'])
		this.setData({ county: '' })
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
		const { city, adcode, district } = safeGet(['data', 'result', 'ad_info'], location)
		if (this.data.auto) { // 如果开始手动选择，以手动为准
			this.setData({
				city,
				currentCityCode: adcode,
				county: district
			})
			appInstance.globalData.defaultCity = city
			// this.getCountyList();
		}
	},
	reGetLocation: function () {
		const { city, county } = this.data
		appInstance.globalData.defaultCity = city
		appInstance.globalData.defaultCounty = county
		// console.log(appInstance.globalData.defaultCity);
		// console.log(city);
		if (city != '定位中') {
			wx.setStorageSync('city', city);
			wx.setStorageSync('is_city', 1);
			//返回首页
			if (this.data.type == 1) {
				wx.reLaunch({ url: getIndexUrl() })
			} else if (this.data.type == 2) {
				wx.reLaunch({ url: '/pages/all_activity/index' })
			}
		}else {
			this.setData({
				showFlag: true,
			})
		}
	},
	// 失焦时清空输入框
	bindBlur: function (e) {
		this.setData({
			inputName: '',
			completeList: []
		})
	},
	// 输入框输入时
	bindKeyInput: function (e) {
		let inputName = e.detail.value.trim()
		this.setData({ inputName })
		if (!inputName) {
			this.setData({ completeList: [] })
		}
		this.useAutoPredictor(inputName)
	},
	// 输入框自动联想搜索
	useAutoPredictor: function (content) {
		let autoPredictor = new AutoPredictor(content)
		let completeList = autoPredictor.associativeSearch()
		this.setData({ completeList })
	},

	onShow: function () {
		let is_city = wx.getStorageSync('is_city');
		if (!is_city || is_city == 2) {
			let that = this;
			setTimeout(() => {
				that.setData({
					showFlag: true,
				})
			}, 1000)
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