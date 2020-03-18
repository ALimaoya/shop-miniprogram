<template>
    <view class="register">
        <view class="box-wrap">
            <input class="uni-input phone-verify" v-model="phone" type="number" placeholder="请输入手机号" :maxlength="11"/>
            <view class="verify-wrap">
                <input class="uni-input verify-input" v-model="verifyNum" type="number" placeholder="请输入验证码" :maxlength="6"/>
                <view :class="{'disabled':sending}" class="send-btn" @click="sendSmg">{{verify_text}}</view>
            </view>
            <view :class="{'active':isSubmit}" class="submit-btn" @click="handleRegister">确定</view>
        </view>
    </view>
</template>

<script>
    import {Validate} from '@/common/util'
    import network from '@/common/network';

    export default {
        name: "register",
        data(){
            return {
                verify_text: '获取验证码',
                sending: false,
                interval: null,
                time: 60,
                verifyNum: '',
                phone: '',
                isSubmit: false
            }
        },
        computed: {
            form () {
                let data = {};
                data.phone = this.phone;
                data.verifyNum = this.verifyNum;
                return JSON.stringify(data);
            }
        },
        watch: {
            form : function (newVal) {
                if  (newVal) {
                    let data = JSON.parse(newVal);
                    if (data.phone && data.verifyNum) {
                        this.isSubmit = true;
                    } else {
                        this.isSubmit = false;

                    }
                }
            }
        },
        methods: {
            sendSmg() {
                if (this.sending) {
                    return false;
                }else {
                    this.getMsg();
                }
            },
            getMsg () {
                this.time = 60;
                let that = this ;
                this.interval = setInterval(() => {
                    that.sending = true;
                    that.time -- ;
                    that.verify_text = '重新发送('+ (that.time<10?'0'+that.time:that.time)+')';
                if (this.time <= 0){
                    this.clearInterval();
                }
                },1000);
            },
            clearInterval() {
                clearInterval(this.interval);
                this.verify_text = '获取验证码';
                this.sending = false;
            },
            handleRegister () {
                if (this.isSubmit) {
                    if (!Validate.phoneRule(this.phone)) {
                        uni.showToast({
                            title: '请正确输入手机号',
                            duration: 2000
                        });
                    }else if (this.verifyNum == '' ) {
                        uni.showToast({
                            title: '请输入短信验证码',
                            duration: 2000
                        });
                    }else {
                        network._post({
                            url: '/client/anon/user/register/third',
                        })
                    }
                }


            }
        }
    }
</script>

<style scoped lang="scss">
    .register{
        width: 100%;
        height: 100vh;
        background: #eee;
    }
    .box-wrap{
        display: flex;
        flex-direction: column;
        justify-content: center;
        padding: 40rpx;
        box-sizing: border-box;
    }
    .uni-input{
        height: 25px;
        background: #fff;
        flex: 1;
        padding: 0 6rpx;
        box-sizing: border-box;
        border-radius: 4rpx;
        margin: 0;
        font-size: 16px;
    }
    .verify-wrap{
        display: flex;
        flex-direction: row;
        justify-content: space-between;
        height: 25px;
        margin-top: 7px;

    }
    .send-btn{
        background: $theme-color;
        width:100rpx;
        height: 100%;
        line-height: 25px;
        margin-left: 14rpx;
        border-radius: 2px;
        font-size: 16px;
        text-align: center;
        color: #fff;

    }
    .disabled{
        background: #e0e0e0;
        color: #aaa;
    }
    .active{
        background: $theme-color;
        color: #fff;
    }
    .submit-btn{
        width: 100%;
        height: 25px;
        text-align: center;
        margin-top: 7px;
        background: #e0e0e0;
        color: #aaa;
        line-height: 25px;
        border-radius: 2px;
    }
</style>
