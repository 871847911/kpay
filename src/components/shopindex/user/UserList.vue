<template>
    <div class="user-list">
        <div v-if="isActive == 4">
            <div class="layout-head">
              <h2>用户列表</h2>
            </div>
            <div class="search">
                <el-input type="text" placeholder="用户账号" v-model="userName"></el-input>
                <el-input type="text" placeholder="手机号码" v-model="phoneNum"></el-input>
                <el-select v-model="value" placeholder="用户角色" class="el-select-custom" @change="searchUserlist">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                <button class="search-btn" @click="searchUserlist">查询</button>
            </div>
            <div class="list">
                <div class="list-category">
                    <el-table
                        :data="userList"
                        stripe
                        style="width: 100%">
                        <el-table-column
                            align="center"
                            prop="username"
                            label="用户账号"
                            min-width="130">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="phone"
                            label="手机号码"
                            min-width="110">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="roleId"
                            label="角色"
                            min-width="90">
                            <template slot-scope="scope">
                                <i class="iconfont icon-shengchanzhe-" v-if="scope.row.roleId  == 2"></i>
                                <i class="iconfont icon-xiaofeizhe-" v-else-if="scope.row.roleId  == 3"></i>
                                <span v-if="scope.row.roleId == 2">生产者</span>
                                <span v-else-if="scope.row.roleId == 3">消费者</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="code"
                            label="用户编号"
                            min-width="150">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="createDate"
                            label="注册日期"
                            min-width="160">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="userInfo.passDate"
                            label="入驻日期"
                            min-width="160">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="userInfo.idCardNum"
                            label="身份证号码"
                            min-width="170">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="status"
                            label="状态"
                            min-width="70">
                            <template slot-scope="scope">
                                <i class="span-normal" v-if="scope.row.status == 10"></i>
                                <i class="span-error" v-else></i>
                                <span v-if="scope.row.status == 10">正常</span>
                                <span v-else>异常</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="handle"
                            label="操作"
                            min-width="80">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="toDetail(scope.row.id, scope.row.roleId)">查看</el-button>
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
        <no-active v-if="isActive == 3" @reFresh="searchUserlist"></no-active>
    </div>
</template>

<script>
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
import {mapGetters} from 'vuex'
export default {
  name: 'UserList',
  data () {
    return {
      userList: [], // 列表数据
      currentPage: 1, // 当前第几页
      pageSize: 10, // 每页条数
      total: 0, // 总条数
      dialogVisible: false,
      options: [{
        value: '',
        label: '全部'
      },{
        value: '2',
        label: '讲师'
      }, {
        value: '3',
        label: '读者'
      }],
      value: '', // 搜索条件下的用户角色
      userName: '', // 搜索条件下的用户名
      phoneNum: '' // 搜索条件下的手机号
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
  created () {
    this.searchUserlist()
  },
  methods: {
    searchUserlist () {
      let that = this
      api.searchUserlist({
        userName: that.userName,
        phoneNum: that.phoneNum,
        roleId: that.value,
        page: that.currentPage,
        pageSize: that.pageSize
      }).then(res => {
        if (res.success) {
          that.userList = res.data.list
          that.total = res.data.total
        }
      })
    },
    handleSizeChange(val) {
      this.pageSize = val
      this.searchUserlist()
    },
    handleCurrentChange(val) {
      this.currentPage = val
      this.searchUserlist()
    },
    toDetail (id, roleId) {
      this.$router.push({
        path: '/index/userlistdetail',
        query: {
          id: id,
          roleId: roleId
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.icon-shengchanzhe-
  width 0.3rem
  height .03rem
  border-radius 50%
  background-color rgba(245, 166, 35, 0.15)
  color #F5A623
  margin-right .05rem
  font-size 0.2rem
.icon-xiaofeizhe-
  width 0.3rem
  height .03rem
  border-radius 50%
  background-color rgba(74, 144, 226, 0.15)
  color #4A90E2
  margin-right .05rem
  font-size 0.2rem
.span-normal
  display inline-block
  width .06rem
  height .06rem
  border-radius 50%
  background-color $color-theme
  margin-right .04rem
  vertical-align middle
.span-error
  display inline-block
  width .06rem
  height .06rem
  border-radius 50%
  background-color #F52C13
  margin-right .04rem
  vertical-align middle
.user-list
  width 100%
  margin 0 auto
.search
  width 100%
  height .4rem
  position relative
  margin 0 auto .15rem
  .el-input
    width 3rem
  .search-btn
    height .4rem
    fontCenter(.4rem)
    font-size .14rem
    color #fff
    border-radius .05rem
    background $color-theme
    width .7rem
    cursor pointer
.list
  width 100%
  margin 0 auto .33rem
  overflow-x hidden
  overflow-y auto
  border-radius .05rem
  background #fff
  box-sizing border-box
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
