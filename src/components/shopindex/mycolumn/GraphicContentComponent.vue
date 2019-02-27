<template>
  <div>
    <h3 class="text-content">图文内容</h3>
    <div class="img-content">
      <div class="audio-info">
        <h3 class="small-part-title">音频</h3>
        <div class="audio-style">
            <audioVue :name="content.audioName" :url="imageHead + content.audioUrl" :size="content.audioSize"></audioVue>  
        </div>
      </div>

      <div class="col-intro">
        <h3 class="small-part-title">内容</h3>
        <div v-html="content.content">{{content.content}}</div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import audioVue from "components/common/MusicPlayer" 
export default {
  name: 'GraphicContentComponent',
  data(){
    return {}
  },

  props:{
    content:{
      type:Object,
      default:{}
    }
  },

  computed: {
    ...mapGetters([
      'imageHead'
    ])
  },

  components:{
    audioVue
  }
}
</script>

<style lang="stylus" scoped>
 .text-content
    color #999999
    background-color #F9FAF9
    padding-left 0.2rem
    height 0.4rem
    line-height 0.4rem
 .img-content
    width 100%
    background #ffffff
    box-sizing border-box
    padding 0.3rem 0 0 0.2rem
    .audio-info
      position relative
      margin-bottom 0.4rem
      &::before
        content ""
        position absolute 
        bottom -40px
        height 1px 
        width 9.8rem
        background-color #E6E6E6
      h3
        height 0.2rem
        line-height 0.2rem
        margin-bottom 0.3rem
    .col-intro
      padding-bottom 0.52rem
      margin-top 0.8rem
      .small-part-title 
        color #9B9B9B
        font-size 0.14rem
        height 0.2rem
        line-height 0.2rem
        margin-bottom 0.3rem
      >>>p
        line-height 0.28rem!important
</style>
