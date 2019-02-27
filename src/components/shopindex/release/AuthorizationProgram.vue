<template>
  <div class="authorization-program">
    <div class="auth-info">
      <div>
        <p>小程序主体</p>
        <span>{{authData.principalName}}</span>
      </div>
      <div>
        <p>APPID</p>
        <span>{{authData.appid}}</span>
        <p class="remind">账号信息更新时，可<span class="light" @click="authVisible = true">重新授权</span></p>
        <button class="light unbind" @click="unbindVisible = true">解绑小程序</button>
      </div>
      <div>
        <p>小程序名称</p>
        <span>{{authData.nickName}}</span>
        <a class="light code-manage" @click="goCodeManage">代码管理</a>
        <button class="light pay-set" @click="goSetPay">支付设置</button>
      </div>
      <div>
        <p>小程序头像</p>
        <div class="photo" :style="{backgroundImage:`url(${authData.headImg})`}"></div>
      </div>
      <div>
        <p>小程序类型</p>
        <span>{{ authData.verifyTypeInfo  === 0 ? '已认证' : '未认证'}}</span>
      </div>
      <div>
        <p>已授权权限</p>
        <span class="light" @click="handleLook">查看</span>
        <p class="remind">注意：为保证您在学兽平台的各项功能使用正常，请保证您已将所有权限集授权给学兽。</p>
      </div>
    </div>

    <div class="binding-info">
      <h4>已绑定开发平台信息</h4>
      <div>
        <div class="has-bind" v-if="authData.wechatOpenPlatform">
          <p>平台账号：<span v-if="authData.wechatOpenPlatform.openId">{{authData.wechatOpenPlatform.openId}}</span></p>
          <p>主体信息：<span v-if="authData.wechatOpenPlatform.principalName">{{authData.wechatOpenPlatform.principalName}}</span></p>
        </div>
        <div v-else>暂无数据</div>
      </div>
    </div>

    <div class="code-image">
      <img :src="authData.qrcodeUrl" alt="二维码">
    </div>

    <el-dialog
      title="重新授权"
      :visible.sync="authVisible"
      width="220">
      <div class="auth-again">
        <p>1、重新授权时不可换绑其他微信小程序 ，否则重新授权将失败；</p>
        <p>2、为保证您在学兽平台功能的正常使用，授权时请保持默认选择，把开放平台账号管理权限统一授权给学兽。</p>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="major-btn" @click="handleConfirmAuth">确 定</el-button>
        <el-button class="less-btn btn-b" @click="authVisible = false">取 消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="取消绑定"
      :visible.sync="unbindVisible"
      width="480">
      <div class="unset-bind">
        <i class="iconfont icon-tanhao-"></i>
        <p>绑定开放平台，多个应用之间可以共享用户，不建议进行解绑操作。解绑后所有用户均无法登录小程序或小程序，请您谨慎操作。</p>
        <div class="bind-form">
          <p v-if="authData.wechatOpenPlatform">平台账号：<span v-if="authData.wechatOpenPlatform.openId">{{authData.wechatOpenPlatform.openId}}</span></p>
          <p v-else>平台账号：<span>无</span></p>
          <div class="phone-code">
            <p>管理员手机号：{{phone}}</p>
            <el-input style="width: 200px" v-model.number="codeValue" placeholder="请输入验证码"></el-input>
            <span v-if="!isGetCode" class="light" @click="handleCode">获取验证码</span>
            <span v-else class="light">{{sec}}</span>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button class="major-btn" @click="unbindVisible = false">暂不取消</el-button>
        <el-button class="less-btn btn-b" @click="handleCancelAuth">确认取消</el-button>
      </span>
    </el-dialog>

    <el-dialog
      title="权限授权列表"
      :visible.sync="lookVisible">
      <div class="look-auth">
        <ul>
          <li v-for="item of authList" :key="item[0]"><i class="iconfont icon-gou-" v-if="item[1].auth"></i>{{item[1].name}}</li>
        </ul>
      </div>
    </el-dialog>

    <PollingMask v-if="isAuthLoading" @ok="handleOk" @close="handleClose" />
  </div>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from "vuex";
import authList from "./authList";
import PollingMask from "./PollingMask";

