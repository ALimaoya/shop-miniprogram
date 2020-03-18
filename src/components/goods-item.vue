<template>
    <view class="goods-item mb60" @click="turnTo(goodsParams.productId)">
        <view class="flex-column" v-if="!showRows">
            <view class="goods-img-wrap mb50">
                <img class="goods-img" :src="goodsParams.productImageUrl"/>
            </view>
            <view class="goods-title overflow mb20">{{goodsParams.productName}}</view>
            <view class="price-wrap">
                <view class="goods-price font12">¥{{goodsParams.productPrice}}</view>
                <view class="old-goods-price">¥{{goodsParams.lineationPrice}}</view>
            </view>
        </view>
        <view class="flex-row border-bottom" v-else>
            <view class="goods-img-wrap2">
                <img class="goods-img" :src="goodsParams.productImageUrl"/>
            </view>
            <view class="goods-info">
                <view class="goods-title2 overflow mb20">{{goodsParams.productName}}</view>
                <view class="goods-intro overflow mb30">{{goodsParams.summary?goodsParams.summary:''}}</view>
                <view class="price-wrap">
                    <view class="goods-price font14">¥{{goodsParams.productPrice}}</view>
                    <view class="old-goods-price">¥{{goodsParams.lineationPrice}}</view>
                </view>
            </view>
        </view>
    </view>
</template>

<script>
    export default {
        name: "goods-item",
        props: ['goodsParams','showRows'],
        methods: {
            turnTo (id) {
                uni.navigateTo({url: '/pages/goods/detail/index?id='+ id})
            }
        }

    }
</script>

<style scoped>
.flex-column{
    display: flex;
    flex-direction: column;
}
.flex-row{
    display: flex;
    flex-direction: row;
    padding: 0.8rem 0;
}
.goods-info{
    flex: 1
}
.border-bottom{
    border-bottom: 1px solid #eee;
}
    .goods-img-wrap{
        width: 100%;
        height: 0;
        padding-bottom: 100%;
        display: inline-block;
        position: relative;
    }
    .goods-img-wrap2{
        width: 25%;
        height: 0;
        padding-bottom: 25%;
        display: inline-block;
        position: relative;
        margin-right: 30rpx;
    }
    .goods-img {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
    }
    .goods-title{
        color: #333;
        font-size: 12px;
        text-align: left;
    }
    .goods-title2{
        font-size: 16px;
        color: #333;

    }
    .goods-intro{
        color: #999;
        font-size: 14px;

    }
    .price-wrap{
        display: flex;
        flex-direction: row;
        align-items: center;
    }
    .goods-price{
        color: #dd524d;
        margin-right: 12rpx;

    }
    .old-goods-price{
        text-decoration: line-through;
        font-size: 10px;
        color: #999;
    }
</style>
