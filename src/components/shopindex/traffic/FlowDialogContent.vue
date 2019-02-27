<template>
  <div class="dialog-content">
    <h2>流水详情</h2>
    <div class="info">
      <div>生成时间<span>{{data.frontCreateTime}}</span></div>
      <div>类型
        <span v-if="data.frontTransactionType === 1">流量充值</span>
        <span v-else-if="data.frontTransactionType === 2">储存流量消费</span>
        <span v-else>外网流量消费</span>
      </div>
      <div>发生金额<span>{{data.frontAmount}}元</span></div>
      <div>账户余额<span>{{data.frontSurplusAmount}}元</span></div>
    </div>

    <div v-if="data.frontTransactionType === 1">
      <h4>支付信息</h4>
      <div class="info">
        <div>支付流水号<span>{{data.channelId}}</span></div>
        <div>支付方式<span v-if="data.payType === 1">微信支付</span></div>
        <div>实付金额<span>{{data.payAmount}}元</span></div>
      </div>
    </div>

    <div v-if="data.frontTransactionType === 2">
      <h4>流量信息</h4>
        <div class="info">
          <div>当月储存空间量<span>{{data.storageSpace}}G</span></div>
          <div>免费赠送存储空间量<span>{{data.freeSpace}}G</span></div>
          <div>当月计费储存量<span>{{data.paySpace}}G</span></div>
          <div>每月每G储存空间计费<span>{{data.unitPrice}}元</span></div>
        </div>
    </div>

    <div v-if="data.frontTransactionType === 3">
      <h4>流量信息</h4>
        <div class="info">
          <div>当日外网流出量<span>{{data.dayOutFlow}}</span></div>
          <div>当月免费流量剩余<span>{{data.freeFlow}}</span></div>
          <div>当日计费外网流量<span>{{data.payFlow}}</span></div>
          <div>每月每G储存空间计费<span>{{data.unitPrice}}元</span></div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "FlowDialogContent",
  data() {
    return {};
  },
  props: {
    data: {
      type: Object,
      default: {}
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/varibles';

.dialog-content 
  width 100%
  display flex
  flex-direction column
  h2, h4 
    display flex
    color #4A4A4A
    font-weight 600
    margin-bottom .2rem
  h2 
    font-size 18px
  h4 
    font-size 12px
    margin-top 0.4rem
  .info 
    width 100%
    display flex
    flex-flow row wrap
    align-items center
    justify-content space-between
    >div 
      width 47%
      color #9B9B9B
      padding 5px 0
      margin-bottom 0.3rem
      border-bottom 1px solid #E6E6E6
      box-sizing border-box
      span
        float right
        color #4A4A4A
</style>
