<template>
  <div class="app-container">
    <h2 class="mb-20 layout-head">
      代码管理
      <span class="head-right cpt" @click="toBack" style="float: right;">
        <i class="iconfont icon-fanhui"></i>返回
      </span>
    </h2>

    <div class="code_mod mod_default_box code_version_online">
      <div class="mod_default_hd online_version">
        <h4>线上版本</h4>
      </div>
      <div class="mod_default_bd default_box online_version">
        <div class="default_box_inner" v-if="online_version_data">
          <div class="code_version_log dis-flex">
            <div class="code_version_log_hd">
              <div class="simple_preview_item">
                <label class="simple_preview_label" for>版本号</label>
                <p class="simple_preview_value">{{online_version_data.onlineVersion}}</p>
              </div>
            </div>
            <div class="code_version_log_bd flex-1">
              <div class="simple_preview_item dis-flex">
                <label class="simple_preview_label" for>发布者</label>
                <p class="simple_preview_value flex-1 ml-20">{{online_version_data.createUser}}</p>
              </div>
              <div class="simple_preview_item dis-flex">
                <label class="simple_preview_label" for>发布时间</label>
                <p class="simple_preview_value flex-1 ml-20">{{online_version_data.releaseDate}}</p>
              </div>
              <!-- <div class="simple_preview_item dis-flex" v-if="online_version_data.auditReason">
                <label class="simple_preview_label" for="">失败原因</label>
                <p class="simple_preview_value flex-1  ml-20">{{online_version_data.auditReason}}</p>
              </div>-->
            </div>
            <div class="code_version_log_ft">
              <a
                class="btn btn_primary global_dropdown_switch_opr_btn js_version_detail"
                href="javascript:;"
                @click="showDetail"
              >详情</a>
            </div>
          </div>
        </div>
        <div class="default_box_inner" v-else>
          <div class="empty_box">
            <p class="empty_tips">你暂无提交线上的版本或者版本已发布上线</p>
          </div>
        </div>
      </div>
    </div>

    <div class="code_mod mod_default_box code_version_online mt-30">
      <div class="mod_default_hd online_version">
        <h4>审核版本</h4>
      </div>
      <div class="mod_default_bd default_box online_version">
        <div class="default_box_inner" v-if="check_version_data">
          <div class="code_version_log dis-flex">
            <div class="code_version_log_hd">
              <div class="simple_preview_item" style="padding-top: 3px;">
                <label class="simple_preview_label" for>版本号</label>
                <p class="simple_preview_value">{{check_version_data.auditVersion}}</p>
                <p class="js_show_exp_version" v-if="check_version_data.auditStatus == 0">
                  <span class="status_tag info icon_after clickable checking">审核成功</span>
                </p>
                <p class="js_show_exp_version" v-else-if="check_version_data.auditStatus == 1">
                  <span class="status_tag info icon_after clickable checking">审核失败</span>
                </p>
                <p class="js_show_exp_version" v-else-if="check_version_data.auditStatus == 2">
                  <span class="status_tag info icon_after clickable checking">审核中</span>
                </p>
              </div>
            </div>
            <div class="code_version_log_bd flex-1">
              <div class="simple_preview_item dis-flex">
                <label class="simple_preview_label" for>发布者</label>
                <p class="simple_preview_value flex-1 ml-20">{{check_version_data.createUser}}</p>
              </div>
              <div class="simple_preview_item dis-flex">
                <label class="simple_preview_label" for>发布时间</label>
                <p class="simple_preview_value flex-1 ml-20">{{check_version_data.auditTime}}</p>
              </div>
              <div class="simple_preview_item dis-flex" v-if="check_version_data.auditStatus == 1 && check_version_data.auditReason">
                <label class="simple_preview_label" for>失败原因</label>
                <p class="simple_preview_value flex-1 ml-20">{{check_version_data.auditReason}}</p>
              </div>
            </div>
            <div class="code_version_log_ft">
              <a
                class="btn btn_primary global_dropdown_switch_opr_btn js_version_detail"
                href="javascript:;"
                @click="getAuditVersionWithUpdate()"
              >刷新</a>
              <a
                class="btn btn_primary global_dropdown_switch_opr_btn js_version_detail ml-10"
                href="javascript:;"
                @click="postedOnline"
                v-if="check_version_data.auditStatus == 0"
              >发布小程序</a>
            </div>
          </div>
        </div>
        <div class="default_box_inner" v-else>
          <div class="empty_box">
            <p class="empty_tips">你暂无提交审核的版本或者版本已发布上线</p>
          </div>
        </div>
      </div>
    </div>

    <div class="code_mod mod_default_box code_version_online mt-30">
      <div class="mod_default_hd online_version">
        <h4>开发版本</h4>
      </div>
      <div class="mod_default_bd default_box online_version">
        <div class="default_box_inner" v-if="publish_version_data">
          <div class="code_version_log dis-flex">
            <div class="code_version_log_hd">
              <div class="simple_preview_item" style="padding-top: 3px;">
                <label class="simple_preview_label" for>版本号</label>
                <p class="simple_preview_value">{{publish_version_data.version}}</p>
                <p class="js_show_exp_version" @click="showQr">
                  <span class="status_tag info icon_after clickable">
                    体验版
                    <i class="icon_code_qrcode">扫描访问体验版</i>
                  </span>
                </p>
              </div>
            </div>
            <div class="code_version_log_bd flex-1">
              <div class="simple_preview_item dis-flex">
                <label class="simple_preview_label" for>发布者</label>
                <p class="simple_preview_value flex-1 ml-20">{{publish_version_data.modifyUser}}</p>
              </div>
              <div class="simple_preview_item dis-flex">
                <label class="simple_preview_label" for>上传时间</label>
                <p class="simple_preview_value flex-1 ml-20">{{publish_version_data.uploadTime}}</p>
              </div>
              <div class="simple_preview_item dis-flex" v-if="publish_version_data.failureReason">
                <label class="simple_preview_label" for>失败原因:</label>
                <p class="simple_preview_value flex-1 ml-20">{{publish_version_data.failureReason}}</p>
              </div>
            </div>
            <div class="code_version_log_ft">
              <a
                data-openid="oHNoC0SjInP8EhfnEu74hEpyM-d8"
                data-type="2"
                class="btn btn_primary global_dropdown_switch_opr_btn js_version_detail"
                href="javascript:;"
                @click="pushCheck"
              >提交审核</a>
            </div>
          </div>
        </div>
        <div class="default_box_inner" v-else>
          <div class="empty_box">
            <p class="empty_tips">你暂无提交开发的版本或者版本已发布上线</p>
          </div>
        </div>
      </div>
    </div>

    <el-dialog
      title="版本详情"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
      v-if="online_version_data"
    >
      <div class="simple_dialog_content">
        <div class="simple_preview_box">
          <div class="simple_preview_item dis-flex">
            <label class="simple_preview_label" for>版本号</label>
            <div class="simple_preview_value flex-1 ml-10">{{online_version_data.onlineVersion}}</div>
          </div>
          <div class="simple_preview_item dis-flex">
            <label class="simple_preview_label" for>开发者</label>
            <div class="simple_preview_value flex-1 ml-10">{{online_version_data.createUser}}</div>
          </div>
          <div class="simple_preview_item dis-flex">
            <label class="simple_preview_label" for>发布时间</label>
            <div class="simple_preview_value flex-1 ml-10">{{online_version_data.releaseDate}}</div>
          </div>
          <div class="simple_preview_item dis-flex">
            <label class="simple_preview_label" for>描述</label>
            <div class="simple_preview_value flex-1 ml-10">{{online_version_data.notes}}</div>
          </div>
          <!-- <div class="simple_preview_item">
            <label class="simple_preview_label" for="">服务类目信息</label>
            <div class="simple_preview_value">生活服务/婚庆服务 /婚庆
              <p>pages/index/index</p>
            </div>
          </div>-->
          <!-- <div class="simple_preview_item dis-flex">
            <label class="simple_preview_label" for="">提交审核时间</label>
            <div class="simple_preview_value flex-1 ml-10">{{online_version_data.releaseDate}}</div>
          </div>
          <div class="simple_preview_item dis-flex">
            <label class="simple_preview_label" for="">代码提交时间</label>
            <div class="simple_preview_value flex-1 ml-10">2017-11-10</div>
          </div>-->
        </div>
      </div>
    </el-dialog>

    <el-dialog title="扫码访问体验版" :visible.sync="dialogVisible_qr" width="30%" :show-close="false">
      <div class="dialog_bd">
        <div class="exp_version_box">
          <div class="exp_version_result">
            <p class="code_qrcode_download_tips">管理员体验者可扫描下方二维码即可体验体验版
              <br>(下载保存该二维码)
            </p>
            <div class="frm_control_group url_preview_area dis-flex">
              <label for class="frm_label">路径</label>
              <div class="frm_controls frm_vertical_pt flex-1 ml-20">
                <div class="url_preview" title="pages/index">{{page_index}}</div>
              </div>
            </div>
            <div class="code_qrcode_download_box">
              <div class="code_qrcode">
                <div class="pic_code_qrcode_wrp">
                  <img class="pic_code_qrcode" :src="'http://'+appQr" alt>
                  <span class="code_qrcode_program_icon" style></span>
                </div>
                <strong
                  v-if="publish_version_data"
                  class="code_qrcode_title mt-10"
                  style="display:block;"
                >{{publish_version_data.appName}}体验版</strong>
              </div>
              <div class="code_qrcode_text mt-20">
                <a
                  class="btn btn_primary js_download_exp_qrcode"
                  href="javascript:;"
                  @click="downQr"
                >下载二维码</a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <span slot="footer" class="dialog-footer">
        <el-button @click="dialogVisible_qr = false">关闭</el-button>
      </span>
    </el-dialog>

    <checkTpl ref="check_Tpl" :pageIndex="page_index" @refresh="getAuditVersion"></checkTpl>
  </div>
