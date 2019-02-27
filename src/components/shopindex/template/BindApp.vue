<template>
  <el-dialog title="上传小程序" :visible.sync="dialogVisible" width="50%" :before-close="handleClose">
    <div class="col-main txt-c">
      <el-form
        :label-position="labelPosition"
        label-width="120px"
        :model="formLabelAlign"
        :rules="rules"
        ref="ruleForm"
      >
        <el-form-item label="小程序版本号" prop="userVersion">
          <el-input v-model="formLabelAlign.userVersion"></el-input>
        </el-form-item>
        <el-form-item label="说明" prop="userDesc">
          <el-input v-model="formLabelAlign.userDesc"></el-input>
        </el-form-item>
        <div class="form-btn">
          <div class="btn btn-push" @click="commitCode">上传代码</div>
        </div>
      </el-form>
    </div>
  </el-dialog>
</template>

<script>
import api from "fetch/api";
import { mapGetters } from "vuex";
export default {
  props: ["myAppTemplateId", "storeId"],
  data() {
    return {
      dialogVisible: false,
      labelPosition: "left",
      formLabelAlign: {
        userVersion: "",
        userDesc: ""
      },
      pushing: false,
      rules: {
        userVersion: [
          { required: true, message: "请输入小程序版本号", trigger: "blur" }
        ],
        userDesc: [{ required: true, message: "请输入说明", trigger: "blur" }]
      }
    };
  },
  methods: {
    handleClose(done) {
      done();
    },
    commitCode() {
      let self = this;
      if (self.pushing) {
        return self.$message({
          message: "请勿重复提交",
          type: "success"
        });
      }

      self.$refs["ruleForm"].validate(valid => {
        if (!valid) {
          return false;
        } else {
          self.pushing = true;
          self.formLabelAlign["storeId"] = self.storeId;
          self.formLabelAlign["myAppTemplateId"] = self.myAppTemplateId;
          api
            .commitCode(self.formLabelAlign)
            .then(res => {
              self.pushing = false;
              if (res.success) {
                self.$message({
                  message: "保存成功",
                  type: "success"
                });
                self.dialogVisible = false;
                this.$router.push({
                  name: "AuthSmallProgramCode"
                });
              } else {
                self.$message({
                  message: res.message,
                  type: "error"
                });
              }
            })
            .catch(res => {
              self.pushing = false;
            });
        }
      });
    }
  }
};
</script>

<style lang="stylus" scoped>
.col-main {
  width: 60%;
  margin: auto;
}

.form-btn {
  margin-left: 120px;
}

.btn {
  cursor: pointer;
  margin-top: 60px;
  width: 100%;
  height: 40px;
  border-radius: 5px;
  font-size: 14px;
  color: #6cddc7;
  line-height: 40px;
  border: 1px solid #6cddc7;
}
</style>
