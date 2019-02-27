<template>
    <div class="my-column-content holder-common">
        <div v-if="isActive == 4">
            <div class="topbar layout-head">
              <h3>专栏内容</h3>
              <div>
                <h3 @click="goback">
                  <i class="iconfont icon-fanhui"></i>
                  返回
                </h3>
              </div>
            </div>

            <div class="contain">
              <div class="action-bar">
                <div class="action-content">
                  <p>目前专栏为 <span>{{headData.columnName}}</span> ，预期添加{{headData.articleNumber}}篇，现在已上架 <span>{{headData.shelvesNumber}}</span> 篇</p>

                  <div class="action-btn">
                    <el-button @click="addGraphic">
                      <span>添加图文</span>
                    </el-button>
                  </div>
                </div>
              </div>

              <div class="list">
                  <div class="list-table list-thead-gray">
                      <el-table
                          :data="list"
                          stripe
                          style="width: 100%"
                          ref="multipleTable">
                          <el-table-column
                              align="center"
                              type="index"
                              label="序号"
                              :index="indexMethod"
                              width="150">
                          </el-table-column>
                          <el-table-column
                              align="center"
                              prop="contentName"
                              label="标题"
                              min-width="150">
                          </el-table-column>
                          <el-table-column
                              align="center"
                              label="状态"
                              min-width="150">
                              <template slot-scope="scope">
                                <i class="iconfont icon-zitikuicon-" v-if="scope.row.onStatus == 0" style="color:#F42C21;"></i>
                                <i class="iconfont icon-zitikuicon-" v-if="scope.row.onStatus == 1" style="color:#6cddc7;"></i>
                                <span v-if="scope.row.onStatus === 0">未上架</span>
                                <span v-if="scope.row.onStatus === 1">已上架</span>
                              </template>
                          </el-table-column>
                          <el-table-column
                              align="center"
                              label="上架时间"
                              min-width="150"
                              >
                              <template slot-scope="scope">
                                <span v-if="scope.row.onDate && scope.row.onStatus === 1">{{scope.row.onDate}}</span>
                                <span v-else>-</span>
                              </template>
                          </el-table-column>
                          <el-table-column label="操作" min-width="150" align="center">
                            <template slot-scope="scope">
                              <el-button
                                size="mini"
                                @click="handleLook(scope.$index, scope.row)">查看</el-button>

                              <div
                                style="display: inline-block;"
                                v-show="scope.row.onStatus === 0"
                                >
                                <el-button
                                  size="mini"
                                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>

                                <el-button
                                  size="mini"
                                  class="onshelf-btn"
                                  @click="handleShelf(scope.$index, scope.row)"
                                  >
                                  <span>上架</span>
                                </el-button>
                              </div>
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
        <no-active v-if="isActive == 3" @reFresh="init"></no-active>
    </div>
</template>

<script>
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
import { mapGetters } from 'vuex'

export default {
  name: 'MycolumnListStoreContent',
  data() {
    return {
      list: [], // 列表数据
      headData: {}, // 统计数据
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0 // 列表数据总条数
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

  created() {
    this.init()
  },

  methods: {
    // 初始化数据
    init() {
      this.initList()
      this.initHead()
    },

    // 初始化表头信息
    initHead() {
      api.getColumnInfo({
        id: this.$route.query.columnId
      }).then(res => {
        if (res.data) {
          this.headData = res.data
        }
      })
    },

    // 请求列表
    initList() {
      const queryId = this.$route.query.columnId

      api.findColumnContent({
        columnId: queryId,
        page: this.currentPage,
        pageSize: this.pageSize
      }).then(res => {
        if (res.data) {
          if (res.data.list) {
            res.data.list.forEach(item => {
              if (item.onDate) {
                item.onDate = item.onDate.substr(0, 16)
              }
              if (item.contentName && item.contentName.length > 12) {
                item.contentName = item.contentName.substr(0, 12) + '...'
              }
            })
          }
          this.list = res.data.list
          this.total = res.data.total
        }
      })
    },

    // 上架下架
    handleShelf(index, row) {
      const status = row.onStatus === 0 ? 1 :　0
      let data = {...row}

      api.updateColumnContentStatus({
        id: row.id,
        reason: '',
        status
      }).then(res => {
        if (res.success) {
          this.$message.success('上架成功')
          this.list.map(item => {
            if (item.id === data.id) {
              item.onStatus = status
            }
            return item
          })
          this.initList()
          this.initHead()
        }
      })
    },

    // 添加图文
    addGraphic() {
      this.$router.push({
        name: 'MycolumnListStoreContentAdd',
        query: {
          columnId: this.$route.query.columnId
        }
      })
    },

    // 编辑
    handleEdit(idx, row) {
      this.$router.push({
        name: 'MycolumnListStoreContentAdd',
        query: {
          columnId: this.$route.query.columnId,
          contentId: row.id,
          columnNo: this.calcIndex(idx)
        }
      })
    },

    // 查看
    handleLook(idx, row) {
      this.$router.push({
        name: 'MycolumnListStoreDetail',
        query: {
          columnId: this.$route.query.columnId,
          contentId: row.id,
          columnNo: this.calcIndex(idx)
        }
      })
    },

    // 计算序号值
    calcIndex(idx) {
      let index = idx
      index++

      if (this.currentPage > 1) {
        index = (this.currentPage - 1).toString() + index
      }

      return index
    },

    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      this.initList()
    },

    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      this.initList()
    },

    // 序号补0
    indexMethod(index) {
      const cur = this.currentPage
      const size = this.pageSize

      index++
      if (cur > 1) {
        index = (cur - 1) * size + index
      }

      return index
    },

    // 回退
    goback() {
      this.$router.back()
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
.icon-zitikuicon-
  font-size 14px
.my-column-content, .holder-common
  width 100%
  padding 0
  box-sizing border-box
  .topbar
      font-size 12px
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
      background-color #ffffff
      padding 0 .2rem
      box-sizing border-box
      p
        font-size 14px
        color #666666
        span
          color $color-theme
    .action-content
      flexBetween()
      width 100%
      padding .1rem 0
      border-bottom 2px solid #E6E6E6
      box-sizing border-box
    .action-btn
      flex()
      .el-button
        flex()
        width .82rem
        height .4rem
        border 0
        padding 0 !important
        border-radius 4px
        background-color $color-theme
        font-size 12px
        color #ffffff
        i
          font-size 12px
    .search
      flex()
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
      .classify-icon
        width .5rem
        height .5rem
    .pagination
      display flex
      justify-content flex-end
      align-items center
      padding-right .2rem
      margin-bottom .27rem
</style>