export default {
  name: "AuthorizationProgram",
  data() {
    return {
      authVisible: false,
      unbindVisible: false,
      lookVisible: false,
      isAuthLoading: false,
      isGetCode: false, //是否获取验证码
      sec: 60, // 倒计时
      codeValue: "",
      authList: []
    };
  },
  props: {
    authData: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(["phone", "storeId"])
  },
  components: {
    PollingMask
  },
  created(){
    this.handleFilter(this.authData)
  },
  watch: {
    authData(newVal, oldVal){
      this.handleFilter(newVal)
    }
  },
  destroyed(){
    if(this.timer){
      clearInterval(this.timer)
    }
  },
  methods: {
    //  筛选权限
    handleFilter(val){
      if(!val) return false
      const mp =  authList

      val.funcIds.forEach(item => {
        item = typeof item === 'string' ? Number(item) : item

        const isHas = mp.has(item)

        if(isHas) mp.set(item, {...mp.get(item), auth: true})
      });
      this.authList = [...mp].filter(item => {
        return item[1].sp
      })
    },

    // 取消授权短信
    handleCode(){
      if(!this.phone){
        this.$message.warning('未获取手机号,请尝试重新登录！')
        return false
      }
      this.isGetCode = true
      this.handleTimer()

      api.sendVerificationCodeDelAuth({
        phone: this.phone
      }).then(res => {
        if(!res.success){
          this.$message.error(res.message)
        }
      })
    },

    // 取消授权
    handleCancelAuth(){
      if(!this.phone){
        this.$message.warning('未获取手机号,请尝试重新登录！')
        return false
      }

      if(this.codeValue === ''){
        this.$message.warning('请输入验证码！')
        return false
      }

      api.unbundAuthorizerInfo({
        appId: this.authData.appid,
        phone: this.phone,
        code: this.codeValue
      }).then(res => {
        if(res.success){
          this.$message.success('解绑公众号成功！')
          this.unbindVisible = false
          this.$emit('refresh')
        }else{
          this.$message.error(res.message)
        }
      })
    },

    // 确认授权
    handleConfirmAuth(){
      this.authVisible = false
      this.isAuthLoading = true
      window.open(`/backend/wechat/componentloginpagenew?storeId=${this.storeId}&authorizeType=2`, '_target')
    },

    // 查看权限
    handleLook(){
      this.lookVisible = true
    },

    // 计时器
    handleTimer(){
      this.timer = null
      this.timer = setInterval(() => {
        this.sec--
        if(this.sec === 0){
          clearInterval(this.timer)
          this.sec = 60
          this.isGetCode = false
        }
      }, 1000);
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
    },

    onCopy(e) {
      this.$message.success('复制成功！')
    },

    onError(e) {
      this.$message.error('复制失败！')
    },
    
    goSetPay(){
      this.$router.push({
        path: 'authsmallprogrampay',
        query: {
          appId: this.authData.appid
        }
      })
    },

    goCodeManage(){
      this.$router.push({
        name: 'AuthSmallProgramCode'
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/varibles';

.authorization-program
  position relative
  padding .2rem
  color #4a4a4a
  >>>.el-dialog
    .auth-again
      p
        line-height .3rem
    .unset-bind
      display flex
      flex-direction column
      align-items center
      justify-content center
      width 100%
      padding 0 .6rem
      box-sizing border-box
      i 
        font-size 80px
        color #FE8060
      >p
        margin-top .2rem
        line-height .22rem
      .bind-form
        width 100%
        display flex
        flex-direction column
        margin-top .3rem
        color #9b9b9b
        >div
          display flex
          flex-flow row nowrap
          align-items center
          justify-content space-between
          margin-top .1rem
  .light
    color $color-theme
    cursor pointer
  .auth-info
    >div
      display flex
      flex-flow row nowrap
      align-items center
      margin-bottom .4rem
      >p
        &:first-child
          width .8rem
          margin-right .2rem
          color #9b9b9b
      >span
        margin-right .2rem
      .remind
        color #9b9b9b
        margin-left .2rem
      .pay-set,.code-manage,.unbind
        width .82rem
        height .36rem
        line-height .36rem
        background-color transparent
        border 1px solid $color-theme
        border-radius 4px
        margin-right .1rem
        text-align center
      .unbind
        margin-left .2rem
      .photo
        width .45rem
        height .45rem
        border-radius 50%
        background-position center
        background-size cover
        background-repeat no-repeat
  .binding-info
    margin-top 1rem
    color #9b9b9b
    >div
      max-width 7rem
      margin-top .15rem
      border 1px solid #e0e0e0
      padding .2rem .3rem
      box-sizing border-box
      line-height .25rem
      .no-bind
        display flex
        flex-direction column
        align-items center
        justify-content center
        color #ff0000
        >div
          display inline-block
          text-align left 
        span 
          margin-top .15rem
      .has-bind
        color #4a4a4a
        span 
          margin-left .4rem
  .code-image
    width 2rem
    height 2rem
    position absolute
    top .1rem
    right .4rem
    border 1px solid #f2f2f2
    img
      width 100%
      height 100%
  .look-auth
    width 100% 
    ul
      width 100%
      display flex
      flex-flow row wrap
      justify-content space-between
    li
      position relative
      width 50%
      margin-bottom .1rem
      color #666666
      padding-left .22rem
      box-sizing border-box
    i
      position absolute
      left 0
      top 0
      color $color-theme
</style>
