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
              label="月份"
              width="150">
          </el-table-column>
          <el-table-column
              align="center"
              label="当月储存空间量"
              min-width="150">
              <template slot-scope="scope">
                {{scope.row.storageSpace}}GB
              </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="免费赠送存储空间量"
              min-width="150">
              <template slot-scope="scope">
                {{scope.row.freeSpace}}GB
              </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="当月计费储存量"
              min-width="150">
              <template slot-scope="scope">
                 {{scope.row.paySpace}}GB
              </template>
          </el-table-column>
          <el-table-column
              align="center"
              label="消费金额"
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
  name: "StorageSpace",
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
