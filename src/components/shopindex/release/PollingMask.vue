<template>
  <div class="poll-mask">
      <div class="content">
        <!-- <CircleLoader /> -->
        <p>等待授权中...</p>
        <div class="action-bar">
            <el-button class="major-btn" @click="$emit('ok')">授权成功</el-button>
            <el-button class="less-btn btn-b" @click="$emit('close')">授权失败</el-button>
        </div>
      </div>
    </div>
</template>

<script>
import CircleLoader from "components/common/CircleLoader";

export default {
  name: "PollingMask",
  data(){
    return{}
  },
  components:{
    CircleLoader
  },
}
</script>

<style lang="stylus" scoped>
.poll-mask
  position fixed
  top 0
  left 0
  bottom 0
  width 100%
  height 100%
  display flex
  align-items center
  justify-content center
  background-color rgba(0,0,0,0.5)
  z-index 9999
  >div
    position relative
    width 3rem
    height 2rem
    display flex
    flex-direction column
    align-items center
    justify-content center
    background-color #ffffff
    border-radius .05rem
    color #666666
  .action-bar
    display flex
    flex-flow row nowrap
    align-items center
    justify-content center
    margin-top .4rem
  p
    font-size 16px
    padding .2rem 0 0 0
</style>
