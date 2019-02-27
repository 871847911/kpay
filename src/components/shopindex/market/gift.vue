<template>
    <div class='gift'>
        <div v-if="isActive == 4">
            <div class="layout-head">
                <h3>赠送管理</h3>
            </div>
            <div class="search">
                <el-input v-model="searchValue" placeholder="商品名称" maxlength="15" @keyup.enter.native="search"></el-input>
                <el-button class="major-btn" @click="search">搜索</el-button>
            </div>
            <div class="list">
                <div class="list-category">
                    <el-table :data="tableData" stripe style="width: 100%">
                        <!-- <el-table-column align="center" prop="serial_num" label="课程编号" min-width="180"></el-table-column> -->
                        <el-table-column align="center" prop="course_name" label="课程名称" min-width="200">
                            <template slot-scope="scope">
                                <div class="course">
                                    <img :src="$store.state.imageHead + scope.row.courseUrl">
                                    <p>{{scope.row.courseName}}</p>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="original_price" label="原价" :formatter="formatPrice" min-width="80"></el-table-column>
                        <el-table-column align="center" prop="send_num" label="赠送购买数量" min-width="120"></el-table-column>
                        <el-table-column align="center" prop="get_num" label="领取数量" min-width="80"></el-table-column>
                        <el-table-column align="center" prop="send_status" label="赠送状态" min-width="220">
                            <template slot-scope="scope">
                                <el-radio-group v-if="scope.row.sendStatus == 1 || scope.row.sendStatus == 0" v-model="scope.row.sendStatus" @change="getValue(scope.row)">
                                    <el-radio-button :label="1">ON</el-radio-button>
                                    <el-radio-button :label="0">OFF</el-radio-button>
                                </el-radio-group>
                                <p v-if="scope.row.sendStatus == 2">免费商品无法开启赠送</p>
                            </template>
                        </el-table-column>
                        <el-table-column align="center" prop="zip" min-width="220" label="赠送购买次数限制">
                            <template slot-scope="scope">
                                <div class="zip_btn">
                                    <p>{{scope.row.sendStatus != 2 ? scope.row.limitNum : ''}}</p>
                                    <img v-if="scope.row.sendStatus != 2" src="../../../assets/image/change_gift.png" @click="changeGiftRule(scope.row)" alt="">
                                    <img v-if="scope.row.sendStatus == 2" src="../../../assets/image/change_gift_gray.png" alt="">
                                </div>
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
                        :page-sizes="[5, 10, 15, 20, 25]"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
            <el-dialog title="设置赠送购买次数" :visible.sync="setGiftRule" width="560px" center>
                <p>为防止恶意转售，请设置赠送购买次数限制，最多可设定为10次</p>
                <el-input-number v-model="inputNum" :min="1" :max="10" label="描述文字"></el-input-number>
                <span slot="footer" class="dialog-footer">
                    <el-button type="primary" class="main_btn_bg suer_bth" @click="savaGiftRule">确 定</el-button>
                </span>
            </el-dialog>
        </div>

        <no-active v-if="isActive == 3" @reFresh="queryGiftRules"></no-active>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'

export default {
    name: 'gift',
    data () {
        return {
            searchValue: '',
            currentPage: 1,
            pageSize: 5,
            total: 10,
            tableData: [],
            setGiftRule: false,
            inputNum: '',
            item: ''
        }
    },
    computed: {
        ...mapGetters(['userId', 'storeId','isActive'])
    },
    components: {
        NoActive
    },
    created() {
        this.queryGiftRules();
        console.log(this.$store.state.imageHead);

    },
    methods: {
        search() {
            this.queryGiftRules()
        },
        queryGiftRules() {
            let that = this
            api.queryGiftRules({
                courseName: that.searchValue,
                storeId: that.storeId,
                pageNum: that.currentPage,
                pageSize: that.pageSize,
            }).then(res => {
                if(res.success == true) {
                    that.tableData = res.data.list
                    that.total = res.data.total
                }
            })
        },
        savaGiftRule() {
            let that = this
            api.savaGiftRule({
                courseId: this.item.id,
                ruleId: this.item.ruleId ? this.item.ruleId : -1,
                limitNum: this.inputNum,
                sendStatus: this.item.sendStatus,
                userId: this.userId
            }).then(res => {
                if(res.success == true) {
                    that.queryGiftRules()
                    that.setGiftRule = false;
                    that.$message({message: '修改成功', type: 'success'});
                }else{
                    that.$message.error('修改失败');
                }
            })
        },
        handleSizeChange(val) {
            this.pageSize = val
            this.queryGiftRules()
        },
        handleCurrentChange(val) {
            this.currentPage = val
            this.queryGiftRules()
        },
        getValue(scope) {
            let that = this
            api.savaGiftRule({
                courseId: scope.id,
                ruleId: scope.ruleId ? scope.ruleId : -1,
                limitNum: scope.limitNum,
                sendStatus: scope.sendStatus,
                userId: that.userId
            }).then(res => {
                if(res.success == true) {
                    that.queryGiftRules()
                    that.setGiftRule = false;
                    that.$message({message: '修改成功', type: 'success'});
                }else{
                    that.$message.error('修改失败');
                }
            })
        },
        formatPrice(val) {
            if(val.originalPrice == 0.00){
                return '免费'
            }else{
                return '￥' + val.originalPrice
            }
        },
        changeGiftRule(scope) {
            this.item = scope
            this.setGiftRule = true
            this.inputNum = scope.limitNum
        },
        formatStatus(val) {
            switch(val.sendStatus) {
                case 0:
                    return '不可被赠送'
                    break;
                case 1:
                    return '可被赠送'
                    break;
                case 2:
                    return '免费课程'
                    break;
                case 3:
                    return '已经下架'
                    break;
            }
        }
    }
}
</script>

<style lang="stylus" scoped>
    .gift
        width 100%
        height 100%
        box-sizing border-box
        font-size 12px
        overflow-y scroll
        .search
            margin-bottom 20px
            .el-input
                width 300px
    .list
        width 100%
        margin 0 auto .33rem
        overflow-x hidden
        overflow-y auto
        border-radius .05rem
        background #fff
        box-sizing border-box
        .list-category
            width 100%
            padding .2rem
            box-sizing border-box
            .el-table
                .course
                    display flex
                    img
                        width 60px
                        height 60px
                    p
                        line-height 60px
                        white-space nowrap
                        overflow hidden
                        text-overflow ellipsis
                        text-indent 10px
                .zip_btn
                    display flex
                    justify-content center
                    img
                        width 20px
                        height 20px
                        cursor pointer
                    p
                        margin-right 15px
        .pagination
            display flex
            justify-content flex-end
            align-items center
            padding-right .2rem
            margin-bottom .27rem
    .el-dialog__header
        text-align left
        color rgba(74,74,74,1)
        font-size 18px
        line-height 25px
        margin-bottom 20px
        font-weight 600
    .el-dialog__body
        /*display flex*/
        /*flex-direction column*/
        align-items center
        flex-direction column
        color rgba(74,74,74,1)
        p
            line-height 22px
            font-size 14px
            color rgba(74,74,74,1)
        .el-input-number
            margin-top 20px
    .suer_bth
        width 120px
        color: #fff
</style>
