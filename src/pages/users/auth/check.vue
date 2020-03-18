<template>

</template>

<script>
    import network from '@/common/network';

    export default {
        name: "check",
        data () {
            return {
                provider: '',
            }
        },
        created() {
            var that = this ;

            uni.getProvider({
                service: 'oauth',
                success: function (res) {
                    getApp().globalData.provider = res.provider[0];
                    that.provider = res.provider[0];
                    uni.login({
                        provider: that.provider,
                        success (res) {
                            if (res.code) {
                                let url = '';
                                switch (that.provider) {
                                    case 'weixin' : {
                                        url = '/anon/wechat/mini/login?jsCode=';
                                        break;
                                    }
                                }
                                uni.getSetting({
                                    success(resp) {
                                        let token = uni.getStorageSync('token'),
                                            openId = uni.getStorageSync('openId'),
                                            userInfo = resp.authSetting['scope.userInfo'] ;
                                        if (userInfo && token && openId) {
                                            getApp().globalData.openId = uni.getStorageSync('openId');
                                            getApp().globalData.token = uni.getStorageSync('token');
                                            uni.switchTab({url:'/pages/home/index'});
                                        }else {
                                            //发起网络请求
                                            network._get({
                                                url : url + res.code,
                                                success: function (response) {
                                                    if (response.data.code == '000000') {
                                                        uni.setStorageSync('token', response.data.data.token);
                                                        uni.setStorageSync('openId', response.data.data.openId);
                                                        getApp().globalData.openId = uni.getStorageSync('openId');
                                                        getApp().globalData.token = uni.getStorageSync('token');
                                                                if (userInfo && getApp().globalData.openId && getApp().globalData.token) {
                                                                    uni.switchTab({url:'/pages/home/index'});

                                                                }else{
                                                                    uni.navigateTo({url:'/pages/users/auth/index'});
                                                                }


                                                    }
                                                }
                                            });
                                        }

                                    }

                                })
                            } else {
                                console.log('登录失败！' + res.errMsg)
                            }
                        },
                        fail (err) {
                            console.log(err);
                        }
                    })
                },
                fail (err) {
                    console.log(err);
                }
            });

        }
    }
</script>

<style scoped>

</style>
