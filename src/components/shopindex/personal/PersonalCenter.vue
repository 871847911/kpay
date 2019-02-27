<template>
    <div class="user-list-detail">
        <div v-if="isActive == 4">
            <div class="head layout-head">
                <span>个人资料</span>
                <span class='edit-btn' @click="toEdit">编辑</span>
            </div>
            <div class="content-one">
                <div class="one-left">
                    <img class="left-image" src="http://image.vdongchina.com/M00/19/18/ZSUkmVtPBZWEd_tzAAAAAEdnEXc248.png" v-if="!userInfo.photoUrl">
                    <img class="left-image" v-lazy="imageHead + userInfo.photoUrl" v-else>
                    <span class="left-name">{{userMain.nickName}}<i class="iconfont" v-if="userInfo.sex == 1" style="color:#2E82E5;font-weight:600;font-size:.2rem;">&#xe625;</i><i style="color:#F42C21;font-weight:600;font-size:.2rem" class="iconfont icon-nv" v-if="userInfo.sex == 2"></i></span>
                    <span class="left-grade">普通会员</span>
                    <div class="left-item">
                        <span class="item-l">用户账号：</span>
                        <span class="item-r">{{userMain.username}}</span>
                    </div>
                    <div class="left-item">
                        <span class="item-l">注册日期：</span>
                        <span class="item-r">{{userMain.createDate}}</span>
                    </div>
                    <div class="left-item">
                        <span class="item-l">手机号码：</span>
                        <span class="item-r">{{userMain.phone}}</span>
                    </div>
                    <div class="left-item">
                        <span class="item-l">所在地区：</span>
                        <span class="item-r">{{provinceCity}}</span>
                    </div>
                </div>
                <div class="one-right">
                    <div class="right-item">
                        <i class="item-l iconfont">&#xe60d;</i>
                        <div class="item-r">
                            <span class="price">¥{{userData.payAmount}}</span>
                            <span class="name">消费金额</span>
                        </div>
                    </div>
                    <div class="right-item">
                        <i class="item-l iconfont">&#xe60c;</i>
                        <div class="item-r">
                            <span class="price">{{userData.buy}}</span>
                            <span class="name">购买课程</span>
                        </div>
                    </div>
                    <div class="right-item">
                        <i class="item-l iconfont icon-liulan"></i>
                        <div class="item-r">
                            <span class="price">{{userData.browseCourse}}</span>
                            <span class="name">浏览课程</span>
                        </div>
                    </div>
                    <div class="right-item">
                        <i class="item-l iconfont icon-dingyuejiangshi"></i>
                        <div class="item-r">
                            <span class="price">{{userData.subscribe}}</span>
                            <span class="name">订阅讲师</span>
                        </div>
                    </div>
                    <div class="right-item">
                        <i class="item-l iconfont icon-huiyuanjifen-"></i>
                        <div class="item-r">
                            <span v-if="userData.score" class="price">{{userData.score}}<i class="minute">分</i></span>
                            <span v-else class="price">0<i class="day">分</i></span>
                            <span class="name">会员积分</span>
                        </div>
                    </div>
                    <div class="right-item">
                        <i class="item-l iconfont icon-chengchang-"></i>
                        <div class="item-r">
                            <span v-if="userData.grow" class="price">{{userData.grow}}<i class="day"></i></span>
                            <span v-else class="price">0<i class="day"></i></span>
                            <span class="name">成长值</span>
                        </div>
                    </div>
                </div>
            </div>
            <div class="content-two">
                <div class="two-item">
                    <span class="item-t">{{userData.publish}}</span>
                    <span class="item-b">发布课程</span>
                </div>
                <div class="two-item">
                    <span class="item-t">{{userData.sell}}</span>
                    <span class="item-b">售出课程</span>
                </div>
                <div class="two-item">
                    <span class="item-t">¥{{userData.commission}}</span>
                    <span class="item-b">获取佣金</span>
                </div>
                <div class="two-item">
                    <span class="item-t">{{userData.fans}}</span>
                    <span class="item-b">被订阅数量</span>
                </div>
            </div>
            <div class="content-three">
                <div class="list-category">
                    <el-table
                        :data="userList"
                        stripe
                        style="width: 100%">
                        <el-table-column
                            align="center"
                            prop="orderNumber"
                            label="订单编号"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="createDate"
                            label="提交时间"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="buyerName"
                            label="用户账号">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="payPrice"
                            label="订单金额">
                            <template slot-scope="scope">
                                <span>￥{{scope.row.payPrice}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="payMethod"
                            label="支付方式">
                            <template slot-scope="scope">
                                <span v-if="scope.row.payMethod == 1">在线支付</span>
                                <span v-else>/</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="phone"
                            label="订单状态">
                            <template slot-scope="scope">
                                <i class="iconfont icon-dingdan-" v-if="scope.row.status == 1" style="color:#F5A623;"></i>
                                <i class="iconfont icon-dingdan-" v-else-if="scope.row.status == 2" style="color:#1AA97B;"></i>
                                <i class="iconfont icon-dingdan-" v-else style="color:#9B9B9B;"></i>
                                <span v-if="scope.row.status == 1">待支付</span>
                                <span v-else-if="scope.row.status == 2">已支付</span>
                                <span v-else>已失效</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="handle"
                            label="操作">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="toDetail(scope.row.id)">查看</el-button>
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
        </div>
        <no-active v-if="isActive == 3" @reFresh="getBaseInfo"></no-active>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
export default {
  name: 'PersonalCenter',
  data () {
    return {
      userList: [],
      currentPage: 1,
      pageSize: 10,
      total: 0,
      id: '', // 用户详情id
      userMain: '', // 用户信息
      userInfo: '', // 用户详情
      provinceCity: '', // 省市
      userData: '' // 用户统计数据
    }
  },
  computed: {
    ...mapGetters([
      'imageHead',
      'userId',
      'isActive',
      'roleId'
    ])
  },
  created () {
    this.id = this.userId
    this.getBaseInfo()
  },
  components: {
    NoActive
  },
  methods: {
    getBaseInfo () {
      let that = this
      that.getUserInfo()
      that.getUserPayOverview()
      that.searchOrderList()
    },
    searchOrderList () {
      let that = this
      api.getOrderList({
        userId: that.id,
        page: that.currentPage,
        pageSize: that.pageSize,
        roleId: that.roleId
      }).then(res => {
        if (res.success) {
          that.userList = res.data.list
          that.total = res.data.total
        }
      })
    },
    getUserPayOverview () {
      let that = this
      api.getUserPayOverview({
        userId: that.id
      }).then(res => {
        if (res.success) {
          that.userData = res.data
        }
      })
    },
    getUserInfo() {
      let that = this
      api.getUserInfo({
        userId: that.id
      }).then(res => {
        if (res.success) {
          that.userMain = res.data
          that.userInfo = res.data.userInfo
          if (that.userInfo && that.userInfo.province && that.userInfo.city && that.userInfo.district) {
            that.provinceCity = that.userInfo.province + that.userInfo.city + that.userInfo.district
          } else {
            that.provinceCity = '-'
          }
        } else {
          that.$message.error('获取用户详情失败！')
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.searchOrderList()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.searchOrderList()
    },
    toDetail (id) {
      this.$router.push({
        name: 'OrderMyDetail',
        query: {
          id
        }
      });
    },
    toEdit () {
      this.$router.push({
        name: 'PersonalCenterEdit'
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.user-list-detail
    width 100%
    margin 0 auto
.head
    .edit-btn
        cursor pointer
        float right
        width .82rem
        border-radius .04rem
        background $color-theme
        color #fff
        fontCenter(.4rem)
        font-size 14px
.content-one
    width 100%
    height 4.6rem
    flex()
    justify-content space-between
    margin 0 auto .23rem
    .one-left
        width 33%
        height 100%
        background #fff
        border-radius .05rem
        columnFlex()
        box-sizing border-box
        padding .4rem
        .left-image
            height .99rem
            width .99rem
            border-radius 50%
        .left-name
            fontCenter(.28rem)
            font-size .2rem
            color #4A4A4A
            margin .12rem 0 .05rem
            .el-icon-circle-plus
                margin-left .05rem
        .left-grade
            fontCenter(.3rem)
            width .9rem
            background rgba(26,169,123,0.12)
            border-radius 20px
            font-size .14rem
            color $color-theme
            margin-bottom .3rem
        .left-item
            height .44rem
            border-bottom .01rem solid #E6E6E6
            display flex
            justify-content space-between
            align-items center
            box-sizing border-box
            width 100%
            .item-l,.item-r
                height .2rem
                line-height .2rem
                font-size .14rem
                color #9B9B9B
            .item-r
                color #4A4A4A
            &:nth-of-type(4)
                border 0
    .one-right
        flex-grow 1
        margin-left .2rem
        height 100%
        display flex
        flex-wrap wrap
        justify-content space-between
        align-items center
        .right-item
            width calc(50% - 0.1rem)
            height 1.4rem
            background #fff
            border-radius .05rem
            display flex
            justify-content flex-start
            align-items center
            &:nth-of-type(1),&:nth-of-type(2),&:nth-of-type(3),&:nth-of-type(4)
                margin-bottom .2rem
            .item-l
                font-size .44rem
                margin 0 .2rem 0 .48rem
                color #ef582f
            &:nth-of-type(2)
                .item-l
                    color #8561FA
            &:nth-of-type(3)
                .item-l
                    color #4A90E2
            &:nth-of-type(4)
                .item-l
                    color #F42C21
            &:nth-of-type(5)
                .item-l
                    color #F5A623
            &:nth-of-type(6)
                .item-l
                    color $color-theme
            .item-r
                height 100%
                display flex
                columnFlex()
                justify-content center
                align-items flex-start
                .price
                    height .42rem
                    line-height .42rem
                    font-size .3rem
                    color #4A4A4A
                    .minute,.day
                        font-size .14rem
                        height .2rem
                        line-height .2rem
                        margin-top .12rem
                        margin-left .06rem
                .name
                    height .2rem
                    line-height .2rem
                    font-size .14rem
                    color #9B9B9B
.content-two
    height 1.4rem
    width 100%
    margin 0 auto .2rem
    background #fff
    border-radius .05rem
    box-sizing border-box
    flex()
    padding .3rem 0
    .two-item
        flex-1()
        border-right .01rem solid #E6E6E6
        columnFlex()
        .item-t
            margin .06rem 0 .11rem
            height .42rem
            line-height .42rem
            font-size .3rem
            color #4A90E2
        .item-b
            height .2rem
            line-height .2rem
            font-size .14rem
            color #9B9B9B
        &:nth-of-type(2)
            .item-t
                color #8561FA
        &:nth-of-type(3)
            .item-t
                color #EF582F
        &:nth-of-type(4)
            .item-t
                color $color-theme
.content-three
    width 100%
    margin 0 auto
    background #fff
    border-radius .05rem
    overflow-x hidden
    overflow-y auto
    .list-category
        width 100%
        padding .2rem
        box-sizing border-box
    .pagination
        display flex
        justify-content flex-end
        align-items center
        padding-right .2rem
        margin-bottom .27rem
</style>
