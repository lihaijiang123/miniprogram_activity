//app.js
App({
    onLaunch: function() {
        // 展示本地存储能力
        var logs = wx.getStorageSync('logs') || []
        logs.unshift(Date.now())
        wx.setStorageSync('logs', logs)
    },

	getOpenid: function () {
		var that = this;
		return new Promise(function (resolve, reject) {
			// 登录
			wx.login({
				success: res => {
					// 发送 res.code 到后台换取 openId, sessionKey, unionId
					wx.request({
						url: 'https://relclothing.fuyouhome.top/login',
						data: {
							code: res.code
						},
						success: function (res) {
							// console.log(res);
							wx.setStorageSync('user_id', res.data.data.user.user_id);
							wx.setStorageSync('session_key', res.data.data.session_key);
							if (res.data.data.user.avatarUrl) {
								let obj = {
									avatarUrl: res.data.data.user.avatarUrl,
									nickName: res.data.data.user.nickName
								}
								wx.setStorageSync('userInfo', JSON.stringify(obj))
							}
							resolve(res);
						}
					})
				}
			})
		});
	},

    globalData: {
        userInfo: null,
		defaultCity: '',
		defaultCounty: '',

		dev_api: 'http://relclothing.fuyouhome.top',
    }
})