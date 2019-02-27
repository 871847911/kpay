<template>
  <div class="set-form">
    <el-form ref="formPay" :model="formPay" :rules="rules" label-width="130px" class="formLabel">
      <el-form-item label="微信支付商户号" prop="mchId">
        <el-input v-model="formPay.mchId" placeholder="请输入商户号"></el-input>
      </el-form-item>
      <el-form-item label="支付API密钥" prop="payKey">
        <el-input v-model="formPay.payKey" placeholder="请输入支付密钥"></el-input>
      </el-form-item>
      <el-form-item label="支付证书">
        <el-upload
          :action="url"
          name="apiclientCertFile"
          :before-upload="beforeUpload"
          :on-success="handleSuccess"
          :on-error="handleError"
          :headers="getReqHeader()"
          :with-credentials="true"
          :show-file-list="false"
          class="upload-demo"
          :data="{appId}"
          :limit="1"
          >
          <el-button size="small"><i class="iconfont icon-shangchuan"></i>上传文件</el-button>
          <p style="margin: 0;" slot="tip" class="el-upload__tip">只能上传.p12文件，且不超过500kb</p>
          <span v-if="fileName" style="color:#6cddc7;">已上传文件：{{fileName}}</span>
        </el-upload>
      </el-form-item>
      <el-form-item>
        <el-button class="major-btn" @click="saveAuth('formPay')">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import api from "fetch/api";
import { mapGetters } from "vuex";

let url = `/backend/mgt/wechatAuthorizerInfo/savePayCert`;

if (process.env.NODE_ENV === "development") {
  url = "/local" + url;
}

export default {
  name: "UploadAuth",
  data() {
    return {
      url: url,
      fileName: "",
      formPay: {
        mchId: "",
        payKey: ""
      },
      rules: {
        mchId: [
          { required: true, message: "请输入微信支付商户号", trigger: "blur" }
        ],
        payKey: [
          { required: true, message: "请输入支付API密钥", trigger: "blur" }
        ]
      }
    };
  },
  props:{
    appId: {
      type: String,
      required: true
    },
    data: {
      type: Object
    }
  },
  computed: {
    ...mapGetters(["token"])
  },
  created(){
    if(this.data){
      const {mchId, payKey, certName} = this.data
      this.formPay.mchId = mchId
      this.formPay.payKey = payKey
      this.fileName = certName + '.p12'
    }
  },
  methods: {
    // 保存
    saveAuth(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          api.saveWechatConfig({
            appId: this.appId,
            ...this[`${formName}`]
          }).then(res => {
            if (res.success) {
              this.$message.success("保存成功");
            } else {
              this.$message.error(res.message);
            }
          });
        } else {
          return false;
        }
      });
    },

    getReqHeader() {
      return {
        "X-Auth-Token": this.token
      };
    },

    handleSuccess(res, file) {
      if (res.success) {
        this.fileName = file.name
        this.$message.success("上传证书成功");
      } else {
        this.$message.error("上传证书失败");
      }
    },

    handleError(res, file) {
      this.$message.error("上传证书失败");
    },

    // 上传判断
    beforeUpload(file) {
      const isP12 = file.type === "application/x-pkcs12";
      const isLt2M = file.size / 1024 / 1024 < 0.5;

      if (!isP12) this.$message.error("上传证书只能是 P12 格式!");
      if (!isLt2M) this.$message.error("上传证书大小不能超过 500KB!");

      return isP12 && isLt2M;
    }
  }
};
</script>

<style lang="stylus" scoped>
.set-form 
  max-width 6rem
</style>
