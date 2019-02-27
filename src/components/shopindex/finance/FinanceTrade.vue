<template>
	<div style="width:100%;">
		<div class="finance-detail" v-if="isActive == 4">
			<div class="head layout-head">
				<h3>交易明细</h3>
				<div class="bottom-header">
						<el-date-picker
								v-model="date"
								type="daterange"
								start-placeholder="开始日期"
								end-placeholder="结束日期"
								format="yyyy-MM-dd"
								value-format="timestamp"
								@change="changeDate()"
								:default-time="['00:00:00', '23:59:59']">
						</el-date-picker>
						<i class="iconfont icon-jiantou arrow"></i>
				</div>
			</div>
			<div class="finace-bottom">
				<div class="list">
					<div class="list-table list-thead-gray">
						<el-table
								:data="templateList"
								stripe
								:row-style="headRowHeight"
								:header-cell-style="getRowClass"
								style="width: 100%">
							<el-table-column
									label="交易时间"
									align="center"
									min-width="150"
									prop="createTime">
								<template slot-scope="scope">
									{{getNewDate(scope.row.createTime)}}
								</template>
							</el-table-column>
							<el-table-column
									prop="productName"
									label="商品名称"
									align="center"
									min-width="150">
							</el-table-column>
							<el-table-column
									label="流水类型"
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
									prop="orderAmount"
									label="金额"
									align="center"
									min-width="170">
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
						<div class = "row_box">
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>交易时间</span>
									<span>{{listData.createTime}}</span>
								</div>
								<div class="record_right flex_cloumn">
									<span>流水类型</span>
									<span v-if="listData.orderType==100">分销订单收入</span>
									<span v-if="listData.orderType==101">分销赠送订单收入 </span>
									<span v-if="listData.orderType==102">分销拼团订单收入</span>
									<span v-if="listData.orderType==103">分销分享订单收入</span>
								</div>
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>发生金额</span>
									<span>¥{{listData.orderAmount}}</span>
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
									<span v-if="listData.productType==1">付费课程</span>
									<span v-else-if="listData.productType==2">付费专栏</span>
								</div>
							</div>
							<div class = "child_box">
								<div class= "record_left flex_cloumn">
									<span>商品来源</span>
									<span>{{listData.source}}</span>
								</div>
								<div class="record_right flex_cloumn">
									<span>作者</span>
									<span>{{listData.authorName}}</span>
								</div>
							</div>
						</div>
					</el-dialog>
				</div>
			</div>
		</div>
		<no-active v-if="isActive == 3" @reFresh="getTradeList"></no-active>
	</div>
</template>

<script>
	import api from 'fetch/api'
	import { mapGetters } from 'vuex'
	import NoActive from 'components/common/NoActive'

	export default {
		name: 'FinanceIncome',
		data () {
			return {
				templateList: [], // 列表数据
				currentPage: 1, // 查询的是第几页
				pageSize: 10, // 每页条数
				total: 1, // 列表数据总条数
				searchName: '', //  搜索框的等级名称
				formLabelWidth: '120px',
				headRowHeight:{"height":"88px"},
				value13:["2018-08-05","2018-08-30"],
				dialogFormVisible:false,
				titleData:'流水详情',
				date:[], // 日期
				startTime: '', // 开始时间
				endTime:'', // 结束时间
				listData:{} // 流水详情数据
			}
		},
		computed: {
			...mapGetters([
				'isActive'
			])
		},
		created(){
			this.date[1] = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() + 86400000 -1;
			this.date[0] = this.date[1] - 604800000 + 1;
			this.getTradeList()
		},
		components: {
			NoActive
		},
		methods: {
			getTradeList(){
				let conf = {
					startTime2: this.date[0],
					endTime2:this.date[1],
					pageNum: this.currentPage,
					pageSize: this.pageSize,
					storeId : this.$store.state.storeId
				}
				api.getTradeList(conf).then(res => {
					if(res.serviceCode == 'E000000000'){
						this.templateList = res.data.list
						this.total = res.data.total
					}
				});
			},
			getNewDate(s){
				s = s.substring(0,s.length-2)
				return s
			},
			// 日期改变调用
			changeDate(){
				this.getTradeList()
			},
			// 改变每页显示的条数重新渲染列表
			handleSizeChange(val) {
				this.pageSize = val
				this.getTradeList()
			},
			// 改变页码重新渲染列表
			handleCurrentChange(val) {
				this.currentPage = val
				this.getTradeList()
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
			},
			handleLook (valueId){
				api.getTradeDetail({orderId:valueId}).then(res => {
					if(res.serviceCode == 'E000000000'){
						this.listData = [];
						this.listData = res.data;
						this.dialogFormVisible = true;
					}
				});
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
		padding 0
		.head
			.bottom-header
				margin-bottom .2rem
				display flex
				flex-direction row
				justify-content space-between
				span:nth-child(1)
					height .2rem
					font-size 14px
					font-weight 400
					color rgba(155,155,155,1)
					line-height .2rem
				.arrow
					font-size 9px
					position absolute
					top 1px
					right .2rem
					color #9B9B9B
		.finace-bottom
			.list
				width 100%
				margin 0 auto
				overflow-x hidden
				overflow-y auto
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
					width 3.7rem
					height .2rem
					line-height .2rem
					border-bottom:1px solid rgba(230,230,230,.5);
					float left
				span:nth-child(1)
					height .2rem
					font-size 14px
					font-weight 400
					color rgba(155,155,155,1)
					line-height .2rem
				span.ellipsisForm
					text-align right
				.record_left
					margin-right .4rem
				.row_box
					width 100%
					overflow hidden
					.child_box
						overflow hidden
						margin-bottom .3rem
					.title
						height .17rem
						font-size 12px
						font-weight 600
						color rgba(74,74,74,1)
						line-height .17rem
</style>

