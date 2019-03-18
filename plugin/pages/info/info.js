// plugin/pages/info/info.js
import regeneratorRuntime from '../../utils/runtime' // eslint-disable-line
import { wxRequest } from '../../utils/wxApi'
import { api } from '../../utils/api'
import { showError } from '../../utils/error'

Page({

    /**
     * 页面的初始数据
     */
    data: {
        json: '',
        skey: '',
        info: '',
        reply: true
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        let res = JSON.parse(options.json)
        let key = options.skey
        this.setData({
            json: res,
            skey: key
        })
        // console.log('jsonINfo:', this.data.json)
    },
    getUserInfo: async function () {
        try {
            let res = await wxRequest({
                url: api.user_info,
                method: 'POST',
                header: {
                    skey: this.data.skey
                }
            })
            if (res.data.code === '0') {
                this.setData({
                    reply: false,
                    info: res.data.user_info
                })
            }
        } catch (e) {
            await showError('信息获取失败')
            console.log('获取用户信息失败:', e)
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