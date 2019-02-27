<template>
  <section class="mycolumnupload">
    <div v-if="isActive == 4">
      <div class="header layout-head">
          <span>内容审核详情</span>
          <div class="operate">
            <span class="come-back" @click="back" style="margin-right:20px;"><i class="iconfont icon-fanhui"></i>返回</span>
            <span v-if="pageData.auditStatus===20">
              <el-button class="major-btn" @click="pass">通过</el-button>
              <el-button class="less-btn" @click="dialogFormVisible=true">拒绝</el-button>
            </span>
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
      </div>
  
      <div class = "content_box">
        <div class = "content_header">
          <div class = "column_box">
            <p class="part-title">基本信息</p>
            <div class="info">
              <div class="info-content">
                <div class="info-left">
                  <img :src="imageHead + pageData.contentUrl" alt="图片">
                </div>

                <div class="info-right">
                  <div class="info-right-tp">
                    <div class="title-top">
                      <p>{{pageData.contentName}}</p>
                      <span v-if="pageData.auditStatus === 40" class="down-status">未通过</span>
                      <span v-else class="up-status">{{isOpen}}</span>
                    </div>
                    <div class="see">
                      <span>提交时间：{{pageData.createDate}}</span>
                      <span v-if="pageData.auditStatus > 20">审核时间：{{pageData.auditDate}}</span>
                    </div>
                  </div>
               
                  <div class="info-right-bt">
                    <div class="detail-top">
                      <div style="width:70%;height:56px;">
                        <p>专栏名称</p>
                        <strong v-if="pageData.storeColumn">{{pageData.storeColumn.columnName}}</strong>
                      </div>
                      <div style="width:30%;height:56px;">
                        <p>作者</p>
                        <strong v-if="pageData.storeColumn">{{pageData.storeColumn.userName}}</strong>
                      </div>
                    </div>
                    <div class="detail-bottom">
                      <div>
                        <p>篇幅</p>
                        <strong v-if="pageData.storeColumn">{{pageData.storeColumn.articleNumber}}</strong>
                      </div>
                        <div>
                        <p>当前篇幅</p>
                        <strong>{{pageData.currentNo}}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
         
            <GraphicContentComponent :content="pageData"></GraphicContentComponent>
          </div>
        </div>
      </div>
    </div>
     <no-active v-if="isActive == 3" @reFresh="init"></no-active>
  </section>
       
</template>
<script>
import api from 'fetch/api'
import GraphicContentComponent from '../../GraphicContentComponent'
import NoActive from 'components/common/NoActive'
import {mapGetters} from 'vuex'

export default {
  name: "MycolumnThirdViewDetail",
  data() {
    return {
      activeName: 'first',
      pageData:{},
      isOpen:'',
      isShow:true,
      auditStatus:'',
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
    GraphicContentComponent,
    NoActive
  },
  created(){
    this.init()
  },
  methods: {
      init(){
        api.getColumnContentInfo({
            id:this.$route.query.contentId
        }).then(res=>{
          if(res.success){
            const {articleUpdateNumber, articleNumber, createDate, auditDate} = res.data

            if(articleNumber !== 0){
              res.data.percent = articleUpdateNumber / articleNumber * 100

              if(res.data.percent > 100){
                res.data.percent = 100
              }
            }else{
              res.data.percent = 0
            }

            if(createDate){
                res.data.createDate = createDate.substr(0,10)
            }

            if(auditDate){
                res.data.auditDate = auditDate.substr(0,10)
            }

            this.pageData = res.data

            switch(res.data.auditStatus){
              case 10:
              case 20:
                this.isOpen = "待审核"
                break;
              case 30:
                this.isOpen ="已通过"
                break;
              case 40:
                this.isOpen ="未通过"
                break;
            }
          }
        })
      },
     
      back () {
        this.$router.push({
          name:'MycolumnThird',
          query:{
            aduio:2
          }
        })
      },
   
      pass(){ // 通过
        api.updateColumnContentStatus({
            id:this.$route.query.contentId,
            status:30,
            reason:''
        }).then(res=>{
          if(res.success){
            this.$message({
              message: '审核通过',
              type: 'success'
            });
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
          api.updateColumnContentStatus({
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
      },
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
  .header
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
  .content_box
    margin-bottom 0
    .part-title
      width 100%
      height 40px
      line-height 40px
      color #999999
      padding-left 0.2rem
      background-color #F9FAF9
    .info
      margin-bottom 0.3rem
      width 100%
      background #ffffff
      .info-content
        width 6.6rem
        padding 0.3rem 0 0.4rem 0.2rem
        height auto
        flex()
        align-items flex-start
        .info-left
          flex-shrink 0
          width 2.4rem
          margin-right .2rem
          height 1.8rem
          img
            width 100%
            height 100%
        .info-right
          display flex
          flex-direction column
          height 100%
          flex-1()
        .info-right-tp
          width 100%
          min-height 78px
          align-items baseline
          justify-content flex-start
          position relative
          flex-direction column
          .title-top
            display flex
            justify-content flex-start
            align-items center
            margin-bottom 0.1rem
          .see
            margin 0.1rem 0 0.2rem 0
            display flex
            flex-direction row
            justify-content flex-start
            align-items flex-start
            button 
              width 100px
              height 32px
              background $color-theme
              border-radius 4px
              font-size 1px
              font-weight 400
              color rgba(255,255,255,1)
              line-height 18px
            span 
              overflow hidden
              text-overflow ellipsis
              white-space:nowrap
              height 17px
              font-size 14px
              font-weight 400
              color rgba(155,155,155,1)
              line-height 17px
              &:nth-child(1)
                margin-right 0.1rem
          &::after
            content ""
            position absolute
            left 0
            bottom 0
            width 669px
            height 1px
            background-color rgba(230,230,230,.5)
          p 
            display inline-block
            line-height 0.38rem
            font-size 30px
            font-weight 600
            margin-right .15rem
          .up-status
            flex-shrink 0
            color #ffffff
            background-color $color-theme
            border-radius 2px
            font-size 12px
            padding 5px
          .down-status
            flex-shrink 0
            color #9B9B9B
            background-color #F43025
            border-radius 2px
            font-size 12px
            padding 2px 3px
        .info-right-bt
          width 3.8rem
          display flex
          flex-flow row nowrap
          align-items flex-start
          justify-content flex-start
          margin-top .2rem
          .detail-top
            flex()
            width 50%
            position relative
            &::after
              content ""
              position absolute
              right 0
              top 0
              width 1px
              height .56rem
              background-color rgba(230,230,230,.5)
          .detail-bottom
            width 50%
            flex()
            line-height .23rem
            justify-content flex-end
            >div
              height 0.56rem
              margin-left .4rem
          p
            line-height 0.23rem
            color #9B9B9B
            font-size 14px
            margin-bottom .1rem
          strong 
            color #4A4A4A
            font-size 14px
  
  
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
