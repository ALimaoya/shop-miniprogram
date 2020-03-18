<template>
    <view class="goods-detail">
        <cover-view class="status_bar">
            <!-- 这里是状态栏 -->
        </cover-view>
        <view class="nav-bar" v-if="!scrollStatus">
            <view class="iconfont icon-biaoqing" @click="back"></view>
                <view v-if="provider!== 'weixin' && provider !== 'alipay'">
                    <view class="iconfont icon-zhuye"></view>
                    <view class="iconfont icon-fenxiang"></view>
                </view>
        </view>
        <view class="nav-bar2" v-else>
            <view class="iconfont icon-biaoqing" @click="back"></view>
            <view class="nav-wrap">
                <view :class="[target==index?'active':'','nav-item']" v-for="(item,index) in navList" :key="index" @click="changeType(index)">{{item}}</view>
            </view>
                <view v-if="provider!== 'weixin' && provider !== 'alipay'">
                    <view class="iconfont icon-zhuye"></view>
                    <view class="iconfont icon-fenxiang"></view>
                </view>
        </view>
        <uni-goods-nav :options="options" @click="onClick" @buttonClick="buttonClick"/>
        <view id="top">
        <swiper class="swiper" circular :indicator-dots="true" :autoplay="true" interval="3000">
            <swiper-item v-for="(item,index) in goods.productImageVOS" :key="index" >
                    <image  class="goods-image" :src="item.imageUrl"></image>
            </swiper-item>
        </swiper>
        <view class="goods-info-wrap">
            <view class="goods-title">{{goods.name}}</view>
            <view class="goods-intro">{{goods.summary}}</view>
            <view class="goods-price">¥{{goods.price}}</view>
        </view>
        <view class="border"></view>
        <view class="specs-wrap" @click="togglePopup">
            <view v-if="!goodsSpecs">请选择规格数量</view>
            <view class="spec-detail" v-else>已选：{{specTxt}} x {{goodsNum}}</view>
            <view class="iconfont icon-jiantou1"></view>
        </view>
        <view class="border">
        </view>
        </view>
        <rich-text :selectable="true" class="rich-text" :nodes="goods.description"></rich-text>
<!--        <uni-popup ref="popup" type="center" @change="handleClose">-->

<!--        </uni-popup>-->
        <uni-popup class="uni-popup" ref="popup" type="bottom">
            <view class="pop-wrap">
                <i class="iconfont"></i>
                <scroll-view scroll-y class="pop-content">
                    <view class="main-info">
                        <img :src="specTarget.specImageUrl"/>
                        <view class="info-wrap">
                            <view class="info-item"><view>价格：</view><view class="price-color">¥{{specTarget.price}}</view></view>
                            <view class="info-item"><view>库存：</view><view>{{specTarget.stock}}</view></view>
                        </view>
                    </view>
                    <view class="sepc-wrap" v-for="(item,index) in goods.specNameValueVOS" :key="index">
                        <text class="label">{{item.name}}</text>
                        <view>
                            <span v-for="(subItem,i) in item.values" :key="i" :class="[specId[index]==subItem.id?'price-active':'','spec-item']" @click="chooseSpecs(subItem,index)">{{subItem.value}}</span>
                        </view>
                    </view>
                    <view class="num-btn-wrap">
                        <text class="label">数量</text>
                        <view class="num-btn">
                            <view :class="{'disabled':goodsNum<=1}" class="btn" @click="subNum">-</view>
                            <input type="number" @blur="getNum" v-model="goodsNum" class="goods-num"/>
                            <view :class="{'disabled':goodsNum>=stockNum}" class="btn" @click="addNum">+</view>
                        </view>
                    </view>
                </scroll-view>
                <text class="check-btn" @click="handleChoose">确定</text>
            </view>
        </uni-popup>
    </view>
</template>

