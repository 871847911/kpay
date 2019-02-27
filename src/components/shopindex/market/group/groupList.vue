<template>
    <div class='group'>
        <div v-if="isActive == 4">
            <div class="layout-head">
                <span>拼团管理</span>
                <el-button class="major-btn" size="small" @click="setNewGroup">新建拼团</el-button>
            </div>
            <div class="serch_box">
                <el-input class="width300" v-model.trim="goodsName" maxlength="15" placeholder="商品名称"></el-input>
                <el-button class="major-btn" @click="getGroupList">搜索</el-button>
            </div>
            <div class="content_box">
                <el-radio-group v-model="status" class="radio_box" @change="listStatusChange">
                    <el-radio-button :label="null">全部</el-radio-button>
                    <el-radio-button label="0">未开始</el-radio-button>
                    <el-radio-button label="1">进行中</el-radio-button>
                    <el-radio-button label="-1">已结束</el-radio-button>
                    <el-radio-button label="-2">已关闭</el-radio-button>
                </el-radio-group>
                <el-table :data="tableData" stripe class="table_box" style="width : 100%;max-width : 1600px;">
                    <el-table-column type="index" label="序号" :index="indexMethod" width="80px" align="center"></el-table-column>
                    <el-table-column label="课程名称" min-width="200px">
                        <template slot-scope="scope">
                            <div class="user_img_box">
                                <img :src="$store.state.imageHead + scope.row.courseCover" width="80px" height="60px" alt="">
                                <p class="user_name">{{scope.row.coursName}}</p>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column  label="活动时间"  align="center">
                        <template slot-scope="scope">
                            <p>{{getTimestep(new Date(scope.row.startTime).getTime())}}</p>
                            <p>{{getTimestep(new Date(scope.row.endTime).getTime())}}</p>
                        </template>
                    </el-table-column>
                    <el-table-column prop="openGroupNum"   label="开团数" align="center"></el-table-column>
                    <el-table-column prop="beGroupNum"   label="成团数" align="center"></el-table-column>
                    <el-table-column prop="beGroupOrderNum"    label="成团订单数" align="center"></el-table-column>
                    <el-table-column prop="inGroupOrderNum"  :render-header="setTableHeader" align="center"></el-table-column>
                    <el-table-column prop="groupPrice"   label="拼团价格" align="center"></el-table-column>
                    <el-table-column prop="activeStatus"  label="活动状态" align="center">
                        <template slot-scope="scope">
                            <div class="status_box">
                                <div v-if="scope.row.activeStatus == '1'">
                                    <div class="ling_one"></div>进行中
                                </div>
                                <div v-if="scope.row.activeStatus == '0'">
                                    <div class="line_two"></div>未开始
                                </div>
                                <div v-if="scope.row.activeStatus == '-1'">
                                    <div class="line_three"></div>已结束
                                </div>
                                <div v-if="scope.row.activeStatus == '-2'">
                                    <div class="line_four"></div>已关闭
                                </div>
                                <!-- 
                                    .ling_one 进行中
                                    .line_two 未开始
                                    .line_three 已结束
                                    .line_four 已关闭
                                -->
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="id"  label="操作" align="center">
                        <template slot-scope="scope">
                            <el-dropdown @command="dropdownclick($event , scope.row)" trigger="click">
                                <span class="el-dropdown-link">
                                    操作<i class="el-icon-arrow-down el-icon--right"></i>
                                </span>
                                <el-dropdown-menu slot="dropdown">
                                    <el-dropdown-item :command="1">查看</el-dropdown-item>
                                    <el-dropdown-item :command="2" v-if="scope.row.activeStatus != '-1' &&  scope.row.activeStatus != '-2'">编辑</el-dropdown-item>
                                    <el-dropdown-item :command="3" v-if="scope.row.activeStatus != '-1' &&  scope.row.activeStatus != '-2'">关闭</el-dropdown-item>
                                </el-dropdown-menu>
                            </el-dropdown>
                        </template>
                    </el-table-column>
                </el-table>
                <div class="page_box">
                    <el-pagination
                        @size-change="handleSizeChange"
                        @current-change="handleCurrentChange"
                        :current-page.sync="pageData.currentPage"
                        :page-size="5"
                        :page-sizes="[5]"
                        layout="prev, pager, next,sizes, jumper"
                        :total="pageData.total">
                    </el-pagination>
                </div>
            </div>  
        </div>

        <no-active v-if="isActive == 3" @reFresh="getGroupList"></no-active>
    </div>
</template>

<script>
import api from "fetch/api";
import NoActive from "components/common/NoActive";
import { mapGetters } from "vuex";

