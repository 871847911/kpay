<template>
  <div class="mb-record-set">
    <div v-if="isActive == 4">
      <div class="topbar layout-head">
        <h3>积分规则设置</h3>
        <div>
          <h3 @click="goback">
            <i class="iconfont icon-fanhui"></i>
            返回
          </h3>
        </div>
      </div>

      <div class="contain">
        <el-form :model="rulesForm" ref="rulesForm" label-position="left" :rules="rulesPercent">
          <div class="panel-bar">
            <div class="head-bar" @click="hidenNewPanelBar">
              <i class="iconfont icon-guizezhiding-"></i>
              <div class="info">
                <h4>积分规则设置</h4>
              </div>
              <i class="iconfont icon-jiantou" :class="[newPanelBar?'animate-down':'animate-right']"></i>
            </div>

            <ul v-show="newPanelBar">
              <li>
                  <el-form-item label="每连续登录" prop="formData[0].value1" :label-width="formLabelWidth">
                      <div class="real-box">
                        <el-select v-model.number="rulesForm.formData[0].value1">
                          <el-option label="5" value="5"></el-option>
                          <el-option label="10" value="10"></el-option>
                          <el-option label="15" value="15"></el-option>
                        </el-select>
                        <div class="right-mind">天</div>
                      </div>
                  </el-form-item>
                  <el-form-item class="middle-item" label="额外奖励" prop="formData[0].value2" :label-width="formLabelWidth">
                    <div class="real-box">
                        <el-select v-model.number="rulesForm.formData[0].value2">
                          <el-option label="50" value="50"></el-option>
                          <el-option label="100" value="100"></el-option>
                          <el-option label="150" value="150"></el-option>
                        </el-select>
                      <div class="right-mind">分</div>
                    </div>
                  </el-form-item>
                  <el-form-item label="">
                    <el-switch
                      v-model="rulesForm.formData[0].isEnable"
                      active-color="#6CDDC7"
                      inactive-color="#AEB8BE"
                      :disabled="!rulesForm.formData[0].value1 && !rulesForm.formData[0].value2">
                    </el-switch>
                  </el-form-item>
              </li>
              <li>
                  <el-form-item label="课程购买" prop="formData[1].value1" :label-width="formLabelWidth">
                      <div class="real-box">
                        <el-select v-model.number="rulesForm.formData[1].value1">
                          <el-option label="10" value="10"></el-option>
                          <el-option label="50" value="50"></el-option>
                          <el-option label="100" value="100"></el-option>
                        </el-select>
                        <div class="right-mind">元</div>
                      </div>
                  </el-form-item>
                  <el-form-item class="middle-item" label="奖励" prop="formData[1].value2" :label-width="formLabelWidth">
                    <div class="real-box">
                        <el-select v-model.number="rulesForm.formData[1].value2">
                          <el-option label="50" value="50"></el-option>
                          <el-option label="100" value="100"></el-option>
                          <el-option label="200" value="200"></el-option>
                        </el-select>
                      <div class="right-mind">分</div>
                    </div>
                  </el-form-item>
                  <el-form-item label="">
                    <el-switch
                      v-model="rulesForm.formData[1].isEnable"
                      active-color="#6CDDC7"
                      inactive-color="#AEB8BE"
                      :disabled="!rulesForm.formData[1].value1 && !rulesForm.formData[1].value2">
                    </el-switch>
                  </el-form-item>
              </li>
              <li>
                  <p>购买单课程最多可获得积分</p>
                  <el-form-item class="middle-item" prop="formData[2].value1" :label-width="formLabelWidth">
                    <div class="real-box">
                      <el-select v-model.number="rulesForm.formData[2].value1">
                        <el-option label="50" value="50"></el-option>
                        <el-option label="100" value="100"></el-option>
                        <el-option label="200" value="200"></el-option>
                      </el-select>
                      <div class="right-mind">分</div>
                    </div>
                  </el-form-item>
                  <el-form-item label="">
                    <el-switch
                      v-model="rulesForm.formData[2].isEnable"
                      active-color="#6CDDC7"
                      inactive-color="#AEB8BE"
                      :disabled="!rulesForm.formData[2].value1">
                    </el-switch>
                  </el-form-item>
              </li>
              <!-- <li>
                  <el-form-item label="每邀请朋友" prop="growup" :label-width="formLabelWidth" :rules="[
                      { type: 'number', message: '邀请数数必须为数字值'}
                    ]">
                      <div class="real-box">
                        <el-input v-model="rulesForm.formData[0].value1" auto-complete="off" size="medium" class="form-item-width"></el-input>
                        <div class="right-mind">位</div>
                      </div>
                  </el-form-item>
                  <el-form-item class="middle-item" prop="growup" :label-width="formLabelWidth" :rules="[
                    { type: 'number', message: '奖励值必须为数字值'}
                  ]">
                    <div class="real-box">
                      <el-input v-model="rulesForm.formData[0].value1" auto-complete="off" size="medium" class="form-item-width"></el-input>
                      <div class="right-mind">分</div>
                    </div>
                  </el-form-item>
                  <el-form-item label="">
                    <el-switch
                      v-model="rulesForm.formData[0].isEnable"
                      active-color="#6CDDC7"
                      inactive-color="#AEB8BE">
                    </el-switch>
                  </el-form-item>
              </li>
              <li>
                  <p>会员升级奖励</p>
                  <el-form-item class="middle-item" prop="growup" :label-width="formLabelWidth" :rules="[
                    { type: 'number', message: '奖励值必须为数字值'}
                  ]">
                    <div class="real-box">
                      <el-input v-model="rulesForm.formData[0].value1" auto-complete="off" size="medium" class="form-item-width"></el-input>
                      <div class="right-mind">分</div>
                    </div>
                  </el-form-item>
                  <el-form-item label="">
                    <el-switch
                      v-model="rulesForm.formData[0].isEnable"
                      active-color="#6CDDC7"
                      inactive-color="#AEB8BE">
                    </el-switch>
                  </el-form-item>
              </li> -->
            </ul>
          </div>

          <div class="panel-bar">
            <div class="head-bar" @click="hidenDayPanelBar">
              <i class="iconfont icon-jiaoyi"></i>
              <div class="info">
                <h4>积分消费设置（基础）</h4>
              </div>
              <i class="iconfont icon-jiantou" :class="[dayPanelBar?'animate-down':'animate-right']"></i>
            </div>

            <ul v-show="dayPanelBar">
              <li>
                  <p>抵扣订单金额每</p>
                  <el-form-item class="middle-item" prop="formData[3].value1" :label-width="formLabelWidth">
                    <div class="real-box">
                      <el-select v-model.number="rulesForm.formData[3].value1">
                        <el-option label="100" value="100"></el-option>
                        <el-option label="200" value="200"></el-option>
                        <el-option label="500" value="500"></el-option>
                        <el-option label="1000" value="1000"></el-option>
                      </el-select>
                      <div class="right-mind">分</div>
                      <span class="behind-desc">抵扣一元</span>
                    </div>
                  </el-form-item>
                  <el-form-item label="">
                    <el-switch
                      v-model="rulesForm.formData[3].isEnable"
                      active-color="#6CDDC7"
                      inactive-color="#AEB8BE"
                      :disabled="!rulesForm.formData[3].value1">
                    </el-switch>
                  </el-form-item>
              </li>
              <li>
                  <p>最高可抵扣订单金额比例</p>
                  <el-form-item class="middle-item" prop="percentValue" :label-width="formLabelWidth">
                    <div class="real-box">
                      <el-input type="number" v-model.number="rulesForm.percentValue" auto-complete="off" 
                        size="medium" class="form-item-width" :style="{height:'.4rem',lineHeight:'.4rem'}"></el-input>
                      <div class="right-mind">%</div>
                    </div>
                  </el-form-item>
                  <el-form-item label="">
                    <el-switch
                      v-model="rulesForm.formData[4].isEnable"
                      active-color="#6CDDC7"
                      inactive-color="#AEB8BE"
                      :disabled="!rulesForm.percentValue">
                    </el-switch>
                  </el-form-item>
              </li>
            </ul>
            <!-- <p class="open-advanced-setting" @click="advancedSetting = !advancedSetting">高级设置<i class="iconfont icon-jiantou"></i></p> -->
          </div>

          <!-- <div class="panel-bar" v-show="advancedSetting">
            <div class="head-bar">
              <i class="iconfont icon-jiaoyi"></i>
              <div class="info">
                <h4>积分消费设置（高级）</h4>
              </div>
            </div>

            <ul>
              <li>
                  <p>最低积分使用标准</p>
                  <el-form-item class="middle-item" prop="growup" :label-width="formLabelWidth" :rules="[
                    { type: 'number', message: '成长值必须为数字值'}
                  ]">
                    <div class="real-box">
                      <el-input v-model="rulesForm.formData[0].value1" auto-complete="off" size="medium" class="form-item-width"></el-input>
                      <div class="right-mind">元</div>
                    </div>
                  </el-form-item>
                  <el-form-item label="">
                    <el-switch
                      v-model="rulesForm.formData[0].isEnable"
                      active-color="#6CDDC7"
                      inactive-color="#AEB8BE">
                    </el-switch>
                  </el-form-item>
              </li>
              <li>
                  <p>使用时的倍数设置</p>
                  <el-form-item class="middle-item" prop="growup" :label-width="formLabelWidth" :rules="[
                    { type: 'number', message: '倍数必须为数字值'}
                  ]">
                    <div class="real-box">
                      <el-input v-model="rulesForm.formData[0].value1" auto-complete="off" size="medium" class="form-item-width"></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label="">
                    <el-switch
                      v-model="rulesForm.formData[0].isEnable"
                      active-color="#6CDDC7"
                      inactive-color="#AEB8BE">
                    </el-switch>
                  </el-form-item>
              </li>
              <li>
                  <p>积分使用订单金额限制</p>
                  <el-form-item class="middle-item" prop="growup" :label-width="formLabelWidth" :rules="[
                    { type: 'number', message: '订单金额必须为数字值'}
                  ]">
                    <div class="real-box">
                      <el-input v-model="rulesForm.formData[0].value1" auto-complete="off" size="medium" class="form-item-width"></el-input>
                    </div>
                  </el-form-item>
                  <el-form-item label="">
                    <el-switch
                      v-model="rulesForm.formData[0].isEnable"
                      active-color="#6CDDC7"
                      inactive-color="#AEB8BE">
                    </el-switch>
                  </el-form-item>
              </li>
            </ul>
          </div> -->

          <div class="btn-column">
            <el-form-item class="el-form-item-center">
              <el-button class="confirm-green" @click="rulesFormConfirm('rulesForm')">保 存</el-button>
            </el-form-item>
          </div>
        </el-form>
      </div>
    </div>

    <no-active v-if="isActive == 3" @reFresh="initFormData"></no-active>
  </div>
