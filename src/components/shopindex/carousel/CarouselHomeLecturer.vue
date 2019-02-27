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
          <img :src="imageHead+sourceDate.sourceUrl" alt="">
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
              <span>讲师</span>
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
        <div class="top">
          <div class="course-header">
            <el-input v-model="phoneNum" placeholder="手机号"></el-input>
            <el-button class="major-btn" @click="searchResult">搜索</el-button>
          </div>
          <div style="display:flex;">
             <!-- <el-dropdown trigger="click">
                <span class="el-dropdown-link">
                  下拉菜单<i class="el-icon-arrow-down el-icon--right"></i>
                </span>
                <el-dropdown-menu slot="dropdown">
                  <el-dropdown-item>黄金糕</el-dropdown-item>
                  <el-dropdown-item>狮子头</el-dropdown-item>
                  <el-dropdown-item>螺蛳粉</el-dropdown-item>
                  <el-dropdown-item>双皮奶</el-dropdown-item>
                  <el-dropdown-item>蚵仔煎</el-dropdown-item>
                </el-dropdown-menu>
              </el-dropdown> -->
          </div>
        </div>
        <el-alert
          :title="alertName"
          type="warning"
          v-if="isShow"
          >
        </el-alert>
        <div class="bottom">
          <ul>
            <li v-for="item in templateList" :key="item.id" :class="curNavId==item.id?'active':''">
              <div class="box">
                <i class="iconfont icon-gou- hook" v-if="curNavId==item.id"></i>
                <div>
                  <img :src="imageHead+item.userInfo.photoUrl" alt="">
                  <p>{{item.userInfo.contact}}</p>
                </div>
                <div class="lect-name">
                  <div>
                    <span>{{item.courseNum}}</span>
                    <span>课程</span>
                  </div>
                  <div>
                    <span>20</span>
                    <span>专栏</span>
                  </div>
                </div>
              </div>
              <div class="mask">
                <el-button type="success" plain @click="choose(item)">选择</el-button>
                <span @click="seeView(item.id,item.roleId)">查看详情</span>
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
  name: "CarouselHomeLecturer",
  data (){
    return {
      templateList:[],
      chooseState:'选择',
      courseName:'',
      phoneNum:'',
      activeName:'first',
      alertName:'',
      isShow:false,
      activeState:1,
      curNavId:'',
      sourceDate:{},
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0 // 列表数据总条数
    }
  },
  computed:{
    ...mapGetters([
      'imageHead'
    ])
  },
  created (){
    this.source = JSON.parse(Cookies.get('carouselDate'))
    this.init()
  },
  mounted (){
    this.sourceDate = {...this.source}
  },
  methods:{
    // 数据初始化
    init(){
      let conf = {
        userName:'',
        phoneNum:this.phoneNum,
        roleId:2,
        page:this.currentPage,
        pageSize:this.pageSize
      }
      api.getLecturerList(conf).then(res =>{
        if(res.data){
          this.templateList = res.data.list
          this.total = res.data.total
        }
      })
    },

    // 搜索
    searchResult(){
      this.init(this.userName)
    },

    // 选择课程
    choose(item){ 
      this.curNavId = item.id
      this.sourceDate.pageName = item.userInfo.contact
      this.alertName = '已选择讲师' + item.userInfo.contact
      this.isShow = true
      this.sourceDate.linkValue = item.id
    },

    // 查看详情
    seeView(valueid,roleIdValue){
      this.$router.push({
        name:"CarouselHomeLeturerDetail",
        query:{
          id:valueid,
          roleId:roleIdValue
        }
      })
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
  
    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },

    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    },

    // 返回
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
          margin-left 0.1rem !important
          &:nth-of-type(2)
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
        height 0.2rem
        font-size 14px
        font-family PingFangSC-Regular
        font-weight 400
        color rgba(108,221,199,1)
        margin-bottom 0.3rem
        line-height 20px
      .msg
        flexBetween()
        .msg-left
          overflow hidden
          position relative
          float left
          text-align left
          margin-right 0.4rem
          width 4.4rem
          height 1.5rem
          img 
            width 4rem
            height 100%
        .msg-left:before
          content ''
          position absolute 
          width 0.01rem
          height 100%
          right -0.4rem
          background rgba(230,230,230,0.4)
        .msg-right
          padding-left 0.38rem
          width 100%
          height 1.5rem
          float left
          font-size 14px
          font-family PingFangSC-Regular
          font-weight 400
          color rgba(74,74,74,1)
          line-height 0.22rem
          div
            float left
            &:nth-child(2)
              margin-top 0.57rem
              margin-left 1.08rem
            p
              &:nth-of-type(1)
                height 0.22rem;
                font-size 14px;
                font-family PingFangSC-Regular;
                font-weight 400;
                color rgba(74,74,74,1);
                line-height 0.22rem;
                margin-bottom 0.35rem
              &:nth-of-type(2)
                margin-bottom 0.3rem
                display: flex;
                flex-direction: row;
                align-items: flex-start;
                span
                  &:nth-of-type(1)
                    height 0.2rem
                    font-size 14px
                    font-family PingFangSC-Regular
                    font-weight 400
                    margin-right 0.2rem
                    color rgba(155,155,155,1)
                    line-height 0.2rem
              &:nth-of-type(3)
                span 
                  &:nth-of-type(1)
                    margin-right 0.34rem
                    font-size 14px
                    font-family PingFangSC-Regular
                    font-weight 400
                    color rgba(155,155,155,1)
                    line-height 0.2rem
    .content-img
      box-sizing border-box
      margin-top 0.2rem
      .img-header
        margin-bottom 20px
        padding 0.2rem 0.2rem 0 0.2rem
        background-color #ffffff
        .el-button--success
          border-color aliceblue
        .top
            flexBetween()
            margin-bottom 0.2rem
            .course-header
              width 3.8rem
              flexBetween()
              .el-input
                width 3rem
                margin-right 0.1rem
        .bottom
          ul
            overflow hidden
            li
              position relative
              --webkit-box-sizing  border-box
              columnFlex()
              justify-content space-between
              width 2.6rem
              height 2.82rem
              margin 0 0 0.2rem 0.2rem 
              float left
              background rgba(249,250,249,1)
              border-radius 5px
              box-sizing border-box
              &:first-child
                margin-left 0px!important
              .hook
                position absolute 
                right 0.1rem
                top 0.1rem
                font-size 20px
                border-radius 50%
                color #fff
                background $color-theme
                font-size 14px
                width .2rem
                height .2rem
                border-radius 50%
                text-align center
                line-height .2rem
              div.box
                display flex
                align-items center
              >div
                &:first-child
                  width 2.56rem
                  height 2.78rem
                  flex-1()
                  display flex
                  flex-direction column
                  align-items center
                  justify-content flex-end
              p
                text-align center
                width 100%
                height 0.2rem
                font-size 16px
                font-weight 600
                color rgba(74,74,74,1)
                line-height 0.22rem
                margin-top .1rem
              img 
                width 1.5rem
                height 1.5rem
                border-radius 50% 
              .lect-name
                width 100%
                height 0.82rem
                position relative
                flexBetween()
                div
                  width 50%
                  columnFlex()
                  span
                    &:nth-of-type(1) 
                      height 0.28rem
                      font-size 20px
                      font-family PingFangSC-Regular
                      font-weight 400
                      color rgba(102,102,102,1)
                      line-height 0.28rem
                    &:nth-of-type(2)
                      height 0.17rem
                      font-size 12px
                      font-family PingFangSC-Regular
                      font-weight 400
                      color rgba(102,102,102,1)
                      line-height 0.17rem
                &::before
                  position absolute 
                  top 50%
                  margin-top -0.2rem
                  left 50%
                  margin-left -1px
                  width 0.02rem
                  height 0.4rem
                  content ''
                  background rgba(230,230,230,0.3)
              .mask
                  columnFlex()
                  opacity 0
                  position absolute
                  top 0
                  left 0
                  height 100%
                  width 100%
                  background:rgba(0,0,0,0.5);
                  border-radius:5px;
                  span 
                    cursor pointer
                    height 0.2rem
                    font-size 14px
                    font-family PingFangSC-Regular
                    font-weight 400
                    color rgba(255,255,255,1)
                    line-height 0.2rem
                    text-shadow 0px 0px 4px rgba(0,0,0,0.5)
                  >>>.el-button
                    width 1.2rem
                    margin 1.06rem 0 0.1rem 0
                    height 40px
                    border none
                    background rgba(108,221,199,1)
                    border-radius 4px
                    font-size 12px
                    font-family PingFangSC-Regular
                    font-weight 400
                    color rgba(74,74,74,1)
            li:hover .mask
                opacity 1
            li.active
              box-sizing border-box
              border 2px solid $color-theme
      .pagination
        display flex
        justify-content flex-end
        align-items center
        padding-right .2rem
        margin-bottom .27rem


</style>
