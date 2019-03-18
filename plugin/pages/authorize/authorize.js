// plugin/pages/authorize/authorize.js
import regeneratorRuntime from '../../utils/runtime' // eslint-disable-line
import { wxRequest } from '../../utils/wxApi'
import { api } from '../../utils/api'
import { showError } from '../../utils/error'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        OauthJson: '',
        skey: '',
        authorization_code: ''
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let res = JSON.parse(options.data)
        this.setData({
            OauthJson: res
        })
    },
    // 授权函数，获取授权码
    authorize: async function () {
        try {
            let that = this
            let json = this.data.OauthJson
            let oauthSession = wx.getStorageSync('cookieB')
            console.log('oauthSession', oauthSession)
            if (oauthSession) {
                let res = await wxRequest({
                    url: api.authorize,
                    data: {
                        'response_type': 'code',
                        'client_id': json.client_id,
                        'state': json.state,
                        'scope': json.scope,
                        'from': 'mini'
                    },
                    header: { cookie: `${oauthSession.oauthSessionKey}=${oauthSession.oauthSessionValue}` },
                    method: 'GET'
                })
                console.log(api.authorize, res)
                switch (res.data.code) {
                    case '0':
                        this.setData({
                            authorization_code: res.data.authorization_code
                        })
                        break
                    default:
                        await showError('授权失败')
                        console.log('授权失败:错误码:', res.data.code)
                }
                if (this.data.authorization_code) {
                    let key = await this.getSkey(that.data.authorization_code, json.redirect_uri, json.state)
                    console.log('skey', key)
                    if (key) {
                        let json = JSON.stringify(that.data.OauthJson)
                        that.setData({
                            skey: key.skey
                        })
                        wx.showToast({
                            title: '',
                            icon: 'success'
                        })
                        wx.navigateTo({
                            url: 'plugin-private://wx8857da8633ee9964/pages/info/info?json=' + json + '&skey=' + this.data.skey
                        })
                    } else {
                        await showError('授权失败')
                    }
                }
            }
        } catch (e) {
            await showError('授权失败')
            console.log('授权失败', e)
        }
    },
    // 重定向url 获得skey
    getSkey: async function (code, redirect_uri, state) {
        try {
            let cookieA = wx.getStorageSync('cookieA')
            let res = await wxRequest({
                url: redirect_uri,
                method: 'GET',
                data: {
                    code: code,
                    state: state,
                    from: 'mini'
                },
                header: { cookie: `${cookieA.stateKey}=${cookieA.stateValue}` },
            })
            if (res.data.code === '0') {
                return {
                    skey: res.data.skey,
                    refresh_key: res.data.refresh_key
                }
            }
            else {
                await showError('授权失败')
            }
        } catch (e) {
            await showError('授权失败')
            console.log('获取skey失败：', e)
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

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})