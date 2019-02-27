<template>
    <div class="settings">
      <h2 class="logo">
        <img src="../../assets/image/new-logo.png" alt="logo">
      </h2>
      <div class="content">
        <router-view/>
      </div>
    </div>
</template>

<script>
export default {
  name: 'Settings'
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/varibles"
.settings
  min-height 100%
  background $color-background
  overflow hidden
  .logo
    height .3rem
    margin-top .22rem
    margin-left .31rem
    margin-bottom .36rem
    img
      display block
      height auto
      width 1rem
  .content
    border-radius $radius
    width 96%
    min-height 6.45rem
    margin 0 2% .41rem 2%
</style>
