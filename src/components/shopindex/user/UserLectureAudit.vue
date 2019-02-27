<template>
    <div class="user-audit">
        <div v-if="isActive == 4">
            <div class="search">
                <el-input type="text" placeholder="申请人" v-model="name" :maxlength="10"></el-input>
                <el-select v-model="value" class="el-select-custom" placeholder="状态" @change="searchAuditlist">
                    <el-option
                        v-for="item in options"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value">
                    </el-option>
                </el-select>
                
                <button class="search-btn" @click="searchAuditlist()">查询</button>
            </div>

            <div class="list">
                <div class="list-category">
                    <el-table
                        :data="auditList"
                        stripe
                        style="width: 100%">
                        <el-table-column
                            align="center"
                            prop="contact"
                            label="申请人"
                            min-width="160">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="applyDate"
                            label="申请时间"
                            min-width="160">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="phone"
                            label="手机号码"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="nickName"
                            label="微信昵称"
                            min-width="120">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="idCardNum"
                            label="身份证号码"
                            min-width="170">
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="city"
                            label="所在地区"
                            min-width="120">
                            <template slot-scope="scope">
                                <span>{{scope.row.province+scope.row.city}}</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="applyStatus"
                            label="状态"
                            min-width="80">
                            <template slot-scope="scope">
                                <span v-if="scope.row.applyStatus==10" style="color:#4A90E2;">待处理</span>
                                <span v-if="scope.row.applyStatus==20" style="color:#6CDDC7;">已通过</span>
                                <span v-if="scope.row.applyStatus==30" style="color:#F42C21;">拒绝</span>
                            </template>
                        </el-table-column>
                        <el-table-column
                            align="center"
                            prop="handle"
                            label="操作"
                            min-width="170">
                            <template slot-scope="scope">
                                <el-button size="mini" @click="toDetail(scope.row.id)">查看</el-button>
                                <el-button size="mini" v-if="scope.row.applyStatus!=10">通过</el-button>
                                <el-button size="mini" v-else @click="toPass(scope.row.id)">通过</el-button>
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
                    :page-sizes="[5, 10, 15, 20, 25]"
                    :total="total">
                </el-pagination>
            </div>
        </div>
        <no-active v-if="isActive == 3" @reFresh="searchAuditlist"></no-active>
    </div>
</template>

<script>
import api from "fetch/api";
import NoActive from "components/common/NoActive";
import { mapGetters } from "vuex";

export default {
  name: "UserLectureAudit",
  data() {
    return {
      currentPage: 1, // 当前第几页
      pageSize: 10, // 每页条数
      total: 0, // 总条数
      dialogVisible: false,
      options: [
        {
          value: "",
          label: "全部"
        },
        {
          value: "10",
          label: "待处理"
        },
        {
          value: "20",
          label: "通过"
        },
        {
          value: "30",
          label: "已拒绝"
        }
      ],
      value: "", // 搜索条件下的用户角色
      name: "", // 搜索条件下的申请人
      auditList: [] // 审核列表
    };
  },
  computed: {
    ...mapGetters(["isActive"])
  },
  components: {
    NoActive
  },
  created() {
    this.searchAuditlist();
  },
  methods: {
    toPass(id) {
      let that = this;
      api
        .auditPass({
          userId: id,
          status: 20,
          reason: ""
        })
        .then(res => {
          if (res.success) {
            this.$router.push({
              path:`/index/userlectureauditdetail${id}`
            });
          } else {
            this.$message.error("审核未通过！");
          }
        });
    },
    searchAuditlist() {
      let that = this;
      api
        .getAuditList({
          name: that.name,
          applyStatus: that.value,
          page: that.currentPage,
          pageSize: that.pageSize
        })
        .then(res => {
          if (res.success) {
            that.auditList = res.data.list;
            that.total = res.data.total;
          }
        });
    },
    handleSizeChange(val) {
      this.pageSize = val;
      this.searchAuditlist();
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      this.searchAuditlist();
    },
    toDetail(id) {
      this.$router.push(`/index/userlectureauditdetail${id}`);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/mixins';
@import '~assets/styles/varibles';

.user-audit {
  width: 100%;
  margin: 0 auto;
}

.head-name {
  width: 100%;
  height: 0.28rem;
  line-height: 0.28rem;
  color: #9B9B9B;
  font-size: 0.2rem;
  margin: 0 auto 0.2rem;
}

.search {
  width: 100%;
  height: 0.4rem;
  margin-bottom: 0.2rem;
  display: flex;

  .el-input {
    width: 3rem;
    margin-right: 5px;
  }

  .el-select-custom {
    margin-right: 5px;
  }

  .search-btn {
    height: 0.4rem;
    font-size: 0.14rem;
    color: #FFFFFF;
    border-radius: 0.05rem;
    background: #6CDDC7;
    width: 0.7rem;
    cursor: pointer;
  }
}

.list {
  width: 100%;
  margin: 0 auto 0.2rem;
  overflow-x: hidden;
  overflow-y: auto;
  border-radius: 0.05rem;
  background: #fff;

  .list-category {
    width: 100%;
    padding: 0.2rem;
    box-sizing: border-box;
  }
}

.pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 0.2rem;
    margin-bottom: 0.27rem;
  }
</style>
