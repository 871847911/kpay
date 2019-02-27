<template>
	<div style="width:100%;">
		<div class="finance-detail" v-if="isActive == 4">
			<div class="layout-head">收入明细</div>
			<div class="finace-top">
				<div class="box">
					<i class="left-icon icon-jinrishouru- iconfont"></i>
					<div class="right-icon">
						<span>￥{{statsData.todayEarning}}</span>
						<span>今日收入</span>
					</div>
				</div>
				<div class="box">
					<i class="left-icon icon-benyueshouru- iconfont"></i>
					<div class="right-icon">
						<span>￥{{statsData.monthEarning}}</span>
						<span>本月收入</span>
					</div>
				</div>
				<div class="box">
					<i class="left-icon icon-leijishouru- iconfont"></i>
					<div class="right-icon">
						<span>￥{{statsData.totalEarning}}</span>
						<span>累计收入</span>
					</div>
				</div>
			</div>
			<div class="finace-bottom">
				<div class="bottom-header">
					<span>收入流水</span>
					<el-date-picker
						v-model="date"
						type="daterange"
						@change="changeDate()"
						format="yyyy-MM-dd"
						value-format="timestamp"
						start-placeholder="开始日期"
						end-placeholder="结束日期"
						:default-time="['00:00:00', '23:59:59']">
					</el-date-picker>
					<i class="iconfont icon-jiantou arrow"></i>
				</div>
				<div class="list">
					<div class="list-table list-thead-gray">
						<el-table :data="templateList" stripe :row-style="headRowHeight" :header-cell-style="getRowClass" style="width: 100%">
							<el-table-column label="交易时间" align="center" min-width="150">
								<template slot-scope="scope">
									{{getNewDate(scope.row.createTime)}}
								</template>
							</el-table-column>
							<el-table-column prop="productName" label="商品名称" align="center" min-width="150">
								<template slot-scope="scope">
									{{scope.row.productName}}
								</template>
							</el-table-column>
							<el-table-column label="商品种类" align="center" min-width="170">
								<template slot-scope="scope">
									<span>课程</span>
									<!--{{scope.row.orderType==1?"付费课程":"付费专栏"}}-->
								</template>
							</el-table-column>
							<el-table-column
									label="收入类型"
									align="center"
									min-width="170">
								<template slot-scope="scope">
									<span v-if="scope.row.orderType==100">分销订单收入</span>
									<span v-if="scope.row.orderType==101">分销赠送订单收入 </span>
									<span v-if="scope.row.orderType==102">分销拼团订单收入</span>
									<span v-if="scope.row.orderType==103">分销分享订单收入</span>
								</template>
							</el-table-column>
							<el-table-column
									label="金额"
									align="center"
									min-width="170">
								<template slot-scope="scope">
									<span style="color:#FF6431">+{{scope.row.productDistributionAmount}}</span>
								</template>
							</el-table-column>
							<el-table-column label="操作" align="center">
								<template slot-scope="scope">
									<el-button
											size="mini"
											@click="handleLook(scope.row.orderId)">详情</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>

					<div class="pagination">
						<el-pagination
								background
								@size-change="handleSizeChange"
								@current-change="handleCurrentChange"
								:current-page.sync="currentPage"
								:page-size="pageSize"
								layout="prev, pager, next, sizes, jumper"
								:page-sizes="[5, 10, 15, 25]"
								:total="total">
						</el-pagination>
					</div>
					<el-dialog :title= "titleData" :visible.sync="dialogFormVisible" :show-close="true" width="840px">
						<div class = "row_box" v-if="listData.orderNo">
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>订单编号</span>
									<span>{{listData.orderNo}}</span>
								</div>
								<div class="record_right flex_cloumn">
									<span>收入类型</span>
									<span v-if="listData.orderType==100">分销订单收入</span>
									<span v-if="listData.orderType==101">分销赠送订单收入 </span>
									<span v-if="listData.orderType==102">分销拼团订单收入</span>
									<span v-if="listData.orderType==103">分销分享订单收入</span>
								</div>
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>交易时间</span>
									<span>{{getNewDate(listData.createTime)}}</span>
								</div>
								<div class="record_right flex_cloumn">
									<span>购买者</span>
									<span>{{listData.buyerWxName}}</span>
								</div>
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>手机号</span>
									<!--<span>{{listData.phone}}</span>-->
									<span></span>
								</div>
							</div>
							<div class="title" style = "margin-bottom:20px;">
								商品信息
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>商品名称</span>
									<span class="ellipsisForm">{{listData.productName}}</span>
								</div>
								<div class="record_right flex_cloumn">
									<span>商品种类</span>
									<span>{{listData.productType==1?"付费课程":"付费专栏"}}</span>
								</div>
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>商品来源</span>
									<span>{{listData.goosOriange}}</span>
								</div>
								<div class="record_right flex_cloumn">
									<span>作者</span>
									<span>{{listData.contact}}</span>
								</div>
							</div>
							<div class="title" style = "margin-bottom:20px;">
								分销信息
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>推客微信昵称</span>
									<span class="ellipsisForm">{{listData.pusherWxName}}</span>
								</div>
								<div class="record_right flex_cloumn">
									<span>推客佣金</span>
									<span>{{listData.pusherCommissionRate}}%</span>
								</div>
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>推客收益</span>
									<span>{{listData.pusherAnticipatedIncomeAmount}}</span>
								</div>
								<div class="record_right flex_cloumn">
									<span>平台抽成</span>
									<span>{{listData.platformExtractionRate}}</span>
								</div>
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>平台收益</span>
									<span>{{listData.platformAnticipatedIncomeAmount}}</span>
								</div>
								<div class="record_right flex_cloumn">

								</div>
							</div>
							<div class="title" style = "margin-bottom:20px;">
								支付信息
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>支付方式</span>
									<span>{{listData.payChannel}}</span>
								</div>
								<div class="record_right flex_cloumn">
									<span>微信支付流水号</span>
									<span>{{listData.wechatNo}}</span>
								</div>
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>订单金额</span>
									<span>{{listData.orderAmount}}</span>
								</div>
								<div class="record_right flex_cloumn">
									<span>实付金额</span>
									<span>{{listData.orderAmount}}</span>
								</div>
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>收入金额</span>
									<span>{{listData.productDistributionAmount}}</span>
								</div>
							</div>
						</div>
					</el-dialog>
				</div>
			</div>
		</div>
		<no-active v-if="isActive == 3" @reFresh="init"></no-active>
	</div>
