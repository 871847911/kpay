<template>
  <div class="mb-record-manage-grow">
    <div class="topbar layout-head">
      <h3>积分值明细</h3>
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
              <!-- <p class="grow">成长值</p>
              <el-progress :text-inside="true" :percentage="userData.percent" class="pg" :show-text="false"></el-progress> -->
            </div>
          </div>

          <div class="info-body">
              <div>
                <!-- <p>用户姓名<span>{{userData.realName}}</span></p> -->
                <p>会员等级<span>{{userData.level}}</span></p>
              </div>
              <div>
                <p>历史积分<span>{{userData.scoreOld}}</span></p>
                <p>可用积分<span>{{userData.score}}</span></p>
              </div>
          </div>  
        </div>

        <div class="list">
           <div class="search">
              <el-select class="mr-10 el-select-custom" v-model="integralValue" placeholder="积分类型">
                <el-option
                  v-for="item of integralType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select>
              <!-- <el-select class="mr-10 el-select-custom" v-model="searchRemark" placeholder="积分说明">
                <el-option
                  v-for="item of integralType"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
                </el-option>
              </el-select> -->
              <!-- <input class="mr-10" type="text" placeholder="等级名称" v-model="searchRemark"> -->
              <button class="search-btn mr-10" @click="search">搜索</button>
          </div>

            <div class="list-table list-thead-gray">
                <el-table
                    :data="listData"
                    stripe
                    :row-style="headRowHeight"
                    :header-cell-style="getRowClass"
                    style="width: 100%">
                    <el-table-column
                        label="可用积分"
                        align="center"
                        width="200">
                        <template slot-scope="scope">
                            <span class="grow-new">
                              <i v-if="scope.$index === 0" class="iconfont icon-chengchangzhi- light"></i>
                              {{scope.row.scoreNew }}
                            </span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createDate"
                        label="时间"
                        align="center"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        label="积分类型"
                        align="center"
                        width="200">
                        <template slot-scope="scope">
                          <span v-if="scope.row.type === 1" class="integral-type integral-type-in">收入</span>
                          <span v-else class="integral-type integral-type-out">支出</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="remark"
                        label="积分说明"
                        align="center"
                        width="200">
                    </el-table-column>
                    <el-table-column
                        label="积分增减"
                        align="center"
                        min-width="170">
                        <template slot-scope="scope">
                            <span>+{{scope.row.scoreChange}}</span>
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
  name: 'MbRecordManageGrow',
  data () {
    return {
     headRowHeight:{"height":"88px"},
     userData:{}, //用户数据 
     listData:[], //明细列表数据
     currentPage: 1, // 查询的是第几页
     pageSize: 10, // 每页条数
     total: 0, // 列表数据总条数
     integralType: [
      {
        value:'',
        label:'全部'
      },
      {
        value: 1,
        label: '收入'
      },{
        value: 2,
        label: '支出'
      }
     ],
     integralValue:"",
     searchRemark:""
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
      api.getScoreUserMainInfo({
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
      api.findStoreVipScoreRecord({
        userId: this.$route.query.id,
        type: this.integralValue,
        remark: this.searchRemark,
        page: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if(res.data){
          this.listData = res.data.list
          this.total = res.data.total
        }
      })
    },

    // 搜索
    search(){
      this.initGrowList()
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
>>>.el-input__inner
  border none
.mb-record-manage-grow
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
    .search
      margin-top .5rem
      flex()
      justify-content flex-start
      input
        height .4rem
        width 2.8rem
        border-radius .05rem
        background #fff
        padding-left .2rem
        font-size 14px
        color #4A4A4A
        placeholderStyle()
      .search-btn
        width .7rem
        height .4rem
        background $color-theme
        border-radius 4px
        font-size 14px
        color #ffffff
        cursor pointer
    .list-table
        width 100%
        margin .2rem auto .3rem
        .grow-new
          position relative
        .icon-chengchangzhi-
          position absolute
          font-size 1px
          left -.18rem
        .integral-type
          padding .02rem .08rem
          border-radius .1rem
          font-size 12px
          color #ffffff
        .integral-type-in
          background-color #66CB64
        .integral-type-out
          background-color #6364D6
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
