<template>
    <div class="shop-info">
        <div class="head-bar layout-head">
            <h2>店铺信息</h2>
            <div class="major-btn" v-show="editBtnFlag">
                <span @click="toEdit">编辑</span>
            </div>
        </div>

        <div class="head">
            <div class="left">
                <img class="shopimg" v-lazy="logoUrl" alt="">
                <h3 class="shopname">{{storeInfo.name}}</h3>
                <div class="shopstatus">
                    <span>当前状态</span>
                    <span v-if="isActive == 4" class="active">已激活</span>
                    <span v-else class="no-active">未激活</span>
                </div>
                <span class="remain-time" v-if="isActive == 4">剩余天数：{{userMain.remainDays}}天</span>
                <span class="shopactive" v-else @click="toActive">激活</span>
            </div>
            <div class="right">
                <div class="right-top">
                    <h3>用户信息</h3>
                    <ul class="content">
                        <li class="item">
                            <h4>用户账号</h4>
                            <span>{{userMain.username}}</span>
                        </li>
                        <li class="item">
                            <h4>用户昵称</h4>
                            <span>{{userMain.nickName}}</span>
                        </li>
                        <li class="item">
                        </li>
                    </ul>
                </div>
                <div class="right-middle">
                    <h3>个人信息</h3>
                    <ul class="content">
                        <li class="item">
                            <h4>联系人</h4>
                            <span>{{userInfo.contact}}</span>
                        </li>
                        <li class="item">
                            <h4>手机号码</h4>
                            <span>{{userMain.phone}}</span>
                        </li>
                        <li class="item">
                            <h4>所在地区</h4>
                            <span>{{provinceCity}}</span>
                        </li>
                    </ul>
                </div>
                <div class="right-bottom">
                    <h3>店铺信息</h3>
                    <ul class="content">
                        <li class="item">
                            <h4>激活时间</h4>
                            <span v-if="userMain.enableDate">{{userMain.enableDate}}</span>
                            <span v-else>-</span>
                        </li>
                        <li class="item">
                            <h4>到期时间</h4>
                            <span v-if="userMain.endDate">{{userMain.endDate}}</span>
                            <span v-else>-</span>
                        </li>
                        <li class="item">
                            <h4>客服电话</h4>
                            <span v-if="storeInfo.customerPhone">{{storeInfo.customerPhone}}</span>
                            <span v-else>-</span>
                        </li>
                    </ul>
                </div>
            </div>
        </div>
        <div class="middle-desc">
            <div class="left">
                <h3>店铺简介</h3>
                <p>{{storeInfo.information}}</p>
            </div>
            <div class="right">
                <h3>详细地址</h3>
                <p>{{userInfo.address}}</p>
            </div>
        </div>
        <div class="teacher-list" v-if="roleId == 1">
            <h3>讲师列表</h3>
            <div class="list-active" v-if="isActive == 4">
                <el-table
                    :data="userList"
                    stripe
                    style="width: 100%"
                    :fit="true">
                    <el-table-column
                        align="center"
                        prop="code"
                        label="用户编号"
                        min-width="170">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="username"
                        label="用户名"
                        min-width="160">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="userInfo.courseNum"
                        label="课程数量"
                        min-width="80">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="userInfo.passDate"
                        label="入驻日期"
                        min-width="170">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        label="手机号码"
                        min-width="140">
                      <template slot-scope="scope"> 
                        {{scope.row.phone===null?scope.row.userInfo.phone:scope.row.phone}}
                      </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="userInfo.idCardNum"
                        label="身份证号码"
                        min-width="180">
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="status"
                        label="状态"
                        min-width="80">
                        <template slot-scope="scope">
                            <i class="span-normal" v-if="scope.row.status == 10"></i>
                            <i class="span-error" v-else></i>
                            <span v-if="scope.row.status == 10">正常</span>
                            <span v-else>异常</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        align="center"
                        prop="handle"
                        label="操作"
                        min-width="120">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="toDetail(scope.row.id, scope.row.roleId)">查看</el-button>
                        </template>
                    </el-table-column>
                </el-table>
            </div>
            <div class="list-no-active" v-if="isActive == 3">
                <h2>暂无相关内容，请激活后使用完整功能</h2>
                <span @click="toActive">去激活</span>
            </div>
            <div class="pagination" v-if="isActive == 4">
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
</template>
<script>
import Cookies from 'js-cookie'
import api from 'fetch/api'
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'ShopInfo',
  data () {
    return {
      storeInfo: '', // 店铺信息
      userMain: '', // 用户信息
      userInfo: '', // 用户详情
      provinceCity: '', // 省市
      userList: [], // 列表数据
      currentPage: 1, // 当前第几页
      pageSize: 5, // 每页条数
      total: 0, // 总条数
      status: '', // 获取店铺目前信息完善的程度
      logoUrl: '', // 店铺头像
      editBtnFlag: false // 如果是讲师身份则不显示编辑店铺按钮
    }
  },
  created () {
    this.getStoreInfo()
    this.searchUserlist()
  },
  computed: {
    ...mapGetters([
      'isActive',
      'imageHead',
      'roleId'
    ])
  },
  methods: {
    ...mapMutations({
      'setIsActive': 'SET_ISACTIVE'
    }),
    toDetail (id, roleId) {
      this.$router.push({
        path: '/index/shopinfouserlistdetail',
        query: {
          id: id,
          roleId: roleId
        }
      })
    },
    searchUserlist () {
      let that = this
      api.searchUserlist({
        userName: '',
        phoneNum: '',
        roleId: 2,
        page: that.currentPage,
        pageSize: that.pageSize
      }).then(res => {
        if (res.success) {
          that.userList = res.data.list
          that.total = res.data.total
        }
      })
    },
    getStoreInfo () {
      let that = this
      if (that.roleId === 1) {
        that.editBtnFlag = true
      }
      api.getShopInfo().then(res => {
        if (res.success) {
          that.storeInfo = res.data
          if (that.imageHead !== 'http:///') {
            that.logoUrl = that.imageHead + that.storeInfo.logoUrl
          } else {
            that.logoUrl = 'http://kpay.qiniu.vdongchina.com/' + that.storeInfo.logoUrl
          }
          that.userMain = res.data.userMain
          that.userInfo = res.data.userMain.userInfo
          if (that.storeInfo && that.storeInfo.province && that.storeInfo.city && that.storeInfo.area) {
            that.provinceCity = that.storeInfo.province + that.storeInfo.city + that.storeInfo.area
          } else {
            that.provinceCity = '-'
          }
        } else {
          this.$message.error('获取用户信息失败！')
        }
      }, ret => {
        that.$message.error('获取用户信息失败！')
      })
    },
    toActive () {
      let that = this
      api.activeShop().then(res => {
        if (res.success) {
          that.getBaseInfo()
        } else {
          that.$message.error('店铺激活失败！请重新激活')
        }
      })
    },
    getBaseInfo () {
      let that = this
      api.getBaseInfo().then(res => {
        if (res.success) {
          that.setIsActive(res.data.storeStatus)
          let userInfo = {
            'userId': res.data.userId,
            'roleId': res.data.roleId,
            'imageHead': 'http://' + res.data.bucketDomain + '/',
            'isActive': res.data.storeStatus,
            'storeId': res.data.storeId
          }
          Cookies.set('vdongUserInfo', userInfo, {expires: 1})
          that.getStoreInfo()
          that.searchUserlist()
        } else {
          if (res.code === 403) {
            that.$router.push({name: 'Login'})
          } else {
            that.$message.error('服务器异常！')
          }
        }
      })
    },
    toEdit () {
      this.$router.push({
        name: 'ShopInfoEdit'
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.searchUserlist()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.searchUserlist()
    }
  }
}
</script>
<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
.span-normal
  display inline-block
  width .06rem
  height .06rem
  border-radius 50%
  background-color $color-theme
  margin-right .04rem
  vertical-align middle
.span-error
  display inline-block
  width .06rem
  height .06rem
  border-radius 50%
  background-color #F52C13
  margin-right .04rem
  vertical-align middle
.shop-info
  width 100%
  margin 0 auto
.edit
  width 100%
  height .28rem
  margin 0 auto .2rem
  span
    cursor pointer
    float right
    width .65rem
    border-radius .04rem
    background $color-theme
    color #fff
    fontCenter(.28rem)
    font-size .12rem
.head
  height 4.06rem
  width 100%
  margin 0 auto
  background #fff
  border-radius .05rem
  flex()
  .left
    width 3.6rem
    height 100%
    columnFlex()
    border-right .01rem solid #E6E6E6
    .shopimg
      border-radius 50%
      display block
      height 1.35rem
      width 1.35rem
      margin .39rem 0 .3rem
    .shopname
      font-size .2rem
      fontCenter(.28rem)
      color #4A4A4A
      width 3rem
      ellipsis()
    .shopstatus
      height .2rem
      flex()
      margin .09rem 0 .4rem
      span
        fontCenter(.2rem)
        font-size .14rem
        color #4A4A4A
        &:nth-of-type(1)
          margin-right .1rem
      .active
          color $color-theme
      .no-active
          color #F5A623
    .shopactive
      width .95rem
      fontCenter(.28rem)
      color #fff
      font-size .12rem
      background $color-theme
      border-radius .04rem
      cursor pointer
    .remain-time
      padding 0 .16rem
      border-radius .12rem
      background rgba(26,169,123,0.15)
      color $color-theme
      font-size .14rem
      fontCenter(.24rem)
  .right
    flex-1()
    height 100%
    box-sizing border-box
    padding .15rem 0 .1rem
    columnFlex()
    .right-top,.right-middle,.right-bottom
      width 100%
      height 1.25rem
      border-bottom .01rem solid #E6E6E6
      box-sizing border-box
      padding 0 .2rem
      overflow hidden
      h3
        width 1rem
        color #9B9B9B
        height .2rem
        line-height .2rem
        font-size .14rem
        margin .15rem 0 .2rem
      .content
        height .5rem
        flex()
        .item
          flex-1()
          height 100%
          display flex
          flex-direction column
          justify-content center
          align-items flex-start
          h4,span
            height .2rem
            line-height .2rem
            color #4A4A4A
            font-size .14rem
          h4
            margin-bottom .1rem
          span
            color #9B9B9B
    .right-bottom
      border none
.middle-desc
  width 100%
  background #fff
  margin .3rem auto
  border-radius .05rem
  padding .18rem .2rem
  box-sizing border-box
  display flex
  justify-content center
  align-items center
  .left,.right
    width 50%
    height 1.24rem
    line-height .2rem
    font-size .14rem
    color #4A4A4A
    padding-right .2rem
    box-sizing border-box
    border-right .01rem solid #E6E6E6
    h3
      height .17rem
      line-height .17rem
      margin 0 0 .25rem
      color #9B9B9B
      font-size .12rem
    p
      height .6rem
      line-height .2rem
      font-size .14rem
      color #4A4A4A
      overflow hidden
      text-overflow ellipsis
      display -webkit-box
      -webkit-line-clamp 3
      -webkit-box-orient vertical
  .right
    flex-1()
    display block
    border none
    padding-left .2rem
    box-sizing border-box
.teacher-list
  width 100%
  min-height 4.06rem
  max-height 8rem
  background #fff
  border-radius .05rem
  margin 0 auto .3rem
  padding .18rem .2rem .37rem
  box-sizing border-box
  overflow-x hidden
  overflow-y auto
  h3
    height .17rem
    line-height .17rem
    color #9B9B9B
    font-size .12rem
    margin-bottom .16rem
  .list-no-active
    display flex
    height 3.56rem
    flex-direction column
    justify-content center
    align-items center
    margin-bottom .3rem
    h2
      fontCenter(.28rem)
      color #4A4A4A
      font-size .2rem
      margin-bottom .32rem
    span
      width .95rem
      fontCenter(.28rem)
      background $color-theme
      color #fff
      font-size .12rem
      border-radius .04rem
      cursor pointer
  .list-active
    margin-bottom .3rem
    max-height 6.55rem
  .pagination
    display flex
    justify-content flex-end
    align-items center
</style>