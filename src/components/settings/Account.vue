<template>
    <div class="account">
        <div class="account-left">
            <h2 class="name">账户设置</h2>
            <div class="content">
                <div class="bind-phone">
                    <span class="left">绑定手机号</span>
                    <div class="right">
                        <h3>手机号码</h3>
                        <input class="right-phonenum" type="text" placeholder="请输入手机号码" v-model="phone" readonly="readonly">
                        <h3>验证码</h3>
                        <div class="right-code">
                            <input type="text" placeholder="请输入验证码" v-model.lazy="securityCode" @change="checkCode">
                            <button @click="getCode" v-if="codeTime == 0 || codeTime == 60">获取验证码</button>
                            <button v-else class="get-code" @click="getChangePwdCodeTips">{{codeTime}}s后重新获取</button>
                        </div>
                    </div>
                </div>
                <div class="pwd-manage">
                    <span class="left">密码管理</span>
                    <div class="right">
                        <h3>* 原密码</h3>
                        <input class="right-phonenum" type="password" placeholder="请输入登录密码" v-model.lazy="oldPassword" @change="checkOldPwd">
                        <h3>* 新密码</h3>
                        <input class="right-phonenum" type="password" placeholder="请输入新的登录密码(字母或下划线开头，必须包含字母和数字，不少于8位数！)" v-model.lazy="newPassword" @change="checkNewPwd">
                        <h3>* 重复新密码</h3>
                        <input class="right-phonenum" type="password" placeholder="请重复新的登录密码" v-model.lazy="newPasswordSecond" @change="checkNewPwdSecond">
                    </div>
                </div>
                <div class="account-manage">
                    <span class="left">账号管理</span>
                    <div class="right">
                        <div class="right-item">
                            <h3>* 账号设置</h3>
                            <input class="right-phonenum" type="text" placeholder="此处代入设置的账户名，可修改" v-model.lazy="username" @change="checkUsername">
                        </div>
                        <div class="right-item">
                            <h3>联系人</h3>
                            <input class="right-phonenum" type="text" placeholder="自动带出，不可修改" v-model="contact" readonly="readonly">
                        </div>
                        <div class="right-item">
                            <h3>* 用户昵称</h3>
                            <input class="right-phonenum" type="text" placeholder="" v-model="nickName">
                        </div>
                        <div class="right-item">
                            <h3>所在地区</h3>
                            <input class="right-phonenum" type="text" placeholder="自动带出，不可修改" readonly="readonly" v-model="provinceCity">
                        </div>
                        <div class="right-item right-item-end">
                            <h3>详细地址</h3>
                            <input class="right-phonenum" type="text" placeholder="有则带出，可编辑" v-model="address">
                        </div>
                    </div>
                </div>
                <button class="goto-account" @click="next">下一步：店铺激活</button>
            </div>
        </div>
        <!-- <div class="account-right">
            <span>绑定手机号</span>
            <div class="QRCode">
                <img src="" alt="">
                <button>刷新</button>
            </div>
        </div> -->
        <el-dialog
            :visible.sync="dialogVisible"
            :show-close="false"
            class="el-account-dialog"
            top="1.5rem"
            width="4.52rem"
            :center="true">
            <span class="head"><i class="iconfont">&#xe619;</i></span>
            <h2>现在就激活店铺?</h2>
            <h3>激活店铺可以使用店铺完整版功能</h3>
            <span slot="footer" class="dialog-footer">
                <el-button class="cancel" @click="activeShopWait">再等等</el-button>
                <el-button class="active-shop" type="primary" @click="activeShop">激活</el-button>
            </span>
        </el-dialog>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import api from 'fetch/api'
