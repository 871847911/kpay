<template>
  <div class="traffic-recharge">
    <div class="head layout-head">
      <h3>流量充值</h3>
      <h3 @click="toback">
        <i class="iconfont icon-fanhui"></i>返回
      </h3>
    </div>
    <el-alert
      :title="attention"
      type="info"
      show-icon>
    </el-alert>

    <div class="recharge-content">
      <div>
        <p>流量账户余额<span class="price">&#165;{{flowData.amount}}</span></p>
      </div>
      <div>
        <el-form ref="priceForm" :model="priceForm" :rules="formRules" label-width="70px">
          <el-form-item label="充值金额" prop="priceVaule">
            <el-input v-model.number="priceForm.priceVaule" placeholder="请输入充值金额"></el-input>
          </el-form-item>
        </el-form>
        <el-button class="major-btn" @click="handlePay">去支付</el-button>
      </div>
    </div>

    <el-dialog
      title="微信支付"
      width="540px"
      center
      @closed="closedDialog"
      :show-close="false"
      :close-on-click-modal	="false"
      :visible.sync="diaVisible">
      <div class="dialog-weixin">
        <div class="img-box">
          <img :src="base64Img" alt="二维码">
        </div>
        <p>还剩 <span class="left-second">{{leftSecond}}</span> 秒，二维码自动更新</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="lesser-btn btn-b" @click="diaVisible = false" style="margin-right:10px">关 闭</el-button>
        <el-button class="major-btn" @click="handleIsPayed" style="margin-left:10px">支付完成</el-button>
      </span>
    </el-dialog>

    <el-dialog
      width="480px"
      center
      :show-close="false"
      :close-on-click-modal	="false"
      :visible.sync="payVisible">
      <div class="dialog-pay">
        <div class="img-box">
          <i class="iconfont icon-gou-"></i>
        </div>
        <p>支付成功</p>
        <div class="price-info">
          <p>充值金额：<span>{{payedRecord.rechargeAmount}}</span>元</p>
          <p>流量账户余额：<span>{{payedRecord.balanceAmount}}</span>元</p>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="lesser-btn btn-b" @click="payVisible = false">关 闭</el-button>
      </span>
    </el-dialog>
  </div> 
</template>

<script>
import api from 'fetch/api'

export default {
  name: "TrafficAccountRecharge",
  data(){
    var validatePrice = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请输入充值金额'))
      } else {
        if(!Number.isInteger(value) && isNaN(value)){
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
      flowData: {},
      leftSecond: 180,
      attention: '',
      priceForm: {
        priceVaule: ''
      },
      formRules: {
        priceVaule:[
          { validator: validatePrice, trigger: 'blur' }
        ]
      },
      diaVisible: false,
      payVisible: false,
      base64Img: '',
      singlePaymentId: '', //支付成功后的订单ID
      payedRecord: {} //充值成功后的记录
    }
  },
  created(){
    this.init()
  },
  destroyed(){
    clearInterval(this.timerId)
  },
  methods: {
    init(){
      api.getStoreDetail().then(res => {
        if(res.data){
          this.flowData = res.data
          this.attention = '每次充值不得低于' + res.data.floorAmount + '元'
        }
      })
    },

    // 去支付
    handlePay(){
      this.$refs['priceForm'].validate((valid) => {
        if (valid) {
          this.orderIdInit().then(orderId => {
            if(!orderId) return false

            this.singlePaymentId = orderId
            this.countdownPayment()
          })
        } else {
          return false
        }
      })
    },

    // 倒计时支付
    countdownPayment(){
      this.codeInit(this.singlePaymentId).then(data => {
        if(!data) return false

        this.base64Img = `data:image/png;base64,${data}`
        this.leftSecond = 180
        this.diaVisible = true

        clearInterval(this.timerId)
        this.timerId = setInterval(() => {
          this.countdownTimer()
        }, 1000)
      })
    },

    // 倒计时时间
    countdownTimer(){
      if(this.leftSecond < 0) return new Error('刷新时间出现错误！')

      if(this.leftSecond === 0){
        this.countdownPayment()
      }else{
        this.leftSecond--
      }
    },

    // 查询充值信息
    handleIsPayed(){
      api.queryRechargeResult({
        wechatOrderId: this.singlePaymentId
      }).then(res => {
        if(res.success){
          if(!res.data) return false

          const { orderStatus } = res.data

          if(orderStatus === 1){
            this.$message.info('您的订单尚未支付！')
          }else if(orderStatus === 2){
            this.diaVisible = false
            this.payVisible = true
            this.payedRecord = res.data
            this.init()
          }
        }else{
          this.$message.error(res.message)
        }
      })
    },

    // 生成订单
    orderIdInit(){
      return api.createUnifyOrder({
        amount: this.priceForm.priceVaule
      }).then(res => {
        if(res.success){
          return res.data
        }else{
          this.$message.error(res.message)
          return false
        }
      }).catch(err => {
        return false
      })
    },

    // 二维码
    codeInit(id){
      return api.createQrCode({
        wechateOrderId: id
      }).then(res => {
        if(res.success){
          return res.data
        }else{
          this.$message.error(res.message)
          return false
        }
      }).catch(err => {
        return false
      })
    },

    // 关闭弹窗的回调
    closedDialog(){
      clearInterval(this.timerId)
    },

    // 返回
    toback(){
      this.$router.back()
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/varibles';

.el-form-item
  margin-bottom 0
.el-form-item__label
  text-align left 
  color #9b9b9b
.el-dialog--center .el-dialog__body
  padding 5px 25px 25px 30px
.el-dialog__footer
  padding 20px 10px 30px 20px
.traffic-recharge
  width 100%
  font-size 14px
  .head
    h3
      justify-content flex-start
      font-size 20px
      color #4A4A4A
      &:last-child
        color #9B9B9B
        cursor pointer
      i 
        margin-right .05rem
  .recharge-content
    >div
      display flex
      align-items center
      justify-content flex-start
      background-color #ffffff
      border-radius 5px
      height 1.4rem
      margin-bottom .2rem
      padding 0 .2rem
      box-sizing border-box
      .price 
        color #1F2724
        font-size 30px
        margin-left .2rem
      p 
        color #9B9B9B
      .el-input
        width 3rem
        margin-right .2rem
.dialog-weixin
  text-align center
  .img-box
    width 3.19rem
    height 3.17rem
    margin 0 auto
  img 
    width 100%
    height 100%  
  .left-second
    color #D0021B
.dialog-pay
  text-align center
  .img-box
    width 1rem
    height 1rem
    border-radius 50%
    background-color $color-theme
    color #ffffff
    text-align center 
    line-height 1rem
    margin 0 auto
    i 
      font-size 60px
  >p
    color #4A4A4A
    font-weight 600
    line-height .5rem
    font-size .2rem
  .price-info
    display flex
    align-items center
    justify-content center
    width 4rem
    background-color #EEEEEE
    color #9B9B9B
    margin-top .4rem
    p 
      font-size 14px
      padding .2rem 0
      &:first-child
        margin-right .3rem
    span 
      color #4A4A4A
</style>
