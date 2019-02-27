<template>
  <div class="order-list">
      <div class="list">
          <el-table stripe :data="orderList" style="width: 100%">
              <el-table-column prop="orderNo" label="订单编号" align="center" min-width="150"></el-table-column>
              <el-table-column prop="createTime" label="生成时间" align="center" min-width="150"></el-table-column>
              <el-table-column prop="buyerWxName" label="用户" align="center" min-width="150"></el-table-column>
              <el-table-column label="订单金额" align="center" min-width="100">
                  <template slot-scope="scope">
                      <span>{{scope.row.orderAmount}}元</span>
                  </template>
              </el-table-column>
              <el-table-column prop="phone" label="订单状态" align="center" min-width="150">
                  <template slot-scope="scope">
                      <div v-if="scope.row.orderStatus == 0||scope.row.orderStatus ==5||scope.row.orderStatus ==6||scope.row.orderStatus ==7">
                          <i class="iconfont icon-zitikuicon-" style="color:#9B9B9B;"></i>
                          <span>已失效</span>
                      </div>
                      <div v-if="scope.row.orderStatus == 1||scope.row.orderStatus ==3">
                          <i class="iconfont icon-zitikuicon-" style="color:#F5A623;"></i>
                          <span>待付款</span>
                      </div>
                      <div v-if="scope.row.orderStatus == 4||scope.row.orderStatus ==8||scope.row.orderStatus ==9||scope.row.orderStatus ==10">
                          <i class="iconfont icon-zitikuicon-" style="color:#1AA97B;"></i>
                          <span>已付款</span>
                      </div>
                  </template>
              </el-table-column>
              <el-table-column prop="handle" label="操作" align="center" min-width="150">
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
