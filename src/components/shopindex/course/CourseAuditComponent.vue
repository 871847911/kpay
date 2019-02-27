<template>
    <div class="course-audit">
        <div v-if="isActive == 4">
            <!-- <h2 class="head-name">课程审核</h2> -->
            <div class="search">
                <el-input type="text" placeholder="课程名称" v-model="courseName"></el-input>
                <el-select v-model="value" placeholder="状态" class="el-select-custom">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
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
                            label="课程简介"
                            width="280">
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
                            align="center"
                            prop="userInfo.contact"
                            label="作者">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="price"
                            label="价格">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="modifyDate"
                            label="更新时间">
                        </el-table-column>
                        <!-- <el-table-column
                            align="center"
                            prop="isShow"
                            label="首页展示"
                            min-width="100">
                            <template slot-scope="scope">
                                <el-switch
                                    :active-value="1"
                                    :inactive-value="0"
                                    v-if="scope.row.status == 40"
                                    v-model="scope.row.isShow"
                                    active-color="#1AA97B"
                                    inactive-color="#AEB8BE"
                                    @change="homeDisplay(scope.row.storeId, scope.row.id, scope.row.isShow)">
                                </el-switch>
                            </template>
                        </el-table-column> -->
                        <el-table-column
                            align="center"
                            prop="status"
                            label="状态">
                            <template slot-scope="scope">
                                <i class="iconfont iconfont icon-zitikuicon-" v-if="scope.row.status == 20" style="color:#8561FA;"></i>
                                <i class="iconfont iconfont icon-zitikuicon-" v-if="scope.row.status == 40 || scope.row.status == 50" style="color:#6cddc7;"></i>
                                <i class="iconfont iconfont icon-zitikuicon-" v-if="scope.row.status == 30" style="color:#F42C21;"></i>
                                <span v-if="scope.row.status == 20">审核中</span>
                                <span v-if="scope.row.status == 40 || scope.row.status == 50">已通过</span>
                                <span v-if="scope.row.status == 30">未通过</span>
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
                        :page-sizes="[5, 10, 15, 20, 25]"
                        :total="total">
                    </el-pagination>
                </div>
            </div>
        </div>
        <no-active v-if="isActive == 3" @reFresh="search"></no-active>
    </div>
</template>

<script>
import api from 'fetch/api'
import {mapGetters} from 'vuex'
import NoActive from 'components/common/NoActive'
export default {
  name: 'CourseAuditComponent',
  data () {
    return {
      courseList: [], // 课程列表信息
      value: '', // 课程当前状态值
      pageSize: 10, // 每页显示数量
      total: 0, // 总条数
      currentPage: 1, // 页码
      courseName: '', // 课程名称
      options: [ // 课程状态数组
      {
        value: '',
        label: '全部'
      },
      {
        value: '20',
        label: '审核中'
      }, {
        value: '60',
        label: '已通过'
      }, {
        value: '30',
        label: '未通过'
      }]
    }
  },

  created () {
    this.findAuditCourseMain()
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

  methods: {
    // 首页展示开关
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
          that.findAuditCourseMain()
        }
      })
    },

    // 课程审核详情页
    toDetail(id) {
      this.$router.push(`/index/courseauditdetail${id}`)
    },

    // 查询事件
    search() {
      this.findAuditCourseMain()
    },

    // 获取审核课程列表
    findAuditCourseMain () {
      let that = this
      api.findAuditCourseMain({
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

    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      this.findAuditCourseMain()
    },

    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      this.findAuditCourseMain()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
.course-audit
  width 100%
  margin 0 auto
.head-name
  width 100%
  fontverticalCenter(.28rem)
  color $color-text-l
  font-size $font-size-large
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
  .el-input
    width 3rem
    margin-right 5px
  .el-select-custom
    margin-right 5px
  .search-btn
    fontCenter(.4rem)
    font-size $font-size-medium
    color $color-text-w
    border-radius $radius
    background $color-theme
    width .7rem
    cursor pointer
  .add-categary
    width 1.21rem
    height .4rem
    flex()
    background $color-theme
    border-radius $radius-s
    position absolute
    right 0
    top 0
    cursor pointer
    .el-icon-plus,span
      font-size $font-size-medium
      color $color-text-w
    .el-icon-plus
      font-size $font-size-small
      margin-right .05rem
.list
  width 100%
  margin 0 auto .33rem
  overflowVertical()
  border-radius $radius
  background $color-dialog-background
  .list-category-my
    width 100%
    padding .2rem
    box-sizing border-box
    overflow-x hidden
  .pagination
    display flex
    justify-content flex-end
    align-items center
    padding-right .2rem
    margin-bottom .27rem
</style>
