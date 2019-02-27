<template>
    <div class='stepThree'>
        <!-- 普通课程 -->
        <div class="total_box">
            <i class="el-icon-info color1"></i>
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
                            <el-option label="1人" :value="1" :disabled="index > 0 &&ruleList[index-1].shareNum >= 1"></el-option>
                            <el-option label="3人" :value="3" :disabled="index > 0 &&ruleList[index-1].shareNum >= 3"></el-option>
                            <el-option label="5人" :value="5" :disabled="index > 0 &&ruleList[index-1].shareNum >= 5"></el-option>
                            <el-option label="10人" :value="10" :disabled="index > 0 &&ruleList[index-1].shareNum >= 10"></el-option>
                        </el-select>
                        <span class="choose">
                            选择相应奖励
                        </span>
                        <span class="jian" v-if="index !=0 && index+1 == ruleList.length" @click="removeRuleList">
                            <i class="el-icon-minus size20"></i>
                        </span>
                    </template>
                    <div class="discount_box">
                        <el-radio-group v-model="item.discount">
                            <el-radio :label="9" :disabled="index > 0 &&ruleList[index-1].discount <= 9">9折</el-radio>
                            <el-radio :label="8.5" :disabled="index > 0 &&ruleList[index-1].discount <= 8.5">8.5折</el-radio>
                            <el-radio :label="8" :disabled="index > 0 &&ruleList[index-1].discount <= 8">8折</el-radio>
                            <el-radio :label="5" :disabled="index > 0 &&ruleList[index-1].discount <= 5">5折</el-radio>
                            <el-radio :label="0" :disabled="index > 0 &&ruleList[index-1].discount <= 0">免费</el-radio>
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
            ruleList : [
                {discount: 9,  shareNum: null }
            ]
        }
    },
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
                ruleId : this.$store.state.share.classData.ruleId
            }
            api.getStepTwoClassList(params).then(res => {
                this.multipleSelectionLength = res.list.length;
            })
        },
        // 获取规则列表
        getRuleList(){
            api.getRuleList({ruleId : this.$store.state.share.classData.ruleId}).then(res => {
                if(res.length != 0){
                    this.ruleList = res.map(val => {
                        return {
                            discount : parseFloat(val.details),
                            shareNum : val.shareExplain
                        }
                    })
                }
                
            })
        },
        // 返回修改
        returnStepTwo(){
            this.$parent.queryData.step = 2;
            sessionStorage.setItem("step" ,2 );
        },
        selectChange(val,index){
            // for( let i=0 ; i < this.ruleList.length ; i++){
                
            // }
        },
        addNewRule(){
            if(this.ruleList[this.ruleList.length-1].discount == null){
                this.$message.error("请设置上一条规则");
            }else if(this.ruleList[this.ruleList.length-1].shareNum == null){
                this.$message.error("请设置上一条规则");
            }else if(this.ruleList[this.ruleList.length-1].discount == 0){
                this.$message.error("已达到规则限制,不能再创建");
            }else if(this.ruleList[this.ruleList.length-1].shareNum == 10){
                this.$message.error("已达到规则限制,不能再创建");
            }else{
                this.ruleList.push({discount: null, shareNum: null })
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