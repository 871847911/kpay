<template>
  <div class="auth-public">
    <div v-if="isActive == 4">
      <h3 class="layout-head">公众号授权</h3>

      <div class="auth-content">
        <AuthorizationPublic v-if="authData.status === 1" :authData="authData" @refresh="init" />
        <UnAuthorization  v-if="authData.status !== undefined && authData.status === 0 || authData.status === null" :unType="'public'" @refresh="init" />
      </div>
    </div>

    <no-active v-if="isActive == 3"></no-active>
  </div>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from "vuex";
import AuthorizationPublic from "./AuthorizationPublic";
import UnAuthorization from "./UnAuthorization";
import NoActive from "components/common/NoActive";

export default {
  name: "AuthPublic",
  data() {
    return {
      authData: {}
    };
  },
  computed: {
    ...mapGetters(["isActive"])
  },
  components:{
    AuthorizationPublic,
    UnAuthorization,
    NoActive,
  },
  created(){
    this.init()
  },
  methods: {
    init(isToast){
      api.getAuthorizerInfo({
        authorizeType: 1
      }).then(res => {
        if(res.success){
          this.authData = res.data

          if(isToast){ this.$message.success('授权成功！') }
        }else{
          this.$message.error(res.message)
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
.auth-public
  width 100%
  .auth-content
    padding .3rem .2rem
    background-color #ffffff
</style>
