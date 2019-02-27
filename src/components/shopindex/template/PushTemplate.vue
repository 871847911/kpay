<template>
  <div class="app-container">
    <div class="h1 mb-20 dis-flex justify-b">发布管理
      <span class="head-right cpt" @click="toBack">
        <i class="iconfont mr-5 icon-fanhui"></i>返回</span>
    </div>

    <div class="bg-white pd20">
      <div class="col_main_app bg-white ">
        <div class="tit mb-20">小程序绑定信息</div>
        <el-form :rules="rules" :label-position="labelPosition" label-width="120px" :model="formApp" class="formLabel">
          <el-form-item label="小程序名称" v-if="!!formApp.appName">
            {{formApp.appName}}
          </el-form-item>
          <el-form-item label="APPID" prop="appId">
            <el-input v-model="formApp.appId" placeholder="请输入小程序APPID"></el-input>
          </el-form-item>
          <el-form-item label="APPSecret" prop="secret">
            <el-input v-model="formApp.secret" placeholder="请输入小程序秘钥"></el-input>
          </el-form-item>
          <el-form-item label="授权绑定">
            <div class="bind-app">
              <span>{{!isAuthType?'未授权绑定小程序':'已授权'}}</span>
              <span class="bind-btn ml-10" @click="bindApp" v-if="!isAuthType_ing">{{!isAuthType?'点击授权':'重新授权'}}</span>
              <el-button type="text" class="ml-10" style="margin-top:-4px" @click="isAuth" v-if="isAuthType_ing">点击刷新获取授权状态</el-button>
            </div>
          </el-form-item>
          <el-form-item label="上传代码">
            <span class="bind-btn" @click="setApp">上传小程序</span>
          </el-form-item>
          <el-form-item label="代码管理" v-if="!!formApp.appName">
            <span class="bind-btn" @click="goManageTpl">进入管理</span>
          </el-form-item>
          <el-form-item>
            <el-button class="major-btn" @click="updateProgram('formApp')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="col_main bg-white">
        <div class="tit mb-20">公众号绑定
          <el-popover
            placement="top-start"
            width="50"
            trigger="hover"
            content="该公众号需已通过微信验证，未验证的公众号无法提供相关服务。">
            <p slot="reference">
              <i class="iconfont icon-zhuyi"></i>
            </p>
          </el-popover>
        </div>
        <el-form :rules="rules" :label-position="labelPosition" label-width="130px" :model="publicNum" class="formLabel">
          <el-form-item label="APPID" prop="h5AppId">
            <el-input v-model="publicNum.h5AppId" placeholder="请输入APPID"></el-input>
          </el-form-item>
          <el-form-item label="APPSecret" prop="h5Secret">
            <el-input v-model="publicNum.h5Secret" placeholder="请输入APPSecret"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button class="major-btn" @click="updateH5Config">保存</el-button>
          </el-form-item>
        </el-form>
      </div>

      <div class="col_main bg-white">
        <div class="tit mb-20">商户支付设置</div>
        <el-form :rules="rules" :label-position="labelPosition" label-width="130px" :model="formMch" class="formLabel">
          <el-form-item label="微信支付商户号" prop="mchId">
            <el-input v-model="formMch.mchId" placeholder="请输入微信支付商户号"></el-input>
          </el-form-item>
          <el-form-item label="支付API密钥" prop="payKey">
            <el-input v-model="formMch.payKey" placeholder="请输入支付API密钥"></el-input>
          </el-form-item>
          <el-form-item label="支付证书">
            <el-upload
              action="888"
              class="upload-demo"
              :before-upload="beforeUpload"
              >
              <el-button size="small"><i class="iconfont icon-shangchuan"></i>上传文件</el-button>
              <p style="margin: 0;" slot="tip" class="el-upload__tip">只能上传.p12文件，且不超过500kb</p>
            </el-upload>
          </el-form-item>
          <el-form-item>
            <el-button class="major-btn" @click="updateProgram('formMch')">保存</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
    <setApp ref="setApp" :myAppTemplateId="myAppTemplateId" :storeId="storeId"></setApp>
  </div>
</template>

<script>
import api from "fetch/api";
import { mapGetters } from "vuex";
import setApp from "./BindApp.vue";

