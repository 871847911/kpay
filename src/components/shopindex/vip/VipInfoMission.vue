<template>
  <div class="vip-grow-rules">
    <div class="topbar layout-head">
      <h3>等级任务设置</h3>
      <div>
        <h3 @click="goback">
          <i class="iconfont icon-fanhui"></i>
          返回
        </h3>
      </div>
    </div>

    <div class="contain">
      <el-form :model="panelForm" ref="panelForm">
        <div class="panel-bar">
          <div class="head-bar" @click="hidenNewPanelBar">
            <i class="iconfont icon-xinshou-"></i>
            <div class="info">
              <h4>新手任务</h4>
              <p>新手任务每个用户只奖励一次，相关值必须位大于0的整数</p>
            </div>
            <i class="iconfont icon-jiantou" :class="[newPanelBar?'animate-down':'animate-right']"></i>
          </div>

          <ul v-show="newPanelBar">
            <li v-if="panelForm.newTask.length !== 0" v-for="(item,index) of panelForm.newTask" :key="index">
                <p>{{item.remark}}</p>
                <el-form-item label="成长值" :prop="'newTask.' + index + '.grow'" :label-width="formLabelWidth">
                  <div class="real-box">
                    <el-select v-model.number="item.grow">
                      <el-option label="10" value="10"></el-option>
                      <el-option label="15" value="15"></el-option>
                      <el-option label="20" value="20"></el-option>
                    </el-select>
                    <div class="right-mind">点</div>
                  </div>
                </el-form-item>
                <el-form-item label="">
                  <el-switch
                    v-model="item.isEnable"
                    :disabled="!item.grow"
                    active-color="#6CDDC7"
                    inactive-color="#AEB8BE">
                  </el-switch>
                </el-form-item>
            </li>
          </ul>
        </div>

        <div class="panel-bar">
          <div class="head-bar" @click="hidenDayPanelBar">
            <i class="iconfont icon-richangrenwu-"></i>
            <div class="info">
              <h4>日常任务</h4>
              <p>日常任务可以奖励多次，相关值必须位大于0的整数</p>
            </div>
            <i class="iconfont icon-jiantou" :class="[dayPanelBar?'animate-down':'animate-right']"></i>
          </div>

          <ul v-show="dayPanelBar">
            <li v-if="panelForm.dailyTask.length !== 0" v-for="(item,index) of panelForm.dailyTask" :key="index">
                 <p>{{item.remark}}</p>
                <el-form-item label="成长值" :prop="'dailyTask.' + index + '.grow'" :label-width="formLabelWidth">
                  <div class="real-box">
                    <el-select v-model.number="item.grow">
                      <el-option label="10" value="10"></el-option>
                      <el-option label="15" value="15"></el-option>
                      <el-option label="20" value="20"></el-option>
                    </el-select>
                    <div class="right-mind">点</div>
                  </div>
                </el-form-item>
                <el-form-item label="">
                  <el-switch
                    v-model="item.isEnable"
                    :disabled="!item.grow"
                    active-color="#6CDDC7"
                    inactive-color="#AEB8BE">
                  </el-switch>
                </el-form-item>
            </li>
          </ul>
        </div>

        <div class="btn-column">
          <el-form-item class="el-form-item-center">
            <el-button class="confirm-green" @click="panelFormConfirm('panelForm')">保 存</el-button>
          </el-form-item>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import api from 'fetch/api'

export default {
  name: 'VipInfoMission',
  data () {
    return {
      panelForm: {
        dailyTask: [],
        newTask: []
      },
      formLabelWidth: '60px',
      newPanelBar: false,
      dayPanelBar: false
    }
  },
  created(){
    this.initMissionList()
  },
  methods:{
    // 获取成长任务列表
    initMissionList(){
      api.getStoreVipTaskGrowConfigByType().then(res => {
        if(res.data){
          const { DailyTask, NewTask } = res.data

          this.panelForm.dailyTask = DailyTask ? DailyTask : []
          this.panelForm.newTask = NewTask ? NewTask : []
        }
      })
    },

    // 验证表单
    panelFormConfirm(formName){
      this.$refs[formName].validate(valid => {
        if (valid) {
          const data =  {
            DailyTask: this.panelForm.dailyTask,
            NewTask: this.panelForm.newTask
          }

          api.vipTaskGrowBatchSave(data).then(res => {
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
.vip-grow-rules
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
        .icon-xinshou-
            background-color #6CDDC7
        .icon-richangrenwu-
            background-color #F5A623
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
        .el-form-item
          margin-bottom 0
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
</style>
