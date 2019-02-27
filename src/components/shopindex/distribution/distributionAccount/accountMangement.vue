
<template>
    <div class="distribution_acount">
	    <div class="layout-head">
		    <span>提现申请</span>
	    </div>
	    <div class="roid_top_content">
		    <el-tabs v-model="activeName" @tab-click="handleClick">
			    <el-tab-pane label="提现申请" name="0">
				    <div class="shouyi_box" v-if="userPriceNum">
					    <div class="box__main">
						    <div class="box__main_right">
							    <p class="bold">&yen;{{userPriceNum.balance}}</p>
							    <p class="small">可提现金额</p>
						    </div>
					    </div>

					    <div class="box__main">
						    <div class="box__main_right">
							    <p class="bold">&yen;{{userPriceNum.frozenAmount}}</p>
							    <p class="small">冻结提现</p>
						    </div>
					    </div>

					    <div class="box__main">
						    <div class="box__main_right">
							    <el-button type="primary" class="serch_btn" @click="toChooseMoneyPage">提现</el-button>
						    </div>
					    </div>
				    </div>
			    </el-tab-pane>
			    <el-tab-pane label="提现记录" name="1">
				    <accountJ v-if="activeName == 1"></accountJ>
			    </el-tab-pane>
		    </el-tabs>
	    </div>


		<div class="table_box_account" v-if="activeName == 0">
			<div class="title_box">
				<div class="left">提现申请</div>
				<div class="right">
					<el-date-picker
						v-model="timeScope"
						type="daterange"
						range-separator="至"
						start-placeholder="开始时间"
						end-placeholder="结束时间"
						@change="dateValChange($event)"
						value-format="timestamp">
					</el-date-picker>
				</div>
			</div>

			<div class="account_data_box">
				<el-table stripe :data="shoppingList">
					<el-table-column align="center" label="提现时间" >
						<template slot-scope="scope">
							{{getTime(scope.row.createTime)}}
						</template>
					</el-table-column>
					<el-table-column align="center" prop="money" label="提现金额">
						<template slot-scope="scope">
							{{scope.row.money}}元
						</template>
					</el-table-column>
					<el-table-column align="center" label="状态">
						<template slot-scope="scope">
							<div class="shopping_status_box" v-if="scope.row.withdrawStatus == 0">
								<i class="status_dian shangjia"></i>提现申请
							</div>
							<div class="shopping_status_box" v-if="scope.row.withdrawStatus == 1">
								<i class="status_dian shangjia"></i>提现成功
							</div>
							<div class="shopping_status_box" v-if="scope.row.withdrawStatus == 2">
								<i class="status_dian shangjia"></i>提现失败
							</div>
							<div class="shopping_status_box" v-if="scope.row.withdrawStatus == 3">
								<i class="status_dian shangjia"></i>第三方支付异常
							</div>
						</template>
					</el-table-column>
					<el-table-column align="center" prop="bank" label="入账开户银行"></el-table-column>
					<el-table-column align="center" label="操作">
						<template slot-scope="scope">
							<el-button size="mini" @click="openDetailDalog(scope.row)">详情</el-button>
						</template>
					</el-table-column>
				</el-table>



				<div class="pagination">
					<el-pagination
						@current-change="handlAccountPageChange"
						:current-page.sync="pageData.page"
						:page-sizes="[10]"
						:page-size="pageData.size"
						layout="prev, pager, sizes,  next , jumper"
						:total="pageData.total">
					</el-pagination>
				</div>
			</div>
		</div>


	    <!--提现申请dalog-->
	    <el-dialog class="tixianshenqing_dalog_box" title="申请详情" :visible.sync="tixianshenqingDalogShow" width="50%">
		    <div class="tixianshenqing_dalog_main_box">
				<div class="data_box_ul">
					<div class="data_box_li">
						<span class="text_title">提现时间</span>
						<span class="rit">{{getTime(lineData.createTime)}}</span>
					</div>
					<div class="data_box_li">
						<span class="text_title">状态</span>
						<span class="rit">{{lineData.withdrawStatus == 0 ? '申请提现' : lineData.withdrawStatus == 1 ?  '提现成功' : lineData.withdrawStatus == 2 ? "提现失败" : "第三方支付异常,待确认"}}</span>
					</div>
				</div>
			    <div class="data_box_ul">
				    <div class="data_box_li">
					    <span class="text_title">提现金额</span>
					    <span class="rit">{{lineData.money}}元</span>
				    </div>
				    <div class="data_box_li noborder">

				    </div>
			    </div>
			    <div class="data_box_ul">
				    <div class="data_box_li noborder">
					    <p class="zhuanzhangshanghu_title">转账账户</p>
				    </div>
				    <div class="data_box_li noborder">

				    </div>
			    </div>

			    <div class="data_box_ul">
				    <div class="data_box_li">
					    <span class="text_title">公司</span>
					    <span class="rit">{{lineData.company}}</span>
				    </div>
				    <div class="data_box_li">
					    <span class="text_title">对公账号</span>
					    <span class="rit">{{lineData.bankAccount}}</span>
				    </div>
			    </div>
			    <div class="data_box_ul">
				    <div class="data_box_li">
					    <span class="text_title">开户银行</span>
					    <span class="rit">{{lineData.bank}}</span>
				    </div>
				    <div class="data_box_li noborder">

				    </div>
			    </div>
		    </div>
		    <!--<span slot="footer" class="dialog-footer">-->
			    <!--<el-button @click="tixianshenqingDalogShow = false">取 消</el-button>-->
			    <!--<el-button type="primary">确定</el-button>-->
		    <!--</span>-->
	    </el-dialog>
    </div>
