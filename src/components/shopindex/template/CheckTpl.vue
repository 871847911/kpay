<template>
  <el-dialog title="提交审核" :visible.sync="dialogVisible" width="60%" :before-close="handleClose">
    <div class="mod_form_box">
      <div class>
        <div class="js_step2">
          <div class="code_check_form">
            <div class="frm_fieldset">
              <div class="frm_legend default">
                配置功能页面
                <span class="tips_global">填写正确的信息有利于用户快速搜索出你的小程序</span>
              </div>
              <form class="add_del_area" id="js_setting_list">
                <ul class="add_del_list">
                  <li class="add_del_item js_code_check_item" data-idx="0">
                    <div class="frm_control_group">
                      <label for class="frm_label">功能页面</label>
                      <div class="frm_controls rel">
                        <el-input placeholder="请输入内容" v-model="pageIndex" :disabled="true"></el-input>
                      </div>
                    </div>
                    <div class="frm_control_group">
                      <label for class="frm_label">功能页标题</label>
                      <div class="frm_controls">
                        <el-input placeholder="请输入标题" v-model="pageInfo.title" :maxlength="32"></el-input>
                      </div>
                    </div>
                    <div class="frm_control_group">
                      <label for class="frm_label">所在服务类目</label>
                      <div class="frm_controls">
                        <el-select
                          v-model="check_class_index"
                          placeholder="请选择"
                          @change="selectClass"
                        >
                          <el-option
                            v-for="(item,index) in class_Arr"
                            :label="item.label"
                            :value="index"
                            :key="index"
                          ></el-option>
                        </el-select>
                        <p class="frm_tips">功能页面和服务类目必须一一对应，且功能页面提供的内容必须符合该类目范围</p>
                      </div>
                    </div>
                    <div class="frm_control_group frm_input_tag_control">
                      <label for class="frm_label">标签</label>
                      <div class="frm_controls">
                        <div class="label_search_box">
                          <el-tag
                            :key="tag"
                            v-for="tag in dynamicTags"
                            closable
                            :disable-transitions="false"
                            @close="handleCloseTag(tag)"
                          >{{tag}}</el-tag>
                          <el-input
                            class="input-new-tag"
                            v-if="inputVisible&&(dynamicTags.length<10)"
                            v-model="inputValue"
                            ref="saveTagInput"
                            size="small"
                            @keyup.enter.native="handleInputConfirm"
                            @blur="handleInputConfirm"
                          ></el-input>
                          <el-button
                            v-else-if="dynamicTags.length<10"
                            class="button-new-tag"
                            size="small"
                            @click="showInput"
                          >添加标签</el-button>
                        </div>
                        <p class="frm_tips">标签用回车分开，填写与页面功能相关的标签，更容易被搜索</p>
                      </div>
                    </div>
                  </li>
                </ul>
              </form>
            </div>
            <div class="tool_bar txt-c">
              <a
                class="btn btn_primary"
                id="js_submit"
                href="javascript:;"
                @click="submitAppAudit"
              >提交审核</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  </el-dialog>
</template>

