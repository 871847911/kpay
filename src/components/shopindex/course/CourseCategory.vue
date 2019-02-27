<template>
    <div class="course-category">
        <div v-if="isActive == 4">
            <h2 class="head-name">分类标签</h2>
            <div class="search">
                <input type="text" placeholder="分类编号" v-model="categoryNum">
                <input class="search-name" type="text" placeholder="分类名称" v-model="categoryName">
                <button class="search-btn" @click="search">查询</button>
                <button class="add-categary" @click="changeCategary()">
                    <i class="el-icon-plus"></i>
                    <span>添加分类</span>
                </button>
            </div>
            <div class="list">
                <div class="list-category">
                    <el-table
                        :data="categoryList"
                        stripe
                        style="width: 100%">
                        <el-table-column
                            align="center"
                            prop="number"
                            label="分类编号"
                            min-width="220">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="catalogUrl"
                            label="分类图标"
                            min-width="100">
                            <template slot-scope="scope">
                                <img v-if="scope.row.type == 2" :src="scope.row.qiniuDomain + scope.row.catalogUrl" style="width:.32rem;height:.32rem;border-radius:.04rem;">
                                <img v-else :src="imageHead + scope.row.catalogUrl" style="width:.32rem;height:.32rem;border-radius:.04rem;">
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="name"
                            label="分类名称"
                            min-width="170">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="createUser"
                            label="创建人"
                            min-width="170">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="createDate"
                            label="创建日期"
                            min-width="220">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="type"
                            label="操作"
                            min-width="220">
                            <template slot-scope="scope">
                                <el-button size="mini" v-if="scope.row.type == 1" @click="changeCategary(scope.row.name, scope.row.id, scope.row.catalogUrl)">编辑</el-button>
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
            <el-dialog
                :visible.sync="dialogVisible"
                :show-close="false"
                class="el-categroy-dialog"
                top="1.5rem"
                width="3.82rem"
                :center="true">
                <div class="classification columnFlex">
                  <span class="category-head">分类名称</span>
                  <input type="text" class="category-middle" v-model="addName">
                  <div class="category-upload" style="margin-top:10px;">
                      <div id="pickfiles" v-if="!imageUrl && dialogVisible">
                          <i class="el-icon-plus"></i>
                          <p class="txt">上传照片</p>
                      </div>
                      <div id="pickfiles" v-if="imageUrl && dialogVisible">
                          <img :src="imageUrl">
                      </div>
                  </div>
                   <p class="category-suggest">建议尺寸32*32， 支持Jpg、Png格式</p>
                  <span slot="footer" class="category-footer" style="width:155px;margin:0 auto;display:flex;margin-top:30px;">
                      <el-button class="cancel" @click="dialogVisible = false">取消</el-button>
                      <el-button class="active-shop" type="primary" @click="confirm(categoryId)">确认</el-button>
                  </span>
                </div>
            </el-dialog>
        </div>
        <no-active v-if="isActive == 3" @reFresh="search"></no-active>
    </div>
</template>

