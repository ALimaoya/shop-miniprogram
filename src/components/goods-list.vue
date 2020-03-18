<template>
    <view class="goods-list" :style="showRows?'padding:0 0.8rem':''">
        <view v-if="isPage" class="status_bar">
            <!-- 这里是状态栏 -->
        </view>
        <view v-if="navTitle">{{navTitle}}</view>
        <view v-if="title" class="title">{{title}}</view>
        <view class="goods-wrap" :style="showRows?'flex-direction:column':''">
            <goods-item :showRows="showRows" :style="showRows?'width:100%':'width:48%'" v-for="(item,index) in goodsList" :key="index" :goodsParams="item"></goods-item>
        </view>
        <view class="example-body">
            <load-more iconType="snow" :status="status" />
        </view>
    </view>
</template>

<script>
    import goodsItem from "./goods-item"
    import loadMore from "./uni-load-more/uni-load-more.vue"
    export default {
        name: "goods-list",
        props: ['title','goodsList','status','showRows','isPage'],
        components: {
            goodsItem,
            loadMore
        },
        data () {
            return {
                navTitle: '',
            }
        },
        watch: {
          // 'status': function (val) {
          //     if (val == 'loading') {
          //         this.$emit('loadMore',true)
          //     }
          // },
          //   'goodsList': function (val) {
          //       this.list = val;
          //   },
          // 'list': function (val) {
          //     if (val.length !== goodsList.length) {
          //         this.status = 'loading';
          //     }
          // },
        },
        methods: {


        }
    }
</script>

<style scoped>
    .goods-list{
        padding: 10px 40rpx;
        box-sizing: border-box;
    }
    .title{
        text-align: left;
        font-size: 14px;
        color: #333;
        font-weight: bold;
        height: 30px;
        line-height: 30px
    }
    .goods-wrap{
        display: flex;
        flex-direction: row;
        flex-wrap: wrap;
        justify-content: space-between;
        width: 100%;
    }
    .goods-item{
        width: 48%;
    }
    .status_bar {
        height: var(--status-bar-height);
        width: 100%;
    }
</style>
