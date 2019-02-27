<template>
  <div class="vip-grow-rules">
    <div class="topbar layout-head">
      <h3>成长值规则设置</h3>
      <div>
        <h3 @click="goback">
          <i class="iconfont icon-fanhui"></i>
          返回
        </h3>
      </div>
    </div>

    <div class="contain">
        <div class="box">
          <el-form :model="rulesForm" ref="rulesForm" label-position="top">
            <div class="item-column">
              <el-form-item label="每连续登陆" prop="formData[0].value1">
                <div class="real-box">
                  <el-select v-model.number="rulesForm.formData[0].value1">
                    <el-option label="5" value="5"></el-option>
                    <el-option label="10" value="10"></el-option>
                    <el-option label="15" value="15"></el-option>
                  </el-select>
                  <div class="right-mind">天</div>
                </div>
              </el-form-item>
              <el-form-item label="额外奖励" prop="formData[0].value2">
                <div class="real-box">
                  <el-select v-model.number="rulesForm.formData[0].value2">
                    <el-option label="5" value="5"></el-option>
                    <el-option label="10" value="10"></el-option>
                    <el-option label="15" value="15"></el-option>
                  </el-select>
                  <div class="right-mind">点</div>
                </div>
              </el-form-item>
              <el-form-item class="switch">
                <el-switch
                  v-model="rulesForm.formData[0].isEnable"
                  active-color="#6CDDC7"
                  inactive-color="#AEB8BE"
                  :disabled="!rulesForm.formData[0].value2 && !rulesForm.formData[0].value1"
                  >
                </el-switch>
              </el-form-item>
            </div>

            <div class="item-column">
              <el-form-item label="课程购买" prop="formData[1].value1">
                <div class="real-box">
                  <el-select v-model.number="rulesForm.formData[1].value1">
                    <el-option label="10" value="10"></el-option>
                    <el-option label="50" value="50"></el-option>
                    <el-option label="100" value="100"></el-option>
                  </el-select>
                  <div class="right-mind">元</div>
                </div>
                &nbsp;&nbsp;奖励1点成长值
              </el-form-item>
              <el-form-item class="switch">
                <el-switch
                  v-model="rulesForm.formData[1].isEnable"
                  active-color="#6CDDC7"
                  inactive-color="#AEB8BE"
                  :disabled="!rulesForm.formData[1].value1">
                </el-switch>
              </el-form-item>
            </div>

            <div class="item-column">
              <el-form-item label="购买单课程最多可获得" prop="formData[2].value1">
                <div class="real-box">
                  <el-select v-model.number="rulesForm.formData[2].value1">
                    <el-option label="50" value="50"></el-option>
                    <el-option label="100" value="100"></el-option>
                    <el-option label="200" value="200"></el-option>
                  </el-select>
                  <div class="right-mind">点</div>
                </div>
                &nbsp;&nbsp;成长值
              </el-form-item>
              <el-form-item class="switch">
                <el-switch
                  v-model="rulesForm.formData[2].isEnable"
                  active-color="#6CDDC7"
                  inactive-color="#AEB8BE"
                  :disabled="!rulesForm.formData[2].value1">
                </el-switch>
              </el-form-item>
            </div>

            <div class="btn-column">
              <el-form-item class="el-form-item-center">
                <el-button class="confirm-green" @click="rulesFormConfirm('rulesForm')">保 存</el-button>
              </el-form-item>
            </div>
          </el-form>
        </div>
    </div>
  </div>
</template>

<script>
import api from 'fetch/api'

export default {
  name: 'VipInfoGrowRule',
  data () {
    return {
      rulesForm:{  // 规则数据
        formData: [
          {
            value1:'',
            value2:'',
            growType: 31,
            isEnable: false
          },
          {
            value1:'',
            value2:'',
            growType: 32,
            isEnable: false
          },
          {
            value1:'',
            value2:'',
            growType: 33,
            isEnable: false
          }
        ]
      } 
    }
  },
  created(){
    this.initRulesList()
  },
  methods:{
    // 获取规则列表数据
    initRulesList(){
      api.getStoreVipGrowRuleByType().then(res => {
        if(res.data){
          if(res.data.length !== 0){
            this.rulesForm.formData = res.data
          }
        }
      })
    },

    // 验证表单
    rulesFormConfirm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.growRuleBatchSave(this.rulesForm.formData).then(res => {
            if(res.success){
              this.$message({
                message: '保存成功',
                type: 'success'
              })
            }
          }).catch(err => {
            this.$message({
              message: '保存失败',
              type: 'error'
            })
          })
        } else {
          return false;
        }
      })
    },

    goback(){
      this.$router.back()
    },
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.vip-grow-rules
  width 100%
  box-sizing border-box
  .form-item-width
    width 2.6rem
  .topbar
    div
      flex()
      color $color-text-l
    h3
      font-size 20px
      cursor pointer
    p
      cursor pointer
    a 
      color $color-text-l
  .contain
    .box
      background-color #ffffff
      width 100%
      min-height 4.93rem
      padding .6rem
      box-sizing border-box
      .item-column, .btn-column
        width 6.6rem
        margin 0 auto
        flex()
        justify-content space-between
      .el-form-item
        display inline-block
      .btn-column
        margin-top .5rem
        justify-content center
      .real-box
        display inline-block
        height .4rem
        position relative
      .right-mind
        position absolute
        right 0
        top 0
        width .4rem
        height .4rem
        background rgba(249,250,249,1)
        border 1px solid rgba(0,0,0,0.15)
        box-sizing border-box
        text-align center
        color rgba(74,74,74,1)
        line-height .4rem
        border-top-right-radius 4px
        border-bottom-right-radius 4px
      .switch
        margin-top 0.35rem
</style>