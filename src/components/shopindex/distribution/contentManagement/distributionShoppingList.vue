
<template>
	<div class="distribution_shopping_list">
		<div class="layout-head">
			<span>分销商品</span>
		</div>
		<div class="serch_box">
			<el-select v-model="shelvesStatusVal" placeholder="上架状态" class="shelves_status_select">
				<el-option v-for="item in shelvesStatusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<el-select v-model="classificationVal" placeholder="类型" class="classification_status_select">
				<el-option v-for="item in classificationOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
			</el-select>
			<el-input v-model.trim="shoppingNameVal" placeholder="商品名称" class="shopping_name_val"></el-input>
			<el-button type="primary" class="serch_btn" @click="getStorePeddleGoodsListFunc">搜索</el-button>
			<el-button type="primary" class="box_right" @click="chooseShoppingDalogdalog">我要推广</el-button>
		</div>
		<div class="page_tip">显示在此的商品都可在【分销中心】销售,了解更多请查看 <span class="color_1">分销指南</span> </div>
		<div class="page_table">
			<el-table stripe :data="shoppingList">
				<el-table-column width="80" label="" >
					<template slot-scope="scope">
						<div class="user_box">
							<div class="img_box">
								<img :src="scope.row.imageUrl" alt="">
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column align="left" label="商品名称" >
					<template slot-scope="slot">
						<div class="user_box">
							<div class="name">
								{{slot.row.goodsName}}
							</div>
						</div>
					</template>
				</el-table-column>
				<el-table-column align="center"  label="分类">
					<template slot-scope="slot">
						{{slot.row.categoryName+'/'+slot.row.typeName}}
					</template>
				</el-table-column>
				<el-table-column align="center" label="类型">
					<template slot-scope="scope">
						{{scope.row.classifyType == "0"  ? "课程" : ''}}
					</template>
				</el-table-column>
				<el-table-column align="center" label="状态">
					<template slot-scope="scope">
						<div class="shopping_status_box" v-if="scope.row.openState == 1">
							<i class="status_dian shangjia"></i>已上架
						</div>
						<div class="shopping_status_box" v-if="scope.row.openState == 0">
							<i class="status_dian weishangjia"></i>未上架
						</div>
					</template>
				</el-table-column>
				<el-table-column align="center" label="分销价格">
					<template slot-scope="scope">
						{{scope.row.price}}元
					</template>
				</el-table-column>
				<el-table-column align="center"  label="销量">
					<template slot-scope="scope">
						{{scope.row.salesNum ? scope.row.salesNum : 0}}
					</template>
				</el-table-column>
				<el-table-column align="center" label="推客佣金比例">
					<template slot-scope="scope">
						{{scope.row.peddleRate}}%
					</template>
				</el-table-column>
				<el-table-column align="center" min-width="150" label="操作">
					<template slot-scope="scope" >
						<div class="btn_group">
							<el-button size="mini" @click="toShoppingDetailPage(scope.row)">商品详情</el-button>
							<el-button v-if="scope.row.openState == 0" size="mini" @click="setPriceFunc(scope.row)">价格佣金</el-button>
							<el-button v-if="scope.row.openState == 0" size="mini" @click="changeShoppingStatus(scope.row , 'shang')">上架</el-button>
							<el-button v-if="scope.row.openState == 1" size="mini" @click="changeShoppingStatus(scope.row , 'xia')">下架</el-button>
						</div>
					</template>
				</el-table-column>
			</el-table>
		</div>


		<div class="pagination">
			<el-pagination
					@current-change="handlPageChange"
					:current-page.sync="pageData.page"
					:page-sizes="[10]"
					:page-size="pageData.size"
					layout="prev, pager, sizes,  next , jumper"
					:total="pageData.total">
			</el-pagination>
		</div>

		<!--选择分销商品dalog-->
		<chooseShoppingDalog></chooseShoppingDalog>
		<!--选择佣金价格-->
		<el-dialog class="set_price_dalog_box" title="价格佣金" :visible.sync="setPriceDalogDoxShow" width="50%">
			<div class="dalog_main_box">
				<p>商品名称</p>
				<el-input class="top5" v-model.trim="lineData.goodsName" placeholder="请输入商品名称"  :disabled="true"></el-input>
				<p class="top20">平台分成</p>
				<!-- <el-input class="top5" v-model.trim="lineData.platformRate" placeholder="请输入平台分成" @change="isNumInput($event , 'platformRate')" :disabled="true"> -->
				<!-- 现后端接口返回数据  platformRate 1 2 3 4 分别代表20% 15% 10% 5% -->
				<el-input class="top5" placeholder="请输入平台分成" @change="isNumInput($event , 'platformRate')" :disabled="true" :value="lineData.platformRate == 1?'20':lineData.platformRate == 2?'15':lineData.platformRate == 3?'10':'5'">
					<template slot="append">%</template>
				</el-input>
				<p class="top20">分销价格</p>
				<el-input class="top5" v-model.trim="lineData.price" placeholder="请输入分销价格" @change="isNumInput($event , 'price')">
					<template slot="append">元</template>
				</el-input>
				<p class="top20">推客佣金比例</p>
				<el-input class="top5" v-model.trim="lineData.peddleRate" placeholder="请输入推客佣金比例" @change="isNumInput($event , 'peddleRate')">
					<template slot="append">%</template>
				</el-input>
			</div>
			<span slot="footer" class="dialog-footer">
			    <el-button @click="setPriceDalogDoxShow = false">取 消</el-button>
			    <el-button type="primary" @click="setPriceFuncData">确定</el-button>
		    </span>
		</el-dialog>
	</div>