<script>
/* eslint-disable */
import api from "fetch/api";
import { mapGetters } from "vuex";
export default {
  data() {
    return {
      dialogVisible: false,
      pageInfo: {
        address: this.pageIndex, //路径
        title: "首页", //页面的标题
        firstId: "",
        secondId: "",
        thirdId: "",
        firstClass: "",
        secondClass: "",
        thirdClass: "",
        tag: ""
      },
      class_Arr: [], //类目组
      check_class: "",
      check_class_index: "",
      dynamicTags: [],
      inputVisible: false,
      inputValue: "",
      submitAppAuditing: false
    };
  },
  props: ["pageIndex"],
  created() {
    let self = this;
    self.getAppCategory();
  },
  methods: {
    handleClose(done) {
      done();
    },
    handleCloseTag(tag) {
      this.dynamicTags.splice(this.dynamicTags.indexOf(tag), 1);
    },

    showInput() {
      this.inputVisible = true;
      this.$nextTick(_ => {
        this.$refs.saveTagInput.$refs.input.focus();
      });
    },
    handleInputConfirm() {
      let inputValue = this.inputValue;
      if (inputValue) {
        this.dynamicTags.push(inputValue);
      }
      this.inputVisible = false;
      this.inputValue = "";
    },
    getAppCategory() {
      //获取类目
      let self = this;
      api.getAppCategory().then(res => {
        if (res.success) {
          self.class_Arr = res.data;
          self.class_Arr.forEach((item, index) => {
            item.label = "";
            item.firstClass && (item.label = item.firstClass);
            item.secondClass &&
              (item.label = item.label + ">" + item.secondClass);
            item.thirdClass &&
              (item.label = item.label + ">" + item.thirdClass);
          });
        } else {
          self.$message({
            message: res.message,
            type: "error"
          });
        }
      });
    },
    selectClass(e) {
      let self = this;
      self.pageInfo.firstId = self.class_Arr[e].firstId;
      self.pageInfo.secondId = self.class_Arr[e].secondId;
      self.pageInfo.thirdId = self.class_Arr[e].thirdId;
      self.pageInfo.firstClass = self.class_Arr[e].firstClass;
      self.pageInfo.secondClass = self.class_Arr[e].secondClass;
      self.pageInfo.thirdClass = self.class_Arr[e].thirdClass;
    },
    submitAppAudit() {
      let self = this;
      if (self.submitAppAuditing) {
        return self.$message({
          message: "请勿重复提交",
          type: "warning"
        });
      }
      self.submitAppAuditing = true;
      if (self.pageInfo.firstId == "") {
        self.submitAppAuditing = false;
        return self.$message({
          message: "请选择服务类目",
          type: "warning"
        });
      }
      if (self.dynamicTags.length) {
        self.pageInfo.tag = self.dynamicTags.join(" ");
      }
      self.pageInfo.address = self.pageIndex;
      self.pageInfo.publishId = self.$parent.publish_version_data.id;
      api
        .submitAppAudit(self.pageInfo)
        .then(res => {
          self.submitAppAuditing = false;
          if (res.success) {
            self.dialogVisible = false;
            self.$message({
              message: "提交审核成功",
              type: "success"
            });
            self.$emit('refresh')
          } else {
            self.$message({
              message: res.message,
              type: "error"
            });
          }
        })
        .catch(res => {
          self.submitAppAuditing = false;
        });
    }
  }
};
</script>

<style lang="stylus" scoped>
.page_simple .mod_form_box {
  width: 65%;
  min-width: 560px;
  margin: 0 auto;
  line-height: 1.6;
}

.code_check_form {
  width: 450px;
  margin: auto;
}

.frm_legend {
  display: block;
  width: 100%;
  margin-bottom: 25px;
  padding-bottom: 5px;
}

.frm_legend.default {
  font-size: 20px;
  margin-bottom: 25px;
  padding-bottom: 5px;
  font-weight: 400;
}

.frm_legend .tips_global {
  font-size: 14px;
  margin-left: 10px;
}

.add_del_title {
  font-size: 16px;
  margin-bottom: 30px;
}

.frm_label {
  float: left;
  width: 100px;
  margin-top: 10px;
  margin-right: 20px;
  font-size: 14px;
}

.rel {
  position: relative;
}

.frm_controls {
  display: table-cell;
  vertical-align: top;
  float: none;
  width: 300px;
}

.frm_control_group {
  padding-bottom: 30px;
}

.el-select {
  width: 100%;
}

.btn {
  display: inline-block;
  overflow: visible;
  padding: 0 22px;
  height: 30px;
  line-height: 30px;
  vertical-align: middle;
  text-align: center;
  text-decoration: none;
  border-radius: 3px;
  -moz-border-radius: 3px;
  -webkit-border-radius: 3px;
  font-size: 14px;
  border-width: 1px;
  border-style: solid;
  cursor: pointer;
}

.btn_primary {
  background-color: #6cddc7;
  border-color: #6cddc7;
  color: #fff;
}

.frm_tips {
  margin-top: 4px;
  color: #9a9a9a;
}

.el-tag {
  margin-right: 10px;
  margin-bottom: 10px;
}

.button-new-tag {
  height: 32px;
  line-height: 30px;
  padding-top: 0;
  padding-bottom: 0;
}

.input-new-tag {
  width: 90px;
  vertical-align: top;
  box-sizing: border-box;
}
</style>
