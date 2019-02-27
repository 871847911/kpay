<template>
<div class="vip-level">
  <div v-if="isActive == 4">
    <div class="topbar layout-head">
      <div>
        <h3>会员等级管理</h3>
        <router-link to="">如何创建和管理会员等级系统？</router-link>
      </div>  
      <div>
        <router-link to="/index/viplvpower"><i class="iconfont icon-liulan"></i>查看相应等级特权</router-link> 
      </div>
    </div>

    <div class="contain">
        <div class="step-panel step-one" v-show="stepIndex === 1">
          <div class="center-box">
            <div class="left">
              <h3>选择等级模板</h3>
              <div>
                <ul>
                  <li v-for="(item,index) of templateList" :key="item.id" @click="chooseOwnTpl(item,index)" :class="currentTplIndex === index ? 'choosen' : ''">
                    <i class="iconfont icon-moban-"></i>
                    <p>{{item.templateName}}</p>
                  </li>
                </ul>
              </div>
            </div>
            <div class="right">
              <div class="head ">
                <span class="step">1</span>
                <span>2</span>
                <span>3</span>
              </div>
              <div class="content">
                  <i class="iconfont icon-mobanxuanze-"></i>
                  <p>选择等级模版</p>
                  <div>
                    <p>点击等级模版 </p>
                    <p>详情查看具体等级设定内容</p>
                  </div>
              </div>
              <div class="footer">
                  <span class="current"></span>
                  <span></span>
              </div>
            </div>
          </div>
          <span class="step-remind">Step 1</span>
        </div>

        <div class="step-panel step-two" v-show="stepIndex === 2">
          <div class="center-box">
            <div class="left">
              <h3>选择等级模板</h3>
              <div class="left-middle">
                <img :src="chooseTpl.templateUrl" alt="模板图片" @click="showGallery = true">
                <strong>{{chooseTpl.templateName}}</strong>
                <p>{{chooseTpl.remark}}</p>
              </div>
              <div class="action-box">
                  <button @click="backStep(1)">返回上层</button>
                  <button @click="nextStep">立即使用</button>
              </div>
            </div>
            <div class="right">
              <div class="head ">
                <span>1</span>
                <span class="step">2</span>
                <span>3</span>
              </div>
              <div class="content">
                  <i class="iconfont icon-chakan-"></i>
                  <p>查看模版详情</p>
                  <div>
                    <p>点击图片具体查看详情</p>
                    <p>选择适用模版可立即使用</p>
                    <p>使用后不可更改</p>
                  </div>
              </div>
              <div class="footer">
                  <div>
                    <p>客服电话</p>
                    <p>0574-12345678</p>
                  </div>
                  <span></span>
                  <span class="current"></span>
                  <span></span>
              </div>
            </div>
          </div>
          <span class="step-remind">Step 2</span>
        </div>

        <div class="step-panel step-three" v-show="stepIndex === 3">
          <div class="center-box">
            <div class="left">
              <h3>确认维护会员模版</h3>
              <div class="left-middle">
                <i class="iconfont icon-zaiciqueren"></i>
                <strong>确认选用{{chooseTpl.templateName}}</strong>
                <p>你确定使用这个会员等级模版吗？</p>
                <p>选用后不允许更换模版。</p>
              </div>
              <div class="action-box">
                  <button @click="backStep(2)">返回上层</button>
                  <button @click="confirmTpl">确定</button>
              </div>
            </div>
            <div class="right">
              <div class="head ">
                <span>1</span>
                <span>2</span>
                <span class="step">3</span>
              </div>
              <div class="content">
                  <i class="iconfont icon-querenmobanxuanze-"></i>
                  <p>确认模版选择</p>
                  <div>
                    <p>确认选择模版</p>
                    <p>一旦使用后不可更改</p>
                  </div>
              </div>
              <div class="footer">
                  <span></span>
                  <span class="current"></span>
              </div>
            </div>
          </div>
          <span class="step-remind">Step 3</span>
        </div>
    </div>

    <pic-gallery :picUrl="chooseTpl.templateUrl" :isShow="showGallery" @closeGallery="closeGallery"></pic-gallery>
  </div>
  <no-active v-if="isActive == 3" @reFresh="initTemplates"></no-active>
</div>
</template>

<script>
import api from "fetch/api"
import { Message } from 'element-ui'
import PicGallery from "components/common//PicGallery";
import NoActive from 'components/common/NoActive'
import {mapGetters} from 'vuex'

