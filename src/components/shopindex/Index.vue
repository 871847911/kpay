<template>
  <div class="app">
    <div class="head">
      <div class="logo">
        <img src="../../assets/image/logo.png" alt="logo">
      </div>
      <el-row :gutter="20" type="flex" class="head-nav">
        <el-col :span="3" v-for="item of mainRouters" :key="item.id">
          <div
            :class="curNavId === item.id?'cur-nav-active':''"
            @click="goToSubMenu(item)"
          >{{item.title}}</div>
        </el-col>
      </el-row>
      <el-dropdown class="head-dropdown" trigger="click" @command="handleCommand">
        <span class="el-dropdown-link">
          <img v-lazy="userHeadUrl" class="head-img" v-if="userHeadUrl">
          <img
            v-else
            class="head-img"
            src="http://image.vdongchina.com/M00/19/18/ZSUkmVtPBZWEd_tzAAAAAEdnEXc248.png"
          >
          <span class="head-name">{{userName}}</span>
        </span>
        <el-dropdown-menu slot="dropdown" class="head-dropdown-item">
          <el-dropdown-item command="change-userinfo">
            <i class="icon iconfont icon-bianji"></i>修改个人信息
          </el-dropdown-item>
          <el-dropdown-item command="change-phone">
            <i class="icon iconfont icon-shouji-"></i>更换手机
          </el-dropdown-item>
          <el-dropdown-item command="change-pwd">
            <i class="icon iconfont icon-mima-"></i>账号密码设置
          </el-dropdown-item>
          <el-dropdown-item command="logout">
            <i class="icon iconfont icon-tuichu"></i>退出登录
          </el-dropdown-item>
        </el-dropdown-menu>
      </el-dropdown>

      <div class="top-mask"></div>
    </div>
    <div class="index">
      <div class="index-left">
        <div class="person-center">
          <div>
            <img v-lazy="userHeadUrl" v-if="userHeadUrl">
            <img
              v-else
              src="http://image.vdongchina.com/M00/19/18/ZSUkmVtPBZWEd_tzAAAAAEdnEXc248.png"
            >
          </div>
          <p>{{userName}}</p>
        </div>
        <el-menu
          class="el-menu-demo nav-menu"
          mode="vertical"
          background-color="#ffffff"
          text-color="#9B9B9B"
          :default-openeds="defaultOpeneds"
          router
        >
          <el-submenu
            :index="item.id"
            :show-timeout="delay"
            :hide-timeout="delay"
            :class="[$route.fullPath.indexOf(item.tagUrl)!=-1?'el-submenu-active':'']"
            v-for="item of subRouters"
            :key="item.id"
          >
            <template slot="title">
              <i class="iconfont icon-first-group" :class="item.icon"></i>
              <span class="first-title">{{item.title}}</span>
            </template>
            <span v-for="itemChild of item.children" :key="itemChild.id" class="el-link">
              <el-menu-item
                :index="itemChild.id"
                :route="{path: itemChild.path}"
                :class="[$route.fullPath.indexOf(itemChild.path)!=-1?'router-link-active':'']"
                :style="{paddingLeft: '50px'}"
              >{{itemChild.title}}</el-menu-item>
            </span>
          </el-submenu>
        </el-menu>
      </div>
      <div class="index-right">
        <div class="content">
          <router-view @getNickName="getBaseInfo"></router-view>
        </div>
      </div>
      <div class="change-pwd" v-if="changePwdFlag">
        <ul class="pwd-box">
          <li class="item">
            <p class="item-name">原密码</p>
            <input
              type="password"
              class="item-input"
              v-model.lazy="oldPassword"
              @change="checkOldPwd"
            >
          </li>
          <li class="item">
            <p class="item-name">新密码</p>
            <input
              type="password"
              class="item-input"
              v-model.lazy="newPassword"
              @change="checkNewPwd"
            >
          </li>
          <li class="item item-confirm-pwd">
            <p class="item-name">密码确认</p>
            <input
              type="password"
              class="item-input"
              v-model.lazy="newPasswordSecond"
              @change="checkNewPwdSecond"
            >
          </li>
          <li class="item-bottom">
            <button class="cancel" @click="cancelPwdDialog">取消</button>
            <button class="confirm" @click="saveUserInfo">保存</button>
          </li>
        </ul>
      </div>
      <div class="change-phone" v-if="changePhoneFlag">
        <div class="phone-first" v-if="phoneFirstFlag">
          <p class="first-title">为保证您的账号安全，请验证店铺密码</p>
          <p class="first-name">店铺账号</p>
          <p class="first-name-value">{{account}}</p>
          <p class="first-pwd">密码验证</p>
          <input type="password" class="first-pwd-value" v-model="initPwd" key="pwd-verify">
          <div class="item-bottom">
            <button class="cancel" @click="cancelPhoneDialog">取消</button>
            <button class="confirm" @click="changePhoneFirst">下一步</button>
          </div>
        </div>
        <div class="phone-second" v-if="phoneSecondFlag">
          <p class="second-name">新手机号码</p>
          <div class="second-getcode">
            <input type="number" key="new-phone" v-model="newPhone">
            <button
              @click="sendModifyPhoneCode"
              v-if="modifyPhoneCodeTime == 0 || modifyPhoneCodeTime == 60"
            >获取验证码</button>
            <button
              v-else
              class="get-code"
              @click="getModifyPhoneCodeTips"
            >{{modifyPhoneCodeTime}}s后重新获取</button>
          </div>
          <p class="second-name">手机验证码</p>
          <input type="text" class="first-pwd-value" key="new-phone-code" v-model="newPhoneCode">
          <div class="item-bottom">
            <button class="cancel" @click="cancelPhoneDialog">取消</button>
            <button class="confirm" @click="changePhoneSecond">保存</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "fetch/api";
