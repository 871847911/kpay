
<template>
    <div class="settlement_mangement">
	    <div class="layout-head">
		    <span>结算记录</span>
	    </div>
	    <div class="serch_box">
		    <el-select v-model="settlementShelvesStatusVal" placeholder="状态" class="shelves_status_select">
			    <el-option v-for="item in settlementShelvesStatusOption" :key="item.value" :label="item.label" :value="item.value"></el-option>
		    </el-select>
		    <el-date-picker
			    v-model="settlementTimeScope"
			    type="daterange"
			    range-separator="至"
			    start-placeholder="开始时间"
			    end-placeholder="结束时间"
			    value-format="timestamp">
		    </el-date-picker>
		    <el-button type="primary" @click="getSettlementShoppingListFnc" class="serch_btn">搜索</el-button>
	    </div>
	    <div class="settlement_content">
		    <el-table stripe :data="shoppingList">
			    <el-table-column align="center" label="时间" >
				    <template slot-scope="scope">
					    {{getTime(scope.row.date)}}
				    </template>
			    </el-table-column>
			    <el-table-column align="center" label="状态">
				    <template slot-scope="scope">
					    <div class="states_box">{{scope.row.status == 0 ?'未结算' : '已结算'}}</div>
				    </template>
			    </el-table-column>
			    <el-table-column align="center"  label="结算金额">
				    <template slot-scope="scope">
					    {{scope.row.settlementMoney ? scope.row.settlementMoney : 0}}元
				    </template>
			    </el-table-column>
			    <el-table-column align="center" min-width="50" label="操作">
				    <template slot-scope="scope" >
					    <div class="btn_group">
						    <el-button size="mini" @click="toSettlementDetailPage(scope.row)">查看</el-button>
					    </div>
				    </template>
			    </el-table-column>
		    </el-table>
		    <div class="pagination">
			    <el-pagination
				    @current-change="handlSettlementPageChange"
				    :current-page.sync="pageData.page"
				    :page-sizes="[10]"
				    :page-size="pageData.size"
				    layout="prev, pager, sizes,  next , jumper"
				    :total="pageData.total">
			    </el-pagination>
		    </div>
	    </div>
    </div>
</template>

<script>
	import api from 'fetch/api'
export default {
    name: 'settlement_mangement',
    data () {
        return {
	        settlementShoppingNameVal : null,
	        settlementShelvesStatusVal : null,
	        settlementShelvesStatusOption :[
		        {value : -1 , label : '全部'},
		        {value : 0 , label : '待结算'},
		        {value : 1 , label : '已结算'}
	        ],
	        shoppingList : [],
	        settlementTimeScope: [],
	        pageData : {
		        page : 1,
		        size : 10,
		        total : null
	        },
        }
    },
	created(){
		this.settlementTimeScope[1] = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() + 86400000 -1;
		this.settlementTimeScope[0] = this.settlementTimeScope[1] - 604800000 + 1;
    	this.getSettlementShoppingListFnc();
	},
    methods: {
    	getSettlementShoppingListFnc(){
    		let params = {
			    userId : this.$store.state.userId,
			    userType : 4,
			    page : this.pageData.page,
				settleStatus : this.settlementShelvesStatusVal,
			    pageSize : this.pageData.size,
				startTime : this.settlementTimeScope[0],
				endTime : this.settlementTimeScope[1]
		    }
    		api.settlementApiRecord(params).then(res => {
    		    console.log(res)
    		    if(res.serviceCode == 'E000000000'){
    		        this.shoppingList = res.data.list;
    		        this.pageData.total = res.data.total;
    		    }else{
    		        this.$message.error(res.serviceMessage);
    		    }
    		})
	    },
	    //结算详情
	    toSettlementDetailPage(row){
    		this.$router.push({
			    name : 'settlementDetail',
			    query:{
				    date : row.date,
					status : row.status
			    }
		    })
	    },
	    //分页改变
	    handlSettlementPageChange(page){
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
.settlement_mangement{
	width: 100%;
	.serch_box{
		width:100%;
		margin-top : 32px;
		.shelves_status_select{
			width:140px;
		}
		.shopping_name_val{
			width:300px;
			margin-left:10px;
		}
	}
	.settlement_content{
		background: #fff;
		text-align : center;
		overflow : hidden;
		padding : 20px;
		margin-top:10px;
		.pagination{
			text-align : right ;
			margin-top:20px;
		}
	}

}
</style>
