<template>
  <div :class='[isActive === 4 ? "order-shop" : ""]'>
      <div v-if="isActive === 4">
        <div class="layout-head">
          <h3>第三方订单</h3>
        </div>
        <div class="content">
          <el-tabs v-model="activeName" @tab-click="handleClick">
            <div class="select-bar">
              <p>订单状态：</p>
              <el-select 
                v-if="activeName === 'group'"
                v-model="onStatus" 
                placeholder="全部" 
                class="el-select-custom"
                @change="handleSelect"
                >
                <el-option
                    v-for="item in groupOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>
              <el-select 
                v-else
                v-model="onStatus" 
                placeholder="全部" 
                class="el-select-custom"
                @change="handleSelect"
                >
                <el-option
                    v-for="item in newOptions"
                    :key="item.value"
                    :label="item.label"
                    :value="item.value">
                </el-option>
              </el-select>  
            </div>

            <el-tab-pane label="普通订单" name="normal">
              <OrderList :orderList="listData" :lazy="true" @look="handleLook" />
            </el-tab-pane>
            <el-tab-pane label="分享订单" name="share">
              <OrderList :orderList="listData" :lazy="true" @look="handleLook" />
            </el-tab-pane>
            <el-tab-pane label="拼团订单" name="group">
              <OrderList :orderList="listData" :lazy="true" @look="handleLook" />
            </el-tab-pane>
            <el-tab-pane label="赠送订单" name="give">
              <OrderList :orderList="listData" :lazy="true" @look="handleLook" />
            </el-tab-pane>
            <el-tab-pane label="分销订单" name="sale">
              <OrderList :orderList="listData" :lazy="true" @look="handleLook" />
            </el-tab-pane>
          </el-tabs>

          <div class="pagination">
            <el-pagination
                background
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page.sync="currentPage"
                :page-size="pageSize"
                layout="prev, pager, next, sizes, jumper"
                :page-sizes="[5, 10, 15, 20, 25]"
                :total="total">
            </el-pagination>
          </div>
        </div>
      </div>

      <no-active v-if="isActive == 3" @reFresh="init"></no-active>
  </div>
</template>

<script>
import api from "fetch/api";
import NoActive from "components/common/NoActive";
import OrderList from "components/shopindex/order/OrderList";
import { mapGetters } from "vuex";

export default {
  name: "OrderMy",
  data() {
    return {
      listData: [],
      onStatus: '',
      activeName: "normal",
      channelType: 1,
      currentPage: 1,
      pageSize: 10,
      total: 0,
      newOptions: [{
        value: '',
        label: '全部'
      },{
        value: 1,
        label: '待支付'
      },{
        value: 2,
        label: '已支付'
      },{
        value: 3,
        label: '已失效'
      }],
      groupOptions: [{
        value: '',
        label: '全部'
      },{
        value: 1,
        label: '待支付'
      },{
        value: 2,
        label: '已支付'
      }]
    };
  },

  computed: {
    ...mapGetters([
      "isActive"
    ])
  },

  components: {
    OrderList,
    NoActive
  },

  created(){
    this.init()
  },

  methods: {
    // 初始化
    init() {
      const conf = {
        channelType: this.channelType,
        status: this.onStatus,
        isSelfSupport: false,
        page: this.currentPage,
        pageSize: this.pageSize
      }

      api.pageStoreOrder(conf).then(res => {
        if(res.data){
          this.listData = res.data.list
          this.total = res.data.total
        }
      })
    },

    // 点击tab
    handleClick(tab, event) {
      switch(tab.name){
        case 'normal':
          this.channelType = 1
          break;
        case 'share':
          this.channelType = 4
          break;
        case 'group':
          this.channelType = 3
          break;
        case 'give':
          this.channelType = 2
          break;
        case 'sale':
          this.channelType = 5
          break;
      }

      this.activeName = tab.name
      this.init()
    },

    // 状态选择
    handleSelect(e){
      this.status = e
      this.init()
    },

    // 查看
    handleLook(row) {
      const { id, channelType } = row

      this.$router.push({
        name: 'OrderShopDetail',
        query: {
          id,
          type: channelType
        }
      });
    },

    // 修改每页条数
    handleSizeChange(val) {
      this.pageSize = val
    },
    
    // 修改页面索引
    handleCurrentChange(val) {
      this.currentPage = val
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/mixins';
@import '~assets/styles/varibles';

.order-shop 
  width 100%
  .content
    width 100%
    margin 0 auto
    background-color #ffffff
    padding 0 .2rem
    box-sizing border-box
    .select-bar
      flex()
      font-size 14px
      justify-content flex-start
      margin .1rem 0 .2rem 0
    .pagination
      display flex
      justify-content flex-end
      align-items center
      padding 0 0.2rem 0.2rem 0
</style>
