<template>
    <section>
        <div class="header">
            <h2>问题详情</h2>
            <el-button type="primary" @click="add_ques">提交</el-button>
        </div>
        <div class="wai_box">
            <div class="add_box">
                <!-- 提问的标题显示 -->
                <h3><img class="small_img" src="../../../assets/image/quesimg.png" alt=""><span>我的提问</span></h3>
                <el-form ref="form" :model="form" class="add_form">
                    <el-form-item>
                        <h4>* 要提问的讲师</h4>
                        <el-select v-model="form.id" placeholder="请选择要提问的讲师">
                            <el-option
                                v-for="item in LcturerList"
                                :key="item.id"
                                :label="item.realName"
                                :value="item.id">
                            </el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item>
                        <h4>* 标题</h4>
                        <el-input v-model="form.title" placeholder="描述你的问题（最少10个字符，最大50字符）" :maxlength="50"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <h4>* 详细描述</h4>
                        <el-input type="textarea" v-model="form.desc" placeholder="尽可能详细的描述下你的问题，方便问题快速解决（最少20个字符，最大1000字符）" resize="none"  class="answer_input" :maxlength="1000"></el-input>
                    </el-form-item>
                    <el-form-item>        
                        <div class="upload_area">
                            <p class="tips">建议尺寸750*750，大小不超过2M，支持Jpg、Png格式。<span>{{tips}}</span></p>
                            <div class="image">
                                <div class="image-item" v-for="(item,index) of imageUrl" :key="index" v-if="imageUrl.length>0">
                                    <img v-lazy="item">
                                    <i class="el-icon-close" @click="deleteImg(index)"></i>
                                </div>
                                <div id="uploadimg" v-show="imageUrl.length<3">
                                    <i class="el-icon-plus"></i>
                                    <p class="txt">上传照片</p>
                                </div>
                            </div>
                        </div>
                    </el-form-item>
                </el-form>
            </div>
        </div>
    </section>
</template>

<script>
import { initQiniu } from "assets/js/api";
import api from "fetch/api";
import { mapGetters } from "vuex";
import Cookies from "js-cookie";
export default {
  name: "QuesListMyAdd",
  data() {
    return {
      msg: "QuesListMyAdd",
      LcturerList: [], //讲师列表信息
      tips: "", //上传的提示信息
      imageNoHead: [], //无前缀的图片地址
      imageUrl:[], //添加问题 直接能访问的图片地址
      form: {
        title: "", //添加问题标题
        desc: "", //添加问题描述
        id: "" //添加问题 讲师ID this.form.id
      }
    };
  },
  computed: {
    ...mapGetters([
      "token",
      "uploadImageHead",
      "imageHead",
      "roleId",
      "storeId",
      "userId",
      "nickName"
    ])
  },
  methods: {
    getLcturer() {
      let that = this;
      let params = {
        storeId: that.storeId, //that.storeId 1
        id: that.userId, //that.userId 110
        // storeId: 1,
        // id: 110,
      };
      api
        .listLecturer(params)
        .then(res => {
          if (res.success) {
            this.LcturerList = res.data;
          } else {
            that.$message({
              message: res.message,
              center: true,
              type:"error"
            });
          }
        })
        .catch(res => {
          console.log('请求失败')
        });
    },
    add_ques() {
      if (!this.form.id) {
        this.$message({
          message: "讲师未选择！",
          center: true,
          type:"error"
        });
        return;
      }
      if (this.form.title.length < 10) {
        this.$message({
          message: "标题不得小于10个字符！",
          center: true,
          type:"error"
        });
        return;
      }
      if (this.form.desc.length < 20) {
        this.$message({
          message: "问题描述不得小于20个字符！",
          center: true,
          type:"error"
        });
        return;
      }
      let that = this;
      let params = {
        questionerType: 0, //0.消费者 1.生产者
        questionerId: that.userId, //提问者IDthat.userId that.userId
        lecturerId: that.form.id, //讲师ID this.form.id
        title: that.form.title, //问题的标题
        describe: that.form.desc, //问题的详情
        status: 0, //0待解答(无法点赞) 1.已解答
        anonymity: 0, //0.不匿名 1.匿名
        createUser: "",
        storeId: that.storeId, //that.storeId 1
        picUrls: that.imageUrl.join(',')
      };
      api
        .saveQuestionAndPics(params)
        .then(res => {
          that.$message({
            message: res.data,
            center: true,
            type:"success",
          });
          that.$router.push({ name: "QuesList" });
        })
        .catch(res => {
          that.$message({
            message: "请求失败",
            center: true,
            type:"error"
          });
        });
    },
    selectEvent(vid) {
      //选择框改变事件 获取讲师ID
      this.lecturerId = vid;
    },
    deleteImg(index) {
      let that = this;
      this.tips = "";
      that.imageUrl.splice(
        that.imageUrl.findIndex((value, inx, arr) => inx === index),
        1
      );
      that.imageNoHead.splice(
        that.imageNoHead.findIndex((value, inx, arr) => inx === index),
        1
      );
    }
  },
  created() {
    let that = this;
    initQiniu(
      "uploadimg",
      2,
      "image/jpeg,image/jpg,image/png",
      (file, info) => {
        if (that.imageUrl.length == 3) {
          that.$message({
            message: "只能上传三张图片",
            center: true,
            type:"error"
          });
          return;
        }
        let newInfo = JSON.parse(info);
        that.imageUrl.push(that.uploadImageHead + newInfo.key);
        that.imageNoHead.push(newInfo.key);
        that.tips = "上传成功。";
      },
      file => {
        if (file.isUpload === 1) {
          that.progress = file.percent;
        } else if (file.isUpload === 2) {
          that.tips = "文件大小超出范围！";
        } else {
          that.tips = "文件类型不正确！";
        }
      },
      that.token
    );
  },
  mounted() {
    this.getLcturer();
  }
};
</script>
<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

