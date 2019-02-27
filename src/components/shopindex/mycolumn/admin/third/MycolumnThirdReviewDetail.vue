<template>
  <section class="mycolumnupload">
    <div v-if="isActive == 4">
      <div class="layout-head">
        <span>专栏审核详情</span>
        <div class="editor-btn">
          <span class="come-back" @click="back" style="margin-right:20px;"><i class="iconfont icon-fanhui"></i>返回</span>
          <el-button class="major-btn" @click="pass" v-if="this.pageData.auditStatus === 20">通过</el-button>
          <el-button class="less-btn" @click="dialogFormVisible=true" v-if="this.pageData.auditStatus === 20">拒绝</el-button>
        </div>
      </div>
    
      <div class = "content_box">
        <div class = "content_header">
          <el-tabs v-model="activeName">
            <el-tab-pane label="专栏信息" name="first">
              <div class = "column_box">
                <div class = "header">
                  基本信息
                </div>
                <div class = "img_box">
                  <img :src="imageHead + pageData.columnUrl" alt="图片">
                  <div class = "right_box">
                    <div class="title">
                      <span class="ellipsis">{{pageData.columnName}}</span><span>{{isOpen}}</span>
                    </div>
                    <div class="new_box">
                      <p class="new" v-if="pageData.updateType === 1">每日更新</p>
                      <p class="new" v-else-if="pageData.updateType === 2">每{{pageData.frequency}}更新</p>
                      <p class="new" v-else>每月{{pageData.frequency}}更新</p>
                      <span class="autor">作者 | <span>{{pageData.userName}}</span></span>
                      <span class="price">价格 | <span>{{pageData.price}}元</span></span>
                    </div>
                    <div class="line"></div>
                    <div class="see">
                      <span>提交时间：{{pageData.modifyDate}}</span>
                      <span v-if="pageData.auditStatus > 20">审核时间：{{pageData.auditDate}}</span>
                    </div>
                  </div>
                </div>
              
                <div class="text-introduction">
                  <h3>专栏简介</h3>
                  <div  v-html="pageData.introduction" class="introduction-content" style="margin-top:0.2rem;min-height:3.46rem;">
                    {{pageData.introduction}}
                  </div>
                </div>
              </div>
              
              <el-dialog :visible.sync="dialogFormVisible" :show-close="true" width="650px">
                <div class="form-box">
                  <h1>拒绝原因</h1>
                  <el-input
                    type="textarea"
                    :maxlength=50
                    autosize
                    placeholder="请填写拒绝理由"
                    v-model="shelvesReason"
                    >
                  </el-input>
                  <div class="footer">
                    <button @click="cancel()">取消</button>
                    <button @click="refuse()">确定</button>
                  </div>
                </div>
              </el-dialog>
            </el-tab-pane>
            <el-tab-pane label="发刊词" name="second">
              <IntroductionComponent :introducttionData="introducttionData"></IntroductionComponent>
            </el-tab-pane>
          </el-tabs>
        </div>
      </div>
    </div>
    <no-active v-if="isActive == 3" @reFresh="init"></no-active>
  </section>
</template>
<script>
import api from 'fetch/api'
import IntroductionComponent from '../../IntroductionComponent'
import NoActive from 'components/common/NoActive'
import {mapGetters} from 'vuex'

