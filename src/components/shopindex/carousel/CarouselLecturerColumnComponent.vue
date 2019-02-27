<template>
  <div>
    <div class="top">
      <div class="course-header">
        <el-input v-model="searchName" placeholder="专栏名称/作者"></el-input>
        <el-button @click="handleSearch">搜索</el-button>
      </div>
    </div>
    <div>
      <el-alert
        :title="alertName"
        type="warning"
        v-if="isShow"
        show-icon>
      </el-alert>
    </div>
    <div style="overflow:hidden;">
      <div class="column-box" v-for="item in templateList"  :key="item.id">
        <div class="same_box_item" :class="curNavId==item.id?'active':''">
          <i class="iconfont icon-gou- hook" v-if="curNavId==item.id"></i>
          <div class="box">
            <div class="info">
              <img :src="imageHead + item.columnUrl" alt="" style="width:2.4rem;height:1.5rem;">
              <div class="data">
                <p class="info_title">{{item.columnName}}</p>
                <p class="time_line" style=""><span class="update_time_title">更新时间</span><span class="update_time">{{item.modifyDate}}</span></p>
                <p class="autor"><span class="value">作者</span><span class="key">{{item.userName}}</span></p>
                <p class="price"><span class="value">价格</span><span class="key">{{item.price}}元</span></p>
                <p class="order_num"><span  class="value">订阅量</span><span class="key">{{item.buyNumber}}人</span></p>
              </div>
            </div>
            <div class="progress">
              <h2>更新进度</h2>
              <div class="progboxss">
                <el-progress :text-inside="true" :show-text="false" :percentage="item.percent" color="#6CDDC7" class="progbox"></el-progress>
                <span>{{item.articleUpdateNumber}}/{{item.articleNumber}}</span>
              </div>   
            </div>
          </div>
          <div class="mask">
            <el-button class="btn" @click="chooseColumn(item)">选择</el-button>
            <span @click="seeView(item.id)">查看详情</span>
          </div>
        </div>
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
</template>

