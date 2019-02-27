<template>
	<div class='sharerule'>
		<div v-if="isActive == 4">
			<div class="layout-head">
				<span>分享规则查询</span>
				<el-button class="major-btn" type="primary" size="small" @click="linkToNewShare">新建<i class="el-icon-plus el-icon--right"></i></el-button>
			</div>
			<div class="serch_box">
				<el-input class="serchinput" v-model="input" placeholder="分享规则名称"></el-input>

				<el-select v-model="statusValue" placeholder="当前状态">
					<el-option
						v-for="item in statusOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>

				<el-select v-model="contantValue" placeholder="内容类目">
					<el-option
						v-for="item in contantOptions"
						:key="item.value"
						:label="item.label"
						:value="item.value">
					</el-option>
				</el-select>
				<el-button class="major-btn" @click="getRuleList">搜索</el-button>
			</div>
			<div class="list_box">
				<el-row :gutter="30">
					<el-col :span="8" v-for="(item, index) in ruleList.list" :key="index" >
						<el-card class="my_card">
							<div class="card_container">
								<div class="title type">
									{{item.shareName }}
								</div>
								<div class="title">
									<div class="left color-3">
										类目：
									</div>
									<div class="right">
										{{item.courseType == 1? "普通课程" : "类目课程"}}
									</div>
								</div>
								<div class="title">
									<div class="left color-3">
										内容范围：
									</div>
									<div class="right color-1" @click="lookShareClass(item.id)">
										查看分享课程
									</div>
								</div>
								<div class="title">
									<div class="left color-3">
										创建时间：
									</div>
									<div class="right">
										{{item.createDate}}
									</div>
								</div>
							</div>
							<div style="padding: 14px;">
								<div class="bottom clearfix">
									<time class="time" v-if="item.isEnable == 1"><span class="line_dian"></span> 已启用</time>
									<time class="time" v-if="item.isEnable == 0"><span class="wei_dian"></span> 未启用</time>
									<el-dropdown class="more" trigger="click" @command="dropdownclick($event,item)">
									<span class="el-dropdown-link ">
										<span class="color-2">更多</span><i class="el-icon-arrow-down el-icon--right"></i>
									</span>
										<el-dropdown-menu slot="dropdown">
											<el-dropdown-item command="1">
												<img :src="require('../../../assets/image/12055287055754398.png')" width="12px" height="7px" alt="" style="margin-right : 4px;">
												查看
											</el-dropdown-item>
											<el-dropdown-item v-if="item.isEnable == 1" command="2" >
												<img :src="require('../../../assets/image/845591454076565179.png')" width="12px" height="7px" alt="" style="margin-right : 4px;">
												<span class="color-1"> &nbsp;禁用</span>
											</el-dropdown-item>
											<el-dropdown-item v-if="item.isEnable == 0" command="3">
												<img :src="require('../../../assets/image/388110521741390559.png')" width="12px" height="7px" alt="" style="margin-right : 4px;">
												<span> &nbsp;启用</span>
											</el-dropdown-item>
											<!-- <el-dropdown-item command="3">删除</el-dropdown-item> -->
										</el-dropdown-menu>
									</el-dropdown>
									<div class="line"></div>
									<el-button type="text" class="button color-2" @click="linkToChangeRule(item.id ,item.courseType)">编辑</el-button>

								</div>
							</div>
						</el-card>
					</el-col>
				</el-row>
				<div class="page_box">
					<el-pagination
						@size-change="handleSizeChange"
						@current-change="handleCurrentChange"
						:current-page.sync="currentPage"
						:page-sizes="[9, 18, 27, 36]"
						layout="prev, pager, next , sizes, jumper"
						:total="ruleList.total"
					>
					</el-pagination>
				</div>
			</div>
			<!-- 禁用规则 -->
			<el-dialog
				:visible.sync="dialogVisible"
				:show-close="false"
				class="el-account-dialog"
				height="417px"
				width="650px"
				:center="true">
				<span class="head"><img :src="require('../../../assets/image/56082540668669639.png')" width="95px" height="95px" alt=""></span>
				<h2>您确定要禁用该规则吗?</h2>
				<h3>规则禁用后，已被分享的课程不受影响</h3>
				<span slot="footer" class="dialog-footer">
						<el-button class="cancel" @click="dialogVisible = false">取消</el-button>
						<el-button class="active-shop" type="primary" @click="disableRule">确定</el-button>
				</span>
			</el-dialog>
			<!-- 启用规则 -->
			<el-dialog
				:visible.sync="dialogVisibleQ"
				:show-close="false"
				class="el-account-dialog"
				height="417px"
				width="650px"
				:center="true">
				<span class="head"><img :src="require('../../../assets/image/56082540668669639.png')" width="95px" height="95px" alt=""></span>
				<h2>您确定要启用该规则吗?</h2>
				<h3></h3>
				<span slot="footer" class="dialog-footer">
						<el-button class="cancel" @click="dialogVisible = false">取消</el-button>
						<el-button class="active-shop" type="primary" @click="disableRule">确定</el-button>
				</span>
			</el-dialog>
			<!-- 查看分享课程 -->
			<el-dialog title="已添加内容" :visible.sync="lookShareClassStatus" width="70%" class="share_class_log">
				<el-table :data="lookShareClassData" stripe style="width : 100%;overflow : hidden;">
					<el-table-column align="center" property="" :formatter="getNum" label="序号"></el-table-column>
					<el-table-column align="center" property="courseName" label="课程名称"></el-table-column>
					<el-table-column align="center" property="hits" :formatter="liulanNumIsNull" label="浏览次数"></el-table-column>
					<el-table-column align="center" property="buyNumber" :formatter="liulanNumIsNull" label="购买次数"></el-table-column>
					<el-table-column align="center"  label="操作">
						<template slot-scope="scope">
							<el-button @click="deleteClass(scope.row.id)" size="mini">删除</el-button>
						</template>
					</el-table-column>
				</el-table>
				<!-- <div class="page_box">
					<el-pagination
						@size-change="handClassleSizeChange"
						@current-change="handlClasseCurrentChange"
						:current-page.sync="lookShareClassSize.currentClassPage"
						:page-sizes="[9, 18, 27, 36]"
						layout="prev, pager, next , sizes, jumper"
						:total="lookShareClassSize.total"
						>
					</el-pagination>
				</div> -->
				<div slot="footer" class="dialog-footer">
					<el-button type="primary" @click="lookShareClassStatus = false">确 定</el-button>
				</div>
			</el-dialog>
		</div>

		<no-active v-if="isActive == 3" @reFresh="getRuleList"></no-active>
	</div>
