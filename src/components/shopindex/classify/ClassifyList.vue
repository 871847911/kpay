<template>
    <div class="classify-list holder-common">
        <div v-if="isActive == 4">
            <div class="topbar layout-head">
              <h3>一级分类列表</h3>
            </div>

            <div class="contain">
                <div class="action-bar">
                  <div class="search">
                      <el-input type="text" placeholder="名称" v-model="searchName"></el-input>
                      <el-select class="el-select-custom" v-model="allClassify" placeholder="全部状态" @change="search">
                        <el-option
                          v-for="(item, index) of classifyOptions"
                          :key="index"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select>
                      <button class="search-btn mr-10" @click="search">搜索</button>
                  </div>

                  <div class="action-btn">
                    <el-popover 
                      trigger="click" 
                      placement="bottom" 
                      popper-class="btn-popper"
                      width="110"
                      >
                      <p @click="addClassify">添加一级分类</p>
                      <p @click="addClassifySecond">添加二级分类</p>
                      <el-button slot="reference">
                        <i class="iconfont icon-shangchuantupian"></i>
                        <span>添加分类</span>
                      </el-button>
                    </el-popover>
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
                                align="center"
                                type="index"
                                label="序号"
                                :index="indexMethod"
                                width="150">
                            </el-table-column>
                           <!-- <el-table-column
                                align="center"
                                prop="number"
                                label="一级分类编号"
                                min-width="150">
                            </el-table-column> -->
                            <el-table-column
                                align="center"
                                prop="name"
                                label="一级分类名称"
                                min-width="150">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="growRound"
                                label="一级分类图标"
                                min-width="150">
                                <template slot-scope="scope">
                                  <img class="classify-icon" :src="scope.row.iconUrl" alt="图片">
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="platformCatalog"
                                label="平台类别"
                                min-width="150">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                label="是否显示"
                                min-width="150">
                                <template slot-scope="scope">
                                  <el-switch
                                    v-model="scope.row.isShow"
                                    active-color="#6cddc7"
                                    inactive-color="#AEB8BE"
                                    @change="handleIsShow(scope.row)"
                                    >
                                  </el-switch>
                                </template>
                            </el-table-column>
                            <el-table-column
                                align="center" 
                                label="操作" 
                                width="150">
                              <template slot-scope="scope">
                                <el-button
                                  size="mini"
                                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
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
  name: 'ClassifyList',
  data () {
    return {
      templateList:[], // 列表数据
      searchName: '', //  搜索框的等级名称
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0, // 列表数据总条数
      tableItemIndex: 0, // 选中的当前列表项索引
      allClassify: "", //全部状态
      classifyOptions: [
        {
          value: "",
          label: "全部状态"
        },
        {
          value: "1",
          label: "显示"
        },
        {
          value: "2",
          label: "不显示"
        }
      ],
      listTitle: ""
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
    this.initTemplates()
    this.getCatalogSummary()
  },

  methods: {
    // 初始化数据
    initTemplates(conf = {
      type: 1,
      showCatalog: "",
      parentId: "",
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

          this.total = res.data.total
          this.templateList = res.data.list
        }
      });
    },

    // 统计一级分类下面的数据
    getCatalogSummary(){
      api.getCatalogSummary().then(res => {
        if(res.data){
          this.listTitle = `店铺一级分类共 ${res.data.totalOneCatalog} 个， 小程序端首页显示 ${res.data.totalShowCatalog} 个`
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
    },

    // 查询课程分类列表
    search () {
      this.initTemplates({
        type: 1,
        showCatalog: this.allClassify,
        parentId: "",
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

    // 开关单个
    handleIsShow(row){
      const {id, name, parentId, showCatalog, catalogUrl} = row
      let displayCatalog = showCatalog === 1 ? 2 : 1

      api.updateCourseCatalog({
        id,
        name,
        parentId,
        catalogUrl,
        showCatalog: displayCatalog
      }).then(res => {
        if(res.success){
          this.initTemplates()
          this.$message({
            message: "修改成功",
            type: "success"
          })

          this.getCatalogSummary()
        }else{
          this.$message({
            message: res.message,
            type: "error"
          })
          this.initTemplates()
        }
      })
    },

    // 单个编辑按钮
    handleEdit(i, row){
      this.$router.push({
        name: 'ClassifyListAdd', 
        params: { 
          ...row
        }
      })
    },

    // 查看按钮
    handleLook(i, row){
      this.$router.push({
        path: 'classifylistsecond', 
        query: { 
          id: row.id,
          plat: row.name
        }
      })
    },

    // 一级分类添加
    addClassify(){
      this.$router.push({
        name: "ClassifyListAdd",
        params: {}
      })
    },

    // 二级分类添加
    addClassifySecond(){
      this.$router.push({
        name: "ClassifyListAddSecond",
        params: {}
      })
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
.classify-list, .holder-common
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
      .el-button
        flex()
        width 1rem
        height .4rem
        border 0
        padding 0 !important
        border-radius 4px
        background-color $color-theme
        font-size 14px
        color #ffffff
        i
          font-size 12px
    .search
      flex()
      .el-input
        width 3rem
        margin-right 5px
      .el-select-custom
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
.classify-list .el-alert__title
  color #666666
</style>
