<template>
    <div class="Htitle layout-head">
        <span>{{text !=="{}"?'编辑专栏':'添加专栏'}}</span>
        <div class="come-back" @click="goBack"><i class="iconfont icon-fanhui"></i>返回</div>
    </div>
</template>

<script>
export default {
  name: "htitle",
  data() {
    return {
      msg: "头部共有",
      text:''
    };
  },
  created(){
    this.transform()
  },
  mounted(){
  },
  methods: {
    transform(){
      this.text = JSON.stringify(this.$route.query)
    },
    goBack(){
      this.$router.back()
    }
  }
};
</script>

<style lang="stylus" scoped>
.Htitle
  .iconfont
   font-size 0.15rem
   margin-right .05rem
</style>