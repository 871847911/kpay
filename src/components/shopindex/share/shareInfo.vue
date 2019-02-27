<template>
	<div class='shareinfo'>
		<div v-if="isActive == 4">
			<div class="layout-head">
				<span>分享信息统计</span>
			</div>
			<div class="info_btn_box">
				<el-select v-if="isShop" v-model="value" placeholder="分享规则名称">
					<el-option
						v-for="item in options"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
				<el-input class="width300" v-model="shareName" placeholder="课程名称"></el-input>
				<el-button class="major-btn" @click="getList">搜索</el-button>
			</div>
			<div class="info_box">
				<p class="color3">
					课程总计: <span class="color1">{{statisticalData.total}}</span> &nbsp;&nbsp; | &nbsp;&nbsp;
					被分享次数: <span class="color1">{{totalShareNum}}次</span> &nbsp;&nbsp; | &nbsp;&nbsp;
					新授权用户: <span class="color1">{{totalNewUserNum}}</span> &nbsp;&nbsp; | &nbsp;&nbsp;
				</p>
				<el-table :data="tableData" style="width: 100%">
					<el-table-column align="center" type="index" :index="setIndex" label="序号" ></el-table-column>
					<el-table-column align="center" prop="courseName" label="课程名称" ></el-table-column>
					<el-table-column align="center" v-if="isShop" prop="createUser" label="课程作者"></el-table-column>
					<el-table-column align="center" prop="shareNum" label="被分享次数" :formatter="cishuForm"></el-table-column>
					<el-table-column align="center" prop="newUserNum" label="新授权用户" :formatter="cishuForm"></el-table-column>
				</el-table>
				<div class="page_box">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage"
						:page-sizes="[10, 20, 50]"
						:page-size="100"
						layout=" prev, pager ,next , sizes ,jumper"
						:total="total">
					</el-pagination>
				</div>
			</div>
		</div>

		<no-active v-if="isActive == 3" @reFresh="init"></no-active>
	</div>
</template>
<script>
	import api from "fetch/api";
	import NoActive from "components/common/NoActive";
	import { mapGetters } from "vuex";

	export default {
		name: "shareinfo",
		data() {
			return {
				options: [],
				value: "",
				shareName: null,
				tableData: [],
				statisticalData: {},
				currentPage: 1,
				pageSize: 10,
				total: null,
				totalShareNum: 0,
				totalNewUserNum: 0,
				isShop: true
			};
		},
		computed: {
			...mapGetters(["isActive"])
		},
		components: {
			NoActive
		},
		created() {
			this.init();
		},
		methods: {
			init() {
				this.getList();
				this.getTotalList();
				this.getRuleList();
				if (this.$route.path == "/index/ordershareinfo") {
					this.isShop = false;
				} else {
					this.isShop = true;
				}
			},
			// 获取分享信息
			getList() {
				let params = {
					page: this.currentPage,
					size: this.pageSize,
					courseName: this.shareName,
					courseNumber: null,
					ruleId: this.value
				};
				api.getStepTwoClassList(params).then(res => {
					this.statisticalData = res;
					this.tableData = res.list;
					this.total = res.total;
				});
			},
			getTotalList() {
				let params = {
					page: 1,
					size: 99999,
					courseNumber: null,
					courseName: null
				};
				api.getStepTwoClassList(params).then(res => {
					res.list.map((val, index) => {
						this.totalShareNum += val.shareNum;
						this.totalNewUserNum += val.newUserNum;
					});
				});
			},
			// 获取规则列表
			getRuleList() {
				let params = {
					page: this.currentPage,
					size: this.pageSize,
					userId: this.$store.state.userId,
					isEnable: null,
					courseType: null
				};
				api.getClassRuleList(params).then(res => {
					if (res.success) {
						this.options = res.data.list.map((val, index) => {
							return {
								value: val.id,
								label: val.shareName
							};
						});
					}
				});
			},
			handleSizeChange(val) {
				this.pageSize = val;
				this.getList();
			},
			handleCurrentChange(val) {
				this.getList();
			},
			setIndex(index) {
				return index + 1 + this.pageSize * (this.currentPage - 1);
			},
			cishuForm(row, column, cellValue, index) {
				if (cellValue == null) {
					return "0";
				} else {
					return cellValue;
				}
			}
		}
	};
</script>
<style lang="stylus" scoped>
	.shareinfo {
		width: 100%;
		box-sizing: border-box;
		font-size: 12px;
		overflow-y: scroll;

		.color1 {
			color: #6CDDC7;
		}

		.color2 {
			color: #169BD5;
		}

		.color3 {
			color: #9B9B9B;
			margin-bottom: .2rem;
		}

		.width300 {
			width: 300px;
		}

		.info_btn_box {
			box-sizing: border-box;
		}

		.info_box {
			margin-top: 10px;
			background: #fff;
			padding: 20px 30px;
			box-sizing: border-box;
			border-radius: 2px;
		}

		.page_box {
			text-align: right;
			margin-top: 20px;
		}
	}
</style>