<script>
    import uniGoodsNav from '@/components/uni-goods-nav/uni-goods-nav.vue'
    import uniPopup from '@/components/uni-popup/uni-popup.vue'

    import network from '@/common/network';

    export default {
        name: "goods-detail",
        components: {
            uniGoodsNav,
            uniPopup
        },
        data () {
          return {
              id: '',
              provider: '',
              scrollStatus: false,
              navList: ['商品','详情'],
              target: 0,
              options: [
                  {
                      icon: 'https://img-cdn-qiniu.dcloud.net.cn/uniapp/uni-ui/goodsnav/carts.png',
                      text: '购物车'
                  }
              ],
              goods: {},
              goodsSpecs: '',
              specTxt: '',
              specTarget: {
                  price: '',
                  stock: 0,
              },
              specId: [],
              specVal: [],
              goodsNum: 1,
          }
        },
        onLoad: function (option) {
            this.id = option.id?option.id:'';
            this.getDetail();

        },
        onPageScroll (e) {
            if ( e.scrollTop > 70) {
                this.scrollStatus = true;
            }else {
                this.scrollStatus = false;
            }
        },
        created() {
            this.provider = getApp().globalData.provider;

        },
        methods: {
            getDetail () {
                let that = this;
                network._get({
                    url : '/product/detail/'+ that.id ,
                    success: function (response) {
                        if (response.data.code == '000000') {
                            that.goods = response.data.data;
                            that.goods.description = that.goods.description.replace(/\<img/gi,'<img class="rich-img"' );
                            that.specTarget.specImageUrl = that.goods.productImageVOS[0].imageUrl;
                            that.specTarget.price = that.goods.price;
                            that.goods.specNameValueVOS.map(item => {
                                that.specId.push('');
                            })
                        }
                    },
                    fail(err) {
                        console.log(err)
                    }
                });
            },
            togglePopup() {
                this.$nextTick(() => {
                    this.$refs.popup.open();

                })
            },
            chooseSpecs (item,i) {
                this.specId[i] = item.id;
                this.specVal[i] = item.value;
                this.specTxt = this.specVal.join(',');
                console.log(this.specTxt);
                let spec = this.specId.join('|');
                this.goods.productSpecVOS.map(item => {
                    if (item.spec == spec) {
                        this.specTarget = {...item};
                    }
                })
            },
            handleChoose () {
                if (this.specTarget.id && this.goodsNum) {
                    this.goodsSpecs = {
                        "productSpecId": this.specTarget.id,
                        "quantity":this.goodsNum
                    }
                } else {
                    this.goodsSpecs = '';
                }

                this.handleClose();
            },
            handleClose () {

                this.$refs['popup'].close()
            },
            subNum () {
                if (this.goodsNum>1) {
                    this.goodsNum --;
                } else {
                    uni.showToast({
                        title: '不能再减了哦～',
                        duration: 1000,
                        icon: "none"
                    })
                }
            },
            addNum () {
                if (this.goodsNum<this.specTarget.stock) {
                    this.goodsNum++;
                } else {
                    uni.showToast({
                        title: '不能再加了哦～',
                        duration: 1000,
                        icon: "none"

                    })
                }
                console.log(this.goodsNum)
            },
            getNum (e) {
                let value = e.target.value;
                if (value>0 && value <=this.stockNum) {
                    this.goodsNum = value;
                } else if (value <1){
                    this.goodsNum = 1;
                }else if (value > this.stockNum) {
                    this.goodsNum = this.stockNum;
                }
            },
            onClick (e) {

            },
            buttonClick (e){
                console.log(e);
                var that = this;
                if (this.specTarget.id && this.goodsNum) {
                    switch (e.index) {
                        case 0: {
                            network._post({
                                url: '/shopping/cart/add',
                                data: {
                                    ...that.goodsSpecs
                                },
                                success: function (response) {
                                    if (response.data.code == '000000') {
                                        uni.showToast({
                                            title: '商品已成功添加到购物车',
                                            icon: 'none',
                                            duration: 1500
                                        })
                                    }
                                }
                            })
                            break;
                        }
                        case 1: {

                            break;
                        }
                    }
                } else {
                    uni.showToast({
                        title: '请选择商品规格及数量',
                        icon: 'none',
                        duration: 1500
                    })
                }
            },
            changeType (index) {
                this.target = index;
                if(index == 0) {
                    uni.pageScrollTo({
                        scrollTop: 0,
                        duration: 300
                    });
                } else {
                    const query = uni.createSelectorQuery();
                    query.select('#top').boundingClientRect(data => {
                        uni.pageScrollTo({
                            scrollTop: data.height,
                            duration: 300
                        });
                    }).exec();

                }

            },
            back () {
                uni.navigateBack({ delta: -1 })
            },
            moveHandle () {
                return ;
            }
        }
    }
</script>