<script>
import api from 'fetch/api'
import {mapGetters} from 'vuex'
export default {
  name: 'CarouselLecturerColumnComponent',
  data(){
    return {
      searchName:'',
      templateList:[],
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0, // 列表数据总条数
      curNavId:'',
      linkValue:'',
      alertName:'',
      isShow:false,
      sourceDate:{}
    }
  },

  props:{
    source:Object
  },

  computed:{
    ...mapGetters([
      'imageHead'
    ])
  },
  created(){
    this.init()
  },

  mounted(){
    this.sourceDate = {...this.source}
  },

  methods:{
    init(){
      let conf = {
        searchName:this.searchName,
        page:this.currentPage,
        pageSize:this.pageSize
      }
      api.carouselColumn(conf).then(res =>{
        if(res.data){
          res.data.list.forEach(item => {
            if(item.articleNumber !== 0){
              item.percent = item.articleUpdateNumber / item.articleNumber * 100

              if(item.percent > 100){
                item.percent = 100
              }
            }else{
              item.percent = 0
            }

            if(item.modifyDate){
              item.modifyDate = item.modifyDate.substr(0, 10)
            }

            if(item.columnName.length > 12){
              item.columnName = item.columnName.substr(0, 12) + '...'
            }
          });
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

    // 搜索
    handleSearch(){
      this.init()
    },

    // 选择专栏
    chooseColumn(item){ 
      this.curNavId = item.id
      this.sourceDate.pageName = item.columnName
      this.alertName = '已选中' + item.columnName
      this.isShow = true
      this.sourceDate.linkValue = item.id
      this.sourceDate.linkType = 4
      this.$emit("ChangeSourceDate",this.sourceDate)
    },

    // 查看详情
    seeView(valueid){
      this.$router.push({
        name:"CarouselHomeColumnDetail",
        query:{
          id:valueid
        }
      })
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
        border none
        font-weight 400
        color #ffffff
  .column-box
    float left
    width calc(50% - 0.2rem)
    height 2.86rem
    margin-bottom 0.2rem
    &:nth-of-type(2n) 
      margin-left 0.2rem
    .same_box_item 
      width 100%
      position relative
      height 2.6rem;
      padding-top 0.22rem
      background:rgba(249,250,249,1)
      border-radius 5px
      border 1px solid rgba(249,250,249,1)
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
      .box 
        font-size: 0.14rem
        padding: 0 0.18rem 0 0.2rem
        .top 
          height: 0.4rem
          position: relative
          .check 
            display: inline-block
            position: absolute
            right: 0
            height: 0.16rem
          .three_point 
            float: right
            margin-top:0.04rem
            width: 0.16rem
            height: 0.16rem
            line-height: 0.08rem
            text-align: center
            cursor: pointer
          .state 
            color: #9B9B9B
            height: 0.2rem
            line-height: 0.2rem
            i 
              font-size: 0.05rem
              width: 0.14rem
              height: 0.14rem
              color: #6CDDC7
        .info 
          width: 100%
          display: flex
          justify-content: space-between
          img 
            width: 2.4rem
            height: 1.5rem
          .data 
            width: calc(100% - 2.6rem)
            .info_title 
              font-weight: bold
              height: 0.22rem
              line-height: 0.22rem
              font-size: 0.16rem
              color: #4A4A4A
              margin-bottom: 0.12rem
            .time_line 
              height: 0.28rem
              border-bottom: 1px solid #E6E6E6
              font-size: 0.12rem
              box-sizing: border-box
              span 
                height: 0.17rem
                line-height: 0.17rem
              .update_time_title 
                text-align: center
                color: #FFFFFF
                background: #6CDDC7
                padding: 0.005rem 0.04rem
                border-radius: 0.02rem
              .update_time 
                color: #9B9B9B
                margin-left: 0.08rem
            .autor
              margin-top 0.1rem
              span 
                height: 0.2rem
                line-height: 0.2rem
              .value 
                width: 0.57rem
                color: #9B9B9B
              .key 
                color: #666666
            .price 
              margin-top: 0.1rem
            .order_num 
              margin-top: 0.1rem
            .price, .order_num 
              span 
                height: 0.2rem
                line-height: 0.2rem
              .value 
                width: 0.57rem
                color: #9B9B9B
              .key 
                color: #666666
        .progress 
          width: 100%
          h2 
            margin-top: 0.2rem
            height: 0.2rem
            line-height: 0.2rem
            color: #9B9B9B
          .progboxss 
            margin-top: 0.07rem
            height: 0.2rem
            display: flex
            justify-content: space-between
            width: 100%
            line-height: 0.2rem
            >>>.el-progress
              flex()
              >>>.el-progress-bar__outer 
                height: 0.06rem !important
            span 
              height: 0.2rem
              line-height: 0.2rem
              color: #9B9B9B
              font-size: 0.14rem
            .progbox 
              flex()
              margin 0
              width 90%
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
          height 20px
          font-size 14px
          font-weight 400
          color rgba(255,255,255,1)
          line-height 20px
          text-shadow 0px 0px 4px rgba(0,0,0,0.5)
        .btn
          width 1.2rem
          margin 1.2rem 0 0.1rem 0
          height 40px
          border none
          background rgba(108,221,199,1)
          border-radius 4px
          font-size 12px
          font-weight 400
          color rgba(74,74,74,1)
        >>>.el-button
          width 1.2rem
          margin 1.2rem 0 0.1rem 0
          height 40px
          border none
          background rgba(108,221,199,1)
          border-radius 4px
          font-size 12px
          font-weight 400
          color rgba(74,74,74,1)
    .same_box_item:hover  .mask
      opacity 1
      .pagination
        display flex
        justify-content flex-end
        align-items center
        padding-right .2rem
        margin-bottom .27rem
    .same_box_item.active
      border 2px solid rgba(108,221,199,1)
  .pagination
    display flex
    justify-content flex-end
    align-items center
    padding 0 .2rem .1rem 0
    margin-bottom .27rem
</style>
