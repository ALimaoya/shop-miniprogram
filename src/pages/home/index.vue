<template>
	<view class="content">
		<view class="status_bar"></view>
<!--		<search-bar placeholder="搜索商品" cancelButton="false" :radius="5" @click.native="gotoSearch"></search-bar>-->
		<swiper class="swiper mb50" circular :indicator-dots="true" :autoplay="true" interval="3000">
			<swiper-item v-for="(item,index) in homeData.bannerList"  v-if="item.position=='INDEX_TOP'":key="index" >
					<image class="goods-image" :src="item.bannerUrl" ></image>
			</swiper-item>
		</swiper>
		<goods-box title="排行榜" :showMore="true" url="/pages/goods/topList/index" :mainImg="homeData.rankBanner.bannerUrl" :goodsList="homeData.rankListProductList"></goods-box>
		<goods-box title="人气推荐" :showMore="true" url="/pages/goods/recommendList/index" :mainImg="homeData.hotBanner.bannerUrl" :goodsList="homeData.recommendProductList"></goods-box>
		<goods-list title="为你推荐" :goodsList="recommendList" :status="status"></goods-list>
	</view>
</template>

<script>
	import searchBar from "@/components/uni-search-bar/uni-search-bar";
	import goodsBox from "@/components/goods-box.vue";
	import goodsList from "@/components/goods-list.vue";
	import network from '@/common/network';

	export default {
		components:{
			searchBar,
			goodsBox,
			goodsList
		},
		data() {
			return {
				homeData: {},
				page: 1,
				status: 'loading',
				recommendList: [],
			}
		},
		onLoad() {

		},
		created () {
			var that = this;
			network._get({
				url : '/anon/index/all/data',
				success: function (response) {
					if (response.data.code == '000000') {
						that.homeData = response.data.data;
						that.getRecommendData ()

					}
				}
			});
		},
		watch: {
			'status': function(val) {
				if (val == 'loading') {
					this.page++;
					this.getRecommendData ()
				}
			}
		},
		methods: {
			getRecommendData () {
				var that = this;
				network._get({
					url : '/product/recommend/list?currentPage=' + this.page,
					success: function (response) {
						if (response.data.code == '000000') {
							if (that.page == 1) {
								that.recommendList = response.data.data;
							}else {
								that.recommendList = that.recommendList.concat(response.data.data);

							}
							that.status = that.recommendList.length==10?'more':'';
						}
					}
				});
			},
			gotoSearch () {
				uni.navigateTo({url:'/pages/goods/search/index'})
			}
		},
		onReachBottom () {
			if(this.status == 'more') {
				this.status = 'loading';
			}
		},
	}
</script>

<style>
	.content {
		text-align: center;
		height: 400upx;
	}
	.swiper{
		width: 90%;
		margin: 2upx auto;
		border-radius: 10upx;

	}
	.goods-image{
		width: 100%;
		height: 100%
	}
</style>