<style scoped lang="scss">
    .status_bar {
        height: var(--status-bar-height);
        width: 100%;
        background: #fff;
        z-index: 1000;
    }
    .nav-bar,.nav-bar2{
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
    .nav-bar .iconfont{
        border-radius: 50%;
        background: rgba(0,0,0,0.3);
        width: 70rpx;
        height: 70rpx;
        line-height: 70rpx;
        font-size: 26px;
        text-align: center;
        color: #fff;
    }
    .nav-bar2{
        background: #fff;
        padding-bottom: 10rpx;
        border-bottom: 1px solid #ccc;

    }
    .nav-bar2 .iconfont{
        width: 70rpx;
        height: 70rpx;
        line-height: 70rpx;
        font-size: 26px;
        text-align: center;
        color: #aaa;
        position: relative;
    }
    .nav-wrap{
        display: flex;
        flex-direction: row;
        border: 1px solid #ddd;
        border-radius: 3px;
        position: absolute;
        left: 0;
        right: 0;
        top: 0;
        bottom: 0;
        margin: auto;
        width: fit-content;
        height: fit-content;
    }
    .nav-item{
        font-size: 14px;
        color: #333;
        width: 120rpx;
        height: 60rpx;
        line-height: 60rpx;
        border-right:1px solid #ddd;
        text-align: center;
    }
    .active{
        background: $theme-color;
        color: #fff;
        border-right:1px solid $theme-color;

    }
    .nav-item:nth-last-child(1){
        border-right: 0;
    }
    .swiper,.goods-image{
        width: 100%;
        height: 720rpx;
    }
    .goods-info-wrap{
        display: flex;
        flex-direction: column;
        padding: 20rpx 30rpx;
        box-sizing: border-box;
    }
    .goods-title{
        font-size: 20px;
        color: #333;
        line-height: 2;
    }
    .goods-intro{
        font-size: 16px;
        color: #999;
        margin-bottom: 30rpx;
    }
    .goods-price{
        color: $price-color;
        font-size: 22px;
        font-weight: bold;
    }
    .specs-wrap{
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0 30rpx;
        box-sizing: border-box;
        font-size: 16px;
        color: #333;
    }
    .icon-jiantou1{
        color: #dedede;
    }
    .pop-wrap{
        height: 800rpx;
        overflow: hidden;
    }
    .pop-content{
        padding: 30rpx 30rpx 130rpx;
        box-sizing: border-box;
        width: 100%;
        background: #fff;
        overflow-y: scroll;
       // height: fit-content;
    }
    .main-info{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        margin-bottom: 40rpx;
    }
    .main-info img {
        width: 160rpx;
        height: 160rpx;
        margin-right: 20rpx;
    }
    .info-wrap{
        display: flex;
        flex-direction: column;
        color: #333;
        font-size: 16px;
        flex: 1;
    }
    .info-item{
        display: flex;
        flex-direction: row;
        align-items: center;

    }
    .price-color{
        color: $price-color;

    }
    .sepc-wrap,.num-btn-wrap{
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        margin-bottom: 30rpx;
    }
    .label{
        color: #999;
        font-size: 14px;
        margin-bottom: 20rpx;
    }
    .sepc-wrap view{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .spec-item{
        text-align: center;
        padding: 0 20rpx;
        height: 60rpx;
        line-height: 60rpx;
        border-radius: 3px;
        border: 1px solid #aaa;
        margin-right: 20rpx;
        color: #333;
        font-size: 14px;
    }
    .price-active{
        border-color: #dd524d;
        color: #dd524d;
    }
    .num-btn{
        display: flex;
        flex-direction: row;
    }
    .num-btn view{
        width: 60rpx;
        height: 60rpx;
        line-height: 60rpx;
        text-align: center;
        font-size: 16px;
        border: 1px solid #c8c7cc;
    }
    .num-btn input{
        width: 80rpx;
        height: 60rpx;
        border-top: 1px solid #c8c7cc;
        border-bottom: 1px solid #c8c7cc;
        text-align: center;
    }
    .disabled{
        background: #eee;
        color: #aaa;
    }
    .check-btn{
        width: 100%;
        height: 100rpx;
        line-height: 100rpx;
        color: #fff;
        text-align: center;
        background: $theme-color;
        position: absolute;
        bottom: 0;
    }
    .uni-popup{
        position: relative;
        z-index: 2000;
    }
</style>
