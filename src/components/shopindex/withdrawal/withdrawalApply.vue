<template>
    <div class="with-draw-apply">
      <div class="layout-head flex_cloumn">
        <span>提现申请</span>
        <el-button class="major-btn" @click="goWithdrawl">提现</el-button>
      </div>
        <el-alert
        :title="ruleDate"
        show-icon
        type="warning">
      </el-alert>
      <div class="finace-top">
        <div class="box">
          <div class="right-icon">
            <span>￥{{statsData.profit}}</span>
            <span>可提现金额</span>
          </div>
        </div>
        <div class="box">
          <div class="right-icon">
            <span>￥{{statsData.freeze}}</span>
            <span>提现冻结</span>
          </div>
        </div>
        <div class="box">
          <i class="left-icon icon-tixiancishu- iconfont"></i>
          <div class="right-icon">
            <span class="right-text">剩余提现次数</span>
            <span class="time-text">{{withdrawNum}}</span>
          </div>
        </div>
      </div>
      <div class="finace-bottom">
        <div class="bottom-header">
          <span>提现申请</span>
          <span style="position:relative;left:16px;cursor:pointer;">
            <el-date-picker
              v-model="date"
              type="daterange"
              @change="changeDate()"
              :clearable="false"
              :editable="false"
              format="yyyy-MM-dd"
              value-format="yyyy-MM-dd"
              start-placeholder="开始日期"
              end-placeholder="结束日期"
              :default-time="['00:00:00', '23:59:59']">
            </el-date-picker>
            <i class="iconfont icon-jiantou arrow"></i>
          </span>
        </div>
        <div class="list">
            <div class="list-table list-thead-gray">
                <el-table
                    :data="templateList"
                    stripe
                    :row-style="headRowHeight"
                    :header-cell-style="getRowClass"
                    style="width: 100%">
                    <el-table-column
                        label="提现时间"
                        align="center"
                        prop="createTime"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        prop="amount"
                        label="提现金额"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        label="状态"
                        align="center"
                        min-width="170">
                      <template slot-scope="scope">
                        {{scope.row.withdrawType==1?"申请中":"对方已转账"}}
                      </template>
                    </el-table-column>
                    <el-table-column
                        prop="bankName"
                        label="入账账户"
                        align="center"
                        min-width="170">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          class="table-edit-btn"
                          @click="handleLook(scope.row.id)">详情</el-button>
                      </template>
                    </el-table-column>
                </el-table>
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
            <el-dialog :title= "titleData" :visible.sync="dialogFormVisible" :show-close="true" width="840px">
                <div class = "row_box">
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>申请编号</span>
                            <span>{{listData.withdrawId}}</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>状态</span>
                            <span>{{listData.withdrawType==1?"申请中":"对方已转账"}}</span>
                        </div>
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>提现时间</span>
                            <span>{{listData.createTime}}</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>提现金额</span>
                            <span>{{listData.amount}}</span>
                        </div>
                    </div>
                     <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>完成时间</span>
                            <span>{{listData.finishTime}}</span>
                        </div>
                    </div>
                    <div class="title" style = "margin-bottom:20px;">
                        转账账户
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>姓名</span>
                            <span>{{listData.userName}}</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>卡号</span>
                            <span>{{listData.cardNumber}}</span>
                        </div>
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>银行</span>
                            <span>{{listData.bankName}}</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>开户行</span>
                            <span>{{listData.openBankName}}</span>
                        </div>
                    </div>
                </div>
            </el-dialog>
        </div>
      </div>
    </div>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from 'vuex'

