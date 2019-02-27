<template>
    <section>
        <div class="header">
            <h2>问题详情</h2>
            <el-button type="primary" @click="ques_submit" v-if="questionStatus == 0 && this.lecturerId == this.userId">提交</el-button>
        </div>
        <div class="main">
            <div class="inner_box">
                <!-- 1.问题标题 课程 -->
                <div class="content_info">
                    <div class="title">
                        <!-- 1.问题显示的图片标记 2.问题的标题 当前问题的状态 -->
                        <h3><img class="small_img" src="../../assets/image/quesimg.png" alt=""><span class="ques_title">{{ques_title}}</span></h3>
                        <div class="ques_status" :class="questionStatus==0?'':'btncolor'">{{questionStatus==0?"待处理":"已答复"}}</div>
                    </div>
                    <div class="course" v-if="courseId">
                        <img v-lazy="this.courseurl" alt="">
                        <div class="course_info">
                            <h3>{{courseName}}</h3>
                            <div class="auth">作者<span>{{createMan}}</span></div>
                        </div>
                    </div>
                </div>

                <!-- 2.提问人相关信息 -->
                <div class="ques_info">
                    <div class="top">
                        <img class="small_img img_border" v-lazy="questionerHead" alt="" v-if="anonymity == 0">
                        <img class="small_img img_border" src="../../assets/image/anonymityPic.png" alt="" v-if="anonymity == 1">
                        <h4>{{createDate}}</h4>
                        <div>来自提问人：<span>{{anonymity?'匿名':questionerName}}</span></div>
                    </div>
                    <p class="bottom">{{questionDesc}}</p>
                    <div class="center_img" v-if="questionUrlArr.length>0">
                        <div class="image-item" v-for="(item,index) of questionUrlArr" :key="index"  v-if="questionUrlArr[index].picUrl != ''">
                            <img v-lazy="item.picUrl">
                        </div>
                    </div>
                </div>
                <!-- 3.已回答的相关信息显示 -->
                <div class="answer_info" v-if="questionStatus == 1">
                    <div class="top">
                        <img class="small_img img_border" v-lazy="lecturerHead" alt="">
                        <h4>{{answerTime}}</h4>
                        <div>来自讲师：<span>{{lecturerName}}</span></div>
                        <div class="addstar" @click="addStar" v-if="this.lecturerId != this.userId"><i class="iconfont" :style="{color:starcolor?'#F5A623':'rgba(155,155,155,1)'}">&#xe65e;</i>{{starnum}}</div>
                    </div>
                    <p class="bottom">{{answerText}}</p>
                    <div class="center_img">
                        <div class="image-item" v-for="(item,index) of answerUrlArr" :key="index" v-if="answerUrlArr[index].picUrl != ''">
                            <img v-lazy="item.picUrl">
                        </div>
                    </div>
                    
                </div>

                <!-- 3.未回答需要输入回答信息 -->
                    <div v-if="questionStatus == 0 && this.lecturerId == this.userId" class="answer_input">
                    <el-input
                        type="textarea"
                        :rows="2"
                        placeholder="回复问题（最小50个字符，最大1000字）"
                        resize="none"
                        v-model="answer_textarea"
                        maxlength=1000
                        >
                    </el-input>
                    <div class="upload_area">
                        <p class="tips">建议尺寸750*750，大小不超过2M，支持Jpg、Png格式。<span>{{tips}}</span></p>
                        <div class="image">
                            <div class="image-item" v-for="(item,index) of imageUrl" :key="index" v-if="imageUrl.length>0">
                                <img v-lazy="item">
                                <i class="el-icon-close" @click="deleteImg(index)"></i>
                            </div>
                            <div :id="this.picId" v-show="imageUrl.length<3" class="uploadbox">
                                <i class="el-icon-plus"></i>
                                <p class="txt">上传照片</p>
                            </div>
                        </div>
                    </div>
                </div>
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
  name: "QuestDetail",
  data() {
    return {
      msg: "QuestDetail",
      //路由带过来的问题ID
      questionId: "",
      identity: "",
      picId: "",
      //问题区域
      questionStatus: 1, //根据问题解决的状态来控制 显示按钮的提交和 回答者的模块  //根据问题的状态来判断
      ques_title: "", //问题的标题
      questionerHead: "", ////提问人的头像图标
      createDate: "", //提问时间
      questionerName: "", //提问人
      questionDesc: "", //问题的描述
      questionUrlArr: [], //问题的图片数组
      anonymity: "", //匿名状态
      //答案呈现
      lecturerHead: "", //回答者图片
      lecturerName: "", //回答者名称
      answerTime: "", //回答时间
      answerText: "", //回答者的内容
      starnum: "", //点赞数量
      answerId: "", //答案ID
      lecturerId: "", //讲师id
      answerUrlArr: [], //答案的图片数组

      //输入答案  // 我的提问进入不能编辑
      data_state: "",
      answer_textarea: "", //答案数据  ！！！！后续做限制前端字符 1000
      imageUrl: [], //图片上传的数组 能直接访问
      imageNoHead: [], //图片上传的数组 无前缀
      tips: "", //提示上传图片是否成功的字段
      //接口获取
      questionerId: "", //提问者id

      //获取课程介绍信息
      courseId: "", //课程id
      courseurl: "", //课程图片
      courseName: "", //课程名称
      createMan: "", //作者
      introduction: "", //课程介绍
      starcolor: false //点赞颜色
    };
  },
  computed: {
    ...mapGetters([
      "roleId",
      "storeId",
      "token",
      "uploadImageHead",
      "imageHead",
      "userId"
    ])
  },
  methods: {
    initPic() {
      let that = this;
      initQiniu(
        that.picId,
        2,
        "image/jpeg,image/jpg,image/png",
        (file, info) => {
          if (that.imageUrl.length == 3) {
            that.$message({
              message: "只能上传三张图片",
              center: true,
              type: "error"
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
    getQuestionInfo() {
      // 根据问题Id 点击查看问题详情
      let params = {
        id: this.questionId, //必传 问题ID
        userId: this.userId
        // userId: 1 //test
      };
      api
        .queryById(params)
        .then(res => {
          // 根据res.status 的状态来判断 是否要载入点赞的图标和按钮
          let data_Q_A = res.data.questionAndAnswerDto;
          if (data_Q_A.starStatus != null) {
            this.starcolor = true;
          }
          this.questionStatus = data_Q_A.questionStatus; //问题的状态 data_Q_A.questionStatus
          this.ques_title = data_Q_A.title; //问题的标题
          this.questionerHead = data_Q_A.questionerHead; //提问人的头像图标
          this.createDate = data_Q_A.createDate; //提问时间
          this.questionerName = data_Q_A.questionerName; //提问人
          this.questionDesc = data_Q_A.questionDesc; //问题的描述
          this.questionId = data_Q_A.id; //问题id
          this.lecturerName = data_Q_A.lecturerName; //讲师的名称即回答者
          this.anonymity = data_Q_A.anonymity; //匿名状态
          this.questionUrlArr = res.data.questionUrl; //添加问题附带的图片

          this.lecturerId = data_Q_A.lecturerId; //讲师ID
          this.courseId = data_Q_A.courseId; //课程id data_Q_A.courseIdId
          this.getCourse();
          if (this.questionStatus == 1) {
            this.lecturerHead = data_Q_A.lecturerHead; //讲师图片
            this.answerTime = data_Q_A.answerTime; //回答时间
            this.answerText = data_Q_A.answerText; //回答者的内容
            this.starnum = data_Q_A.starNum; //回答者点赞数
            this.answerId = data_Q_A.answerId; //答案id
            this.answerUrlArr = res.data.answerUrl;
          }
          this.initPic();
        })
        .catch(res => {
          console.log("请求失败");
        });
    },
    getCourse() {
      if (this.courseId == null) {
        return;
      } else {
        let params = {
          id: this.courseId
        };
        api
          .getCourse(params)
          .then(res => {
            this.courseurl = this.imageHead + res.data.url;
            this.courseName = res.data.courseName;
            this.createMan = res.data.createMan;
            this.introduction = res.data.introduction;
          })
          .catch(res => {
            console.log("请求失败");
          });
      }
    },
    ques_submit() {
      //一系列判断
      if (this.answer_textarea.length < 50) {
        this.$message({
          message: "回答的内容不能小于50个字符!",
          type: "error",
          center: true
        });
        return;
      }
      //问题提交按钮 //提交问题和图片

      let params = {
        answererId: this.userId, //回答者的id this.userId
        answer: this.answer_textarea, //回答的内容
        questionId: this.questionId, //问题id
        // questionId: 1, //test
        storeId: this.storeId, //店铺id this.storeId
        // storeId: 1, //test
        picUrls: this.imageUrl.join(","), //上传图片
        createUser: this.lecturerName //创建人 讲师名称
      };
      let page;
      if (this.$route.query.pagefrom == "asking_my") {
        page = "QuesAskMy";
      } else {
        page = "QuesList";
      }

      api
        .addAnswerAndPics(params)
        .then(res => {
          this.$message({
            message: res.data,
            center: true,
            type: "success",
          });
          this.$router.push({ name: page });
        })
        .catch(res => {
          this.$message({
            message: "请求失败",
            center: true,
            type: "error"
          });
        });
    },
    // 删除图片的方法
    deleteImg(index) {
      let that = this;
      that.tips = "";
      that.imageUrl.splice(
        that.imageUrl.findIndex((value, inx, arr) => inx === index),
        1
      );
      that.imageNoHead.splice(
        that.imageNoHead.findIndex((value, inx, arr) => inx === index),
        1
      );
    },
    // 点赞
    addStar() {
      //   点赞接口测试
      let params = {
        answerId: this.answerId, //必传 问题ID
        userId: this.userId, //this.userId 1
        // userId: 1, //test
        lecturerId: this.lecturerId //this.lecturerId 2
        // lecturerId: 2 //test
      };
      api
        .addStar(params)
        .then(res => {
          if (res.data.success) {
            this.starnum = res.data.starnum;
            this.starcolor = true;
          } else {
            this.$message({
              message: res.data.message,
              type: "error",
              center: true
            });
          }
          // 根据res.status 的状态来判断 是否要载入点赞的图标和按钮
        })
        .catch(res => {
          this.$message({
            message: "请求失败~",
            type: "error",
            center: true
          });
        });
    }
    //提交问题答案
  },
  created() {
    this.questionId = this.$route.query.quesId;
    this.identity = this.$route.query.pagefrom;
    // 上传图片  上传图片先调下七牛云
    this.picId = this.$route.query.pagefrom + this.$route.query.quesId;
  },
  mounted() {
    this.getQuestionInfo();
  }
};
</script>

<style lang="stylus" scoped>
@import '~assets/styles/varibles';

h3 {
    font-size: 0.16rem;
    font-weight: 600;
}

.small_img {
    width: 0.32rem;
    height: 0.32rem;
}

.img_border {
    border-radius: 50%;
}

// 头部
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

// 主要内容问答区域
.main {
    width: 100%;
    background: #FFFFFF;
    padding-bottom: 0.4rem;

    .inner_box {
        margin: 0 0.7rem;
        min-height: 7rem;

        // 1.标题和问题图标
        .content_info {
            display: flex;
            justify-content: space-between;
            padding: 0.4rem 0;
            height: 1.5rem;

            .title {
                h3 {
                    height: 0.32rem;

                    img {
                        width: 0.32rem;
                        height: 0.32rem;
                    }

                    .ques_title {
                        margin-left: 0.1rem;
                        height: 0.32rem;
                        line-height: 0.32rem;
                        overflow: hidden;
                        white-space: nowrap;
                        text-overflow: ellipsis;
                    }
                }

                .ques_status {
                    display: inline-block;
                    background: rgba(245, 166, 35, 0.2);
                    color: rgba(245, 166, 35, 1);
                    font-size: 0.12rem;
                    height: 0.28rem;
                    line-height: 0.28rem;
                    text-align: center;
                    padding: 0 0.21rem;
                    border-radius: 0.04rem;
                    margin: 0.2rem 0 0 0.4rem;
                }

                .btncolor {
                    background: rgba(0, 185, 180, 0.2);
                    color: rgba(0, 185, 180, 1);
                }
            }

            .course {
                display: flex;
                justify-content: flex-start;

                img {
                    width: 2.4rem;
                    height: 1.5rem;
                }

                .course_info {
                    width: 2.4rem;
                    margin-left: 0.1rem;

                    h3 {
                        line-height: 0.22rem;
                        padding-bottom: 0.1rem;
                        border-bottom: 1px solid #E6E6E6;
                        margin-bottom: 0.1rem;
                    }

                    .auth {
                        color: #9B9B9B;

                        span {
                            color: #666666;
                            margin-left: 0.2rem;
                            font-weight: 600;
                        }
                    }
                }
            }
        }

        // 2.提问人的信息 和 回答者信息一致
        .ques_info, .answer_info {
            background: rgba(249, 250, 249, 1);
            margin-bottom: 0.4rem;

            .top {
                padding: 0.2rem 0 0 0.2rem;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                position: relative;

                h4 {
                    margin: 0 0.3rem 0 0.1rem;
                    color: #9B9B9B;
                }

                .addstar {
                    position: absolute;
                    right: 0.4rem;

                    i {
                        font-size: 0.14rem;
                        margin-right: 0.1rem;
                        cursor: pointer;
                    }
                }
            }

            .center_img {
                display: flex;
                // flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                padding: 0 0 0.2rem 0.5rem;

                .image-item {
                    width: 1.5rem;
                    height: 1.5rem;
                    border-radius: 0.04rem;
                    margin-right: 0.1rem;
                    position: relative;
                    z-index: 99;

                    img {
                        display: block;
                        height: 100%;
                        width: 100%;
                        // border: 0.01rem dashed rgba(0, 0, 0, 0.15);
                        box-sizing: border-box;
                        border-radius: 0.05rem;
                    }
                }
            }

            .bottom {
                padding: 0.2rem 0.6rem 0.4rem;
                line-height: 0.22rem;
                word-wrap: break-word;
            }
        }

        .answer_input {
            & >>> .el-textarea__inner {
                height: 1.8rem;
            }

            .upload_area {
                display: flex;
                flex-direction: column;
                justify-content: flex-start;
                align-items: flex-start;
                margin-top: 0.4rem;

                .tips {
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

                    .uploadbox {
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

