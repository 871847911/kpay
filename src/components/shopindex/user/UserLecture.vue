<template>
    <section>
      <div v-if="isActive == 4">
          <div class="layout-head">
              <h3>入驻讲师</h3>
              <el-button class="major-btn" style="padding:0 10px" @click="addLecture" v-if="activeName == 'in_lecture'">添加入驻讲师</el-button>
          </div>

          <div class="tabs_box">
              <el-tabs v-model="activeName" @tab-click="handleClick">
                  <el-tab-pane label="入驻讲师" name="in_lecture">
                      <div class="Tabs_one">
                          <!-- 搜索 -->
                          <div class="search">
                              <el-input type="text" placeholder="姓名/手机号" v-model="name_phone" :maxlength="10"></el-input>
                              <el-select v-model="status" class="el-select-custom" @change="tableSearch">
                                  <el-option
                                      v-for="(item,index) in status_Arr"
                                      :key="index"
                                      :label="item.label"
                                      :value="item.value">
                                  </el-option>
                              </el-select>
                              <button class="search-btn" @click="tableSearch()">查询</button>
                          </div>

                          <!-- 列表 -->
                          <div class="list">
                              <div class="list-category change_height">
                                  <el-table
                                      :data="list"
                                      stripe
                                      style="width: 100%">
                                      <el-table-column
                                          align="center"
                                          prop="lectureCode"
                                          label="讲师账号"
                                          min-width="190">
                                          <template slot-scope="scope">
                                              <span>{{!scope.row.lectureCode?'-':scope.row.lectureCode}}</span>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          align="center"
                                          prop="name"
                                          label="姓名"
                                          min-width="200">
                                      </el-table-column>
                                      <el-table-column
                                          align="center"
                                          prop="phone"
                                          label="手机号"
                                          min-width="200">
                                      </el-table-column>
                                      <el-table-column
                                          align="center"
                                          prop="questionStatus"
                                          label="状态"
                                          min-width="190">
                                          <template slot-scope="scope">
                                              <i class="icon_style" :style="{background:scope.row.status == 0?'#F5A623':'#6cddc7'}"></i>
                                              <span>{{scope.row.status==0?'未绑定':'已绑定'}}</span>
                                          </template>
                                      </el-table-column>
                                      <el-table-column
                                          align="center"
                                          prop="handle"
                                          label="操作"
                                          min-width="300">
                                          <template slot-scope="scope">
                                              <el-button size="mini" @click="toCheck(scope.row.lectureId,scope.row.status)">查看</el-button>
                                              <el-button size="mini" @click="toEdit(scope.row.lectureId,scope.row.status)">编辑</el-button>
                                              <el-button size="mini" @click="toDelete(scope.row.lectureId)" v-if="!scope.row.status">删除</el-button>
                                              <el-button size="mini" @click="QRcode(scope.row.lectureId,scope.row.name,scope.row.phone)" v-if="!scope.row.status">二维码</el-button>
                                          </template>
                                      </el-table-column>
                                  </el-table>
                              </div>
                          </div>

                          <!-- 分页 -->
                          <div class="pagination">
                              <el-pagination
                                  background
                                  @size-change="handleSizeChange"
                                  @current-change="handleCurrentChange"
                                  :current-page.sync="pageNum"
                                  :page-size="pageSize"
                                  layout="prev, pager, next, sizes, jumper"
                                  :page-sizes="[5, 10, 15, 25]"
                                  :total="total">
                              </el-pagination>
                          </div>

                          <!-- 弹窗层 -->
                          <el-dialog
                              :visible.sync="centerDialogVisible"
                              width="6.4rem"
                              center>
                              <div>
                                  <el-alert
                                      title="请把该二维码发给对方，对方扫码后绑定手机"
                                      type="warning"
                                      show-icon>
                                  </el-alert>
                                  <div class="QR_content">
                                      <p>{{this.real_name}}</p>
                                      <p>{{this.phone}}</p>
                                      <canvas id="canvas"></canvas>
                                      <a href="javascript:;" download="" id="download">保存至本地</a>
                                  </div>
                              </div>
                          </el-dialog>

                      </div>
                  </el-tab-pane>
                  <el-tab-pane label="入驻申请" name="apply_for_lecture">
                      <!-- <div>放原本模块</div> -->
                      <user-audit></user-audit>
                  </el-tab-pane>
              </el-tabs>
          </div>
      </div>
      <no-active v-if="isActive == 3" @reFresh="searchUserlist"></no-active>
    </section>
</template>

<script>
import api from "fetch/api";
import UserAudit from "./UserLectureAudit";
import {mapGetters} from 'vuex'

