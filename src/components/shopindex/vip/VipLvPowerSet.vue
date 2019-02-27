<template>
  <div class="vip-power-set">
    <div class="topbar layout-head">
      <h3>特权设置</h3>
      <div>
        <h3 @click="goback">
          <i class="iconfont icon-fanhui"></i>
          返回
        </h3>
      </div>
    </div>

    <div class="contain">
        <vip-set-discount :panelIndex="panelIndex" @cgIndex="changeIndex"></vip-set-discount>

        <!-- <vip-set-answer :panelIndex="panelIndex" @cgIndex="changeIndex"></vip-set-answer>

        <vip-set-column :panelIndex="panelIndex" @cgIndex="changeIndex"></vip-set-column>

        <vip-set-course :panelIndex="panelIndex" @cgIndex="changeIndex"></vip-set-course>

        <vip-set-question :panelIndex="panelIndex" @cgIndex="changeIndex"></vip-set-question> -->
    </div>
  </div>
</template>

<script>
import VipSetDiscount from "./VipSetDiscount";
import VipSetAnswer from "./VipSetAnswer";
import VipSetColumn from "./VipSetColumn";
import VipSetCourse from "./VipSetCourse";
import VipSetQuestion from "./VipSetQuestion";

export default {
  name: 'VipLvPowerSet',
  data () {
    return {
      panelIndex: 0
    }
  },
  components:{
    VipSetDiscount,
    VipSetAnswer,
    VipSetColumn,
    VipSetCourse,
    VipSetQuestion
  },
  methods:{
    changeIndex(i){
      this.panelIndex = i
    },
    goback(){
      this.$router.back()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.vip-power-set
  width 100%
  box-sizing border-box
  .topbar
    div
      flex()
      color $color-text-l
    h3
      font-size 20px
      cursor pointer
    p
      cursor pointer
    a 
      color $color-text-l
  .contain
    flex()
    flex-flow row wrap
    justify-content flex-start
</style>