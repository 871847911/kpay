<template>
    <quest-detail></quest-detail>
</template>

<script>
import QuestDetail from "../../common/QuestDetail";
export default {
  name: "QuesAskMyDetail",
  data() {
    return {
      msg: "QuesAskMyDetail",
    };
  },
  components: {
    QuestDetail,
  },
};
</script>

<style lang="stylus" scoped>
section {
    // width: calc(100% - 0.6rem);
    // margin: 0.14rem 0.3rem 0.3rem;
    width:100%;
    margin:0 auto;
    font-size: 0.14rem;
    color: #4A4A4A;
}
</style>