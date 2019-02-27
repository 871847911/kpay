<template>
  <div class="panel course-panel">
    <p>付费课程结算规则</p>
    <div class="content">
      <div class="head">
        <p>服务费率设置</p>
        <p @click="dialogAddRateVis = true"><i class="iconfont icon-tianjia-"></i>新增费率</p>
      </div>
      <div class="box">
        <table v-if="courseList && courseList.length !== 0">
          <tr>
            <th style="width: 12%">默认费率</th>
            <th style="width: 20%">收取服务费率</th>
            <th style="width: 15%">结算时间
              <el-popover
                popper-class="popper-class"
                placement="top-start"
                width="200"
                trigger="hover"
                content="T+N表示用户支付后，N天后进行结算，结算至对方【可提现余额】中。T+0表示即时结算">
                <p slot="reference">
                  <i class="iconfont icon-wenhao-1"></i>
                </p>
              </el-popover>
            </th>
            <th style="width: 20%">关联生产者人数</th>
            <th style="width: 33%">操作</th>
          </tr>
          <tr v-for="item of courseList" :key="item.ruleId">
            <td>
              <span  v-if="item.ruleDefault === 1" class="tag">默认费率</span>
            </td>
            <td>{{item.serviceRate}}%</td>
            <td>T + {{item.settlementTime}}</td>
            <td>{{item.userNum}}人</td>
            <td>
              <el-row class="action-row">
                <el-button size="mini" @click="changeRate(item)">更改费率</el-button>
                <el-button size="mini" @click="changeSettlement(item)">结算时间</el-button>
                <el-button size="mini" @click="connectProduct(item)">关联生产者</el-button>
                <el-button size="mini" @click="lookProduct(item)">查看</el-button>
                <div class="delete" v-if="item.ruleDefault !== 1" @click="item.deleteRow = !item.deleteRow">
                  <i class="iconfont icon-shutiaogengduo-"></i>
                  <el-button v-if="item.deleteRow" size="mini" class="delete-btn" @click="delColumn(item)">删除</el-button>
                </div>
                <div class="delete" v-else></div>
              </el-row>
            </td>
          </tr>
        </table>

        <!-- <div class="btn-box">
          <el-button class="save">保存设置</el-button>
        </div> -->
      </div>
    </div>

    <!-- 更改费率 -->
    <el-dialog title="更改费率" :visible.sync="dialogRateVis" width="800px" @closed="resetForm('changeRateForm')">
      <el-form :model="changeRateForm" ref="changeRateForm" label-position="top" :rules="rulesRateForm">
        <el-form-item label="当前费率" prop="curRate">
          <div class="real-box">
            <el-input type="number" v-model.number="changeRateForm.curRate" auto-complete="off" :disabled="true"></el-input>
            <div class="right-mind">%</div>
          </div>
        </el-form-item>
        <el-form-item label="关联人数" prop="users">
          <div class="real-box">
            <el-input type="number" v-model.number="changeRateForm.users" auto-complete="off" :disabled="true"></el-input>
            <div class="right-mind">人</div>
          </div>
        </el-form-item>
        <el-form-item label="新费率" prop="newRate">
          <div class="real-box">
            <el-input type="number" v-model.number="changeRateForm.newRate" auto-complete="off"></el-input>
            <div class="right-mind">%</div>
          </div>
        </el-form-item>

        <div class="btn-column">
          <el-form-item class="el-form-item-center">
            <el-button class="confirm-green" @click="submitChangeRate('changeRateForm')">提 交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>

    <!-- 新增费率 -->
    <el-dialog title="新增费率" :visible.sync="dialogAddRateVis" width="800px" @closed="resetForm('rateForm')">
      <el-form :model="rateForm" ref="rateForm" label-position="top" :rules="rulesRateForm">
        <el-form-item label="服务费率" prop="serviceRate">
          <div class="real-box">
            <el-input type="number" v-model.number="rateForm.serviceRate" auto-complete="off"></el-input>
            <div class="right-mind">%</div>
          </div>
        </el-form-item>
        <el-form-item label="结算时间" prop="settlementTime">
          <div class="real-box">
            <el-input type="number" class="settleTimeInput" v-model.number="rateForm.settlementTime" auto-complete="off"></el-input>
            <div class="right-mind">天</div>
          </div>
        </el-form-item>

        <div class="btn-column">
          <el-form-item class="el-form-item-center">
            <el-button class="confirm-green" @click="submitAddRate('rateForm')">提 交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>

    <!-- 设置结算时间 -->
    <el-dialog title="设置结算时间" :visible.sync="dialogTimerVis" width="800px" @closed="resetForm('settleForm')">
      <el-form :model="settleForm" ref="settleForm" label-position="top" :rules="rulesRateForm">
        <el-form-item label="当前结算时间" prop="curSettle">
          <div class="real-box">
            <el-input type="number" class="settleTimeInput" v-model.number="settleForm.curSettle" auto-complete="off" :disabled="true"></el-input>
            <div class="right-mind">天</div>
          </div>
        </el-form-item>
        <el-form-item label="关联人数" prop="users">
          <div class="real-box">
            <el-input type="number" v-model.number="settleForm.users" auto-complete="off" :disabled="true"></el-input>
            <div class="right-mind">人</div>
          </div>
        </el-form-item>
        <el-form-item label="新结算时间" prop="newSettle">
          <div class="real-box">
            <el-input type="number" class="settleTimeInput" v-model.number="settleForm.newSettle" auto-complete="off"></el-input>
            <div class="right-mind">天</div>
          </div>
        </el-form-item>

        <div class="btn-column">
          <el-form-item class="el-form-item-center">
            <el-button class="confirm-green" @click="submitSettleTime('settleForm')">提 交</el-button>
          </el-form-item>
        </div>
      </el-form>
    </el-dialog>

    <!-- 删除 -->
    <el-dialog :visible.sync="dialogDelVis" width="650px">
      <div class="flex-clomun">
        <i class="iconfont icon-zaiciqueren tubiao"></i>
        <p class="tip">您确定要删除该费率吗？</p>
        <p class="tip-second">删除后，关联该费率的所有生产者将适用默认费率</p>
        <div class="footer-clomun">
            <button @click="dialogDelVis = false">取消</button>
            <button @click="delColumnContinue">继续删除</button>
        </div>
      </div>
    </el-dialog>

     <!-- 关联生产者 -->
    <el-dialog title="关联生产者" :visible.sync="dialogConectVis" width="840px">
      <div class="producer-dialog">
        <ul v-if="connectPerson.length > 0">
            <li v-for="(item, index) of connectPerson" :key="item.id" @click="chooseConnectPerson(index)">
              <div class="producer" :class="[item.active ? 'active' : '']" :style="{
                backgroundImage: `url(${item.photoUrl})`
              }"></div>
              <p>{{item.contact}}</p>
            </li>
        </ul>
        <h3 v-else style="margin: 10px 0 40px 0">暂无生产者可关联</h3>
        <p class="remind">付费课程费率 {{showRate}}，结算时间 {{showTime}}，已选择<span>{{conntentLen}}</span>个生产者</p>
        <el-button class="confirm-green" @click="connected()">关 联</el-button>
      </div>
    </el-dialog>

    <!-- 查看生产者 -->
    <el-dialog title="查看生产者" :visible.sync="dialogLookVis" width="840px">
      <div class="producer-dialog">
        <ul v-if="alreadyConnectPerson.length > 0">
          <li v-for="item of alreadyConnectPerson" :key="item.id">
            <div class="producer" :class="[item.active ? 'active' : '']" :style="{
              backgroundImage: `url(${item.photoUrl})`
            }"></div>
            <p>{{item.contact}}</p>
          </li>
        </ul>
        <h3 v-else style="margin: 10px 0 40px 0">暂无生产者</h3>
        <p class="remind">付费课程费率 {{showRate}}，结算时间 {{showTime}}，共有<span>{{alreadyConnectPerson.length}}</span>个生产者</p>
        <el-button class="confirm-green" @click="dialogLookVis = false">关 闭</el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from "vuex"

