<template>
    <div class="login-box">
        <!-- <div class="dialog-QRCode" v-if="loginWay == 1">
            <h2 class="top">快速登录</h2>
            <div class="middle">
                <img v-lazy="" alt="" >
                <h3>请使用微信扫描二维码登录</h3>
            </div>
            <div class="bottom">
                <span @click="accountLogin">账号登录</span>
                <span @click="phoneNumberLogin">验证码登录</span>
            </div>
        </div> -->
        <img class="login-box-logo" src="../../assets/image/logo.png" alt="logo">

        <div class="dialog-account" v-if="loginWay == 2">
            <h2 class="top">账户登录</h2>
            <input class="username" type="text" placeholder="账号/手机号" key="account" v-model="username">
            <input class="password" type="password" placeholder="请输入密码" key="account-pwd" v-model="password" @keyup.enter="login">
            <span class="forget-password" @click="changePwd">忘记密码？</span>
            <span class="confirm-login" @click="login">确认登录</span>
            <div class="bottom">
                <span @click="accountLogin">账户登录</span>
                <span @click="phoneNumberLogin">验证码登录</span>
            </div>
        </div>

        <div class="dialog-phoneNumber" v-if="loginWay == 3">
            <h2 class="top">验证码登录</h2>
            <input class="phone" type="tel" placeholder="请输入手机号" key="phone" v-model="phone">
            <div class="code">
                <input type="text" placeholder="请输入验证码" key="phone-pwd" v-model="phonePwd" @keyup.enter="codeLogin">
                <button @click="sendLoginCode" v-if="codeTime == 0 || codeTime == 60">获取验证码</button>
                <button v-else class="get-code" @click="getLoginCodeTips">{{codeTime}}s后重新获取</button>
            </div>
            <button class="confirm-login" @click="codeLogin">确认登录</button>
            <div class="bottom">
                <span @click="accountLogin">账户登录</span>
                <span @click="phoneNumberLogin">验证码登录</span>
            </div>
        </div>

        <div class="change-password" v-if="loginWay == 0">
            <h2 class="top">修改密码</h2>
            <input class="phone" type="tel" placeholder="请输入手机号" key="phone-change" v-model="changePwdPhone">
            <div class="code">
                <input type="text" placeholder="请输入验证码" key="phone-change-pwd" v-model.lazy="securityCode" @change="checkCode">
                <button @click="sendChangePwdCode" v-if="changePwdCodeTime == 0 || changePwdCodeTime == 60">获取验证码</button>
                <button v-else class="get-code" @click="getChangePwdCodeTips">{{changePwdCodeTime}}s后重新获取</button>
            </div>
            <input class="password" type="password" placeholder="新密码" key="phone-change-pwd-1" v-model.lazy="newPassword" @change="checkNewPwd">
            <input class="password" type="password" placeholder="密码确认" key="phone-change-pwd-2" v-model.lazy="newPasswordSecond" @change="checkNewPwdSecond">
            <div class="bottom">
                <button class="cancel" @click="loginWay = 2">取消</button>
                <button class="confirm" @click="confirmChangePwd">确认修改</button>
            </div>
        </div>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import api from 'fetch/api'
import {mapMutations} from 'vuex'
import store from '../../store'

