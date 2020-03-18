<template>
    <view class="search">
        <view class="status_bar"></view>
        <search-bar placeholder="搜索商品" cancelButton="always" v-model="searchKey" :radius="5"
                    @input="input" @cancel="backPage" @confirm="handleSearch"></search-bar>
        <view class="search-wrap">
            <view class="title">历史搜索</view>
            <view class="tag-wrap">
                <view class="tag" v-for="(item,index) in historyList" :key="index" @click="turnToPage(item)">{{item.name}}</view>
            </view>
        </view>
        <view class="search-wrap">
            <view class="title">大家都在搜</view>
            <view class="tag-wrap">
                <view class="tag" v-for="(item,index) in searchList" :key="index" @click="turnToPage(item)">{{item.name}}</view>
            </view>
        </view>
    </view>
</template>

<script>
    import searchBar from "@/components/uni-search-bar/uni-search-bar";

    export default {
        name: "search",
        components:{
            searchBar,
        },
        data () {
            return {
                historyList: [
                    {
                        name: '水性笔',
                        id: 12
                    },
                    {
                        name: '水杯',
                        id: 13
                    },
                    {
                        name: '热水保温壶',
                        id: 14
                    },
                    {
                        name: '电动牙刷',
                        id: 15
                    },
                    {
                        name: '水性笔',
                        id: 12
                    },
                    {
                        name: '薄款牛仔裤',
                        id: 13
                    },
                    {
                        name: '热水保温壶',
                        id: 14
                    },

                ],
                searchList: [],
                searchKey: ''
            }
        },
        methods: {
            turnToPage (item) {
                uni.navigateTo({url: '/pages/goods/goodsList/index?id='+ item.id + '&name='+ item.name})
            },
            input(res) {
                this.searchKey = res.value;
            },
            handleSearch () {
                if (this.searchKey) {
                    uni.navigateTo({url:'/pages/goods/goodsList/index?name='+ this.searchKey})
                }
            },
            backPage () {
                uni.navigateBack(-1);
            }
        }
    }
</script>

<style scoped>
.search-wrap{
    padding: 20rpx 30rpx 30rpx;
    box-sizing: border-box;
}
    .title{
        font-size: 14px;
        color: #999;
        margin-bottom: 30rpx;
    }
    .tag-wrap{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
    }
    .tag{
        padding: 12rpx 17rpx ;
        font-size: 14px;
        color: #666;
        border: 1px solid #dedeed;
        margin-right: 20rpx;
        margin-bottom: 30rpx;
        border-radius: 3px;
    }
</style>
