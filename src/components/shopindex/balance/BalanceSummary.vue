<template>
  <div style="width:100%;">
    <div class="inner_box" v-if="isActive == 4">
        <div class="layout-head">
          结算汇总
        </div>
        <div class="account">
          <div class="money">
            <i class="iconfont icon-jiaoyijine"></i>
            <div>
              <span>￥{{statsData.waitAmount}}</span>
              <span>待结算</span>
            </div>
          </div>
          <div class="number">
            <i class="iconfont icon-leijiyijiesuan-"></i>
            <div>
              <span>￥{{statsData.settlementAmount}}</span>
              <span>累计已结算</span>
            </div>
          </div>
        </div>
        <div class="list">
          <div class="list_head">
            结算列表
          </div>
          <div class="list_content">
            <div class="list-table list-thead-gray">
                <el-table
                    :data="templateList"
                    stripe
                    style="width: 100%"
                    ref="multipleTable"
                   >
                    <el-table-column
                        align="center"
                        prop="contact"
                        label="入驻生产者"
                        width="150">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="totalAmount"
                        label="累计交易额"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="waitAmount"
                        label="待结算"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="settlementAmount"
                        label="累计已结算"
                        min-width="150">
                    </el-table-column>
                     <el-table-column
                        align="center"
                        label="付费课程费率"
                        min-width="150">
                        <template slot-scope="scope">
                          <span v-if="scope.row.courseServiceRate">{{scope.row.courseServiceRate}}%</span>
                          <span v-else>-</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center" 
                        label="操作"
                        min-width="150">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          class="detail"
                          @click="handleEdit(scope.row.userId)">详情</el-button>
                        <el-button
                          size="mini"
                          @click="handleSettlement(scope.row.userId,scope.row)">专栏结算</el-button>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
             <el-dialog :title= "titleData" :visible.sync="dialogDetailVisible" :show-close="true" width="840px">
                <div class = "row_box">
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>入驻生产者</span>
                            <span>{{detailData.contact}}</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>入住时间</span>
                            <span>{{detailData.createDate}}</span>
                        </div>
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>发布中的课程</span>
                            <span>{{detailData.courseNum}}个</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>售出的课程</span>
                            <span>{{detailData.courseSaleNum}}份</span>
                        </div>
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>发布中的专栏</span>
                            <span>{{detailData.columnNum}}个</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>订阅人数</span>
                            <span>{{detailData.columnSaleNum}}人</span>
                        </div>
                    </div>
                    <div class="settlement" style = "margin-bottom:20px;">
                        结算统计
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>累计交易额</span>
                            <span>￥{{detailData.totalAmount}}</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>待结算</span>
                            <span>￥{{detailData.waitAmount}}</span>
                        </div>
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>累计结算</span>
                            <span>￥{{detailData.settlementAmount}}</span>
                        </div>
                    </div>
                    <div class="settlement" style = "margin-bottom:20px;">
                        结算规划
                    </div>
                    <div class = "child_box">
                        <div class= "record_left flex_cloumn">
                            <span>付费课程费率</span>
                            <span>{{detailData.courseServiceRate}}%</span>
                        </div>
                        <div class="record_right flex_cloumn">
                            <span>付费专栏费率</span>
                            <span>{{detailData.specialServiceRate}}%</span>
                        </div>
                    </div>
                    
                </div>
            </el-dialog>
            <el-dialog :visible.sync="dialogFormVisible" :title="settlementTitle" :show-close="true" width="650px">
              <div class="settle">
                <el-form :model="rulesForm" ref="rulesForm" label-position="top">
                  <el-form-item label="生产者" prop="contact">
                    <el-input type="text" v-model="rulesForm.contact" auto-complete="off" :disabled="true"></el-input>
                  </el-form-item>
                  <el-form-item label="结算专栏" prop="productName">
                    <el-select v-model="rulesForm.id" placeholder="请选择" @change="handleSettable">
                      <el-option
                        v-for="item in options"
                        :key="item.id"
                        :label="item.productName"
                        :value="item.id">
                      </el-option>
                    </el-select>
                  </el-form-item>
                  <el-form-item label="可结算金额" prop="waitAmount">
                    <el-input type="text" v-model="rulesForm.waitAmount" auto-complete="off" :disabled="true"></el-input>
                  </el-form-item>
                  <span class="settle-tip">结算金额会转至对方【可提现账户】中</span>
                  <div class="btn-column">
                    <el-form-item class="el-form-item-center">
                      <el-button class="confirm-green" @click="settlement()">结算</el-button>
                    </el-form-item>
                  </div>
                </el-form>
              </div>
            </el-dialog>
          </div>
          <div class="pagination">
            <el-pagination
                background
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
import { mapGetters } from 'vuex'
import NoActive from 'components/common/NoActive'
export default {
    name:"MycolumnA",
    data () {
        return {
            statsData:{ // 统计数据
              waitAmount:0,
              settlementAmount:0
            },
            detailData:{},// 详情
            contact:'',
            formActionName:"转账申请",
            msg:'MycolumnA',
            templateList:[],
            currentPage: 1, // 查询的是第几页
            pageSize: 10, // 每页条数
            total: 1, // 列表数据总条数
            dialogFormVisible:false,
            dialogDetailVisible:false,
            titleData:'结算详情',
            settlementTitle:'专栏结算',
            input1:'张三',
            rulesForm:{
              contact:'',
              id:'',
              waitAmount: 0
            },
            options:[],
            value:''
        }
    },
    computed: {
      ...mapGetters([
        'isActive'
      ]) 
    },
    created () {
      this.init()
    },
    components: {
      NoActive
    },
    methods:{
      init(){
        this.getStatsBalance();// 统计数据
        this.getBalanceList();// 结算列表数据
      },
      getBalanceList() { // 结算列表
        // 初始化数据
        let conf = {
          page: this.currentPage,
          pageSize: this.pageSize,
          contact:''
        }
        api.getBalanceList(conf).then(res => {
          if(res.data){
            this.templateList = res.data.list
            this.total = res.data.total
          }
        });
      },
      getStatsBalance(){
        api.getStatsBalance().then(res => {
          if(res.data){
            this.statsData = res.data
          }
        })
      },
      handleEdit (valueId){// 详情
        api.getBalanceDetail({userId:valueId}).then(res => {
          if(res.data){
            this.detailData = res.data
             this.dialogDetailVisible = true
          }
        })
      },
      handleSettlement (valueId,scopeDate){// 专栏结算
        this.options = null
        this.rulesForm.id = ''
        this.rulesForm.waitAmount = 0

        api.getColumnList({userId:valueId}).then(res => {
          if(res.data){
            this.rulesForm.contact = scopeDate.contact
            this.options = res.data
            this.dialogFormVisible = true
          }
        })
      },
      handleSettable(valueId){ // 处理可结算金额
        this.rulesForm.waitAmount = this.options.filter(item => item.id === valueId)[0]['waitAmount']
      },
      settlement(){ // 点击结算按钮提交
        if(!this.rulesForm.waitAmount){
          if(this.rulesForm.waitAmount === 0){
            this.$message.info("可提现结算金额需大于0元")
          }else{
            this.$message.info("请选择需要结算的专栏")
          }
          return;
        }

        api.settlement({id:this.rulesForm.id}).then(res => {
          if(res.success){
            this.$message({
              message: '结算成功',
              type: 'success'
            });
            this.dialogFormVisible = false
            this.init()
          }else{
            this.$message.error('结算失败')
          }
        })
      }
    },
    filters: {
        
    },
   
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.flex_cloumn
    display flex
    flex-direction row
    justify-content space-between
.flex_clomun
  display flex
  flex-direction column
  justify-content center
  align-items center
.inner_box
  width 100%
  box-sizing border-box
  .account
    width 100%
    background-color :#fff;
    overflow hidden
    display flex
    flex-flow row nowrap
    align-items center
    .money, .number
      position relative
      display flex
      flex-flow row nowrap
      align-items center
      justify-content center
      width 50%
      div
        display flex
        flex-direction column
        align-items center
        justify-content center
        float left 
        height 140px
        span:nth-child(1) 
          font-size 30px
          font-weight 400 
          color rgba(74,74,74,1)
          line-height 42px 
        span:nth-child(2)
          font-size 14px
          font-weight 400
          color rgba(155,155,155,1)
          line-height 20px  
      i 
        color #ffffff
        font-size 30px
        border-radius 50%
        display block
        width 0.6rem
        height 0.6rem
        line-height 0.6rem
        text-align center
        margin-right .3rem
        &.icon-jiaoyijine
          background-color #F5A623 
        &.icon-leijiyijiesuan-
          background-color $color-theme
    .money:before
      content ""
      position absolute
      right 0
      top 50%
      height 80px
      width 2px
      background rgba(230,230,230,.45)
      margin-top -40px
  .list
    width 100%
    margin-top .4rem
    background none
    .list_head
      height 20px 
      font-size: 0.14rem;
      margin-bottom 20px
      color rgba(155,155,155,1) 
      line-height 20px 
    .list_content
      box-sizing border-box
      padding 20px
      background-color #fff
      width 100%
      height 455px
    .pagination
      margin-top 0.2rem
      display flex
      justify-content flex-end
      align-items center
      padding-right .2rem
      margin-bottom .27rem
    .tubiao
      color #FF6767  
      font-size 0.95rem 
    .tip
      margin-top 0.29rem 
      height 25px 
      font-size 18px
      font-weight 600
      color rgba(74,74,74,1)
      line-height 25px
    .tip_second
      margin-top 10px 
      height 25px 
      font-size 0.18rem
      font-weight 400
      color rgba(155,155,155,1)
      line-height 25px 
    .record_left,.record_right
        padding 5px
        width 370px
        height 20px
        line-height 20px
        border-bottom 1px solid rgba(230,230,230,.5);
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
      .settlement
        height 17px
        font-size 12px
        font-weight 600
        color rgba(74,74,74,1)
        line-height 17px
    .settle
      .settle-tip
        margin-top 10px
        height 17px
        font-size 12px
        font-weight 400
        color rgba(155,155,155,1)
        line-height 17px 
      .btn-column
        width 120px
        margin 0 auto
        margin-top 40px
.footer
  margin 37px auto
  height 40px
  button
    width 120px
    height 40px
    border-radius:4px;
    box-sizing border-box
    text-align center
  button:nth-child(1)
    background-color #ffffff
    color #9B9B9B
    margin-right 20px
    border:1px solid rgba(230,230,230,1);
  button:nth-child(2)
    background-color #6CDDC7
    color #ffffff
</style>
<style>
  .el-dialog__title{
    font-size:18px;
    font-weight:600;
    color:rgba(74,74,74,1);
    line-height:25px;
  }
  .settle .el-form-item{
    margin-bottom:10px;
  }
  .settle .el-form-item,.settle .el-select{
    width: 360px;
  }
  .settle .el-form-item:nth-child(3){
    margin-bottom: 0;
  }
  .settle .el-input.is-disabled .el-input__inner{
    background:rgba(238,238,238,1);
  }         
</style>
