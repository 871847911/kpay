
<template>
    <div class="shopping_detail">
	    <div class="layout-head">
		    <span>商品详情</span>
		    <div class="btn_box">
			    <el-button class="return_btn" type="text" @click="$router.go(-1)"><i class="iconfont icon-fanhui1"></i> 返回</el-button>
		    </div>
	    </div>
	    <el-alert v-if="shoppingDetail.checkState == 0" :title="'【' + shoppingDetail.goodsName +'】商品待审核'" type="warning" show-icon></el-alert>
	    <el-alert v-if="shoppingDetail.checkState == 1" :title="'【' + shoppingDetail.goodsName +'】审核已通过'" type="warning" show-icon></el-alert>
	    <el-alert v-if="shoppingDetail.checkState == 2" :title="'【' + shoppingDetail.goodsName +'】审核未通过，原因:' + shoppingDetail.auditNote" type="warning" show-icon></el-alert>
	    <el-alert v-if="shoppingDetail.checkState == 3" :title="'【' + shoppingDetail.goodsName +'】违规下架，无法在分销中心上架，违规原因:' + shoppingDetail.illegalNote" type="warning" show-icon></el-alert>
	    <div class="shopping_detail_content_box">
		    <p class="shopping_detail_title">商品信息</p>
		    <div class="detail_box">
			    <div class="detail_box_left">
				    <img :src="shoppingDetail.imageUrl" alt="">
			    </div>
			    <div class="detail_box_right">
				    <p class="color_1 bold font16">{{shoppingDetail.goodsName}} </p>
				    <p class="color_3">作者 | <span class="bold color_2">{{shoppingDetail.authorName}}</span>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;价格 | <span class="bold color_2">{{shoppingDetail.price}}元</span></p>
				    <div class="line"></div>
				    <p class="color_3">【{{shoppingDetail.classifyType == 0 && "课程"}}】【{{shoppingDetail.categoryName}}/{{shoppingDetail.typeName}}】</p>
				    <p class="color_3">平台抽成: <span class="bold color_2">{{shoppingDetail.platformProfitRatio}}%</span>  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;推客佣金: <span class="bold color_2">{{shoppingDetail.promoterProfitRatio}}%</span></p>
				    <p class="color_2 worp">推广链接：{{shoppingDetail.articleLink}}</p>
			    </div>
		    </div>
		    <p class="shopping_detail_title top40">商品简介</p>
		    <div class="text_detail_box" v-html="shoppingDetail.goodsIntroduction">

		    </div>
	    </div>
    </div>
</template>

<script>
	import api from 'fetch/api'
export default {
    name: 'shopping_detail',
	data () {
		return {
			shoppingDetail : {}
		}
	},
	created(){
		this.getPeddleGoodsDetailFunc();
	},
	methods: {
		getPeddleGoodsDetailFunc(){
			let params = {
				peddleGoodsId : this.$route.query.shoppingId
			}
			api.getPeddleGoodsDetailFunc(params).then(res => {
				console.log(res)
				if(res.serviceCode == "E000000000"){
					this.shoppingDetail = res.data
				}else{
					this.$message.error(res.serviceMessage)
				}

			})
		}
	}
}
</script>

<style lang="stylus" scoped>
	.shopping_detail{
		width:100%;
		.layout-head{
			.btn_box{
				.return_btn{
					color : #9B9B9B;
					font-size 20px;
				}
			}
		}
		.shopping_detail_content_box{
			background: #fff;
			padding :40px 20px;
			overflow : hidden;
			.shopping_detail_title{
				padding:10px;
				background: #F9FAF9;
				color: #9B9B9B;
				width:100%;
				box-sizing : border-box;
			}
			.detail_box{
				padding:20px;
				display : flex;
				.detail_box_left{
					width:288px;
					height:180px;
					img{
						width : 100%;
						height : 100%;
					}
				}
				.detail_box_right{
					flex : 1;
					padding-left : 20px;
					display : flex;
					flex-direction : column;
					justify-content : space-between ;
					.open_state{
						background: #6CDDC7;
						color: #fff;
						padding:2px 5px;
						border-radius : 3px;
						font-size : 12px;
					}
					.line{
						width:350px;
						height:2px;
						background: #e6e6e6;
					}
					.color_1{
						color : #4A4A4A;
					}
					.color_2{
						color: #666;
					}
					.color_3{
						color: #9B9B9B;
					}
					.bold{
						font-weight : bold;
					}
					.font16{
						font-size : 16px;
					}
					.top40{
						margin-top:40px;
					}
					.worp{
						word-break : break-all;
					}
				}
			}
			.text_detail_box{
				padding:20px;
			}
		}
	}
</style>