</template>

<script>
	import api from "../../../fetch/api";
	import NoActive from "components/common/NoActive";
	import { mapGetters } from "vuex";

	export default {
		name: "sharerule",
		data() {
			return {
				input: "",
				statusOptions: [
					{ value: 0, label: "未启用" },
					{ value: 1, label: "已启用" }
				],
				statusValue: null,
				contantOptions: [
					{ value: 1, label: "普通课程" },
					{ value: 2, label: "目录课程" }
				],
				contantValue: null,
				ruleList: [],
				currentDate: new Date(),

				currentPage: 1, // 分页页数
				pageSize: 9,
				queryData: {
					ruleId: null,
					step: 1,
					courseType: null
				},
				dialogVisible: false,
				dialogVisibleQ: false,
				params: {},
				lookShareClassStatus: false,
				ruleId: null,
				lookShareClassData: [],
				lookShareClassSize: {
					total: null,
					currentClassPage: 1,
					currentClassSize: 9999
				}
			};
		},
		computed: {
			...mapGetters(["isActive"])
		},
		components: {
			NoActive
		},
		created() {
			this.getRuleList();
		},
		methods: {
			// 获取分享规则列表
			getRuleList() {
				let params = {
					page: this.currentPage,
					size: this.pageSize,
					shareName: this.input,
					userId: this.$store.state.userId,
					isEnable: this.statusValue,
					courseType: this.contantValue
				};
				api.getClassRuleList(params).then(res => {
					if (res.success) {
						this.ruleList = res.data;
					}
				});
			},
			linkToNewShare() {
				this.$router.push({
					name: "shareNew"
				});
				sessionStorage.setItem("ruleId", null);
				sessionStorage.setItem("step", this.queryData.step);
				sessionStorage.setItem("courseType", null);
			},
			// 查看规则
			dropdownclick(val, item) {
				if (val == "1") {
					this.$router.push({
						name: "shareDetail",
						query: {
							ruleId: item.id
						}
					});
				} else if (val == "2") {
					this.dialogVisible = true;
					this.params = {
						id: item.id,
						isEnable: 0,
						createDate: item.createDate,
						courseType: item.courseType,
						createUserId: this.$store.state.userId,
						shareExplain: item.shareExplain,
						shareName: item.shareName
					};
				} else if (val == "3") {
					this.dialogVisibleQ = true;
					this.params = {
						id: item.id,
						isEnable: 1,
						createDate: item.createDate,
						courseType: item.courseType,
						createUserId: this.$store.state.userId,
						shareExplain: item.shareExplain,
						shareName: item.shareName
					};
				}
			},
			// 禁用/启用规则
			disableRule() {
				api.setClassRule(this.params).then(res => {
					if (res.data) {
						this.getRuleList();
						this.dialogVisible = false;
						this.dialogVisibleQ = false;
					} else {
						this.$message.error("错误");
					}
				});
			},
			linkToChangeRule(id, courseType) {
				this.$router.push({
					name: "shareNew"
				});
				sessionStorage.setItem("ruleId", id);
				sessionStorage.setItem("step", this.queryData.step);
				sessionStorage.setItem("courseType", courseType);
			},
			// 分页方法
			handleSizeChange(val) {
				this.pageSize = val;
				this.getRuleList();
			},
			handleCurrentChange(val) {
				this.getRuleList();
			},
			handClassleSizeChange(val) {
				this.lookShareClassSize.currentClassSize = val;
				this.lookShareClass(this.ruleId);
			},
			handlClasseCurrentChange(val) {
				this.lookShareClass(this.ruleId);
			},
			// 查看分享课程
			lookShareClass(id) {
				this.lookShareClassStatus = true;
				this.ruleId = id;
				let params = {
					page: 1,
					size: 999,
					ruleId: id,
					courseNumber: null,
					courseName: null
				};
				api.getStepTwoClassList(params).then(res => {
					this.lookShareClassData = res.list;
					this.lookShareClassSize.total = res.total;
				});
			},
			// 删除分享课程
			deleteClass(courseId) {
				let params = {
					ruleId: this.ruleId,
					courseId: courseId
				};
				api.deleteClassList(params).then(res => {
					if (res.success == true) {
						this.lookShareClass(this.ruleId);
						this.$message.success("删除成功");
					} else {
						this.$message.error(res.message);
					}
				});
			},
			liulanNumIsNull(row, column, cellValue, index) {
				if (cellValue == null) {
					return "0";
				} else {
					return cellValue;
				}
			},
			getNum(row, column, cellValue, index) {
				return index + 1;
			}
		}
	};