export default {
  name: 'BalanceCourse',
  data () {
    var validateNum = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入服务费率和结算时间'))
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
      connectPerson: [], // 可关联的所有人
      conntentLen: 0, //选择后关联的数量
      alreadyConnectPerson: [], //已关联的人
      rowItem: {}, // 点击单条临时存储变量
      dialogAddRateVis: false, // 新增费率开关
      dialogRateVis: false, // 更改费率开关
      dialogTimerVis: false, //设置结算时间
      dialogConectVis: false, // 关联生产者开关
      dialogLookVis: false, // 查看人员开关
      dialogDelVis: false, // 继续删除开关
      showRate:0,// 付费课程费率，
      showTime:0,// 结算时间
      settleForm: {
        curSettle: "",
        users: "",
        newSettle: ""
      },
      changeRateForm: { //更改费率表单
        curRate: "",
        users: "",
        newRate:"",
        ruleId: ""
      },
      rateForm:{ // 新增费率表单
        serviceRate: "",
        settlementTime: ""
      },
      rulesRateForm: { // 新增费率表单规则验证
        serviceRate:[{ validator: validateNum, trigger: 'blur' }],
        settlementTime:[{ validator: validateNum, trigger: 'blur' }],
        newRate: [{ validator: validateNum, trigger: 'blur' }],
        newSettle: [{ validator: validateNum, trigger: 'blur' }]
      }
    }
  },

  props:{
    courseList: Array
  },

  methods: {
    // 新增费率
    submitAddRate(formName){
      this.allFormRulesPass(formName).then(valid => {
        if(valid){
          api.addPayStoreRule({
            ruleType: 1,
            ...this.rateForm
          }).then(res => {
            if(res.success){
              this.msgNotify('新增成功')
              // 通知父组件重新请求数据
              this.$emit('refresh')
            }else{
              this.msgNotify('新增失败', true)
            }
            this.dialogAddRateVis = false
          })
        }
      })
    },

     // 更改费率
    changeRate(row){
      this.dialogRateVis = true
      const { serviceRate, userNum, ruleId } = row

      this.changeRateForm.curRate =  serviceRate
      this.changeRateForm.users =  userNum
      this.changeRateForm.ruleId = ruleId
     },

     // 更改费率提交
     submitChangeRate(formName){
       this.allFormRulesPass(formName).then(valid => {
          if(valid){
            const { newRate, ruleId } = this.changeRateForm

            api.updateServiceRate({
              ruleId: ruleId,
              serviceRate: newRate
            }).then(res => {
              if(res.success){
                this.msgNotify('更改成功')
                this.$emit('courseChangeItem', ruleId, newRate)
              }else{
                this.msgNotify('更改失败', true)
              }
              this.dialogRateVis = false
            })
          }
       })
     },

     // 删除
     delColumn(row){
       this.rowItem = {...row}
       this.dialogDelVis = true
     },

     //确认继续删除
     delColumnContinue(){
        const { ruleId } = this.rowItem

        api.deletePayStoreRule({
          ruleId: ruleId
        }).then(res => {
          if(res.success){
            this.msgNotify('删除成功')
            this.$emit('courseDelItem', ruleId)
          }else{
            this.msgNotify('删除失败', true)
          }
          this.dialogDelVis = false
        })
     },

     // 关联生产者
    connectProduct(row){
      this.showRate = row.serviceRate + '%'
      this.showTime = "T+" + row.settlementTime
      this.rowItem = {...row}
      this.dialogConectVis = true

      api.getRelationUserList({
        ruleId: row.ruleId
      }).then(res => {
        if(res.data){
          res.data.map(v => {
            v.active = false
            return v
          })
          this.connectPerson = res.data
        }
      })
    },

     // 选择关联着
    chooseConnectPerson(index){
      this.connectPerson[index].active = !this.connectPerson[index].active

      this.conntentLen = this.connectPerson.filter(v => {
        return v.active === true
      }).length
    },

    // 关联
    connected(){
      const { ruleId } = this.rowItem

      const getUserIds = this.connectPerson.filter(v => {
        return v.active === true
      }).map(v => {
        return v.userId
      })

      if(getUserIds.length > 0){
        api.relationUser({
          ruleId: ruleId,
          userIds: getUserIds,
          ruleType: 1
        }).then(res => {
          this.dialogConectVis = false
          this.$emit('refresh')

          this.$message({
            message: "关联成功",
            type: "success"
          })
        }).catch(err => {
          this.$message({
            message: "关联失败",
            type: "error"
          })
        })
      }else{
        this.$message({
          message: "请选择关联对象",
          type: "warning"
        })
      }
    },

    // 查看关联者
     lookProduct(row){
      this.showRate = row.serviceRate + '%'
      this.showTime = "T+" + row.settlementTime
      this.dialogLookVis = true
      
      api.getAllRelationUserList({
        ruleId: row.ruleId
      }).then(res => {
        if(res.data){
          this.alreadyConnectPerson = res.data
        }
      })
     },
    
    // 更改结算
     changeSettlement(row){
       this.dialogTimerVis = true

      const { settlementTime, userNum, ruleId } = row

      this.settleForm.curSettle =  settlementTime
      this.settleForm.users =  userNum
      this.settleForm.ruleId = ruleId
     },

    // 提交结算时间
     submitSettleTime(formName){
       this.allFormRulesPass(formName).then(valid => {
          if(valid){
            const { newSettle, ruleId } = this.settleForm

            api.updateSettlementTime({
              ruleId: ruleId,
              settlementTime: newSettle
            }).then(res => {
              if(res.success){
                this.msgNotify('更改成功')
                this.$emit('courseChangeSettle', ruleId, newSettle)
              }else{
                this.msgNotify('更改失败', true)
              }
              this.dialogTimerVis = false
            })
          }
       })
     },

     // 对消息提示封装
     msgNotify(msg, isErr){
       if(isErr === undefined) isErr = false

       this.$message({
            message: msg,
            type: isErr ? 'error' : 'success'
        })
     },

    // 重置表单
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },

    //所有验证表单经过的规则
     allFormRulesPass(formName){
       return new Promise((resolve, reject) => {
         this.$refs[formName].validate(valid => {
            if (valid) { 
              resolve(valid)
            } 
            else {
              return reject(valid)
            }
          })
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.producer-dialog
  width 100%
  flex()
  flex-direction column
  ul
    width 100%
    flex()
    flex-flow row wrap
    justify-content flex-start
    border-bottom 1px solid rgba(230,230,230,1)
    padding-bottom .35rem
    max-height 6rem
    overflow auto
  li
    flex()
    flex-direction column
    justify-content center
    align-items center
    margin-right .13rem
    height 1.7rem
    .producer
      width 1.2rem
      height 1.2rem
      border-radius 50%
      background-repeat no-repeat
      background-position center
      background-size cover
      box-sizing border-box
      cursor pointer
    .active
      border 2px solid $color-theme
    p
      font-size 18px
      font-weight 600
      line-height .35rem
  .remind
    width 100%
    display block
    text-align left 
    margin .1rem 0 .4rem 0 
    color #9B9B9B
    font-size 18px
    span
      color $color-theme
.flex-clomun
  display flex
  flex-direction column
  justify-content center
  align-items center
  .tubiao
    color #FF6767  
    font-size 0.95rem 
  .tip
    margin-top 0.29rem 
    height 25px 
    font-size 18px
    font-weight 600
    color rgba(74,74,74,1)
    line-height 25px
  .tip-second
    margin-top 10px 
    height 25px 
    font-size 0.18rem
    font-weight 400
    color rgba(155,155,155,1)
    line-height 25px 
  .footer-clomun
    margin 37px auto
    height 40px
    button
      width 120px
      height 40px
      border-radius:4px;
      box-sizing border-box
      text-align center
      cursor pointer
    button:nth-child(1)
      background-color #ffffff
      color #9B9B9B
      margin-right 20px
      border:1px solid rgba(230,230,230,1);
    button:nth-child(2)
      background-color #6CDDC7
      color #ffffff
.el-form
  flex()
  flex-direction column
  justify-content center
  .el-input
    width 3.6rem
  .btn-column
    margin-top .2rem
.icon-wenhao-1 
  display inline-block
  color $color-text-l
  width .18rem
  height .18rem
  line-height .18rem
  font-size 14px
  margin-left .04rem
  border-radius 50%
  background-color #D8D8D8
  text-align center
.panel
  width 100%
  font-size 14px
  &>p
    display block
    color $color-text-l
    text-align left 
.course-panel
  margin-top .1rem
.content
  margin-top .1rem
  .head
    height .6rem
    color $color-text-l
    padding 0 .2rem
    background #F9FAF9
    flex()
    justify-content space-between
    align-items center
    i 
      color $color-theme
      font-size 20px
      margin-right .1rem
    p
      flex()
      align-items center
      &:last-child
        cursor pointer
  .box
    background-color #ffffff
    min-height 3.7rem
    padding .2rem
    box-sizing border-box
    .btn-box
      flex()
      align-items center
      justify-content center
      padding .2rem 0
      .save
        width 1.2rem
        height .4rem
        background-color $color-theme
        color #ffffff
        font-size 12px
    table
      width 100%
      text-align center
      font-size 14px
      tr
        background-color #ffffff
        &:nth-child(odd)
          background-color #F9FAF9
      th
        font-weight normal
        color #4A4A4A
        height .6rem
        p
          cursor pointer
      td
        height 1rem
        color #4A4A4A
        .tag
          display inline-block
          width .8rem
          height .28rem
          text-align center
          line-height .25rem
          background-color $color-theme
          border-radius .15rem
          color #ffffff
        .action-row button
          height .3rem
          padding 0rem .1rem
          border-radius .04rem
          border 1px solid #E6E6E6
          font-size 12px
          color $color-text-l
        .delete
          width .2rem
          height .28rem
          display inline-block
          color #9B9B9B
          margin-left .05rem
          position relative
          cursor pointer
          .delete-btn
            position absolute
            top -.05rem
            right 100%
            box-shadow 0px 2px 11px 0px rgba(0,0,0,0.3)
            text-align center
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

<style lang="stylus">
.settleTimeInput
  position relative
  .el-input__inner
    padding-left .6rem !important
.settleTimeInput::before
  content "T+"
  position absolute
  left .2rem
  top 0
  color #9B9B9B
</style>