section {
  // width: calc(100% - 0.6rem);
  // margin: 0.14rem 0.3rem 0.3rem;
  width:100%;
  margin:0 auto;
  font-size: 0.14rem;
  color: #4A4A4A;
  .header { // 标题 右侧按钮
    display: flex;
    justify-content: space-between;
    align-items: center;
    color: #9B9B9B;
    font-size: 0.2rem;
    margin-bottom: 0.14rem;
    height: 0.4rem;
    .el-button {
      background: #6CDDC7;
      border: 1px solid #6CDDC7;
      color: #FFFFFF;
      font-size: 0.12rem;
    }
  }
  .wai_box {
    background: #ffffff;
    min-width: 7.2rem;
    .add_box {
      width: 7.2rem;
      margin: 0 auto;
      padding: 0.2rem 0 0.4rem;
      h3 {
        font-size: 0.16rem;
        font-weight: 600;
        margin-bottom: 0.4rem;
        .small_img {
          width: 0.32rem;
          height: 0.32rem;
        }
        span {
          margin-left: 0.1rem;
        }
      }
      .add_form {
        .el-form-item {
          margin-bottom: 0.2rem;
          h4 {
            height: 0.22rem;
            line-height: 0.22rem;
            margin-bottom: 0.05rem;
          }
          .answer_input {
            & >>> .el-textarea__inner {
              height: 1.8rem;
            }
          }
        }
      }
      .upload_area {
        display: flex;
        flex-direction: column;
        justify-content: flex-start;
        align-items: flex-start;
        margin-bottom: 0.2rem;
        .tips {
          font-size: 0.14rem;
          height: 0.2rem;
          line-height: 0.2rem;
          color: #9B9B9B;
          margin-bottom: 0.1rem;
          span {
            color: $color-theme;
          }
        }
        .image {
          display: flex;
          justify-content: flex-start;
          align-items: center;
          .image-item {
            width: 2rem;
            height: 1.38rem;
            border-radius: 0.04rem;
            margin-right: 0.1rem;
            position: relative;
            z-index: 99;
            img {
              display: block;
              height: 100%;
              width: 100%;
              border: 0.01rem dashed rgba(0, 0, 0, 0.15);
              box-sizing: border-box;
              border-radius: 0.05rem;
            }
            .el-icon-close {
              font-size: 0.3rem;
              position: absolute;
              top: 0;
              right: 0;
              z-index: 99;
              cursor: pointer;
              background: #ccc;
              border-radius: 0 0.05rem 0 0;
            }
          }
          #uploadimg {
            width: 1.38rem;
            height: 1.38rem;
            box-sizing: border-box;
            border: 0.01rem dashed rgba(0, 0, 0, 0.15);
            border-radius: 0.04rem;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
            &:hover {
              border: 0.01rem dashed $color-theme;
            }
            .el-icon-plus {
              margin: 0 0 0.14rem;
              font-size: 0.24rem;
              color: rgba(0, 0, 0, 0.45);
            }
            .txt {
              font-size: 0.14rem;
              fontCenter(0.22rem);
              color: rgba(0, 0, 0, 0.65);
            }
          }
        }
      }
    }
  }
}
</style>