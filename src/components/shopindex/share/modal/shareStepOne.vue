<template>
    <div class='stepone'>
        <div class="one_box">
            <el-form :model="ruleForm" status-icon :rules="rules" ref="ruleFormOne">
                <el-form-item prop="ruleTitle">
                    <el-input v-model="ruleForm.ruleTitle" placeholder="请输入分享规则名称" maxlength="50"></el-input>
                </el-form-item>
                <el-form-item>
                    <el-input class="textarea" type="textarea" maxlength="50" rows="10" placeholder="请输入分享规则说明" v-model="ruleForm.ruleDetail"></el-input>
                </el-form-item>
                <div class="radio_box">
                    类目选择&nbsp;&nbsp;
                    <el-radio-group v-model="radio" :disabled="ruleId != 'null'" @change="labelChange">
                        <el-radio label="1">普通课程</el-radio>
                        <el-radio label="2">目录课程</el-radio>
                    </el-radio-group>
                </div>
                <div class="radio_box">
                    是否启用&nbsp;&nbsp;
                    <el-radio-group v-model="ruleForm.isEnable">
                        <el-radio-button :label="1">ON</el-radio-button>
                        <el-radio-button :label="0">OFF</el-radio-button>
                    </el-radio-group>
                </div>
            </el-form>
        </div>
    </div>
</template>
<script>
import api from '../../../../fetch/api'
export default {
    name: 'stepone',
    data () {
        let checkRuleTitle = (rule, value, callback) => {
            if (!value) {
                return callback(new Error('分享规则名称不能为空'));
            }else{
                callback();
            }
        };
        return {
            radio : '1',
            ruleForm: {
                ruleTitle: '',
                ruleDetail : '',
                isEnable : 1,
                createDate : null
            },
            createUser : null,
            createUserId : null,
            rules: {
                ruleTitle: [
                    { validator: checkRuleTitle, trigger: 'change' }
                ]
            }
        }
    },
    created(){
        this.getDetail();
    },
    computed:{
        ruleId(){
            return this.$store.state.share.classData.ruleId;
        }
    },
    methods: {
        getDetail(){
            if(this.ruleId != 'null'){
                api.getClassDetail({ruleId : this.ruleId}).then(res => {
                    this.radio = res.courseType.toString();
                    this.ruleForm = {
                        ruleTitle : res.shareName,
                        ruleDetail : res.shareExplain,
                        isEnable : res.isEnable,
                        createDate : res.createDate
                    }
                    this.createUser = res.createUser;
                    this.createUserId = res.createUserId;
                })
            }
        },
        labelChange(val){
            sessionStorage.setItem("courseType" , val)
        }
    }
}
</script>
<style lang="stylus" scoped>
    .stepone{
        .one_box{
            width : 500px;
            margin : 0 auto;
            .textarea{
                margin-top : 50px;
            }
            .radio_box{
                margin-top : 50px;
            }
        }
        .el-form-item>>>.el-form-item__content{
            margin-left : 0;
        }
        .el-form-item .el-form-item__content{
            margin-left : 0;
        }
    }
</style>