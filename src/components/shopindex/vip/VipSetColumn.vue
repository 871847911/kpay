<template>
  <div>
    <div class="panel-face" @click="showDialog">
      <div>
        <i class="iconfont icon-xianshizhekou- purple-i"></i>
        <i class="iconfont icon-shezhi-" :class="[panelIndex===2?'green-i':'']"></i>
      </div>
      <h3>专栏限时折扣订阅</h3>
      <p>限时折扣订阅专栏课程，固定时间选择</p>
    </div>

    <el-dialog title="专栏限时折扣订阅" :visible.sync="dialogFormVisible" :show-close="true" width="680px">
        <el-form :model="dialogForm" ref="dialogForm">
            <el-form-item label="折扣范围" :label-width="formLabelWidth">
              <el-radio-group v-model="discountRadioValue">
                <el-radio :label="1">9.0折</el-radio>
                <el-radio :label="2">8.5折</el-radio>
                <el-radio :label="3">8.0折</el-radio>
                <el-radio :label="3">5.0折</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="限时时长" :label-width="formLabelWidth">
              <el-radio-group v-model="dayRadioValue">
                <el-radio :label="1">不限</el-radio>
                <el-radio :label="2">7天</el-radio>
                <el-radio :label="3">15天</el-radio>
                <el-radio :label="3">30天</el-radio>
              </el-radio-group>
            </el-form-item>

            <el-form-item label="生效等级" :label-width="formLabelWidth" prop="region" :rules="[
              { required: true, message: '生效等级不能为空'}
            ]">
              <el-select v-model="dialogForm.region" placeholder="" size="medium">
                <el-option label="100" value="100"></el-option>
                <el-option label="200" value="200"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="是否启用" :label-width="formLabelWidth">
              <el-switch
                v-model="switchValue"
                active-color="#6CDDC7"
                inactive-color="#f42c21">
              </el-switch>
            </el-form-item>

            <el-form-item class="el-form-item-center">
              <el-button class="confirm-green" @click="dialogFormConfirm('dialogForm')">确 定</el-button>
            </el-form-item>
          </el-form>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "VipSetColumn",
  data() {
    return {
      dialogFormVisible: false,
      formLabelWidth:"80px",
      dialogForm: { // 编辑添加表单数据
        region: ''
      },
      discountRadioValue: 1,
      dayRadioValue: 1,
      switchValue: true
    }
  },
  props:{
    panelIndex: Number
  },
  methods: {
    // 显示弹出框
    showDialog(){
      this.dialogFormVisible = true
      this.$emit('cgIndex', 2)
      this.resetForm("dialogForm")
    },

    // 重置数据
    resetForm(formName) {
      if(this.$refs[formName]){
        this.$refs[formName].resetFields()
      }
    },

    // 弹出框确认
    dialogFormConfirm(formName){
      this.$refs[formName].validate((valid) => {
          if (valid) {
          } else {
            return false;
          }
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"

.el-form-item-center
  display flex
  justify-content center
  margin 40px 0 30px 0
.panel-face
  width 3.6rem
  height 1.8rem
  background rgba(255,255,255,1) 
  box-shadow 0px 2px 11px 0px rgba(155,155,155,0.5) 
  border-radius .04rem
  margin-right .3rem
  margin-bottom .3rem
  padding .2rem
  box-sizing border-box
  cursor pointer
  div
    flex()
    height .35rem
    margin-bottom .1rem
    justify-content space-between
    align-items center
    i 
      &:first-child
        font-size 30px
      &:last-child
        display block
        width .4rem
        height .4rem
        background-color #F9FAF9
        color #9B9B9B
        border-radius 50%
        text-align center
        line-height .4rem
    .purple-i
      color #8561FA
    .green-i
      color #6CDDC7 !important
  h3
    font-size 20px
    color #4A4A4A
    margin-bottom .1rem
  p
    font-size 14px
    color #9B9B9B
    line-height .2rem
</style>
