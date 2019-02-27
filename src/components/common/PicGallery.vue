<template>
  <div class="gallery-mask" v-show="isShow" @click="hide">
    <div class="gallery">
      <img :src="picUrl" alt="图片">
    </div>
    <i class="iconfont icon-cha closed"></i>
  </div>
</template>

<script>
export default {
  name: "PicGallery",
  data(){
    return {
    }
  },

  props: {
    picUrl: String,
    isShow: Boolean
  },

  methods: {
    hide(){
      this.$emit("closeGallery")
    }
  }
}
</script>

<style lang="stylus">
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.gallery-mask
  position fixed
  top 0
  left 0
  right 0
  bottom 0
  width 100%
  height 100%
  background-color rgba(0, 0 ,0 , 0.5)
  flex()
  align-items center
  justify-content center
  padding .8rem 1rem
  box-sizing border-box
  z-index 9999
  cursor pointer
  .gallery
    flex()
    background-color #ffffff
    img
      width 100%
      height auto
  .closed
    position absolute
    right .5rem
    top .4rem
    font-size .2rem
    color #ffffff
    cursor pointer
</style>