</template>

<script>
	import api from 'fetch/api'
	import { mapGetters } from "vuex"
	import NoActive from 'components/common/NoActive'


	export default {
		name: 'FinanceIncome',
		data () {
			return {
				templateList: [], // 列表数据
				currentPage: 1, // 查询的是第几页
				pageSize: 10, // 每页条数
				total: 1, // 列表数据总条数
				date:[], // 日期
				formLabelWidth: '120px',
				headRowHeight:{"height":"88px"},
				value13:["2018-08-05","2018-08-30"],
				dialogFormVisible:false,
				titleData:'流水详情',
				id:'',
				listData:{}, // 流水详情数据
				statsData:{} // 统计数据
			}
		},
		computed:{
			...mapGetters([
				"userId",
				'isActive'
			])
		},
		components: {
			NoActive
		},
		created(){
			this.date[1] = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() + 86400000 -1;
			this.date[0] = this.date[1] - 604800000 + 1;
			this.init();
		},
		methods: {
			init(){
				this.initTemplates();
				this.getSummary();
			},
			// 初始化数据
			initTemplates() {
				let conf = {
					startTime2: this.date[0],
					endTime2:this.date[1],
					pageNum: this.currentPage,
					pageSize: this.pageSize,
					storeId : this.$store.state.storeId
				}
				api.getIncomeDetailList(conf).then(res => {
					if(res.serviceCode == 'E000000000'){
						this.templateList = res.data.list
						this.total = res.data.total
					}
				});
			},
			// 日期改变调用
			changeDate(){
				// this.startTime = this.date[0];
				// this.endTime = this.date[1];
				this.initTemplates()
			},
			handleLook (valueId){ // 详情数据
				let conf = {
					orderId:valueId
				}
				api.getIncomeDetail2(conf).then(res => {
					if(res.serviceCode == "E000000000"){
						this.listData = res.data;
						if(res.data.incomeType == 1){
							this.listData.goosOriange = "入驻生产者发布"
						}else if(res.data.incomeType == 2){
							this.listData.goosOriange = "店铺发布"
						}
						this.dialogFormVisible = true;
					}
				});
			},
			getSummary(){// 统计数据
				api.getSummary({userId:this.userId,userType:2}).then(res => {
					if(res.serviceCode == "E000000000"){
						this.statsData = res.data;
					}else{
						this.$message.error(res.serviceMessage)
					}
				});
			},
			// 改变每页显示的条数重新渲染列表
			handleSizeChange(val) {
				this.pageSize = val
				this.initTemplates()
			},
			getNewDate(s){
				s = s.substring(0,s.length-2)
				return s
			},
			// 改变页码重新渲染列表
			handleCurrentChange(val) {
				this.currentPage = val
				this.initTemplates()
			},
			// 设置表格第一行的颜色
			getRowClass({ row, column, rowIndex, columnIndex }) {
				if (rowIndex == 0) {
					return {
						'height':'60px',
						'background':'#F9FAF9'
					}
				} else {
					return ''
				}
			}
		}
	}
