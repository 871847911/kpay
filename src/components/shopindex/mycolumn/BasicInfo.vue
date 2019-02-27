<template>
  <div>
    <p class="part-title">基本信息</p>
    <div class="info">
      <div class="info-content">
        <div class="info-left">
          <img :src="imageHead + content.contentUrl" alt="图片">
        </div>

        <div class="info-right">
          <div class="info-right-tp">
            <div class="text-top">
              <p>{{content.contentName}}</p>
              <span v-if="content.onStatus === 0" class="down-status">未上架</span>
              <span v-if="content.onStatus === 1" class="up-status">已上架</span>
            </div>
          
            <div class="shelves-time" v-if="roleId === 1">上架时间：{{content.onDate}}</div>
          </div>

          <div class="info-right-bt">
            <div class="detail-top">
              <p>专栏名称</p>
              <strong>{{columnData.columnName}}</strong>
            </div>
            <div class="detail-bottom">
              <div>
                <p>篇幅</p>
                <strong>{{columnData.articleNumber}}</strong>
              </div>
                <div>
                <p>当前篇幅</p>
                <strong>{{content.currentNo}}</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
export default {
  name: 'BasicInfo',
  data(){
    return {}
  },

  props:{
    columnData:{
      type:Object,
      default:{}
    },
    content:{
      type:Object,
      default:{}
    }

  },
  computed: {
    ...mapGetters([
      'imageHead',
      'roleId'
    ])
  },
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
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
  .info
    margin-bottom 0.3rem
    width 100%
    background #ffffff
    .info-content
      // width 6.6rem
      padding 0.3rem 0 0.4rem 0.2rem
      height auto
      flex()
      justify-content flex-start
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
        width 3.8rem
        display flex
        flex-direction column
        flex()
        align-items flex-start
        height auto 
      .info-right-tp
        position relative
        width 100%
        min-height 78px
        align-items baseline
        justify-content flex-start
        position relative
        .text-top
          display flex
          align-items center
          justify-content flex-start
        .shelves-time
          height 20px
          font-size 14px
          font-weight 400
          color #9B9B9B
          line-height 20px
          margin-bottom 0.1rem
        &::after
          content ""
          position absolute
          right 0
          bottom 0
          width 100%
          height 1px
          background-color rgba(230,230,230,.5)
        p 
          max-width calc(100% - 65px)
          word-break keep-all
          word-wrap break-word
          // word-break break-all
          display inline-block
          line-height 0.38rem
          font-size 30px
          font-weight 600
          flex-shrink 0
          margin 0 .15rem 0.1rem 0
        .up-status
          flex-shrink 0 
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
          padding 2px 3px
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
            width 1px
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
          line-height 0.23rem
          color #9B9B9B
          font-size 14px
          margin-bottom .1rem
        strong 
          color #4A4A4A
          font-size 14px
</style>
