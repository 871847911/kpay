<template>
    <div class='new_group'>
        <div class="head">
			<span>新建拼团</span>
            <div class="return_box"  @click="$router.go(-1)">
                <i class="iconfont icon-fanhui"></i>返回
            </div>
		</div>
        <div class="container_box">
            <div class="con_box">
                <p class="size14">选择课程</p>
                <div v-if="chooseData.chooseRowData == null" class="choose_class_box">
                    <el-button class="choose_btn" size="mini" @click="showChooseClassListBox"> 选择课程</el-button>
                    <span class="tit_text">（创建后不可修改，且在活动期间课程不可修改）</span>
                </div>
                
                <table v-if="chooseData.chooseRowData != null" class="class_table">
                    <thead>
                        <tr>
                            <th>课程名称</th>
                            <th>原价</th>
                            <th>上架状态</th>
                            <th>操作</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div class="user_box">
                                    <img :src="$store.state.imageHead+chooseData.chooseRowData.courseCover" width="60px" height="60px" alt="">
                                    <div class="name_box">
                                        {{chooseData.chooseRowData.courseNum }}
                                        <br/>
                                        {{chooseData.chooseRowData.courseName }}
                                    </div>
                                </div>
                            </td>
                            <td>￥{{chooseData.chooseRowData.coursePrice }}</td>
                            <td>{{chooseData.chooseRowData.courseStatus == 10 ? "新建" :chooseData.chooseRowData.courseStatus == 20 ? "审核中" : chooseData.chooseRowData.courseStatus == 30 ? "未通过" : chooseData.chooseRowData.courseStatus == 40 ? "已上架" : "未上架"}}</td>
                            <td><el-button size="mini" @click="chooseData.chooseRowData = null">移除</el-button></td>
                        </tr>
                    </tbody>
                </table> 
                <p v-if="chooseData.chooseRowData != null" class="tit_text">（创建后不可修改，且在活动期间课程不可修改）</p>
                <p class="title">活动时间</p>
                <div class="time_box">
                    <el-date-picker v-model="chooseData.startTime" class="time_box width200" type="date" placeholder="请选择开始时间" value-format="timestamp" @change="getStartTime"></el-date-picker>
                    至
                    <el-date-picker v-model="chooseData.endTime" class="time_box width200" type="date" placeholder="请选择结束时间" value-format="timestamp" @change="getEndTime"></el-date-picker>
                    <span class="tit_text">（创建后不可修改）</span>
                </div>
                <p class="tit_text">（活动时间结束后，用户无法开团，但已开团的用户可以继续参团）</p>
                <div class="special_box">
                    <div class="this_box">
                        <p class="title">团有效期</p>
                        <el-select class="width200" v-model="chooseData.groupValidity" placeholder="请选择">
                            <el-option
                            v-for="item in groupValidityOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                    <div class="this_box" style="margin-left : 20px;">
                        <p class="title">成团人数</p>
                        <el-select class="width200" v-model="chooseData.peopleNum" placeholder="请选择">
                            <el-option
                            v-for="item in peopleNumOptions"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select>
                    </div>
                </div>
                <p class="title">成团价格</p>
                <el-input v-model="chooseData.groupPrice"  class="width200" placeholder="请输入内容" style="margin-top : 10px;" @change="groupPriceChange">
                    <template slot="append">元</template>
                </el-input>
                <span class="tit_text">（成团价格请小于原售价）</span>

                <div class="save_btn">
                    <el-button class="major-btn" @click="setNewGroup">保&nbsp;存</el-button>
                </div>
            </div>
            
        </div>



        <!-- 选择课程dalog -->
        <el-dialog title="选择课程" :visible.sync="dialogTableVisible" width="840px">
            <div class="main_box">
                <div class="serch_box">
                    <el-radio-group v-model.trim="canBeGroup" class="radio_box" @change="canBrGroupFunc">
                        <el-radio-button :label="1" style="margin-right : 17px;">可拼团</el-radio-button>
                        <el-radio-button :label="0" style="margin-left : 17px;">不可拼团</el-radio-button>
                    </el-radio-group>
                    <div class="serch_btn">
                        <el-input class="width300" v-model="className" maxlength="15"  placeholder="课程编号 / 课程名称"></el-input>
                        <el-button class="major-btn" maxlength="15" @click="getClassList">搜索</el-button>
                    </div>
                </div>
                <el-table class="choose_table" highlight-current-row :data="gridData" @current-change="handleCurrentChange">
                    <el-table-column align="center" v-if="canBeGroup == 1" width="100px" key="isChecked">
                        <template slot-scope="scope">
                            <div class="radio_sim">
                                <div v-if="scope.row.isChecked" class="radio_sim_n"></div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" width="250px" property="courseCover" label="课程名称" key="courseCover">
                        <template  slot-scope="scope">
                            <div class="user_box">
                                <img :src="$store.state.imageHead+scope.row.courseCover " width="60px" height="60px" alt="">
                                <div class="name_box">
                                    {{scope.row.courseNum }}
                                    <br/>
                                    {{scope.row.courseName }}
                                </div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="原价" key="coursePrice">
                        <template  slot-scope="scope">
                            {{"￥" + scope.row.coursePrice}}
                        </template>
                    </el-table-column>
                    <el-table-column align="center" label="上架状态" key="courseStatus">
                        <template  slot-scope="scope">
                            <div class="status_box">
                                <div v-if="scope.row.courseStatus == 40">
                                    <div class="ling_one"></div>已上架
                                </div>
                                <div v-else>
                                    <div class="line_two"></div>{{scope.row.courseStatus == 10 ? "新建" : scope.row.courseStatus == 20 ? "审核中" : scope.row.courseStatus == 30 ? "未通过" : scope.row.courseStatus == 40 ? "已上架" : "未上架"}}
                                </div>
                                <!-- {{scope.row.courseStatus == 10 ? "新建" : scope.row.courseStatus == 20 ? "审核中" : scope.row.courseStatus == 30 ? "未通过" : scope.row.courseStatus == 40 ? "已上架" : "未上架"}} -->
                            </div>
                            
                        </template>
                    </el-table-column>
                    <el-table-column align="center" property="reason"  label="原因" v-if="canBeGroup == 0" key="reason"></el-table-column>
                </el-table>
                <div class="page_box">
                    <el-pagination
                        @size-change="chooseClassHandleSizeChange"
                        @current-change="chooseClassHandleCurrentChange"
                        :current-page.sync="chooseClasPageData.currentPage"
                        :page-size="5"
                        :page-sizes="[5]"
                        layout="prev, pager, next,sizes, jumper"
                        :total="chooseClasPageData.total">
                    </el-pagination>
                </div>
            </div>
            <div slot="footer" class="dialog-footer">
                <el-button class="major-btn" @click="dialogFormVisible = false">确 定</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
