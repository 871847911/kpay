<template>
<div style="width:100%;">
  <div class="traffic-account" v-if="isActive == 4">
    <h3 class="layout-head">流量账户</h3>
    <el-alert
      v-if="attention"
      :title="attention"
      type="warning"
      show-icon>
    </el-alert>

    <div class="major-panel">
      <div class="left-panel">
        <div class="panel-first">
          <h2>{{flowData.moonOutFlow}}GB</h2>
          <p>本月外网流出量</p>
        </div>
        <div class="panel-last">
          <h2>{{flowData.storageSpace}}GB</h2>
          <p>本月储存空间量</p>
        </div>
      </div>
      <div class="right-panel">
        <p>流量账户余额</p>
        <h2>&#165;{{flowData.amount}}</h2>
        <button @click="handleRecharge">
          <span>流量充值</span>
          <i class="iconfont icon-jiantou"></i>
        </button>
      </div>
    </div>

    <div class="list-panel">
      <div class="list-bar">
        <label>账户流水</label>
        <div class="search-bar">
          <el-select v-model="selValue" placeholder="请选择类型" @change="handleSearch">
            <el-option
              v-for="item in selOption"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>

          <el-date-picker
            v-model="dateValue"
            type="daterange"
            value-format="yyyy-MM-dd"
            start-placeholder="开始日期"
            end-placeholder="结束日期">
          </el-date-picker>

          <el-button class="major-btn" @click="handleSearch">搜索</el-button>
        </div>
      </div>
      
      <div class="list">
        <div class="list-table list-thead-gray">
            <el-table
              stripe
              :data="list"
              style="width: 100%">
              <el-table-column
                  align="center"
                  prop="createTime"
                  label="交易时间"
                  >
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="contentName"
                  label="类型"
                  >
                  <template slot-scope="scope">
                    <span v-if="scope.row.transactionType === 1">流量充值</span>
                    <span v-else-if="scope.row.transactionType === 2">储存流量消费</span>
                    <span v-else>外网流量消费</span>
                  </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="金额"
                  >
                  <template slot-scope="scope">
                    <span v-if="scope.row.transactionType === 1" style="color:#F42C21;">+{{scope.row.amount}}元</span>
                    <span v-else style="color:#6CDDC7;">-{{scope.row.amount}}元</span>
                  </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  label="账户余额"
                  >
                  <template slot-scope="scope">
                    {{scope.row.surplusAmount}}元
                  </template>
              </el-table-column>
              <el-table-column
                  align="center" 
                label="操作" 
                width="150"
                >
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    @click="handleLook(scope.$index, scope.row)">详情</el-button>
                </template>
              </el-table-column>
          </el-table>
        </div>
      </div>  

      <div class="pagination">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, sizes, jumper"
            :page-sizes="[5, 10, 15, 25]"
            :total="total">
        </el-pagination>
      </div>
    </div>

    <el-dialog
      width="840px"
      center
      :visible.sync="dialogVis">
        <FlowDialogContent :data="dialogData" />
    </el-dialog>
  </div>
  <no-active v-if="isActive == 3" @reFresh="init"></no-active>
</div>
</template>

<script>
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
import {mapGetters} from 'vuex'
import FlowDialogContent from './FlowDialogContent'