export default {
  name: "MycolumnThirdReviewDetail",
  data() {
    return {
      activeName: 'first',
      pageData:{},
      introducttionData:{},
      isOpen:'',
      dialogFormVisible:false,
      shelvesReason:''
    };
  },
  computed:{
    ...mapGetters([
      'imageHead',
      'isActive'
    ]),
  },
  components:{
    IntroductionComponent,
    NoActive
  },
  created(){
    this.init()
  },
  methods: {
    init(){
      api.getStoreColumnInfo({
        id:this.$route.query.contentId
      }).then(res=>{
        if(res.success){
          if(res.data.articleNumber !== 0){
            res.data.percent = res.data.articleUpdateNumber / res.data.articleNumber * 100

            if(res.data.percent > 100){
              res.data.percent = 100
            }
          }else{
            res.data.percent = 0
          }

          if(res.data.modifyDate ){
            res.data.modifyDate = res.data.modifyDate.substr(0,10)
          }
          if(res.data.modifyDate ){
            res.data.auditDate = res.data.auditDate.substr(0,10)
          }

          this.pageData = res.data
          switch(this.pageData.auditStatus) {
            case 10:
            case 20:
              this.isOpen="待审核"
              break;
            case 30:
              this.isOpen="已通过"
              break;
            case 40:
              this.isOpen="未通过"
              break;
          }
        }
      })

      api.getIntroductionInfo({
        columnId:this.$route.query.contentId
      }).then(res=>{
          if(res.success){
            this.introducttionData = res.data
          }
      })
    },
 
    back () {
      this.$router.push({
        name:'MycolumnThird',
        query:{
          aduio:1
        }
      })
    },

    pass(){ // 通过
      api.updateColumnStatus({
        id:this.$route.query.contentId,
        status:30,
        reason:''
      }).then(res=>{
        if(res.success){
          this.$message({
            message: '审核通过',
            type: 'success'
          });
          this.dialogFormVisible = false
          this.init()
        }
      })
    },

    refuse(){// 拒绝
    if(this.shelvesReason === ''){
        this.$message({
          message: '请输入拒绝原因！',
          type: 'warning'
        });
      }else{
        api.updateColumnStatus({
          id:this.$route.query.contentId,
          status:40,
          reason:this.shelvesReason
        }).then(res=>{
          if(res.success){
            this.$message({
              message: '操作成功',
              type: 'success'
            });
            this.dialogFormVisible = false
            this.init()
          }
        })
      }
    },

    cancel(){
      this.dialogFormVisible = false
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

section 
  width 100%
  position relative
  font-size 0.14rem
  color #4A4A4A
  >>>.el-alert--info
    background  #e6f8f7 !important
  >>>.icon-tongzhi--:before
    top 1px
    left 6px
    color $color-theme
  >>>.el-tabs__content
    overflow inherit
  >>>.el-alert__title.is-bold
    font-weight 400
    color #666666
  .content_box
    margin-bottom 0
    background #ffffff
  .editor-btn
    text-align right
    flex()
    justify-content flex-end
    .el-button 
      padding 0!important
  .header
    display flex
    justify-content space-between
    align-items center
    color #9B9B9B
    font-size 0.2rem
    margin-bottom 0.14rem
    height 0.4rem    
  .prompt
    height 32px
    line-height 32px
    background-color #FFAA00
  >>>.el-tabs__header
    height 0.6rem 
    line-height 0.6rem
  >>>.el-tabs__content
    padding-bottom 0.3rem
    background-color  #ffffff
  .text-introduction
    margin-top 0.49rem
    .introduction-content
      width 100%
      margin-top 0.2rem;
      min-height 2.4rem;
      padding-bottom 0.2rem;
      >>>img 
        width auto
        height auto
        max-height 6rem
    h3
      padding-left 0.2rem
      width 100%
      height 0.4rem
      line-height 0.4rem
      background #F9FAF9
      font-size 14px
      font-weight 400
      color rgba(155,155,155,1)
    p
      width 100%
      margin-top 0.2rem
      font-size 14px
      font-weight 400
      color rgba(74,74,74,1)
      line-height 20px
    img 
      margin 0.14rem 0 0.11rem 0
  .introduction
      font-family PingFangSC
      width 720px
      margin 38px auto
    >>>.el-tabs__header
      height 0.6rem
      line-height 0.6rem
      font-size 14px
      color #666666
      margin 0 !important
      background-color #ffffff
      box-sizing border-box
      padding 0 20px
    .column_box
      box-sizing border-box
      padding 0 0.2rem
      position relative
      margin .3rem auto
      width 100%
      font-size 14px
      .header
        box-sizing border-box
        padding-left 0.2rem
        width 100%
        font-size 14px
        height 0.4rem
        line-height 0.4rem
        color #9B9B9B
        margin-bottom 20px
        background-color #F9FAF9
      .img_box
        display flex
        height 150px
        img
          width 240px
          height 150px
        .right_box
          width calc(100% - 240px)
          padding-left 20px
          box-sizing border-box
          .title
            display flex
            flex-flow row nowrap
            color #4A4A4A
            height 42px
            line-height 42px
            font-weight bold
            >span:nth-child(1)
              font-size 30px
            >span:nth-child(2)
              align-self flex-end
              margin-bottom 4px
              height 18px
              background-color $color-theme
              color #fff
              font-size 12px
              line-height 18px
              width 0.45rem
              border-radius 2px
              text-align center
          .new_box
            .new
              font-size 0.14rem
              height 20px
              font-weight 400
              color $color-theme
              margin-top 20px
              line-height 20px
              margin-bottom 5px
            .autor
              height 20px 
              font-size 0.14rem
              font-weight 400
              color rgba(155,155,155,1)
              line-height 20px 
              span 
                color #666666
            .price
              height 20px 
              font-size 0.14rem
              font-weight 400
              margin-left 0.2rem
              color rgba(155,155,155,1)
              line-height 20px 
              span 
                color #666666
          .line
              height 1px
              background-color #E6E6E6
              width 100%
              margin-top 11px
          .see
            margin-top 10px
            display flex
            flex-direction column
            justify-content flex-start
            align-items flex-start
            span 
              overflow hidden
              text-overflow ellipsis
              white-space nowrap
              height 17px
              font-size 14px
              font-weight 400
              color rgba(155,155,155,1)
              margin-bottom 5px
    .form-box
      width 100%
      h1
        height 25px
        font-size 18px
        font-weight 600
        color rgba(74,74,74,1)
        margin-bottom 0.4rem
        line-height 25px
      >>>textarea
        height 2.43rem !important
      .footer
        text-align center
        margin 20px auto
        margin-bottom 0
        height 40px
        button
          width 120px
          height 40px
          border-radius 4px
          box-sizing border-box
          text-align center
        button:nth-child(1)
          background-color #ffffff
          color #9B9B9B
          margin-right 20px
          border:1px solid rgba(230,230,230,1)
        button:nth-child(2)
          background-color $color-theme
          color #ffffff
  .colInfoList, .fkc_box_two
    width 5.32rem
    margin 0.4rem auto 0
    .audio_style
      margin-top 0.2rem
    .audio_info, .base_info, .col_intro
        h3
            color #9B9B9B
            background #EEF2F3
            font-size 0.14rem
            height 0.3rem
            line-height 0.3rem
            padding-left 0.08rem
    .base_info
        min-width 5rem
        .info
            margin-top 0.2rem
            font-size 0.14rem
            display flex
            justify-content flex-start
            img
                width 2.4rem
                height 1.5rem
            .box_info
                margin-left 0.2rem
                font-size 0.14rem
                width calc(100% - 2.6rem)
                .info_title
                    height 0.22rem
                    line-height 0.22rem
                    margin-bottom 0.2rem
                    .title
                        color #4A4A4A
                        font-weight bold
                        font-size 0.16rem
                        height 0.22rem
                        line-height 0.22rem
                        margin 0 !important
                    .sjzt
                        font-size 0.12rem
                        color #FFFFFF
                        height 0.18rem
                        line-height 0.18rem
                        background $color-theme
                        margin-left 0.1rem
                        position relative
                        bottom 0.01rem
                        padding 0.005rem 0.045rem
                    .wsj
                        background #E6E6E6
                        color #9B9B9B
                .up_time
                    height 0.2rem
                    line-height 0.2rem
                    color $color-theme
                    margin-bottom 0.05rem
                    font-size 0.14rem
                .price_num
                    height 0.3rem
                    border-bottom 1px solid #E6E6E6
                    span
                        color #9B9B9B
                    .cl
                        color #666666
                    .fh
                        width 0.01rem
                        height 0.1rem
                        background #9B9B9B
                        line-height 0.1rem
                        margin 0 0.05rem
                .btn_check
                    background $color-theme
                    width 1rem
                    color #FFFFFF
                    font-size 0.12rem
                    height 0.32rem
                    line-height 0.32rem
                    border-radius 0.04rem
                    cursor pointer
                .zt
                    color #9B9B9B
                    font-size 0.12rem
                    margin-left 0.15rem
        .progress
            width 100%
            margin-top 0.24rem
            h4
                color #9B9B9B
                font-size 0.12rem
                margin-bottom 0.1rem
            .progboxss
                height 0.2rem
                display flex
                justify-content space-between
                width 100%
                line-height 0.2rem
                span
                    height 0.2rem
                    line-height 0.2rem
                    color #9B9B9B
                    font-size 0.14rem
                .progbox
                    margin 0
                    width 83.5%
                >>> .el-progress-bar__outer
                    height 0.1rem !important
                >>> .el-progress-bar__innerText
                    font-size 0.06rem !important
                    position relative
                    bottom 0.03rem
    .col_intro
        margin-top 0.5rem
        color #4A4A4A
        font-size 0.14rem
        h3
            margin-bottom 0.2rem
        >>>img
            width auto
            max-width 100%
            height auto
            max-height 6rem
            margin 0.14rem 0 0.31rem 0
        p
            line-height 0.2rem
            min-height 1.19rem
</style>
<style lang="css">
    .mycolumnupload .el-progress-bar__outer{
        width:100% !important;
        height: 3px !important;
    }
    .mycolumnupload .percent .el-progress__text{
      float:right;
      margin-top: 11px;
    }
    .mycolumnupload .percent .el-progress-bar{
      position: relative;
      width: 4.59rem;
      padding-right: 0;
      /* left: -43px; */
    }
    .mycolumnupload .upload{
      width: 150px;
      height: 40px;
      background-color: #6cddc7;
      border-radius: 20px;
      color: #ffffff;
      margin-left:50px;
    }
    .mycolumnupload .el-progress-bar__inner{
        background-color: #6cddc7 !important;
    }
    .el-slider__button-wrapper .el-tooltip, .el-slider__button-wrapper::after{
		  display:none !important;
    }
    .el-slider__bar,.el-slider__runway{
      height:3px;
    } 
    .el-col-4{
      width:6.66667%;
    }

</style>
