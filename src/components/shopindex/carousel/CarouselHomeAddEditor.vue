<template>
  <div class="carousel">
    <div class="carousel-head layout-head">
        <span>添加/编辑轮播图</span>
        <div class="head-right">
          <span class="come-back" @click="goBack"><i class="iconfont icon-fanhui"></i>返回</span>
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
              <span>内容</span>
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
        <el-tabs v-model="activeName" @tab-click="handleClick">
          <el-tab-pane label="课程" name="first">
            <CarouselLecturerComponent @ChangeSourceDate="changeDate" :source="source"></CarouselLecturerComponent>
          </el-tab-pane>
          <el-tab-pane label="专栏" name="second">
            <CarouselLecturerColumnComponent @ChangeSourceDate="changeDate" :source="source"></CarouselLecturerColumnComponent>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'fetch/api'
import {mapGetters, mapMutations} from 'vuex'
import Cookies from 'js-cookie'
import CarouselLecturerColumnComponent from './CarouselLecturerColumnComponent'
import CarouselLecturerComponent from './CarouselLecturerComponent'

export default {
  name: "CarouselHomeAddEditor",
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
      source:'',
      sourceDate:{}
    }
  },
  computed:{
    ...mapGetters([
      'imageHead'
    ])
  },
  components:{
    CarouselLecturerColumnComponent,
    CarouselLecturerComponent
  },
  created (){
    this.source = JSON.parse(Cookies.get('carouselDate'))

    if(this.source.linkType == 1){
      this.activeName = 'first'
    }else if(this.source.linkType == 4){
      this.activeName = 'second'
    }
  },
  mounted (){
   this.sourceDate = {...this.source}
  },
  methods:{
    // 接收选中课程时的数据
    changeDate(data){
      this.sourceDate = data
    },

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
   
    // 接收专栏选中数据
    listener(data){ 
      this.sourceDate.pageName = data.pageName
      this.sourceDate.linkValue = data.linkValue
    },

    goBack(){
      Cookies.set('carouselDate', this.sourceDate, {expires: 1})
      this.$router.back()
    },

    handleClick(tab,event){
      this.sourceDate.linkType = tab.name === "first" ? 1 : 4
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
          width0.82rem
          height0.40rem
          border-radius 4px
          margin-left 10px !important
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
          float left
          text-align left
          width 4.4rem
          margin-right 40px
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
      padding 0 20px
      background-color #ffffff
      box-sizing border-box
      margin-top 0.2rem
      .img-header
        margin-bottom 20px
        .el-button--success
          border-color aliceblue
        .screening
          height 14px
          font-size 14px
          font-weight 400
          color rgba(48,49,51,1)
          line-height 14px
          span 
            cursor pointer
        .el-tab-pane
          .el-tabs__item.is-top
            width 0.6rem !important 
    


</style>
