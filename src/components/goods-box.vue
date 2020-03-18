<template>
    <view class="goods-box">
        <view class="title-wrap">
            <view class="title">{{title}}</view>
            <view class="more-btn" v-if="showMore" @click="goMore">更多></view>
        </view>
        <img class="main-img" :src="mainImg"/>
        <view class="goods-wrap">
            <goods-item v-for="(item,index) in goodsList" :key="index" :goodsParams="item"></goods-item>
        </view>
    </view>
</template>

<script>
    import goodsItem from './goods-item.vue';
    export default {
        name: "goods-box",
        components: {goodsItem},
        props: ['showMore','title','url','mainImg','goodsList'],
        data () {
            return {

            }
        },
        methods: {
            goMore () {
                this.$route.push(url);
            }
        }
    }
</script>

<style scoped>
.goods-box{
    padding: 10px 40rpx ;
    box-sizing: border-box;
    background: #fff;
    position: relative;
}
.goods-box::after{
    position: absolute;
    bottom: 0;
    left: 0;
    content:'';
    width: 100%;
    background: #eee;
    height: 5px;
    display: block;
}
    .title-wrap{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        height: 20px;
        margin-bottom: 20rpx;
    }
    .title{
        font-size: 14px;
        font-weight: bold;
    }
    .more-btn{
        font-size: 12px;
        color: #666;
    }
    .main-img{
        width: 100%;
        height: 100px;
        margin-bottom: 7px;
    }
    .goods-wrap{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: flex-start;
    }
    goods-item{
        width: 31%;
        margin-right: 2%;
    }
</style>
