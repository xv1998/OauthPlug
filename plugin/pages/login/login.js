// plugin/pages/login/login.js
import regeneratorRuntime from '../../utils/runtime' // eslint-disable-line
import { wxRequest } from '../../utils/wxApi'
import { api } from '../../utils/api'
import { showError } from '../../utils/error'


Page({

    /**
     * 页面的初始数据
     */
    data: {
        account: '',
        password: '',
        json: ''
    },
    async init() {
        let res = await this.getOauthData()
        this.setData({
            json: res
        })
        // console.log('login的json', this.data.json)
    },
    clearStorage() {
        let cookieA = wx.getStorageSync('cookieA')
        let cookieB = wx.getStorageSync('cookieB')
        if (cookieA) {
            wx.removeStorageSync('cookieA')
        }
        if (cookieB) {
            wx.removeStorageSync('cookieB')
        }
    },
    async getOauthData() {
        try {
            let res = await wxRequest({
                url: api.stu_getOauth,
                data: {
                    from: 'mini'
                },
                method: 'GET'
            })
            console.log('Oauth相关参数：', api.stu_getOauth, res)
            switch (res.data.code) {
                case '0':
                    break
                default:
                    console.log('获取Oauth信息失败,错误码:', res.data.code)
                    await showError('查询认证失败')
            }
            let stateKey
            let stateValue
            try {
                if (res.cookies[0].name && res.cookies[0].value) {
                    stateKey = res.cookies[0].name
                    stateValue = res.cookies[0].value
                    console.log('getOauthData success')
                }
            } catch (e) {
                console.log('获取认证接口认证失败：', e)
                await showError('查询认证失败')
            }
            wx.setStorageSync('cookieA', { stateKey: stateKey, stateValue: stateValue }
            )
            return {
                state: res.data.state,
                client_id: res.data.client_id,
                scope: res.data.scope,
                redirect_uri: res.data.redirect_uri
            }
        } catch (e) {
            console.log('查询认证失败：', e)
            await showError('查询认证失败')
        }
    },
    bindInput(e) {
        console.log(e)
        this.setData({
            [e.currentTarget.dataset.key]: e.detail.value
        })
    },
    // 账号密码登陆获取登陆接口cookie
    login: async function () {
        let that = this
        let options = {
            url: api.login,
            data: {
                'account': that.data.account,
                'password': that.data.password
            },
            method: 'POST'
        }
        try {
            let res = await wxRequest(options)
            console.log('登陆接口返回信息：', api.login, res)
            switch (res.data.code) {
                case '0':
                    break
                default:
                    console.log('Oauth登录失败,错误码:', res.data.code)
            }
            let oauthSessionKey
            let oauthSessionValue
            let data = JSON.stringify(that.data.json)
            try {
                if (res.cookies[0].name && res.cookies[0].value) {
                    oauthSessionKey = res.cookies[0].name
                    oauthSessionValue = res.cookies[0].value
                    console.log('login success')
                    wx.showToast({
                        title: '',
                        icon: 'success'
                    })
                }
            } catch (e) {
                await showError('登陆失败')
                console.log('获取session失败', e)
            }
            // 时效性，全局变量不持久，授权不需要这么久
            wx.setStorageSync(
                'cookieB',
                {
                    oauthSessionKey: oauthSessionKey,
                    oauthSessionValue: oauthSessionValue
                }
            )
            wx.navigateTo({
                url: 'plugin-private://wx8857da8633ee9964/pages/authorize/authorize?data=' + data
            })
        } catch (e) {
            await showError('登陆失败')
            console.log('Oauth请求失败：', e)
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.clearStorage()
        this.init()
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
    onShareAppMessage: function () {

    }
})