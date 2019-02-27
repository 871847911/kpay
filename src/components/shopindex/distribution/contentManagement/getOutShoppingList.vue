
<template>
    <div class="get_out_shopping_list">
	    <div class="layout-head">
		    <span>违规商品</span>
	    </div>
	    <p class="weigui_shopping_title">违规商品无法在分销中心上架</p>
	    <div class="get_out_shopping_content">
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
			    <el-table-column align="center" prop="goodsName" label="商品名称" ></el-table-column>
			    <el-table-column align="center" label="分类">
				    <template slot-scope="slot">
					    {{slot.row.categoryName+'/'+slot.row.typeName}}
				    </template>
			    </el-table-column>
			    <el-table-column align="center" label="类型">
					<template slot-scope="scope">
						{{scope.row.classifyType == "0"  ? "课程" : ''}}
					</template>
				</el-table-column>
			    <el-table-column align="center" prop="submitDate" label="处理时间	"></el-table-column>
			    <el-table-column align="center" label="操作">
				    <template slot-scope="scope">
					    <el-button @click="toDetailPage(scope.row)" size="mini">查看</el-button>
				    </template>
			    </el-table-column>
		    </el-table>
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
	    </div>
    </div>
</template>

<script>
	import api from 'fetch/api'
export default {
    name: 'get_out_shopping_list',
    data () {
        return {
	        shoppingList : [
		        {}
	        ],
	        pageData : {
		        page : 1,
		        size : 10,
		        total : null
	        }
        }
    },
	created(){
    	this.getShenhePeddleGoodsListFunc();
	},
    methods: {
	    getShenhePeddleGoodsListFunc(){
	    	let params = {
			    checkState : 3,
			    page : this.pageData.page,
			    pageSize : this.pageData.size
		    }
		    api.getShenhePeddleGoodsList(params).then(res => {
			    console.log(res)
			    if(res.serviceCode == "E000000000"){
				    this.shoppingList = res.data.list;
				    this.pageData.total = res.data.total;
			    }else{
				    this.$message.error(res.serviceMessage)
			    }
		    })
	    },
	    toDetailPage(row){
		    this.$router.push({
			    name : 'auditShoppingDetail',
			    query : {
				    shoppingId : row.peddleGoodsId
			    }
		    })
	    },
	    //分页改变
	    handlPageChange(page){
		    this.pageData.page = page
		    this.getShenhePeddleGoodsListFunc();
	    },
    }
}
</script>

<style lang="stylus" scoped>
	.get_out_shopping_list{
		width:100%;
		.weigui_shopping_title{
			color: #9B9B9B;
			text-align : right;
		}
		.get_out_shopping_content{
			background: #fff;
			padding : 20px;
			overflow : hidden;
			margin-top:10px;
		}
		.pagination{
			text-align : right ;
			margin-top:20px;
		}.user_box{
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

	}
</style>
