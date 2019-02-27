<template>
    <div class='stepThree'>
        <!-- 普通课程 -->
        <div class="total_box">
            <i class="el-icon-info color1"></i>
            目录范围 : <span class="color1">1节~{{maxDirectory}}节</span>
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
            课程总计 <span class="color1">{{multipleSelectionLength}}</span>
            <span class="look_choose" @click="returnStepTwo">返回修改</span>
        </div>
        <div class="add_rule_title">
            <p>设置分享规则&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; <span class="new_rule" @click="addNewRule"><img :src="require('../../../../assets/image/405768800804513411.png')" width="20px" height="20px" alt="">新增规则</span></p>
            
        </div>
        <div class="rule_box">
            <el-collapse>
                <el-collapse-item v-for="(item,index) in ruleList" :key="index">
                    <template slot="title">
                        <span class="title">
                            注册人数达到:
                        </span>
                        
                        <el-select v-model="item.shareNum" placeholder="请选择" @change="selectChange($event , index)">
                            <el-option label="1人" :value="1" :disabled="index > 0 &&ruleList[index-1].shareNum >= 2"></el-option>
                            <el-option label="3人" :value="3" :disabled="index > 0 &&ruleList[index-1].shareNum >= 4"></el-option>
                            <el-option label="5人" :value="5" :disabled="index > 0 &&ruleList[index-1].shareNum >= 6"></el-option>
                            <el-option label="10人" :value="10" :disabled="index > 0 &&ruleList[index-1].shareNum >= 11"></el-option>
                        </el-select>
                        <span class="choose">
                            选择相应奖励
                        </span>
                        <span class="jian" v-if="index !=0 && index+1 == ruleList.length" @click="removeRuleList">
                            <img :src="require('../../../../assets/image/580524211286692350.png')" width="20px" height="20px" alt="">
                        </span>
                    </template>
                    <div class="discount_box">
                        <div class="discountType" v-if="index != 0">
                            <el-radio-group v-model="item.discountType">
                                <el-radio :label="0">免费读</el-radio>
                                <el-radio :label="1">折扣</el-radio>
                            </el-radio-group>
                        </div>
                        <div class="free_discount" v-if="item.discountType == 0">
                            免费阅读:
                            <el-input placeholder="请输入内容" v-model.number="item.startChapterNum" @change="firstPageInputChange($event , index)">
                                <template slot="append">节</template>
                            </el-input>
                            -------
                            <el-input placeholder="请输入内容" v-model.number="item.stopChapterNum" :disabled="item.stopChapterNum >= maxDirectory && islastPage == true" @change="lagePageInputChange($event , index)">
                                <template slot="append">节</template>
                            </el-input>
                            <el-checkbox v-if="index == ruleList.length-1" @change="thisIsLastPageChange($event , index)" v-model="islastPage">末节</el-checkbox>
                            <!-- <el-radio  label="末节" @click="getLastPage"></el-radio> -->
                            <!-- <el-input v-model="item.startChapterNum" placeholder="请输入内容"></el-input> -->
                        </div>
                        <el-radio-group v-model="item.discount" v-if="item.discountType == 1">
                            <el-radio :label="9" :disabled="index > 0 &&ruleList[index-1].discount <= 9 && ruleList[index-1].discountType == 1">9折</el-radio>
                            <el-radio :label="8.5" :disabled="index > 0 &&ruleList[index-1].discount <= 8.5&& ruleList[index-1].discountType == 1">8.5折</el-radio>
                            <el-radio :label="8" :disabled="index > 0 &&ruleList[index-1].discount <= 8&& ruleList[index-1].discountType == 1">8折</el-radio>
                            <el-radio :label="5" :disabled="index > 0 &&ruleList[index-1].discount <= 5&& ruleList[index-1].discountType == 1">5折</el-radio>
                            <el-radio :label="0" :disabled="index > 0 &&ruleList[index-1].discount <= 0&& ruleList[index-1].discountType == 1">免费</el-radio>
                        </el-radio-group>
                    </div>
                </el-collapse-item>
            </el-collapse>
        </div>
    </div>
</template>

