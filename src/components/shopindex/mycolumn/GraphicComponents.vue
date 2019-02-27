<template>
  <section class="my-column-list-detail">
    <div class="header">
      <span class="text">图文信息</span>

      <div class="right-bar">
        <span @click="back" style="cursor:pointer;margin-right:20px;"><i class="iconfont icon-fanhui"></i>返回</span>
        <div class="editor-btn" v-if="content.onStatus === 0"> 
          <el-button class="major-btn " v-if="isUnAudit" @click="handleSubmit">提交审核</el-button>
          <el-button :class="[isUnAudit ? 'less-btn' : 'major-btn']" @click="handleEditor">编辑</el-button>
        </div>
        <div class="editor-btn" v-if="content.onStatus === 1"> 
          <el-button class="major-btn " @click="handleOffShelf">下架</el-button>
        </div>
      </div>
    </div>

    <el-alert show-icon :title="remindTitle" type="success" v-if="content.auditStatus === 30"></el-alert>
    <el-alert show-icon :title="remindTitle" type="warning" v-else></el-alert>

    <div class="content-box">
      <basicInfo :content="content" :columnData="columnData"></basicInfo>
      <GraphicContentComponent :content="content"></GraphicContentComponent>
    </div>
  </section>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from 'vuex'
import audioVue from "components/common/MusicPlayer" 
import basicInfo from './BasicInfo'
import GraphicContentComponent from './GraphicContentComponent'

export default {
  name: "MycolumnListCoDetail",
  data() {
    return {
      content: {},
      columnData: {},
      remindTitle: '',
      isUnAudit: false
    };
  },

  props:{
    name,
    type:String
  },

  computed: {
    ...mapGetters([
      'imageHead'
    ])
  },

  components:{
    audioVue,
    basicInfo,
    GraphicContentComponent
  },

  mounted(){
    this.getColumn()
    this.init()
  },

  methods: {
    // 获取专栏标题和篇数
    getColumn(){
      api.getColumnInfo({ 
        id: this.$route.query.columnId
      }).then(res => {
        if(res.data){
          this.columnData = res.data
        } 
      })
    },

    // 初始化
    init(){
      const {contentId} = this.$route.query

      if(contentId){
        api.getColumnContentInfo({
          id: contentId
        }).then(res => {
          if(res.data){
            const {onStatus, auditStatus, contentName,reason} = res.data

            this.content = res.data

            switch (auditStatus) {
              case 10:
                this.remindTitle = `【${contentName}】还未提交审核`
                this.isUnAudit = true
                break;
              case 20:
                this.remindTitle = `【${contentName}】正在审核中`
                break;
              case 30:
                this.remindTitle = `【${contentName}】审核已通过`
                break;
              case 40:
                this.remindTitle = `【${contentName}】审核未通过，原因：${reason}`
                this.isUnAudit = true
                break;
            }

            if(res.data.onStatus === 0 && res.data.isShelves &&　reason){
              this.remindTitle = reason
            }
          }
        })
      }
    },

    // 提交审核
    handleSubmit(){
      api.updateColumnContentStatus({
        id: this.$route.query.contentId,
        status: 20,
        reason: ''
      }).then(res => {
        if(res.success){
          this.$message.success('提交成功！')
          this.remindTitle = `【${this.content.contentName}】正在审核中`
          this.isUnAudit = false
        }else{
          this.$message.error('提交失败！')
        }
      })
    },

    // 下架
    handleOffShelf(){
      api.updateColumnContentStatus({
        id: this.$route.query.contentId,
        status: 0,
        reason: ''
      }).then(res => {
        if(res.success){
          this.$message.success('下架成功！')
          this.init()
        }else{
          this.$message.error('下架失败！')
        }
      })
    },

    // 编辑
    handleEditor(){
      const {columnId, contentId} = this.$route.query

      this.$router.push({
        name:'MycolumnListCoEdit',
        query:{
          columnId,
          contentId
        }
      })
    },

    // 回退
    back() {
      switch(this.name){
        case 1:
          this.go("MycolumnCoVerify",0)
          break;
        case 2:
          this.go("MycolumnCoVerify",1)
          break;
        case 3:
          this.go("MycolumnCoVerify",2)
          break;
        case 4:
          this.$router.go(-1)
          break
        default:
          this.$router.go(-1)
          break
      }
    },

    // 路由跳转
    go(name,val){
      this.$router.push({
        name:name,
        query:{
          aduio:val
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.my-column-list-detail 
  width 100%
  position relative
  font-size 0.14rem
  color #4A4A4A
  .header
    display flex
    justify-content space-between
    align-items center
    color #9B9B9B
    font-size 0.2rem
    margin-bottom 0.14rem
    height 0.4rem
    .text
      color $color-text
    .right-bar
      flex()
  .content-box
    min-height 7rem
    margin-bottom 0
    .part-title 
      padding-left 0.2rem
      background-color #F9FAF9
      font-size 14px
      height 40px
      line-height 40px
      color #999999
    .small-part-title 
      color #9B9B9B
      font-size 0.14rem
      height 0.2rem
      line-height 0.2rem
      margin-bottom 0.3rem
    .audio-style
      position relative
      &::before
        content ""
        position absolute 
        bottom -40px
        height 1px 
        width 9.8rem
        background-color #E6E6E6
    .img-content
      width 100%
      background #ffffff
      box-sizing border-box
      padding 0.3rem 0 0 0.2rem
      .audio-info
        margin-bottom 0.4rem
      .col-intro
        margin-top 0.8rem
        min-height 2.23rem
    .info-content
      width 6.6rem
      .audio-info
        padding-left 0.2rem
    .info
      width 100%
      background #ffffff
      .info-content
        padding 0.3rem 0 0.4rem 0.2rem
        height auto
        flex()
        align-items flex-start
        .info-left
          flex-shrink 0
          width 2.4rem
          margin-right .4rem
          height 1.5rem
          img
            width 100%
            height 100%
        .info-right
          display flex
          flex-direction column
          height 100%
          flex-1()
        .info-right-tp
          width 100%
          min-height 78px
          flex()
          align-items baseline
          justify-content flex-start
          position relative
          &::after
            content ""
            position absolute
            right 0
            bottom 0
            width 100%
            height 2px
            background-color rgba(230,230,230,.5)
          p 
            display inline-block
            line-height 0.38rem
            font-size 30px
            font-weight 600
            margin-right .15rem
          .up-status
            color #ffffff
            background-color $color-theme
            border-radius 2px
            font-size 12px
            padding 5px
          .down-status
            flex-shrink 0
            color #9B9B9B
            background-color #E6E6E6
            border-radius 2px
            font-size 12px
            padding 0px 3px
        .info-right-bt
          width 3.8rem
          display flex
          flex-flow row nowrap
          align-items flex-start
          justify-content flex-start
          margin-top .23rem
          .detail-top
            width 50%
            position relative
            &::after
              content ""
              position absolute
              right 0
              top 0
              width 2px
              height .56rem
              background-color rgba(230,230,230,.5)
          .detail-bottom
            width 50%
            flex()
            line-height .23rem
            justify-content flex-end
            >div
              height 0.56rem
              margin-left .4rem
          p
            color #9B9B9B
            font-size 14px
            margin-bottom .1rem
          strong 
            color #4A4A4A
            font-size 14px
      // .img-content
      // .col-intro
      //   margin-top 0.5rem
      //   color #4A4A4A
      //   font-size 0.14rem
      //   img
      //     width 4.04rem
      //     height 2.4rem
      //     margin 0.14rem 0 0.31rem 0
      //   p
      //     line-height 0.2rem
      //     min-height 1.19rem
</style>
