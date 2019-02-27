<template>
    <div class="course-audit-detail">
        <div class="head">
            <button class="btn-one" @click="back">
                <i class="iconfont icon-fanhui"></i>
                <span>返回</span>
            </button>
            <button class="btn-two" @click="updateCourseStatus(id, 30)" v-if="courseMain.status == 20">拒绝</button>
            <button class="btn-three" @click="updateCourseStatus(id, 50)" v-if="courseMain.status == 40">下架</button>
            <button class="btn-three" @click="updateCourseStatus(id, 40)" v-if="courseMain.status == 20">通过</button>
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
                            <button class="state" v-if="courseMain.status == 40 || courseMain.status == 50" style="color:#1AA97B;">已通过</button>
                            <button class="state" v-else-if="courseMain.status == 20" style="color:#4A90E2;">审核中</button>
                            <button class="state" v-else-if="courseMain.status == 30" style="color:#F42C21;">未通过</button>
                            <p class="price">¥{{courseMain.price}}</p>
                            <p class="name">主讲人：{{userInfo.contact}}</p>
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
  name: 'CourseAuditDetail',
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
    // 更改课程状态
    updateCourseStatus (id, status) {
      let that = this
      api.updateCourseStatus({
        id: id,
        status: status
      }).then(res => {
        if (res.success) {
          if (status === 40) {
            that.$message.success('课程已审核通过。')
            that.getCourseDetail()
          } else if (status === 50) {
            that.$message.success('课程已下架。')
            that.getCourseDetail()
          } else {
            that.$message.success('课程已拒绝通过。')
            that.getCourseDetail()
          }
        } else {
          that.$message.error('服务器异常！')
        }
      })
    },

    // 获取课程审核详情数据
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

    // 返回上一步
    back () {
      this.$router.back()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
.desc-txt >>> img
  max-width 100%
.course-audit-detail
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
    fontverticalCenter(.28rem)
    font-size $font-size-large
    color $color-text-l
    background-color transparent
    .iconfont
      font-size $font-size-large
  .btn-two
    cursor pointer
    fontverticalCenter(.4rem)
    box-sizing border-box
    background $color-dialog-background
    color $color-theme
    font-size $font-size-small
    border $color-border-theme
    width .82rem
    border-radius $radius-s
    position absolute
    right .87rem
    top 0
  .btn-three
    cursor pointer
    fontverticalCenter(.4rem)
    background $color-theme
    color $color-text-w
    font-size $font-size-small
    width .82rem
    border-radius $radius-s
    position absolute
    right 0
    top 0
.content
  width 100%
  margin 0 auto .27rem
  flex()
  .left
    height 6.86rem
    width 66%
    border-radius $radius
    background $color-dialog-background
    margin-right .2rem
    padding .17rem .3rem
    h2
      fontverticalCenter(.22rem)
      color $color-text-l
      font-size $font-size
      margin-bottom .09rem
    .detail
      height 6.53rem
      width 100%
      overflowVertical()
      border-top $color-border-1
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
            fontverticalCenter(.4rem)
            font-size $font-size-large-x
            font-weight $font-weight
            color $color-text-d
            margin-bottom $radius
            ellipsis()
          .state
            height .26rem
            width .6rem
            background #EEF2F3
            font-size $font-size-medium
            border-radius $radius
            margin-bottom .2rem
          .price
            fontverticalCenter(.33rem)
            font-size $font-size-large-l
            color #F5A623
            margin-bottom .2rem
          .name
            fontverticalCenter(.25rem)
            color $color-text-d
            font-size $font-size-medium-x
            margin-bottom .09rem
          .data
            fontverticalCenter(.2rem)
            font-size $font-size-medium
            color $color-text-d
            .el-icon-view,.el-icon-time
              margin-right .05rem
            .people-num
              margin-right .2rem
      .desc
        fontverticalCenter(.22rem)
        font-size $font-size
        color $color-text-d
        margin-bottom .19rem
      .desc-txt
        line-height .2rem
        color $color-text-d
        font-size $font-size-medium
        width 100%
        margin-bottom .19rem
      .desc-img
        height 2.14rem
        width 4.8rem
        display block
        margin-bottom .2rem
  .right
    height 7.2rem
    width 33%
    border-radius $radius
    background $color-dialog-background
    box-sizing border-box
    padding .18rem .2rem
    h2
      fontverticalCenter(.22rem)
      color $color-text-l
      font-size $font-size
      margin-bottom .09rem
    .detail
      height 6.49rem
      width 100%
      border-top $color-border-1
      padding-top .2rem
      .detail-one
        width 100%
        height 100%
        flex()
</style>
