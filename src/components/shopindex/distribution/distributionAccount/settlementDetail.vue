<template>
	<div class="settlement_detail">
		<div class="layout-head">
			<span>结算详情</span>
			<div class="btn_box">
				<el-button class="return_btn" type="text" @click="$router.go(-1)"><i class="iconfont icon-fanhui1"></i> 返回</el-button>
			</div>
		</div>
		<div class="tabBox">
			<div class="header">
				<div class="tabBoxHeader">时间：<span>{{getTime($route.query.date)}}</span></div>
				<div class="tabBoxHeader">
					状态：
					<div v-if="$route.query.status==0" class="zhuangtai">未结算</div>
					<div v-if="$route.query.status==1" class="zhuangtai already">已结算</div>
				</div>
			</div>
		</div>
		<div class="settlement_detail_content">
			<div class="pushDetails">
				<div class="detailsBottom">
					<dl class="bdr">
						<dt>¥{{orderDetail.settlementMoney}}</dt>
						<dd>结算金额</dd>
					</dl>
					<dl class="bdr">
						<dt>¥{{orderDetail.orderMoney}}</dt>
						<dd>订单交易额</dd>
					</dl>
					<dl class="bdr">
						<dt>{{orderDetail.countOrder}}</dt>
						<dd>已付款订单数（笔）</dd>
					</dl>
				</div>
			</div>
			<div class="zucheng">当日已付款订单</div>
			<div class="table">
				<el-table :data="tableData" stripe style="width: 100%">
					<el-table-column align="center" label="订单编号">
						<template slot-scope="scope">
							{{scope.row.orderNo}}
						</template>
					</el-table-column>
					<el-table-column align="center" label="生成时间">
						<template slot-scope="scope">
							{{getNewDate(scope.row.createTime)}}
						</template>
					</el-table-column>
					<el-table-column align="center" label="用户">
						<template slot-scope="scope">
							{{scope.row.buyerWxName}}
						</template>
					</el-table-column>
					<el-table-column align="center" label="订单金额">
						<template slot-scope="scope">
							{{scope.row.orderAmount}}
						</template>
					</el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button size="mini" @click="handleClick(scope.row)">查看</el-button>
						</template>
					</el-table-column>
				</el-table>
				<div class="pagination">
					<el-pagination
						@current-change="handlSetelementDetailPageChange"
						:current-page.sync="pageData.page"
						:page-sizes="[10]"
						:page-size="pageData.size"
						layout="prev, pager, sizes,  next , jumper"
						:total="pageData.total">
					</el-pagination>
				</div>
			</div>
		</div>

	</div>
</template>
<script>
	import api from 'fetch/api'
	export default {
		name : "settlement_detail",
		data() {
			return {
				tableData:[],
				orderDetail : {},
				pageData : {
					page : 1,
					size : 10,
					total : null
				},
			};
		},
		created() {
			this.getCatalogPage();
			this.settlementDetailEarningsFunc();
		},
		methods: {
			getCatalogPage() {
				let params = {
					date : this.$route.query.date,
					pageNum : this.pageData.page,
					orderStatus : 13,
					pageSize : this.pageData.size,
					storeId : this.$store.state.storeId
				}
				api.DistributionOrderApiList(params).then(res => {
					console.log(res)
					if(res.serviceCode == 'E000000000'){
						this.tableData = res.data.list
						this.total = res.data.total
					}else{
						this.$message.error(res.serviceMessage);
					}
				})
				// let data = {
				// 	userId:this.$store.state.userId,
				// 	date : this.$route.query.date
				// };
				// api.settlementApiDetail(data).then(res => {
				// 	console.log(res)
				// 	if (res.serviceCode=="E000000000") {
				// 		this.tableData = res.data.list;
				// 	} else {
				// 		this.$message({
				// 			type: "error",
				// 			message: res.message
				// 		});
				// 	}
				// });
			},
			//获取结算详情
			settlementDetailEarningsFunc(){
				let params = {
					userId : this.$store.state.userId,
					userType : 4,
					date : this.$route.query.date
				}
				api.settlementDetailApiEarnings(params).then(res => {
				    console.log(res)
				    if(res.serviceCode == 'E000000000'){
				        this.orderDetail = res.data;
				    }else{
				        this.$message.error(res.serviceMessage);
				    }
				})
			},
			//分页改变
			handlSetelementDetailPageChange(page){
				this.pageData.page = page
				this.getShenhePeddleGoodsListFunc();
			},
			handleClick(row){
				this.$router.push({
					name: 'OrderMyDetail',
					query: {
						id : row.productKey,
						orderId : row.orderNo,
						type : 5
					}
				});
			},
			//时间戳转换
			getTime(time){
				let date = new Date(time);
				let year = date.getFullYear();
				let month = date.getMonth()<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
				let weekArray = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
				let weeks = weekArray[date.getDay()];
				let day = date.getDate()<10?"0"+date.getDate():date.getDate();
				let h = date.getHours()<10?"0"+date.getHours():date.getHours();
				let m = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
				return year+"-"+month+"-"+day+" "+h+":"+m;
			},
			getNewDate(s){
				s = s.substring(0,s.length-2)
				return s
			},
		}
	};
