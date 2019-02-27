<template>
    <div class="course-my-detail">
        <div class="head">
            <button class="btn-one" @click="back">
                <i class="iconfont icon-fanhui"></i>
                <span>返回</span>
            </button>
            <button class="btn-two" @click="toEdit(id, courseType)" v-if="courseMain.status != 20 && courseMain.status != 40 && courseFlag">编辑</button>
            <button class="btn-three" v-if="courseMain.status == 10 || courseMain.status == 30" @click="updateCourseStatus(id, 20)">提交审核</button>
            <button class="btn-three" v-if="courseMain.status == 50" @click="updateCourseStatus(id, 40)">上架</button>
            <button class="btn-three" v-if="courseMain.status == 40" @click="updateCourseStatus(id, 50)">下架</button>
        </div>
        <div class="content">
            <div class="left">
                <h2>课程详情</h2>
                <div class="detail">
                    <div class="detail-one">
                        <div class="detail-one-left">
                            <swiper v-if="swiperFlag" :list="swiperList"></swiper>
                        </div>
                        <div class="detail-one-right">
                            <h3>{{courseMain.courseName}}</h3>
                            <button class="state" v-if="courseMain.status == 50">未上架</button>
                            <button class="state" v-else-if="courseMain.status == 40" style="color:#1AA97B;">已上架</button>
                            <button class="state" v-else-if="courseMain.status == 20" style="color:#4A90E2;">审核中</button>
                            <button class="state" v-else-if="courseMain.status == 10" style="color:#F42C21;">新建</button>
                            <button class="state" v-else style="color:#F42C21;">未通过</button>
                            <p class="price">¥{{courseMain.price}}</p>
                            <p class="name">主讲人：{{courseMain.createUser}}</p>
                            <p class="data">
                                <i class="el-icon-view"></i>
                                <span class="people-num">{{courseMain.readPersonNum}}</span>
                                <i class="el-icon-time"></i>
                                <span class="time">{{courseMain.createDate}}</span>
                            </p>
                        </div>
                    </div>
                    <h3 class="desc">课程简介</h3>
                    <p class="desc-txt" v-html="courseMain.introduction"></p>
                </div>
            </div>
            <div class="right">
                <h2>课程正文</h2>
                <div class="detail">
                    <div class="detail-one">
                        <course-main
                            v-if="courseFlag"
                            :courseType="courseType"
                            :subType="subType"
                            :courseContent="courseContent">
                        </course-main>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from 'fetch/api'