import {mapMutations} from 'vuex'
export default {
  name: 'Account',
  data () {
    return {
      dialogVisible: false, // 控制激活弹窗显示隐藏
      phone: '', // 手机号
      securityCode: '', // 验证码
      codeTime: 60, // 获取验证码倒计时1分钟
      oldPassword: '', // 原密码
      passwordFlag: false, // 原密码输入正确与否
      newPassword: '', // 用户设置的新密码
      newPasswordSecond: '', // 用户再次确认新密码
      confirmPwdFlag: false, // 确认两次新密码输入是否一致
      username: '', // 账号名称
      contact: '', // 联系人
      nickName: '', // 昵称
      provinceCity: '', // 省市
      address: '', // 详细地址
      phoneFlag: false, // 手机号绑定成功与否
      userId: '', // 用户id
      token: '' // 用户token
    }
  },
  created () {
    this.token = Cookies.get('token')
    this.getBaseInfo()
  },
  methods: {
    getChangePwdCodeTips () {
      this.$message.error(`请等待${this.codeTime}s后再重新获取验证码！`)
    },
    next () {
      this.saveUserInfo()
    },
    ...mapMutations({
      'setIsActive': 'SET_ISACTIVE'
    }),
    checkNewPwd () {
      let that = this
      let reg = /^[A-Za-z_][A-Za-z0-9_,.-]{7,20}$/
      if (!that.newPassword) {
        that.$message.error('请输入新密码!')
      } else if (!reg.test(that.newPassword)) {
        that.$message.error('新密码格式不正确!')
        that.newPassword = ''
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
          that.confirmPwdFlag = true
        }
      }
    },
    checkUsername () {
      let that = this
      api.checkUsername({
        username: that.username
      }).then(res => {
        if (res.success) {
          that.$message.success('账号名可使用。')
        } else {
          that.$message.error('此账号名被占用！')
        }
      })
    },
    checkOldPwd () {
      let that = this
      if (!that.oldPassword) {
        that.$message.error('请输入原密码!')
      } else {
        api.getPwd({
          password: that.oldPassword
        }).then(res => {
          if (res.success) {
            that.passwordFlag = true
          } else {
            that.$message.error('原密码输入不正确！')
          }
        })
      }
    },
    getBaseInfo () {
      let that = this
      api.getBaseInfo().then(res => {
        if (res.success) {
          that.userId = res.data.userId
          that.getUserInfo()
        } else {
          if (res.code === 403) {
            that.$router.push({name: 'Login'})
          } else {
            that.$message.error('服务器异常！')
          }
        }
      })
    },
    setUserInfo() {
      let that = this
      api.getBaseInfo().then(res => {
        that.setIsActive(res.data.storeStatus)
        let userInfo = {
          'userId': res.data.userId,
          'roleId': res.data.roleId,
          'imageHead': 'http://' + res.data.bucketDomain + '/',
          'isActive': res.data.storeStatus,
          'storeId': res.data.storeId
        }
        Cookies.set('vdongUserInfo', userInfo, {expires: 1})
      })
    },
    getUserInfo () {
      let that = this
      api.getUserInfo({
        userId: that.userId
      }).then(res => {
        if (res.success) {
          let data = res.data

          that.phone = data.phone
          that.username = data.username
          that.contact = data.userInfo.contact
          that.nickName = data.nickName
          that.provinceCity = data.userInfo.province + data.userInfo.city + data.userInfo.district
          that.address = data.userInfo.address
        }
      })
    },
    activeShop () {
      let that = this
      api.activeShop().then(res => {
        if (res.success) {
          that.dialogVisible = false
          that.setUserInfo()
          that.$router.push('/index/shopview')
        } else {
          that.$message.error('店铺激活失败！请重新激活')
        }
      })
    },
    activeShopWait () {
      this.dialogVisible = false
      this.setUserInfo()
      this.$router.push('/index/shopinfo')
    },
    saveUserInfo () {
      let that = this
      if (that.newPassword && that.newPasswordSecond && that.nickName && that.address) {
        if (that.confirmPwdFlag) {
          if (that.phoneFlag) {
            if (that.passwordFlag) {
              api.saveUserInfo({
                password: that.newPassword,
                username: that.username,
                nickName: that.nickName,
                userInfo: {
                  address: that.address
                }
              }).then(res => {
                if (res.success) {
                  that.dialogVisible = true
                } else {
                  that.$message.error('服务器异常！')
                }
              })
            } else {
              if (that.oldPassword) {
                that.$message.error('原密码输入不正确！')
              } else {
                that.$message.error('请输入原密码！')
              }
            }
          } else {
            that.$message.error('请输入手机验证码！')
          }
        } else {
          that.$message.error('新密码两次输入不一致！')
        }
      } else {
        that.$message.error('信息填写不完整！')
      }
    },
    checkCode () {
      let that = this
      let reg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/
      if (!that.phone) {
        that.$message.error('请输入手机号码!')
      } else if (!reg.test(that.phone)) {
        that.$message.error('手机号码格式不正确!')
      } else {
        api.checkChangePwdCode({
          phone: that.phone,
          code: that.securityCode,
          type: 'bind'
        }).then(res => {
          if (res.success) {
            that.$message.success('手机号码绑定成功。')
            that.phoneFlag = true
          } else {
            that.$message.error('验证码不正确！')
          }
        })
      }
    },
    getCode() {
      let that = this
      let reg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/
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
        api.getCode({
          phone: that.phone
        }).then(res => {
          if (res.success) {
          } else {
            that.$message.error('获取验证码失败！')
          }
        }).catch(() => {})
      }
    }
  }
}
</script>

