<template>
    <div class='set_group'>
        <div class="head">
			<span>修改拼团</span>
			<div class="return_box"  @click="$router.go(-1)">
                <i class="iconfont icon-fanhui"></i>返回
            </div>
		</div>
        <div class="container_box">
            <div class="con_box">
                <table class="class_table">
                    <thead>
                        <tr>
                            <th>课程名称</th>
                            <th>原价</th>
                            <th>上架状态</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                <div class="user_box">
                                    <img :src="$store.state.imageHead+chooseData.courseCover" width="60px" height="60px" alt="">
                                    <div class="name_box">
                                        {{chooseData.courseNum }}
                                        <br/>
                                        {{chooseData.courseName }}
                                    </div>
                                </div>
                            </td>
                            <td>￥{{chooseData.coursePrice }}</td>
                            <td>
                                <div class="status_box">
                                    <div v-if="chooseData.status == 40">
                                        <div class="ling_one"></div>已上架
                                    </div>
                                    <div v-else>
                                        <div class="line_two"></div>{{chooseData.status == 10 ? "新建" : chooseData.status == 20 ? "审核中" : chooseData.status == 30 ? "未通过" : chooseData.status == 40 ? "已上架" : "未上架"}}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table> 
                <p class="tit_text_t">（创建后不可修改，且在活动期间课程不可修改）</p>
                <p class="title">活动时间</p>
                <div class="time_box">
                    <el-input v-model="chooseData.startTime" class="width200" disabled></el-input>
                    至
                    <el-input v-model="chooseData.endTime" class="width200" disabled></el-input>
                    <span class="tit_text_t">（创建后不可修改）</span>
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
                <el-input v-model="chooseData.groupPrice"  class="width200" placeholder="请输入内容" style="margin-top : 10px;" @change="groupPriceChange"  >
                    <template slot="append">元</template>
                </el-input>
                <span class="tit_text">（成团价格请小于原售价）</span>

                <div class="save_btn">
                    <el-button type="primary" @click="setNewGroup">保&nbsp;存</el-button>
                </div>
            </div>
            
        </div>
    </div>
</template>

<script>
import api from 'fetch/api'
export default {
    name: 'set_group',
    data () {
        return {
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
            chooseClasPageData : {
                currentPage : 1,
                size : 10,
                total : null
            },
            chooseData : {
                // 课程封面
                courseCover : null,
                // 课程编号
                courseNum : null,
                // 课程名称
                courseName : null,
                // 课程价格
                coursePrice : null,
                // 开始时间
                startTime : null,
                // 结束时间
                endTime : null,
                // 团有效期
                groupValidity : 24,
                // 成团人数
                peopleNum : 2,
                // 成团价格
                groupPrice : null,

            }
            
        }
    },
    created(){
        this.getGroupDetail();
    },
    methods: {
        getGroupDetail(){
            api.getGroupDetail({id : this.$route.query.groupId}).then(res => {
                this.chooseData = res.data;  
                this.chooseData.startTime = this.getTimestep(new Date(this.chooseData.startTime).getTime());
                this.chooseData.endTime = this.getTimestep(new Date(this.chooseData.endTime).getTime());
            })
        },
        setNewGroup(){
            if(!this.chooseData.groupPrice){
                this.$message.error("请输入成团价")
            }else if(parseInt(this.chooseData.groupPrice)  >=  parseInt(this.chooseData.coursePrice) ){
                this.$message.error("成团价格请小于原售价")
            }else{
                // 修改团
                let params = {
                    userId : this.$store.state.userId,
                    // storeId : this.$store.state.storeId,
                    groupId : this.$route.query.groupId,
                    groupValidity : this.chooseData.groupValidity,
                    peopleNum : this.chooseData.peopleNum,
                    groupPrice : this.chooseData.groupPrice,
                    status : 1
                }
                api.setGroup(params).then(res => {
                    if(res.success == true){
                        this.$message.success("修改成功");
                        this.$router.push({
                            name : "groupList"
                        })
                    }else{
                        this.$message.error(res.message)
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
        showChooseClassListBox(){
            this.dialogTableVisible = true;
        },
        chooseClassHandleSizeChange(val) {
            console.log(`每页 ${val} 条`);
        },
        chooseClassHandleCurrentChange(val) {
            console.log(`当前页: ${val}`);
        },
        handleCurrentChange(newVal , oldVal) {
            this.chooseData.chooseRowData = newVal;
            
            newVal.isChecked = true;
            if(oldVal){
                oldVal.isChecked = false;
            }
            this.dialogTableVisible = false;
        },
        getStartTime(val){
            // this.startTime = val-(val%3600000)
        },
        getEndTime(val){
            // this.endTime = val-(val%3600000)
            if(val <= this.chooseData.startTime){
                this.$message.error("结束时间必须大于开始时间");
                this.chooseData.endTime = null
            }
        },
        getTimestep(val){

            let date = new Date(val);
            let year = date.getFullYear();
            let month = date.getMonth()<10?"0"+(date.getMonth()+1):(date.getMonth()+1);
            // let weekArray = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
            // let weeks = weekArray[date.getDay()];
            let day = date.getDate()<10?"0"+date.getDate():date.getDate();
            let h = date.getHours()<10?"0"+date.getHours():date.getHours();
            let m = date.getMinutes()<10?"0"+date.getMinutes():date.getMinutes();
            return year+"-"+month+"-"+day+" "+h+":"+m;
        }
    }
}
</script>

<style lang="stylus" scoped>
    .set_group{
        width: 100%;
        box-sizing: border-box;
        font-size: 12px;
        overflow-y: scroll;
        padding:0 30px 30px 30px;
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
                margin : 4px 5px 0 0;
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
                .tit_text_t{
                    color : #F42C21;
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
                    width : 400px;
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
        
    }
</style>
