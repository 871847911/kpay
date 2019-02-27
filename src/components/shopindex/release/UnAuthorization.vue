<template>
  <div class="unauthorization">
    <div class="public-number" v-if="unType === 'public'">
      <div class="steps">
        <el-steps :active="3" align-center>
          <el-step title="绑定公众号" description="绑定已认证的服务号，授权给我们第三方平台"></el-step>
          <el-step title="绑定开放平台" description="绑定开放平台，多个应用之间可以共享用户"></el-step>
          <el-step title="发布公众号H5" description="绑定公众号后，为您生成专属店铺链接和二维码"></el-step>
        </el-steps>
      </div>

      <div class="go-bind">
        <p>将公众号绑定店铺，即可在学兽后台管理公众号，还能使用更多更强大的功能</p>
        <el-button class="major-btn bind-btn" @click="handleBind(1)">立即绑定</el-button>
        <p>还没有公众号? <a href="https://mp.weixin.qq.com/" target="black">立即申请</a></p>
      </div>

      <div class="explain">
        <div class="info">
          <h4>授权说明</h4>
          <p>1、公众号仅支持一种绑定类型：认证服务号，非认证的订阅/服务号无法绑定;</p>
          <p>2、一个微信公众号仅可绑定一个学兽商户；绑定之后支持解除绑定;</p>
          <p>3、为保证所有功能的正常使用，授权时请保持默认选择，把权限统一授权给学兽;</p>
        </div>
        <a href="https://shimo.im/docs/L725hL98zrMoQFv9" target="black">查看绑定教程</a>
      </div>
    </div>

    <div class="program" v-else>
      <div class="steps">
        <el-steps :active="3" align-center>
          <el-step title="绑定小程序" description="绑定已认证的小程序，授权给我们第三方平台"></el-step>
          <el-step title="绑定开放平台" description="绑定公众号之后，系统将自动为您的店铺创建开放平台账号，多个应用之间可以共享用户"></el-step>
          <el-step title="发布小程序" description="绑定小程序后，就可以去发布小程序了"></el-step>
        </el-steps>
      </div>

      <div class="go-bind">
        <p>将小程序绑定店铺，即可在学兽后台管理公众号，还能使用更多更强大的功能</p>
        <el-button class="major-btn bind-btn" @click="handleBind(2)">立即绑定</el-button>
        <p>还没有小程序? <a href="https://mp.weixin.qq.com/" target="black">立即申请</a></p>
      </div>

      <div class="explain">
        <div class="info">
          <h4>授权说明</h4>
          <p>1、小程序仅支持一种绑定类型：认证企业号，非认证的个人/企业号无法绑定；</p>
          <p>2、一个微信公众号仅可绑定一个学兽商户；绑定之后支持解除绑定;</p>
          <p>3、为保证所有功能的正常使用，授权时请保持默认选择，把权限统一授权给学兽;</p>
        </div>
        <a href="https://shimo.im/docs/L725hL98zrMoQFv9" target="black">查看绑定教程</a>
      </div>
    </div>

    <el-dialog
      title="授权提示"
      :visible.sync="dialogVisible"
      width="480">
      <div class="fail-info">
        <i class="iconfont icon-tanhao-"></i>
        <h2>绑定失败</h2>
        <p>原因1：权限不足，请保证您已将所有权限集授权给学兽</p>
        <p>原因2：账号类型不匹配，请确认您的账号是已认证通过的服务号</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="major-btn" @click="dialogVisible = false">重新授权</el-button>
        <el-button class="less-btn btn-b" @click="dialogVisible = false">取消</el-button>
      </span>
    </el-dialog>

    <PollingMask v-if="isAuthLoading" @ok="handleOk" @close="handleClose" />
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import PollingMask from "./PollingMask";

export default {
  name: "UnAuthorization",
  data() {
    return {
      dialogVisible: false,
      isAuthLoading: false
    };
  },
  props:{
    unType: { // 公众号-public 小程序-program
      type: String 
    }
  },
  components: {
    PollingMask
  },
  computed: {
    ...mapGetters([
      'storeId'
    ])
  },
  methods: {
    handleBind(type){
      this.isAuthLoading= true
      window.open(`/backend/wechat/componentloginpagenew?storeId=${this.storeId}&authorizeType=${type}`, '_target')
    },

    // 成功授权
    handleOk(){
      this.isAuthLoading = false
      this.$emit('refresh', true)
    },

    // 关闭
    handleClose(){
      this.isAuthLoading = false
      this.$emit('refresh')
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/varibles';

.unauthorization
  display flex
  flex-direction column
  align-items center
  justify-content center
  color #4a4a4a
  padding-bottom .6rem
  font-size 14px
  >>>.el-dialog
    .fail-info
      display flex
      flex-direction column
      align-items center
      justify-content center
      width 100%
      i 
        font-size 80px
        color #ff0000
      h2
        font-size 20px
        margin .1rem 0 .4rem 0
      p
        line-height .3rem
  .public-number, .program
    >div
      width 100%
    .steps
      margin .4rem 0 .8rem 0
      >>>.el-step__title.is-process,
      >>>.el-step__head.is-process
        color #666666
      >>>.el-step__description.is-finish,
      >>>.el-step__description.is-process
        color #9b9b9b
    .go-bind
      display flex
      flex-direction column  
      align-items center
      justify-content center
      margin-bottom .8rem
      .bind-btn
        padding 0 .3rem
        margin .4rem 0
      a 
        color $color-theme
        cursor pointer
        text-decoration none
    .explain
      width 8rem
      padding .2rem
      background-color #fafafa
      line-height .3rem
      box-sizing border-box
      display flex
      flex-direction column
      align-items center
      justify-content center
      .info
        margin-bottom .3rem
        h4
          text-align center
      a 
        color $color-theme
        cursor pointer
        text-decoration none
</style>
