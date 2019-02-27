<template>
  <div class="list">
    <div class="list-table list-thead-gray">
        <el-table
          stripe
          :data="list"
          style="width: 100%">
          <el-table-column
              align="center"
              prop="createTime"
              label="日期"
              width="150">
          </el-table-column>
          <el-table-column
              align="center"
              label="当日外网流出量"
              min-width="150">
              <template slot-scope="scope">
                {{scope.row.dayOutFlow}}GB
              </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="当月免费流量剩余"
              min-width="150">
              <template slot-scope="scope">
                {{scope.row.freeFlow}}GB
              </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="当日计费外网流量"
              min-width="150">
              <template slot-scope="scope">
                {{scope.row.payFlow}}GB
              </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="消费余额"
              min-width="150">
              <template slot-scope="scope">
                {{scope.row.payAmount}}元
              </template>
          </el-table-column>
      </el-table>
    </div>
  </div>  
</template>

<script>
export default {
  name: "Outflow",
  data(){
    return {}
  },
  props: {
    list: {
      type: Array,
      default: []
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/varibles';

.list
  width 100%
  margin 0 auto .2rem
  overflow-x hidden
  overflow-y auto
  border-radius .05rem
  background #fff
  box-sizing border-box
  .list-table
    width 100%
    margin .2rem auto .3rem
</style>
