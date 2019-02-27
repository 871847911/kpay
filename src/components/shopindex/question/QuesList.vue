<template>
    <section>
      <div  v-if="isActive == 4">
        <div class="header layout-head">
            <h3>问题列表</h3>
            <el-button type="primary" @click="addQues" v-if="activeName=='ques_area'">添加问题</el-button>
        </div>
        <div class="tabs_box">
            <el-tabs v-model="activeName" @tab-click="handleClick">
                <el-tab-pane label="问答专区" name="all_area">
                    <table-same :ques_date="state_date" :answer_P="state_P" :tabs_name="activeName" v-if="activeName == 'all_area'"></table-same>
                </el-tab-pane>
                <el-tab-pane label="我的提问" name="ques_area">
                    <table-same :ques_date="state_date" :answer_P="state_P" :tabs_name="activeName" v-if="activeName=='ques_area'"></table-same>
                </el-tab-pane>
            </el-tabs>
        </div>
      </div>
      <no-active v-if="isActive == 3"></no-active>
    </section>
</template>

<script>
import { mapGetters } from "vuex";
import TableSame from "../../common/TableSame";
import NoActive from "components/common/NoActive";
export default {
  name: "QuesList",
  data() {
    return {
      msg: "QuesList",
      activeName: "all_area", //切换 tabs
      state_date: false, //切换共有 时间选择器
      state_P: true //切换列表内容 提问人
    };
  },
  components: {
    TableSame,
    NoActive
  },
  computed: {
    ...mapGetters(["isActive", "roleId"])
  },
  methods: {
    addQues() {
      //调到添加问题的页面
      this.$router.push({ name: "QuesListAdd" });
    },

    handleClick(tab, event) {
      if (tab.name == "ques_area") {
        this.tab_state = false;
        this.state_date = true;
        this.state_P = false;
      } else {
        this.tab_state = true;
        this.state_date = false;
        this.state_P = true;
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
section {
  width: 100%;
  margin: 0 auto;
  font-size: 0.14rem;
  color: #4A4A4A;

  .header {
    .el-button {
      background: #6CDDC7;
      border: 1px solid #6CDDC7;
      color: #FFFFFF;
      font-size: 0.14rem;
    }
  }
}
</style>