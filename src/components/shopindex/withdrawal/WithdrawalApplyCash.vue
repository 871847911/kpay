<template>
    <div class="finance-detail">
      <div class="finance-head flex_cloumn">
        <span>申请提现</span>
        <router-link to="/index/withdrawalapply"> <span><i class="iconfont icon-fanhui"></i>返回</span></router-link>
      </div>
      <div class="input_container">
        <div class="withdraw">
          <div class="withdraw-top">
            <span>￥{{statsData.profit}}</span>
            <span>可提现金额</span>
            <div class="inline"></div>
          </div>
          <div class="withdraw-bottom">
            <el-form ref="withdrawForm" :model="withdrawForm" :rules="rules2">
              <el-form-item prop="bankId" class="bankSelect">
                <div class="bottom-box">
                  <span>银行卡</span>
                  <el-select v-model="withdrawForm.bankId" placeholder="请选择储蓄银行卡">
                    <el-option
                      v-for="item in bankList"
                      :key="item.id"
                      :label="item.bankName"
                      :value="item.id">
                    </el-option>
                  </el-select>
                  <p class="manage"><span @click="dialogFormVisible = true">管理银行卡</span></p>
                </div>
              </el-form-item>
              <el-form-item prop="amount">
                <div class="bottom-box">
                  <span>金额</span>
                  <el-input type="number" v-model.number="withdrawForm.amount" placeholder="请输入提现金额"></el-input>
                </div>
              </el-form-item>
            </el-form>
            <el-button style="color:#ffffff;" type="primary" @click="applyWithdrawal('withdrawForm')">提交</el-button>
          </div>
        </div>
      </div>
      <el-dialog :title= "titleData" :visible.sync="dialogFormVisible" :show-close="true" width="840px">
          <div class="bank-card">
            <ul>
              <li v-for="item in bankList"
                :key="item.id"
              >
                <div class="title-container">
                  <span>{{item.bankName}}</span>
                  <div class="iconfont-container">
                    <i class="iconfont icon-yinhangqiabianji-" @click="editor(item)"></i>
                    <i class="iconfont icon-lajitong- delete" @click="deleteBankCard(item.id)"></i>
                  </div>
                </div>
                <p class="number">{{item.cardNumber}}</p>
                <p class="bank-where">开户行</p>
                <p class="adress">{{item.openBankName}}</p>
              </li>
              <li class="addbank" @click="addCard">
                <i class="iconfont icon-yinhangqia-"></i>
                <span>添加银行卡</span>
              </li>
            </ul>
            <div class="bankcardadd" v-show="bankEditorState">
              <el-form ref="formBank" :model="formBank" :rules="rules2" label-width="80px">
                <el-form-item prop="userName">
                   <div class="bank-input">
                    <span>姓名</span>
                    <el-input
                      placeholder="请输入内容"
                      :value="realName"
                      :disabled="true">
                    </el-input>
                  </div>
                </el-form-item>
                <el-form-item prop="cardNumber">
                  <div class="bank-input">
                    <span>卡号</span>
                    <el-input
                      placeholder="收款人储蓄卡"
                      v-model="formBank.cardNumber"
                    >
                    </el-input>
                  </div>
                </el-form-item>
                <el-form-item prop="bankName">
                  <div class="bank-input">
                    <span>银行</span>
                    <el-input
                      placeholder="请输入储蓄卡银行"
                      v-model="formBank.bankName"
                    >
                    </el-input>
                    <!-- <el-select v-model="formBank.bankName" placeholder="请选择储蓄卡银行">
                      <el-option
                        v-for="item in selectList"
                        :key="item.id"
                        :label="item.name"
                        :value="item.name">
                      </el-option>
                    </el-select> -->
                  </div>
                </el-form-item>
                <el-form-item prop="openBankName">
                  <div class="bank-input">
                    <span>开户行</span>
                    <el-input
                      placeholder="请填写开户行信息"
                      v-model="formBank.openBankName"
                    >
                    </el-input>
                  </div>
                </el-form-item>
                <el-button style="margin:40px auto 26px;" @click="addbank('formBank')">提交</el-button>
              </el-form>           
            </div>
          </div>
      </el-dialog>
    </div>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from "vuex"