export default {
  name: 'QRCodeLogin',
  data () {
    return {
      loginWay: 2,
      username: '',
      password: '',
      token: '',
      storeId: '',

      // 验证码登录
      phone: '', // 手机号
      phonePwd: '', // 验证码
      codeTime: 60, // 获取验证码倒计时1分钟

      // 修改密码
      changePwdCodeFlag: false, // 修改密码验证码校验
      securityCode: '', // 验证码
      changePwdPhone: '', // 修改密码的时候填的手机号
      changePwdCodeTime: 60, // 修改密码时获取验证码倒计时1分钟
      newPassword: '', // 用户设置的新密码
      newPasswordSecond: '', // 用户再次确认新密码
      newPasswordFlag: false // 两次密码是否一致
    }
  },
  created () {
    this.storeId = this.$route.query.storeId
  },
  methods: {
    ...mapMutations({
      'setRealName':'SET_NAME',
      'setUserId': 'SET_USERID',
      'setRoleId': 'SET_ROLEID',
      'setIsActive': 'SET_ISACTIVE',
      'setImageHead': 'SET_IMAGEHEAD',
      'setUploadImageHead': 'SET_UPLOADIMAGEHEAD',
      'setToken': 'SET_TOKEN',
      'setStoreId': 'SET_STOREID'
    }),
    getLoginCodeTips () {
      this.$message.error(`请等待${this.codeTime}s后再重新获取验证码！`)
    },
    getChangePwdCodeTips () {
      this.$message.error(`请等待${this.changePwdCodeTime}s后再重新获取验证码！`)
    },
    confirmChangePwd () {
      let that = this
      if (that.changePwdCodeFlag) {
        if (that.newPassword) {
          if (that.newPasswordSecond) {
            if (that.newPasswordFlag) {
              api.changePwd({
                password: that.newPassword,
                storeId: that.storeId,
                phone: that.changePwdPhone
              }).then(res => {
                if (res.success) {
                  that.$message.success('密码修改成功。')
                  that.loginWay = 2
                } else {
                  that.$message.error('服务器异常！')
                }
              })
            } else {
              that.$message.error('新密码输入不一致！')
            }
          } else {
            that.$message.error('请再次输入新密码！')
          }
        } else {
          that.$message.error('请输入新密码！')
        }
      } else {
        that.$message.error('手机未验证通过！')
      }
    },
    login() {
      let that = this
      if (that.username) {
        if (that.password) {
          api.login({
            loginWay: 10,
            username: that.username,
            password: that.password,
            userType: 20,
            storeId: that.storeId
          }).then(res => {
            Cookies.remove('token')
            Cookies.remove('vdongUserInfo')
            if (res.success) {
              that.token = res.data
              that.setToken(res.data)
              Cookies.set('token', res.data, {expires: 1})
              that.getBaseInfo()
            } else {
              that.$message.error(res.message)
            }
          })
        } else {
          that.$message.error('请输入密码！')
        }
      } else {
        that.$message.error('请输入账号或手机号！')
      }
    },
    codeLogin () {
      let that = this
      if (that.phone) {
        if (that.phonePwd) {
          api.login({
            loginWay: 20,
            username: that.phone,
            verifyCode: that.phonePwd,
            userType: 20,
            storeId: that.storeId
          }).then(res => {
            if (res.success) {
              that.token = res.data
              that.setToken(res.data)
              Cookies.set('token', res.data, {expires: 1})
              that.getBaseInfo()
            } else {
              that.$message.error(res.message)
            }
          })
        } else {
          that.$message.error('请输入验证码！')
        }
      } else {
        that.$message.error('请输入手机号！')
      }
    },
    checkCode () {
      let that = this;
      let reg =/^((1[3,5,6,8,9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/
      if (!that.changePwdPhone) {
        that.$message.error('请输入手机号码!')
      } else if (!reg.test(that.changePwdPhone)) {
        that.$message.error('手机号码格式不正确!')
      } else {
        api.checkChangePwdCode({
          phone: that.changePwdPhone,
          code: that.securityCode,
          type: 'pwd'
        }).then(res => {
          if (res.success) {
            that.$message.success('手机号码验证通过。')
            that.changePwdCodeFlag = true
          } else {
            that.$message.error(res.data.message)
          }
        })
      }
    },
    checkNewPwd () {
      let that = this
      let reg = /^[A-Za-z_][A-Za-z0-9_,.-]{7,20}$/
      if (!that.newPassword) {
        that.$message.error('请输入新密码!')
      } else if (!reg.test(that.newPassword)) {
        that.$message.error('新密码格式:字母或下划线开头，必须包含字母和数字!')
      }
    },
    checkNewPwdSecond () {
      let that = this
      if (!that.newPasswordSecond) {
        that.$message.error('请再次输入新密码!')
      } else {
        if (that.newPassword !== that.newPasswordSecond) {
          that.$message.error('两次新密码输入不一致!')
        } else {
          that.newPasswordFlag = true
        }
      }
    },
    sendLoginCode () {
      let that = this
      let reg = /^((1[3,5,6,8,9][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/
      if (!that.phone) {
        that.$message.error('请输入手机号码!')
      } else if (!reg.test(that.phone)) {
        that.$message.error('手机号码格式不正确!')
      } else {
        let time = setInterval(() => {
          that.codeTime--
          if (that.codeTime <= 0) {
            that.codeTime = 60
            clearInterval(time)
          }
        }, 1000)
        api.sendLoginCode({
          phone: that.phone
        }).then(res => {
          if (res.success) {
            //
          } else {
            that.$message.error(res.data.message)
          }
        })
      }
    },
    sendChangePwdCode () {
      let that = this
      let reg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/
      if (!that.changePwdPhone) {
        that.$message.error('请输入手机号码!')
      } else if (!reg.test(that.changePwdPhone)) {
        that.$message.error('手机号码格式不正确!')
      } else {
        let time = setInterval(() => {
          that.changePwdCodeTime--
          if (that.changePwdCodeTime <= 0) {
            that.changePwdCodeTime = 60
            clearInterval(time)
          }
        }, 1000)
        api.getChangePwdCode({
          phone: that.changePwdPhone
        }).then(res => {
          if (res.success) {
            //
          } else {
            that.$message.error('获取验证码失败！')
          }
        })
      }
    },
    getBaseInfo () {
      let that = this
      api.getBaseInfo().then(res => {
        if (res.success) {
          that.setUserId(res.data.userId)
          that.setRoleId(res.data.roleId)
          that.setIsActive(res.data.storeStatus)
          that.setImageHead('http://' + res.data.bucketDomain + '/')
          that.setUploadImageHead('http://' + res.data.tempDomain + '/')
          that.setStoreId(res.data.storeId)
          that.setRealName(res.data.realName)
          that.setRealName(res.data.phone)

          let userInfo = {
            'userId': res.data.userId,
            'roleId': res.data.roleId,
            'imageHead': 'http://' + res.data.bucketDomain + '/',
            'uploadImageHead': 'http://' + res.data.tempDomain + '/',
            'isActive': res.data.storeStatus,
            'realName':res.data.realName,
            'storeId': res.data.storeId,
            'phone':res.data.phone,
          }
          Cookies.set('vdongUserInfo', userInfo, {expires: 1})
          let status = res.data.storeStatus
          if (status === 1) {
            that.$router.push({name: 'Basic'})
          } else if (status === 2) {
            that.$router.push({name: 'Account'})
          } else if (status === 3) {
            that.$router.push({name: 'ShopInfo'})
          } else {
            if (res.data.roleId === 2) {
              that.$router.push({name: 'ShopInfo'})
            } else {
              that.$router.push({name: 'ShopView'})
            }
          }
        }
      })
    },
    accountLogin () {
      this.loginWay = 2
    },
    phoneNumberLogin () {
      this.loginWay = 3
    },
    changePwd () {
      this.loginWay = 0
    }
  }
}
</script>

<style lang="stylus" scoped rel="stylesheet/stylus">
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.login-box
  background-color #ffffff
  border-radius 5px
  .login-box-logo
    width .8rem
    height auto
    margin .25rem 0 0 .25rem
.dialog-QRCode
  border-radius $radius
  background $color-dialog-background
  height 4.25rem
  width 100%
  columnFlex()
  .top
    font-size $font-size-large
    color $color-text-d
    font-weight $font-weight
    margin .22rem 0 .4rem
    fontCenter(.28rem)
  .middle
    height 2.76rem
    columnFlex()
    overflow hidden
    img
      display block
      height 2.24rem
      width 2.24rem
      background #aaa
    h3
      fontCenter(.2rem)
      font-size $font-size-medium
      color $color-text-l
      margin .1rem 0 .22rem
  .bottom
    height .45rem
    flex()
    span
      cursor pointer
      fontCenter(.2rem)
      color $color-theme
      padding 0 .31rem
      font-size $font-size-medium
      &:first-child
        border-right $color-border-1
.dialog-account
  border-radius $radius
  background $color-dialog-background
  height 4.25rem
  width 100%
  columnFlex()
  .top
    font-size $font-size-large
    fontCenter(.28rem)
    color $color-text-d
    font-weight $font-weight
    margin .22rem 0 .4rem
  .bottom
    height .45rem
    flex()
    span
      cursor pointer
      fontCenter(.2rem)
      color $color-theme
      padding 0 .31rem
      font-size $font-size-medium
      &:first-child
        border-right $color-border-1
  .username,.password
    width 3.2rem
    fontverticalCenter(.44rem)
    border $color-border-1
    border-radius $radius
    color $color-text-d
    padding-left .19rem
    font-size $font-size-medium
    margin-bottom .25rem
    box-sizing border-box
    placeholderStyle()
  .password
    margin-bottom .1rem
  .forget-password
    fontverticalCenter(.2rem)
    cursor pointer
    width 1rem
    margin-right 2.2rem
    font-size $font-size-medium
    color $color-text-l
    margin-bottom .3rem
  .confirm-login
    cursor pointer
    width 3.2rem
    fontCenter(.44rem)
    box-sizing border-box
    border-radius $radius
    background $color-theme
    font-size $font-size-medium
    color $color-text-w
    margin-bottom .59rem
.dialog-phoneNumber,.change-password
  background $color-dialog-background
  border-radius $radius
  height 4.25rem
  width 100%
  columnFlex()
  .top
    font-size $font-size-large
    fontCenter(.28rem)
    color $color-text-d
    font-weight $font-weight
    margin .22rem 0 .4rem
  .phone
    width 3.2rem
    fontverticalCenter(.44rem)
    border $color-border-1
    border-radius $radius
    color $color-text-d
    padding-left .19rem
    font-size $font-size-medium
    margin-bottom .25rem
    box-sizing border-box
    placeholderStyle()
  .code
    width 3.2rem
    height .44rem
    margin-bottom .6rem
    flex()
    input
      width 1.88rem
      fontverticalCenter(.44rem)
      border $color-border-1
      border-radius $radius
      color $color-text-d
      padding-left .19rem
      font-size $font-size-medium
      box-sizing border-box
      margin-right .08rem
      placeholderStyle()
    button
      cursor pointer
      width 1.2rem
      fontCenter(.44rem)
      font-size $font-size-medium
      background $color-theme
      color $color-text-w
      border-radius $radius
    .get-code
      background #C7C7C7
  .confirm-login
    cursor pointer
    width 3.2rem
    box-sizing border-box
    border-radius $radius
    background $color-theme
    font-size $font-size-medium
    color $color-text-w
    margin-bottom .59rem
    fontCenter(.44rem)
  .bottom
    height .45rem
    flex()
    span
      cursor pointer
      fontverticalCenter(.2rem)
      color $color-theme
      padding 0 .31rem
      font-size $font-size-medium
      &:first-child
        border-right $color-border-1
.change-password
  height 4.5rem
  .code
    margin-bottom .25rem
  .password
    width 3.2rem
    fontverticalCenter(.44rem)
    border $color-border-1
    border-radius $radius
    color $color-text-d
    padding-left .19rem
    font-size $font-size-medium
    margin-bottom .25rem
    box-sizing border-box
    placeholderStyle()
  .bottom
    width 3.2rem
    height .44rem
    flex()
    .cancel
      width 1.5rem
      fontCenter(.44rem)
      box-sizing border-box
      border .01rem solid $color-theme
      border-radius $radius
      font-size $font-size-medium
      color $color-theme
      margin-right .2rem
      background $color-dialog-background
      cursor pointer
    .confirm
      cursor pointer
      fontCenter(.44rem)
      width 1.5rem
      border-radius $radius
      font-size $font-size-medium
      color $color-dialog-background
      background $color-theme
</style>
