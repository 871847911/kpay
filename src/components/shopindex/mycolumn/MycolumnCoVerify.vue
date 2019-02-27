<template>
    <div class="my-column-verify holder-common">
        <div v-if="isActive == 4">
            <div class="topbar layout-head">
              <h2>内容审核</h2>
            </div>

            <div class="contain">
                <div class="wrap">                
                    <div class="action-bar">
                    <span 
                        v-for="(item, index) in actionNames" 
                        :key="index" 
                        :class="[activeIdx === index ? 'active' : '']"
                        @click="handleTab(index)"
                        >
                        {{item}}
                        </span>
                    </div>

                    <div class="list">
                      <div class="table-bar">
                        <!-- <el-dropdown>
                          <el-button type="primary">
                            标题<i class="el-icon-arrow-down el-icon--right"></i>
                          </el-button>
                          <el-dropdown-menu slot="dropdown">
                            <el-dropdown-item>标题</el-dropdown-item>
                          </el-dropdown-menu>
                        </el-dropdown> -->

                        <el-input v-model="inputValue" placeholder="请输入标题"></el-input>

                        <el-button class="confirm-green" style="width:82px;" @click="handleSearch">搜索</el-button>
                      </div>

                        <div class="list-table list-thead-gray">
                            <el-table
                                v-show="activeIdx === 0"
                                :data="list"
                                stripe
                                style="width: 100%">
                                <el-table-column
                                    align="center"
                                    type="index"
                                    label="序号"
                                    :index="indexMethod"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    prop="contentName"
                                    label="标题"
                                    width="250"
                                    class-name="clomun-left">
                                </el-table-column>
                                <el-table-column
                                    label="专栏"
                                    class-name="clomun-left">
                                    <template slot-scope="scope">
                                      <p>{{scope.row.columnName}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column align="center" label="操作" width="150">
                                  <template slot-scope="scope">
                                      <el-button
                                      size="mini"
                                      @click="handleLook(scope.$index, scope.row,1)">查看</el-button>
                                  </template>
                                </el-table-column>
                            </el-table>

                            <el-table
                                v-show="activeIdx === 1"
                                :data="list"
                                stripe
                                style="width: 100%">
                                <el-table-column
                                    align="center"
                                    type="index"
                                    label="序号"
                                    :index="indexMethod"
                                    width="150">
                                </el-table-column>
                                <el-table-column
                                    prop="contentName"
                                    label="标题"
                                    width="250"
                                    class-name="clomun-left">
                                </el-table-column>
                                <el-table-column
                                    label="专栏"
                                    class-name="clomun-left">
                                    <template slot-scope="scope">
                                      <p>{{scope.row.columnName}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    prop="auditDate"
                                    label="提交时间">
                                </el-table-column>
                                <el-table-column 
                                    align="center"
                                    label="操作" 
                                    width="150">
                                  <template slot-scope="scope">
                                      <el-button
                                      size="mini"
                                      @click="handleLook(scope.$index, scope.row,2)">查看</el-button>
                                  </template>
                                </el-table-column>
                            </el-table>

                            <el-table
                                v-show="activeIdx === 2"
                                :data="list"
                                stripe
                                style="width: 100%">
                                <el-table-column
                                    align="center"
                                    label="序号"
                                    width="150">
                                    <template slot-scope="scope">
                                      <p>
                                        <span v-if="scope.row.isRead === false" class="new-read">新</span>
                                        {{indexMethod(scope.$index)}}
                                      </p>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    prop="contentName"
                                    label="标题"
                                    width="250"
                                    class-name="clomun-left">
                                </el-table-column>
                                <el-table-column
                                    label="专栏"
                                    class-name="clomun-left">
                                    <template slot-scope="scope">
                                      <p>{{scope.row.columnName}}</p>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    label="状态">
                                    <template slot-scope="scope">
                                      <i class="iconfont icon-zitikuicon-" v-if="scope.row.auditStatus === 30" style="color:#6cddc7;"></i>
                                      <i class="iconfont icon-zitikuicon-" v-if="scope.row.auditStatus === 40" style="color:#F42C21;"></i>
                                      <span v-if="scope.row.auditStatus === 30">已通过</span>
                                      <span v-if="scope.row.auditStatus === 40">未通过</span>
                                    </template>
                                </el-table-column>
                                <el-table-column
                                    align="center"
                                    prop="auditDate"
                                    label="审核时间">
                                </el-table-column>
                                <el-table-column 
                                    align="center"
                                    label="操作" 
                                    width="150">
                                  <template slot-scope="scope">
                                      <el-button
                                      size="mini"
                                      @click="handleLook(scope.$index, scope.row,3)">查看</el-button>
                                  </template>
                                </el-table-column>
                            </el-table>
                        </div>
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
        </div>
        <no-active v-if="isActive == 3" @reFresh="init"></no-active>
    </div>
</template>

<script>
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
import {mapGetters} from 'vuex'

const UNVERIFY = 10;
const VERIFYING = 20;
const VERIFYED = 50;

export default {
  name: 'MycolumnCoVerify',
  data () {
    return {
      list:[], // 列表数据
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0, // 列表数据总条数
      activeIdx: 0,
      actionNames: ['未审核', '审核中', '已审核'],
      currentStatus: UNVERIFY,
      inputValue: ''
    }
  },

  computed: {
    ...mapGetters([
      'isActive',
      'imageHead'
    ])
  },

  components: {
    NoActive
  },

  created () {
    if(this.$route.query.aduio){
      this.activeIdx = parseInt(this.$route.query.aduio)
      if(this.activeIdx === 0){
        this.currentStatus = UNVERIFY
      }else if(this.activeIdx === 1){
        this.currentStatus = VERIFYING
      }else{
        this.currentStatus = VERIFYED
      }
    }
    this.init()
  },

  methods: {
    // 初始化数据
    init(){
      return api.findColumnContentAudit({
        auditStatus: this.currentStatus,
        contentName: this.inputValue,
        page: this.currentPage,
        pageSize: this.pageSize 
      }).then(res => {
          res.data.list.forEach(item => {
            item.picUrl = this.imageHead + item.columnUrl

            if(item.createDate){
              item.createDate = item.createDate.substr(0,16)
            }else{
              item.createDate = '-'
            }

            if(item.auditDate){
              item.auditDate = item.auditDate.substr(0,16)
            }else{
              item.auditDate = '-'
            }
            if(item.contentName && item.contentName.length > 12){
              item.contentName = item.contentName.substr(0,12) + '...'
            }
          })

          this.total = res.data.total
          this.list = res.data.list
      })
    },

    //切换状态
    handleTab(index){
      switch (index) {
        case 0:
          this.currentStatus = UNVERIFY
          break;
        case 1:
          this.currentStatus = VERIFYING
          break;
        case 2:
          this.currentStatus = VERIFYED
          break;
      }

      this.init().then(res => {
        this.activeIdx = index
      })
    },

    // 搜索
    handleSearch(){
      this.init()
    },

    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },

    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    },

    // 查看按钮
    handleLook(i, row,idex){
      this.$router.push({
        name: 'MycolumnCoVerifyDetail', 
        query: {
          columnId: row.columnId,
          contentId: row.id,
          columnNo: row.columnNo,
          idex:idex
        }
      })
    },

    // 序号补0
    indexMethod(index){
      const cur = this.currentPage
      const size = this.pageSize
      
      index++
      if(cur > 1){
        index = (cur - 1) * size + index
      }

      return index;
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

>>>.el-table__row
  height .8rem !important
.el-form-item-center
  display flex
  justify-content center
  margin 40px 0 30px 0
.my-column-verify, .holder-common
  width 100%
  padding 0
  box-sizing border-box
  .topbar
      div
        flex()
        color $color-text-l
        a
          flex()
          align-items center
        i 
          font-size 18px
          display inline-block
          margin-right .04rem
          float left
      h3
        color #4a4a4a
        font-size 20px
        margin-right .2rem
        cursor pointer
      p
        cursor pointer
      a 
        color $color-text-l
  .contain
    .wrap
      background-color #ffffff
    .action-bar
      font-size 14px
      color #666666
      margin .1rem .2rem .2rem .2rem
      border-bottom 1px solid #E6E6E6
      box-sizing border-box
      span
        display inline-block
        margin-right .46rem
        line-height .5rem
        padding 0 .06rem
        cursor pointer
        &.active
          position relative
          color $color-theme
          // border-bottom 2px solid $color-theme
          &:before
            content ''
            height 2px
            width 0.54rem
            background-color $color-theme
            position absolute
            bottom -1px
            left 0
    .list
      width 100%
      margin 0 auto .2rem
      overflow-x hidden
      overflow-y auto
      border-radius .05rem
      background #fff
      padding 0 .2rem
      box-sizing border-box
      .table-bar
        flex()
        justify-content flex-start
        .el-dropdown button
          background-color #ffffff
          color #666666
          border 1px solid #E2E2E2
        .el-input
          width 3rem
          margin-right 5px
      .list-table
        width 100%
        margin .2rem auto .3rem
      .new-read
        width 17px
        height 17px
        background-color $color-theme
        border-radius 2px
        color #ffffff
        font-size 12px
        line-height 17px
        margin-right 4px
      .classify-icon
        width .5rem
        height .5rem
      >>>.clomun-left
        text-align left
        .cell
          display flex
          flex-flow row nowrap
          align-items center
          justify-content flex-start
          img 
            width .6rem
            height .6rem
            padding .1rem .1rem .1rem 0
    .pagination
      display flex
      justify-content flex-end
      align-items center
      padding-right .2rem
      margin-bottom .27rem
</style>