</template>

<script>
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
import {mapGetters} from 'vuex'

export default {
  name: 'MbRecordSet',
  data () {
    var validatePercent = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if(!Number.isInteger(value)){
          callback(new Error('请输入整数值'))
        }else{
          if(value < 0){
              callback(new Error('请输入大于0的数字值'))
            }else{
              callback()
          }
        }
      }
    }
    return {
      rulesForm: {
        formData: [],
        percentValue: ""
      },
      formLabelWidth: '92px',
      newPanelBar: false,
      dayPanelBar: false,
      rulesPercent: {
        percentValue:[
          { validator: validatePercent, trigger: 'blur' }
        ]
      }
      //advancedSetting: false
    }
  },
  computed: {
    ...mapGetters([
      'isActive'
    ])
  },
  components: {
    NoActive
  },
  created(){
    this.initFormData()
  },
  methods:{
    //初始化最简数据
    initFormData(){
      let arr = []

      for (let i = 1; i <= 5; i++) {
        const vObj = {
          value1:"",
          value2:"",
          isEnable: false,
          scoreType: 30 + i
        }
        arr.push(vObj)
      }

      this.rulesForm.formData = arr

      this.initRulesList()
    },

    // 获取规则列表数据
    initRulesList(){
      api.getStoreVipScoreRuleByType().then(res => {
        if(res.data){
          if(res.data.length !== 0){
            this.rulesForm.formData = res.data
            this.rulesForm.percentValue = parseInt(this.rulesForm.formData[4].value1)
          }
        }
      })
    },

    // 验证表单
    rulesFormConfirm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          this.rulesForm.formData[4].value1 = this.rulesForm.percentValue
          
          api.vipScoreRuleBatchSave(this.rulesForm.formData).then(res => {
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

    // 收起新手栏目
    hidenNewPanelBar(){
      this.newPanelBar = !this.newPanelBar
    },

    // 收起日常栏目
    hidenDayPanelBar(){
      this.dayPanelBar = !this.dayPanelBar
    },

    goback(){
      this.$router.back()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.animate-right
  transform rotate(-90deg)
  transition 300ms linear
  -moz-transition: 300ms linear
  -webkit-transition: 300ms linear
  -o-transition: 300ms linear
.animate-down
  transform rotate(0deg)
  transition 300ms linear
  -moz-transition: 300ms linear
  -webkit-transition: 300ms linear
  -o-transition: 300ms linear
.mb-record-set
  width 100%
  box-sizing border-box
  .form-item-width
    width 2rem
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
    .btn-column
      width 100%
      margin-top .5rem
      flex()
      justify-content center
    .panel-bar
      margin-bottom .1rem
      .head-bar
        width 100%
        height .8rem
        background rgba(255,255,255,1)
        border-radius 2px
        flex()
        justify-content space-between
        padding 0 .2rem
        box-sizing border-box
        cursor pointer
        i 
          display block
          &:first-child
            width .4rem
            height .4rem
            border-radius 100%
            text-align center
            line-height .4rem
            color #ffffff
        .icon-guizezhiding-
            background-color #6364D6
        .icon-jiaoyi
            background-color #FF5713
        .info
          flex-1()
          flex-direction column
          align-items flex-start
          margin-left .2rem
          h4
            font-size 18px
            color #4A4A4A
            margin-bottom .06rem
          p
            color #9B9B9B
            font-size 14px
      li
        flex()
        height .8rem
        background rgba(255,255,255,1)
        border-radius 2px
        margin-top .1rem
        justify-content space-between
        padding 0 .2rem
        box-sizing border-box
        p
          color rgba(74,74,74,1)
          font-size 14px
          min-width 3rem
        .el-form-item
          margin-bottom 0
        .middle-item
          width 5rem
      .real-box
        display inline-block
        height .4rem
        position relative
      .behind-desc
        position absolute
        right -.8rem
        top 0
        color #4A4A4A
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
      .open-advanced-setting
        margin .2rem 0
        font-size 14px
        color #6CDDC7
        text-align center
        cursor pointer
        i 
          margin-left .05rem
          font-size 13px
</style>
