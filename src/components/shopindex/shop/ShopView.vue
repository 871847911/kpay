<template>
    <div class="shop-view">
      <el-alert
        v-if="attention"
        :title="attention"
        type="warning"
        show-icon>
      </el-alert>

        <div v-if="isActive==4">
            <ul class="data-stat">
                <li class="item" v-for="(item, index) of userStat" :key="index">
                    <i class="iconfont icon-stat" :class="item.icon" :style="{
                      color: item.color,
                      borderColor: item.color
                    }"></i>
                    <div class="right">
                        <p class="num">{{item.num}}</p>
                        <p class="desc">{{item.desc}}</p>
                    </div>
                </li>
            </ul>
            <div class="middle">
                <div class="left">
                    <h3 class="left-head">待办事项</h3>
                    <ul class="left-nav">
                        <li @click="goCourse">
                          <span>待审核课程</span>
                          <i>{{userOverview.toCheckCourse}}</i>
                        </li>

                        <router-link :to="{ name: 'QuesAskMy'}" tag="li">
                          <span>待回复消息</span>
                          <i style="background:#1AA97B;">{{userOverview.toReplyMessage}}</i>
                        </router-link>

                        <router-link :to="{ name: 'UserLectureAudit'}" tag="li">
                          <span>待审核用户</span>
                          <i style="background:#C7C7C7;">{{userOverview.toCheckUser}}</i>
                        </router-link>

                        <router-link :to="{ name: 'CourseMy'}" tag="li">
                          <span>待上架课程</span>
                          <i style="background:#F5A623;">{{userOverview.noShelfCourse}}</i>
                        </router-link>
                    </ul>
                </div>
                <div class="right">
                    <h3 class="right-head">快捷入口</h3>
                    <ul class="right-nav">
                        <li class="right-nav-item" @click="quickLink('/index/coursemy')">
                            <i class="right-icon iconfont">&#xe60e;</i>
                            <span class="right-name">课程列表</span>
                        </li>
                        <li class="right-nav-item" @click="quickLink('/index/userlist')">
                            <i class="right-icon iconfont">&#xe617;</i>
                            <span class="right-name">用户管理</span>
                        </li>
                        <li class="right-nav-item" @click="quickLink('/index/ordermy')">
                            <i class="iconfont right-icon">&#xe60b;</i>
                            <span class="right-name">订单列表</span>
                        </li>
                        <li class="right-nav-item" @click="quickLink('/index/userlectureaudit')">
                            <i class="iconfont right-icon">&#xe612;</i>
                            <span class="right-name">入驻审核</span>
                        </li>
                        <!-- <li class="right-nav-item" @click="quickLink('/index/messageqa')">
                            <i class="iconfont right-icon">&#xe615;</i>
                            <span class="right-name">问答管理</span>
                        </li> -->
                        <li class="right-nav-item" @click="quickLink('/index/resourcemy')">
                            <i class="iconfont right-icon">&#xe60f;</i>
                            <span class="right-name">模板配置</span>
                        </li>
                        <li class="right-nav-item" @click="quickLink('/index/coursemyadd')">
                            <i class="iconfont right-icon">&#xe60c;</i>
                            <span class="right-name">添加普通课程</span>
                        </li>
                        <li class="right-nav-item" @click="quickLink('/index/coursemyaddfirst')">
                            <i class="iconfont icon-mulukecheng right-icon"></i>
                            <span class="right-name">添加结构课程</span>
                        </li>
                        <li class="right-nav-item" @click="quickLink('/index/trafficaccountrecharge')">
                            <i class="iconfont icon-liuliangguanli- right-icon"></i>
                            <span class="right-name">流量充值</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="bottom">
              <div class="bottom-left">
                  <h3 class="head">课程总览</h3>
                  <ul class="nav">
                      <li class="nav-item">
                          <el-badge class="item">{{userOverview.hadShelfCourse}}</el-badge>
                          <span>已上架</span>
                      </li>
                      <li class="nav-item">
                          <el-badge class="item">{{userOverview.noShelfCourse}}</el-badge>
                          <span>已下架</span>
                      </li>
                      <li class="nav-item">
                          <el-badge class="item">{{userOverview.myCourse}}</el-badge>
                          <span>我的课程</span>
                      </li>
                      <li class="nav-item">
                          <el-badge class="item">{{userOverview.allCourse}}</el-badge>
                          <span>总课程</span>
                      </li>
                  </ul>
              </div>
              <div class="bottom-right">
                  <h3 class="head">用户总览</h3>
                  <ul class="nav">
                      <li class="nav-item">
                          <el-badge class="item">{{userOverview.teacher}}</el-badge>
                          <span>讲师</span>
                      </li>
                      <li class="nav-item">
                          <el-badge class="item">{{userOverview.todayNewCount}}</el-badge>
                          <span>今日新增</span>
                      </li>
                      <li class="nav-item">
                          <el-badge class="item">{{userOverview.monthNewCount}}</el-badge>
                          <span>本月新增</span>
                      </li>
                      <li class="nav-item">
                          <el-badge class="item">{{userOverview.allUser}}</el-badge>
                          <span>用户总数</span>
                      </li>
                  </ul>
              </div>
            </div>
        </div>
        <no-active v-if="isActive == 3"></no-active>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
