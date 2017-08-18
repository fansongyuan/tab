function formatTime(date) {
    var year = date.getFullYear()
    var month = date.getMonth() + 1
    var day = date.getDate()

    var hour = date.getHours()
    var minute = date.getMinutes()
    var second = date.getSeconds()


    return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
    n = n.toString()
    return n[1] ? n : '0' + n
}

function http(url, callBack) {
    wx.request({
        url: url,
        method: 'GET',
        header: {
            "Content-Type": "json"
        },
        success: function (res) {
            callBack(res.data.data);
        },
        fail: function (error) {
            console.log(error)
        }
    })
}

function windowWidth(callback) {
    wx.getSystemInfo({
        success: function(res) {
            callback(res.windowWidth)
        }
    })
}

function getImageInfo(src, callback) {
    wx.getImageInfo({
        src: src,
        success: function (res) {
            callback(res);
        }
    })
}

module.exports = {
    formatTime: formatTime,
    http: http,
    windowWidth: windowWidth,
    gteImageInfo: getImageInfo
}
