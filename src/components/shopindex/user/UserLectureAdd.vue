<template>
    <section>
        <!-- <div v-if="isActive == 4">1</div>
        <no-active v-if="isActive == 3" @reFresh="searchUserlist"></no-active> -->
        <div>
            <div class="header">
                <h3>添加入驻讲师</h3>
                <button class="back-btn" @click="back">
                    <i class="iconfont icon-fanhui"></i>
                    <span>返回</span>
                </button>
            </div>

            <div class="main_info">
                <!-- 基本信息 -->
                <h4>基本信息</h4>
                <div class="content_same">
                    <h5>讲师照片</h5>
                    <div class="upload">
                        <div id="lecture" class="pickfiles" v-if="!list.lecturePicture">
                            <i class="el-icon-plus"></i>
                            <p class="txt">上传照片</p>
                        </div>
                        <div id="lecture" class="pickfiles" v-else>
                            <img v-lazy="uploadImageHead + list.lecturePicture">
                        </div>
                        <div class="suggest">
                            <p>建议尺寸：80*104</p>
                            <p>支持格式：Jpg、Png、Jpeg，Bmp</p>
                            <p>大小：不超过3M</p>
                        </div>
                    </div>

                    <div class="line_box">
                      <div class="dubble_line">
                          <h5>*真实姓名</h5>
                          <el-input v-model="list.realName" placeholder="请输入姓名" maxlength="10"></el-input>
                      </div>

                      <div class="dubble_line">
                          <h5>* 手机号码</h5>
                          <el-input v-model="list.phone" placeholder="请输入手机号" maxlength="11" :disabled="list.status?true:false"></el-input>
                      </div>
                    </div>

                    <div class="line_box">
                      <div class="dubble_line">
                          <h5>邮箱</h5>
                          <el-input v-model="list.mail" placeholder="请输入邮箱"></el-input> 
                      </div>

                      <div class="dubble_line">
                          <h5>QQ号</h5>
                          <el-input v-model="list.qq" placeholder="请输入QQ号" maxlength="14"></el-input>
                      </div>
                    </div>
                </div>

                <!-- 身份认证 -->
                <h4>身份认证</h4>
                <div class="content_same">
                    <h5>身份证号码</h5>
                    <el-input v-model="list.idCard" placeholder="身份证号码" maxlength="18" class="input_width"></el-input> 

                    <h5>身份证图片</h5>
                    <div class="upload item_diff">
                        <div id="idCard_just" class="pickfiles" v-if="!list.idCardPicJust">
                            <i class="el-icon-plus"></i>
                            <p class="txt">上传身份证正面</p>
                        </div>
                        <div id="idCard_just" class="pickfiles" v-else>
                            <img v-lazy="uploadImageHead + list.idCardPicJust">
                        </div>
                        <div id="idCard_back" class="pickfiles" v-if="!list.idCardPicBack">
                            <i class="el-icon-plus"></i>
                            <p class="txt">上传身份证背面</p>
                        </div>
                        <div id="idCard_back" class="pickfiles" v-else>
                            <img v-lazy="uploadImageHead + list.idCardPicBack">
                        </div>
                        <div class="suggest">
                            <p>建议尺寸：80*104</p>
                            <p>支持格式：Jpg、Png、Jpeg，Bmp</p>
                            <p>大小：不超过3M</p>
                        </div>
                    </div>

                    <h5>所在地区</h5>
                    <v-distpicker :province="list.province" :city="list.city" :area="list.district" @province="onChangeProvince" @city="onChangeCity" @area="onChangeArea"></v-distpicker>

                    <h5>详细地址</h5>
                    <el-input v-model="list.address" placeholder="请输入详细地址"></el-input> 
                </div>

                <!-- 其他信息 -->
                <h4>其他信息</h4>
                <div class="content_same">
                    <h5>个人介绍</h5>
                    <el-input
                        type="textarea"
                        resize="none"
                        :rows="6"
                        maxlength=200
                        placeholder="请输入商户介绍"
                        v-model="list.introduce">
                    </el-input>
                    <div class="btn_box"><el-button type="primary" @click="save">保存</el-button><el-button type="primary" @click="cancel">取消</el-button></div>    
                </div>


            </div>
        </div>
    </section>
</template>

