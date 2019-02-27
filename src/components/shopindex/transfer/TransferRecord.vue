<template>
    <div class="transfer-record" style="width:100%;">
        <div class="inner_box"  v-if="isActive == 4">
            <div class="layout-head">
                <span>转账记录</span>
                <div class="right-header">
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
            </div>
            <div class="content">
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
                            prop="finishTime"
                            label="转账完成时间"
                            width="150">
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
                            prop="cardNumber"
                            label="入账账户"
                            min-width="150">
                        </el-table-column>
                        <el-table-column label="操作" align="center">
                        <template slot-scope="scope">
                            <el-button
                            size="mini"
                            @click="handleEdit(scope.row.id)">详情</el-button>
                        </template>
                        </el-table-column>
                    </el-table>
                </div>
                <el-dialog :title= "titleData" :visible.sync="dialogFormVisible" :show-close="true" width="840px">
                    <div class = "row_box">
                        <div class = "child_box">
                            <div class= "record_left flex_cloumn">
                                <span>流水号</span>
                                <span>{{transferDetail.withdrawId}}</span>
                            </div>
                            <div class="record_right flex_cloumn">
                                <span>提现时间</span>
                                <span>{{transferDetail.createTime}}</span>
                            </div>
                        </div>
                        <div class = "child_box">
                            <div class= "record_left flex_cloumn">
                                <span>完成时间</span>
                                <span>{{transferDetail.finishTime}}</span>
                            </div>
                            <div class="record_right flex_cloumn">
                                <span>转账金额</span>
                                <span>{{transferDetail.amount}}</span>
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
                                <span>开户行</span>
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
        <no-active v-if="isActive == 3" @reFresh="transferRecordList"></no-active>
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
                titleData:"记录详情",
                msg:'MycolumnA',
                templateList:[{"levelCode":3,"levelName":"夏敏","growRound":"123456","kahao":123456}],
                currentPage: 1, // 查询的是第几页
                pageSize: 10, // 每页条数
                total: 1, // 列表数据总条数
                dialogFormVisible:false,
                date:[],// 日期
                startTime: '', // 开始时间
                endTime:'', // 结束时间
                transferDetail:{}// 转账详情
            }
        },
        computed: {
            ...mapGetters([
            'isActive'
            ])
        },
        created () {
            this.transferRecordList();
        },
        components: {
            NoActive
        },
        mounted () {
            
        },
        methods:{
            transferRecordList(){
                let parameter = {
                    startTime: this.startTime,
                    endTime:this.endTime,
                    page:this.currentPage,
                    pageSize:this.pageSize
                }
                api.transferRecordList(parameter).then(res => {
                    if(res.data){
                        if(res.data.list.length > 0){
                            res.data.list.forEach(item => {
                                if(item.createTime){
                                    item.createTime = item.createTime.substr(0,16)
                                }
                                if(item.finishTime){
                                    item.finishTime = item.finishTime.substr(0,16)
                                }
                            })
                        }

                        this.templateList = res.data.list;
                    }
                });
            },
             // 日期改变调用
            changeDate(){
                this.startTime = this.date[0];
                this.endTime = this.date[1];
                this.transferRecordList()
            },
            handleEdit (numberId){
                api.transferRecord({id:numberId}).then(res => {
                    if(res.data){
                        this.transferDetail = res.data;
                        this.dialogFormVisible = true
                    }
                });
            },
            // 改变每页显示的条数重新渲染列表
            handleSizeChange(val) {
                this.pageSize = val
                this.transferRecordList()
            },
            // 改变页码重新渲染列表
            handleCurrentChange(val) {
                this.currentPage = val
                this.transferRecordList()
            },
        },
        filters: {
            
        }
    }
</script>

<style lang="stylus" scoped>
.flex_cloumn
    display flex
    flex-direction row
    justify-content space-between
.transfer-record .inner_box
    width 100%
    box-sizing border-box
    .right-header
       display flex
       flex-direction row
       justify-content space-between
       span:nth-child(1)
         font-size 14px
         font-weight 400
         color rgba(155,155,155,1)
         line-height 20px
         background-color transparent
       .arrow
         font-size 9px
         position absolute
         top 1px 
         right 16px
         color #9B9B9B
    .content
        background-color #ffffff
        padding 20px
        border-radius 4px
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
.transfer-record .right-header .el-date-editor.el-input,
.transfer-record .el-date-editor.el-input__inner,
.transfer-record .right-header .el-date-editor .el-range-separator{
    height: 20px;
    line-height: 20px;
    border: none;
    background: transparent;
}
.transfer-record .right-header .el-range-editor .el-range-input{
    background: none;
    width: 90px;
    color:rgba(155,155,155,1);
}
.transfer-record .el-icon-date:before{
    position: relative;
    top:-8px;
}
.transfer-record .right-header .el-date-editor .el-range-separator{
    padding: 0px;
    width: 2%;
}
.transfer-record .right-header .el-date-editor.el-input, 
.transfer-record .el-date-editor.el-input__inner, 
.transfer-record .right-header .el-date-editor .el-range-separator{
    display:flex;
    justify-content: flex-end; 
    color:rgba(155,155,155,1);
}
</style>
