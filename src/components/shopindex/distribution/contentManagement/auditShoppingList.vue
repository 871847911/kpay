
<template>
    <div class="audit_shopping_list">
	    <div class="layout-head">
		    <span>商品审核</span>
	    </div>
	    <div class="content_box">
		    <el-tabs v-model="activeName" @tab-click="handleClick">
			    <el-tab-pane label="审核中" name="0">
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
					    <el-table-column align="center" prop="submitDate" label="提交时间	"></el-table-column>
					    <el-table-column align="center" label="操作">
						    <template slot-scope="scope">
							    <el-button @click="toDetailPage(scope.row)" size="mini">查看</el-button>
						    </template>
					    </el-table-column>
				    </el-table>
			    </el-tab-pane>
			    <el-tab-pane label="已审核" name="4">
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
						<el-table-column align="center" label="状态">
							<template slot-scope="scope">

								<div class="shopping_status_box" v-if="scope.row.checkState == 0">
									<i class="status_dian weishangjia"></i>待审核
								</div>
								<div class="shopping_status_box" v-if="scope.row.checkState == 1">
									<i class="status_dian shangjia"></i>已通过
								</div>
								<div class="shopping_status_box" v-if="scope.row.checkState == 2">
									<i class="status_dian weishangjia"></i>未通过
								</div>
								<div class="shopping_status_box" v-if="scope.row.checkState == 3">
									<i class="status_dian weishangjia"></i>违规
								</div>
							</template>
						</el-table-column>
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
					    <el-table-column align="center" prop="submitDate" label="提交时间	"></el-table-column>
					    <el-table-column align="center" label="操作">
						    <template slot-scope="scope">
							    <el-button @click="toDetailPage(scope.row)" size="mini">查看</el-button>
						    </template>
					    </el-table-column>

				    </el-table>
			    </el-tab-pane>
		    </el-tabs>

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
    name: 'audit_shopping_list',
    data () {
        return {
	        activeName: 0,
	        shoppingList : [],
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
			    checkState : Number(this.activeName) ,
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
	    },//分页改变
	    handlPageChange(page){
		    this.pageData.page = page
		    this.getShenhePeddleGoodsListFunc();
	    },

	    handleClick() {
		    this.pageData = {
			    page : 1,
			    size : 10,
			    total : null
		    }
		    this.getShenhePeddleGoodsListFunc();
	    }
    }
}
</script>

<style lang="stylus" scoped>
	.audit_shopping_list{
		width : 100%;
		.content_box{
			background: #fff;
			text-align : center;
			padding : 20px;
			overflow : hidden;
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
	}

</style>
