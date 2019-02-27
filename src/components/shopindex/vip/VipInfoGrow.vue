<template>
  <div class="vip-grow-rules">
    <div class="topbar layout-head">
      <h3>成长值明细</h3>
      <div>
        <h3 @click="goback">
          <i class="iconfont icon-fanhui"></i>
          返回
        </h3>
      </div>
    </div>

    <div class="contain">
        <div class="info-box">
          <div class="info-head">
            <div :style="{backgroundImage:`url(${userData.headUrl})`}"></div>
            <div>
              <p class="name">{{userData.nickName}}<span>lv{{userData.level}}</span></p>
              <p class="grow">成长值{{userData.grow}}</p>
              <el-progress :text-inside="true" :percentage="userData.percent" class="pg" :show-text="false"></el-progress>
            </div>
          </div>

          <div class="info-body">
              <div>
                <!-- <p>用户姓名<span>{{userData.realName}}</span></p> -->
                <p style="margin-bottom:0;">会员等级<span>{{userData.level}}</span></p>
              </div>
              <div>
                <p>成长值<span>{{userData.grow}}</span></p>
                <p>距下一级<span>{{userData.gap}}</span></p>
              </div>
          </div>  
        </div>

        <div class="list">
            <div class="list-table list-thead-gray">
                <el-table
                    :data="listData"
                    stripe
                    :row-style="headRowHeight"
                    :header-cell-style="getRowClass"
                    style="width: 100%">
                    <el-table-column
                        label="成长值"
                        align="center"
                        width="150">
                        <template slot-scope="scope">
                            <span class="grow-new">
                              <i v-if="scope.$index === 0" class="iconfont icon-chengchangzhi- light"></i>
                              {{scope.row.growNew}}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createDate"
                        label="时间"
                        align="center"
                        min-width="150">
                    </el-table-column>
                    <el-table-column
                        label="成长值来源"
                        align="center"
                        min-width="150">
                        <template slot-scope="scope">
                            <i v-if="scope.row.type === 32 || scope.row.type === 33" class="iconfont icon-neironggoumai-"></i>
                            <i v-else class="iconfont icon-huiyuanrenwu-"></i>
                            <span>{{scope.row.remark}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        label="成长值变化"
                        align="center"
                        min-width="170">
                        <template slot-scope="scope">
                            <span>+{{scope.row.growChange}}</span>
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
        </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import api from 'fetch/api'

export default {
  name: 'VipInfoGrow',
  data () {
    return {
     headRowHeight:{"height":"88px"},
     userData:{}, //用户数据 
     listData:[], //明细列表数据
     currentPage: 1, // 查询的是第几页
     pageSize: 10, // 每页条数
     total: 0, // 列表数据总条数
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  created(){
    this.initUserInfo()
    this.initGrowList()
  },
  methods:{
    // 初始化用户数据
    initUserInfo(){

      api.getUserMainInfo({
        userId: this.$route.query.id
      }).then(res => {
        if(res.data){
          res.data.gap = Math.abs(res.data.gap)

          const totalGap = res.data.gap + parseInt(res.data.grow)
          res.data.percent = res.data.grow / totalGap * 100

          this.userData = res.data
        }
      })
    },

    // 初始化列表数据
    initGrowList(){
      api.findStoreVipGrowRecord({
        userId: this.$route.query.id,
        page: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if(res.data){
          this.listData = res.data.list
          this.total = res.data.total
        }
      })
    },

    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      this.initGrowList()
    },

    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      this.initGrowList()
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
    },

    // 回退
    goback(){
      this.$router.back()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.vip-grow-rules
  width 100%
  box-sizing border-box
  .form-item-width
    width 2.6rem
  .topbar
    div
      flex()
      color $color-text-l
    h3
      font-size 20px
      cursor pointer
    p
      cursor pointer
    a 
      color $color-text-l
  .contain
    .list
      width 100%
      margin 0.2rem auto .33rem auto
      overflow-x hidden
      overflow-y auto
      border-radius .05rem
      background #fff
      padding 0 .2rem
      box-sizing border-box
      .list-table
        width 100%
        margin .2rem auto .3rem
        .grow-new
          position relative
        .icon-chengchangzhi-
          position absolute
          font-size 1px
          left -.18rem
        .icon-neironggoumai-, .icon-huiyuanrenwu-
          font-size 30px
          vertical-align middle
          margin-right .02rem
        .icon-neironggoumai-
          color #F5A623
        .icon-huiyuanrenwu-
          color #6CDDC7
      .pagination
        display flex
        justify-content flex-end
        align-items center
        padding-right .2rem
        margin-bottom .27rem
      .light
        color $color-theme
    .info-box
      background-color #ffffff
      width 100%
      min-height 1.52rem
      padding .3rem .6rem
      box-sizing border-box
      flex()
      flex-flow row nowrap
      justify-content flex-start
      align-items center
      .info-head
        flex()
        flex-flow row nowrap
        justify-content flex-start
        align-items center
        margin-right .8rem
        div
          &:first-child
            width .8rem
            height .8rem
            border-radius 50%
            background-position center
            background-repeat no-repeat
            background-size cover
            margin-right .34rem
          &:last-child
            flex()
            flex-flow column wrap
            justify-content center
            align-items flex-start
            font-size 14px 
            .name   
              color #4A4A4A
              line-height .3rem
              span 
                display inline-block
                background-color #6CDDC7
                color #ffffff
                border-radius .04rem
                width .3rem
                height .18rem
                margin-left .1rem
                font-size 12px
                text-align center
                line-height .18rem
            .grow
              color #9B9B9B
              line-height .2rem
            .pg
              margin 0
              width 1.52rem
      .info-body
        padding-left .8rem
        position relative
        &::after
          content ""
          width .02rem
          height .8rem
          background-color #E6E6E6
          position absolute
          left 0
          top -.1.2rem
        flex()
        align-items flex-start!important
        flex-flow row nowrap
        justify-content flex-start
        div
          flex()
          flex-flow column wrap
          justify-content center
          align-items flex-start
          font-size 14px
          &:first-child
              margin-right 1.26rem              
          p
            color rgba(155,155,155,1)
            &:first-child
              margin-bottom .2rem
          span 
            color rgba(74,74,74,1)
            margin-left .2rem
</style>