export default {
  name: "VipLv",
  data() {
    return {
      templateList: [], //模板数组
      stepIndex: 1, //当前引导步骤
      currentTplIndex: -1, //选中模板的索引
      chooseTpl: {}, //当前选中的模板
      showGallery: false //是否显示画廊
    };
  },

  computed: {
    ...mapGetters([
      'isActive'
    ])
  },

  components: {
    NoActive,
    PicGallery
  },

  beforeRouteEnter (to, from, next) {
    api.getStoreVipLevelConfigList().then(res => {
      if(res.data && res.data.length !== 0){
        next({
          path:"/index/viplvlist"
        })
      }else{
        next(true)
      }
    })
  },

  created() {
    this.initTemplates()
  },

  methods: {
    // 初始化数据
    initTemplates() {
      api.getVipLevelTemplateDTOList().then(res => {
        if(res.data){
          this.templateList = res.data
        }
      });
    },

    // 选择模板
    chooseOwnTpl(item, index){
      this.chooseTpl = item
      this.currentTplIndex = index
      this.stepIndex = 2
    },

    // 关闭画廊
    closeGallery(){
      this.showGallery = false
    },

    // 返回上一个步骤
    backStep(index){
      this.stepIndex = index
    },

    // 立即使用
    nextStep(){
      this.stepIndex = 3
    },

    // 确认选择版本
    confirmTpl(){
      api.enableTemplateLevel({
        templateId: this.chooseTpl.id
      }).then(res => {
        if(res.data){
          this.$confirm(`您已成功选用${this.chooseTpl.templateName}`, '提示', {
            confirmButtonText: '确定',
            showCancelButton: false,
            closeOnPressEscape: false,
            showClose: false,
            closeOnClickModal: false,
            type: 'success',
            center: true
          }).then(() => {
            this.$router.push("/index/viplvlist")
          }).catch(() => {})
        }else{
          Message.success({
            message: "模板选用失败"
          })
        }
      })
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.vip-level
  width 100%
  box-sizing border-box
  .topbar
    div
      flex()
      color $color-text-l
      &:last-child
        i
          display inline-block
          margin-right .04rem
    h3
      font-size 20px
      margin-right .2rem
      cursor pointer
    p
      cursor pointer
    a 
      color $color-text-l
  .contain
    flex()
    justify-content flex-start
    .step-panel
      position relative
      .step-remind
        position absolute
        top -1rem
        right 0
        font-size 120px
        font-weight bold
        color rgba(74,74,74,0.1)
    .center-box
      position relative
      width 8.6rem
      height 5.6rem
      background rgba(255,255,255,1)
      box-shadow 0 .02rem 0.49rem 0 rgba(0,0,0,0.2)
      border-radius .04rem
      margin-left 1rem
      font-size 14px
      flex ()
      flex-flow row nowrap
      justify-content space-between
      z-index 66
      .left
        padding .4rem
        width 6.2rem
        height 100%
        box-sizing border-box
        .left-middle
          flex-1()
          width 100%
          overflow auto
          img 
            width 100%
            cursor pointer
        h3
          font-size 24px
          color #4A4A4A
        div
          margin-top 0.4rem
          ul
            flex()
            flex-flow row wrap
            justify-content flex-start
          li
            width 1.6rem
            height 1.6rem
            background #ffffff
            border 1px solid #6CDDC7
            border-radius 0.04rem
            flex()
            flex-direction column
            align-items center
            color #9B9B9B
            margin-right .3rem
            margin-bottom .3rem
            box-sizing border-box
            cursor pointer
            &:nth-child(n+3)
              margin-right 0
            i 
              font-size 30px
              margin-bottom .2rem
            &.choosen
              color #ffffff
              background $color-theme
              box-shadow 0 0 0.13rem 0 rgba(0,0,0,0.2)
            &:hover
              color #ffffff
              background $color-theme
              box-shadow 0 0 0.13rem 0 rgba(0,0,0,0.2)
        .action-box
          display flex
          flex-flow row nowrap
          button 
            width 1.2rem
            height .4rem
            border-radius 0.04rem
            color #ffffff
            font-size 12px
            cursor pointer
            &:first-child
              background #ffffff
              border 1px solid #6CDDC7
              color #6CDDC7
              margin-right .2rem
            &:last-child
              background #6CDDC7
      .right 
        width 2.4rem
        height 100%
        background rgba(255,255,255,1)
        box-shadow 0 0 .19rem 0 rgba(0,0,0,0.2)
        border-radius 0 .04rem .04rem 0
        box-sizing border-box
        padding .36rem .3rem
        flex()
        flex-flow column wrap
        justify-content space-between
        .head span
          width 0.39rem
          height 0.39rem
          border-radius 50%
          text-align center
          line-height 0.39rem
          color #9B9B9B
          font-size 20px
          margin 0 .03rem
          &.step
            border .02rem solid $color-theme
            color $color-theme
        .content
          flex()
          flex-flow column wrap
          align-items center
          &>p, &>i
            margin-bottom .2rem
            color #4A4A4A
          i 
            font-size 40px
            color $color-theme
          div
            text-align center
            line-height .2rem
            color #9B9B9B
        .footer 
          text-align center
          span 
            display inline-block
            background-color #E6E6E6
            height .04rem
            width .2rem
            margin-right .04rem
          .current
            width .1rem
          div 
            line-height .28rem
            color #9B9B9B
            text-align center
            margin-bottom .2rem
    .step-two
      .left
        flex()
        flex-flow column nowrap
        align-items flex-start
        div
          line-height .25rem
          color #4A4A4A
          strong 
            margin .03rem 0
      .left-middle
        flex-direction column
        justify-content flex-start !important 
        align-items flex-start !important
      .action-box
        width 100%
        justify-content flex-end
    .step-three
      .left 
        flex()
        flex-flow column nowrap
        align-items flex-start
        div
          width 100%
          flex()
          flex-flow column wrap
          justify-content center
          align-items center
          i
            font-size 95px
            color #FF6767
          strong 
            font-size 20px
            margin .2rem 0
          p
            color #9B9B9B
            line-height .2rem
        .action-box
          justify-content center
</style>