</script>

<style lang="stylus" scoped>
	@import "~assets/styles/mixins"
	@import "~assets/styles/varibles"

	.flex_cloumn
		display flex
		flex-direction row
		justify-content space-between
	.finance-detail
		box-sizing border-box
		width 100%
		.finace-top
			background-color #ffffff
			display flex
			flex-direction row
			justify-content space-around
			.box
				position relative
				display flex
				flex-direction row
				padding-left 60px
				justify-content flex-start
				align-items center
				width 33.33%
				height 140px
				.left-icon
					color #ffffff
					font-size 30px
					border-radius 50%
					display block
					width 0.6rem
					height 0.6rem
					line-height 0.6rem
					text-align center
					background-color #FAA7BB
				.right-icon
					display flex
					flex-direction column
					justify-content flex-start
					margin-left 30px
					span:nth-child(1)
						height 42px
						font-size 30px
						font-weight 400
						color rgba(74,74,74,1)
						line-height 42px
					span:nth-child(2)
						height 20px
						font-size 14px
						font-weight 400
						color rgba(155,155,155,1)
						line-height 20px
			.box:before
				content ""
				position absolute
				right 0
				top 50%
				height 80px
				width 2px
				background rgba(230,230,230,.25)
				margin-top -40px
			.box:nth-child(2)
				.left-icon
					background-color #76D8C6
			.box:nth-child(3)
				.left-icon
					background-color #8AB8F3
		.finace-bottom
			.bottom-header
				display flex
				flex-direction row
				justify-content space-between
				margin 40px 0 20px 0
				span:nth-child(1)
					height:20px;
					font-size:14px;
					font-weight:400;
					color:rgba(155,155,155,1);
					line-height:20px;
				.arrow
					font-size 9px
					position absolute
					top 1px
					right 22px
					color #9B9B9B
			.list
				width 100%
				margin 20px auto
				overflow hidden
				border-radius .05rem
				background #fff
				padding 0 .2rem
				box-sizing border-box
				.list-table
					width 100%
					margin .2rem auto .3rem
					.head_pic
						width .4rem
						height .4rem
						display inline-block
						margin-right .05rem
				.pagination
					display flex
					justify-content flex-end
					align-items center
					padding-right .2rem
					margin-bottom .27rem
				.record_left,.record_right
					padding-bottom 5px
					width 370px
					height 20px
					line-height 20px
					border-bottom:1px solid rgba(230,230,230,.5);
					float left
				span:nth-child(1)
					height 20px
					font-size 14px
					font-weight 400
					color rgba(155,155,155,1)
					line-height 20px
				span.ellipsisForm
					text-align right
				.record_left
					margin-right 40px
				.row_box
					width 100%
					overflow hidden
					.child_box
						overflow hidden
						margin-bottom 30px
					.title
						height:17px;
						font-size:12px;
						font-weight:600;
						color:rgba(74,74,74,1);
						line-height:17px;


</style>


