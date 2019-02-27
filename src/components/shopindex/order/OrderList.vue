<template>
  <div class="order-list">
      <div class="list">
          <el-table
              stripe
              :data="orderList"
              style="width: 100%">
              <el-table-column
                  prop="orderNumber"
                  label="订单编号"
                  header-align="center"
                  align="center"
                  min-width="150">
              </el-table-column>
              <el-table-column
                  prop="createDate"
                  label="生成时间"
                  header-align="center"
                  align="center"
                  min-width="150">
              </el-table-column>
              <el-table-column
                  prop="buyerName"
                  label="用户"
                  header-align="center"
                  align="center"
                  min-width="150">
              </el-table-column>
              <el-table-column
                  prop="payPrice"
                  label="订单金额"
                  header-align="center"
                  align="center"
                  min-width="100">
                  <template slot-scope="scope">
                      <span>{{scope.row.payPrice}}元</span>
                  </template>
              </el-table-column>
              <el-table-column
                  prop="phone"
                  label="订单状态"
                  header-align="center"
                  align="center"
                  min-width="150">
                  <template slot-scope="scope">
                      <i class="iconfont icon-dingdan-" v-if="scope.row.status == 1" style="color:#F5A623;"></i>
                      <i class="iconfont icon-dingdan-" v-else-if="scope.row.status == 2" style="color:#1AA97B;"></i>
                      <i class="iconfont icon-dingdan-" v-else style="color:#9B9B9B;"></i>
                      <span v-if="scope.row.status == 1">待支付</span>
                      <span v-else-if="scope.row.status == 2">已支付</span>
                      <span v-else>已失效</span>
                  </template>
              </el-table-column>
              <el-table-column
                  prop="handle"
                  label="操作"
                  header-align="center"
                  align="center"
                  min-width="150">
                  <template slot-scope="scope">
                      <el-button size="mini" @click="$emit('look', scope.row)">查看</el-button>
                  </template>
              </el-table-column>
          </el-table>
      </div>
  </div>
</template>

<script>
export default {
  name: "OrderList",
  data() {
    return {};
  },

  props: {
    orderList: Array,
    look: Function
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/mixins';
@import '~assets/styles/varibles';

.order-list
  width 100%
  margin 0 auto 0.33rem
  overflow-x hidden
  overflow-y auto
  border-radius 0.05rem
  .list
    width 100%
    box-sizing border-box
    background #fff
</style>
