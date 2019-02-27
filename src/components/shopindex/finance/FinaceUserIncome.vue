<template>
    <div class="finance-detail">
        <div class="layout-head">收入明细</div>
        <el-alert
                :title="statsData.rate"
                show-icon
                type="warning">
        </el-alert>
        <div class="finace-top">
            <div class="box">
                <i class="left-icon icon-benyueshouru- iconfont"></i>
                <div class="right-icon">
                    <span>￥{{statsData.dayAmount}}</span>
                    <span>今日收入</span>
                </div>
            </div>
            <div class="box">
                <i class="left-icon icon-benyueshouru- iconfont"></i>
                <div class="right-icon">
                    <span>￥{{statsData.moonAmount}}</span>
                    <span>本月收入</span>
                </div>
            </div>
            <div class="box">
                <i class="left-icon icon-leijishouru- iconfont"></i>
                <div class="right-icon">
                    <span>￥{{statsData.allAmount}}</span>
                    <span>累计收入</span>
                </div>
            </div>
        </div>
        <div class="finace-bottom">
            <div class="bottom-header">
                <span>收入流水</span>
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
                                label="交易时间"
                                align="center"
                                prop="createTime"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                prop="productName"
                                label="商品名称"
                                align="center"
                                min-width="150">
                        </el-table-column>
                        <el-table-column
                                label="商品种类"
                                align="center"
                                min-width="170">
                            <template slot-scope="scope">
                                <span>{{scope.row.orderType==1?"付费课程":"付费专栏"}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="收入类型"
                                align="center"
                                min-width="170">
                            <template slot-scope="scope">
                                <span>{{scope.row.incomeType==1?"订单收入":""}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                label="服务费率"
                                align="center"
                                min-width="170">
                            <template slot-scope="scope">
                                <span>{{scope.row.serviceRate}}%</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                                prop="amount"
                                label="金额"
                                align="center"
                                min-width="170">
                        </el-table-column>
                        <el-table-column
                                label="操作"
                                align="center">
                            <template slot-scope="scope">
                                <el-button
                                        size="mini"
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
                                <span>订单编号</span>
                                <span>{{listData.orderNumber}}</span>
                            </div>
                            <div class="record_right flex_cloumn">
                                <span>收入类型</span>
                                <span>{{listData.incomeType==1?"订单收入":''}}</span>
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
                            <div class="record_left flex_cloumn">
                                <span>商品名称</span>
                                <span>{{listData.productName}}</span>
                            </div>
                            <div class= "record_right flex_cloumn">
                                <span>手机号</span>
                                <span>{{listData.consumerPhone}}</span>
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
                templateList: [], // 列表数据
                currentPage: 0, // 查询的是第几页
                pageSize: 10, // 每页条数
                total: 1, // 列表数据总条数
                date:[], // 日期
                startTime: '', // 开始时间
                endTime:'', // 结束时间
                formLabelWidth: '120px',
                headRowHeight:{"height":"88px"},
                value13:["2018-08-05","2018-08-30"],
                dialogFormVisible:false,
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
            this.initTemplates();
            this.getUserSummary();
        },
        methods: {
            // 初始化数据
            initTemplates() {
                let conf = {
                    startTime: this.startTime,
                    endTime:this.endTime,
                    page: this.currentPage,
                    pageSize: this.pageSize
                }
                api.getUserIncomeList(conf).then(res => {
                    if(res.data){
                        this.templateList = res.data.list
                        this.total = res.data.total
                    }
                });
            },
            // 日期改变调用
            changeDate(){
                this.startTime = this.date[0];
                this.endTime = this.date[1];
                this.initTemplates()
            },
            handleLook (valueId){ // 详情数据
                let conf = {
                    id:valueId
                }
                api.getUserIncomeDetail(conf).then(res => {
                    if(res.data){
                        this.listData = res.data;
                        this.dialogFormVisible = true;
                    }
                });
            },
            getUserSummary(){// 统计数据
                api.getUserSummary({userId:this.userId}).then(res => {
                    if(res.data){
                        this.statsData = res.data;
                        this.statsData.rate = "当前商户收取您的【付费课程】服务费率为" + res.data.courseServiceRate +"% ，每笔订单商户都会以此费率抽成，剩余部分将计入您的收入"
                    }
                });
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
        >>>.el-alert--warning
            color #666666
            background:rgba(255,170,0,1) rgba(255,255,255,0.9);
        >>>.el-icon-warning:before
            color #e6a23c
        .finace-top
            background-color #ffffff
            display flex
            flex-direction row
            justify-content space-around
            .box
                position relative
                display flex
                flex-direction row
                padding-left 60px
                justify-content flex-start
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
    .finance-detail .finace-bottom .bottom-header .el-date-editor.el-input,
    .finance-detail .el-date-editor.el-input__inner,
    .finance-detail .bottom-header .el-date-editor .el-range-separator{
        height: 24px;
        line-height: 24px;
        top:0;
        border: none;
        background: none;
    }
    .finance-detail .finace-bottom .bottom-header .el-range-editor .el-range-input{
        background: none;
        width: 90px;
        color:rgba(155,155,155,1);
    }
    .finance-detail .finace-bottom .el-icon-date:before{
        position: relative;
        top:-8px;
    }
    .finance-detail .finace-bottom .bottom-header .el-date-editor .el-range-separator{
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

