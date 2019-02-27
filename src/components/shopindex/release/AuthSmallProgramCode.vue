<template>
  <ManageTpl />
  <!-- <div class="code-manage">
    <div class="topbar layout-head">
      <h3>代码管理</h3>
      <div>
        <h3 @click="goBack">
          <i class="iconfont icon-fanhui"></i>返回</h3>
      </div>
    </div>

    <div class="content">
      <div class="online-panel">
        <h3>线上版本</h3>
        <div>
          <p><span>版本号</span><span>1</span></p>
          <p><span>发布者</span><span>1</span></p>
        </div>
        <div>
          <p><span>发布时间</span><span>1</span></p>
          <p><span>描述</span><span>1</span></p>
        </div>
      </div>

      <div class="verify-panel">
        <h3>审核版本</h3>
        <div>
          <p><span>版本号</span><span>1</span>
            <i style="background-color:#FFBD4A;">审核中</i>
            <i style="background-color:#6CDDC7;">审核通过</i>
            <i style="background-color:#FF6767;">审核失败</i>
          </p>
          <p><span>发布者</span><span>1</span></p>
        </div>
        <div>
          <p><span>提交时间</span><span>1</span></p>
        </div>
        <div>
          <p><span>失败原因</span><span>看大佛个奇偶</span></p>
        </div>
      </div>
    </div>
  </div> -->
</template>

<script>
import ManageTpl from "components/shopindex/template/ManageTpl";

export default {
  name: "AuthSmallProgramCode",
  components: {
    ManageTpl
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/varibles';

.code-manage
  width 100%
  .topbar
    div
      flex()
      color $color-text-l
      i
        display inline-block
        margin-right .04rem
    h3
      font-size 20px
      cursor pointer
  .content
    min-height 6rem
    background-color #ffffff
    padding .2rem
    box-sizing border-box
    .online-panel, .verify-panel
      padding .2rem
      box-sizing border-box
      margin-bottom .4rem
      background-color #fafafa
      h3 
        font-size 18px
        margin-bottom .3rem
      >div  
        display flex
        flex-flow wrap nowrap
        align-items center
        margin .3rem 0
        p
          display inline-block
          width 50%
          span
            &:first-child 
              display inline-block
              width .9rem
              color #4a4a4a
            &:last-child 
              color #9b9b9b
          i 
            display inline-block
            padding 4px 6px
            margin-left .3rem
            color #ffffff
            border-radius 3px
</style>
