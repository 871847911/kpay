<template>
  <div style="width:100%;">
    <div class="traffic-list" v-if="isActive == 4">
      <h3 class="layout-head">流量明细</h3>
      <el-alert
        v-if="alertState"
        :title="attention"
        type="warning"
        show-icon>
      </el-alert>

      <div class="list-panel">
        <el-tabs v-model="onName" @tab-click="handleTab">
          <el-tab-pane label="储存空间量" name="space">
            <DateSearch @onSearch="handleSearch" />
            <StorageSpace :list="spaceList"/>
          </el-tab-pane>

          <el-tab-pane label="外网流出量" name="flow">
            <DateSearch @onSearch="handleSearch" />
            <Outflow :list="flowList"/>
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
              :page-sizes="[5, 10, 15, 25]"
              :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
    <no-active v-if="isActive == 3" @reFresh="init"></no-active>
  </div>
</template>

<script>
import api from 'fetch/api'
import {mapGetters} from 'vuex'
import NoActive from 'components/common/NoActive'
import StorageSpace from './StorageSpace'
import Outflow from './Outflow'
import DateSearch from './DateSearch'

export default {
  name: "TrafficList",
  data(){
    return { 
      dateValue: [],
      onName: 'space',
      flowList: [],
      spaceList: [],
      attention: '',
      alertState:false,
      currentPage: 1, // 第几页
      pageSize: 10, // 每页条数
      total: 0 // 总条数
    }
  },

  computed: {
    ...mapGetters([
      'isActive',
      'imageHead'
    ])
  },

  components: {
    StorageSpace,
    Outflow,
    DateSearch,
    NoActive
  },
  created(){
    this.intemplate()
  },
  methods: {
    intemplate(){
      this.init()
      this.initSpaceList()
    },
    // 警告
    init(){
      api.getBalanceNotice().then(res => {
        if(res.data){
          const {bucketState, waringAmount} = res.data
          if(bucketState === 2){
            this.attention = `流量账户余额少于${waringAmount}元，请及时充值`
            this.alertState = true
          }else if(bucketState === 3){
            this.attention = '流量账户已欠费，请及时充值，避免影响您的正常使用'
            this.alertState = true
          }
        }
      })
    },

    // 存储
    initSpaceList(){
      const dateTime = this.isHaveDate()

      api.pageSpaceDetail({
        ...dateTime,
        page: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if(res.data){
          if(res.data.list.length > 0){
            res.data.list.forEach(item => {
              item.createTime = item.createTime.substr(0,7)
            })
          }

          this.spaceList = res.data.list
          this.total = res.data.total
        }
      })
    },

    // 外网
    initFlowList(){
      const dateTime = this.isHaveDate()

      api.pageFlowDetail({
        ...dateTime,
        page: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if(res.data){
          if(res.data.list.length > 0){
            res.data.list.forEach(item => {
              item.createTime = item.createTime.substr(0,10)
            })
          }

          this.flowList = res.data.list
          this.total = res.data.total
        }
      })
    },

    // 是否选中日期
    isHaveDate(){
      let startTime = ''
      let endTime = ''

      if(this.dateValue.length > 0){
        startTime = this.dateValue[0]
        endTime = this.dateValue[1]
      }

      return {startTime, endTime}
    },

    // 判断面板请求
    currentPanelRequest(name){
      if(name === 'space'){
        this.initSpaceList()
      }else{
        this.initFlowList()
      }
    },

    // 切换tab
    handleTab({ paneName }, evt){
      this.currentPage = 1
      this.dateValue = []
      this.currentPanelRequest(paneName)
    },

    // 查询
    handleSearch(val){
      this.dateValue = val
      this.currentPanelRequest(this.onName)
    },

    // 改变每页条数
    handleSizeChange(val) {
      this.pageSize = val
      this.currentPanelRequest(this.onName)
    },

    // 改变页码
    handleCurrentChange(val) {
      this.currentPage = val
      this.currentPanelRequest(this.onName)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/varibles';

.traffic-list
  width 100%
  .list-panel
    margin-top .1rem
    padding 0 .2rem .1rem .2rem
    background-color #ffffff
    .pagination
      display flex
      justify-content flex-end
      align-items center
      padding-right .2rem
      margin-bottom .27rem
</style>
