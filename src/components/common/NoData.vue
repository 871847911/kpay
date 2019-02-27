<template>
  <div class="no-data">
    <i class="iconfont icon-zanwushuju-"></i>
    <p>暂无数据</p>
  </div>
</template>

<script>
export default {
  name: "NoData",
  data() {
    return {}
  }
};
</script>

<style lang="stylus" scoped>
.no-data
  display flex
  flex-direction column
  align-items center
  justify-content center
  color #9b9b9b
  box-sizing border-box
  i 
    font-size 80px
  p
    font-size 16px
    line-height .23rem
</style>