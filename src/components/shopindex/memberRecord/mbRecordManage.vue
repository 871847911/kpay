<template>
    <div class="mb-record-manage holder-common">
        <div v-if="isActive == 4">
            <div class="topbar layout-head">
                <h3>会员积分管理</h3>
            </div>

            <div class="contain">
                <div class="action-bar">
                  <div class="search">
                      <el-input type="text" placeholder="微信昵称" v-model="searchName"></el-input>
                      <!-- <el-select class="mr-10 el-select-custom" v-model="growUpValue" placeholder="积分范围">
                        <el-option
                          v-for="item in growUpOptions"
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select> -->
                      <button class="search-btn mr-10" @click="search">搜索</button>
                  </div>

                  <div class="action-btn">
                    <router-link to="mbrecordset">
                      <el-button class="rules-btn">积分规则</el-button>
                    </router-link>

                    <router-link to="mbrecordmanagemission">
                      <el-button class="mission-btn">任务设置<i class="iconfont icon-renwushezhi-"></i></el-button>
                    </router-link>
                  </div>
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
                                type="index"
                                label="序号"
                                :index="indexMethod"
                                align="center"
                                width="150">
                            </el-table-column>
                           <!-- <el-table-column
                                prop="userName"
                                label="用户账号"
                                align="center"
                                width="300">
                                <template slot-scope="scope">
                                    <img :src="scope.row.headUrl" class="head_pic" alt="头像">
                                    <span>{{scope.row.userName}}</span>
                                </template>
                            </el-table-column> -->
                            <el-table-column
                                prop="nickName"
                                label="微信昵称"
                                align="center"
                                min-width="100">
                            </el-table-column>
                            <!-- <el-table-column
                                prop="scoreOld"
                                align="center"
                                label="历史积分"
                                min-width="100">
                            </el-table-column> -->
                            <el-table-column
                                prop="score"
                                align="center"
                                label="可用积分"
                                min-width="100">
                            </el-table-column>
                            <el-table-column label="操作" align="center">
                              <template slot-scope="scope">
                                <el-button
                                  size="mini"
                                  @click="handleLook(scope.$index, scope.row)">查看</el-button>
                              </template>
                            </el-table-column>
                        </el-table>
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

         <no-active v-if="isActive == 3" @reFresh="initTemplates"></no-active>
    </div>
</template>

<script>
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
import {mapGetters} from 'vuex'

export default {
  name: 'MbRecordManage',
  data () {
    return {
      headRowHeight:{"height":"88px"},
      templateList: [], //信息列表
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0, // 列表数据总条数
      searchName: '', //  搜索框的等级名称
      //growUpValue: '', // 下拉列表值
      //growUpOptions: [], // 下拉列表选项
      formLabelWidth: '120px'
    }
  },

  computed: {
    ...mapGetters([
      'isActive'
    ])
  },

  components: {
    NoActive
  },

  created(){
    this.initTemplates()
  },

  methods: {
     // 初始化数据
    initTemplates() {
      let conf = {
        searchName: this.searchName,
        page: this.currentPage,
        pageSize: this.pageSize
      }

      api.findRecrodStoreVipList(conf).then(res => {
        if(res.data){
          this.templateList = res.data.list
          this.total = res.data.total
        }
      });
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
    },

    // 查看
    handleLook(index, row){
      this.$router.push({
        name:"MbRecordManageGrow",
        query: {
          id:row.id
        }
      })
    },

    // 查询会员管理信息列表
    search () {
      this.initTemplates()
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

.el-form-item-center
  display flex
  justify-content center
  margin 40px 0 30px 0
.mb-record-manage, .holder-common
  width 100%
  padding 0
  box-sizing border-box
  .topbar
      div
        flex()
        color $color-text-l
        i
          display inline-block
          margin-right .04rem
      h3
        font-size 20px
        margin-right .2rem
        cursor pointer
      p
        cursor pointer
      a 
        color $color-text-l
  .contain
    .action-bar
      width 100%
      height .4rem
      margin-bottom .11rem
      flexBetween()
    .action-btn
      flex()
      .mission-btn, .rules-btn
        font-size 13px
        color rgba(155,155,155,1)
        margin-left .1rem
        border 0
        span
          flex()
          align-items center
        i 
          color $color-theme
          margin-left .05rem
          font-size 14px
      .btn-poper
        width .4rem
        height .4rem
        margin-left .1rem
        border-radius 4px
        &:last-child
          background #ffffff
        i
          color $color-theme
        .icon-bianji
          color $color-theme
        .el-button
          flex()
          width 100%
          height 100%
          justify-content center
          align-items center
    .search
      flex()
      .el-input
        width 3rem
        margin-right 5px
      .search-btn
        width .7rem
        height .4rem
        background $color-theme
        border-radius 4px
        font-size 14px
        color #ffffff
        cursor pointer
    .list
      width 100%
      margin 0 auto .33rem
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
          vertical-align middle
    .pagination
      display flex
      justify-content flex-end
      align-items center
      padding-right .2rem
      margin-bottom .27rem
</style>
