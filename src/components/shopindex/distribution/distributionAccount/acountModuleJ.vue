
<template>
    <div class="account_module_j">
	    <div class="btm20">
		    <el-select v-model="statusVal" placeholder="状态">
			    <el-option
				    v-for="item in statusOptions"
				    :key="item.value"
				    :label="item.label"
				    :value="item.value">
			    </el-option>
		    </el-select>
			<el-date-picker
					v-model="timeScope"
					type="daterange"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					@change="dateValChange($event)"
					value-format="timestamp">
			</el-date-picker>
		    <el-button type="primary" class="left20" @click="serchAccountModuleData">搜索</el-button>
	    </div>
	    <el-table stripe :data="accountModuleShoppingList">
		    <el-table-column align="center" label="完成时间" >
			    <template slot-scope="scope">
				    {{getTime(scope.row.completeTime)}}
			    </template>
		    </el-table-column>
		    <el-table-column align="center" prop="money" label="提现金额">
				<template slot-scope="scope">
					{{scope.row.money}}元
				</template>
			</el-table-column>
		    <el-table-column align="center" label="状态">
			    <tem.plate slot-scope="scope">
				    <div class="shopping_status_box" v-if="scope.row.withdrawStatus == 0">
					    <i class="status_dian shangjia"></i>申请提现
				    </div>
				    <div class="shopping_status_box" v-if="scope.row.withdrawStatus == 1">
					    <i class="status_dian shangjia"></i>提现成功
				    </div>
				    <div class="shopping_status_box" v-if="scope.row.withdrawStatus == 2">
					    <i class="status_dian weishangjia"></i>提现失败
				    </div>
			    </tem.plate>
		    </el-table-column>
		    <el-table-column align="center" prop="bank" label="入账开户银行"></el-table-column>
		    <el-table-column align="center" label="剩余可提现">
			    <template slot-scope="scope">
				    {{scope.row.surplusMoney}}元
			    </template>
		    </el-table-column>
		    <el-table-column label="操作">
			    <template slot-scope="scope">


				    <el-button size="mini" @click="openAccountDetailDalog(scope.row)">详情</el-button>
					<el-button size="mini" v-if="scope.row.withdrawStatus == 2" @click="openDetailDalog(scope.row)">原因</el-button>
			    </template>
		    </el-table-column>
	    </el-table>
	    <div class="pagination">
		    <el-pagination
			    @current-change="handlModuleJPageChange"
			    :current-page.sync="pageData.page"
			    :page-sizes="[10]"
			    :page-size="pageData.size"
			    layout="prev, pager, sizes,  next , jumper"
			    :total="pageData.total">
		    </el-pagination>
	    </div>



	    <!--提现申请dalog-->
	    <el-dialog class="tixianjilu_dalog_box" title="申请详情" :visible.sync="tixianjiluDalogShow" width="50%">
		    <div class="tixianjilu_dalog_main_box">
			    <div class="data_box_ul">
				    <div class="data_box_li">
					    <span class="text_title">提现时间</span>
					    <span class="rit">{{getTime(lineData.createTime)}}</span>
				    </div>
				    <div class="data_box_li">
					    <span class="text_title">状态</span>
					    <span class="rit">{{lineData.withdrawStatus == 0 ? '申请提现' : lineData.withdrawStatus == 1 ?  '提现成功' : lineData.withdrawStatus == 2 ? "提现失败" : ""}}</span>
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
		<!--提现申请dalog-->
		<el-dialog class="shibai_dalog_box" title="原因" :visible.sync="shibaiDalogShow" width="50%">
			<div class="detail_box" v-html="lineData.reason">
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
export default {
    name: 'account_module_j',
    data () {
        return {
	        accountModuleShoppingList :[],
	        statusVal : null,
	        statusOptions : [
		        {
			        value: -1,
			        label: '全部'
		        },
		        {
			        value: 1,
			        label: '提现成功'
		        },
		        {
			        value: 2,
			        label: '提现失败'
		        }
	        ],
	        tixianjiluDalogShow : false,
			shibaiDalogShow : false,
			timeScope : [],
	        pageData : {
		        page : 1,
		        size : 10,
		        total : null
	        },
	        lineData : {}

        }
    },
	created(){
		this.timeScope[1] = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() + 86400000 -1;
		this.timeScope[0] = this.timeScope[1] - 604800000 + 1;
    	this.getTixianjiluListData();
	},
	destroyed(){
    	this.tixianjiluDalogShow = false;
	},
    methods: {
    	getTixianjiluListData(){
    		let params = {
			    page : this.pageData.page,
			    pageSize : this.pageData.size,
				withdrawStatus : this.statusVal,
			    startTime : this.timeScope[0],
			    endTime : this.timeScope[1],
				userId : this.$store.state.userId,
				userType : 2
		    }
    		api.withdrawRecordApiList(params).then(res => {
    		    console.log(res)
    		    if(res.serviceCode == 'E000000000'){
    		        this.accountModuleShoppingList = res.data.list;
    		        this.pageData.total = res.data.total;
    		    }else{
    		        this.$message.error(res.serviceMessage);
    		    }
    		})
	    },
	    serchAccountModuleData(){
	    	if(!this.timeScope[0]){
	    		this.$message.error("请选择开始时间")
		    }else if(!this.timeScope[1]){
			    this.$message.error("请选择结束时间")
		    }else{
				this.getTixianjiluListData();
		    }
	    },
	    openAccountDetailDalog(lineData){
		    //提现记录详情
		    // this.lineData = lineData;
		    let params = {
			    id : lineData.id
		    }
		    api.withdrawApiDetail(params).then(res => {
			    console.log(res)
			    if(res.serviceCode == 'E000000000'){
				    this.tixianjiluDalogShow = true;
				    this.lineData = res.data;
			    }else{
				    this.$message.error(res.serviceMessage);
			    }
		    })

	    },
		openDetailDalog(data){
			let params = {
				id : data.id
			}
			api.withdrawApiDetail(params).then(res => {
				console.log(res)
				if(res.serviceCode == 'E000000000'){
					this.lineData = res.data;
					this.shibaiDalogShow = true;
				}else{
					this.$message.error(res.serviceMessage);
				}
			})
		},
		dateValChange(val){
			this.timeScope[1] = this.timeScope[1] + 86400000 -1;
		},
	    //分页改变
	    handlModuleJPageChange(page){
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
.account_module_j{
	background: #fff;
	padding : 20px 0;
	.left20{
		margin-left : 20px;
	}
	.btm20{
		margin-bottom : 20px;
	}
	.pagination{
		text-align : right ;
		margin-top:20px;
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
			background: #F42C21;
		}
	}
	.tixianjilu_dalog_box{
		.tixianjilu_dalog_main_box{
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
	.shibai_dalog_box{
		.detail_box{
			width:100%;
		}
	}
}
</style>
