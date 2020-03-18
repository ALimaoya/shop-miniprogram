<template>
    <view class="goodsList">
<!--        <view v-if="navTitle" class="navbar">{{navTitle}}</view>-->
<!--        <search-bar placeholder="搜索商品" cancelButton="false" v-model="searchKey" :radius="5"-->
<!--                    @input="input" @confirm="handleSearch"></search-bar>-->
        <scroll-view  v-if="showCategory" id="tab-bar" class="scroll-h" :scroll-x="true" :show-scrollbar="false" :scroll-into-view="scrollInto">
            <view v-for="(tab,index) in categoryList" :key="tab.id" class="uni-tab-item" :id="tab.id" :data-current="index" @click="searchCategory(tab.id)">
                <text class="uni-tab-item-title" :class="target==tab.id ? 'uni-tab-item-title-active' : ''">{{tab.name}}</text>
            </view>
        </scroll-view>
        <ul class="type-wrap">
            <li v-for="(item,index) in typeList" :key="index" @click="changeType(item)">
                <span :class="sortType == item.id?'uni-tab-item-title-active':''">{{item.name}}</span>
                <view class="icon-wrap">
                    <view @click="changeSort(item)" :class="[sortType == item.id?'uni-tab-item-title-active':'','jiantou-icon',sortType == item.id&& reverse?'icon-reverse':'','iconfont', 'icon-jiantou2']"></view>
<!--                    <img @click="changeSort(item)" :class="[sortType == item.id?'uni-tab-item-title-active':'','jiantou-icon',sortType == item.id&& reverse?'icon-reverse':'']" src="../../../static/jiantou.png"/>-->
                </view>
            </li>
            <li @click="changeRows">
                <img class="icon" src="../../../static/category_icon.png"/>
            </li>
        </ul>
        <goods-list :goodsList="goodsList" :showRows="showRows" :isPage="true"></goods-list>
    </view>
</template>

<script>
    import searchBar from "@/components/uni-search-bar/uni-search-bar";
    import network from '@/common/network';

    import { goodsList } from "@/components/goods-list";
    export default {
        name: "goodsList",
        components: {
            searchBar,
            goodsList
        },
         props: ['showCategory','navTitle'],
        data () {
            return {
                categoryList : [],
                typeList: [
                    {
                        name: '销量',
                        id: 2,
                    },
                    {
                        name: '新品',
                        id: 1,
                    },
                    {
                        name: '价格',
                        id: 3,
                    }
                ],
                categoryId: '',
                scrollInto: "",
                target: '',
                navTitle: '',
                goodsList: [],
                showRows: true,
                id: '',
                searchKey: '',
                sortType: 1,
                reverse: false
            }
        },
        onLoad: function (option) {
            this.showCategory = option.showCategory?option.showCategory:'';
            this.navTitle = option.navTitle?option.navTitle:'';
            this.id = option.id?option.id:'';
            this.target = this.id;
            this.searchKey = option.name?option.name:'';
            this.categoryId = option.categoryId?option.categoryId:'';
            if (this.showCategory) {
                this.getCategory();
            }
            this.getList();

        },
        created () {
        },
        methods: {
            getCategory (id) {
                var that = this;
                network._get({
                    url : '/anon/category/list?categoryId='+ that.categoryId,
                    success: function (response) {
                        if (response.data.code == '000000') {
                            that.categoryList = response.data.data;
                        }
                    }
                });
            },
            getList () {
                let that = this,orderType = that.reverse==true?'asc':'desc';
                network._get({
                    url : '/product/list?sortType='+ that.sortType + '&orderType=' + orderType,
                    success: function (response) {
                        console.log(response)
                        if (response.data.code == '000000') {
                            that.goodsList = response.data.data;
                        }
                    },
                    fail(err) {
                        console.log(err)
                    }
                });
            },
            searchCategory (id) {
                this.target = id;
                this.scrollInto = id;
                this.getList();
                // this.goodsList =
            },
            changeRows () {
                this.showRows = !this.showRows;
            },
            input(res) {
                this.searchKey = res.value;

            },
            handleSearch () {
                if (this.searchKey) {
                    this.getList();

                }
            },
            changeType (item) {
                this.sortType = item.id;
                this.getList();

            },
            changeSort (item) {
                this.reverse = !this.reverse;
                this.getList();

            }
        }
    }
</script>

<style scoped lang="scss">
    .status_bar {
        height: var(--status-bar-height);
        width: 100%;
    }
    .navbar{
        text-align: center;
        margin-bottom: 20rpx;
    }
    .scroll-h {
        width: 100%;
        height: 80rpx;
        flex-direction: row;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
        /* flex-wrap: nowrap; */
        border-color: #dedede;
		border-bottom-style: solid;
		border-bottom-width: 1px;
    }
    .uni-tab-item {
        /* #ifndef APP-PLUS */
        display: inline-block;
        /* #endif */
        flex-wrap: nowrap;
        padding-left: 34rpx;
        padding-right: 34rpx;
    }

    .uni-tab-item-title {
        color: #666;
        font-size: 30rpx;
        height: 80rpx;
        line-height: 80rpx;
        flex-wrap: nowrap;
        /* #ifndef APP-PLUS */
        white-space: nowrap;
        /* #endif */
    }
    .uni-tab-item-title-active {
        color: $theme-color;
    }
    .type-wrap{
        display: flex;
        flex-direction: row;
        justify-content: space-around;
        align-items: center;
        height: 80rpx;
        width: 100%;
        font-size: 30rpx;
        color:#666;
        border-bottom: 1px solid #dedede;
    }
    .type-wrap li{
        display: flex;
        align-items: center;
    }
    .icon-wrap{
        display: flex;
        flex-direction: column;
        justify-content: space-around;
        width: 30rpx;
        height: 100%;
        margin-left: 5rpx;
    }
    .jiantou-icon{
        width: 100%;
        height: 25rpx;
        transition: 1s ease;
    }
    .icon-reverse{
        transform: rotate(180deg);

    }
    .icon{
        width: 30rpx;
        height: 30rpx;
    }

</style>
