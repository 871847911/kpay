<template>
  <div class="carousel">
    <div class="carousel-head layout-head">
        <span>添加/编辑轮播图</span>
        <div class="head-right">
          <span class="come-back" style="cursor:pointer;" @click="goBack"><i class="iconfont icon-fanhui"></i>返回</span>
          <el-button @click="goBack">上一步</el-button>
          <el-button class="major-btn" @click="submit">提交</el-button>
        </div>
    </div>
    <div class="carousel-msg">
      <h1>轮播图信息</h1>
      <div class="msg">
        <div class="msg-left">
          <img :src="imageHead + sourceDate.sourceUrl" alt="">
        </div>
        <div class="msg-right">
          <div>
            <p>具体信息</p>
            <p>
              <span>轮播图位置</span>
              <span>{{sourceDate.type===1?"首页轮播图":"店铺详情轮播图"}}</span>
            </p>
            <p>
              <span>显示顺序</span>
              <span>{{sourceDate.sortNum}}</span>
            </p>
          </div>
          <div>
            <p>
              <span style="margin-right:15px;">跳转内容</span>
              <span>营销</span>
            </p>
            <p><span>是否显示</span>
              <span>
                <el-switch
                  v-model="sourceDate.isOnline">
                </el-switch>
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
    <div class="content-img">
      <div class="img-header">
        <!-- <div class="top">
          <div class="course-header">
            <el-input v-model="value2" placeholder="模块名称"></el-input>
            <el-button type="success">搜索</el-button>
          </div>
        </div> -->
        <el-alert
          :title="alertText"
          type="warning"
          show-icon
          v-if="alertState"
          >
        </el-alert>
        <div class="bottom">
          <ul style="padding-top:9px;">
            <li :class="curNavId==1?'active':''">
              <div class ="box">
                <div class="img-box">
                  <i class="iconfont icon-xiaofeizhe-"></i>
                </div>
                <p>拼团首页</p>
                <el-button @click="choose(1,'拼团首页')">选择</el-button>
              </div>
            </li>
            <li :class="curNavId==2?'active':''">
              <div class="box">
                <div class="img-box">
                  <i class="iconfont icon-zhekoutexiang-"></i>
                </div>
                <p>分享免费读首页</p>
                <el-button  @click="choose(2,'分享免费读首页')">选择</el-button>
              </div>
            </li>
          </ul>
        </div>
      </div>
       <div class="pagination">
          <el-pagination
              background
              @size-change="handleSizeChange"
              @current-change="handleCurrentChange"
              :current-page.sync="currentPage"
              :page-size="pageSize"
              layout="prev, pager, next, sizes, jumper"
              :page-sizes="[5, 10, 15, 25]"
              :total="total">
          </el-pagination>
        </div>
    </div>
  </div>
</template>

