<template>
  <section class="my-column-list-detail">
    <div v-if="isActive == 4">
      <div class="header layout-head">
        <span>图文信息</span>

        <div class="right-bar">
          <span class="come-back" style="cursor:pointer;" @click="back"><i class="iconfont icon-fanhui"></i>返回</span>
          <!-- <div class="editor-btn" v-if="isUnAudit && content.onStatus !== 1"> 
            <el-button type="success" @click="handleSubmit">提交审核</el-button>
            <el-button type="primary" @click="handleEditor">编辑</el-button>
          </div> -->
          <div class="editor-btn"> 
            <el-button class="major-btn" @click="dialogFormVisible=true" v-if="isUnAudit && content.onStatus === 1">下架</el-button>
          </div>
          <el-dialog :visible.sync="dialogFormVisible" :show-close="true" width="650px">
            <div class="form-box">
              <h1>下架原因</h1>
              <el-input
                type="textarea"
                autosize
                placeholder="请填写下架理由"
                v-model="shelvesReason"
                >
              </el-input>
              <div class="footer">
                <button @click="cancel()">取消</button>
                <button @click="handlOffShelf()">确定</button>
              </div>
            </div>
          </el-dialog>
        </div>
      </div>

      <div class="content-box">
        <basicInfo :content="content" :columnData="columnData"></basicInfo>
        <GraphicContentComponent :content="content"></GraphicContentComponent>
      </div>
    </div>
    <no-active v-if="isActive == 3" @reFresh="isInit"></no-active>
  </section>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from 'vuex'
import basicInfo from '../../BasicInfo'
import NoActive from 'components/common/NoActive'
import GraphicContentComponent from '../../GraphicContentComponent'

export default {
  name: "MycolumnThirdDetail",
  data() {
    return {
      content: {},
      columnData: {},
      remindTitle: '',
      isUnAudit: true,
      dialogFormVisible:false,
      shelvesReason:''
    };
  },

  computed: {
    ...mapGetters([
      'imageHead',
      'isActive'
    ])
  },

  components:{
    basicInfo,
    GraphicContentComponent,
    NoActive
  },

  mounted(){
    this.isInit()
  },

  methods: {
    isInit(){
      this.getColumn()
      this.init()
    },

    // 获取专栏标题和篇数
    getColumn(){
      api.getColumnInfo({ 
        id: this.$route.query.columnId
      }).then(res => {
        if(res.data){
          this.columnData = res.data
        } 
      })
    },

    // 初始化
    init(){
      const {contentId} = this.$route.query

      if(contentId){
        api.getColumnContentInfo({
          id: contentId
        }).then(res => {
          if(res.data){
            const {onStatus, auditStatus, contentName} = res.data

            this.content = res.data

            switch (auditStatus) {
              case 10:
                this.remindTitle = `【${contentName}】还未提交审核`
                break;
              case 20:
                this.remindTitle = `【${contentName}】正在审核中`
                this.isUnAudit = false
                break;
            }
          }
        })
      }
    },

    // 提交审核
    handleSubmit(){
      api.updateColumnContentStatus({
        id: this.$route.query.contentId,
        status: 20,
        reason: ''
      }).then(res => {
        if(res.success){
          this.$message.success('提交成功！')
          this.isUnAudit = false
        }else{
          this.$message.error('提交失败！')
        }
      })
    },

    // 下架
    handlOffShelf(){
      this.dialogFormVisible = true
      api.updateColumnContentStatus({
        id: this.$route.query.contentId,
        status: 0,
        reason: this.shelvesReason
      }).then(res => {
        if(res.success){
          this.dialogFormVisible = false
          this.$message.success('下架成功！')
          this.isUnAudit = true
          this.init()
        }else{
          this.$message.error('下架失败！')
        }
      })
    },

    cancel(){
      this.dialogFormVisible = false
    },

    // 编辑
    handleEditor(){
      const {columnId, contentId, columnNo} = this.$route.query

      this.$router.push({
        name:'MycolumnListCoEdit',
        query:{
          columnId,
          contentId,
          columnNo
        }
      })
    },

    // 回退
    back() {
      this.$router.back()
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.my-column-list-detail 
  width 100%
  position relative
  font-size 0.14rem
  color #4A4A4A
  .header
    .right-bar
      flex()
      >>>.el-dialog__body
        padding 0 20px 30px 20px
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
            border-radius:4px;
            box-sizing border-box
            text-align center
          button:nth-child(1)
            background-color #ffffff
            color #9B9B9B
            margin-right 20px
            border:1px solid rgba(230,230,230,1);
          button:nth-child(2)
            background-color $color-theme
            color #ffffff
      .editor-btn
        flex()
        margin-left .2rem
        .el-button 
          width .82rem
          height .4rem
          padding 0!important
          &:nth-child(1)
            background  $color-theme
            border none
            border-radius 4px
          &:nth-child(2)
            color $color-theme
            background  rgba(255,255,255,1)
            border-radius 4px
            border 1px solid $color-theme
  .content-box
    min-height 7rem
    margin-bottom 0
    .part-title 
      font-size 14px
      line-height 49px
      color $color-theme
      border-bottom 1px solid #E6E6E6
      margin-bottom .3rem
    .small-part-title 
      color #9B9B9B
      background #EEF2F3
      font-size 0.14rem
      height 0.3rem
      line-height 0.3rem
      padding-left 0.08rem
      margin-bottom 0.2rem
    .img-content, .info-content
      width 6.6rem
      margin 0.4rem auto 0
    .info-content
      height auto
      flex()
      align-items flex-start
      .info-left
        width 2.4rem
        margin-right .4rem
        height 1.5rem
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
        padding-bottom .4rem
        flex()
        align-items center
        justify-content flex-start
        position relative
        &::after
          content ""
          position absolute
          right 0
          bottom 0
          width 100%
          height 2px
          background-color rgba(230,230,230,.5)
        p 
          display inline-block
          font-size 20px
          font-weight 600
          margin-right .15rem
        .up-status
          color #ffffff
          background-color $color-theme
          border-radius 2px
          font-size 12px
          padding 5px
        .down-status
          color #9B9B9B
          background-color #E6E6E6
          border-radius 2px
          font-size 12px
          padding 5px
      .info-right-bt
        width 100%
        display flex
        flex-flow row nowrap
        align-items flex-start
        justify-content flex-start
        margin-top .3rem
        .detail-top
          width 50%
          position relative
          line-height .23rem
          padding-right .4rem
          &::after
            content ""
            position absolute
            right 0
            top 0
            width 2px
            height .56rem
            background-color rgba(230,230,230,.5)
        .detail-bottom
          width 50%
          flex()
          line-height .23rem
          justify-content flex-start
          >div
            margin-left .4rem
        p
          color #9B9B9B
          font-size 14px
          margin-bottom .1rem
        strong 
          color #4A4A4A
          font-size 14px
    .img-content
      .col-intro
        margin-top 0.5rem
        color #4A4A4A
        font-size 0.14rem
        img
          width 4.04rem
          height 2.4rem
          margin 0.14rem 0 0.31rem 0
        p
          line-height 0.2rem
          min-height 1.19rem
</style>
