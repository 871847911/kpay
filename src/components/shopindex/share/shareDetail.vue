<template>
    <div class='sharedetail'>
        <div class="head">
			<span>规则详情</span>
			<el-button class="main_btn_bg" type="primary" size="small" @click="$router.go(-1)">返回</el-button>
		</div>
        <div class="container_box">
            <div class="the_box">
                <div class="top_box">
                    <div class="title">基本信息</div>
                    <div class="type_box">
                        <div class="name">分享名称 : {{ruleBasicDetail.shareName }}</div>
                        <div class="type">内容类目 : {{ruleBasicDetail.courseType== 1 ? "普通课程" : "目录课程"}}</div>
                        <div class="time">创建时间 : {{ruleBasicDetail.modifyDate  }}</div>
                    </div>
                    <div class="rule_box">
                        <div class="left">规则说明 :&nbsp;</div>
                        <div class="right">{{ruleBasicDetail.shareExplain }}</div>  
                    </div>
                </div>
                
                <div class="table_box">
                    <p class="title">内容信息</p>
                    <div class="table_title">
                        <p>内容信息列表 <span class="open_on" @click="openList = !openList">展开</span></p>
                    </div>
                    <div class="table_main">
                        
                        <div class="table" :class="{'max_height' : openList}">
                            <el-table :data="classList" style="width: 100%">
                                <el-table-column align="center" prop="courseNumber" label="序号" :formatter="getNum" width="180"></el-table-column>
                                <el-table-column align="center" prop="courseName" label="课程名称"></el-table-column>
                                <el-table-column align="center" prop="chapterNum" label="章节" :formatter="liulanNumIsNull"></el-table-column>
                                <el-table-column align="center" prop="hits" label="浏览次数" :formatter="liulanNumIsNull"></el-table-column>
                                <el-table-column align="center" prop="buyNumber" label="购买次数"></el-table-column>
                                <el-table-column align="center" prop="address" label="操作" v-if="ruleBasicDetail.courseType == 2">
                                    <template slot-scope="scope">
                                        <el-button size="mini" @click="removeClass(scope.row.id)">删除</el-button>
                                    </template>
                                </el-table-column>
                            </el-table>
                        </div>
                    </div>
                    <div class="table_title">
                        <p>分享规则信息</p>
                    </div>
                </div>
                <div class="list_box">
                    <div class="list_main">
                        <div class="list" v-if="ruleBasicDetail.courseType == 1">
                            <!-- 普通课程 -->
                            <div class="list_contont_box" v-for="(item,index) in ruleList" :key="index">
                                分享人次：{{item.shareExplain }} 课程折扣：{{item.details }}折
                            </div>
                        </div>
                        <div class="list" v-if="ruleBasicDetail.courseType == 2">
                            <!-- 目录课程 -->
                            <div class="list_contont_box" v-for="(item,index) in ruleList" :key="index">
                                分享人次：{{item.shareExplain }} 课程折扣：{{item.discountType == 0 ?  `免费阅读 ${item.discountDetails }` :  item.details+'折' }}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            
        </div>
    </div>