export default {
  name: 'WithdrawalApply',
  data () {
    return {
      templateList: [], // 列表数据
      currentPage: 0, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 1, // 列表数据总条数
      date: [], // 日期
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      formLabelWidth: '120px',
      headRowHeight: {'height': '88px'},
      value13: ['2018-08-05', '2018-08-30'],
      dialogFormVisible: false,
      titleData: '申请详情',
      id: '',
      listData: {}, // 流水详情数据
      statsData: {}, // 统计数据
      withdrawNum: '', // 可提现次数
      ruleDate: ''
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created() {
    this.initTemplates()
    this.getUserAccountStats()
    this.withdrawalRule()// 可提现规则
  },
  methods: {
    getUserAccountStats() { // 申请提现统计数据
      api.getUserAccountStats().then(res => {
        if (res.data) {
          this.statsData = res.data
        }
      })
    },
    withdrawalRule() {
      api.withdrawalRule().then(res => {
        if (res.data) {
          this.ruleDate = '【付费课程】的结算规则为T+' + res.data.courseRule + '，用户付款' + res.data.courseRule + '天后，该笔费用结算至【可提现金额】中。每月共可提现3次，且提现金额必须大于100元。'
          this.withdrawNum = res.data.withdrawNum
        }
      })
    },
    // 生产者提现申请列表初始化数据
    initTemplates() {
      let conf = {
        withdrawType: 1,
        startTime: this.startTime,
        endTime: this.endTime,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      api.getWithdrawalApplyList(conf).then(res => {
        if (res.data) {
          this.templateList = res.data.list
          this.total = res.data.total
        }
      })
    },
    handleLook (valueId) { // 详情数据
      let conf = {
        id: valueId
      }
      api.getWithdrawalApplyListDetail(conf).then(res => {
        if (res.data) {
          this.listData = res.data
          this.dialogFormVisible = true
        }
      })
    },
    // 日期改变调用
    changeDate() {
      this.startTime = this.date[0]
      this.endTime = this.date[1]
      this.initTemplates()
    },
    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      this.initTemplates()
    },
    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      this.initTemplates()
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (Number(rowIndex) === 0) {
        return {
          'height': '60px',
          'background': '#F9FAF9'
        }
      } else {
        return ''
      }
    },

    goWithdrawl() {
      this.$router.push({
        path: '/index/withdrawalapplycash'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
.flex_cloumn
  display flex
  flex-direction row
  align-items center
  justify-content space-between
.with-draw-apply
  box-sizing border-box
  width 100%
  >>>.el-alert--warning
    color #666666
    background:rgba(255,170,0,1) rgba(255,255,255,0.9);
  >>>.el-icon-warning:before
    color #e6a23c
  .finance-head
    .el-button--success
      background-color #6CDDC7
  .finace-top
    background-color #ffffff
    display flex
    flex-direction row
    justify-content space-around
    .box
      position relative
      display flex
      flex-direction row
      justify-content center
      align-items center
      width 33.33%
      height 140px
      .left-icon
        color #ffffff
        font-size 30px
        border-radius 50%
        display block
        width 0.6rem
        height 0.6rem
        line-height 0.6rem
        text-align center
        background-color #8561FA
      .right-icon
        display flex
        flex-direction column
        justify-content flex-start
        margin-left 30px
        span:nth-child(1)
          height 42px
          font-size 30px
          font-weight 400
          color rgba(74,74,74,1)
          line-height 42px
        span.right-text
          color #9B9B9B
          font-size 14px
        span:nth-child(2)
          height 20px
          font-size 14px
          font-weight 400
          color rgba(155,155,155,1)
          line-height 20px
        span.time-text
          color #6CDDC7
          font-size 14px
    .box:before
      content ""
      position absolute
      right 0
      top 50%
      height 80px
      width 2px
      background rgba(230,230,230,.1)
      margin-top -40px
    .box:nth-child(2)
      .left-icon
        background-color #4A90E2
    .box:nth-child(3)
      .left-icon
        background-color #F5A623
  .finace-bottom
    .bottom-header
      display flex
      flex-direction row
      justify-content space-between
      height 20px
      line-height 20px
      margin 40px 0 20px 0
      span:nth-child(1)
        height:20px;
        font-size:14px;
        font-weight:400;
        color:rgba(155,155,155,1);
        line-height:20px;
      .arrow
        font-size 9px
        position absolute
        top 1px
        right 22px
        color #9B9B9B
      >>>.el-input--suffix .el-input__inner
        background none
        border none
        text-align right
      >>>.el-select
        width 130px
        font-size 14px
        color #9B9B9B
        z-index 2
        top -10px
      >>>.el-input__inner
        color rgba(155,155,155,1)
    .list
      width 100%
      margin 0 auto .33rem
      overflow-x hidden
      overflow-y auto
      border-radius .05rem
      background #fff
      padding 0 .2rem
      box-sizing border-box
      .list-table
        width 100%
        margin .2rem auto .3rem
        .head_pic
          width .4rem
          height .4rem
          display inline-block
          margin-right .05rem
      .pagination
        display flex
        justify-content flex-end
        align-items center
        padding-right .2rem
        margin-bottom .27rem
      .record_left,.record_right
        padding-bottom 5px
        width 370px
        height 20px
        line-height 20px
        border-bottom:1px solid rgba(230,230,230,.5);
        float left
      span:nth-child(1)
          height 20px
          font-size 14px
          font-weight 400
          color rgba(155,155,155,1)
          line-height 20px
      .record_left
          margin-right 40px
      .row_box
        width 100%
        overflow hidden
        .child_box
          overflow hidden
          margin-bottom 30px
        .title
          height:17px;
          font-size:12px;
          font-weight:600;
          color:rgba(74,74,74,1);
          line-height:17px;

</style>
<style>
  .with-draw-apply .bottom-header .el-date-editor.el-input,
  .with-draw-apply .el-date-editor.el-input__inner,
  .with-draw-apply .bottom-header .el-date-editor .el-range-separator{
    height: 24px;
    line-height: 24px;
    top:0;
    border: none;
    background: none;
  }
  .with-draw-apply .bottom-header .el-range-editor .el-range-input{
    background: none;
    width:23%;
    color:rgba(155,155,155,1);
  }
  .with-draw-apply .el-icon-date:before{
    position: relative;
    top:-8px;
  }
  .with-draw-apply .bottom-header .el-date-editor .el-range-separator{
    padding: 0px;
    width: 2%;
  }
  .with-draw-apply .bottom-header .el-date-editor.el-input,
  .with-draw-apply .el-date-editor.el-input__inner,
  .with-draw-apply .bottom-header .el-date-editor .el-range-separator{
    display:flex;
    justify-content: flex-end;
    color:rgba(155,155,155,1);
  }
  .with-draw-apply .finace-bottom .el-dialog__title{
    font-size:18px;
    font-weight:600;
    color:rgba(74,74,74,1);
    line-height:25px;
  }
</style>
