<template>
  <div style="width:100%;">
    <div class="inner_box" v-if="isActive == 4">
        <div class="layout-head">
          转账申请
        </div>
        <div>
          <el-alert
            title="请在线下转帐成功后，进行确认转账的操作"
            type="warning"
            show-icon
            >
          </el-alert>
        </div>
        <div class = "account">
          <div class = "money">
            <i class="iconfont icon-tixiancishu-"></i>
            <div>
              <span v-if="statsData.totalAmount">￥{{statsData.totalAmount}}</span>
              <span v-else>￥0.00</span>
              <span>转账申请</span>
            </div>
          </div>
          <div class = "number">
            <i class="iconfont icon-shenqingbishu-"></i>
            <div>
              <span>{{statsData.totalNum}}</span>
              <span>申请笔数(笔)</span>
            </div>
          </div>
        </div>
        <div class="list listTable">
          <div class="list_head">
            申请列表
          </div>
          <div class="list_content list">
            <div class="list-table list-thead-gray">
                <el-table
                    :data="templateList"
                    stripe
                    style="width: 100%"
                    ref="multipleTable"
                   >
                    <el-table-column
                        align="center"
                        prop="createTime"
                        label="申请时间"
                        width="160">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="amount"
                        label="转账金额"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="userName"
                        label="申请人"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="bankName"
                        label="转账账户"
                        min-width="150">
                    </el-table-column>
                     <el-table-column
                        align="center"
                        prop="cardNumber"
                        label="卡号"
                        min-width="150">
                    </el-table-column>
                    <el-table-column label="操作" align="center">
                      <template slot-scope="scope">
                        <el-button
                          size="mini"
                          @click="handleEdit(scope.row.id)">确认转账</el-button>
                      </template>
                    </el-table-column>
                </el-table>
            </div>
            <el-dialog :visible.sync="dialogFormVisible" :show-close="true" width="650px">
              <div class="flex_clomun">
                <i class="iconfont icon-zaiciqueren tubiao"></i>
                <p class="tip">请在线下转账成功后，在进行转账操作</p>
                <p class="tip_second">确认后，对方的账户金额会发生变动</p>
                <div class="footer">
                 <button @click="cancel()">取消</button>
                 <button @click="determine()">转账完成</button>
                </div>
              </div>
            </el-dialog>
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
        statsData:{},
        formActionName:"转账申请",
        msg:'MycolumnA',
        templateList:[],
        currentPage: 1, // 查询的是第几页
        pageSize: 10, // 每页条数
        total: 1, // 列表数据总条数
        dialogFormVisible:false,
        withdrawalId:''// 提现编号
      }
    },
    computed: {
      ...mapGetters([
        'isActive'
      ])
    },
    created () {
      
    },
    mounted () {
      this.init()  
    },
    components: {
      NoActive
    },
    methods:{
      init(){
        this.getStatstransfer()
        this.getApplyList()
      },
      getStatstransfer(){ // 转账统计
        api.getStatstransfer().then(res => {
          if(res.data){
            this.statsData = res.data;
          }
        });
      },
      getApplyList(){ // 转账申请列表
        let parameter = {
          page:this.currentPage,
          pageSize:this.pageSize
        }
        api.getApplyList(parameter).then(res => {
          if(res.data){
            this.templateList = res.data.list;
          }
        });
      },
      determine(){
        api.confirmTransfer({id:this.withdrawalId}).then(res => {
          if(res.success){
            this.$message({
              message: '转账成功',
              type: 'success'
            });
            this.dialogFormVisible = false
            this.getApplyList()
          }else{
            this.$message.error('转账失败');
          }
        });
      },
      handleEdit (valueId){
        this.dialogFormVisible = true
        this.withdrawalId = valueId
      },
      cancel(){
        this.dialogFormVisible = false
        this.withdrawalId = ""
      },
      // 改变每页显示的条数重新渲染列表
      handleSizeChange(val) {
        this.pageSize = val
        this.getApplyList()
      },
      // 改变页码重新渲染列表
      handleCurrentChange(val) {
        this.currentPage = val
        this.getApplyList()
      },
    },
    filters: {
        
    },
  
}
</script>

<style lang="stylus" scoped>
.flex_clomun
  display flex
  flex-direction column
  justify-content center
  align-items center
.inner_box
  width 100%
  box-sizing border-box
  .mt20
    margin-top 20px
  .account
    width 100%
    background-color #fff
    overflow hidden
    border-radius 4px
    margin-top 20px
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
        align-items flex-start
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
        &.icon-tixiancishu-
          background-color #FE8060 
        &.icon-shenqingbishu-
          background-color #86DCE9
    .money:before
      content ""
      position absolute
      right 0
      top 50%
      height 80px
      width 2px
      background rgba(230,230,230,.45)
      margin-top -40px
  .listTable
    margin-top 40px
  .list
    width 100%
    border-radius 4px
    .list_head
      height 20px 
      font-size 14px 
      font-weight 400 
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