</script>
<style scoped lang="stylus">
	.settlement_detail{
		width : 100%;
		.layout-head{
			.btn_box{
				.return_btn{
					color : #9B9B9B;
					font-size 20px;
				}
			}
		}
		.tabBox{
			background: #ffffff;
			.header{
				margin: 0 20px;
				display: flex;
				border-bottom: 1px solid rgba(230,230,230,1);
			}
			.tabBoxHeader{
				font-size: 14px;
				color: #9B9B9B;
				padding: 20px 0;
				margin-right: 70px;
				.zhuangtai{
					width:49px;
					height:20px;
					background:rgba(236,75,38,1);
					border-radius:10px;
					font-size:12px;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(255,255,255,1);
					line-height:20px;
					display: inline-block;
					text-align: center;
				}
				.already{
					background: #27BDC1;
				}
				span{
					font-size: 14px;
					color: #4A4A4A;
				}
			}
		}
		.settlement_detail_content{
			.ml-30{
				margin-left: 35px;
			}

			.green{
				color: #00B4B9;
				cursor: pointer;
			}
			.line {
				text-align: center;
			}
			.zucheng{
				font-size: 16px;
				color: #9B9B9B;
				padding: 30px 0 20px 0;
			}
			.pushDetails{
				background: #fff;
				padding: 40px 40px 50px 40px;
				.detailsTop{
					display: flex;
					justify-content: space-between;
					padding-bottom: 40px;
					border-bottom: 1px solid rgba(230,230,230,1);
					img{
						width: 80px;
						height: 80px;
						border-radius: 50%;
					}
					.detailsRight{
						padding-left: 20px;
						flex: 1;
						.textBox{
							display: flex;
							align-items: center;
							.name{
								font-size: 14px;
								color: #4A4A4A;
								margin-right: 20px;
							}
							.dengji{
								display: inline-block;
								padding: 3px 6px;
								background: #E6F6F6;
								font-size: 14px;
								color: #27BDC1;
								margin-right: 10px;
								border-radius: 20px;
							}
							.date{
								display: inline-block;
								padding: 4px 10px;
								background: #F7F7F7;
								font-size: 12px;
								color: #9B9B9B;
								border-radius: 20px;
							}
						}
						p{
							padding-top: 20px;
							font-size: 14px;
							color: #4A4A4A;
						}
						.jinduBox{
							height: 3px;
							background: #EEF2F3;
							border-radius: 3px;
							// overflow: hidden;
							position: relative;
							margin-top: 14px;
							.jindu{
								width: 0;
								position: absolute;
								left: 0;
								top: 0;
								height: 3px;
								background: #27BDC1;
								.yuan{
									position: absolute;
									right: -5px;
									top: -4px;
									width: 11px;
									height:11px;
									background: #fff;
									border: 3px solid #27BDC1;
									border-radius: 50%;
								}
							}
						}
						.level{
							display: flex;
							justify-content: space-between;
							padding-top: 9px;
							span{
								font-size: 14px;
								color: #4A4A4A;
							}
						}
					}
				}
				.detailsBottom{
					display: flex;
					justify-content: space-between;
					// padding-top: 47px;
					dl{
						width: 33.3%;
						text-align: center;
						dt{
							font-size: 30px;
							color: #4A4A4A;
							padding-bottom: 10px;
						}
						dd{
							font-size: 14px;
							color: #9B9B9B;
						}
					}
					.bdr{
						border-right: 1px solid rgba(230,230,230,1);
					}
					.bdr:last-child{
						border: none
					}
				}
			}
			.table {
				padding-top: 20px;
				padding-left: 20px;
				padding-right: 20px;
				padding-bottom: 26px;
				background-color: #ffffff;
				.zhangtai{
					width:49px;
					height:20px;
					background:rgba(236,75,38,1);
					border-radius:10px;
					font-size:12px;
					font-family:PingFangSC-Regular;
					font-weight:400;
					color:rgba(255,255,255,1);
					line-height:19px;
					text-align: center
				}
			}

			.table:after {
				content: "";
				width: 0;
				height: 0;
				clear: both;
				display: block;
				visibility: hidden;
			}

			.scope-icon {
				width: 40px;
				height: 40px;
				background: #e0e0e0;
				overflow: hidden;
			}
		}
		.pagination{
			text-align : right ;
			margin-top:20px;
		}
	}

</style>
