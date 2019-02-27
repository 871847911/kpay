<template>
    <div class='steptwo'>
        <!-- 新建规则=============普通课程 -->
        <div class="serch_box">
            <div class="serch_line">
                <el-input class="width240" placeholder="课程编号" maxlength="20" v-model="serchForm.classNumber" ></el-input>
                <el-input class="width240" placeholder="课程名称" maxlength="20" v-model="serchForm.className" ></el-input>
                <el-select class="width100" v-model="serchForm.isShareValue" placeholder="是否分享">
                    <el-option v-for="item in serchForm.isShareOptons" :key="item.value" :label="item.label" :value="item.value"></el-option>
                </el-select>
                <el-button class="main_btn_bg" type="primary" size="medium"  @click="getSeachList">搜索</el-button>
                <el-button type="info" size="medium" @click="resetData">重置</el-button>
            </div>

        </div>
        <div class="serch_btn">
            <p>共搜索到{{pageData.total}}条数据</p>
            <el-button type="primary" class="main_btn_bg" size="small" :disabled="serchForm.isShareValue == 1" @click="addMultipleSelection">加入分享</el-button>
            <el-button type="info" size="small" :disabled="serchForm.isShareValue == 2" @click="deleteClassListArr">取消分享</el-button>
        </div>
        <div class="total_box">
            <i class="el-icon-info color1"></i>

            已选择 <span class="color1">{{multipleSelectionIds.length}}</span>  项  &nbsp;&nbsp;&nbsp;&nbsp;   已添加分享：<span class="bold">{{multipleSelection.length}}</span>
            <span class="look_choose" @click="lookChooseListIsShow = !lookChooseListIsShow">查看已添加内容</span>
        </div>

        <div class="table_box">
            <el-table ref="multipleTable" :data="tableData3" tooltip-effect="dark" style="width: 100%" @selection-change="handleSelectionChange" :default-sort = "{prop: 'date', order: 'descending'}" @sort-change="sortChange">
                <el-table-column align="center" type="selection" width="55"></el-table-column>
                <el-table-column align="center" prop="courseNumber" label="课程编号" ></el-table-column>
                <el-table-column align="center" prop="courseName" label="课程名称" width="250px">
                    <template slot-scope="scope">
						<div class="table_class_box">
							<div class="table_class_name_left">
							    <img :src="$store.state.imageHead + scope.row.courseUrlFirst "  alt="">
							</div>
							<div class="table_class_name_right">
								  <p class="bold">{{scope.row.courseName}}</p>
								  <p>{{scope.row.createDate }}</p>
							</div>
						</div>

                    </template>
                </el-table-column>
                <el-table-column align="center" prop="buyNumber" label="交易" sortable="custom"></el-table-column>
                <el-table-column align="center" prop="hits" :formatter="liulanNumIsNull" label="浏览" sortable="custom"></el-table-column>
            </el-table>
        </div>
        <div class="page_box">
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="pageData.currentPage"
                :page-sizes="[10, 20, 50]"
                :page-size="10"
                layout="prev, pager, next , sizes, jumper "
                :total="pageData.total">
            </el-pagination>
        </div>
        <!-- 查看已添加内容dalog -->
        <el-dialog title="已添加内容" :visible.sync="lookChooseListIsShow" width="70%">
            <el-table :data="multipleSelection">
                <el-table-column align="center" property="courseNumber" label="序号"></el-table-column>
                <el-table-column align="center" property="courseName" label="课程名称">

                </el-table-column>
                <el-table-column align="center" property="hits" :formatter="liulanNumIsNull" label="浏览次数"></el-table-column>
                <el-table-column align="center" property="buyNumber" label="购买次数"></el-table-column>
                <el-table-column align="center" property="id" label="操作">
                    <template slot-scope="scope">
                        <el-button type="text" @click="deleteChooseData(scope.row, scope.$index)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-dialog>
    </div>