</script>
<style lang="stylus" scoped>
	.sharerule .list_box .my_card .more {
		border: 0;
	}

	.color-1 {
		color: #6CDDC7;
	}

	.color-2 {
		color: #4A4A4A;
	}

	.color-3 {
		color: #9B9B9B;
	}

	.sharerule {
		width: 100%;
		box-sizing: border-box;
		font-size: 12px;
		overflow-y: scroll;

		.el-account-dialog .el-dialog--center .el-dialog__footer .dialog-footer .cancel {
			color: #9B9B9B;
			background: #fff;
			border: 1px solid #E6E6E6;
			padding: 10px 50px;
			width: auto;
			height: auto;
		}

		.el-account-dialog .el-dialog--center .el-dialog__footer .dialog-footer .active-shop {
			padding: 10px 50px;
			width: auto;
			height: auto;
		}

		.head {
			width: 100%;
			margin: 0 auto 0.1rem;
			font-size: 0.2rem;
			color: #9b9b9b;
			line-height: 0.2rem;
			display: flex;
			justify-content: center;
			align-items: center;
			justify-content: space-between;
		}

		.serch_box {
			width: 100%;
			overflow: hidden;
			padding: 0 0 20px 0;
			box-sizing: border-box;

			.serchinput {
				width: 200px;
			}
		}

		.list_box {
			width: 100%;
			overflow: hidden;
			box-sizing: border-box;

			.my_card {
				margin-bottom: 30px;
				cursor: pointer;

				.card_container {
					width: 100%;
					height: 150px;
				}

				.line {
					float: right;
					width: 2px;
					height: 15px;
					background: transparent;
					margin-left: 5px;
					margin-right: 5px;
				}

				.line_dian {
					width: 10px;
					height: 10px;
					float: left;
					border-radius: 50%;
					background: #6CDDC7;
					margin-right: 5px;
				}

				.wei_dian {
					width: 10px;
					height: 10px;
					float: left;
					border-radius: 50%;
					background: #ddd;
					margin-right: 5px;
				}

				.title {
					font-size: 14px;
					display: flex;
					margin-bottom: 20px;

					.left {
						width: 80px;
					}

					.right {
						flex: 1;
					}

					&.type {
						font-size: 20px;
						font-weight: 600;
						line-height: 28px;
					}
				}

				.more {
					float: right;

					.el-dropdown-menu {
						width: 150px;
					}

					.el-dropdown-link.el-dropdown-selfdefine {
						color: #9B9B9B;
					}
				}
			}

			.page_box {
				text-align: right;
			}
		}

		.time {
			font-size: 13px;
			color: #999;
		}

		.bottom {
			margin-top: 13px;
			line-height: 15px;
		}

		.button {
			padding: 0;
			float: right;
		}

		.image {
			width: 100%;
			display: block;
		}

		.clearfix:before, .clearfix:after {
			display: table;
			content: '';
		}

		.clearfix:after {
			clear: both;
		}

		.share_class_log {
			.dialog-title {
				font-size: 18px;
				font-weight: bold;
			}

			.el-button--primary {
				border-color: #6CDDC7;
			}

			.el-dialog__body {
				display: block;

				.page_box {
					text-align: right;
				}
			}
		}
	}
</style>
