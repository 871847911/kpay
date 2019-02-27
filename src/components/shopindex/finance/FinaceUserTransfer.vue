<template>
    <div class="finance-detail">
      <div class="layout-head">结算明细</div>
      <div class="finace-top">
        <div class="box">
          <div class="boxicon">
            <i class="left-icon icon-kechengguanli iconfont"></i>
            <div class="right-icon">
              <span>￥{{statsData.courseAmount}}</span>
              <span>课程待结算</span>
            </div>
          </div>
          <el-button @click="getUserWaittransfer(1)">查看明细</el-button>
        </div>
        <div class="box">
          <div class="boxicon">
            <i class="left-icon icon-wodezhuanlan- iconfont"></i>
            <div class="right-icon">
              <span>￥{{statsData.specialAmount}}</span>
              <span>专栏待结算</span>
            </div>
          </div>
          <el-button @click="getUserWaittransfer(2)">查看明细</el-button>
        </div>
        <el-dialog :title= "transformtitle" :visible.sync="dialogFormTransfer" :show-close="true" width="840px">
          <div class="trasferbox">
            <el-tabs v-model="activeName" @tab-click="handleClick">
              <el-tab-pane label="课程待结算" name="first">
                <el-table
                  :data="checkDetailDate"
                  stripe
                  :row-style="headRowHeight"
                  :header-cell-style="getRowClass"
                  style="width: 100%">
                  <el-table-column
                      label="课程名称"
                      align="center"
                      prop="productName"
                      min-width="150">
                  </el-table-column>
                  <el-table-column
                      prop="waitAmount"
                      label="待结算金额"
                      align="center"
                      min-width="150">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
              <el-tab-pane label="专栏待结算" name="second">
                <el-table
                  :data="checkcolumnDetail"
                  stripe
                  :row-style="headRowHeight"
                  :header-cell-style="getRowClass"
                  style="width: 100%">
                  <el-table-column
                      label="专栏名称"
                      align="center"
                      prop="productName"
                      min-width="150">
                  </el-table-column>
                  <el-table-column
                      prop="waitAmount"
                      label="待结算金额"
                      align="center"
                      min-width="150">
                  </el-table-column>
                </el-table>
              </el-tab-pane>
            </el-tabs>
          </div>
        </el-dialog>
      </div>
      <div class="finace-bottom">
        <div class="bottom-header">
          <span style="position:absolute; width 270px;z-index:1;cursor:pointer;right:0px;top:40px;">
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
        <el-tabs type="border-card" @tab-click="changeTabState">
          <el-tab-pane label="课程">
            <div class="list">
              <div class="list-table list-thead-gray">
                  <el-table
                      :data="templateList"
                      stripe
                      :row-style="headRowHeight"
                      :header-cell-style="getRowClass"
                      style="width: 100%">
                      <el-table-column
                          label="结算时间"
                          align="center"
                          prop="createTime"
                          min-width="150">
                      </el-table-column>
                      <el-table-column
                          prop="productName"
                          label="课程名称"
                          align="center"
                          min-width="150">
                      </el-table-column>
                      <el-table-column
                          prop="amount"
                          label="结算金额"
                          align="center"
                          min-width="170">
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
                      :total="courseTotal">
                  </el-pagination>
              </div>
              <el-dialog :title= "titleData" :visible.sync="dialogFormVisible" :show-close="true" width="840px">
                  <div class = "row_box">
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>订单编号</span>
                              <span>{{listData.orderId}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>收入类型</span>
                              <span>{{listData.incomeType}}</span>
                          </div>
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>交易时间</span>
                              <span>{{listData.createTime}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>购买者</span>
                              <span>{{listData.consumer}}</span>
                          </div>
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>手机号</span>
                              <span>{{listData.consumerPhone}}</span>
                          </div>
                      </div>
                      <div class="title" style = "margin-bottom:20px;">
                          商品信息
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>商品名称</span>
                              <span>{{listData.productName}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>商品种类</span>
                              <span>{{listData.orderType}}</span>
                          </div>
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>商品来源</span>
                              <span>{{listData.goosOriange}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>作者</span>
                              <span>{{listData.contact}}</span>
                          </div>
                      </div>
                      <div class="title" style = "margin-bottom:20px;">
                          支付信息
                      </div> 
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>支付方式</span>
                              <span>{{listData.payType}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>微信支付流水号</span>
                              <span>{{listData.channelId}}</span>
                          </div>
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>订单金额</span>
                              <span>{{listData.orderAmount}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>实付金额</span>
                              <span>{{listData.payAmount}}</span>
                          </div>
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>收入金额</span>
                              <span>{{listData.amount}}</span>
                          </div>
                      </div>                     
                  </div>
              </el-dialog>
            </div>
          </el-tab-pane>
          <el-tab-pane label="专栏">
            <div class="list">
              <div class="list-table list-thead-gray">
                  <el-table
                      :data="columnList"
                      stripe
                      :row-style="headRowHeight"
                      :header-cell-style="getRowClass"
                      style="width: 100%">
                      <el-table-column
                          label="结算时间"
                          align="center"
                          prop="createTime"
                          min-width="150">
                      </el-table-column>
                      <el-table-column
                          prop="productName"
                          label="专栏名称"
                          align="center"
                          min-width="150">
                      </el-table-column>
                      <el-table-column
                          prop="amount"
                          label="结算金额"
                          align="center"
                          min-width="170">
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
                      :total="columnTotal">
                  </el-pagination>
              </div>
              <el-dialog :title= "titleData" :visible.sync="dialogFormVisible" :show-close="true" width="840px">
                  <div class = "row_box">
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>订单编号</span>
                              <span>{{listData.orderId}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>收入类型</span>
                              <span>{{listData.incomeType}}</span>
                          </div>
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>交易时间</span>
                              <span>{{listData.createTime}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>购买者</span>
                              <span>{{listData.consumer}}</span>
                          </div>
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>手机号</span>
                              <span>{{listData.consumerPhone}}</span>
                          </div>
                      </div>
                      <div class="title" style = "margin-bottom:20px;">
                          商品信息
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>商品名称</span>
                              <span>{{listData.productName}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>商品种类</span>
                              <span>{{listData.orderType}}</span>
                          </div>
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>商品来源</span>
                              <span>{{listData.goosOriange}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>作者</span>
                              <span>{{listData.contact}}</span>
                          </div>
                      </div>
                      <div class="title" style = "margin-bottom:20px;">
                          支付信息
                      </div> 
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>支付方式</span>
                              <span>{{listData.payType}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>微信支付流水号</span>
                              <span>{{listData.channelId}}</span>
                          </div>
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>订单金额</span>
                              <span>{{listData.orderAmount}}</span>
                          </div>
                          <div class="record_right flex_cloumn">
                              <span>实付金额</span>
                              <span>{{listData.payAmount}}</span>
                          </div>
                      </div>
                      <div class = "child_box">
                          <div class= "record_left flex_cloumn">
                              <span>收入金额</span>
                              <span>{{listData.amount}}</span>
                          </div>
                      </div>                     
                  </div>
              </el-dialog>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from "vuex"


export default {
  name: 'FinanceIncome',
  data () {
    return {
      activeName:'first',
      templateList: [], // 课程列表数据,
      columnList:[],// 专栏列表数据
      checkDetailDate:[],// 查看明细-课程待结算明细
      checkcolumnDetail:[],// 查看明细-专栏待结算明细
      currentPage: 0, // 查询的是第几页
      pageSize: 10, // 每页条数
      courseTotal: 0, // 课程列表数据总条数
      columnTotal:0,// 专栏列表数据总条数
      hasSettled:"课程",// 已结算列表切换状态
      date:[], // 日期
      startTime: '', // 开始时间
      endTime:'', // 结束时间
      formLabelWidth: '120px',
      headRowHeight:{"height":"88px"},
      value13:["2018-08-05","2018-08-30"],
      dialogFormVisible:false,
      dialogFormTransfer:false,
      transformtitle:'待结算明细',
      titleData:'流水详情',
      id:'',
      listData:{}, // 流水详情数据
      statsData:{} // 统计数据
    }
  },
  computed:{
    ...mapGetters([
      "userId"
    ])
  },
  created(){
    this.initTemplates(1);
    this.initTemplates(2);
    this.getUsertransferStats();
  },
  methods: {
    // 已结算列表初始化数据
    initTemplates(type) {
      let conf = {
        productType:type,
        startTime: this.startTime,
        endTime:this.endTime,
        page: this.currentPage,
        pageSize: this.pageSize
      }
      api.getUserAlreadytransfer(conf).then(res => {
        if(res.data){
          if(type==1){
            this.templateList = res.data.list
            this.courseTotal = res.data.total
          }else{
            this.columnList=res.data.list
            this.columnTotal = res.data.total
          }
          
        }
      });
    },
    // 日期改变调用
    changeDate(){
      this.startTime = this.date[0];
      this.endTime = this.date[1];
      if(this.hasSettled=="课程"){
        this.initTemplates(1)
      }else{
        this.initTemplates(2)
      }
    },
    handleLook (valueId){ // 详情数据
      let conf = {
        id:valueId
      }
      api.getIncomeDetail(conf).then(res => {
        if(res.data){
          this.listData = res.data;
          if(res.data.incomeType == 1){
            this.listData.goosOriange = "入驻生产者发布"
          }else if(res.data.incomeType == 2){
            this.listData.goosOriange = "店铺发布"
          }
          this.dialogFormVisible = true;
        }
      });
    }, 
    getUsertransferStats(){// 结算明细统计数据
      api.getUsertransferStats().then(res => {
        if(res.data){
          this.statsData = res.data;
        }
      });
    },
    getUserWaittransfer(Type){// 查看明细待结算列表
      api.getUserWaittransfer({page:1,pageSize:999,productType:Type}).then(res => {
        if(res.data){
          if(Type==1){
            this.activeName="first"
            this.checkDetailDate=res.data.list;// 课程待结算明细
          }else if(Type==2){
            this.activeName="second"
            this.checkcolumnDetail=res.data.list// 专栏待结算明细
          };
          this.dialogFormTransfer=true
        }else{
          this.$message.error('请求数据失败');
        }
      });

    },
    handleClick(tab, event) {// 切换专栏  
      if(tab.name=="first"){
         this.getUserWaittransfer(1)
      }else{
        this.getUserWaittransfer(2)
      }
    },
    changeTabState(tab,evnet){// 已结算列表切换专栏
      this.hasSettled=tab.label
    },
    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      if(this.hasSettled=="课程"){
        this.initTemplates(1)
      }else{
        this.initTemplates(2)
      }
    },
    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      if(this.hasSettled=="课程"){
        this.initTemplates(1)
      }else{
        this.initTemplates(2)
      }
    },
    // 设置表格第一行的颜色
    getRowClass({ row, column, rowIndex, columnIndex }) {
      if (rowIndex == 0) {
        return {
          'height':'60px',
          'background':'#F9FAF9'
        }
      } else {
        return ''
      }
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
    justify-content space-between
  .finance-detail
    box-sizing border-box
    width 100%
    padding 0
    .finace-top
      background-color #ffffff
      display flex
      flex-direction row
      justify-content space-around
      >>>.el-dialog
        border-radius 4px
      >>>.el-dialog__body
        padding 0 30px 30px 30px
      .trasferbox
        width 100%
        .el-dialog__body
          display flex
          justify-content flex-start
      .box
        position relative
        flexBetween()
        padding-right 40px
        padding-left 60px
        width 33.33%
        height 140px
        .boxicon
          display flex
          flex-direction row
        .left-icon
          color #ffffff
          font-size 30px
          border-radius 50%
          display block
          width 0.6rem
          height 0.6rem
          line-height 0.6rem
          text-align center
          background-color #6CDDC7 
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
          span:nth-child(2)
            height 20px
            font-size 14px
            font-weight 400
            color rgba(155,155,155,1)
            line-height 20px
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
          background-color #FF94BC
      .box:nth-child(3)
        .left-icon
          background-color #8AB8F3
    .finace-bottom
      .el-tabs--border-card
        background none
        box-shadow none
        -webkit-box-shadow none 
        border none 
      >>>.el-tabs .el-tabs__header .el-tabs__item.is-top
        position relative
      >>>.el-tabs .el-tabs__header .el-tabs__item.is-top:nth-child(2):before
        position absolute
        height 15px
        top 50%
        left 0px
        margin-top -7.5px
        background rgba(155,155,155,.1)
        width 2px
        content:""
      >>>.el-tabs--border-card>.el-tabs__header .el-tabs__item.is-active
        border-right none
        border-left none
        background none
      >>>.el-tabs--border-card>.el-tabs__header
        background none
        border-bottom none
      >>>.el-tabs--border-card>.el-tabs__content
        padding 0
      >>>.el-tabs__item
        border none
        &:nth-child(1)
          padding-left 0
      .bottom-header
        display flex
        flex-direction row
        justify-content flex-end
        position relative
        height 20px 
        line-height 20px
        margin 0
        span:nth-child(1)
          display flex
          flex-direction row
          justify-content flex-end
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
      .list
        width 100%
        margin 0 auto
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
  .finance-detail .bottom-header .el-date-editor.el-input, 
  .finance-detail .el-date-editor.el-input__inner,
  .finance-detail .bottom-header .el-date-editor .el-range-separator{
    height: 20px;
    line-height: 20px;
    border: none;
    background: none;
  }
  .finance-detail .bottom-header .el-range-editor .el-range-input{
    background: none;
    width:23%;
    color:rgba(155,155,155,1);
  }
  .finance-detail .el-icon-date:before{
    position: relative;
    top:-8px;
  }
  .finance-detail .bottom-header .el-date-editor .el-range-separator{
    padding: 0px;
    width: 2%;
  }
  .finance-detail .bottom-header .el-date-editor.el-input, 
  .finance-detail .el-date-editor.el-input__inner, 
  .finance-detail .bottom-header .el-date-editor .el-range-separator{
    display:flex;
    justify-content: flex-end; 
    color:rgba(155,155,155,1);
  }
  .finance-detail .finace-bottom .el-dialog__title{
    font-size:18px;
    font-weight:600;
    color:rgba(74,74,74,1);
    line-height:25px;
  }
</style>

