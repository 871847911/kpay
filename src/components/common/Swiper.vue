<template>
    <div class="wrapper">
        <swiper :options="swiperOption" v-if="showSwiper">
            <swiper-slide v-for="item in list" :key="item.id">
                <img class="swiper-img" :src="item.imgUrl">
            </swiper-slide>
            <div class="swiper-pagination" slot="pagination"></div>
        </swiper>
    </div>
</template>

<script>
export default {
  name: 'HomeSwiper',
  data () {
    return {
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
        autoplay: true,
        loop: true,
        speed: 2000
      }
    }
  },
  props: {
    list: Array
  },
  computed: {
    showSwiper () {
      return this.list.length
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/varibles"

  .wrapper >>> .swiper-pagination-bullet
    border .01rem solid #fff
    width .08rem
    height .08rem
    opacity 1
    background rgba(0, 0, 0, 0)
  .wrapper >>> .swiper-pagination-bullet-active
    border none
    background $color-theme
    height .1rem
    width .1rem
  .wrapper
    padding 0
    margin 0
    width 3.2rem
    height 2rem
    .swiper-img
      width 3.2rem
      height 2rem
      display block
</style>
