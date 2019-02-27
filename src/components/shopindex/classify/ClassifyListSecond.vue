<template>
    <div class="classify-list-sec holder-common">
        <div>
            <div class="topbar">
              <div>
                <h3>二级分类列表</h3>
              </div>  
              <div>
                <h3 @click="goback">
                  <i class="iconfont icon-fanhui"></i>
                  返回
                </h3>
              </div>
            </div>

            <div class="contain">
                <div class="action-bar">
                  <div class="search">
                      <el-input type="text" placeholder="名称" v-model="searchName"></el-input>
                      <button class="search-btn mr-10" @click="search">搜索</button>
                  </div>

                  <div class="action-btn">
                    <el-button @click="addClassifySecond">
                      <i class="iconfont icon-shangchuantupian"></i>
                      添加二级分类
                    </el-button>
                  </div>
              </div>

              <el-alert
                :title="listTitle"
                type="warning"
                show-icon>
              </el-alert>

                <div class="list">
                    <div class="list-table list-thead-gray">
                        <el-table
                            :data="templateList"
                            stripe
                            style="width: 100%"
                            ref="multipleTable">
                            <el-table-column
                                type="index"
                                label="序号"
                                align="center"
                                width="180"
                                :index="indexMethod">
                            </el-table-column>
                           <!-- <el-table-column
                                prop="number"
                                label="二级分类编号"
                                min-width="150">
                            </el-table-column> -->
                            <el-table-column
                                prop="name"
                                align="center"
                                label="二级分类名称">
                            </el-table-column>
                            <el-table-column
                                prop="platformCatalog"
                                align="center"
                                label="所属一级分类">
                            </el-table-column>
                            <el-table-column 
                                label="操作" 
                                width="200"
                                align="center">
                              <template slot-scope="scope">
                                <el-button
                                  size="mini"
                                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                                <el-button
                                  size="mini"
                                  class="delete-btn"
                                  @click="handleDelete(scope.$index, scope.row)">删除</el-button>
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
    </div>
</template>

<script>
import api from 'fetch/api'
import {mapGetters} from 'vuex'

export default {
  name: 'ClassifyListSecond',
  data () {
    return {
      templateList:[], // 列表数据
      searchName: '', //  搜索框的等级名称
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0, // 列表数据总条数
      tableItemIndex: 0, // 选中的当前列表项索引
      listTitle: ""
    }
  },

  computed: {
    ...mapGetters([
      'imageHead'
    ])
  },

  created () {
    this.initTemplates()
  },

  methods: {
    // 初始化数据
    initTemplates(conf = {
      type: 3,
      showCatalog: 1,
      parentId: this.$route.query.id,
      name: "",
      page: this.currentPage,
      pageSize: this.pageSize
    }) {
      api.getStoreIncomeDetailList(conf).then(res => {
        if(res.data){
          res.data.list.map(v => {
            v.iconUrl = this.imageHead + v.catalogUrl
            v.isShow = v.showCatalog === 1 ? true : false
            return v
          })

          this.listTitle = `所属一级分类 ${this.$route.query.plat}， 其二级分类共 ${res.data.total} 个`
          this.total = res.data.total
          this.templateList = res.data.list
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

    // 查询课程分类列表
    search () {
      this.initTemplates({
        type: 3,
        showCatalog: "",
        parentId: this.$route.query.id,
        name: this.searchName,
        page: this.currentPage,
        pageSize: this.pageSize
      })
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

    // 单个编辑按钮
    handleEdit(i, row){
      this.$router.push({
        name: "ClassifyListAddSecond",
        query: {
          id:row.id,
          name:row.platformCatalog,
          paltform:row.name
        }
      })
    },

    // 删除单个
    handleDelete(i, row){
      api.deleteCourseCatalog({
        id: row.id
      }).then(res => {
        if(res.success){
          const list = [...this.templateList]

          this.templateList = list.filter(item => item.id !== row.id)

          this.$message({
            message: "删除成功",
            type: "success"
          })
        }else{
          this.$message({
            message: "删除失败",
            type: "error"
          })
        }
      })
    },

    //添加二级分类
    addClassifySecond(){
      this.$router.push({
        name: "ClassifyListAddSecond",
        query: {
          id:this.$route.query.id
        }
      })
    },

    // 返回
    goback(){
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
.classify-list-sec, .holder-common
  width 100%
  padding 0
  box-sizing border-box
  .topbar
      flexBetween()
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
    margin-top .23rem
    .action-bar
      width 100%
      height .4rem
      margin-bottom .11rem
      flexBetween()
    .action-btn
      flex()
      .el-button
        flex()
        width 1rem
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

<style lang="stylus">
@import "~assets/styles/varibles"

.btn-popper
  display flex 
  flex-direction column
  align-items center
  justify-content center
  color #9B9B9B !important
  line-height .25rem
  min-width 110px
  p
    cursor pointer
    &:hover
      color $color-theme
.classify-list-sec .el-alert__title
  color #666666
</style>