export default {
  name: 'ShopView',
  data () {
    return {
      userOverview: {},
      userStat: [{
        icon: 'icon-kechengchengjiao',
        color: '#1AA97B',
        num: 0,
        desc: '昨日课程成交笔数'
      },
      {
        icon: 'icon-fangwenshu',
        num: 0,
        color: '#EF582F',
        desc: '昨日成交金额（元）'
      },
      {
        icon: 'icon-zuorichengjiaojine',
        num: 0,
        color: '#F42C21',
        desc: '本月成交金额（元）'
      },
      {
        icon: 'icon-zongchengjiaojine',
        num: 0,
        color: '#77B336',
        desc: '总成交金额（元）'
      }],
      attention: ''
    }
  },
  created () {
    this.init()
    this.getShopView()
  },
  computed: {
    ...mapGetters([
      'isActive',
      'roleId'
    ])
  },
  methods: {
    init(){
      api.getBalanceNotice().then(res => {
        if(res.data){
          const {bucketState, waringAmount} = res.data

          if(this.isActive === 4){
            if(bucketState === 2)
              this.attention = `流量账户余额少于${waringAmount}元，请及时充值`
            }else if(bucketState === 3){
              this.attention = '流量账户已欠费，请及时充值，避免影响您的正常使用'
            }
          }
      })
    },
    reFresh () {
      this.getShopView()
    },
    getShopView () {
      let that = this
      api.getShopView().then(res => {
        if (res.success) {
          that.userOverview = res.data
          that.userStat[0].num = that.userOverview.yesterdayDealCourse
          that.userStat[1].num = that.userOverview.yesterdayDealAmount
          that.userStat[2].num = that.userOverview.monthDealAmount
          that.userStat[3].num = that.userOverview.allDealAmount
        }
      }, ret => {
        that.$message.error('获取店铺概览失败！')
      })
    },
    quickLink (link) {
      this.$router.push(link)
    },
    goCourse(){
      this.$router.push({
        name:'CourseThird',
        query:{
          idex:1
        }
      })
    }
  },
  components: {
    NoActive
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
.shop-view
  width 100%
  margin 0 auto
.no-active-image
  margin 1.13rem auto .45rem
  height 4.03rem
  width 4.24rem
  background #ccc
  display block
.no-active-tip
  width 3.4rem
  height .28rem
  line-height .28rem
  color #9B9B9B
  font-size .2rem
  margin 0 auto .32rem
.no-active-btn
  width .95rem
  height .28rem
  border-radius .04rem
  background $color-theme
  color #fff
  font-size .12rem
  line-height .28rem
  text-align center
  margin 0 auto 0
  display block
  cursor pointer
.icon-stat
  display flex
  align-items center
  justify-content center
  width .55rem
  height .55rem
  font-size .3rem
  border 1px solid #000000
  margin-left 0.26rem
  margin-right 0.15rem
  border-radius 50%
.data-stat
  height 1rem
  display flex
  justify-content center
  align-items center
  .item
    height 100%
    width 24%
    background #fff
    border-radius .05rem
    margin-right .21rem
    display flex
    justify-content flex-start
    align-items center
    &:last-child
      margin 0
    .left
      margin-left .26rem
      width .5rem
      height .5rem
      display block
      margin-right .15rem
    .right
      display flex
      flex-direction column
      justify-content center
      align-items flex-start
      .num
        height .33rem
        line-height .33rem
        font-size .24rem
        color #4A4A4A
      .desc
        height .17rem
        line-height .17rem
        font-size .12rem
        color #9B9B9B
.middle
  height 3rem
  margin .2rem 0
  flex()
  .left
    height 100%
    width 24%
    border-radius .05rem
    background #fff
    padding 0 .2rem
    box-sizing border-box
    .left-head
      height .5rem
      line-height .5rem
      color #9B9B9B
      font-size .12rem
    .left-nav
      li
        display flex
        justify-content space-between
        align-items center
        height .6rem
        box-sizing border-box
        border-bottom .01rem solid #E6E6E6
        cursor pointer
        &:last-child
          border none
        span
          fontCenter(.2rem)
          font-size .14rem
          color #4A4A4A
        i
          display block
          height .18rem
          min-width .18rem
          font-size .14rem
          line-height .18rem
          background #EF582F
          border-radius .09rem
          text-align center
          color #fff
  .right
    height 3rem
    flex-grow 1
    border-radius .05rem
    background #fff
    padding 0 .2rem .2rem
    box-sizing border-box
    margin-left .2rem
    .right-head
      height .5rem
      line-height .5rem
      color #9B9B9B
      font-size .12rem
    .right-nav
      display flex
      justify-content space-around
      flex-wrap wrap
      align-items center
      .right-nav-item
        cursor pointer
        display flex
        flex-direction column
        justify-content center
        align-items center
        width 25%
        height 1.15rem
        box-sizing border-box
        border-right .01rem solid #E6E6E6
        border-bottom .01rem solid #E6E6E6
        &:nth-of-type(4)
          border-right none
        &:nth-of-type(8)
          border none
        &:nth-of-type(5),&:nth-of-type(6),&:nth-of-type(7)
          border-bottom none
        .right-icon
          font-size .24rem
          color #9B9B9B
          margin-bottom .1rem
        .right-name
          height .17rem
          line-height .17rem
          text-align center
          font-size .12rem
          color #333
.bottom
  height 1.59rem
  flex()
  .bottom-left,.bottom-right
    height 100%
    width 49%
    border-radius .05rem
    margin-right .2rem
    background #fff
    padding 0 .2rem
  .head
    height .5rem
    line-height .5rem
    color #9B9B9B
    font-size .12rem
  .nav
    height 1.09rem
    flex()
    .nav-item
      flex-1()
      height 100%
      columnFlex()
      .item
        margin .12rem 0 .04rem
        font-size .28rem
        fontCenter(.4rem)
        color #4A4A4A
        .is-dot
          color $color-theme
      span
        width 100%
        fontCenter(.17rem)
        font-size .12rem
        color #9B9B9B
  .bottom-right
    margin 0
</style>