export default {
  name: "group",
  data() {
    return {
      goodsName: "",
      status: null,
      tableData: [],
      pageData: {
        currentPage: 1,
        size: 5,
        total: null
      }
    };
  },
  computed: {
    ...mapGetters(["isActive"])
  },
  components: {
    NoActive
  },
  created() {
    this.getGroupList();
  },
  methods: {
    getGroupList() {
      let params = {};
      if (this.status) {
        params = {
          storeId: this.$store.state.storeId,
          courseName: this.goodsName,
          status: this.status,
          page: this.pageData.currentPage,
          pageSize: this.pageData.size
        };
      } else {
        params = {
          storeId: this.$store.state.storeId,
          courseName: this.goodsName,
          page: this.pageData.currentPage,
          pageSize: this.pageData.size
        };
      }
      api.getGroupList(params).then(res => {
        this.tableData = res.data.list;
        this.pageData.total = res.data.total;
      });
    },
    dropdownclick(command, rowData) {
      if (command == 1) {
        // 查看详情
        this.$router.push({
          name: "groupDetail",
          query: {
            groupId: rowData.groupId
          }
        });
      } else if (command == 2) {
        // 编辑
        this.$router.push({
          name: "setGroup",
          query: {
            groupId: rowData.groupId
          }
        });
      } else if (command == 3) {
        this.$confirm(
          "确定将该拼团活动关闭吗？关闭活动不会影响已开团",
          "提示",
          {
            confirmButtonText: "确定",
            cancelButtonText: "取消",
            type: "warning"
          }
        )
          .then(() => {
            // 关闭
            let params = {
              userId: this.$store.state.userId,
              groupId: rowData.groupId,
              groupValidity: rowData.groupValidity,
              peopleNum: rowData.peopleNum,
              groupPrice: rowData.groupPrice,
              status: 0
            };
            api.setGroup(params).then(res => {
              if (res.success == true) {
                this.getGroupList();
                this.$message.success("修改成功");
              } else {
                this.$message.error(res.message);
              }
            });
          })
          .catch(() => {});
      }
    },
    listStatusChange(val) {
      this.getGroupList();
    },
    setNewGroup() {
      this.$router.push({
        name: "newGroup"
      });
    },
    setTableHeader(h, { col, $index }) {
      return (
        <el-popover placement="top-start" width="500" trigger="hover">
          开团数：该活动成功开团的总团数
          <br />
          成团数：该活动拼团成功的总团数
          <br />
          参团订单数：该活动成功支付的订单总数
          <br />
          成团订单数：该活动成团（即订单状态为已成团）的订单总数
          <div slot="reference">
            <span class="cantuan">参团订单数</span>
            <i class="iconfont icon-yiwen" />
          </div>
        </el-popover>
      );
    },
    handleSizeChange(val) {
      this.getGroupList();
    },
    handleCurrentChange(val) {
      this.getGroupList();
    },
    getTimestep(val) {
      let date = new Date(val);
      let year = date.getFullYear();
      let month =
        date.getMonth() < 10
          ? "0" + (date.getMonth() + 1)
          : date.getMonth() + 1;
      // let weekArray = ["星期天","星期一","星期二","星期三","星期四","星期五","星期六"];
      // let weeks = weekArray[date.getDay()];
      let day = date.getDate() < 10 ? "0" + date.getDate() : date.getDate();
      let h = date.getHours() < 10 ? "0" + date.getHours() : date.getHours();
      let m =
        date.getMinutes() < 10 ? "0" + date.getMinutes() : date.getMinutes();
      return year + "-" + month + "-" + day + " " + h + ":" + m;
    },
    indexMethod(index) {
      const cur = this.pageData.currentPage;
      const size = this.pageData.size;

      index++;
      if (cur > 1) {
        index = (cur - 1) * size + index;
      }

      return index;
    }
  }
};
</script>

<style lang="stylus" scoped>
.group {
  .width300 {
    width: 300px;
  }

  .status_box {
    width: 100%;
    overflow: hidden;

    .ling_one, .line_two, .line_three, .line_four {
      width: 6px;
      height: 6px;
      border-radius: 50%;
      background: #6CDDC7;
      float: left;
      margin: 8px 5px 0 0;
    }

    .line_two {
      background: #9B9B9B;
    }

    .line_three {
      background: #F42C21;
    }

    .line_four {
      background: #F5A623;
    }
  }

  width: 100%;
  box-sizing: border-box;
  font-size: 12px;
  overflow-y: scroll;

  .serch_box {
    width: 100%;
    overflow: hidden;
    padding: 0 0 20px 0;
    box-sizing: border-box;

    .serchinput {
      width: 200px;
    }
  }

  .content_box {
    width: 100%;
    box-sizing: border-box;

    .user_img_box {
      display: flex;
      line-height: 30px;

      .user_name {
        font-size: 14px;
        color: #4A4A4A;
        font-weight: 600;
        padding-left: 10px;
      }
    }

    .radio_box {
      .el-radio-button__inner {
        padding: 15px 50px;
        color: #4A4A4A;
        background-color: #ECECEC;
        border-color: #ECECEC;
      }

      .el-radio-button__orig-radio:checked+.el-radio-button__inner {
        color: #4A4A4A;
        background-color: #fff;
        border-color: #fff;
        box-shadow: 0 0 0 0 transparent;
      }
    }

    .table_box {
      width: 100%;
      padding: 20px;

      .cantuan {
        margin-right: 10px;
      }

      .el-table th div {
        padding-left: 0;
      }

      .el-popover__reference {
        height: 35px;
      }
    }
  }

  .page_box {
    margin-top: 20px;
    text-align: right;
  }

  .look_btn {
    background: RGBA(0, 185, 180, 0.15);
    color: #6CDDC7;
    border-color: transparent;
  }

  .set_btn {
    background: RGBA(74, 144, 226, 0.15);
    color: #4A90E2;
    border-color: transparent;
  }

  .close_btn {
    background: RGBA(245, 166, 35, 0.15);
    color: #F5A623;
    border-color: transparent;
  }

  .el-dropdown-link.el-dropdown-selfdefine {
    color: #6CDDC7;
    cursor: pointer;
  }
}
</style>