</template>
<script>
import api from '../../../fetch/api'
export default {
    name: "sharedetail",
    data() {
        return {
            openList : false,
            courseType : null,
            classList :[],
            classPageData : {
                total : null,
                size : 10 ,
                page : 1
            },
            tableData: [],
            ruleId : null,
            ruleBasicDetail : {},
            ruleList : []
        }
        
    },
    created() {
        this.getRuleId();
        this.getRuleClassDetail();
        // 查询分享规则信息
        this.getRuleInfo()
    },
    methods: {
        getRuleId(){
            if(this.$route.query.ruleId){
                this.ruleId = this.$route.query.ruleId ;
            }else{
                this.$message.error("违规操作")
                this.$router.push({
                    name : "shareRule"
                })
            }
        },
        getRuleClassDetail(){
            // 基本信息
            api.getClassDetail({ruleId : this.ruleId}).then(res => {
                this.ruleBasicDetail = res;
            })
            let params = {
                page : 1,
                size : 999,
                ruleId : this.$route.query.ruleId
            }
            api.getStepTwoClassList(params).then(res => {
                this.classList = res.list;
                this.classPageData.total = res.total;
            })
        },
        getRuleInfo(){
            api.getRuleList({ruleId : this.$route.query.ruleId}).then(res => {
                this.ruleList = res;
            })
        },
        getNum(row, column, cellValue, index){
            return index+1+ this.classPageData.size*(this.classPageData.page-1)
        },
        liulanNumIsNull(row, column, cellValue, index){
            if(cellValue == null){
                return '0'
            }else{
                return cellValue
            }
        },
        removeClass(id){
            let params ={
                ruleId : this.$route.query.ruleId,
                courseId : id
            }
            this.$confirm('确认删除此条规则?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                api.deleteClassList(params).then(res => {
                    if(res.data){
                        this.getRuleClassDetail();
                        this.$message.success("删除成功");
                    }else{
                        this.getRuleClassDetail();
                        this.$message.error("删除失败");
                    }
                })
            }).catch(() => {
                        
            });
        }
    }
};
</script>
<style lang="stylus" scoped>
.sharedetail {
    .el-table td, .el-table th.is-leaf{
        border-bottom : 0;
    }
    width: 100%;
    box-sizing: border-box;
    font-size: 14px;
    overflow-y: scroll;
    .head {
        width: 100%;
        margin: 0 auto 0.1rem;
        font-size: 0.2rem;
        padding: 0 20px;
        box-sizing: border-box;
        color: #9b9b9b;
        line-height: 0.2rem;
        display: flex;
        justify-content: center;
        align-items: center;
        justify-content: space-between;
    }
    .container_box {
        width: 100%;
        box-sizing: border-box;
        .the_box {
            
        }
        .top_box {
            width: 100%;
            margin-bottom: 10px;
            overflow: hidden;
            box-sizing: border-box;
            padding: 20px;
            background: #fff;
            border-radius : 2px;
            .title {
                font-size: 18px;
                font-weight: 600;
                background : #fff ;
                margin-bottom: 20px;
            }
            .type_box {
                width: 100%;
                overflow: hidden;
                margin-bottom: 20px;
                .name, .type, .time {
                    float: left;
                }
                .name, .type {
                    margin-right: 180px;
                }
            }
            .rule_box {
                width: 100%;
                overflow: hidden;
                margin-bottom: 30px;
                display: flex;
                .right {
                    flex: 1;
                }
            }
        }
        .table_box {
             background : #fff;
            .title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 10px;
                padding : 20px;
            }
            .open_on{
                display : inline;
                color : #6CDDC7;
                cursor : pointer;
                font-weight : 400;
                float : right;
                margin-right : 10px;
            }
            .table_title {
                padding: 23px 10px;
                background: #F3F3F3;
                font-size : 14px;
            }
            .table_main {
                width: 100%;
                box-sizing: border-box;
                display :flex;
                flex-direction : column ;
                margin-top : 20px;
                padding : 20px;
                .table {
                    flex : 1;
                    height : 100px;
                    overflow : hidden;
                    transition : height .3s;
                    .el-table{
                        table{
                            thead{
                                tr{
                                    th{
                                        background : #F9FAF9;
                                    }
                                }
                            }
                        }    
                    }
                }
                .max_height{
                    transition : height .3s;
                    height : 500px;
                }
            }
        }
        .list_box{
            background : #fff;
            .title {
                font-size: 18px;
                font-weight: 600;
                margin-bottom: 10px;
                padding : 20px;
            }
            .list_main {
                width: 100%;
                box-sizing: border-box;
                display :flex;
                flex-direction : column ;
                .list_title {
                    padding: 15px 10px;
                    p {
                        font-weight: 600;
                    }
                }
                .list{
                    flex : 1;
                    max-height : 500px;
                    overflow-y : scroll;
                    padding : 20px;
                    box-sizing : border-box;
                    .list_contont_box{
                        border-bottom : 1px solid #ddd;
                        padding : 20px 10px;     
                    }
                }
            }
        }
    }
}
</style>