<template>
    <view class="auth">
        <view class="logo-wrap">
            <img class="logo" src="" />
            <view class="shop-name">小资铺</view>
        </view>
        <view class="tips-wrap">
            <view class="tips-label">登录或开发者将获得以下权限</view>
            <view class="tips-content">• 获得你的公开信息（昵称、头像、地区及性别）</view>
        </view>
        <button open-type='getUserInfo' :class="[provider,'login-btn']" @click="handleLogin">确认登录</button>
        <view v-if="showModal" class="modal">
            <view class="box-wrap">
                <view class="box-title">绑定手机号</view>
                <button open-type='getPhoneNumber' :class="[provider,'phone-btn']" @getphonenumber="getPhoneNumber">
                    一键获取手机号
                </button>
            </view>
        </view>
    </view>
</template>

<script>
    import network from '@/common/network';
    export default {
        name: "auth",
        data () {
            return {
                provider: '',
                openId: '',
                showModal: false,
                userInfo: {}
            }
        },
        created () {
            this.provider = getApp().globalData.provider;
            this.openId = getApp().globalData.openId;
        },
        methods: {
            getPhoneNumber (e) {
                var that =this ;
                let data = {
                    openId: that.openId,
                    ...e.detail
                };
                network._post({
                    url : '/anon/wechat/mini/decrypt' ,
                    data,
                    success: function (res) {
                        if (res.data.code == '000000') {
                            console.log(res);
                            network._post({
                                url : '/anon/user/register/third' ,
                                data:{
                                    type: '01',
                                    openId: that.openId,
                                    phone: res.data.data.phoneNumber,
                                    ...that.userInfo
                                },
                                success: function (response) {
                                    if (response.data.code == '000000') {
                                        getApp().globalData.token = response.data.data;
                                        uni.setStorageSync('token', response.data.data.token);
                                        uni.switchTab({url:'/pages/home/index'});


                                    }
                                }
                            });
                        }
                    }
                });


            },
            handleLogin () {
                var that = this;
                if (this.provider == 'weixin') {
                                uni.authorize({
                                    scope: 'scope.userInfo',
                                    success() {

                                    },
                                    fail() {
                                        uni.getUserInfo({
                                            provider: that.provider,
                                            success: function (infoRes) {
                                                that.userInfo = JSON.parse(infoRes.rawData);
                                                that.showModal = true;
                                                console.log(that.showModal);

                                            },
                                            fail(err) {
                                                console.log(err);

                                            }
                                        });
                                    }
                                })


                }else {

                }
            }
        }
    }
</script>

<style scoped>
    .auth{
        padding: 30px 10rpx;
    }
    .logo-wrap{
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        padding-bottom: 30px;
        border-bottom: 1px solid #eee;
        width: 100%;
    }
    .logo{
        width: 50px;
        height: 50px;
        border-radius: 10px;
        margin-bottom: 7px;
    }
    .shop-name{
        text-align: center;
        font-weight: bold;
        font-size: 18px;

    }
    .tips-wrap{
        padding: 40px 30rpx 60px;
    }
    .tips-label{
        font-size: 18px;
        font-weight: bold;
        padding-bottom: 20px;
    }
    .tips-content{
        font-size: 14px;
        color: #aaa;
    }
    .login-btn, .phone-btn{
        width: 90%;
        height: 50px;
        border-radius: 6px;
        color: #fff;
        text-align: center;
        line-height: 50px;
        font-weight: bold;
        margin: 0 auto;
    }
    .weixin{
        background: rgba(7, 193, 96, 1);

    }
    .alipay{
        background: #007aff;
    }
    .modal{
        width: 100%;
        height: 100vh;
        position: fixed;
        top: 0;
        left: 0;
        z-index: 1000;
        background: rgba(0,0,0,0.5);
    }
    .box-wrap{
        width: 60%;
        height: 240rpx;
        background: #fff;
        box-sizing: border-box;
        border-radius: 10rpx;
        padding: 40rpx 0;
        margin: auto;
        position: absolute;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
    }
    .box-title{
        font-size: 16px;
        text-align: center;
        color: #333;
    }
    .phone-btn{
        width: 70%;
        height: 80rpx;
        line-height: 80rpx;
        border-radius: 40rpx;
        font-size: 14px;
        margin: 30rpx auto 0;
    }
</style>
