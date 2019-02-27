<template>
  <div style="width:100%;">
    <div v-if="isActive == 4">
      <div class="layout-head">
        <h2>第三方课程</h2>
      </div>
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
        <CourseListComponent v-if="activeIdx === 0"></CourseListComponent>
        <CourseAuditComponent v-if="activeIdx === 1"></CourseAuditComponent>
      </div>
    </div>
    <no-active v-if="isActive == 3"></no-active>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import NoActive from 'components/common/NoActive'
import CourseListComponent from './CourseListComponent'
import CourseAuditComponent from './CourseAuditComponent'
export default {
  name: 'CourseList',
  data(){
    return {
      activeIdx: 0,
      actionNames: ['课程列表', '课程审核'],
    }
  },

  created(){
    const routeState = this.$route.query.idex
    if(routeState){
      this.handleTab(routeState)
    }
  },

  computed: {
    ...mapGetters([
      'isActive'
    ])
  },

  components:{
    CourseListComponent,
    CourseAuditComponent,
    NoActive
  },
  methods:{
     // 切换状态
    handleTab(index){
      this.activeIdx = index
      switch (index) {
        case 0:
          break;
        case 1:
          break;
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
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
