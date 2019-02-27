<template>
  <div>
      <div class="fkc_box_two">
        <div class="audio_info">
          <h3>音频</h3>
          <div class="audio_style">
            <audioVue :name="introducttionData.fileName" :url="imageHead + introducttionData.columnUrl" :size="introducttionData.fileSize"></audioVue>  
          </div>
        </div>
        <div class="col_intro">
          <h3>专栏简介</h3>
          <div v-html="introducttionData.context">
            {{introducttionData.context}}
          </div>
        </div>
      </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import audioVue from "components/common/MusicPlayer" 

export default {
  name: '',
  data(){
    return{}
  },

  computed:{
    ...mapGetters([
      'imageHead'
    ]),
  },
  components:{
    audioVue
  },

  props:{
    introducttionData:{
      type:Object,
      default:{}
    }
  }
}
</script>

<style lang="stylus" scoped>
.colInfoList, .fkc_box_two
  padding 0 0.2rem
  margin 0.2rem auto 0
  .audio_style
    padding-left 0.2rem
    margin-top 0.2rem
  .audio_info, .base_info, .col_intro
    h3
      color #999999
      background #F9FAF9
      font-size 0.14rem
      height 0.3rem
      line-height 0.3rem
      padding-left 0.22rem
  .base_info
    min-width 5rem
    .info
      margin-top 0.2rem
      font-size 0.14rem
      display flex
      justify-content flex-start
        img
          width 2.4rem
          height 1.5rem
        .box_info
          margin-left 0.2rem
          font-size 0.14rem
          width calc(100% - 2.6rem)
            .info_title
              height 0.22rem
              line-height 0.22rem
              margin-bottom 0.2rem
                .title
                  color #4A4A4A
                  font-weight bold
                  font-size 0.16rem
                  height 0.22rem
                  line-height 0.22rem
                  margin 0 !important
                .sjzt
                  font-size 0.12rem
                  color #FFFFFF
                  height 0.18rem
                  line-height 0.18rem
                  background $color-theme
                  margin-left 0.1rem
                  position relative
                  bottom 0.01rem
                  padding 0.005rem 0.045rem
                .wsj
                  background #E6E6E6
                  color #9B9B9B
            .up_time
              height 0.2rem
              line-height 0.2rem
              color $color-theme
              margin-bottom 0.05rem
              font-size 0.14rem
            .price_num
              height 0.3rem
              border-bottom 1px solid #E6E6E6
              span
                  color #9B9B9B
              .cl
                  color #666666
              .fh
                  width 0.01rem
                  height 0.1rem
                  background #9B9B9B
                  line-height 0.1rem
                  margin 0 0.05rem
            .btn_check
              background $color-theme
              width 1rem
              color #FFFFFF
              font-size 0.12rem
              height 0.32rem
              line-height 0.32rem
              border-radius 0.04rem
              cursor pointer
            .zt
              color #9B9B9B
              font-size 0.12rem
              margin-left 0.15rem
    .progress
      width 100%
      margin-top 0.24rem
      h4
        color #9B9B9B
        font-size 0.12rem
        margin-bottom 0.1rem
      .progboxss
        height 0.2rem
        display flex
        justify-content space-between
        width 100%
        line-height 0.2rem
        span
            height 0.2rem
            line-height 0.2rem
            color #9B9B9B
            font-size 0.14rem
        .progbox
            margin 0
            width 83.5%
        >>> .el-progress-bar__outer
            height 0.1rem !important
        >>> .el-progress-bar__innerText
            font-size 0.06rem !important
            position relative
            bottom 0.03rem
  .col_intro
    margin-top 0.4rem
    color #4A4A4A
    font-size 0.14rem
    .introductContent
      width calc(100% - 71px)
      padding-left 0.2rem
      >>>img
        width 4.04rem
        height auto
        max-height 6rem
        margin 0.23rem 0 0.31rem 0
      >>>p
        line-height 0.28rem
        min-height 1.19rem
    h3
      margin-bottom 0.2rem
</style>