import api from 'fetch/api'
export default {
    name: 'new_group',
    data () {
        return {
            dialogTableVisible : false,
            groupValidityOptions:[
                {value: '24',label: '24'}, 
                {value: '48',label: '48'}, 
                {value: '72',label: '72'}, 
                {value: '96',label: '96'}
            ],
            peopleNumOptions : [
                {value: '2',label: '2'}, 
                {value: '4',label: '4'}, 
                {value: '6',label: '6'}, 
                {value: '8',label: '8'},
                {value: '10',label: '10'}
            ],
            gridData: [],
            canBeGroup : 1,
            className : '',
            chooseClasPageData : {
                currentPage : 1,
                size : 5,
                total : null
            },
            chooseData : {
                // 已选课程
                chooseRowData: null,
                // 开始时间
                startTime : null,
                // 结束时间
                endTime : null,
                // 团有效期
                groupValidity : 24,
                // 成团人数
                peopleNum : 2,
                // 成团价格
                groupPrice : null
            }
            
        }
    },
    created(){
        this.getClassList();
    },
    methods: {
        getClassList(){
            let params = {
                storeId : this.$store.state.storeId,
                groupBuyCourseType : this.canBeGroup,
                courseName : this.className,
                page : this.chooseClasPageData.currentPage,
                pageSize : this.chooseClasPageData.size
            }
            api.getGroupClassList(params).then(res => {
                this.chooseClasPageData.total = res.total;
                let list = res.data.list;
                if(list.length > 0){
                    list.forEach((val,index) => {
                        list[index].isChecked = false
                    });
                    this.gridData = list;
                    this.chooseClasPageData.total = res.data.total;
                }else{
                    this.gridData = [];
                }
                
            })
        },
        setNewGroup(){
            if(!this.chooseData.chooseRowData){
                this.$message.error("请选择课程")
            }else if(!this.chooseData.startTime){
                this.$message.error("请选择开始时间")
            }else if(!this.chooseData.endTime){
                this.$message.error("请选择结束时间")
            }else if(this.chooseData.endTime <= this.chooseData.startTime){
                this.$message.error("结束时间必须大于开始时间");
            }else if(!this.chooseData.groupPrice){
                this.$message.error("请输入成团价")
            }else if(this.chooseData.groupPrice  >=  this.chooseData.chooseRowData.price ){
                this.$message.error("成团价格请小于原售价")
            }else{
                // 提交新团
                let params = {
                    userId : this.$store.state.userId,
                    storeId : this.$store.state.storeId,
                    courseId : this.chooseData.chooseRowData.courseId,
                    startTime : this.chooseData.startTime,
                    endTime : this.chooseData.endTime,
                    groupValidity : this.chooseData.groupValidity,
                    peopleNum : this.chooseData.peopleNum,
                    groupPrice : this.chooseData.groupPrice,
                }
                api.setNewGroup(params).then(res => {
                    if(res.success == true){
                        this.$message.success("新建成功")
                        this.$router.push({
                            name : "groupList"
                        })
                    }else{
                        this.$message.error("新建失败")
                    }
                })
            }
            
        },
        // 成团价格校验
        groupPriceChange(val){
            let exp = new RegExp('[0-9]');
            if(exp.test(val)){
                if(val >= 0.01 && val<= 9999.99){
                    
                }else{
                    this.chooseData.groupPrice = null;
                    this.$message.error("请输入0.01-9999.99之间的数值");
                }
            }else{
                this.chooseData.groupPrice = null;
                this.$message.error("请输入0.01-9999.99之间的数值");
            }
            
        },
        canBrGroupFunc(){
            this.getClassList();
        },
        showChooseClassListBox(){
            this.dialogTableVisible = true;
        },
        chooseClassHandleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        chooseClassHandleCurrentChange(val) {
            this.getClassList();
        },
        handleCurrentChange(newVal , oldVal) {
            if(this.canBeGroup == 1){
                this.chooseData.chooseRowData = newVal;
                
                newVal.isChecked = true;
                if(oldVal){
                    oldVal.isChecked = false;
                }
                this.dialogTableVisible = false;
            }else{
                this.$message.error("不可拼团") 
            }
        },
        getStartTime(val){
            if(this.chooseData.endTime){
                if(val >= this.chooseData.endTime){
                    this.$message.error("开始时间必须小于结束时间");
                    this.chooseData.startTime = null
                }
            }
            
        },
        getEndTime(val){
            if(val <= this.chooseData.startTime){
                this.$message.error("结束时间必须大于开始时间");
                this.chooseData.endTime = null
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
    .new_group{
        width: 100%;
        box-sizing: border-box;
        font-size: 12px;
        overflow-y: scroll;
        height : 100%;
        min-height : 100%;
        .size14{
            font-size : 14px;
        }
        .width200{
            width : 200px;    
        }
        .width300{
            width : 300px;
        }
        .head{
            width: 100%;
            font-size: 20px;
            color: #9b9b9b;
            line-height: 0.2rem;
            display: flex;
            justify-content: center;
            align-items: center;
            justify-content: space-between;
            .return_box{
                font-size : 20px;
                cursor : pointer;
                .iconfont{
                    margin-right : 5px;
                }
            }
        }
        .status_box{
            width : 56px;
            overflow : hidden; 
            display : inline-block;
            .ling_one,.line_two,.line_three,.line_four{
                width : 6px;
                height : 6px;
                border-radius : 50%;
                background : #6CDDC7;
                float:left;
                margin : 8px 5px 0 0;
            }
            .line_two{
                background : #9B9B9B;
            }
            .line_three{
                background : #F42C21;
            }
            .line_four{
                background : #F5A623;
            }
        }
        .container_box{
            box-sizing : border-box;
            margin-top : 20px;
            background : #fff;
            padding :0 20px 20px 20px;
            overflow : hidden;
            min-height : 90%;
            .con_header{
                width : 100%;
                height : 60px;
                line-height : 60px;
                box-sizing : border-box;
                border-bottom : 1px solid #E6E6E6;
            }
            .con_box{
                width : 550px;
                margin : 0 auto;
                box-sizing : border-box;
                padding-top : 60px;
                .title{
                    margin-top : 30px;
                    font-size : 14px;
                }
                .class_table{
                    width : 100%;
                    margin-top : 10px;
                    border : 1px solid #E6E6E6;
                    thead th{
                        color : #4A4A4A;
                        background : #F9FAF9;
                        font-size : 14px;
                        padding : 13px 30px;
                    }
                    tbody td{
                        padding : 20px 15px;
                        text-align : center;
                    }
                }
                .tit_text{
                    color : #9B9B9B;
                    margin-top : 10px;
                }
                .time_box{
                    margin-top : 10px;
                    
                }
                .special_box{
                    width : 100%;
                    overflow  : hidden;
                    .this_box{
                        float : left;
                        .title{
                            margin-bottom : 10px;
                        }
                    }
                }
                .save_btn{
                    text-align : center;
                    margin-top : 60px;

                }
            }
            .active_id{
                float : right;
                font-size : 14px;
                color : #4A4A4A;
            }
        }
        
        .choose_btn{
            background : RGBA(0, 185, 180, 0.15);
            color : #6CDDC7;
            border : 1px solid transparent;
            margin-top : 10px;
        }
        .main_box{
            width : 100%;
            .serch_box {
                margin-bottom : 30px;
                overflow : hidden;
                .radio_box{
                    float : left;
                    .el-radio-button__inner{
                        border : 1px solid transparent;
                        font-size : 18px;
                    }
                    .el-radio-button__orig-radio:checked+.el-radio-button__inner{
                        background : transparent;
                        color : #6CDDC7;
                        box-shadow : 0 0 0 0;
                    }
                    .el-radio-button__inner{
                        padding : 0;
                    }
                }
                .serch_btn{
                    float : right;
                }
            }
            .choose_table{
                thead{
                    th{
                        text-align : center;
                    }
                }
                tbody{
                    td{
                        text-align : center;
                    }
                }
            }
            .page_box{
                text-align : right;
            }
            
        }
        .user_box{
            display : flex;
            
        }
        .name_box{
            flex : 1;
            line-height : 30px;
            padding-left : 20px;
            text-align : left;
        }
        .radio_sim{
            display : inline-block;
            width : 24px;
            height : 24px;
            line-height : 24px;
            text-align : center;
            border : 1px solid #AEB8BE;
            border-radius : 50%;
            box-sizing : border-box;
        }
        .radio_sim_n{
            display : inline-block;
            width : 12px;
            height : 12px;
            background : #6CDDC7;
            border-radius : 50%;
            box-sizing : border-box;
        }
        .el-input__prefix{
            display : none;
        }
        .el-input--prefix .el-input__inner{
            padding-left : 10px;
        }
    }
</style>
