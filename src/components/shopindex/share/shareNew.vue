<template>
    <div class='sharenew'>
        <div class="head">
			<span>分享规则查询</span>
			<el-button class="main_btn_bg" type="primary" size="small" @click="nextShare">{{ queryData.step == 3?"完成" : "下一步"}}</el-button>
		</div>
        <div class="body_box">
            <div class="step_box">
                <el-steps :active="queryData.step" align-center>
                    <el-step title="内容类目" description=""></el-step>
                    <el-step title="内容选择" description=""></el-step>
                    <el-step title="分享规则" description=""></el-step>
                </el-steps>
            </div>
            <div class="container_box">
                <stepOne v-if="queryData.step == 1" ref="stepOne"></stepOne>
                <stepTwo v-if="queryData.step == 2 && courseType == '1'" ref="stepTwo"></stepTwo>
                <stepTwo1 v-if="queryData.step == 2 && courseType == '2'" ref="stepTwo"></stepTwo1>
                <stepThree v-if="queryData.step == 3 && courseType == '1'" ref="stepThree"></stepThree>
                <stepThree1 v-if="queryData.step == 3 && courseType == '2'" ref="stepThree"></stepThree1>
            </div>
        </div>
        
    </div>
</template>
<script>
import api from '../../../fetch/api'
import stepOne from "./modal/shareStepOne";//第一步
import stepTwo from "./modal/shareStepTwo";//第二步 普通课程
import stepTwo1 from "./modal/shareStepTwoPage";//第二步 目录课程
import stepThree from "./modal/shareStepThree";//第三步 普通课程
import stepThree1 from "./modal/shareStepThreePage";//第三步 目录课程
export default {
    name: "sharenew",
    data() {
        return {
            queryData : {
                ruleId : null,
                step : 1,
                courseType : null,
                isNew : false
            }
        };
    },
    computed:{
        courseType(){
            return this.$store.state.share.classData.courseType;
        }
    },
    created(){
        this.getRuleData();
    },
    updated() {
        this.getRuleData();
    },
    methods: {
        getRuleData(){
            this.queryData.step = parseInt(sessionStorage.getItem("step"));
            this.$store.dispatch("getRuleInfoAction" ,{
                ruleId : sessionStorage.getItem("ruleId"),
                step : sessionStorage.getItem("step"),
                courseType : sessionStorage.getItem("courseType")
            });
            if(sessionStorage.getItem("ruleId") == 'null'){
                this.isNew = true
            }else{
                this.isNew = false
            }
        },
        nextShare() {
            if(this.queryData.step == 1){
                this.submitStepOneForm(this.$refs.stepOne.$refs.ruleFormOne);
            }else if(this.queryData.step == 2){
                this.submitStepTwoForm();
            }else if(this.queryData.step == 3){
                this.submitStepThreeForm();
            }
        },
        // 第一步提交
        submitStepOneForm(formName) {
            formName.validate((valid) => {
                if (valid) {
                    if(this.isNew){
                        let params = {
                            courseType : parseInt(this.$refs.stepOne.radio),
                            createUserId : this.$store.state.userId,
                            id : null,
                            createDate : this.$refs.stepOne.ruleForm.createDate,
                            isEnable : this.$refs.stepOne.ruleForm.isEnable,
                            shareExplain : this.$refs.stepOne.ruleForm.ruleDetail,
                            shareName : this.$refs.stepOne.ruleForm.ruleTitle,
                            userId : this.$store.state.userId
                        }
                        api.putStepOne(this.$store.state.userId , params).then(res => {
                            if(res.success){
                                // 跳转第二步
                                this.queryData.step = 2;
                                sessionStorage.setItem("ruleId" , res.data)
                                sessionStorage.setItem("courseType" , this.$refs.stepOne.radio)
                                sessionStorage.setItem("step" , 2)
                            }else{
                                this.$message.error("-----y------shareNew.vue 第一步提交 数据存错误");
                            }
                            
                        })
                    }else{
                        let params = {
                            id : this.$store.state.share.classData.ruleId,
                            isEnable : this.$refs.stepOne.ruleForm.isEnable,
                            createUser : this.$refs.stepOne.createUser,
                            createUserId : this.$refs.stepOne.createUserId,
                            createDate : this.$refs.stepOne.ruleForm.createDate,
                            courseType  : parseInt(this.$refs.stepOne.radio),
                            modifyUser : this.$store.state.userId,
                            shareExplain : this.$refs.stepOne.ruleForm.ruleDetail,
                            shareName : this.$refs.stepOne.ruleForm.ruleTitle
                        }
                        api.setClassRule(params).then(res => {
                            if(res.success){
                                // 跳转第二步
                                this.queryData.step = 2;
                                sessionStorage.setItem("step" , 2)
                            }else{
                                this.$message.error("-----y------shareNew.vue 第一步提交 数据存错误");
                            }
                        })
                    }
                    
                    
                } else {
                    return false;
                    this.queryData.step = 1;
                }
            });
        },
        // 第二步提交
        submitStepTwoForm(){
            if(this.$refs.stepTwo.multipleSelection.length > 0){
                sessionStorage.setItem("step" , 3)
                this.queryData.step = 3;
            }else{
                this.$message.error("请添加相关课程");
            }
        },
        // 第三步完成
        submitStepThreeForm(){
            if(this.$store.state.share.classData.courseType == '1'){
                let ruleList = this.$refs.stepThree.ruleList.map(val =>{
                    return {
                        discount : val.discount,
                        shareNum : val.shareNum,
                        createUser : this.$store.state.userId,
                        ruleId : this.$store.state.share.classData.ruleId
                    }
                });
                if(ruleList[ruleList.length-1].discount == null){
                    this.$message.error("规则不符合");
                }else if(ruleList[ruleList.length-1].shareNum == null){
                    this.$message.error("规则不符合");
                }else if(ruleList.length == 0){
                    this.$message.error("请创建规则");
                }else{
                    api.setRoutineDiscount(ruleList).then(res => {
                        if(res.success == true){
                            this.$message.success("保存成功");
                            this.$router.push({
                                name : "shareRule"
                            })
                        }else{
                            this.$message.error(res.message);
                        }
                    })
                } 
            }else{
                 let ruleList = this.$refs.stepThree.ruleList.map(val =>{

                         return {
                            discount : val.discount ? val.discount : 0,
                            discountType : val.discountType,
                            shareNum : val.shareNum,
                            startChapterNum : val.startChapterNum,
                            stopChapterNum : val.stopChapterNum,
                            createUser : this.$store.state.userId,
                            ruleId : this.$store.state.share.classData.ruleId
                        }

                    
                });
                // if(ruleList[ruleList.length-1].discount == null){
                //     this.$message.error("规则不符合");
                // }else 
                if(ruleList[ruleList.length-1].shareNum == null){
                    this.$message.error("规则不符合");
                }else if(ruleList.length == 0){
                    this.$message.error("请创建规则");
                }else{
                    api.setCatalogDiscount(ruleList).then(res => {
                        if(res.success == true){
                            this.$message.success("保存成功");
                            this.$router.push({
                                name : "shareRule"
                            })
                        }else{
                            this.$message.error(res.message);
                        }
                    })
                } 
            }
            
        }
    },
    components: {
        stepOne,
        stepTwo,
        stepTwo1,
        stepThree,
        stepThree1
    }
};
</script>
<style lang="stylus" scoped>
.sharenew {
    width: 100%;
    height : 100%;
    box-sizing: border-box;
    font-size: 12px;
    overflow-y: scroll;
    .head {
		width: 100%;
		margin: 0 auto 0.1rem;
		font-size: 0.2rem;
		color: #9b9b9b;
		line-height: 0.2rem;
		display: flex;
		justify-content: center;
		align-items: center;
		justify-content: space-between;
	}
    .body_box{
        background: #fff;
        width : 100%;
        min-height: 780px;
        .step_box {
            width: 100%;
            padding: 50px 100px;
            box-sizing: border-box;
        }
        .container_box {
            box-sizing: border-box;
            width: 100%;
            padding: 10px 20px;
            
        }
    }
}
</style>