<script>
import api from 'fetch/api'
import Cookies from 'js-cookie'
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: "CarouselHomePersonal",
  data (){
    return {
      templateList:[],
      chooseState:'选择',
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0, // 列表数据总条数
      courseName:'',
      activeName:'first',
      activeState:1,
      curNavId:'',
      sourceDate:{},
      alertState:false,
      alertText:''
    }
  },
  computed:{
    ...mapGetters([
      'imageHead'
    ])
  },
  created (){
    this.source = JSON.parse(Cookies.get('carouselDate'))
  },
  mounted (){
   this.sourceDate = {...this.source}
  },
  methods:{
    handleClick (){

    },
    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      this.initTemplates()
    },

    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      this.initTemplates()
    },

    // 选中列表
    choose(index,val){
      this.curNavId = index
      this.sourceDate.pageName = val
      this.sourceDate.linkValue = index
      this.alertState = true
      this.alertText = `已选择 个人中心—${val}`
    },

    // 提交
    submit(){
      if(this.sourceDate.id){
        api.editorCoursel(this.sourceDate).then(res =>{
          if(res.success){
            Cookies.remove('carouselDate')
            this.$router.push({
              path:'carouselhome'
            })
          }else{
            this.$message({
              message: res.message,
              type: "error"
            })
          }
        })
      }else{
        api.addCoursel(this.sourceDate).then(res =>{
          if(res.success){
            Cookies.remove('carouselDate')
            this.$router.push({
              path:'carouselhome'
            })
          }else{
            this.$message({
              message: res.message,
              type: "error"
            })
          }
        })
      }
    },
    goBack(){
      this.$router.back()
    }
  }
}
</script>
<style lang="stylus" scoped>
  @import "~assets/styles/mixins"
  @import "~assets/styles/varibles"
  .carousel
    width 100%
    box-sizing border-box
    -webkit-box-sizing border-box
    --moz-box-sizing border-box
    .active
      color #6CDDC7
    .carousel-head
      .head-right
        display flex
        align-items center
        .el-button
          width 0.82rem
          height 0.40rem
          border-radius 4px
          margin-left 10px!important
          &:nth-of-type(2)
            margin 0
            background rgba(108,221,199,1)
    .carousel-msg
      width 100%
      height 2.5rem
      padding 0.2rem
      background-color #ffffff
      box-sizing border-box
      -webkit-box-sizing border-box
      --moz-box-sizing border-box
      h1
        height 20px
        font-size 14px
        font-weight 400
        color rgba(108,221,199,1)
        margin-bottom 0.3rem
        line-height 20px
      .msg
        flexBetween()
        .msg-left
          overflow hidden
          position relative
          margin-right 40px
          float left
          text-align left
          width 4.4rem
          height 1.5rem
          img 
            width 4rem
            height 100%
        .msg-left:before
          content ''
          position absolute 
          width 1px
          height 100%
          right -40px
          background rgba(230,230,230,0.4)
        .msg-right
          padding-left 38px
          width 100%
          height 1.5rem
          float left
          font-size 14px
          font-weight 400
          color rgba(74,74,74,1)
          line-height 22px
          div
            float left
            &:nth-child(2)
              margin-top 57px
              margin-left 108px
            p
              &:nth-of-type(1)
                height 22px;
                font-size 14px;
                font-weight 400;
                color rgba(74,74,74,1);
                line-height 22px;
                margin-bottom 35px
              &:nth-of-type(2)
                margin-bottom 30px
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                span
                  &:nth-of-type(1)
                    height 20px
                    font-size 14px
                    font-weight 400
                    margin-right 0.2rem
                    color rgba(155,155,155,1)
                    line-height 20px
              &:nth-of-type(3)
                span 
                  &:nth-of-type(1)
                    margin-right 34px
                    font-size 14px
                    font-weight 400
                    color rgba(155,155,155,1)
                    line-height 20px
    .content-img
      box-sizing border-box
      margin-top 0.2rem
      .img-header
        padding 20px 20px 0 20px
        margin-bottom 20px
        background-color #ffffff
        .el-alert__title
          font-size:12px;
          font-weight:400;
          color:rgba(102,102,102,1);
        .el-button
          width 120px
          height 40px
          background rgba(255,255,255,1)
          border-radius 4px
          border 1px solid rgba(230,230,230,1)
        .top
            flexBetween()
            margin-bottom 20px
            .course-header
              width 3.8rem
              flexBetween()
              .el-input
                width 3rem
                margin-right 0.1rem
              button 
                width 0.7rem
                height 0.4rem
                background  rgba(108,221,199,1)
                border-radius 4px
                font-size 14px
                font-weight 400
                color rgba(74,74,74,1)
        .bottom
          ul
            overflow hidden
            li
              position relative
              --webkit-box-sizing  border-box
              flex()
              width 2.6rem
              height 2.82rem
              margin 0 0 0.2rem 0.2rem 
              padding-top 0.2rem
              float left
              background rgba(249,250,249,1)
              border-radius 5px
              box-sizing border-box
              div.box
                columnFlex()
                width 2.58rem
                height 2.78rem
                div.img-box
                  flex()
                  width 1.5rem
                  height 1.5rem
                  border-radius 50%
                  background-color #ffffff 
                  i 
                    font-size 0.6rem
                    color #9B9B9B
                p
                  margin-top 0.1rem
                  height 20px
                  font-size 16px
                  font-weight 600
                  color rgba(74,74,74,1)
                  line-height 22px
                .el-button
                  margin-top 0.2rem
             li.active
              box-sizing border-box
              background #ffffff
              -moz-box-shadow 3px 0px 11px #333333 
              -webkit-box-shadow 3px 0px 11px #333333
              box-shadow 3px 0px 11px #cccccc
              .img-box
                background-color #F9FAF9!important
                i 
                  color $color-theme!important
              .el-button
                border none
                background-color $color-theme !important
                color #ffffff !important
      .pagination
        display flex
        justify-content flex-end
        align-items center
        padding-right .2rem
        margin-bottom .27rem


</style>
