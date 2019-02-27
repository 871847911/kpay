<template>
  <div class="pay-setting">
    <div class="topbar layout-head">
      <h3>小程序支付设置</h3>
      <div>
        <h3 @click="goBack">
          <i class="iconfont icon-fanhui"></i>返回</h3>
      </div>
    </div>
    <div class="set-pay">
        <div class="already-set">
          <div class="content">
            <h3><span v-if="data" class="yes">已设置</span><span v-else class="no">未设置</span></h3>
            <p>前提条件：你需要在微信公众平台申请开通“微信认证服务号”，且此服务号需要向微信申请开通“微信支付权限”；</p>
            <p>你可以在此配置，使用自己的微信支付。收入直接进入你的微信支付对应的帐号。微信将收取每笔0.6%的交易手续费</p>
          </div>
          <el-button v-if="data" class="major-btn" style="width:100px" @click="isGoPay= true">去设置</el-button>
        </div>

        <UploadAuth v-if="isGoPay" :appId="$route.query.appId" :data="data" />
      </div>
  </div>
</template>

<script>
import api from 'fetch/api'
import UploadAuth from "./UploadAuth";

export default {
  name: "AuthSmallProgramPay",
  data() {
    return {
      isGoPay: false,
      data: null
    };
  },
  components: {
    UploadAuth
  },
  mounted(){
    this.init()
  },
  methods: {
    init(){
      api.findByAppId({
        appId: this.$route.query.appId
      }).then(res => {
        if(res.success){
          this.data = res.data

          if(!res.data){
            this.isGoPay = true
          } 
        }else{
          this.$message.error(res.message)
        }
      })
    },
    goBack(){
      this.$router.back()
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/varibles';

.pay-setting
  width 100%
  .topbar
    div
      flex()
      color $color-text-l
      i
        display inline-block
        margin-right .04rem
    h3
      font-size 20px
      cursor pointer
  .set-pay
    width 100%
    min-height 5rem
    background-color #ffffff
    padding .2rem
    box-sizing border-box
    .already-set
      display flex
      flex-flow row nowrap
      align-items center
      justify-content space-between
      line-height .23rem
      background #fafafa  
      padding .2rem
      margin-bottom .2rem
      h3
        font-size 18px
        margin-bottom .1rem
        span 
          font-size 14px
          &.yes
            color $color-theme
          &.no
            color #4a4a4a
</style>
