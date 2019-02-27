<template>
  <div class="auth-program">
    <div v-if="isActive == 4">
      <h3 class="layout-head">小程序授权发布</h3>

      <div class="wrapper">
        <el-tabs v-model="activeName">
          <el-tab-pane label="小程序授权" name="auth">
            <div class="auth-content">
              <AuthorizationProgram
                v-if="authData.status === 1"
                :authData="authData"
                @refresh="init"
              />
              <UnAuthorization
                v-if="authData.status !== undefined && authData.status === 0 || authData.status === null"
                :unType="'program'" @refresh="init"
              />
            </div>
          </el-tab-pane>
          <el-tab-pane label="小程序发布" name="publish">
            <div class="program-content">
              <el-radio-group v-model="marketVal" style="margin-bottom: 30px;">
                <el-radio-button label="me">我的模板</el-radio-button>
                <el-radio-button label="third">模板市场</el-radio-button>
              </el-radio-group>

              <div v-if="marketVal === 'me'">
                <ResourceMy/>
              </div>
              <div v-else>
                <ResourceMarket/>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>

    <no-active v-if="isActive == 3"></no-active>
  </div>
</template>

<script>
import api from "fetch/api";
import { mapGetters } from "vuex";
import AuthorizationProgram from "./AuthorizationProgram";
import UnAuthorization from "./UnAuthorization";
import ResourceMy from "../resource/ResourceMy";
import ResourceMarket from "../resource/ResourceMarket";
import NoActive from "components/common/NoActive";

export default {
  name: "AuthSmallProgram",
  data() {
    return {
      activeName: "auth",
      marketVal: "me",
      authData: {},
      isAuthLoading: false
    };
  },
  computed: {
    ...mapGetters(["isActive"])
  },
  components: {
    AuthorizationProgram,
    UnAuthorization,
    ResourceMy,
    ResourceMarket,
    NoActive
  },
  created() {
    this.init();
  },
  methods: {
    init(isToast) {
      api
        .getAuthorizerInfo({
          authorizeType: 2
        })
        .then(res => {
          if (res.success) {
            this.authData = res.data;

            if(isToast){ this.$message.success('授权成功！') }
          } else {
            this.$message.error(res.message);
          }
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
>>>.el-tabs__header 
  padding 0 0.2rem
.auth-program 
  width 100%
  .wrapper 
    background-color #ffffff
  .auth-content 
    padding 0.3rem 0.2rem
    box-sizing border-box
    min-height 6.5rem
  .program-content 
    padding 0.1rem 0.2rem
    box-sizing border-box
    min-height 6.5rem
</style>
