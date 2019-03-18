let plugin = requirePlugin('myPlugin')

Page({
    onLoad: function () {
        wx.navigateTo({
            url: 'plugin-private://wx8857da8633ee9964/pages/login/login'
        })
    }
})