</template>
<script>
import api from '../../../../fetch/api'
export default {
    name: 'steptwo',
    data () {
        return {
            lookChooseListIsShow : false,
            // 搜索数据
            serchForm: {
                classNumber: null,//课程编号
                className : null,//课程名称
                // 是否添加
                isShareOptons : [
                    {value : 1 , label : "已添加"},
                    {value : 2 , label : "未添加"},
                ],
                isShareValue : 2,
                buyFlag : null,
                hitsFlag : null
            },
            // 查看已添加内容
            gridData: [],
            // 搜索表格
            tableData3: [],
            // 预备已选课程列表
            afterMultipleSelection : [],
            // 已选课程列表
            multipleSelection: [],
            // 已选课程ids
            multipleSelectionIds :[],
            // 分页数据
            pageData : {
                // 分页页数
                currentPage : 1,
                // 分页条数
                pageSize : 10,
                total : null
            }
        }
    },
    created(){
        this.getList();
    },
    methods: {
        // 获取课程列表数据
        getList(){
            let params = {
                page : this.pageData.currentPage,
                size : this.pageData.pageSize,
                courseType : 1,
                buyFlag : this.serchForm.buyFlag,
                hitsFlag : this.serchForm.hitsFlag,
                courseNumber : this.serchForm.classNumber,
                courseName : this.serchForm.className,
            }
            api.getStepTwoClassList(params).then(res => {
                this.pageData.total = res.total;
                this.tableData3 = res.list;
                this.getChooseList();
            })
        },
        // 获取已添加课程列表数据
        getChooseList(){
            let params = {
                page : 1,
                size : 999,
                courseType :1,
                ruleId : this.$store.state.share.classData.ruleId,
                courseNumber : this.serchForm.classNumber,
                courseName : this.serchForm.className,
            }
            let tableData  = this.tableData3;
            api.getStepTwoClassList(params).then(res => {
                this.multipleSelection = res.list;
                if(this.serchForm.isShareValue == 1){
                    this.tableData3 = res.list;
                }else{
                    if(res.list.length > 0 ){
                        res.list.forEach(tableVal => {
                            this.tableData3.forEach((listVal,index) => {
                                if(tableVal.id == listVal.id){
                                    this.tableData3.splice(index,1)
                                }
                            })
                        })
                    }else{
                        this.$refs.multipleTable.clearSelection()
                    }
                }

            })
        },
        // 删除已添加内容
        deleteChooseData(row , index){
            let params ={
                ruleId : this.$store.state.share.classData.ruleId,
                courseId : row.id
            }
            api.deleteClassList(params).then(res => {
                if(res.success == true){
                    this.getList();
                    this.$message.success("删除成功");
                }else{
                    this.$message.error(res.message);
                }
            })
        },
        // 已选数据
        handleSelectionChange(val) {
            this.multipleSelectionIds = val.map(val => {
                return val.id
            })
        },
        // 取消分享
        deleteClassListArr(){
            if(this.multipleSelectionIds.length == 0){
                this.$message.info("请选择需要解除绑定的课程")
            }else{
                this.multipleSelectionIds.forEach(val => {
                    let params ={
                        ruleId : this.$store.state.share.classData.ruleId,
                        courseId : val
                    }
                    api.deleteClassList(params).then(res => {
                        if(res.success == true){
                            this.getList();
                            this.$message.success("删除成功");
                        }else{
                            this.$message.error(res.message);
                        }
                    })
                })
            }
        },
        // 已选数据添加
        addMultipleSelection(){
            if(this.multipleSelectionIds.length > 0){
                let params ={
                    courseIds : this.multipleSelectionIds.join(","),
                    ruleId :this.$store.state.share.classData.ruleId
                }
                api.setClassList(params).then(res => {
                    if(res.success == true){
                        this.$message.success("已添加")
                        this.getList();
                    }else{
                        this.$message.error(res.message)
                    }
                })
            }else{
                this.$message.error("请选择课程")
            }

        },
        // 重置
        resetData(){
            // 搜索数据
            this.serchForm.classNumber = null;
            this.serchForm.className = null;
            this.serchForm.isShareValue = 2;
            this.getList();
        },
        // 分页size改变
        handleSizeChange(val) {
            this.pageSize = val;
            this.getList();
        },
        // 分页页数改变
        handleCurrentChange(val) {
            this.getList();
        },
        filterTag(value, row) {
            return row.tag === value;
        },
        // 表格排序
        sortChange({column, prop, order}){
            if(prop == 'buyNumber'){
                if(order == 'ascending'){
                    // 倒叙=>正叙
                    this.serchForm.buyFlag = 0
                }else{
                    // 正序=>倒叙
                    this.serchForm.buyFlag = 1
                }
            }else{
                if(order == 'ascending'){
                    // 倒叙=>正叙
                    this.serchForm.hitsFlag = 0
                }else{
                    // 正序=>倒叙
                    this.serchForm.hitsFlag = 1
                }
            }
            this.getList();

        },
        getSeachList(){
            this.getList();
        },
        liulanNumIsNull(row, column, cellValue, index){
            if(cellValue == null){
                return '0'
            }else{
                return cellValue
            }
        }
    }
}
</script>
<style lang="stylus" scoped>
.color1{color : #6CDDC7;}
.color2{color : #169BD5;}
.bold{font-weight : bold;}
.textright{text-align : right;}
.width240{width : 240px;}
.width100{width : 100px;}
.el-pagination{
    .el-pager{
        .active{
            background: #db0000 !important;
        }
    }
}
.steptwo{
    .serch_box{
        padding : 30px 20px;
        overflow : hidden ;
        background : #f7f7f7;
        border-radius : 5px;
        .serch_line{
            .line {
                float : left;
                width : 50%;
                box-sizing : border-box;
                padding : 20px 30px;
                display  : flex;
                .name{
                    float : left;
                    width : 90px;
                    line-height : 40px;
                }
                .inp{
                    float : left;
                    flex : 1;
                }
            }
        }

    }
    .serch_btn{
        line-height : 40px;
        margin-top : 20px;
    }
    .total_box{
        padding : 15px;
        background : rgba(0,185,180,0.15);
        border-radius : 4px;
        margin-top : 20px;
        .look_choose{
            display : inline;
            color : #6CDDC7;
            cursor : pointer;
            margin-left : 20px;
        }
    }
	.table_class_box{
		display : flex;
		.table_class_name_left{
			width : 60px ;
			height : 60px ;
			img{
				width:100%;
				height:100%;
			}
		}
		.table_class_name_right{
			flex : 1;
			padding-left:10px;
		}
	}

    .page_box{
        margin-top : 20px;
        text-align : right;
    }
}
</style>