</template>

<script>
import api from "fetch/api";
import { mapGetters } from "vuex";
import checkTpl from "./CheckTpl.vue";
export default {
  data() {
    return {
      dialogVisible: false,
      dialogVisible_qr: false,
      online_version_data: null,
      publish_version_data: null,
      check_version_data: null,
      appQr: "",
      page_index: "" //路径
    };
  },
  components: {
    checkTpl
  },
  created() {
    this.getOnlineVersionNew();
    this.getAppPages();
    this.getLastPublishSettingsInfo();
    this.getAuditVersion();
  },
  methods: {
    //模板路径
    getAppPages() {
      api.getAppPages().then(res => {
        if (res.success && res.data) this.page_index = res.data[0];
      });
    },

    // 发布
    postedOnline() {
      api.postedOnline().then(res => {
        if (res.success) {
          this.$message.success("发布成功");
          this.check_version_data = null;
          this.getOnlineVersionNew()
        } else {
          this.$message.error(res.message);
        }
      });
    },

    // 获取线上版本信息
    getOnlineVersionNew() {
      api.getOnlineVersionNew().then(res => {
        if (res.success) this.online_version_data = res.data;
      });
    },

    // 获取开发版本信息
    getLastPublishSettingsInfo() {
      api.getLastPublishSettingsInfo().then(res => {
        if (res.success) {
          this.publish_version_data = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    // 获取审核版本信息
    getAuditVersion() {
      api.getAuditVersion().then(res => {
        if (res.success) {
          this.check_version_data = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    // 刷新审核版本信息
    getAuditVersionWithUpdate(){
      api.getAuditVersionWithUpdate().then(res => {
        if (res.success && res.data) {
          this.check_version_data = res.data;
          this.$message.success("审核状态更新");
        } else {
          this.$message.error(res.message);
        }
      });
    },

    //展示体验码
    showQr() {
      this.dialogVisible_qr = !this.dialogVisible_qr;

      api.genAppQrcode().then(res => {
        if (res.success) {
          this.appQr = res.data;
        } else {
          this.$message.error(res.message);
        }
      });
    },

    downQr() {
      const date = new Date().getTime();
      let url = `http://${this.appQr}?attname=${date}.jpg`;
      let a = document.createElement("a");
      let event = new MouseEvent("click");

      a.download = this.publish_version_data.appName + "体验码";
      a.href = url;
      a.dispatchEvent(event);
    },

    handleClose(done) {
      done();
    },

    showDetail() {
      this.dialogVisible = !this.dialogVisible;
    },

    pushCheck() {
      this.$refs.check_Tpl.dialogVisible = true;
    },

    toBack() {
      this.$router.back();
    }
  }
};
</script>

<style lang="stylus" scoped>
.app-container {
  width: 100%;
  padding: 0 20px;
}

h2 {
  span {
    color: #9b9b9b;
  }
}

.mod_default_box {
  background-color: #fff;
  border-radius: 4px;
  padding: 20px 30px 30px;
  line-height: 1.6;
}

.mod_default_hd h4 {
  font-weight: 400;
  font-size: 20px;
  margin-bottom: 15px;
  display: inline-block;
  margin-right: 20px;
  margin-bottom: 0;
  padding: 0;
}

.mod_default_hd {
  position: relative;
  margin-bottom: 30px;
}

.code_mod .default_box_inner {
  border: 0;
  padding: 0;
}

.code_version_log:last-child {
  margin-bottom: 0;
  border-bottom: 0;
  padding-bottom: 0;
}

.code_version_log {
  margin-bottom: 30px;
  padding-bottom: 30px;
  border-bottom: 1px solid #e7e7eb;
}

.code_version_log_hd {
  float: left;
  width: 220px;
}

.code_version_log .simple_preview_label {
  color: #9a9a9a;
  font-size: 14px;
}

.code_version_log_hd .simple_preview_value {
  font-size: 22px;
  display: block;
  padding-top: 2px;
}

.code_version_log_hd .simple_preview_item {
  padding-top: 0 !important;
  margin-top: -4px;
}

.simple_preview_value {
  font-size: 14px;
  word-wrap: break-word;
  word-break: break-all;
}

.simple_preview_item {
  padding-top: 14px;
}

.code_version_log_ft {
  float: right;
  margin-left: 30px;
}

.simple_preview_label {
  color: #9a9a9a;
  width: 6em;
}

.global_dropdown_switch_opr {
  position: relative;
  display: inline-block;
  vertical-align: middle;
  cursor: pointer;
  font-size: 0;
  color: #9a9a9a;
}

.global_dropdown_switch_opr .global_dropdown_switch_opr_btn {
  min-width: 30px;
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

.status_tag {
  font-size: 12px;
  padding: 2px;
  margin-left: 10px;
  border-radius: 2px;
  display: inline-block;
  line-height: 1;
  vertical-align: middle;
  margin-top: -0.2em;
}

.status_tag:first-child {
  margin-left: 0;
}

.status_tag.info {
  color: #00acff;
  border: 1px solid #00acff;
}

.status_tag.clickable.info {
  cursor: pointer;
  width: auto;
}

.icon_code_qrcode {
  cursor: pointer;
  background: url(https://res.wx.qq.com/wxopenres/zh_CN/htmledition/comm_htmledition/style/page/code/index_z_@all38267d.png)
    0 0 no-repeat;
  width: 12px;
  height: 12px;
  vertical-align: middle;
  display: inline-block;
  line-height: 300px;
  overflow: hidden;
  margin-top: -2px;
}

.exp_version_box .code_qrcode_download_tips {
  padding-bottom: 30px;
  text-align: center;
  line-height: 1.6;
}

.exp_version_primary_dialog .url_preview_area {
  padding-top: 22px;
  padding-bottom: 30px;
}

.url_preview_area {
  word-wrap: break-word;
  word-break: break-all;
  border-top: 1px solid #e7e7eb;
  padding-top: 16px;
  padding-bottom: 20px;
}

.code_qrcode_download_box {
  text-align: center;
}

.exp_version_box .code_qrcode {
  display: inline-block;
  vertical-align: top;
  padding: 12px;
  background-color: #f6f8f9;
}

.pic_code_qrcode {
  width: 165px;
  height: 165px;
  display: inline-block;
}

.empty_tips.empty_tips {
  padding: 100px 0;
  text-align: center;
  font-size: 14px;
  color: #9a9a9a;
}

.code_mod .empty_tips {
  padding: 60px 0;
}

.checking {
  color: #6cddc7 !important;
  border-color: #6cddc7 !important;
}
</style>
