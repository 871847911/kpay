<template>
    <div class="table_box">
        <div class="search">
          <el-input type="text" placeholder="提问标题" v-model="quesTitle" :maxlength="20"></el-input>
          <el-input type="text" placeholder="提问人" v-model="Ask_name" :maxlength="10" v-if="answer_P"></el-input>
            <el-date-picker  v-if="ques_date" class="date_picker_style"
                v-model="eleTimeArr"
                type="datetimerange"
                range-separator=""
                start-placeholder="开始日期"
                end-placeholder="结束日期">
            </el-date-picker>
            <el-select v-model="ques_state" placeholder="问题状态" class="el-select-custom">
                <el-option
                    v-for="(item,index) in ques_state_arr"
                    :key="index"
                    :label="item.label"
                    :value="item.value">
                </el-option>
            </el-select>
            <button class="search-btn" @click="search()">查询</button>
        </div>
        <div class="list">
            <div class="list-style change_height">
                <el-table
                    :data="ListshareArr"
                    stripe
                    style="width: 100%">
                    <el-table-column
                        prop="serialNum"
                        label="问题编号"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        prop="title"
                        label="问题标题"
                        min-width="250">
                    </el-table-column>
                    <el-table-column v-if="answer_P"
                        align="center"
                        label="提问人"
                        min-width="200">
                        <template slot-scope="scope">
                            <span>{{scope.row.anonymity?'匿名':scope.row.nickName}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="createDate"
                        label="提问时间"
                        min-width="200">
                    </el-table-column>
                    <el-table-column
                        prop="questionStatus"
                        label="问题状态"
                        min-width="150">
                        <template slot-scope="scope">
                            <i class="icon_style" :style="{background:scope.row.questionStatus == 0?'#F5A623':'#6CDDC7'}"></i>
                            <span>{{scope.row.questionStatus==0?'待处理':'已答复'}}</span>
                        </template>
                    </el-table-column>
                    <el-table-column
                        prop="handle"
                        label="操作"
                        width="200">
                        <template slot-scope="scope">
                            <el-button size="mini" @click="toDetail(scope.row.id)">查看</el-button>
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
                :page-sizes="[10, 15, 25]"
                :total="total">
            </el-pagination>
        </div>
    </div>
</template>
<script>
import api from "fetch/api";
import { mapGetters } from "vuex";
import Cookies from "js-cookie";
export default {
  name: "TableSame",
  data() {
    return {
      msg: "QuesAskMy",
      quesTitle: "", //问题标题
      Ask_name: "", //提问人
      ques_state: "", //问题的状态 全部10 待处理20 已答复30
      ques_state_arr: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待处理",
          value: 0
        },
        {
          label: "已答复",
          value: 1
        }
      ],
      ListshareArr: [], //列表数据数组
      currentPage: 1, //当前页数
      pageSize: 10, //每页10条
      total: null, //总共的数据条数 列表数组的长度
      eleTimeArr: "", //dateArr
    };
  },
  props: { answer_P: Boolean, ques_date: Boolean, tabs_name: String },
  computed: {
    ...mapGetters([
      "uploadImageHead",
      "imageHead",
      "roleId",
      "storeId",
      "userId"
    ]),
    startTime() {
      if (!this.eleTimeArr) {
        return "";
      }
      return (
        new Date(this.eleTimeArr[0]).toLocaleDateString().replace(/\//g, "-") +
        " " +
        new Date(this.eleTimeArr[0]).toTimeString().substr(0, 8)
      );
    },
    endTime() {
      if (!this.eleTimeArr) {
        return "";
      }
      return (
        new Date(this.eleTimeArr[1]).toLocaleDateString().replace(/\//g, "-") +
        " " +
        new Date(this.eleTimeArr[1]).toTimeString().substr(0, 8)
      );
    }
  },
  methods: {
    getAllList() {
      let params = {
        storeId: this.storeId,
        // storeId:1,//test
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        status: this.ques_state,
        title: this.quesTitle.replace(/\s/g,""),
        askName: this.Ask_name.replace(/\s/g,""),
      };
      api
        .questionList(params)
        .then(res => {
          if (res.success) {
            this.ListshareArr = res.data.list;
            this.total = res.data.total;
            this.pageSize = res.data.pageSize;

          } else {
            this.$message({
              message: res.message,
              center: true
            });
          }
        })
        .catch(res => {
          console.log("请求失败");
        });
    },
    getAskingMy() {
      let params = {
        storeId: this.storeId,
        // storeId:1,//test //this.storeId
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        status: this.ques_state,
        title: this.quesTitle.replace(/\s/g,""),
        askName: this.Ask_name.replace(/\s/g,""),
        lecturerId: this.userId
      };
      api
        .askMe(params)
        .then(res => {
          if (res.success) {
            this.ListshareArr = res.data.list;
            this.total = res.data.total;
          } else {
            this.$message({
              message: res.message,
              center: true
            });
          }
        })
        .catch(res => {
          console.log("请求失败");
        });
    },
    getMyAsking() {
      let params = {
        storeId: this.storeId,
        // storeId:1,//test //this.storeId
        pageNum: this.currentPage,
        pageSize: this.pageSize,
        status: this.ques_state,
        title: this.quesTitle.replace(/\s/g,""),
        startTime: this.startTime,
        endTime: this.endTime,
        questionerId: this.userId //this.userId
        // questionerId: 1,//test
      };
      api
        .myQuestion(params)
        .then(res => {
          if (res.success) {
            this.ListshareArr = res.data.list;
            this.total = res.data.total;
          } else {
            this.$message({
              message: res.message,
              center: true
            });
          }
        })
        .catch(res => {
          console.log("请求失败");
        });
    },
    search() {
      // 1.提问标题 this.quesTitle 2.提问人 this.Ask_name 3.问题的状态 this.ques_state
      if (this.tabs_name == "all_area") {
        this.currentPage = 1;
        this.getAllList();
      } else if (this.tabs_name == "asking_my") {
        this.currentPage = 1;
        this.getAskingMy();
      } else if (this.tabs_name == "ques_area") {
        this.currentPage = 1;
        this.getMyAsking();
      } else {
        this.$message({
          message: "不知道你怎么点的！",
          center: true
        });
      }
    },
    // 查看按钮 （进入问题详情）
    toDetail(id) {
      let url = `${this.$route.name}Detail`;
      this.$router.push({
        name: url,
        query: { quesId: id, pagefrom: this.tabs_name }
      });
    },
    // （分页事件） // （前端需要） 总条数 当前页数 每页显示的数量
    handleSizeChange(val) {
      
    },
    handleCurrentChange(val) {
      this.currentPage = val;
      if (this.tabs_name == "all_area") {
        this.getAllList();
      } else if (this.tabs_name == "asking_my") {
        this.getAskingMy();
      } else if (this.tabs_name == "ques_area") {
        this.getMyAsking();
      } else {
        this.$message({
          message: "非法进入！",
          center: true
        });
      }
    }
  },
  created() {
    if (this.tabs_name == "all_area") {
      this.getAllList();
    } else if (this.tabs_name == "asking_my") {
      this.getAskingMy();
    } else if (this.tabs_name == "ques_area") {
      this.getMyAsking();
    } else {
      this.$message({
        message: "非法进入！",
        center: true
      });
    }
  },
  mounted() {}
};
</script>
<style lang="stylus" scoped>
.table_box {
  // 搜索区域
  .search {
    width: 100%;
    height: 0.4rem;
    margin-bottom: 0.2rem;
    display: flex;
    .el-input{
      width:3rem;
      margin-right: 5px;
    }
     
    .el-select-custom {
      width: 1.4rem;
      height: 0.4rem;
      margin-right: 0.1rem;
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

    .date_picker_style {
      margin-right: 0.1rem;
      width: 3.6rem;
      height: 0.4rem;
      line-height 0.4rem;
      background: #fff;
    }
  }

  // 列表区域
  .list {
    width: 100%;
    margin: 0 auto 0.2rem;
    overflow-x: hidden;
    overflow-y: auto;
    border-radius: 0.05rem;
    background: #fff;
    height: 7.9rem;
    .list-style {
      width: 98%;
      margin: 0.2rem auto 0.3rem;
    }

    .change_height {
      & >>> .el-table__row {
        height: 0.88rem;
      }
      & >>> .icon_style{
        display inline-block
        width .06rem
        height .06rem
        border-radius 50%
        margin-right .04rem
        vertical-align middle
      }
    }
  }

  .pagination {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 0.2rem;
    margin-bottom: 0.48rem;

    & >>> input, & >>> select {
      vertical-align: inherit;
    }

    & >>> li {
      border-radius: 0.04rem;
    }

    & >>> button, & >>> .number, & >>> li.el-icon.more.btn-quicknext.el-icon-more {
      color: #666666;
      background: #FFFFFF;
    }

    & >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
      background: #6CDDC7;
      color: #ffffff;
    }

    & >>> .el-pager li.active:hover {
      color: red;
    }
  }
}
</style>