import Swiper from 'components/common/Swiper'
import {mapGetters} from 'vuex'
import CourseMain from 'components/common/courseMain'
export default {
  name: 'CourseMyDetail',
  data () {
    return {
      id: '', // 课程详情id
      swiperList: [], // 课程详情轮播图数组
      courseMain: '', // 课程信息
      userInfo: '', // 用户信息
      courseContent: '', // 课程正文信息
      courseType: '', // 课程结构 1--非结构 2--结构
      subType: '', // 正文内容 1--图文 2--音频 2--视频
      courseFlag: false, // 父组件有数据时再渲染子组件
      swiperFlag: false // 轮播数组获取到数据后在渲染轮播图
    }
  },
  created () {
    this.id = this.$route.params.id
    if (this.id) {
      this.getCourseDetail()
    } else {
      this.$router.back()
    }
  },
  components: {
    Swiper,
    CourseMain
  },
  computed: {
    ...mapGetters([
      'imageHead'
    ])
  },
  methods: {
    updateCourseStatus (id, status) {
      let that = this
      api.updateCourseStatus({
        id: id,
        status: status
      }).then(res => {
        if (res.success) {
          if (status === 40) {
            that.$message.success('课程已上架成功。')
          } else if (status === 50) {
            that.$message.success('课程已下架成功。')
          } else {
            that.$message.success('已提交审核，请耐心等待。')
          }
          that.getCourseDetail()
        } else {
          that.$message.error('更改课程状态失败！')
        }
      })
    },
    getCourseDetail () {
      let that = this
      api.getCourseDetail({
        id: that.id
      }).then(res => {
        if (res.success) {
          that.courseMain = res.data
          that.userInfo = res.data.userInfo
          that.courseContent = res.data.courseSubList
          that.courseType = res.data.courseType
          if (that.courseContent.length > 0) {
            that.subType = that.courseContent[0].subType
          } else {
            that.subType = 1
          }
          that.courseFlag = true
          if (res.data.courseUrlList) {
            let arr = res.data.courseUrlList
            arr.forEach(function(item, index) {
              that.swiperList.push({
                imgUrl: that.imageHead + item
              })
            })
            that.swiperFlag = true
          }
        } else {
          that.$message.error('获取课程详情失败！')
        }
      })
    },
    back () {
      this.$router.back()
    },
    toEdit (id, type) {
      if (parseInt(type) === 1) {
        this.$router.push({
          name: 'CourseMyAdd',
          query: {
            id: id
          }
        })
      } else {
        this.$router.push({
          name: 'CourseMyAddFirst',
          query: {
            id: id
          }
        })
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
.desc-txt >>> img
  max-width 100%
.course-my-detail
  width 100%
  margin 0 auto
.head
  height .4rem
  width 100%
  margin 0 auto .1rem
  position relative
  .btn-one
    cursor pointer
    position absolute
    left 0
    bottom 50%
    margin-bottom -0.14rem
    height .28rem
    line-height .28rem
    font-size .2rem
    color #9B9B9B
    background-color transparent
    .iconfont
      font-size .2rem
  .btn-two
    cursor pointer
    height .4rem
    line-height .4rem
    box-sizing border-box
    background #fff
    color $color-theme
    font-size .12rem
    border .01rem solid $color-theme
    width .82rem
    border-radius .04rem
    position absolute
    right .87rem
    top 0
  .btn-three
    cursor pointer
    height .4rem
    line-height .4rem
    background $color-theme
    color #fff
    font-size .12rem
    width .82rem
    border-radius .04rem
    position absolute
    right 0
    top 0
.content
  width 100%
  margin 0 auto .27rem
  display flex
  justify-content center
  align-items center
  .left
    height 6.86rem
    width 66%
    border-radius .05rem
    background #fff
    margin-right .2rem
    padding .17rem .3rem
    h2
      height .22rem
      line-height .22rem
      color #9B9B9B
      font-size .16rem
      margin-bottom .09rem
    .detail
      height 6.53rem
      width 100%
      overflow-x hidden
      overflow-y auto
      border-top .01rem solid #E6E6E6
      padding-top .19rem
      box-sizing border-box
      .detail-one
        width 100%
        height 2rem
        display flex
        justify-content flex-start
        align-items center
        margin-bottom .41rem
        .detail-one-left
          height 2rem
          width 3.2rem
          background #ccc
          margin-right .2rem
        .detail-one-right
          height 2rem
          flex-1()
          display flex
          flex-direction column
          justify-content flex-start
          align-items flex-start
          h3
            width 3.6rem
            height .4rem
            line-height .4rem
            font-size .28rem
            font-weight 600
            color #4A4A4A
            margin-bottom .05rem
            ellipsis()
          .state
            height .26rem
            width .6rem
            background #EEF2F3
            color #AEB8BE
            font-size .14rem
            border-radius .05rem
            margin-bottom .2rem
          .price
            heigth .33rem
            line-height .33rem
            font-size .24rem
            color #F5A623
            margin-bottom .2rem
          .name
            height .25rem
            line-height .25rem
            color #4A4A4A
            font-size .18rem
            margin-bottom .09rem
          .data
            height .2rem
            line-height .2rem
            font-size .14rem
            color #4A4A4A
            .el-icon-view,.el-icon-time
              margin-right .05rem
            .people-num
              margin-right .2rem
      .desc
        height .22rem
        line-height .22rem
        font-size .16rem
        color #4A4A4A
        margin-bottom .19rem
      .desc-txt
        line-height .2rem
        color #4A4A4A
        font-size .14rem
        width 100%
        margin-bottom .19rem
      .desc-img
        height 2.14rem
        width 4.8rem
        background #ccc
        display block
        margin-bottom .2rem
  .right
    height 7.2rem
    width 33%
    border-radius .05rem
    background #fff
    box-sizing border-box
    padding .18rem .2rem
    h2
      height .22rem
      line-height .22rem
      color #9B9B9B
      font-size .16rem
      margin-bottom .09rem
    .detail
      height 6.49rem
      width 100%
      border-top .01rem solid #E6E6E6
      padding-top .2rem
      .detail-one
        width 100%
        height 100%
        display flex
        justify-content center
        align-items center
</style>
