<template>
  <div class="cloumn-month">
    <el-popover
    placement="bottom"
    title="更新时间"
    width="260"
    trigger="focus"
    popper-class="month-popper"
    >
      <el-input slot="reference" readonly :value="inputValue" placeholder="请选择更新时间"></el-input>

      <div class="month-block">
        <ul>
          <li v-for="item of days" :key="item.id" @click="handleTime(item)">
            <span :class="{'active': item.isActive}">{{item.id}}</span>
          </li>
        </ul>
      </div>
    </el-popover>
  </div>
</template>

<script>
export default {
  name: "ColumnMonth",
  data() {
    return {
      inputValue: "",
      days: []
    };
  },
  props: {
    handleDay: {
      type: Function
    }
  },
  created(){
    for (let i = 1; i <= 31; i++) {
      this.days.push({
        id: i,
        isActive: false
      })
    }
  },
  methods: {
    handleTime(item){
      this.days[item.id - 1].isActive = !item.isActive

      this.inputValue = this.days.filter(item => {
        return item.isActive === true
      }).map(item => {
        return item.id
      }).join(',')

      this.$emit('handleDay',this.inputValue)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/mixins';
@import '~assets/styles/varibles';

.cloumn-month 
  display inline-block
.month-block 
  display flex
  ul 
    display flex
    flex-flow row wrap
    align-items center
    justify-content flex-start
    li 
      padding 6px
      box-sizing border-box
      text-align center
      cursor pointer
      span 
        width 24px
        height 24px
        line-height 24px
        color #606266
        border-radius 50%
        &:hover
          color $color-theme
        &.active
          color #ffffff
          background-color $color-theme
</style>
<style lang="stylus">
.month-popper .el-popover__title
  text-align center
  font-size 14px
  color #606266
</style>