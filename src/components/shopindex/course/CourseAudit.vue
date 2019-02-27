<template>
    <div class="course-my">
        <div v-if="isActive == 4">
            <div class="layout-head">
              <h2>审核课程</h2>
            </div>
            <div class="search">
                <el-input type="text" placeholder="课程名称" v-model="courseName"></el-input>
                <el-select v-model="value" placeholder="状态" class="el-select-custom">
                    <el-option
                        v-for="item in newOptions"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <button class="search-btn" @click="search">查询</button>
                <button class="add-categary" @click="addCourse">
                    <i class="el-icon-plus"></i>
                    <span>添加课程</span>
                </button>
            </div>
            <div class="list">
                <div class="list-category-my list-course-common">
                    <el-table
                        :data="courseList"
                        stripe
                        style="width: 100%">
                        <!-- <el-table-column
                            prop="courseNumber"
                            label="课程编号"
                            min-width="160">
                        </el-table-column> -->
                        <el-table-column
                            prop="name"
                            align="center"
                            label="课程名称"
                            min-width="260">
                            <template slot-scope="scope">
                                <img :src="imageHead + scope.row.courseUrlList[0]" alt="" class="left" @click="toDetail(scope.row.id)">
                                <ul class="right">
                                    <li class="right-one" @click="toDetail(scope.row.id)">{{scope.row.courseName}}</li>
                                    <li class="right-two" v-if="scope.row.isModify">近期修改</li>
                                    <li class="right-two" v-else style="background:none;"></li>
                                    <li class="right-three">创建时间</li>
                                    <li class="right-four">{{scope.row.createDate}}</li>
                                </ul>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="catalogName"
                            label="所属分类"
                            align="center"
                            min-width="100">
                        </el-table-column>
                        <el-table-column
                            prop="isShow"
                            align="center"
                            label="首页展示"
                            min-width="80">
                            <template slot-scope="scope">
                                <el-switch
                                    :width="34"
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
                            prop="buyNumber"
                            label="交易"
                            align="center"
                            min-width="80">
                        </el-table-column>
                        <el-table-column
                            prop="price"
                            label="价格"
                            align="center"
                            min-width="100">
                        </el-table-column>
                        <el-table-column
                            prop="status"
                            label="状态"
                            align="center"
                            min-width="100">
                            <template slot-scope="scope">
                                <i class="iconfont icon-zitikuicon-" v-if="scope.row.status == 10" style="color:#4A90E2;"></i>
                                <i class="iconfont icon-zitikuicon-" v-else-if="scope.row.status == 20" style="color:#8561FA;"></i>
                                <i class="iconfont icon-zitikuicon-" v-else-if="scope.row.status == 30" style="color:#F42C21;"></i>
                                <i class="iconfont icon-zitikuicon-" v-else style="color:#6cddc7;"></i>
                                <span v-if="scope.row.status == 10">未提交</span>
                                <span v-else-if="scope.row.status == 20">审核中</span>
                                <span v-else-if="scope.row.status == 30">未通过</span>
                                <span v-else>已通过</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            prop="handle"
                            label="操作"
                            align="center"
                            min-width="220">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="toDetail(scope.row.id)">查看</el-button>
                                <el-button size="mini" @click="toEdit(scope.row.id, scope.row.courseType)" v-if="scope.row.status != 20 && scope.row.status != 40">编辑</el-button>
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
                <el-dialog
                  :visible.sync="dialogVisible"
                  class="el-addcourse-dialog"
                  title="课程类型"
                  top="2.1rem"
                  height="3.6rem"
                  width="8.4rem"
                  :center="true">
                  <!-- <span class="course-head">课程类型</span> -->
                  <span slot="footer" class="course-footer">
                      <el-button class="course general-course" @click="pickCourseType(1)">
                          <i class="icon iconfont">&#xe60c;</i>
                          <span class="name">普通课程</span>
                      </el-button>
                      <el-button class="course special-course" @click="pickCourseType(2)">
                          <i class="icon iconfont icon-mulukecheng"></i>
                          <span class="name">目录课程</span>
                      </el-button>
                  </span>
              </el-dialog>
            </div>
        </div>
        <no-active v-if="isActive == 3" @reFresh="search"></no-active>
    </div>
