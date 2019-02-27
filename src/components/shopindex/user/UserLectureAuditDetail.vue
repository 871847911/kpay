<template>
    <div class="user-audit-detail">
        <div class="head">
            <h2>入驻审核详情</h2>
            <div class="btn-group">
                <button class="btn-refuse" @click="updateCourseStatus(id, 30)" v-if="status == 10">拒绝</button>
                <button class="btn-pass" @click="updateCourseStatus(id, 20)" v-if="status == 10">通过</button>
            </div>
        </div>
        <div class="content-one">
            <div class="one-left">
                <h3>基本信息</h3>
                <img v-lazy="bucketDomain+userInfo.photoUrl">
                <div class="item">
                    <span class="item-l">姓名：</span>
                    <span class="item-r">{{userInfo.contact}}</span>
                </div>
                <div class="item">
                    <span class="item-l">手机号码：</span>
                    <span class="item-r">{{phone}}</span>
                </div>
                <div class="item">
                    <span class="item-l">电子邮箱：</span>
                    <span class="item-r">{{userInfo.mail}}</span>
                </div>
                <div class="item">
                    <span class="item-l">微信昵称： </span>
                    <span class="item-r">{{nickName}}</span>
                </div>
                <div class="item">
                    <span class="item-l">申请时间： </span>
                    <span class="item-r">{{userInfo.applyDate}}</span>
                </div>
            </div>
            <div class="one-right">
                <h3>身份认证</h3>
                <div class="right-content">
                    <h4>身份证照片：</h4>
                    <div class="idcard">
                        <div class="idcard-l">
                            <img v-lazy="bucketDomain+userInfo.idCardFrontUrl">
                            <span>正面</span>
                        </div>
                        <div class="idcard-r">
                            <img v-lazy="bucketDomain+userInfo.idCardBackUrl">
                            <span>反面</span>
                        </div>
                    </div>
                    <div class="idcard-num">
                        <p>身份证号码</p>
                        <span>{{userInfo.idCardNum}}</span>
                    </div>
                    <div class="address">
                        <div class="address-l">
                            <p>所在地区</p>
                            <span>{{provinceCity}}</span>
                        </div>
                        <div class="address-r">
                            <p>详细地址</p>
                            <span>{{userInfo.address}}</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="content-two">
            <h3>其他信息</h3>
            <div class="two">
                <div class="two-left">
                    <h4>擅长领域：</h4>
                    <div class="good-filed">
                        <!-- <span>php</span>
                        <span>javascript</span>
                        <span>.net</span>
                        <span>linux命令</span>
                        <span>服务器运维</span> -->
                    </div>
                </div>
                <div class="two-right">
                    <h4>个人介绍：</h4>
                    <p>{{userInfo.introduce}}</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from 'fetch/api'