</template>

<script>
	import api from 'fetch/api'
	import chooseShoppingDalog from '../module/chooseShoppingDalog'
	export default {
		name: 'distribution_shopping_list',
		data () {
			return {
				shelvesStatusOption : [
					{value : 0 , label : '未上架'},
					{value : 1 , label : '已上架'},
					{value : -1 , label : '全部'}
				],
				shelvesStatusVal : null,//上架状态
				classificationOption : [
					{value : -1 , label : '全部'}
				],
				classificationVal : null,//类型
				shoppingNameVal : null,//商品名称
				shoppingList : [],
				pageData : {
					page : 1,
					size : 10,
					total : null
				},
				setPriceDalogDoxShow : false,
				lineData : {}
			}
		},
		created(){
			this.getStorePeddleGoodsListFunc();
		},
		destroyed(){
			this.setPriceDalogDoxShow = false;
		},
		components : {
			chooseShoppingDalog
		},
		methods: {
			//分销商品列表
			getStorePeddleGoodsListFunc(){
				let params = {
					openState : this.shelvesStatusVal,
					classifyType : this.classificationVal,
					keyword : this.shoppingNameVal,
					checkState : 1,
					page : this.pageData.page,
					pageSize : this.pageData.size
				}
				api.getStorePeddleGoodsList(params).then(res => {
					console.log(res)
					if(res.serviceCode == "E000000000"){
						this.shoppingList = res.data.list;
						this.pageData.total = res.data.total;
					}
				})
			},
			//商品详情页
			toShoppingDetailPage(row){
				this.$router.push({
					name : 'shoppingListDetail',
					query : {
						shoppingId : row.peddleGoodsId
					}
				})
			},
			//打开选择分销商品列表
			chooseShoppingDalogdalog(){
				this.$store.dispatch("changeChooseShoppingDalogShow" , true )
			},
			//打开佣金价格
			setPriceFunc(item){
				this.getStorePeddleGoodsListFunc();
				this.lineData = item;
				this.setPriceDalogDoxShow = true;
			},

			//设置价格佣金
			setPriceFuncData(){
				console.log(this.lineData)
				let params = {
					id : this.lineData.peddleGoodsId,
					imageUrl : this.lineData.imageUrl,
					goodsName : this.lineData.goodsName,
					goodsType : this.lineData.goodsType,
					goodsIntroduction : this.lineData.goodsIntroduction,
					price : this.lineData.price,
					peddleRate : this.lineData.peddleRate,
					platformRate : this.lineData.platformRate,
					categoryId : this.lineData.categoryId,
					typeId : this.lineData.typeId,
					categoryName : this.lineData.categoryName,
					typeName : this.lineData.typeName,
					articleLink : this.lineData.articleLink
				}
				api.updatePeddleApiGoods(params).then(res => {
					if(res.serviceCode=="E000000000"){
						this.$message.success("修改成功")
						this.setPriceDalogDoxShow = false;
						this.getStorePeddleGoodsListFunc();
					}else{
						this.$message.error(res.serviceMessage)
					}
				})

				// let params = {
				//
				// }
			},
			//上下架
			changeShoppingStatus(row , status){
				console.log(row)
				let params = {
					peddleGoodsId : row.peddleGoodsId,
					status : null
				}
				if(status == "shang"){
					params.status = 1;
				}else{
					params.status = 0;
				}
				api.openStatePeddleApiGoods(params).then(res => {
					console.log(res)
					if(res.serviceCode == 'E000000000'){
						if(res.data.success){
							this.$message.success("修改成功")
							this.getStorePeddleGoodsListFunc();
						}else{
							this.$message.error(res.data.errorMsg);
						}
					}else{
						this.$message.error(res.serviceMessage);
					}
				})
			},
			isNumInput(val , data){
				let exp =/^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
				if(!exp.test(val)){
					this.$message.error("请输入正整数数字,且只能输入两位小数")
					if(data == 'platformRate'){
						this.lineData.platformRate = null;
					}else if(data == 'price'){
						this.lineData.price = null;
					}else if(data == 'peddleRate'){
						this.$message.error("推客佣金不能大于100%")
						this.lineData.peddleRate = null;
					}
				}else{
					if(data == 'peddleRate'){
						if(val > 80 || val < 1){
							this.$message.error("推客佣金不能小于1%大于80%")
							this.lineData.peddleRate = null;
						}

					}
				}
			},
			//分页改变
			handlPageChange(page){
				this.pageData.page = page
				this.getStorePeddleGoodsListFunc();
			}
		}
	}
