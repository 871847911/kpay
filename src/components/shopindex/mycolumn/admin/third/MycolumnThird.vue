<template>
    <div class="my-column-verify holder-common" id="holder-common">
        <div v-if="isActive == 4">
          <div class="topbar layout-head">
            <h3>专栏审核</h3>
          </div>

          <div class="contain">
            <div class="wrap">                
              <div class="action-bar">
                <span 
                  v-for="(item, index) in actionNames" 
                  :key="index" 
                  :class="[activeIdx === index ? 'active' : '']"
                  @click="handleTab(index)"
                  >
                  {{item}}
                </span>
              </div>

              <MycolumnThirdStore v-if="activeIdx === 0"></MycolumnThirdStore>
              <MycolumnThirdReview v-if="activeIdx === 1"></MycolumnThirdReview> 
              <MycolumnThirdContentReview v-if="activeIdx === 2"></MycolumnThirdContentReview>
            </div>
          </div>
        </div>
        <no-active v-if="isActive == 3"></no-active>
    </div>
</template>

<script>
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
import MycolumnThirdStore from 'components/shopindex/mycolumn/admin/third/MycolumnThirdStore'
import MycolumnThirdReview from 'components/shopindex/mycolumn/admin/third/MycolumnThirdReview'
import MycolumnThirdContentReview from 'components/shopindex/mycolumn/admin/third/MycolumnThirdContentReview'
import {mapGetters} from 'vuex'

const UNVERIFY = 10;
const VERIFYING = 20;
const VERIFYED = 50;

export default {
  name: 'MycolumnThird',
  data () {
    return {
      activeIdx: 0,
      actionNames: ['专栏列表', '专栏审核', '内容审核'],
      currentStatus: UNVERIFY,
    }
  },

  computed: {
    ...mapGetters([
      'isActive',
      'imageHead',
    ])
  },

  created(){
    if(this.$route.query.aduio){
      this.activeIdx = parseInt(this.$route.query.aduio)
    }
   
  },

  components: {
    NoActive,
    MycolumnThirdStore,
    MycolumnThirdReview,
    MycolumnThirdContentReview
  },

  methods: {
    // 切换状态
    handleTab(index){
      this.activeIdx = index

      switch (index) {
        case 0:
          this.currentStatus = UNVERIFY
          break;
        case 1:
          this.currentStatus = VERIFYING
          break;
        case 2:
          this.currentStatus = VERIFYED
          break;
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
.no-data
  margin-top 1rem
.el-table td, .el-table th.is-leaf
  text-align center
.el-form-item-center
  display flex
  justify-content center
  margin 40px 0 30px 0
.my-column-verify, .holder-common
  width 100%
  padding 0
  box-sizing border-box
  .topbar
      div
        flex()
        color $color-text-l
        a
          flex()
          align-items center
        i 
          font-size 18px
          display inline-block
          margin-right .04rem
          float left
      h3
        font-size 20px
        margin-right .2rem
        cursor pointer
      p
        cursor pointer
      a 
        color $color-text-l
  .contain
    .wrap
      background-color #ffffff
    .action-bar
      font-size 14px
      color #666666
      margin .1rem .2rem .2rem .2rem
      border-bottom 1px solid #E6E6E6
      box-sizing border-box
      span
        display inline-block
        margin-right .46rem
        line-height .5rem
        padding 0 .06rem
        cursor pointer
        &.active
          color $color-theme
          border-bottom 2px solid $color-theme
    
</style>