<script>
import api from '../../../../fetch/api'
export default {
    name: 'stepThree',
    data () {
        return {
            radio : "1",
            multipleSelectionLength : null,
            maxDirectory : null,
            ruleList : [
                {discount: null,discountType: 0,shareNum: null,startChapterNum: null,stopChapterNum: null}
            ],
            islastPage : false
        }
    },
    // discountType 优惠类型【0:免费读 1:折扣】
    computed:{
        
    },
    created(){
        this.getChooseList();
        this.getRuleList();
    },
    methods: {
        // 获取已选课程
        getChooseList(){
            let params = {
                page : 1,
                size : 9999,
                ruleId : this.$store.state.share.classData.ruleId,
                courseType : 2,
            }
            api.getStepTwoClassList(params).then(res => {
                this.multipleSelectionLength = res.list.length;
                this.maxDirectory =Math.max.apply(null,res.list.map(val => {
                    return val.chapterNum;
                }))
                
            })
        },
        // 获取规则列表
        getRuleList(){
            api.getRuleList({ruleId : this.$store.state.share.classData.ruleId}).then(res => {
                if(res.length != 0){
                    let ruleList = res.map(val => {
                        return {
                            discountType : val.discountType,
                            discount :parseFloat(val.details),
                            shareNum : val.shareExplain,
                            startChapterNum : val.discountDetails.split('-')[0],
                            stopChapterNum : val.discountDetails.split('-')[1]
                        }
                    })
                    this.ruleList = ruleList;
                }
                
            })
        },
        // 返回修改
        returnStepTwo(){
            this.$parent.queryData.step = 2;
            sessionStorage.setItem("step" ,2 );
        },
        // 章节范围   lastpage change
        lagePageInputChange(val ,index){
            let exp = new RegExp('[0-9]');
            if(exp.test(val)){
                if(val >= this.maxDirectory){
                    this.ruleList[index].stopChapterNum = this.maxDirectory;
                    this.islastPage = true;
                }else if(val <= this.ruleList[index].startChapterNum){
                    this.$message.error("结束章节必须大于起始章节");
                    this.ruleList[index].stopChapterNum = this.ruleList[index].startChapterNum+1;
                }
            }else{
                this.ruleList[index].stopChapterNum = null;
                this.$message.error("请输入正确章节")
            }
            
        },
        // 章节范围   firstpage change
        firstPageInputChange(val ,index){
            let exp = new RegExp('[0-9]');
            if(exp.test(val)){
                if(index > 0){
                    if(parseInt(val) <= this.ruleList[index-1].stopChapterNum){
                        this.ruleList[index].startChapterNum = this.ruleList[index-1].stopChapterNum+1;
                        this.$message.error("必须大于上一条规则的结束章节");
                    }
                }else{
                    if(val < 1){
                        this.$message.error("开始章节不符合规则");
                        this.ruleList[index].startChapterNum = 1;
                    }else if(index == 0){
                        this.ruleList[index].startChapterNum = 1;
                    }
                }
            }else{
                this.ruleList[index].startChapterNum = null;
                this.$message.error("请输入正确章节")
            } 
        },
        selectChange(val,index){
            if(index != this.ruleList.length-1){
                if(this.ruleList[index].shareNum > this.ruleList[index+1].shareNum){
                    this.ruleList.splice(index+1 , this.ruleList.length-index);
                    this.$message.info("请按照规则设置")
                }
            }else{
                console.log("符合规则");
            }
        },
        addNewRule(){
            // if(this.ruleList[this.ruleList.length-1].startChapterNum == null){
            //     this.$message.error("请设置上一条规则开始章节");
            // }else if(this.ruleList[this.ruleList.length-1].stopChapterNum == null){
            //     this.$message.error("请设置上一条规则结束章节");
            // }else if(this.ruleList[this.ruleList.length-1].discount == 0){
            //     this.$message.error("已达到规则限制,不能再创建");
            // }else 
            if(this.ruleList[this.ruleList.length-1].shareNum == null){
                this.$message.error("请设置上一条规则达成条件");
            }
            // else if(this.ruleList[this.ruleList.length-1].shareNum == 10){
            //     this.$message.error("已达到规则限制,不能再创建");
            // }
            else{
                this.ruleList.push({discount: null,discountType: 0,shareNum: null,startChapterNum: null,stopChapterNum: null})
            } 
        },
        getLastPage(){

        },
        thisIsLastPageChange(val , index){
            if(val == true){
                this.ruleList[index].stopChapterNum = this.maxDirectory;
            }else{
                this.ruleList[index].stopChapterNum = null;
            }
            
        },
        removeRuleList(){
            this.ruleList.splice(-1);
        }
    }
}
</script>

<style lang="stylus" scoped>
.color1{color : #6CDDC7;}
.color2{color : #169BD5;}
.size20{
    font-size:20px;
}
.cursor{
    cursor : pointer;    
}
.stepThree{
    .total_box{
        padding : 15px; 
        background : #E6F3FC;
        border-radius : 4px;
        margin-top : 20px;
        .look_choose{
            display : inline;
            color : #6CDDC7;
            cursor : pointer;
            margin-left : 20px;
        }
    }
    .add_rule_title{
        padding : 20px 0;
        
        .new_rule{
            width:100px;
            height : 20px;
            line-height :20px;
            display : inline-block;
            float: right;
            cursor : pointer;
            img{
                vertical-align :bottom;
                margin-right : 10px;
            } 
        }
    }
    .rule_box{
        margin-top : 20px;
        .title{
            margin-right : 30px;
        }
        .choose{
            margin-left : 30px;
            color : #6CDDC7;
            text-decoration :underline ;
        }
        .jian{
            float : right;
            margin-right : 50px;
            margin-top : 5px;
        }
        
    }
    .discount_box{
        width : 580px;
        margin : 0 auto;
        .discountType{//折扣类型
            margin-bottom : 20px;
        }
        .free_discount{
            .el-input{
                width : 200px;
            }
        }
    }
    
}
</style>
