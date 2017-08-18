//selection.js
//获取应用实例
var util = require("../../utils/util");
var httpGet = require("../../utils/util");
var app = getApp();
Page({
    data: {
        activeId: null,
        indicatorDots: true,
        autoplay: true,
        interval: 5000,
        duration: 1000,
        bannerWidth: null,
        bannerHeight: null,
        hiddenLoadingDict: {},
        bannerDict: {},
        productDict: {}
    },
    onLoad: function () {
        var that = this
        //调用应用实例的方法获取全局数据
        var url = app.globalData.productUrl + "/v1/product/tag/list/of/selection";
        util.http(url, this.getTagList)
        util.windowWidth(this.getWindowWidth);
    },
    getTagList: function(data) { //获取标签列表list
        this.setData({
            tagList: data,
            activeId: data && data.length ? data[0].id : null
        })
        var bannerUrl = app.globalData.selectionUrl + "/v1/banner/list/of/tag?tagId=" + this.data.activeId,
            productUrl = app.globalData.productUrl + "/v1/product/tag/product/waterfall?tagId=" + this.data.activeId + "&nt=null";
        if(this.data.activeId) {
            util.http(bannerUrl, this.getBannerList);
            util.http(productUrl, this.getProduct);
        }
    },
    getBannerList: function(data) { //获取banner列表
        var bannerDict = {};
        bannerDict[this.data.activeId] = data;
        this.setData({
            bannerDict: Object.assign(bannerDict, this.data.bannerDict)
        })
    },
    getWindowWidth: function(data) {
        this.setData({
            bannerWidth: data + "px",
            bannerHeight: data * 9 / 16 - 1 + "px"
        })
    },
    getProduct: function(data){
        var productDict = this.data.productDict,
            activeId = this.data.activeId,
            productWaterfall,
            hiddenLoadingDict = this.data.hiddenLoadingDict;
        if(productDict[activeId]) {
            productWaterfall = {
                list: productDict[activeId].list.concat(data.list),
                nt: data.nt
            }
        } else {
            productWaterfall = {
                list: data.list,
                nt: data.nt
            }
        }
        this.setData({
            productDict: Object.assign(productDict, {[activeId]: productWaterfall}),
            hiddenLoadingDict: Object.assign(hiddenLoadingDict, {[activeId]: true})
        })
        console.log(this.data)
    },
    toggleTag: function(e) { //切换tag标签
        var id = e.target.id,
            bannerUrl = app.globalData.selectionUrl+"/v1/banner/list/of/tag?tagId="+id,
            productUrl = app.globalData.productUrl + "/v1/product/tag/product/waterfall?tagId=" + id + "&nt=null";
        this.setData({
            activeId: id
        })
        if(!this.data.bannerDict[this.data.activeId]) {
            util.http(bannerUrl, this.getBannerList);
            util.http(productUrl, this.getProduct)
        }
    },
    onReachBottom: function(e) { //上拉触底
        var activeId = this.data.activeId,
            nt = this.data.productDict[activeId].nt,
            productUrl = app.globalData.productUrl + "/v1/product/tag/product/waterfall?tagId=" + activeId + "&nt=" + nt;
        if(nt) {
            util.http(productUrl, this.getProduct)
        }
        // wx.showNavigationBarLoading();
    }
})