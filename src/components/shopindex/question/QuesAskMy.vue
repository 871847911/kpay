<template>
    <section>
        <!-- 可能共有 标题区域 -->
        <div v-if="isActive == 4">
            <div class="header layout-head">
                <h3>提问我的</h3>
            </div>
            <table-same :ques_date="state_date" :answer_P="state_P" :tabs_name="activeName"></table-same>
        </div>
        <no-active v-if="isActive == 3"></no-active>
    </section>
</template>

<script>
import { mapGetters } from "vuex";
import TableSame from "../../common/TableSame";
import NoActive from "components/common/NoActive";
export default {
  name: "QuesAskMy",
  data() {
    return {
      state_date: false,
      state_P: true,
      msg: "QuesAskMy",
      activeName: "asking_my"
    };
  },
  components: {
    TableSame,
    NoActive
  },
  computed: {
    ...mapGetters(["isActive", "roleId"])
  }
};
</script>

<style lang="stylus" scoped>
section {
    width: 100%;
    margin: 0 auto;
}
</style>