export default {
  name:'WithdrawalApplyCash',
  data () {
    var bankCardPass = (rule, value, callback) => {
    　　if(!value) {
          return callback(new Error('请输入银行卡号'));
        }
        var num = /^\d*$/; //全数字
        if(!num.exec(value)) {
          return callback(new Error('银行卡号必须全为数字'));
        }
        if(value.length < 16 || value.length > 19) {
          return callback(new Error('银行卡号长度必须在16到19之间'));
        }
        //开头6位
        var strBin = "10,18,30,35,37,40,41,42,43,44,45,46,47,48,49,50,51,52,53,54,55,56,58,60,62,65,68,69,84,87,88,94,95,98,99";
        if(strBin.indexOf(value.substring(0, 2)) == -1) {
          return callback(new Error('银行卡号开头6位不符合规范'));
        }else{
          return callback();
        }
    };
    var validatePercent = (rule, value, callback) => {
      if (value === '') {
        return callback("金额不能为空或输入有误")
      } else {
        if(value < 0){
          return callback(new Error('请输入大于0的数字值'))
        }else if(0<value && value<100){
          return callback(new Error('提现额度必须大于100'))
        }else{
          return callback()
        }
      }
    };
    return {
      rules2: {
        cardNumber: [
          { validator: bankCardPass, trigger: 'blur'}
        ],
        bankId:[
          { required: true, message: '请选择银行'},
        ],
        amount: [
          { validator: validatePercent, trigger: 'blur'}
        ],
        bankName:[
          { required: true, message: '请输入储蓄银行'}
        ],
        openBankName:[
          { required: true, message: '填写开户行',trigger: 'blur'}
        ]
      },
      titleData:'银行卡管理',
      dialogFormVisible:false,
      selectList:[{ // 银行卡下拉列表
        value:"国家开发银行",
        name:"国家开发银行",
        id:1
      },{
        value:"中国银行",
        name:"中国银行",
        id:2
      },{
        value:"中国工商银行",
        name:"中国工商银行",
        id:3
      }],
      bankList: [],// 银行卡下拉列表,
      bankId:'',
      amount:'',
      formBank:{
        userName:'张三',// 用户的姓名
        bankName:'',
        cardNumber:'',
        openBankName:''
      },
      withdrawForm:{
        bankId:'',
        amount:''
      },
      statsData:'',
      bankEditorState:false,// 编辑框状态
      editorId:''// 编辑Id
    }
  },
  computed:{
    ...mapGetters([
      "userId",
      "realName"
    ])
  },
  created(){
    this.userName = this.realName
    this.getBankCardList()
    this.getUserAccountStats()
  },
  methods: {
    applyWithdrawal(form){// 申请提现
       this.$refs[form].validate((valid) => {
          if (valid) {
            api.applyWithdrawal(this.withdrawForm).then(res => {
              if(res.success){
                this.$message("提现成功")
                this.dialogFormVisible=false
              }else{
                this.$message(res.message)
              }
            });
          } else {
            return false;
          }
      });
    },
    getBankCardList(){ // 银行卡列表
      api.getBankCardList().then(res => {
        if(res.data){
          if(res.data.length > 0){
            res.data.forEach(item => {
              item.bankName = `${item.bankName} ( ${item.cardNumber.substr(item.cardNumber.length - 4)} )`
            })
          }

          this.bankList = res.data
          this.formBank = {};
          this.formBank.userName=this.realName
        }
      });
    },
    getUserAccountStats(){// 申请提现统计数据
      api.getUserAccountStats().then(res => {
        if(res.data){
          this.statsData = res.data;
        }
      });
    },
    addbank(formBank){// 添加银行卡   
      this.$refs[formBank].validate((valid) => {
          if (valid) {
            if(this.editorId ==""){
              api.addBankCard(this.formBank).then(res => {
                if(res.success){
                  this.getBankCardList()
                  this.bankEditorState = false
                }
              });
            }else{
              this.formBank.id=this.editorId
              api.modifyBankCard(this.formBank).then(res => {
                if(res.success){
                  this.getBankCardList()
                  this.bankEditorState = false
                  this.editorId=""
                }
              });
            }
           
          } else {
            return false;
          }
      });
    },
    deleteBankCard(valueId){// 删除银行卡
      api.deleteBankCard({id:valueId}).then(res => {
        if(res.success){
          const list = [...this.bankList]
          this.bankList = list.filter(item => {
            return item.id !== valueId
          })
          this.$message({
            message: '删除成功',
            type: 'success'
          });
        }
      });
    },
    editor(item){
      this.bankEditorState = true
      this.editorId = item.id

      const {userName, bankName, cardNumber, openBankName} = item 

      this.formBank = {...this.formBank, userName, bankName, cardNumber, openBankName}
    },
    addCard(){
      this.bankEditorState = true
      this.editorId=""

      this.$refs['formBank'].resetFields();
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
  a
    color #9B9B9B
  .flex_cloumn
    display flex
    flex-direction row
    align-items center
    justify-content space-between
  .finance-detail
    box-sizing border-box
    width 100%
    >>>.el-dialog
      border-radius 4px
    >>>.el-dialog__title
      font-weight 600
    >>>.el-dialog__header
      padding 20px 20px 0 30px
      font-weight 600
    >>>.el-dialog__body
      padding 0
      // padding 40px 20px
    >>>.el-alert--warning
        color #666666
        background:rgba(255,170,0,1) rgba(255,255,255,0.9);
    >>>.el-icon-warning:before
        color #e6a23c
    .finance-head
      font-size 20px
      font-weight 400
      margin-bottom 20px
      color rgba(155,155,155,1)
      line-height 28px
      .el-button--success
        background-color #6CDDC7
      >>>.el-dialog__title
        height 25px
        font-size 18px
        font-weight 600
        color rgba(74,74,74,1)
        line-height 25px
    .input_container
      width 100%
      height 522px
      background-color #ffffff
      .withdraw
        width 720px
        margin 0 auto
        height 100%
        .withdraw-top
          flex-direction column
          flex()
          span:nth-child(1)
            margin-top 60px
            height 42px
            font-size 30px
            font-weight 600
            color $color-theme
            line-height 42px
          span:nth-child(2)
            margin-top 10px
            height 20px
            font-size 14px
            font-weight 400
            color rgba(155,155,155,1)
            line-height 20px
          .inline
            margin-top 30px
            width 720px
            height 1px
            background rgba(230,230,230,.4)
        .withdraw-bottom
          flex()
          flex-direction column
          .bottom-box
            columnFlex()
            align-items flex-start
          .bankSelect
            margin-top 40px
            margin-bottom 0
            >>>.el-form-item__error
              top 79%
            .manage
              width 100%
              margin-top 10px
              text-align right
              height 20px
              font-size 14px
              font-weight 400
              line-height 20px
              span 
                 color $color-theme
                 cursor pointer
            span 
              margin-bottom 5px
              height 22px
              font-size 14px
              font-weight 400
              color rgba(74,74,74,1)
              line-height 22px
            .el-select,.el-input
              position relative
              width 360px
            .el-input:before
              height 20px
              content "元"
              position absolute
              right 20px
              top 50%
              margin-top -10px
          button 
            width 120px
            height 40px
            background $color-theme
            border-radius 4px
            margin-top 60px
    .bank-card
      width 840px
      background-color #ffffff
      ul
        overflow hidden
        padding 40px 30px
        li
          border-radius 4px
          box-sizing border-box
          padding 20px
          float left
          // margin-left 40px
          width 370px
          height 211px
          columnFlex()
          border 1px solid rgba(230,230,230,1)
          width 370px
          height 211px
          .title-container
            width 100%
            height 28px
            line-height 28px
            margin-bottom 1px
            flexBetween() 
            span:nth-child(1)
              height 28px
              font-size 20px
              font-weight 600
              color rgba(74,74,74,1)
              line-height 28px
            >>>.iconfont
              font-size 14px
              color #9B9B9B 
            .delete
              margin-right 1px
          p.number
            height 25px
            font-size 18px
            font-weight 400
            color rgba(74,74,74,1)
            line-height 25px
          p
            width 100%
            text-align left
          
          p.bank-where
            height 20px
            font-size 14px
            font-weight 400
            color rgba(155,155,155,1)
            line-height 20px
            margin-top 75px 
          p.adress
            height 20px
            font-size 14px
            font-weight 400
            color rgba(74,74,74,1)
            line-height 20px 
        li:nth-child(n+3)
          margin-top 40px
        li:nth-child(2n)
          margin-left 40px
        li:first-child
          margin-left 0    
        li.addbank
          border 1px solid $color-theme 
          i
            font-size 80px
            color #6CDDC7
            padding-top 30px
          span 
            height 25px
            font-size 18px
            font-weight 400
            color $color-theme
            line-height 25px
      .bankcardadd
        padding 30px 30px 0 30px
        box-sizing border-box
        background rgba(249,250,249,1)
        text-align center
        width 100%
        .el-form-item
          width 360px
          float left
          >>>.el-form-item__content
            width 360px
            margin-left 0!important
        .bank-input
          width 360px
          columnFlex()
          align-items flex-start
          float left
          .el-select
            width 100%
          span 
            height 22px
            line-height 22px
            margin-bottom 5px
        .el-form-item:nth-child(2),.el-form-item:nth-child(4)
          margin-left 60px
        .bank-input:nth-child(3),.bank-input:nth-child(4)
          margin-top 20px
        button 
          width 120px
          height 40px
          background $color-theme
          color #ffffff
          border none
          border-radius 4px
</style>

