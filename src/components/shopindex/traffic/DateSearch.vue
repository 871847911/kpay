<template>
  <div class="list-bar">
    <div class="search-bar">
      <el-date-picker
        v-model="dateValue"
        type="daterange"
        value-format="yyyy-MM-dd"
        start-placeholder="开始日期"
        end-placeholder="结束日期">
      </el-date-picker>
      <el-button class="major-btn" @click="search">搜索</el-button>
    </div>
  </div>  
</template>

<script>
export default {
  name: "DateSearch",
  data(){
    return {
      dateValue: '',
    }
  },
  methods: {
    // 查询
    search(){
      this.$emit('onSearch', this.dateValue)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/varibles';

.list-bar
  display flex
  flex-flow row nowrap
  align-items center
  justify-content space-between
  .search-bar
    margin-bottom .1rem
    .el-date-editor
      width 3rem
</style>
