<template>
    <view class="content">
        <view class="status_bar"></view>
        <search-bar placeholder="搜索商品" :cancelButton="false" :radius="5"></search-bar>
        <view class="category-wrap">
            <view class="category-list">
                <view :class="['category-name',{'active':target==item.id}]" v-for="(item,index) in categoryList" :key="index" @click="getCategory(item.id)">{{item.name}}</view>
            </view>
            <view class="category-content-wrap">
                <img class="mainImg" :src="mainImg"/>
                <ul class="category-content">
                    <li v-for="(item,index) in subCategory" :key="index" @click="turnToPage(item.id)">
                        <view class="img-wrap">
                            <image class="category-img" mode="aspectFit" :src="item.imageUrl"></image>
                        </view>
                        <view class="category-title">{{item.name}}</view>
                    </li>
                </ul>
            </view>
        </view>
    </view>
</template>

<script>
    import searchBar from "../../components/uni-search-bar/uni-search-bar";
    import network from '@/common/network';

    export default {
        components:{
            searchBar
        },
        data() {
            return {
                categoryList: [],
                subCategory: [],
                mainImg: '',
                target: 0,
            }
        },
        onLoad() {

        },
        created () {
            var that = this;
            network._get({
                url : '/anon/category/list',
                success: function (response) {
                    if (response.data.code == '000000') {
                        that.categoryList = response.data.data;
                        that.mainImg = that.categoryList[0].imageUrl;
                        that.getCategory(that.categoryList[0].id);
                    }
                }
            });
        },
        methods: {
            getCategory (id) {
                var that = this;
                this.target = id;
                network._get({
                    url : '/anon/category/list?categoryId='+ id,
                    success: function (response) {
                        if (response.data.code == '000000') {
                            that.subCategory = response.data.data;
                        }
                    }
                });
            },
            turnToPage (id) {
                uni.navigateTo( { url: '/pages/goods/goodsList/index?id='+id + '&showCategory=true&navTitle=精选推荐&categoryId=' + this.target});
            }
        }
    }
</script>

<style>
    .content{
        height: 100vh;
        overflow: hidden;
        display: flex;
        flex-direction: column;
    }
    .category-wrap{
        margin-top: 5rpx;
        overflow: hidden;
        width: 100%;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        box-sizing: border-box;
        flex: 1;
    }
    .category-list{
        width: 80px;
        height: 100%;
        overflow: auto;
        display: flex;
        flex-direction: column;
        background: #f1f1f1;
    }
    .category-list view{
        display: inline-block;
        width: 100%;
        height: 40px;
        line-height: 40px;
        color: #999;
        text-align: center;
        font-size: 12px;
    }
    .category-content-wrap{
        flex:1;
        padding: 10px;
        box-sizing: border-box;
        overflow: hidden;
    }
    .category-content{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        overflow: auto;
        height: fit-content;
    }
    .mainImg{
        width: 95%;
        height: 90px;
        display: block;
        margin: 20rpx auto 30rpx;
        border-radius: 7rpx;
    }
    .category-content li{
        display: flex;
        width: 33%;
        flex-direction: column;
        padding-bottom: 20px;
    }
    .active{
        color: #dd524d!important;
        font-weight: bold;
        position: relative;
        background: #fff;
    }
    .active::before{
        border-left: 5px solid #dd534d;
        width: 0;
        height: 20px;
        content: '';
        position: absolute;
        top: 0;
        bottom: 0;
        margin: auto;
        left: 0;
    }
    .img-wrap{
        width: 100%;
        height: 120rpx;
        margin-bottom: 10rpx;
    }
    .category-img{
        width: 85%;
        max-height: 100%;
        display: block;
        margin: auto;
    }
    .category-title{
        text-align: center;
        color: #666;
        font-size: 12px;
        display: inline-block;
    }
</style>