export default {
  name: "TrafficAccount",
  data(){
    return { 
      flowData: {},
      attention: '',
      selValue: '', 
      selOption: [{
        value: '0',
        label: '全部类型'
      },{
        value: '1',
        label: '流量充值'
      },{
        value: '2',
        label: '储存流量消费'
      },{
        value: '3',
        label: '外网流量消费'
      }],
      dateValue: [],
      list: [],
      currentPage: 1, // 第几页
      pageSize: 10, // 每页条数
      total: 0, // 总条数
      dialogData: {},
      dialogVis: false
    }
  },

  computed: {
    ...mapGetters([
      'isActive',
      'imageHead'
    ])
  },

  components:{
    FlowDialogContent,
    NoActive
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      api.getBalanceNotice().then(res => {
        if(res.data){
          const {bucketState, waringAmount} = res.data

          if(bucketState === 2)
            this.attention = `流量账户余额少于${waringAmount}元，请及时充值`
          }else if(bucketState === 3){
            this.attention = '流量账户已欠费，请及时充值，避免影响您的正常使用'
          }
      })

      api.getStoreDetail().then(res => {
        if(res.data){
          this.flowData = res.data
        }
      })

      this.initList()
    },

    // 获取列表
    initList(){
      let startTime = ''
      let endTime = ''

      if(this.dateValue.length > 0){
        startTime = this.dateValue[0]
        endTime = this.dateValue[1]
      }

      api.pageAllRecord({
        transactionType: this.selValue,
        startTime,
        endTime,
        page: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if(res.data){
          if(res.data.list.length > 0){
            res.data.list.forEach(item => {
              item.createTime = item.createTime.substr(0,16)
            })
          }

          this.list = res.data.list
          this.total = res.data.total
        }
      })
    },

    //搜素
    handleSearch(){
      this.initList()
    },

    // 详情
    async handleLook(index, row){
      let resData = {}
      const {createTime ,surplusAmount, amount, transactionType, transactionId} = row

      if(transactionType === 1){
        resData = await this.getRechargeDetail(transactionId)
      }else if(transactionType === 2){
        resData = await this.getSpaceDetail(transactionId)
      }else{
        resData = await this.getFlowDetail(transactionId)
      }

      this.dialogData = {...resData, ...{
        frontAmount: amount,
        frontCreateTime: createTime,
        frontSurplusAmount: surplusAmount,
        frontTransactionType: transactionType,
      }}
      this.dialogVis = true
    },

    // 流量充值
    handleRecharge(){
      this.$router.push({
        name: 'TrafficAccountRecharge'
      })
    },

    // 改变每页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.initList()
    },

    // 改变页码
    handleCurrentChange(val) {
      this.currentPage = val
      this.initList()
    },

    // 获取外网流量详情
    async getFlowDetail(id){
      return await api.getFlowDetail({
        transactionId: id
      }).then(res => {
        return res.data
      })
    },

    // 充值流量详情
    async getRechargeDetail(id){
      return await api.getRechargeDetail({
        transactionId: id
      }).then(res => {
        return res.data
      })
    },

    // 存储流量详情
    async getSpaceDetail(id){
      return await api.getSpaceDetail({
        transactionId: id
      }).then(res => {
        return res.data
      })
    },
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/varibles';

.traffic-account
  width 100%
  .major-panel
    display flex
    flex-flow row nowrap
    height 1.92rem
    .left-panel
      height 100%
      margin-right .3rem
      flex-grow 1
      border-radius 5px
      display flex
      flex-flow row nowrap
      align-items center
      justify-content center
      >div
        position relative
        display flex
        width 50%
        height 100%
        flex-direction column
        align-items center
        justify-content center
        background-color #ffffff
        p
          color #9B9B9B
          font-size 14px
          margin-top .2rem
        h2
          font-size 30px
      .panel-first::after
        content ''
        position absolute
        right 0
        top .46rem
        width 1px
        height 1rem
        background-color #E6E6E6
    .right-panel
      width 3.5rem
      height 100%
      background-color #ffffff
      border-radius 5px
      display flex
      flex-direction column
      align-items flex-start
      justify-content space-between
      padding .3rem
      box-sizing border-box
      p
        color #9B9B9B
        font-size 14px
      h2
        font-size 30px
      button
        width 100%
        height .4rem
        line-height .4rem
        background-color $color-theme
        border-radius 4px
        color #ffffff
        font-size 14px
        text-align left 
        cursor pointer
        span 
          margin-left .2rem
        i 
          float right 
          margin-right .1rem
          transform rotate(-90deg)
  .list-panel
    margin-top .4rem
    .list-bar
      display flex
      flex-flow row nowrap
      align-items center
      justify-content space-between
      >label
        color #9B9B9B
        font-size 14px
      .search-bar
        margin-bottom .1rem
        .el-select, .el-date-editor
          width 3rem
          height 0.4rem!important
          line-height 0.4rem!important
          background #ffffff!important
    .list
      width 100%
      margin 0 auto .2rem
      overflow-x hidden
      overflow-y auto
      border-radius .05rem
      background #fff
      padding 0 .2rem
      box-sizing border-box
      .list-table
        width 100%
        margin .2rem auto .3rem
    .pagination
      display flex
      justify-content flex-end
      align-items center
      padding-right .2rem
      margin-bottom .27rem
</style>