</script>

<style lang="stylus"  scoped>
	.distribution_shopping_list{
		width:100%;
		height:100%;
		.box_right{
			float : right ;
		}
		overflow-y : scroll;
		.serch_box{
			width:100%;
			margin-top : 32px;
		}
		.shelves_status_select,.classification_status_select{
			width:140px;
		}
		.classification_status_select{
			margin-left:10px;
		}
		.shopping_name_val{
			width:300px;
			margin-left:10px;
		}
		.serch_btn{
			margin-left:10px;
		}
		.page_tip{
			color: #9B9B9B;
			font-size 14px;
			margin-top : 17px;
			text-align : right;
			.colo_1{
				color: #6FDDC8;
			}
		}
		.page_table{
			margin-top : 10px;
			padding : 20px;
			box-sizing border-box
			background #fff
			.user_box{
				.img_box{
					width:60px;
					height:60px;
					img{
						width:100%;
						height:100%;
					}
				}
				.name{
					display flex
					flex-direction column
					justify-content center
				}

			}
			.shopping_status_box{
				line-height : 20px;
				.status_dian{
					width:6px;
					height:6px;
					background: #6CDDC7;
					border-radius : 50%;
					display: inline-block;
					margin-right : 10px;
				}
				.status_dian.weishangjia{
					background: #9B9B9B;
				}
			}
			.btn_group{
				display : flex;
			}
		}
		.pagination{
			text-align : right ;
			margin-top:20px;
		}
		.set_price_dalog_box{
			.dalog_main_box{
				width : 300px;
				margin : 0 auto;
				.top5{
					margin-top : 5px;
				}
				.top20{
					margin-top : 20px;
				}

			}
		}
	}

</style>