<script>
import {initQiniu} from 'assets/js/api'
import {mapGetters} from 'vuex'
import NoActive from 'components/common/NoActive'
import api from 'fetch/api'
export default {
  name: 'CourseCategroy',
  data () {
    return {
      categoryList: [], // 分类列表
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0, // 列表数据总条数
      dialogVisible: false, // 控制dialog显示影藏
      categoryNum: '', // 搜索框的分类编号
      categoryName: '', // 搜索框的分类名称
      addName: '', // 新增分类的名称
      categoryId: '', // 修改分类的id
      imageUrl: '', // 分类图标
      key: '', // 无前缀的分类图片
      tips: '' // 上传图片提示成功与否
    }
  },

  created () {
    this.getCourseCategory()
  },

  computed: {
    ...mapGetters([
      'isActive',
      'token',
      'imageHead',
      'uploadImageHead'
    ])
  },

  components: {
    NoActive
  },

  methods: {
    // 上传分类图标前初始化
    uploadImg() {
      var that = this
      initQiniu('pickfiles', 2, 'image/jpeg,image/jpg,image/png', (file, info) => {
        let newInfo = JSON.parse(info)
        that.imageUrl = that.uploadImageHead + newInfo.key
        that.key = newInfo.key
        that.tips = '上传成功。'
      }, file => {
        if (file.isUpload === 1) {
          //
        } else if (file.isUpload === 2) {
          that.tips = '文件大小超出范围！'
        } else {
          that.tips = '文件类型不正确！'
        }
      }, that.token)
    },

    // 查询课程分类列表
    search () {
      this.getCourseCategory()
    },

    // 获取课程分类列表
    getCourseCategory () {
      let that = this
      api.getCourseCategory({
        type: 1,
        number: that.categoryNum,
        name: that.categoryName,
        page: that.currentPage,
        pageSize: that.pageSize
      }).then(res => {
        if (res.success && res.data.list) {
          that.total = res.data.total
          that.categoryList = res.data.list
        } else {
          that.$message.error('获取课程分类列表失败！')
        }
      })
    },

    // 修改课程分类名称及图标
    saveCourseCategory (name, id, url) {
      let that = this
      api.saveCourseCategory({
        type: 1,
        id: id,
        name: name,
        catalogUrl: url
      }).then(res => {
        if (res.success) {
          that.dialogVisible = false
          this.getCourseCategory()
        } else {
          that.$message.error('课程分类保存失败！')
        }
      }).catch(res => {
        that.$message.error('课程分类保存失败！')
      })
    },

    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      this.getCourseCategory()
    },

    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      this.getCourseCategory()
    },

    changeCategary (name, id, url) {
      this.dialogVisible = true
      this.uploadImg()
      if (name) {
        this.addName = name
      } else {
        this.addName = ''
      }
      if (id) {
        this.categoryId = id
      } else {
        this.categoryId = ''
      }
      if (url) {
        this.imageUrl = this.imageHead + url
        this.key = url
      } else {
        this.imageUrl = ''
        this.key = ''
      }
    },

    // 添加或编辑分类时显示操作弹窗
    confirm (id) {
      if (this.addName) {
        if (this.key) {
          this.saveCourseCategory(this.addName, id, this.key)
        } else {
          this.$message.error('课程分类图标不能为空！')
        }
      } else {
        this.$message.error('课程分类名称不能为空！')
      }
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.course-category
  width 100%
  margin 0 auto
  >>>.el-categroy-dialog .el-dialog--center .el-dialog__body
    margin-bottom 0
  >>>.el-button--primary
    background-color $color-theme
.head-name
  width 100%
  fontverticalCenter(.28rem)
  color #9B9B9B
  font-size .2rem
  margin 0 auto .2rem
.search
  width 100%
  height .4rem
  position relative
  margin 0 auto .15rem
  display flex
  align-items center
  input
    height 100%
    width 2.8rem
    border-radius .05rem
    background #fff
    padding-left .2rem
    font-size .14rem
    color #4A4A4A
    placeholderStyle()
  .search-name
    margin-left .1rem
  .search-btn
    position absolute
    top 0
    left 6.3rem
    height .4rem
    fontCenter(.4rem)
    font-size .14rem
    color #fff
    border-radius .05rem
    background $color-theme
    width .7rem
    cursor pointer
  .add-categary
    width 1.21rem
    height .4rem
    flex()
    background $color-theme
    border-radius .04rem
    position absolute
    right 0
    top 0
    cursor pointer
    .el-icon-plus,span
      font-size .14rem
      color #fff
    .el-icon-plus
      font-size .12rem
      margin-right .05rem
.list
  width 100%
  margin 0 auto .33rem
  overflow-x hidden
  overflow-y auto
  border-radius .05rem
  background #fff
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