export default {
  name: "UserLecture",
  components: {
    UserAudit
  },
  data() {
    return {
      initstate: true,
      activeName: "in_lecture",
      status_Arr: [
        {
          label: "全部",
          value: ""
        },
        {
          label: "待处理",
          value: 0
        },
        {
          label: "已处理",
          value: 1
        }
      ],
      status: "",
      name_phone: "",
      list: [], //列表数据
      pageNum: 1,
      pageSize: 5,
      total: null,
      centerDialogVisible: false, //弹窗状态
      shoppic_url: "", //线上生成 二维码
      real_name: "",
      phone: ""
    };
  },
  computed: {
    ...mapGetters([
      'isActive'
    ])
  },
  methods: {
    getList() {
      let params = {
        status: this.status,
        search: this.name_phone,
        pageNum: this.pageNum,
        pageSize: this.pageSize
      };
      api.lectureList(params).then(res => {
        this.total = res.data.total;
        this.list = res.data.list;
      });
    },
    handleClick() {
      //el-Tabs栏目控制函数
    },
    addLecture() {
      //添加入驻讲师
      this.$router.push({ name: "UserLectureAdd" });
    },
    tableSearch() {
      //列表搜索
      this.getList();
    },
    toCheck(lectureId, status) {
      //查看
      this.$router.push({
        name: "UserLectureAccount",
        query: { lectureId: lectureId, status: status }
      });
    },
    toEdit(lectureId, status) {
      //编辑
      this.$router.push({
        name: "UserLectureAdd",
        query: { lectureId: lectureId, status: status }
      });
    },
    toDelete(lectureId) {
      //删除
      api.deleteLecture({ lectureId }).then(res => {
        if (res.success) {
          this.$message({
            message: "删除成功!",
            type: "success",
          });
          this.getList();
        }
      });
    },
    QRcode(id, name, phone) {
      this.real_name = name;
      this.phone = phone;

      //二维码扫描
      api.lecturerBindPhoneQrcode({ lectureId: id, width: 202 }).then(res => {
        console.log(res);
        if(res.success){
            this.shoppic_url = res.data.url;
            this.centerDialogVisible = true;
            this.saveLocal();
        }else{
            this.$message({
            message:res.message,
            type: "error",
            duration: 1500,
          });
        }
        // 临时测试死图片
        // this.shoppic_url = "http://kpay-temp.qiniu.vdongchina.com/resource/image/jpeg/2053/o_1cqksr2g78911fk514inuo8173u13"
      });
    },
    handleSizeChange(pagesize) {
      this.pageSize = pagesize;
      this.getList();
    },
    handleCurrentChange(currentpage) {
      this.pageNum = currentpage;
      this.getList();
    },
    saveLocal() {
      let url_cors = this.shoppic_url;

      (async function() {
        let img = new Image();
        // 在canvas使用时，允许跨域
        img.crossOrigin = "";
        let [width, height] = await new Promise(resolve => {
          img.onload = function() {
            // 返回图片的原始尺寸
            resolve([img.naturalWidth, img.naturalHeight]);
          };
          img.src = url_cors;
        });

        let link = document.getElementById("download");

        let names = new Date().valueOf();
        link.download = names + ".png";
        let canvas = document.getElementById("canvas");
        let ctx = canvas.getContext("2d");
        canvas.width = width;
        canvas.height = height;
        // 保存图片到canavs
        ctx.drawImage(img, 0, 0, width, height);
        link.href = canvas.toDataURL("image/png");
      })();
    },
    downloadmethods() {}
  },
  mounted() {
    this.getList();
  }
};
</script>

<style lang="stylus" scoped>
section {
  width: 100%;
  color: #4A4A4A;
  line-height: 1;

  // tabs栏
  .tabs_box {
    .Tabs_one {
      .search {
        width: 100%;
        height: 0.4rem;
        margin-bottom: 0.2rem;
        display: flex;

        .el-input {
          width: 3rem;
          margin-right: 5px;
        }

        .el-select-custom {
          margin-right: 5px;
        }

        .search-btn {
          height: 0.4rem;
          font-size: 0.14rem;
          color: #FFFFFF;
          border-radius: 0.05rem;
          background: #6CDDC7;
          width: 0.7rem;
          cursor: pointer;
        }
      }

      .list {
        width: 100%;
        margin: 0 auto 0.2rem;
        overflow-x: hidden;
        overflow-y: auto;
        border-radius: 0.05rem;
        background: #fff;
        padding: 0.2rem;
        box-sizing: border-box;

        .list-category-my {
          width: 98%;
          margin: 0.2rem auto 0.3rem;
        }

        .change_height {
          // & >>> .el-table__row {
          // height: 0.88rem;
          // }
          & >>> .icon_style {
            display: inline-block;
            width: 0.06rem;
            height: 0.06rem;
            border-radius: 50%;
            margin-right: 0.04rem;
            vertical-align: middle;
          }
        }

        .el-button {
          background: #FFFFFF;
          border: 1px solid #E6E6E6;
          color: #4a4a4a;
        }
      }

      .pagination {
        display: flex;
        justify-content: flex-end;
        align-items: center;
        padding-right: 0.2rem;

        & >>> input, & >>> select {
          vertical-align: inherit;
        }

        & >>> li {
          border-radius: 0.04rem;
        }

        & >>> button, & >>> .number, & >>> li.el-icon.more.btn-quicknext.el-icon-more {
          color: #666666;
          background: #FFFFFF;
        }

        & >>> .el-pagination.is-background .el-pager li:not(.disabled).active {
          background: #6CDDC7;
          color: #ffffff;
        }

        & >>> .el-pager li.active:hover {
          color: red;
        }
      }

      & >>> .el-dialog div {
        width: 5.12rem;
        margin: 0 auto;
      }

      & >>> .el-dialog__body {
        padding: 0;
      }

      & >>> .el-alert__closebtn {
        display: none;
      }

      .QR_content {
        text-align: center;
        padding: 0.3rem 0;

        #canvas {
          width: 2.02rem;
          height: 2.02rem;
        }

        p {
          margin-bottom: 0.1rem;
        }

        a {
          display: block;
          color: #4A4A4A;
          width: 1.2rem;
          padding: 0.13rem 0;
          background: #6CDDC7;
          margin: 0 auto;
          border-radius: 4px;
        }
      }
    }
  }
}
</style>