<style scoped lang="stylus">
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
.account
  min-height 9.6rem
  display flex
  justify-content center
  align-items center
  width 100%
.account-left
  width 100%
  border-radius $radius
  background #fff
  .name
    height .66rem
    width 97%
    margin 0 1.5% 0 1.5%
    border-bottom $color-border-1
    line-height .66rem
    font-size $font-size-medium-x
    color $color-text-d
  .content
    columnFlex()
    .bind-phone,.pwd-manage,.account-manage
      width 6.8rem
      margin-top .4rem
      display flex
      justify-content space-between
      align-items flex-start
      margin-bottom .8rem
      .left
        font-size $font-size-small
        color $color-text-l
        height .22rem
        line-height .22rem
        margin-right 1rem
      .right
        columnFlex()
        h3
          height .22rem
          color rgba(0,0,0,0.85)
          font-size .14rem
          line-height .22rem
          width 5.2rem
          margin-bottom .15rem
        .right-phonenum
          width 5.2rem
          border-radius $radius-s
          box-sizing border-box
          line-height .32rem
          height .32rem
          border .01rem solid rgba(0,0,0,0.15)
          padding-left .16rem
          font-size $font-size-medium
          color $color-text-d
          margin-bottom .15rem
          placeholderStyle()
        .right-code
          width 5.2rem
          flex()
          height .32rem
          input
            width 3.9rem
            margin-right .1rem
            border-radius $radius-s
            box-sizing border-box
            line-height .32rem
            height .32rem
            border .01rem solid rgba(0,0,0,0.15)
            padding-left .16rem
            font-size $font-size-medium
            color $color-text-d
            placeholderStyle()
          button
            cursor pointer
            width 1.2rem
            fontCenter(.32rem)
            font-size .14rem
            background $color-theme
            color #fff
            border-radius $radius
          .get-code
            background #C7C7C7
    .pwd-manage
      margin-top 0
    .account-manage
      margin-top 0
      .right
        width 5.2rem
        display block
        .right-item
          width 2.4rem
          float left
          &:nth-child(even)
            margin-left .4rem
          h3
            height .22rem
            color rgba(0,0,0,0.85)
            font-size .14rem
            line-height .22rem
            width 2.4rem
            margin-bottom .15rem
          .right-phonenum
            width 2.4rem
            border-radius $radius-s
            box-sizing border-box
            line-height .32rem
            height .32rem
            border .01rem solid rgba(0,0,0,0.15)
            padding-left .16rem
            font-size $font-size-medium
            color $color-text-d
            margin-bottom .15rem
            placeholderStyle()
        .right-item-end
          width 5.2rem
          h3
            width 100%
          .right-phonenum
            width 100%
    .goto-account
      cursor pointer
      display block
      border-radius $radius-s
      width 1.28rem
      background $color-theme
      color #fff
      fontCenter(.28rem)
      font-size $font-size-small
      margin-bottom .37rem
.account-right
  background #fff
  width 19.5%
  height 0
  padding-bottom 19.5%
  border-radius $radius
  columnFlex()
  span
    display block
    width 100%
    padding-top .17rem
    padding-left .2rem
    font-size .12rem
    height .17rem
    line-height .17rem
    color #9B9B9B
  .QRCode
    width 100%
    margin-top 13.8%
    text-align center
    img
      display inline-block
      width 50%
      margin 0 25% 7%
      height 0
      padding-bottom 50%
      background #ccc
    button
      cursor pointer
      width .6rem
      fontCenter(.28rem)
      font-size .12rem
      color #fff
      background $color-theme
      border-radius $radius-s
</style>