import { mapGetters, mapMutations } from "vuex";
import Cookies from "js-cookie";
import rvAdmin from "../../router/rvAdmin";
import rvCustom from "../../router/rvCustom";
import { dyAdmin, dyCustom } from "../../router/dynamicRoutes";

export default {
  name: "Index",
  data() {
    return {
      mainRouters: [],
      subRouters: null,
      curNavId: "100",
      userHeadUrl: "",
      changePwdFlag: false,
      oldPassword: "", // 原密码
      newPassword: "", // 用户设置的新密码
      newPasswordSecond: "", // 用户再次确认新密码
      passwordFlag: false, // 原密码输入正确与否
      newPasswordFlag: false, // 新密码两次一致
      storeId: "", // 店铺id
      token: "", // 用户token
      changePhoneFlag: false, // 修改手机号时显示隐藏修改界面
      phoneFirstFlag: true, // 默认显示修改手机号第一步操作
      phoneSecondFlag: false, // 修改手机号第二步操作
      account: "", // 店铺账号
      initPwd: "", // 原密码
      modifyPhoneCodeTime: 60, // 修改手机号获取验证码60秒倒计时
      newPhone: "", // 新手机号
      newPhoneCode: "", // 新手机号验证码
      storeStatus: "", // 店铺激活状态
      userName: "", // 登陆成功的用户名
      defaultOpeneds: ["-1"],
      delay: 0
    };
  },
  computed: {
    ...mapGetters(["imageHead", "isFirstCome"])
  },
  watch: {
    $route: function() {
      this.calcSubRoutes();
    }
  },
  created() {
    let cookieToken = Cookies.get("token");
    let cookieUserInfo = Cookies.get("vdongUserInfo");
    this.token = cookieToken;

    if (cookieToken && cookieUserInfo) {
      this.getBaseInfo();
    } else {
      this.$router.push({
        name: "Login",
        query: {
          storeId: this.storeId
        }
      });
    }
  },
  methods: {
    ...mapMutations({
      setIsFirstCome: "SET_ISFIRSTCOMIMG",
      SET_TOKEN : 'SET_TOKEN'
    }),
    // 计算匹配路由对应打开的menu
    calcSubRoutes() {
      const _this = this;
      const _routerPath = _this.$route.fullPath.toLowerCase();
      // 解决跨菜单的跳跃
      for (let i = 0, len = _this.mainRouters.length; i < len; i++) {
        const ele = _this.mainRouters[i].children;

        for (let j = 0; j < ele.length; j++) {
          const eleUrl = ele[j].tagUrl;

          if (_routerPath.indexOf(eleUrl) !== -1) {
            _this.defaultOpeneds = [ele[j].id];
            _this.subRouters = ele;
            _this.curNavId = _this.mainRouters[i].id;
            break;
          }
        }
      }
    },
    // 点击相应的顶部菜单
    goToSubMenu(route) {
      const child = route.children;

      this.defaultOpeneds = ["-1"];
      this.curNavId = route.id;

      if (child.length > 0 && child[0].children.length > 0) {
        this.$router.push(child[0].children[0].path);
      }
    },
    // 计算route初始化用
    takeMatchingRoutePath(routers) {
      const len = routers.length;

      for (let i = 0; i < len; i++) {
        const childs = routers[i].children;
        const cLen = childs.length;

        if (cLen !== 0) {
          for (let j = 0; j < cLen; j++) {
            if (this.$route.fullPath.indexOf(childs[j].tagUrl) !== -1) {
              this.curNavId = routers[i].id;
              return childs;
            }
          }
        }
      }
    },
    sendModifyPhoneCode() {
      let that = this;
      let reg = /^((1[3,5,8][0-9])|(14[5,7])|(17[0,6,7,8])|(19[7]))\d{8}$/;
      if (!that.newPhone) {
        that.$message.error("请输入手机号码!");
      } else if (!reg.test(that.newPhone)) {
        that.$message.error("手机号码格式不正确!");
      } else {
        let time = setInterval(() => {
          that.modifyPhoneCodeTime--;
          if (that.modifyPhoneCodeTime <= 0) {
            that.modifyPhoneCodeTime = 60;
            clearInterval(time);
          }
        }, 1000);
        api
          .sendModifyPhoneCode({
            phone: that.newPhone
          })
          .then(res => {
            if (res.success) {
            } else {
              that.$message.error("获取验证码失败！");
            }
          });
      }
    },
    getModifyPhoneCodeTips() {
      this.$message.error(
        `请等待${this.modifyPhoneCodeTime}s后再重新获取验证码！`
      );
    },
    cancelPhoneDialog() {
      this.changePhoneFlag = false;
    },
    changePhoneFirst() {
      let that = this;
      if (that.initPwd) {
        api
          .getPwd({
            password: that.initPwd
          })
          .then(res => {
            if (res.success) {
              this.phoneFirstFlag = false;
              this.phoneSecondFlag = true;
            } else {
              that.$message.error("原密码输入不正确！");
            }
          });
      } else {
        that.$message.error("请输入原密码！");
      }
    },
    changePhoneSecond() {
      let that = this;

      if (that.newPhone) {
        if (that.newPhoneCode) {
          api
            .changePhone({
              phone: that.newPhone,
              code: that.newPhoneCode
            })
            .then(res => {
              if (res.success) {
                that.$message.success("手机号更改成功！");
                this.changePhoneFlag = false;
              } else {
                that.$message.error(res.message);
              }
            });
        } else {
          that.$message.error("请填写手机验证码！");
        }
      } else {
        that.$message.error("请输入新手机号码！");
      }
    },
    checkOldPwd() {
      let that = this;

      if (!that.oldPassword) {
        that.$message.error("请输入原密码!");
      } else {
        api
          .getPwd({
            password: that.oldPassword
          })
          .then(res => {
            if (res.success) {
              that.passwordFlag = true;
              that.$message.success("原密码输入正确。");
            } else {
              that.passwordFlag = false;
              that.$message.error("原密码输入不正确！");
            }
          });
      }
    },
    checkNewPwd() {
      let that = this;
      let reg = /^[A-Za-z_][A-Za-z0-9_,.-]{7,20}$/;
      if (!that.newPassword) {
        that.$message.error("请输入新密码!");
      } else if (!reg.test(that.newPassword)) {
        that.$message.error("新密码格式:字母或下划线开头，必须包含字母和数字!");
      }
    },
    checkNewPwdSecond() {
      let that = this;
      if (!that.newPasswordSecond) {
        that.$message.error("请再次输入新密码!");
      } else {
        if (that.newPassword !== that.newPasswordSecond) {
          that.$message.error("两次新密码输入不一致!");
        } else {
          that.newPasswordFlag = true;
        }
      }
    },
    saveUserInfo() {
      let that = this;
      if (that.oldPassword) {
        if (that.passwordFlag) {
          if (!that.newPasswordFlag) {
            that.$message.error("两次新密码输入不一致!");
          } else {
            api
              .saveUserInfo({
                password: that.newPassword
              })
              .then(res => {
                if (res.success) {
                  that.$message.success("密码修改成功。");
                  that.changePwdFlag = false;
                } else {
                  that.$message.error("服务器异常！");
                }
              });
          }
        } else {
          that.$message.error("原密码输入不正确!");
        }
      } else {
        that.$message.error("原密码不能为空!");
      }
    },
    cancelPwdDialog() {
      this.changePwdFlag = false;
    },
    getBaseInfo() {
      let that = this;

      api
        .getBaseInfo()
        .then(res => {
          if (res.success) {
            that.account = res.data.account;
            that.storeId = res.data.storeId;
            that.userHeadUrl = res.data.photoUrl;
            that.userName = res.data.userName;
            that.storeStatus = res.data.storeStatus;

            if (that.storeStatus === 1) {
              that.$router.push({ name: "Basic" });
            } else if (that.storeStatus === 2) {
              that.$router.push({ name: "Account" });
            } else {
              if (res.data.roleId === 1) {
                const {userlecture, member, cord, grouplist, settlement, transfer} = dyAdmin

                that.mainRouters = rvAdmin;

                if (res.data.funcList && res.data.funcList.length > 0) {
                  let a1 = res.data.funcList.find(n => n.functionId == 1); //课程管理
                  let a2 = res.data.funcList.find(n => n.functionId == 2); //系列课程
                  let a3 = res.data.funcList.find(n => n.functionId == 3); //拼团
                  let a4 = res.data.funcList.find(n => n.functionId == 4); //学员成长
                  let a5 = res.data.funcList.find(n => n.functionId == 5); //积分
                  let a6 = res.data.funcList.find(n => n.functionId == 6); //讲师审核
                  let a7 = res.data.funcList.find(n => n.functionId == 7); //结算管理
                  let a8 = res.data.funcList.find(n => n.functionId == 8); //转账管理

                  if (a1.state == 3) {
                    //课程管理
                    this.$store.dispatch("changePutoState", false);
                  }
                  if (a2.state == 3) {
                    //系列课程
                    this.$store.dispatch("changeMuluState", false);
                  }
                  if (!this.isFirstCome) {
                    if (a5.state == 3) {
                      that.mainRouters[2].children.unshift(cord); //插入积分
                    }
                    if (a4.state == 3) {
                      that.mainRouters[2].children.unshift(member); //插入会员
                    }
                    if (a3.state == 3) {
                      that.mainRouters[2].children[1].children.unshift(grouplist); //插入拼团
                    }
                    if (a8.state == 3) {
                      that.mainRouters[4].children.push(settlement); //转账管理
                    }
                    if (a7.state == 3) {
                      that.mainRouters[4].children.splice(1, 0, transfer); //插入结算
                    }
                    if (a6.state == 3) {
                      that.mainRouters[0].children[1].children.push( userlecture); //插入入驻讲师
                    }
                  }
                }
              } else {
                that.mainRouters = rvCustom;

                const {finaceusertransfer,withdrawal} = dyCustom

                let a1 = res.data.funcList.find(n => n.functionId == 1); //课程管理
                let a2 = res.data.funcList.find(n => n.functionId == 2); //系列课程
                let a7 = res.data.funcList.find(n => n.functionId == 7); //结算管理
                let a8 = res.data.funcList.find(n => n.functionId == 8); //转账管理

                if (a1.state == 3) {
                  //课程管理
                  this.$store.dispatch("changePutoState", false);
                }
                if (a2.state == 3) {
                  //系列课程
                  this.$store.dispatch("changeMuluState", false);
                }

                if (!this.isFirstCome) {
                  if (a7.state == 3) {
                    that.mainRouters[2].children[0].children.push(
                      finaceusertransfer
                    ); //插入结算
                  }
                  if (a8.state == 3) {
                    that.mainRouters[2].children.push(withdrawal); //转账管理
                  }
                }
              }

              that.subRouters = that.takeMatchingRoutePath(that.mainRouters);
              this.calcSubRoutes(that.subRouters);
            }
          } else {
            if (res.code === 403) {
              that.$router.push({
                name: "Login",
                query: {
                  storeId: that.storeId
                }
              });
            } else {
              that.$message.error("服务器异常！");
            }
          }
        })
        .then(() => {
          that.setIsFirstCome(true);
        });
    },
    logout() {
      let that = this;
      api.logout().then(res => {
        if (res.success) {
          Cookies.remove("token");
          Cookies.remove("vdongUserInfo");
          this.SET_TOKEN(null)
          that.$router.push({
            name: "Login",
            query: {
              storeId: that.storeId
            }
          });
        }
      });
    },
    handleCommand(command) {
      if (command === "logout") {
        this.logout();
      }
      if (command === "change-userinfo") {
        this.$router.push({
          name: "PersonalCenterEdit"
        });
      }
      if (command === "change-pwd") {
        this.changePwdFlag = true;
      }
      if (command === "change-phone") {
        this.changePhoneFlag = true;
        this.phoneFirstFlag = true;
        this.phoneSecondFlag = false;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/mixins';
@import '~assets/styles/varibles';

.top-mask
  width 100%
  height 30px
  position absolute
  bottom -30px
  left 0
  right 0
  background #f2f5f6
.el-col-3
  width 10.5%
.change-phone
  z-index 999
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  background rgba(0, 0, 0, 0.5)
  .phone-first, .phone-second
    position fixed
    top 0
    right 0
    left 0
    bottom 0
    margin auto
    width 5.08rem
    height 3.12rem
    background #fff
    border-radius 0.05rem
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
    padding 0.4rem 0 0
    .second-getcode
      height 0.4rem
      width 4.29rem
      display flex
      justify-content space-between
      align-items center
      margin-left 0.4rem
      margin-bottom 0.3rem
      input
        width 2.78rem
        height 0.38rem
        border 0.01rem solid rgba(0, 0, 0, 0.15)
        border-radius 0.04rem
        font-size 0.14rem
        color #4A4A4A
        padding-left 0.15rem
        line-height 0.38rem
      button
        height 0.4rem
        width 1.24rem
        background $color-theme
        color #fff
        line-height 0.4rem
        font-size 0.14rem
        text-align center
        border-radius 0.05rem
        cursor pointer
      .get-code
        background #C7C7C7
    .item-bottom
      height 0.69rem
      background #FAFAFA
      width 100%
      display flex
      justify-content flex-end
      align-items center
      border-radius 0 0 0.05rem 0.05rem
      .cancel, .confirm
        height 0.4rem
        width 1.35rem
        background $color-theme
        color #fff
        line-height 0.4rem
        text-align center
        border-radius 0.04rem
        font-size 0.12rem
        cursor pointer
      .cancel
        height 0.38rem
        width 1.33rem
        border 0.01rem solid $color-theme
        color $color-theme
        background #fff
      .confirm
        margin 0 0.4rem 0 0.1rem
    .first-title, .first-name, .first-name-value, .first-pwd, .second-name
      height 0.25rem
      line-height 0.25rem
      font-size 0.18rem
      font-weight 600
      color #4A4A4A
      margin-left 0.4rem
      margin-bottom 0.4rem
    .first-name, .first-name-value, .first-pwd, .second-name
      height 0.22rem
      line-height 0.22rem
      font-size 0.14rem
      font-weight 100
      margin-bottom 0.09rem
    .first-name-value
      margin-bottom 0.2rem
    .first-pwd, .second-name
      margin-bottom 0.05rem
    .first-pwd-value
      height 0.38rem
      line-height 0.38rem
      border 0.01rem solid rgba(0, 0, 0, 0.15)
      width 4.12rem
      border-radius 0.04rem
      font-size 0.14rem
      color #4A4A4A
      padding-left 0.15rem
      margin-left 0.4rem
      margin-bottom 0.4rem
  .phone-second
    height 2.73rem
.change-pwd
  z-index 999
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  background rgba(0, 0, 0, 0.5)
  .pwd-box
    position fixed
    top 0
    right 0
    left 0
    bottom 0
    margin auto
    width 5.08rem
    height 3.7rem
    background #fff
    border-radius 0.05rem
    display flex
    flex-direction column
    justify-content flex-start
    align-items center
    padding 0.4rem 0 0
    .item
      height 0.69rem
      width 4.31rem
      margin-bottom 0.3rem
      .item-name
        font-size 0.14rem
        height 0.22rem
        line-height 0.22rem
        color #4A4A4A
        margin-bottom 0.05rem
      .item-input
        height 0.4rem
        border 0.01rem solid rgba(0, 0, 0, 0.15)
        border-radius 0.04rem
        width 4.14rem
        padding-left 0.15rem
        font-size 0.14rem
        color #4A4A4A
    .item-confirm-pwd
      margin-bottom 0.4rem
    .item-bottom
      height 0.69rem
      background #FAFAFA
      width 100%
      display flex
      justify-content flex-end
      align-items center
      .cancel, .confirm
        height 0.4rem
        width 1.35rem
        background $color-theme
        color #fff
        line-height 0.4rem
        text-align center
        border-radius 0.04rem
        font-size 0.12rem
        cursor pointer
      .cancel
        height 0.38rem
        width 1.33rem
        border 0.01rem solid $color-theme
        color $color-theme
        background #fff
      .confirm
        margin 0 0.4rem 0 0.1rem
.icon-first-group
  margin-right 0.1rem
.index >>> .el-submenu__icon-arrow
  color #b1b1b1
.app
  padding-top 0.8rem
  .head
    position fixed
    top 0
    left 0
    right 0
    z-index 902
    width 100%
    height 0.8rem
    padding 0 0.3rem
    background #ffffff
    display flex
    flex-direction row nowrap
    border-top 5px solid #6CDDC7
    box-sizing border-box
    .logo
      display flex
      align-items center
      width 2.4rem
      img
        height 0.45rem
    .head-nav
      display flex
      flex-1()
      justify-content center
      font-size 0.16rem
      >div
        text-align center
        color #4A4A4A
        cursor pointer
      .cur-nav-active
        color #1F2724
        font-weight 600
    .head-dropdown
      width 2.04rem
      height 0.8rem
      color #9B9B9B
      .el-dropdown-link
        height 0.8rem
        width 2.04rem
        display flex
        justify-content flex-end
        align-items center
        cursor pointer
        .head-img
          display block
          width 0.24rem
          height 0.24rem
          margin-right 0.08rem
          border-radius 50%
        .head-name
          width 0.8rem
          fontverticalCenter(0.22rem)
          margin-right 0.1rem
          ellipsis()
  .index
    height auto
    display flex
    flex-flow row nowrap
    justify-content space-between
    align-items stretch
    margin 0 auto
    padding-top 0.3rem
    box-sizing border-box
    background-color #f2f5f6
    .index-left
      position fixed
      left 0.3rem
      top 1.1rem
      width 2.7rem
      height calc(100% - 1.4rem)
      min-width 2.7rem
      background #ffffff
      overflow-x hidden
      overflow-y auto
      z-index 899
      border 1px solid #f1f1f1
      border-radius 4px
      .person-center
        position relative
        flex()
        flex-direction column
        align-items center
        justify-content center
        height 1.95rem
        margin-bottom 0.3rem
        &after
          content ''
          width 2.2rem
          height 1px
          background-color rgba(230, 230, 230, 0.5)
          position absolute
          bottom 0
          left 0.3rem
        img
          width 0.8rem
          height 0.8rem
          border-radius 10px
        p
          font-size 18px
          margin-top 0.2rem
      .logo
        width 100%
        height 0.34rem
        img
          height 0.2rem
          width 1.4rem
          display block
          margin 0.16rem 0 0 0.25rem
      .nav-menu
        width 100%
    .index-right
      padding-bottom 0.3rem
      overflow-x hidden
      flex-flow 1
      display flex
      background-color #F2F5F6
      flex-direction column
      justify-content flex-start
      align-items center
      padding-left 3.3rem
      padding-right 0.3rem
      box-sizing border-box
      flex-1()
      .content
        width 100%
        height 100%
        box-sizing border-box
        display flex
        flex-direction column
        justify-content flex-start
        align-items center
        overflow-x hidden
        overflow-y auto
</style>