export default {
  data() {
    return {
      myAppTemplateId: "", //我的模板ID
      labelPosition: "right",
      formApp: {
        //小程序绑定信息
        appName: "",
        appId: "",
        secret: ""
      },
      formMch: {
        //商户号绑定
        mchId: "",
        payKey: ""
      },
      publicNum: {
        //商户号绑定
        h5AppId: "",
        h5Secret: ""
      },
      isAuthType: false, //未绑定
      isAuthType_ing: false, //绑定查询中
      rules: {
        mchId: [
          { required: true, message: "请输入微信支付商户号", trigger: "blur" }
        ],
        payKey: [
          { required: true, message: "请输入支付API密钥", trigger: "blur" }
        ],
        secret: [
          { required: true, message: "请输入小程序秘钥", trigger: "blur" }
        ],
        appName: [{ message: "小程序名称", trigger: "blur" }],
        appId: [
          { required: true, message: "请输入公众号APPID", trigger: "blur" }
        ],
        h5AppId: [
          { required: true, message: "请输入公众号APPID", trigger: "blur" }
        ],
        h5Secret: [
          { required: true, message: "请输入公众号APPSecret", trigger: "blur" }
        ]
      }
    };
  },
  components: {
    setApp
  },
  computed: {
    ...mapGetters(["storeId"])
  },
  created() {
    let self = this;
    self.myAppTemplateId = this.$route.query.id;
  },
  mounted() {
    let self = this;
    self.isAuth();
    self.getWechatConfigInfo();
  },
  methods: {
    isAuth() {
      let self = this;
      api.isAuth({ storeId: self.storeId }).then(res => {
        self.isAuthType_ing = false;
        if (res.success) {
          self.isAuthType = true;
        }
      });
    },
    updateProgram(formName) {
      let self = this;
      api.updateProgram(self[`${formName}`]).then(res => {
        if (res.success) {
          self.$message({
            message: "保存成功",
            type: "success"
          });
        } else {
          self.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    getWechatConfigInfo() {
      let self = this;
      api.getWechatConfigInfo({ storeId: self.storeId }).then(res => {
        if (res.success) {
          const {
            h5AppId,
            h5Secret,
            appName,
            appId,
            secret,
            mchId,
            payKey
          } = res.data;

          self.formApp = {
            // 小程序绑定信息
            appName,
            appId,
            secret
          };
          self.formMch = {
            // 商户号绑定
            mchId,
            payKey
          };
          self.publicNum = {
            // 公众号绑定
            h5AppId,
            h5Secret
          };
        }
      });
    },
    bindApp() {
      let self = this;
      self.isAuthType_ing = true;
      window.open(
        "/backend/wechat/componentloginpage?storeId=" +
          self.storeId +
          "&appId=" +
          self.formApp.appId,
        "_target"
      );
    },
    setApp() {
      this.$refs.setApp.dialogVisible = !this.$refs.setApp.dialogVisible;
    },
    goManageTpl() {
      let self = this;
      this.$router.push({
        name: "ManageTpl",
        query: {
          myAppTemplateId: self.myAppTemplateId,
          storeId: self.storeId,
          appName: self.formApp.appName
        }
      });
    },
    toBack() {
      this.$router.back();
    },
    // 上传钱判断
    beforeUpload(file) {
      const isP12 = file.type === "application/x-pkcs12";
      const isLt2M = file.size / 1024 / 1024 < 0.5;

      if (!isP12) {
        this.$message.error("上传证书只能是 P12 格式!");
      }
      if (!isLt2M) {
        this.$message.error("上传证书大小不能超过 500KB!");
      }

      if (isP12 && isLt2M) {
        let fd = new FormData();

        fd.append("apiclientCertFile", file);
        api.updatePayCert(fd).then(res => {
          if (res.success) {
            this.$message.success("上传证书成功");
          } else {
            this.$message.error("上传证书失败");
          }
        });
      }
      return false;
    },
    // 更新公众号appid
    updateH5Config() {
      api
        .updateH5Config({
          ...this.publicNum
        })
        .then(res => {
          if (res.success) {
            this.$message({
              message: "保存成功",
              type: "success"
            });
          } else {
            this.$message({
              message: res.message,
              type: "error"
            });
          }
        });
    }
  }
};
</script>
<style scoped lang="stylus">
.app-container {
  width: 100%;
  margin: 0 auto;
}

.iconfont {
  cursor: pointer;
}

.tit {
  font-size: 14px;
  color: rgba(155, 155, 155, 1);
  line-height: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid #ebeef5;
}

.formLabel {
  width: 50%;
  margin: auto;
}

.bind-app {
  color: rgba(155, 155, 155, 1);
}

.bind-btn {
  color: rgba(26, 169, 123, 1);
  cursor: pointer;
}
</style>
