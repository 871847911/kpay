<template>
  <div>
    <div class="top">
      <div class="course-header">
        <el-input v-model="courseName" placeholder="课程名称/作者"></el-input>
        <el-button  @click="searchResult()">搜索</el-button>
      </div>
      <!-- <div class="screening" style="display:none;">
        <span :class="activeState==1?'active':''" @click="screening(1)">全部</span>
        <i class="iconfont icon-zitikuicon-" style="color:#C0C4CC;font-size:12px;"></i>
        <span :class="activeState==2?'active':''" @click="screening(2)">拼团课程</span>
        <i class="iconfont icon-zitikuicon-" style="color:#C0C4CC;font-size:12px;"></i>
        <span :class="activeState==3?'active':''" @click="screening(3)">赠送课程</span>
      </div> -->
    </div>
    <div class="img-bottom">
      <ul>
        <li v-for="item in templateList" :class="curNavId==item.id?'active':''"  :key="item.id">
          <div class="li-box">
            <i class="iconfont icon-gou- hook" v-if="curNavId==item.id"></i>
            <img :src="imageHead+item.courseUrlFirst" alt="" class="img">
            <div class="text">
              <p>{{item.courseName}}</p>
              <div>
                <img :src="imageHead+item.userInfo.photoUrl" alt="">
                <span>{{item.createUser}}</span>
                <span>{{item.createDate}}</span>
              </div>
            </div>
          </div>
          <div class="mask">
            <el-button class="btn" @click="choose(item,chooseState)">{{chooseState}}</el-button>
            <span @click="seeView(item.id)">查看详情</span>
          </div>
        </li>
      </ul>
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
</template>

<script>
import api from 'fetch/api'
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: "CarouselLecturerComponent",
  props:{
    source:Object
  },
  data (){
    return {
      templateList:[],
      chooseState:'选择',
      courseName:'',
      activeName:'first',
      activeState:1,
      curNavId:'',
      sourceDate:{},
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0, // 列表数据总条数
    }
  },
  computed:{
    ...mapGetters([
      'imageHead'
    ])
  },
  
  created (){
    this.initTemplates()
  },
  mounted (){
   this.sourceDate = {...this.source}
  },
  methods:{
    initTemplates(){
      let conf = {
        searchName:this.courseName,
        page:this.currentPage,
        pageSize:this.pageSize
      }
      api.courseList(conf).then(res =>{
        if(res.data){
          this.templateList = res.data.list
          this.total = res.data.total
        }else{
          this.$message({
            message: res.message,
            type: "error"
          })
        }
      })
    },

    // 搜索课程
    searchResult(){
      this.initTemplates()
    },

    // 选择课程
    choose(item,chooseState){ 
      this.curNavId = item.id
      this.sourceDate.pageName = item.courseName
      this.sourceDate.linkValue = item.id
      this.sourceDate.linkType = 1
      this.$emit("ChangeSourceDate",this.sourceDate)
    },

    //分类筛选
    screening (idex){ 
      this.activeState = idex
    },

    handleClick (tab,event){
      
    },

    // 查看详情
    seeView(valueid){
      this.$router.push({
        name:'CarouselHomeContentDetail',
        query:{
          id:valueid
        }
      })
    },

    // 接收专栏选中数据
    listener(data){ 
      this.sourceDate.pageName = data.pageName
      this.sourceDate.linkValue = data.linkValue
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
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
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
      color #ffffff
      border none
.img-bottom
  ul
    overflow hidden
    li
      box-sizing border-box
      overflow hidden
      border-radius 5px
      background rgba(249,250,249,1)
      position relative
      float left
      margin 0 0.42rem 0.42rem 0
      width 2.6rem
      height 2.82rem
      display flex
      align-items center
      justify-content center
      &:last-&:nth-child(2)
        margin-right 0rem
      div.li-box
        margin 0 auto
        width 2.56rem
        height 2.78rem
      .hook
        position absolute 
        right 10px
        top 10px
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
      .img
        display block
        vertical-align middle
        width 100%
        height 1.63rem
      .text
        box-sizing border-box
        width 100%
        height 1.2rem
        padding 0 20px
        p
          margin-top 11px
          height 44px
          font-size 16px
          font-weight 600
          color rgba(74,74,74,1)
          line-height 22px
        div
          flexBetween()
          margin-top 0.2rem
          img 
            width 20px
            height 20px
            border-radius 50%
          span 
            &:nth-of-type(1)
              position relative
              left -15px
              height 20px
              font-size 14px
              font-weight 400
              color rgba(102,102,102,1)
              line-height 20px
            &:nth-of-type(2)
              height 17px
              font-size 12px
              font-weight 400
              color rgba(155,155,155,1)
              line-height 17px
      .mask
        columnFlex()
        opacity 0
        position absolute
        top 0
        left 0
        height 100%
        width 100%
        background rgba(0,0,0,0.5)
        border-radius 5px
        display flex
        flex-direction column
        align-items center
        justify-content center
        span 
          cursor pointer
          height 20px
          font-size 14px
          font-weight 400
          color rgba(255,255,255,1)
          line-height 20px
          text-shadow 0px 0px 4px rgba(0,0,0,0.5)
        .btn
          width 1.2rem
          margin-bottom 10px
          height 40px
          border none
          background rgba(108,221,199,1)
          border-radius 4px
          font-size 12px
          font-weight 400
          color rgba(74,74,74,1)
    li.active
      // box-sizing border-box
      border 2px solid rgba(108,221,199,1)
    li:hover .mask
      opacity 1   
      filter blur(0px)
    li:hover div
      // filter blur(1px)
.pagination
  display flex
  justify-content flex-end
  align-items center
  padding 0 .2rem .1rem 0
  margin-bottom .27rem
</style>
