<template>
    <section>
        <!-- <div v-if="isActive == 4">1</div>
        <no-active v-if="isActive == 3" @reFresh="searchUserlist"></no-active> -->
      <div>
          <div class="header">
            <h3>账号详情</h3>
            <button class="back-btn" @click="back">
                <i class="iconfont icon-fanhui"></i>
                <span>返回</span>
            </button>
          </div>

          <div class="main_info" style="display:none;">
            <!-- 账号信息 -->
            <h4>账号信息</h4>
            <div class="content_same_two">
                <div class="text_type">账号:<span>{{listdata.lectureCode == null?'-':listdata.lectureCode}}</span></div>
                <div class="text_type">绑定状态：<span style="color:#F42C21;">{{listdata.status?'已绑定':'未绑定'}}</span></div>
            </div>

            <!-- 基本信息 -->
            <h4>基本信息</h4>
            <div class="content_same_two">
              <div>
                <h5>讲师照片</h5>
                <img class="lectureimg" v-lazy="imageHead + listdata.lecturePicture" alt="">
              </div>
              <div class="text_type">真实姓名：<span>{{listdata.realName}}</span></div>
            </div>

            <!-- 身份认证 -->
            <h4>身份认证</h4>
            <div class="content_same_two">
                <div class="text_type">身份证号码：<span>{{listdata.idCard}}</span></div>
                <div>
                  <h5>身份证图片</h5>
                  <img v-lazy="imageHead + listdata.idCardPicJust" alt="">
                  <img v-lazy="imageHead + listdata.idCardPicBack" alt="">
                </div>
                <div class="text_type">所在地区：<span>{{listdata.province + listdata.city + listdata.district}}</span></div>
                <div class="text_type">详细地址：<span>{{listdata.address}}</span></div>
            </div>

            <!-- 联系方式 -->
            <h4>联系方式</h4>
            <div class="content_same_two">
                <div class="text_type">
                  <div class="inline_b">邮箱：<span>{{listdata.mail}}</span></div>
                  <div class="inline_b">QQ号：<span>{{listdata.qq}}</span></div>
                </div>
                
                <div class="text_type">手机号码：<span>{{listdata.phone}}</span></div>
            </div>

            <!-- 其他信息 -->
            <h4>其他信息</h4>
            <div class="content_same_two">
                <h5>个人介绍</h5>
                <div class="introduce">{{listdata.introduce}}</div>
            </div>
          </div>

          <div class="main_box">

              <div class="top_info">
                <div class="left">
                  <div class="account_info">
                    
                    <h5>账号信息</h5>
                    <div class="type_one">
                        <div class="item">
                          <div>账号：</div>
                          <div>{{listdata.lectureCode == null?'-':listdata.lectureCode}}</div>
                        </div>

                        <div class="item">
                          <div>绑定状态：</div>
                          <div class="bind_state">{{listdata.status?'已绑定':'未绑定'}}</div>
                            <!-- style="color:#F42C21;" -->
                        </div>
                    </div>
                  </div>
                  <div class="basic_info">
                    
                    <h5>基本信息</h5>
                    <div class="img_box">
                      <img v-lazy="imageHead + listdata.lecturePicture" alt="">
                    </div>
                    <div class="type_two">
                      <div class="item">
                        <div>真实姓名：</div>
                        <div>{{listdata.realName}}</div>
                      </div>
                    </div>

                    <div class="type_two">
                      <div class="item">
                        <div>手机号码：</div>
                        <div>{{listdata.phone}}</div>
                      </div>
                    </div>

                    <div class="type_two">
                      <div class="item">
                        <div>电子邮箱：</div>
                        <div>{{listdata.mail}}</div>
                      </div>
                    </div>

                    <div class="type_two">
                      <div class="item">
                        <div>QQ：</div>
                        <div>{{listdata.qq}}</div>
                      </div>
                    </div>

                  </div>
                </div>
                <div class="right">
                  <div class="idcard_info">
                    
                    <h5>身份认证</h5>
                    <div class="type_three">
                      <div class="tag">身份证照片：</div>
                      
                      <div class="item">
                        <div class="pic_box">
                          <div><img :src="imageHead + listdata.idCardPicJust" alt=""></div>
                          <div>正面</div>
                        </div>

                        <div class="pic_box">
                          <div><img :src="imageHead + listdata.idCardPicBack" alt=""></div>
                          <div>反面</div>
                        </div>
                      </div>

                      <div class="tag">身份证号码</div>
                      <div class="text">{{listdata.idCard}}</div>

                      <div class="tag">所在地区</div>
                      <div class="text">{{listdata.province + '' + listdata.city + '' + listdata.district}}</div>

                      <div class="tag">详细地址</div>
                      <div class="text">{{listdata.address}}</div>
                      

                    </div>
                  </div>
                </div>
              </div>


              <div class="bottom_intr">
                  <div class="introduce_info"> 
                    
                    <h5>其他信息</h5>
                    <div class="type_one">
                        <div class="tag">个人介绍：</div>
                        <div class="textarea">{{listdata.introduce}}</div>
                    </div>
                  </div>
              </div>
          </div>


          <!-- <div class="test_box">
            <div class="left">
              left
            </div>

            <div class="right">
              right
            </div>
          </div> -->


      </div>
    </section>
