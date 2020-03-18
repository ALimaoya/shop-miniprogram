<template>
    <view class="shopCar">
        <view class="nav-bar">
            <view class="edit tl" @click="edit">{{isSum?'编辑':'完成'}}</view>
            <view class="nav-wrap">购物车</view>
            <view></view>
        </view>
        <scroll-view scroll-y class="list-wrap" @scrolltolower="getCart">
            <uni-swipe-action>
                <uni-swipe-action-item class="goods-wrap" v-for="(item,index) in goodsList" :options="options" :key="item.id" @change="swipeChange" @click="swipeClick($event,index)">
                        <radio class="radio" style="transform:scale(0.7)" @click="handleCheck(index)" color="#dd524d" :value="goodsList[index].checked" :checked="goodsList[index].checked" />
                        <view class="goods">
                        <img :src="item.productImageUrl" />
                        <view class="goods-info">
                            <view class="goods-title">{{item.productName}}</view>
                            <view class="goods-spec">{{item.spec}}</view>
                            <view class="space-between">
                                <view class="goods-price">¥{{item.productPrice}}</view>
                                <uni-number-box :min="1" :max="item.stock" :value="item.quantity" @change="change" />
                            </view>
                        </view>
                    </view>
                </uni-swipe-action-item>
            </uni-swipe-action>
        </scroll-view>
        <view class="bottom space-between">
            <view class="check-wrap">
                <radio class="radio" style="transform:scale(0.7)" color="#dd524d" :value="isAll" @click="handleAllChoose" :checked="isAll" />
                <view class="mr30" v-if=" !cartList.length" @click="handleAllChoose">全选</view>
                <view v-else>已选（{{cartList.length}}）</view>
            </view>
            <view class="total-wrap" v-if="isSum">
                <view>合计</view>
                <view class="total-price">¥{{totalMoney}}</view>
                <view  class="sum-btn" :class="{'active':cartList.length}">去结算</view>
            </view>
            <view v-else class="delete-btn" :class="{'active':cartList.length}"  @click="handleAllDelete">删除所选</view>
        </view>
    </view>
</template>

<script>
    import uniSwipeAction from '@/components/uni-swipe-action/uni-swipe-action.vue'
    import uniSwipeActionItem from '@/components/uni-swipe-action-item/uni-swipe-action-item.vue'
    import uniNumberBox from '@/components/uni-number-box/uni-number-box.vue'
    import network from '@/common/network';

    export default {
        name: "shopCar",
        components: {
            uniSwipeAction,
            uniSwipeActionItem,
            uniNumberBox
        },
        data () {
            return {
                options: [{
                    text: '删除',
                    style: {
                        backgroundColor: '#dd524d'
                    }
                }],
                goodsList: [],
                cartList: [],
                currentPage: 1,
                isSum: true,
                totalMoney: '0.00',
                isAll: false,
                cartListStr: ''
            }
        },
        mounted() {
            this.getCart();
        },
        methods: {
            getCart () {
                var that = this;
                network._get({
                    url : '/shopping/cart/list?currentPage=' + that.currentPage,
                    success: function (response) {
                        if (response.data.code == '000000') {
                            if (that.currentPage == 1) {
                                that.goodsList = response.data.data;
                            } else {
                                that.goodsList = that.goodsList.concat(response.data.data);
                            }
                            that.currentPage ++;
                        }
                    }
                });
            },
            edit () {
                this.isSum = !this.isSum;
            },
            change (e) {
                console.log(e);
            },
            swipeChange(e) {
                console.log('返回：', e);
            },
            swipeClick(e, index) {
                let {content} = e;
                if (content.text === '删除') {
                    uni.showModal({
                        title: '提示',
                        content: '是否删除',
                        success: (res) => {
                            if (res.confirm) {
                                this.goodsList.splice(index, 1)
                            } else if (res.cancel) {
                                console.log('用户点击取消');
                            }
                        }
                    });
                }

            },
            handleCheck (index) {
                this.goodsList[index].checked = !this.goodsList[index].checked;
                let arr  = [];
                this.goodsList.map( item => {
                    if (item.checked) {
                        arr.push({
                            productSpecId: item.productSpecId,
                            quantity: item.quantity
                        })
                    }
                });

                this.cartList = [...arr];
                console.log(this.cartList);
                this.cartListStr = JSON.stringify(this.cartList)

            },
            handleAllChoose () {
                this.isAll = !this.isAll;
                this.cartList = [];
                if (this.isAll) {
                    this.goodsList.map( item => {
                        item.checked = true;
                        this.cartList.push(
                            {
                                productSpecId:item.productSpecId,
                                quantity: item.quantity
                            }
                        )
                    })
                } else {
                    this.goodsList.map( item => {
                        item.checked = false;
                    })
                }
                console.log(this.cartList);
                this.cartListStr = JSON.stringify(this.cartList)

            },
            handleAllDelete () {

            }
        },

        watch: {
            cartListStr: function (newVal) {
                var that = this;
                let val = [];
                if (newVal) {
                    val = JSON.parse(newVal);
                    if (val && val.length) {
                        network._post({
                            url : '/order/amount/calculate' ,
                            data: {
                                productSpecQuantityList: [...val]
                            },
                            success: function (res) {
                                if (res.data.code == '000000') {
                                    that.totalMoney = res.data.data;
                                }
                            }
                        });
                    } else {
                        that.totalMoney = '0.00';
                    }
                } else {
                    that.totalMoney = '0.00';

                }

            }
        }
    }
</script>

<style scoped lang="scss">
    $status-height: var(--status-bar-height);
    .nav-bar{
        width: 100%;
        height: 80rpx;
        position: fixed;
        top: var(--status-bar-height);
        left: 0;
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        box-sizing: border-box;
        z-index: 100;
        transform: translateZ(0);
    }
    .nav-bar view{
        flex: 1;
        text-align: center;
    }
    .list-wrap{
        position: fixed;
        top: 65px;
    }
    .goods-wrap{
        box-sizing: border-box;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: center;

    }
    .goods{
        padding: 20rpx;
        border-bottom: 1px solid #e0e0e0;
        display: flex;
        flex-direction: row;
        justify-content: flex-start;
        flex: 1;
        margin-right: 20rpx;

    }
    .radio{
        padding: 0 10rpx 0 20rpx;
        margin: auto;
    }
    .goods img{
        width: 150rpx;
        height: 150rpx;
        margin-right: 20rpx;
    }
    .goods-info{
        display: flex;
        flex-direction: column;
        flex: 1;
    }
    .goods-title{
        font-size: 16px;
        color: #333;
        line-height: 1.5;
    }
    .goods-spec{
        font-size: 14px;
        background: #e0e0e0;
        color: #999;
        line-height: 2;
        padding: 0 15rpx;
        border-radius: 3rpx;
    }
    .goods-price,.total-price{
        font-size: 16px;
        color: $price-color;
    }
    .bottom{
        width: 100%;
        height: 100rpx;
        position: fixed;
        bottom: 0;
        background: #fff;
        border-top: 1px solid #dedede;

    }
    .bottom .radio{
        padding-right: 5rpx;
    }
    .check-wrap{
        padding: 20rpx;
        display: flex;
        flex-direction: row;
        align-items: center;
        font-size: 16px;
    }
    .total-wrap{
        font-size: 14px;
        color: #666;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-end;
    }
    .sum-btn,.delete-btn{
        background: #c8c7cc;
        color: #fff;
        font-size: 16px;
        text-align: center;
        height: 100%;
        line-height: 100rpx;
        width: 180rpx;
        margin-left: 50rpx;
    }
    .active{
        background: #ff082d!important;
    }
</style>
