<template>
  <div class="course-third">
    <div>
      <!-- <h2 class="head-name">课程列表</h2> -->
      <div class="search">
          <el-input type="text" placeholder="课程名称" v-model="courseName"></el-input>
          <button class="search-btn" @click="search">查询</button>
      </div>

      <div class="list">
        <div class="list-category-my list-course-common">
          <el-table
              :data="courseList"
              stripe
              style="width: 100%">
              <!-- <el-table-column
                  align="center"
                  prop="courseNumber"
                  label="课程编号">
              </el-table-column> -->
              <el-table-column
                  align="center"
                  prop="name"
                  label="课程名称"
                  width="280">
                  <template slot-scope="scope">
                      <img :src="imageHead + scope.row.courseUrlList[0]" alt="图片" class="left">
                      <ul class="right">
                          <li class="right-one">{{scope.row.courseName}}</li>
                          <li class="right-two" v-if="scope.row.isModify">近期修改</li>
                          <li class="right-two" v-else style="background:none;"></li>
                          <li class="right-three">创建时间</li>
                          <li class="right-four">{{scope.row.createDate}}</li>
                      </ul>
                  </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="catalogName"
                  label="所属分类">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="createUser"
                  label="作者">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="buyNumber"
                  label="交易">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="price"
                  label="价格"
                  min-width="100">
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="isShow"
                  label="首页展示">
                  <template slot-scope="scope">
                      <el-switch
                          :active-value="1"
                          :inactive-value="0"
                          v-model="scope.row.isShow"
                          v-if="scope.row.status == 40"
                          active-color="#6CDDC7"
                          inactive-color="#AEB8BE"
                          @change="homeDisplay(scope.row.storeId, scope.row.id, scope.row.isShow)">
                      </el-switch>
                  </template>
              </el-table-column>
              <el-table-column
                  align="center"
                  prop="status"
                  label="状态">
                  <template slot-scope="scope">
                      <i class="iconfont icon-zitikuicon-" style="color:#6CDDC7;" v-if="scope.row.status === 40"></i>
                      <span v-if="scope.row.status === 40">已上架</span>
                      <i class="iconfont icon-zitikuicon-" style="color:#F43025;" v-if="scope.row.status === 50"></i>
                      <span v-if="scope.row.status === 50">未上架</span>
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
              :page-sizes="[5, 10, 15, 25]"
              :total="total">
          </el-pagination>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {mapGetters} from 'vuex'
import api from 'fetch/api'

export default {
  name: 'CourseThird',
  data () {
    return {
      currentPage: 1, // 第几页
      pageSize: 5, // 每页条数
      total: 0, // 总共条数
      courseName: '', // 课程名称
      courseList: [], // 课程列表
      roleId: '' // 角色id
    }
  },
  computed: {
    ...mapGetters([
      'imageHead'
    ])
  },
  
  created () {
    this.getBaseInfo()
  },

  methods: {
    getBaseInfo () {
      api.getBaseInfo().then(res => {
        if (res.success) {
          this.roleId = res.data.roleId
          this.findThirdCourseMain()
        }
      })
    },
    findThirdCourseMain () {
      let that = this

      api.findThirdCourseMain({
        courseName: that.courseName,
        status: 60,
        page: that.currentPage,
        pageSize: that.pageSize
      }).then(res => {
        if (res.success) {
          that.courseList = res.data.list
          that.total = res.data.total
        }
      })
    },
    homeDisplay (storeId, id, val) {
      let that = this
      let isShow = val ? 1 : 0

      api.homeDisplay({
        storeId: storeId,
        id: id,
        isShow: isShow
      }).then(res => {
        if (!res.success) {
          that.$message.error('首页最多只能展示三门付费课程、三门免费课程！')
          that.findThirdCourseMain()
        }
      })
    },
    search() {
      this.findThirdCourseMain()
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.findThirdCourseMain()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.findThirdCourseMain()
    },
    toDetail (id) {
      this.$router.push(`/index/coursethirddetail${id}`)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.course-third
  width 100%
  margin 0 auto
  .icon-zitikuicon-
    font-size 14px
.head-name
  width 100%
  height .28rem
  line-height .28rem
  color #9B9B9B
  font-size .2rem
  margin 0 auto .2rem
.search
  padding-left 0.2rem
  box-sizing border-box
  width 100%
  height .4rem
  position relative
  margin 0 auto .15rem
  display flex
  align-items center
  justify-content flex-start
  .el-input
    width 3rem
    margin-right 5px
  .search-btn
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
  max-height 8.6rem
  overflow-x hidden
  overflow-y auto
  border-radius .05rem
  background #fff
  .list-category-my
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