</template>

<script>
	import api from 'fetch/api'
	import accountJ from './acountModuleJ'
export default {
    name: 'distribution_ccount',
    data () {
        return {
	        activeName : 0,
	        timeScope : [],
	        shoppingList : [],
	        pageData : {
		        page : 1,
		        size : 10,
		        total : null
	        },
	        tixianshenqingDalogShow : false,
	        lineData : {},
	        userPriceNum : {}
        }
    },
	components : {
		accountJ
	},
	destroyed(){
    	this.tixianshenqingDalogShow = false
	},
	created(){
		this.timeScope[1] = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() + 86400000 -1;
		this.timeScope[0] = this.timeScope[1] - 604800000 + 1;
		this.withdrawApplyListFunc();
		this.userAmountFunc();
	},
    methods: {
    	//个人账户详情
	    userAmountFunc(){
	    	let params ={
			    userId : this.$store.state.userId,
				userType : 2
		    }
	    	api.userApiAmount(params).then(res => {
	    	    console.log(res)
	    	    if(res.serviceCode == 'E000000000'){
	    	        this.userPriceNum = res.data;
	    	    }else{
	    	        this.$message.error(res.serviceMessage);
	    	    }
	    	})
	    },
    	//提现申请记录
	    withdrawApplyListFunc(){
	    	let params = {
			    page : this.pageData.page,
			    pageSize : this.pageData.size,
				withdrawStatus : 0,
			    startDate : this.timeScope[0],
			    endDate : this.timeScope[1],
				userId : this.$store.state.userId,
				userType : 2
		    }
	    	api.withdrawApplyApiList(params).then(res => {
	    	    console.log(res)
	    	    if(res.serviceCode == 'E000000000'){
	    	        this.shoppingList = res.data.list;
	    	        this.pageData.total = res.data.total;
	    	    }else{
	    	        this.$message.error(res.serviceMessage);
	    	    }
	    	})
	    },
	    openDetailDalog(lineData){
	    	//提现记录详情
			// this.lineData = lineData;
			let params = {
				id : lineData.id
			}
			api.withdrawApplyApiDetail(params).then(res => {
			    console.log(res)
			    if(res.serviceCode == 'E000000000'){
				    this.tixianshenqingDalogShow = true;
				    this.lineData = res.data;
			    }else{
			        this.$message.error(res.serviceMessage);
			    }
			})

	    },
	    toChooseMoneyPage(){
	    	this.$router.push({
			    name : "chooseMoney"
		    })
	    },
	    handleClick(tab, event) {
		    if(this.activeName == 0){
				this.withdrawApplyListFunc();
		    }
	    },
	    dateValChange(val,date){
		    // if(date == 'start'){
			//     this.endTime = this.startTime + 604800000 -1
		    // }else{
			//     this.startTime = this.endTime - 604800000 +1
		    // }
		    this.withdrawApplyListFunc();
	    },
	    //分页改变
	    handlAccountPageChange(page){
		    this.pageData.page = page
		    this.getShenhePeddleGoodsListFunc();
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
	    }
    }
}
</script>

<style lang="stylus" scoped>
.distribution_acount{
	width:100%;
	.roid_top_content{
		background: #fff;
		padding : 20px;
		overflow : hidden;
		margin-top:20px;
		.shouyi_box{
			width : 100%;
			box-sizing : border-box;
			display : flex;
			.box__main{
				flex : 1;
				padding : 40px;
				text-align : center ;
				border-right : 1px solid #ddd;
				.box__main_right{
					float: left ;
					line-height : 30px;
					width : 100%;
					text-align :  center ;
					.bold{
						font-size : 30px;
					}
					.small{
						color: #9B9B9B;
					}
				}
				.bg_1{
					background : #FAA7BB;
				}
				.bg_2{
					background : #76D8C6;
				}
				.bg_3{
					background : #8AB8F3;
				}
				.bg_4{
					background  : #9FB6FF;
				}
				.bg_5{
					background  : #90DDF5;
				}
				.bg_4{
					background  : #F9A3D6;
				}

			}
		}
	}
	.table_box_account{
		padding-top : 10px;
		.title_box{
			color: #9b9b9b;
			padding:20px 0;
			overflow : hidden;
			.left{
				float : left;
			}
			.right{
				float : right;

			}
		}
		.account_data_box{
			background: #fff;
			padding : 20px;
			overflow : hidden;
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
					background: #F42C21;
				}
			}
		}
		.pagination{
			text-align : right ;
			margin-top:20px;
		}
	}
	.tixianshenqing_dalog_box{
		.tixianshenqing_dalog_main_box{
			width : 100%;
			padding:25px;
			box-sizing : border-box;

			.data_box_ul{
				display : flex;
				margin-top : 25px;
				justify-content : space-around;
				.data_box_li{
					min-width : 46%;
					padding:5px;
					display : flex;
					justify-content : space-between;
					border-bottom :1px solid  #E6E6E6;
					.text_title{
						color: #9B9B9B
					}
					.rit{
						color: #4A4A4A
					}
				}
				.data_box_li.noborder{
					border : 1px solid transparent;
				}
			}
			.zhuanzhangshanghu_title{
				margin-top : 15px;
				font-weight : bold;
			}
		}
	}
}
</style>
