<template>
  <div class="resource-market">
    <div class="app-container">
      <div class="layout-head">模版市场</div>
      <div class="select-module-lists">
        <div class="module-list mr-20" @mouseenter="moduleMouseFun(index)" @mouseleave="moduleMouseFun()" :class="mouseenter&&(module_list_active_index==index)?'module-list-active':''"
          @click="toInfo(item.detail.id)" v-for="(item,index) in moduleLists" :key="index">
          <div class="module-img">
            <img :src="item.resDomain+item.coverList[0]" style="width:100%;height:100%" />
          </div>
          <div class="module-h3 ellipsis">
            {{item.detail.name}}
          </div>
          <div class="module-info dis-flex dis-flex-ac">
            <span class="module-type">
              <i class="iconfont icon-gouwuche"></i>{{item.detail.buyNum}}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from "fetch/api";
import { mapGetters } from "vuex";

export default {
  name: "ResourceMarket",
  data() {
    return {
      moduleLists: [], // 模板列表
      mouseenter: false
    };
  },
  computed: {
    ...mapGetters(["isActive"])
  },
  created() {
    let self = this;
    self.getQueryTemplate();
  },
  methods: {
    getQueryTemplate() {
      let self = this;
      api.templateMarketList().then(res => {
        if (res.success) {
          self.moduleLists = res.data;
        }
      });
    },
    moduleMouseFun(index) {
      this.mouseenter = !this.mouseenter;
      this.module_list_active_index = index;
    },
    toInfo(id) {
      this.$router.push({ name: "TemplateDetail", query: { id: id } });
    }
  }
};
</script>

<style scoped lang="stylus">
.resource-market {
  width: 100%;
  margin: 0 auto;
}
.app-container {
  width: 100%;
}

.line {
  text-align: center;
}

/*module-list*/

.module-list {
  display: inline-block;
  vertical-align: middle;
  margin-right: 40px;
  width: 200px;
  padding: 10px;
  transition: all 0.6s;
  transform: translate3d(0, 0, 0);
  border-radius: 5px;
  box-sizing: content-box;
  border: 1px solid #dedbdb;
  .module-h3 {
    margin-top: 17px;
    font-size: 14px;
    color: rgba(74, 74, 74, 1);
    line-height: 20px;
  }
  .module-type {
    margin-top: 2px;
    font-size: 18px;
    color: rgba(245, 166, 35, 1);
    line-height: 25px;
  }
  .module-btn {
    .module-btn-s {
      font-size: 12px;
      color: rgba(26, 169, 123, 1);
    }
  }
}

.module-list-active {
  padding: 10px;
  background-color: #ffffff;
}

.module-img {
  width: 200px;
  height: 432px;
  margin: auto; // background-color: #e0e0e0;
}

.module-list:hover {
  background-color: #fff;
  cursor: pointer;
  box-shadow: 0px 2px 9px 0px rgba(0, 0, 0, 0.35);
  transition: all 0.6s;
  transform: translate3d(0, -2px, 0);
}
</style>