</template>

<script>
import api from "fetch/api";
import { mapGetters } from "vuex";
export default {
  name: "UserLectureAccount",
  data() {
    return {
      listdata: {}
    };
  },
  methods: {
    back() {
      this.$router.back();
    },
    getData(lectureId, status) {
      let params = {
        lectureId,
        status
      };
      api.lectureDetail(params).then(res => {
        // console.log(res)
        this.listdata = res.data;
      });
    }
  },
  computed: {
    ...mapGetters(["token", "imageHead", "uploadImageHead"])
  },
  mounted() {
    let lectureId = this.$route.query.lectureId;
    let status = this.$route.query.status;
    this.getData(lectureId, status);
  }
};
</script>

<style lang="stylus" scoped>
section {
  width: 100%;
  font-size: 0.14rem;
  color: #4A4A4A;

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

  .main_box {
    // width: 1140px;
    // width:100%;
    // min-width:1140px;
    // margin: 0 auto;
    .top_info {
      width: 100%;
      display: flex;

      .left {
        width: 25%;
        margin-right: 0.2rem;
        min-width: 3.2rem;
        background: #f2f6f5;

        .account_info {
          padding: 0.2rem;
          // height: 1.26rem;
          background: #FFFFFF;
        }

        .basic_info {
          padding: 0.2rem;
          height: 454px;
          background: #FFFFFF;
          margin-top: 0.2rem;

          .img_box {
            padding-bottom: 0.28rem;
            text-align: center;

            img {
              width: 140px;
              height: 182px;
            }
          }
        }
      }

      .right {
        width: calc(75% - 0.2rem);
        min-width: 7.2rem;

        .idcard_info {
          padding: 0.2rem;
          height: 6.4rem;
          background: #FFFFFF;
        }
      }
    }

    .bottom_intr {
      background: #FFFFFF;
      padding: 0.2rem;
      margin: 0.2rem 0 0.5rem;
    }
  }
}

// *******相同样式********
h5 {
  color: #6CDDC7;
  // padding-bottom: 0.4rem;
  // height: 0.2rem;
  padding: 0.03rem 0;
  margin-bottom: 0.4rem;
}

.tag {
  padding: 0.03rem 0;
  margin-bottom: 0.1rem;
  color: #9B9B9B;
}

.account_info, .basic_info, .idcard_info, .bottom_intr {
  border-radius: 5px;
}

.type_one, .type_two {
  padding: 0 0.2rem;
  color: #9B9B9B;
}

.type_one .item, .type_two .item, .type_three .item {
  display: flex;
  justify-content: space-between;
  padding: 0.03rem 0;
}

// 类型一 账号信息
.type_one {
  .item {
    .bind_state {
      color: #F42C21;
    }
  }

  .item:nth-child(1) {
    margin-bottom: 0.25rem;
  }

  .textarea {
    margin: 0.1rem 0 0.5rem 0;
    color:#4A4A4A;
    line-height:0.2rem;
    padding-right:1.7rem;
    min-height:0.96rem;
  }
}

// 类型二 基本信息
.type_two {
  .item {
    padding: 0.15rem 0;
    border-bottom: 1px solid #E6E6E6;

    div:nth-child(2) {
      color: #4A4A4A;
    }
  }
}

.type_three {
  padding: 0 0.6rem;

  .text {
    padding: 0.03rem 0;
    margin-bottom: 0.3rem;
  }

  .item {
    justify-content: flex-start;
    text-align: center;
    padding: 0.3rem 0 0.68rem 0;
    margin-bottom: 0.5rem;
    border-bottom: 1px solid #E6E6E6;

    img {
      width: 190px;
      height: 130px;
    }

    .pic_box {
      margin-right: 1rem;

      div:nth-child(2) {
        padding: 0.03rem 0;
        margin-top: 0.1rem;
      }
    }
  }
}
</style>