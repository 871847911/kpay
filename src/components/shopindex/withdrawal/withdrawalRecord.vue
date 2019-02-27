<template>
    <div class="inner_box withdrawal">
        <div class="bottom-header layout-head">
          <span>提现记录</span>
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

        <div class="content">
            <div class="list_content list">
            <div class="list-table list-thead-gray">
                <el-table
                    :data="templateList"
                    stripe
                    style="width: 100%"
                   >
                    <el-table-column
                        align="center"
                        prop="finishTime"
                        label="提现完成时间"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="amount"
                        label="提现金额"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="bankName"
                        label="入账账户"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="surplusAmount"
                        label="剩余可提现"
                        min-width="150">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          class="table-edit-btn"
                          @click="handleEdit(scope.row.id)">详情</el-button>
                      </template>
                    </el-table-column>
                </el-table>
            </div>

            <el-dialog :title= "titleData" :visible.sync="dialogFormVisible" :show-close="true" width="840px">
                <div class="row_box">
                    <div class="child_box">
                        <div class="record_left flex_cloumn">
                            <span>流水号</span>
                            <span>{{transferDetail.withdrawId}}</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>提现金额</span>
                            <span>{{transferDetail.amount}}</span>
                        </div>
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>提现时间</span>
                            <span>{{transferDetail.createTime}}</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>剩余可提现</span>
                            <span>{{transferDetail.surplusAmount}}</span>
                        </div>
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>完成时间</span>
                            <span>{{transferDetail.finishTime}}</span>
                        </div>
                    </div>
                    <div class="title" style = "margin-bottom:20px;">
                        转账账户
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>姓名</span>
                            <span>{{transferDetail.userName}}</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>卡号</span>
                            <span>{{transferDetail.cardNumber}}</span>
                        </div>
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>银行</span>
                            <span>{{transferDetail.bankName}}</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>开户行</span>`
                            <span>{{transferDetail.openBankName}}</span>
                        </div>
                    </div>
                </div>
            </el-dialog>
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
</template>

<script>
import api from 'fetch/api'
export default {
  name: 'WithdrawalRecord',
  data () {
    return {
      titleData: '记录详情',
      templateList: [],
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 1, // 列表数据总条数
      dialogFormVisible: false,
      date: [], // 日期
      startTime: '', // 开始时间
      endTime: '', // 结束时间
      transferDetail: {}// 转账详情
    }
  },
  created () {
    this.getWithdrawalApplyList()
  },
  methods: {
    getWithdrawalApplyList() {
      let parameter = {
        startTime: this.startTime,
        withdrawType: 2,
        endTime: this.endTime,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      api.getWithdrawalApplyList(parameter).then(res => {
        if (res.data) {
          this.templateList = res.data.list
        }
      })
    },
    // 日期改变调用
    changeDate() {
      this.startTime = this.date[0]
      this.endTime = this.date[1]
      this.getWithdrawalApplyList()
    },
    handleEdit (numberId) {
      api.getWithdrawalApplyListDetail({id: numberId}).then(res => {
        if (res.data) {
          this.transferDetail = res.data
          this.dialogFormVisible = true
        }
      })
    },
    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      this.getWithdrawalApplyList()
    },
    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      this.getWithdrawalApplyList()
    }
  }
}
</script>

<style lang="stylus" scoped>
.flex_cloumn
    display flex
    flex-direction row
    justify-content space-between
.inner_box
    width 100%
    padding 0
    box-sizing border-box
    .bottom-header
       .arrow
         font-size 9px
         position absolute
         top 5px
         right 22px
         color #9B9B9B
    .mt20
        margin-top 20px
    .head
        height 0.28rem
        font-size 0.2rem
        font-weight 400
        color rgba(155,155,155,1)
        line-height 0.28rem
        margin-bottom 0.16rem
    .content
        background-color #ffffff
        padding 20px
        width 100%
    .pagination
        margin-top 0.2rem
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
</style>
<style>
  .withdrawal .bottom-header .el-date-editor.el-input,.withdrawal .el-date-editor.el-input__inner,.withdrawal .bottom-header .el-date-editor .el-range-separator{
    height: 20px;
    line-height: 20px;
    border: none;
    background: none;
  }
  .withdrawal .bottom-header .el-range-editor .el-range-input{
    background: none;
    width:23%;
    color:rgba(155,155,155,1);
  }
  .withdrawal .el-icon-date:before{
    position: relative;
    top:-8px;
  }
  .withdrawal .bottom-header .el-date-editor .el-range-separator{
    padding: 0px;
    width: 2%;
  }
  .withdrawal .bottom-header .el-date-editor.el-input,.withdrawal .el-date-editor.el-input__inner,.withdrawal .bottom-header .el-date-editor .el-range-separator{
    display:flex;
    justify-content: flex-end;
    color:rgba(155,155,155,1);
  }
</style>