import {mapGetters} from 'vuex'
export default {
  name: 'UserAuditDetail',
  data () {
    return {
      id: '',
      userMain: '', // 用户信息
      userInfo: '', // 用户详情
      provinceCity: '', // 所在地区
      status: '', // 用户状态
      bucketDomain:'',
      phone: '',
      nickName:''
    }
  },
  created () {
    this.id = this.$route.params.id
    this.getUserInfo()
  },
  computed: {
    ...mapGetters([
      'imageHead'
    ])
  },
  methods: {
    updateCourseStatus (id, status) {
      let that = this
      api.auditPass({
        userId: id,
        status: status
      }).then(res => {
        if (res.success) {
          if (status === 30) {
            that.$message.success('已拒绝此用户通过。')
            that.$router.push({
              name: 'UserAudit'
            })
          } else {
            that.$message.success('已审核通过该用户。')
            that.$router.push({
              name: 'UserAudit'
            })
          }
        } else {
          that.$message.error('服务器异常！')
        }
      })
    },
    getUserInfo() {
      let that = this
      api.getUserInfo({
        userId: that.id
      }).then(res => {
        if (res.success) {
          that.userMain = res.data
          that.bucketDomain = res.data.bucketDomain
          that.nickName = res.data.nickName
          that.userInfo = res.data.userInfo
          that.status = that.userInfo.applyStatus

          if(that.userMain.phone){
            that.phone = that.userMain.phone
          }else{
            that.phone = that.userInfo.phone
          }

          if (that.userInfo && that.userInfo.province && that.userInfo.city && that.userInfo.district) {
            that.provinceCity = that.userInfo.province + that.userInfo.city + that.userInfo.district
          } else {
            that.provinceCity = '-'
          }
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.user-audit-detail
    width 100%
    margin 0 auto
.head
    width 100%
    margin 0 auto .1rem
    height .4rem
    display flex
    justify-content space-between
    align-items flex-start
    h2
        height .28rem
        line-height .28rem
        font-size .2rem
        color #9B9B9B
    .btn-group
        height .4rem
        width 1.69rem
        display flex
        justify-content flex-end
        align-items center
        .btn-refuse,.btn-pass
            height .4rem
            width .82rem
            border-radius .04rem
            font-size .12rem
            cursor pointer
        .btn-refuse
            color $color-theme
            border .01rem solid $color-theme
            box-sizing border-box
            background #fff
        .btn-pass
            margin-left .05rem
            color #fff
            background $color-theme
.content-one
    width 100%
    margin 0 auto .2rem
    display flex
    justify-content space-between
    align-items center
    .one-left
        width 33%
        margin-right 2%
        height 4.8rem
        border-radius .05rem
        background #fff
        padding .2rem
        display flex
        flex-direction column
        justify-content flex-start
        align-items center
        h3
            height .2rem
            line-height .2rem
            font-size .14rem
            color #9B9B9B
            width 100%
            margin-bottom .4rem
        img
            height 1.4rem
            width 1.4rem
            border-radius 50%
            display block
            margin-bottom .6rem
        .item
            width 100%
            height .44rem
            display flex
            justify-content space-between
            align-items center
            box-sizing border-box
            border-bottom .01rem solid #E6E6E6
            &:nth-of-type(5)
                border none
            .item-l,.item-r
                height .2rem
                line-height .2rem
                font-size .14rem
            .item-l
                color #9B9B9B
            .item-r
                color #4A4A4A
    .one-right
        width 65%
        height 4.8rem
        border-radius .05rem
        background #fff
        padding .2rem
        h3
            height .2rem
            line-height .2rem
            font-size .14rem
            color #9B9B9B
            width 7.2rem
            margin-bottom .4rem
        .right-content
            height 3rem
            width 100%
            margin 0 auto
            h4
                height .2rem
                line-height .2rem
                color #9B9B9B
                font-size .14rem
                margin-bottom .2rem
            .idcard
                height 1.92rem
                width 100%
                border-bottom .01rem solid #E6E6E6
                display flex
                justify-content flex-start
                align-items flex-start
                margin-bottom .3rem
                .idcard-l,.idcard-r
                    height 1.58rem
                    width 1.9rem
                    display flex
                    flex-direction column
                    justify-content flex-start
                    align-items center
                    img
                        width 1.9rem
                        height 1.3rem
                        border-radius .05rem
                        margin-bottom .08rem
                    span
                        height .2rem
                        line-height .2rem
                        font-size .14rem
                        color #4A4A4A
                .idcard-l
                    margin-right .88rem
            .idcard-num
                width 100%
                height .5rem
                margin-bottom .3rem
                display flex
                flex-direction column
                justify-content space-between
                align-items flex-start
                p,span
                    height .2rem
                    line-height .2rem
                    font-size .14rem
                p
                    color #9B9B9B
                span
                    color #4A4A4A
            .address
                display flex
                height .5rem
                .address-l,.address-r
                    flex-1()
                    height 100%
                    display flex
                    flex-direction column
                    justify-content space-between
                    align-items flex-start
                    p,span
                        height .2rem
                        line-height .2rem
                        font-size .14rem
                    p
                        color #9B9B9B
                    span
                        color #4A4A4A
.content-two
    height 3rem
    width 100%
    box-sizing border-box
    margin 0 auto .56rem
    border-radius .05rem
    background #fff
    padding .2rem
    h3
        height .2rem
        line-height .2rem
        font-size .14rem
        color #9B9B9B
        width 11rem
        margin-bottom .3rem
    .two
        width 11rem
        height 2rem
        display flex
        justify-content flex-start
        align-items center
        .two-left,.two-right
            width 3.38rem
            height 100%
            margin-right .95rem
            border-right .01rem solid #E6E6E6
            h4
                height .2rem
                line-height .2rem
                color #9B9B9B
                font-size .14rem
                margin-bottom .2rem
            .good-filed
                display flex
                flex-wrap wrap
                justify-content flex-start
                align-items flex-start
                span
                    height .3rem
                    border-radius .15rem
                    background #EEF2F3
                    color #AEB8BE
                    font-size .14rem
                    line-height .3rem
                    text-align center
                    padding 0 .2rem
                    margin-right .1rem
                    margin-bottom .1rem
            p
                min-height .8rem
                line-height .2rem
                font-size .14rem
                color #4A4A4A
                width 6rem
                white-space pre-wrap
                overflow hidden
                text-overflow ellipsis
                display -webkit-box
                -webkit-line-clamp 4
                -webkit-box-orient vertical
        .two-right
            width 6rem
            border none
</style>
