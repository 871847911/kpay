<template>
  <div class="resource-my">
    <div class="app-container" v-if="isActive == 4">
      <div class="layout-head">我的模版</div>
      <div class="select-module-lists">
        <div
          class="module-list mr-20 mb-20 pos-r"
          :class="item.isDeploy?'module-list-active':''"
          @mouseenter="moduleMouseFun(index)"
          @mouseleave="moduleMouseFun()"
          v-for="(item,index) in moduleLists"
          :key="index"
        >
          <div class="module-img">
            <img :src="item.resDomain+item.coverList[0]" style="width:100%;height:100%">
          </div>
          <div class="dis-flex justify-b s-flex-ac mt-20" style="padding-bottom: 10px;">
            <div class="module-h3 ellipsis mr-20">{{item.detail.aliasName}}</div>
            <span class="fb" v-if="item.detail.isDeploy">已发布</span>
          </div>
          <div class="module-info pos-a" v-if="mouseenter&&(module_list_active_index==index)">
            <div class="btn btn-detail" @click="toInfo(item.detail.id)">查看详情</div>
            <div class="btn mt-20 btn-push" @click="handlePush(item.detail.id)">发布</div>
          </div>
        </div>
      </div>
    </div>
    <setApp ref="setApp" :myAppTemplateId="myAppTemplateId" :storeId="storeId"></setApp>
    <no-active v-if="isActive == 3" @reFresh="getQueryTemplate"></no-active>
  </div>
</template>

<script>
import api from "fetch/api";
import { mapGetters } from "vuex";
import setApp from "components/shopindex/template/BindApp";
import NoActive from "components/common/NoActive";

export default {
  name: "ResourceMy",
  data() {
    return {
      moduleLists: [], // 模板列表
      module_list_active_index: "",
      mouseenter: false,
      myAppTemplateId: "" // 我的模板ID
    };
  },
  computed: {
    ...mapGetters(["isActive", "storeId"])
  },
  components: {
    NoActive,
    setApp
  },
  created() {
    this.getQueryTemplate();
  },
  methods: {
    getQueryTemplate() {
      let self = this;

      api.getMyAppTemplateList().then(res => {
        if (res.success) {
          self.moduleLists = res.data;
        }
      });
    },
    moduleMouseFun(index) {
      this.mouseenter = !this.mouseenter;
      this.module_list_active_index = index;
    },
    handlePush(id) {
      // 新发布
      this.myAppTemplateId = id;
      this.$refs.setApp.dialogVisible = !this.$refs.setApp.dialogVisible;
    },
    toInfo(id) {
      this.$router.push({ name: "TemplateInfo", query: { id: id } });
    },
    toPush(id) {
      // 旧版发布
      this.$router.push({ name: "PushTemplate", query: { id: id } });
    }
  }
};
</script>

<style lang="stylus" scoped>
.active {
  border: 2px solid #6cddc7;
}
.resource-my {
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
  border-radius: 5px;
  background-color: #fff;
  display: inline-block;
  vertical-align: middle;
  margin-right: 20px;
  width: 200px;
  padding: 10px;
  transition: all 0.6s;
  transform: translate3d(0, 0, 0);
  border-radius: 5px;
  box-sizing: content-box;
  border: 1px solid #dedbdb;
  .module-h3 {
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
      color: #6cddc7;
    }
  }
  .module-info {
    width: 100%;
    height: 100%;
    z-index: 999;
    top: 0;
    left: 0;
    background: rgba(0, 0, 0, 0.5);
    .btn {
      margin: auto;
      width: 126px;
      background: rgba(255, 255, 255, 1);
      border-radius: 5px;
      font-size: 14px;
      line-height: 39px;
      text-align: center;
      cursor: pointer;
    }
    .btn-detail {
      margin-top: 326px;
      margin-bottom: 20px;
      color: #6cddc7;
    }
    .btn-push {
      background: #6cddc7;
      color: #fff;
    }
  }
}

.module-list-active {
  padding: 10px;
  border: 1px solid #6cddc7;
}

.module-img {
  width: 200px;
  height: 432px;
  margin: auto;
}

.fb {
  display: inline-block;
  width: 60px;
  font-size: 14px;
  color: #6cddc7;
  line-height: 20px;
}
</style>
