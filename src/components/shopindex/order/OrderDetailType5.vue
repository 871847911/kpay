<template>
	<div class="order-detail">
		<div class="order-detail-head layout-head">
			<div>分销订单详情</div>
			<div class="head-right" @click="$router.back()">
				<span><i class="iconfont icon-fanhui"></i>返回</span>
			</div>
		</div>

		<div class="order-detail-middle" v-if="orderData">
			<h2>基本信息</h2>
			<div class="middle-content">
				<div class="item">
					<p>订单编号<span>{{orderData.orderNo}}</span></p>
					<p>订单金额<span>{{orderData.orderAmount}}元</span></p>
					<!--<p>手机号码<span>{{orderData.phone}}</span></p>-->
					<p>手机号码<span></span></p>
				</div>
				<div class="item">
					<p>生成时间<span>{{getNewDate(orderData.createTime)}}</span></p>
					<p>订单状态<span>{{orderData.orderStatus}}</span></p>
				</div>
				<div class="item">
					<p>订单类型<span>
						{{	orderData.orderType == 100 ? "分销->推广(推广二维码给用户扫码下单)" :
							orderData.orderType == 101 ? "分销->赠送" :
							orderData.orderType == 102 ? "分销->拼团" :
							orderData.orderType == 103 ? "分销->分享" :
							orderData.orderType == 200 ? "知识付费-常规" :
							orderData.orderType == 201 ? "知识付费-赠送" :
							orderData.orderType == 202 ? "知识付费-拼团" :
							"知识付费-分享"
						}}</span></p>
					<p>用户姓名<span>{{orderData.buyerWxName}}</span></p>
				</div>
			</div>
		</div>

		<div class="order-detail-middle" v-if="orderData">
			<h2>分销信息</h2>
			<div class="middle-content">
				<div class="item">
					<p>推客微信昵称<span>{{orderData.buyerWxName}}</span></p>
					<p>平台抽成<span>{{orderData.platformExtractionRate}}%</span></p>
				</div>
				<div class="item">
					<p>推客佣金比例<span>{{orderData.pusherCommissionRate}}%</span></p>
					<p>平台收益<span>{{orderData.platformAnticipatedIncomeAmount}}元</span></p>
				</div>
				<div class="item">
					<p>推客收益<span>{{orderData.pusherAnticipatedIncomeAmount}}元</span></p>
				</div>
			</div>
		</div>

		<div class="order-detail-goods">
			<h2>商品信息</h2>
			<div class="box-content">
				<div class="content-left">
					<div class="content-left-l">
						<img :src="shoppingDetail.imageUrl">
					</div>
					<div class="content-left-r">
						<p>{{shoppingDetail.goodsName}}</p>
						<div>
							<p>{{shoppingDetail.categoryName}}/{{shoppingDetail.typeName}}</p>
							<p></p>
						</div>
					</div>
				</div>
				<div class="content-middle">
					<p class="middle-t">{{shoppingDetail.price ? shoppingDetail.price : '0'}}元</p>
					<p class="middle-b">价格</p>
				</div>
				<div class="content-right">
					<p class="right-t">{{shoppingDetail.authorName ? shoppingDetail.authorName : '/'}}</p>
					<p class="right-b">讲师</p>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
	import { mapGetters } from "vuex";
	import api from "fetch/api";
	export default {
		name: "OrderDetail",
		data() {
			return {
				shoppingDetail : {},
				orderData : null
			};
		},
		computed: {
			...mapGetters([
				"imageHead"
			])
		},
		created(){
			this.getOrderDetail();
		},
		methods : {
			getOrderDetail(){
				console.log(1)
				api.DistributionOrderApiDetail({orderId : this.$route.query.orderId}).then(res => {
					if(res.serviceCode == 'E000000000'){
						this.orderData = res.data;
						this.getShoppingDetail();
					}else{
						this.$message.error(res.serviceMessage);
					}
				})
			},
			getShoppingDetail(){
				api.getPeddleGoodsDetailFunc({peddleGoodsId : this.$route.query.id}).then(res => {
					if(res.serviceCode == "E000000000"){
						this.shoppingDetail = res.data
					}else{
						this.$message.error(res.serviceMessage)
					}

				})
			},
			getNewDate(s){
				s = s.substring(0,s.length-2)
				return s
			},
		}
	};
