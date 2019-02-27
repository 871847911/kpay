
<template>
    <div class="choose__shoppingDalog_show">
	    <el-dialog class="choose_shopping_dalog_box" title="选择分销商品" :visible.sync="chooseShoppingShowComp" width="50%">
		    <div class="dalog_main_box">
			    <el-alert title="可选择已上架的自营商品" type="warning" show-icon></el-alert>
			    <div class="dalog_serch_box">
				    <el-input v-model.trim="cShoppingDalogSerchVal" class="shopping_inp" placeholder="商品名称"></el-input>
				    <el-button type="primary" class="serch_btn" @click="chooseShoppingDalogApiFunc">搜索</el-button>
			    </div>
			    <el-table ref="chooseShoppingDalogTable" :data="chooseShoppingDalogTableData" highlight-current-row style="width: 100%;margin-top : 10px;">
				    <el-table-column property="courseId" width="50">
					    <template slot-scope="scope">
						    <el-radio :label="scope.$index" v-model="templateRadio" @change.native="handleCurrentChange(scope.$index,scope.row.courseId)">&nbsp</el-radio>
					    </template>
				    </el-table-column>

				    <el-table-column label="商品名称"  property="courseName"></el-table-column>
				    <el-table-column label="类型" align="center" property="classifyType">
					    <template slot-scope="scope">
						    {{scope.row.classifyType == 0 ? "课程" : ''}}
					    </template>
				    </el-table-column>
			    </el-table>
			    <div class="pagination">
				    <el-pagination
					    @current-change="handldPageChange"
					    :current-page.sync="chooseShoppingDalogPageData.page"
					    :page-sizes="[5]"
					    :page-size="chooseShoppingDalogPageData.size"
					    layout="prev, pager, sizes,  next , jumper"
					    :total="chooseShoppingDalogPageData.total">
				    </el-pagination>
			    </div>
		    </div>

		    <span slot="footer" class="dialog-footer">
			    <el-button @click="chooseShoppingShowComp = false">取 消</el-button>
			    <el-button type="primary" @click="toApplyShoppingPage">确 定</el-button>
		    </span>
	    </el-dialog>
    </div>
</template>

<script>
	import api from 'fetch/api'
export default {
    name: 'choose__shoppingDalog_show',
    data () {
        return {
	        cShoppingDalogSerchVal : null,//选择分销商品 - 商品名称
	        chooseShoppingDalogTableData: [],//选择分销商品 - 商品列表
	        chooseShoppingDalogPageData : {
		        page : 1,
		        size : 5,
		        total : null
	        },
	        templateRadio : null,
	        courseId : null
        }
    },
	created(){
		this.chooseShoppingDalogApiFunc();
	},
	computed : {
		chooseShoppingShowComp : {
			get(){
				return this.$store.state.distribution.chooseShoppingDalogShow
			},
			set(val){
				this.$store.dispatch("changeChooseShoppingDalogShow" , val)
			}
		}
	},
	destroyed(){
		this.$store.dispatch("changeChooseShoppingDalogShow" , false)
	},
    methods: {
	    //选择分销商品列表
	    chooseShoppingDalogApiFunc(){
		    let params = {
			    courseName : this.cShoppingDalogSerchVal,
			    page : this.chooseShoppingDalogPageData.page,
			    pageSize : this.chooseShoppingDalogPageData.size
		    }
		    api.goodsChoice(params).then(res => {
			    console.log(res)
			    if(res.serviceCode === "E000000000"){
				    this.chooseShoppingDalogTableData = res.data.list;
				    this.chooseShoppingDalogPageData.total = res.data.total;
			    }else{
			    	this.$message.error(res.serviceMessage)
			    }
		    })
	    },
		handleCurrentChange(index , courseId) {
			this.templateRadio = index;
			this.courseId = courseId
		},
	    toApplyShoppingPage(){
	    	if(this.courseId){
	    		this.chooseShoppingShowComp = false;
			    this.$router.push({
				    name : 'applyShopping',
				    query : {
					    courseId : this.courseId
				    }
			    })
		    }else{
	    		this.$message.error("请选择分销商品")
		    }

	    },
	    //分页改变
	    handldPageChange(page){
		    this.chooseShoppingDalogPageData.page = page
		    this.chooseShoppingDalogApiFunc();
	    }
    }
}
</script>

<style lang="stylus" scoped>
	.choose__shoppingDalog_show{
		.choose_shopping_dalog_box{
			.dalog_main_box{
				width : 100%;
				.dalog_serch_box{
					.shopping_inp{
						width:300px;
						margin-right: 10px;
					}
				}
				.dian{
					width:24px;
					height:24px;
					border : 1px solid #AEB8BE;
					border-radius 50%;
					text-align  : center;
					line-height : 24px;
					.dian_line{
						display : inline-block;
						width:12px;
						height:12px;
						background : #6CDDC7;
						border-radius : 50%;
					}
				}
			}
			.pagination{
				text-align : right ;
				margin-top:20px;
			}

		}
	}

</style>