</template>

<script>
import {mapGetters} from 'vuex'
import NoActive from 'components/common/NoActive'
import api from 'fetch/api'
export default {
  name: 'CourseAudit',
  data () {
    return {
      currentPage: 1, // 第几页
      pageSize: 5, // 每页条数
      total: 0, // 总共条数
      dialogVisible: false, // 弹窗显示隐藏
      newOptions: [ {
        value: '70',
        label: '全部'
      },
      {
        value: '10',
        label: '未提交'
      },
      {
        value: '20',
        label: '审核中'
      }, {
        value: '30',
        label: '未通过'
      }],
      value: '70', // 状态
      courseName: '', // 课程名称
      courseList: [], // 课程列表
      roleId: '' // 角色id
    }
  },
  computed: {
    ...mapGetters([
      'isActive',
      'imageHead'
    ])
  },
  created () {
    this.getBaseInfo()
  },
  components: {
    NoActive
  },
  methods: {
    getBaseInfo () {
      let that = this
      api.getBaseInfo().then(res => {
        if (res.success) {
          that.roleId = res.data.roleId
          that.getMyCourse()
        }
      })
    },
    toEdit(id, type) {
      if (type === 1) {
        this.$router.push({
          name: 'CourseMyAdd',
          query: {
            id: id
          }
        })
      } else {
        this.$router.push({
          name: 'CourseMyAddFirst',
          query: {
            id: id
          }
        })
      }
    },
    search() {
      this.getMyCourse()
    },
    getMyCourse () {
      let that = this
      api.getMyCourse({
        courseName: that.courseName,
        status: that.value,
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
      let isShow
      if (val) {
        isShow = 1
      } else {
        isShow = 0
      }
      api.homeDisplay({
        storeId: storeId,
        id: id,
        isShow: isShow
      }).then(res => {
        if (res.success) {
        } else {
          that.$message.error('首页最多只能展示三门付费课程、三门免费课程！')
          that.getMyCourse()
        }
      })
    },
    updateCourseStatus (id, status) {
      let that = this
      api.updateCourseStatus({
        id: id,
        status: status
      }).then(res => {
        if (res.success) {
          if (status === 50) {
            that.$message.success('课程下架成功。')
          }
          if (status === 40) {
            that.$message.success('课程上架成功。')
          }
          that.getMyCourse()
        } else {
          that.$message.error('更改课程状态失败！')
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.getMyCourse()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.getMyCourse()
    },
    addCourse () {
      this.dialogVisible = true
    },
    pickCourseType (type) {
      if (type === 1) {
        this.$router.push({
          name: 'CourseMyAdd'
        })
      } else {
        this.$router.push({
          name: 'CourseMyAddFirst'
        })
      }
    },
    toDetail (id) {
      this.$router.push(`/index/coursemydetail${id}`)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.course-my
  width 100%
  margin 0 auto
  .icon-zitikuicon-
    font-size 14px
.search
  width 100%
  height .4rem
  position relative
  margin 0 auto .15rem
  display flex
  align-items center
  .el-input
    width 3rem
    margin-right 5px
  .el-select-custom
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
    width 1rem
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
>>>.el-dialog__body
  padding 0 !important
  justify-content flex-start!important
>>>.el-dialog__header
  display flex
  font-weight 600
>>>.course-footer
  justify-content flex-start!important
>>>.el-dialog--center
  height 3.6rem !important
>>>.course
  width 3.9rem!important
>>>.el-dialog__close:hover
  color #6cddc7!important
</style>