<script>
import { initQiniu } from "assets/js/api";
import api from "fetch/api";
import { mapGetters } from "vuex";
import VDistpicker from "v-distpicker";
export default {
  name: "UserLectureAdd",
  data() {
    return {
      list: {
        lectureId: null,
        status: 0,
        lecturePicture: null, // 讲师图片url
        realName: null, //真实姓名
        idCard: null, //身份证号
        idCardPicJust: null, //身份证正面url
        idCardPicBack: null, //身份证反面url
        province: null,
        city: null,
        district: null,
        address: null,
        mail: null,
        qq: null,
        phone: null,
        introduce: null //个人介绍
      }
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
    onChangeProvince(data) {
      this.list.province = data.value;
    },
    onChangeCity(data) {
      this.list.city = data.value;
    },
    onChangeArea(data) {
      this.list.district = data.value;
    },
    getData(lectureId, status) {
      let params = {
        lectureId,
        status
      };
      api.lectureDetail(params).then(res => {
        const {lecturePicture, idCardPicJust, idCardPicBack} = res.data

        res.data.lecturePicture =lecturePicture;
        res.data.idCardPicJust =idCardPicJust;
        res.data.idCardPicBack =idCardPicBack;

        this.list = res.data;
      });
    },
    save() {
      var nameReg = /^[\u4E00-\u9FA5\uf900-\ufa2d·s]{2,20}$/; //验证姓名正则
      var idcardReg = /^[1-9]\d{7}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}$|^[1-9]\d{5}[1-9]\d{3}((0\d)|(1[0-2]))(([0|1|2]\d)|3[0-1])\d{3}([0-9]|X)$/; //身份证18位
      var phoneReg = /(^1[3|4|5|7|8]\d{9}$)|(^09\d{8}$)/; //手机正则
      var qqReg = /[1-9][0-9]{4,14}/; //4-14位QQ
      var emailReg = /^([A-Za-z0-9_\-\.])+\@(163.com|qq.com|42du.cn|vip.163.com|263.net|yeah.net|sohu.com|sina.cn|sina.com|eyou.com|gmail.com|hotmail.com|)$/; //12种邮箱

      if (!this.list.lecturePicture) {
        this.$message({
          message: "讲师未选择!",
          type: "warning",
          duration:1500,
        });
        return;
      }

      if (!this.list.realName) {
        this.$message({
          message: "真实姓名不能为空!",
          type: "warning",
          duration:1500,
        });
        return;
      } else if (!nameReg.test(this.list.realName)) {
        this.$message({
          message: "真实姓名不合法!",
          type: "warning",
          duration:1500,
        });
        return;
      }

      if (!this.list.phone) {
        this.$message({
          message: "手机号不能为空!",
          type: "warning",
          duration:1500,
        });
        return;
      } else if (!phoneReg.test(this.list.phone)) {
        this.$message({
          message: "手机号码不合法!",
          type: "warning",
          duration:1500,
        });
        return;
      }
      
      if (!this.list.mail) {
        this.$message({
          message: "邮箱不能为空!",
          type: "warning",
          duration:1500,
        });
        return;
      } else if (!emailReg.test(this.list.mail)) {
        this.$message({
          message: "邮箱格式不正确!",
          type: "warning",
          duration:1500,
        });
        return;
      }

      if (!this.list.qq) {
        this.$message({
          message: "QQ不能为空!",
          type: "warning",
          duration:1500,
        });
        return;
      } else if (!qqReg.test(this.list.qq)) {
        this.$message({
          message: "QQ不合法!",
          type: "warning",
          duration:1500,
        });
        return;
      }

      if (!this.list.idCard) {
        this.$message({
          message: "身份证号码不能为空!",
          type: "warning",
          duration:1500,
        });
        return;
      } else if (!idcardReg.test(this.list.idCard)) {
        this.$message({
          message: "身份证号码不合法!",
          type: "warning",
          duration:1500,
        });
        return;
      }

      if (!this.list.idCardPicJust || !this.list.idCardPicBack) {
        this.$message({
          message: "身份证未上传或上传不完整!",
          type: "warning",
          duration:1500,
        });
        return;
      }

      if (
        !this.list.province ||
        !this.list.city ||
        !this.list.district ||
        !this.list.address
      ) {
        this.$message({
          message: "所在地区及详细地址填写不完整!",
          type: "warning",
          duration:1500,
        });
        return;
      }

      if (!this.list.introduce) {
        this.$message({
          message: "个人介绍不能为空!",
          type: "warning",
          duration:1500,
        });
        return;
      }
      api.addOrEditLecture(this.list).then(res => {
        if(res.success){
          this.$message({
            message: "讲师添加成功!",
            type: "success",
          });
          this.$router.push({ name: "UserLecture" });
          
        }
        
      });
    },
    cancel() {
      console.log("cancel");
    }
  },
  computed: {
    ...mapGetters(["token", "imageHead", "uploadImageHead"])
  },
  components: {
    VDistpicker
  },
  created () {
    console.log(this.uploadImageHead)
    console.log(this.imageHead)
  },
  mounted() {
    var that = this;
    initQiniu(
      "lecture",
      3,
      "image/jpeg,image/jpg,image/png",
      (file, info) => {
        let newInfo = JSON.parse(info);
        that.list.lecturePicture = newInfo.key;
        that.tips = "上传成功。";
      },
      file => {
        if (file.isUpload < 3) {
        } else if (file.isUpload === 3) {
          that.tips = "文件大小超出范围！";
        } else {
          that.tips = "文件类型不正确！";
        }
      },
      that.token
    );

    initQiniu(
      "idCard_just",
      3,
      "image/jpeg,image/jpg,image/png",
      (file, info) => {
        let newInfo = JSON.parse(info);
        that.list.idCardPicJust = newInfo.key;
        that.tips = "上传成功。";
      },
      file => {
        if (file.isUpload < 3) {
        } else if (file.isUpload === 3) {
          that.tips = "文件大小超出范围！";
        } else {
          that.tips = "文件类型不正确！";
        }
      },
      that.token
    );

    initQiniu(
      "idCard_back",
      3,
      "image/jpeg,image/jpg,image/png",
      (file, info) => {
        let newInfo = JSON.parse(info);
        that.list.idCardPicBack = newInfo.key;

        that.tips = "上传成功。";
      },
      file => {
        if (file.isUpload < 3) {
        } else if (file.isUpload === 3) {
          that.tips = "文件大小超出范围！";
        } else {
          that.tips = "文件类型不正确！";
        }
      },
      that.token
    );

    if (that.$route.query.lectureId != undefined) {
      let lectureId = that.$route.query.lectureId;
      let status = that.$route.query.status;
      that.getData(lectureId, status);
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/mixins';
@import '~assets/styles/varibles';

section {
  width: 100%;
  font-size: 0.14rem;

  .header { // 标题 右侧按钮
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #9B9B9B;
    font-size: 0.2rem;
    margin-bottom: 0.14rem;
    height: 0.2rem;

    .back-btn {
      background: #f2f6f5;
      color: #9B9B9B;
      cursor: pointer;
    }
  }

  .main_info {
    background: #FFFFFF;
    padding: 0.2rem 0.2rem 0;

    h4 {
      padding: 0 0 0.2rem 0.1rem;
      color: #6CDDC7;
      border-bottom: 1px solid rgba(230, 230, 230, 1);
    }

    .content_same {
      width: calc(100% - 3.9rem);
      margin: 0.3rem auto 0.5rem;
      max-width: 710px;
      min-width: 700px;

      h5 {
        margin: 0.2rem 0 0.05rem 0;
      }

      .upload {
        height: 1.82rem;
        width: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        position: relative;

        .pickfiles {
          cursor: pointer;
          width: 1.4rem;
          height: 1.82rem;
          box-sizing: border-box;
          border: 0.01rem dashed rgba(0, 0, 0, 0.15);
          border-radius: 0.04rem;
          margin-right: 0.2rem;
          columnFlex();
          background: rgba(0, 0, 0, 0.02);
          text-align: center;

          &:hover {
            border: 0.01rem dashed $color-theme;
          }

          .el-icon-plus {
            margin: 0.61rem 0 0.14rem 0;
            font-size: 0.24rem;
            color: rgba(0, 0, 0, 0.45);
            font-weight: 600;
          }

          .txt {
            fontCenter(0.22rem);
            color: rgba(0, 0, 0, 0.65);
          }

          img {
            width: 100%;
            height: 100%;
          }
        }

        .suggest {
          position: absolute;
          bottom: 0;
          left: 1.6rem;
          width: 2.4rem;
          color: #9B9B9B;
          line-height: 0.2rem;
        }
      }

      .line_box {
        display: flex;

        .dubble_line {
          width: 345px;
          margin-right: 20px;
        }
      }

      .item_diff {
        height: 1.3rem;

        .pickfiles {
          width: 1.9rem;
          height: 1.3rem;

          .el-icon-plus {
            margin: 0.35rem 0 0.14rem 0;
          }
        }

        .suggest {
          left: 4.2rem;
        }
      }

      .btn_box {
        margin: 0.5rem auto 0;
        padding-bottom: 0.38rem;
        display: flex;
        justify-content: center;

        .el-button {
          padding: 0.12rem 0.45rem;
        }

        .el-button:nth-child(1) {
          color: #ffffff;
        }

        .el-button:nth-child(2) {
          background: #ffffff;
          color: #9B9B9B;
          border: 1px solid #E6E6E6;
        }
      }

      .input_width {
        max-width: 545px;
      }

      select {
        width: 100px;
      }
    }
  }
}
</style>