</script>

<style lang="stylus" scoped>
	@import '~assets/styles/mixins';
	@import '~assets/styles/varibles';

	.order-detail
		width 100%
		margin 0 auto
		h2
			color $color-theme
			font-size 14px
			font-weight 600
			margin-bottom 0.35rem
		.order-detail-head
			.head-right
				font-size 0.2rem
				color #9B9B9B
				.iconfont
					font-size 0.2rem
					margin-right 0.04rem
			.head-right
				cursor pointer
		.order-detail-middle
			width 100%
			border-radius 5px
			padding .2rem .2rem .4rem .2rem
			background-color #ffffff
			margin-bottom 0.2rem
			box-sizing border-box
			.middle-content
				display flex
				flex-flow row nowrap
				align-items stretch
				justify-content space-between
				.item
					flex-grow 1
					display flex
					flex-direction column
					align-items flex-start
					justify-content flex-start
					font-size 14px
					color #9B9B9B
					line-height .35rem
					span
						margin-left .34rem
						color #4A4A4A
		.order-detail-goods,
		.order-detail-share,
		.order-detail-sale
			width 100%
			border-radius 5px
			padding .2rem .2rem .1rem .2rem
			background #ffffff
			box-sizing border-box
			margin-bottom .2rem
			.box-content
				width 100%
				display flex
				flex-flow row nowrap
				justify-content flex-start
				align-items stretch
				margin-bottom 0.4rem
				.content-left
					width 50%
					display flex
					flex-direction row
					flex-wrap nowrap
					align-items stretch
					justify-content flex-start
					border-right 1px solid #E6E6E6
					.content-left-l
						display flex
						flex-direction row
						flex-wrap nowrap
						justify-content center
						align-items center
						width 1.96rem
						height auto
						margin-right .2rem
						overflow hidden
						img
							width 100%
							height .96rem
					.content-left-r
						display flex
						flex-direction column
						justify-content space-around
						align-items flex-start
						p
							font-size 16px
							line-height 0.2rem
							color #4A4A4A
						>div p
							font-size 14px
							color #9B9B9B
				.content-middle
					width 25%
					display flex
					flex-direction column
					align-items center
					justify-content center
					border-right 0.01rem solid #E6E6E6
					.middle-t
						font-size 30px
						line-height 0.6rem
						color #4A4A4A
					.middle-b
						font-size 14px
						line-height 0.2rem
						color #9B9B9B
				.content-right
					width 25%
					display flex
					flex-direction column
					align-items center
					justify-content center
					.right-t
						line-height 0.6rem
						font-size 30px
						color #4A4A4A
					.right-b
						line-height 0.2rem
						font-size 14px
						color #9B9B9B
		.order-detail-sale
			.content-left-sale
				width 33.33%
				display flex
				flex-direction column
				align-items flex-start
				justify-content space-around
				border-right 1px solid #E6E6E6
				p
					font-size 14px
					color #9B9B9B
				h2
					margin-bottom 0
					font-size 16px
					color #4A4A4A
		.order-detail-share
			.box-content-left
				display flex
				flex-grow 1
				flex-direction column
				align-items flex-start
				justify-content center
				border-right 1px solid #E6E6E6
				padding-right .4rem
				box-sizing border-box
				p
					color #9B9B9B
					font-size 14px
					line-height 0.4rem
				>div
					width 100%
					flex()
					justify-content flex-start
					p
						color #4A4A4A
						font-size 14px
						margin-left .1rem
				.el-progress
					width 90%
					height auto
					margin 0
			.box-content-right
				width 33.33%
				display flex
				flex-direction column
				align-items center
				justify-content center
				.right-t
					line-height 0.6rem
					font-size 30px
					color #4A4A4A
				.right-b
					line-height 0.2rem
					font-size 14px
					color #9B9B9B
</style>
