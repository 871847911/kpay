<template>
    <div class='group_detail'>
        <div class="head">
			<span>查看拼团</span>
			<div class="return_box"  @click="$router.go(-1)">
                <i class="iconfont icon-fanhui"></i>返回
            </div>
		</div>
        <div class="container_box">
            <div class="con_header">
                <div class="active_id">
                    活动ID：{{$route.query.groupId}}
                </div>
            </div>
            <div class="con_box">
                <p class="size14">选择课程</p>
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
                                    <img :src="$store.state.imageHead + groupData.courseCover" width="60px" height="60px" alt="">
                                    <div class="name_box">
                                        {{groupData.courseNum}}
                                        <br/>
                                        {{groupData.courseName}}
                                    </div>
                                </div>
                            </td>
                            <td>￥{{groupData.coursePrice}}</td>
                            <td>
                                <div class="status_box">
                                    <div v-if="groupData.status == 40">
                                        <div class="ling_one"></div>已上架
                                    </div>
                                    <div v-else>
                                        <div class="line_two"></div>{{groupData.status == 10 ? "新建" : groupData.status == 20 ? "审核中" : groupData.status == 30 ? "未通过" : groupData.status == 40 ? "已上架" : "未上架"}}
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
                <p class="tit_text">（创建后不可修改，且在活动期间课程不可修改）</p>
                <p class="title">活动时间</p>
                <div class="time_box">
                    <el-input v-model="groupData.startTime" class="width200" disabled></el-input>
                    至
                    <el-input v-model="groupData.endTime" class="width200" disabled></el-input>
                    <span class="tit_text">（创建后不可修改）</span>
                </div>
                <p class="tit_text">（活动时间结束后，用户无法开团，但已开团的用户可以继续参团）</p>
                <div class="special_box">
                    <div class="this_box">
                        <p class="title">团有效期</p>
                        <el-input v-model="groupData.groupValidity" class="width200" disabled></el-input>
                        <!-- <el-select class="width200" v-model="value" disabled placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select> -->
                    </div>
                    <div class="this_box" style="margin-left : 20px;">
                        <p class="title">成团人数</p>
                        <el-input v-model="groupData.peopleNum" class="width200" disabled></el-input>
                        <!-- <el-select class="width200" v-model="value" disabled placeholder="请选择">
                            <el-option
                            v-for="item in options"
                            :key="item.value"
                            :label="item.label"
                            :value="item.value">
                            </el-option>
                        </el-select> -->
                    </div>
                </div>
                <p class="title">成团价格</p>
                <el-input v-model="groupData.groupPrice" disabled  class="width200" placeholder="请输入内容" style="margin-top : 10px;">
                    <template slot="append">元</template>
                </el-input>
                <span class="tit_text">（成团价格请小于原售价）</span>
                
            </div>
            
        </div>
    </div>
</template>

<script>
import api from 'fetch/api'
export default {
    name: 'group_detail',
    data () {
        return {
            groupData : {
                groupId : null,
                // 已选课程
                courseCover: null,
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
                groupValidity : null
            }
        }
    },
    created(){
        this.getGroupDetail();
    },
    methods: {
        getGroupDetail(){
            api.getGroupDetail({id : this.$route.query.groupId}).then(res => {
                this.groupData = res.data;
                this.groupData.startTime = this.getTimestep(new Date(this.groupData.startTime).getTime());
                this.groupData.endTime = this.getTimestep(new Date(this.groupData.endTime).getTime());
            })
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
    .group_detail{
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
                padding-top : 30px;
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
                        padding : 20px 30px;
                        .user_box{
                            display : flex;

                        }
                        .name_box{
                            line-height : 30px;
                            padding-left : 20px;
                        }
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
            }
            .active_id{
                float : right;
                font-size : 14px;
                color : #4A4A4A;
            }
        }
        
        
    }
</style>
