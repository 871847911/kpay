<template>
  <section class="mycolumnupload">
    <div v-if="isActive == 4">
      <div class="layout-head">
        <span>专栏介绍</span>
        <div class="editor-btn">
          <span class="come-back" style="margin-right:20px" @click="back"><i class="iconfont icon-fanhui"></i>返回</span>
          <el-button class="major-btn" @click="editor('info')">编辑</el-button>
          <el-button class="less-btn" @click="shelves">{{pageData.onStatus==0?"上架":"下架"}}</el-button>
        </div> 
      </div>

      <div class="content_box">
          <div class="content_header">
            <el-tabs v-model="activeName">
              <el-tab-pane label="专栏信息" name="first">
                  <div class="column_box">
                      <div class="header">
                        基本信息
                      </div>
                      <div class="img_box">
                        <img :src="imageHead + pageData.columnUrl" alt="图片">
                        <div class="right_box">
                          <div class="title">
                            <span class="ellipsis">{{pageData.columnName}}</span>
                            <span>{{pageData.onStatus==0?"未上架":"已上架"}}</span>
                          </div>
                          <div class="new_box">
                            <p class="new" v-if="pageData.updateType === 1">每日更新</p>
                            <p class="new" v-else-if="pageData.updateType === 2">每{{pageData.frequency}}更新</p>
                            <p class="new" v-else>每月{{pageData.frequency}}更新</p>
                            <span class="autor">作者 | <span>{{pageData.userName}}</span></span>
                            <span class="price">价格 | <span>{{pageData.price}}元</span></span>
                            <span class="price">订阅人数 | <span>{{pageData.buyNumber}}人</span></span>
                          </div>
                          <div class="line"></div>
                          <div class = "see">
                            <button style="cursor:pointer;" @click="goView(pageData.auditStatus)">查看</button>
                            <div class="pl20">
                              <div class="update-time">
                                <span>更新进度</span>
                                <span>上次更新时间:{{pageData.modifyDate }}</span>
                              </div>
                              <div class="progress">
                                <div class = "percent">
                                  <el-progress :show-text="false" :text-inside="true" :percentage="pageData.percent"></el-progress>
                                  <span>{{pageData.articleUpdateNumber}}/{{pageData.articleNumber}}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    
                      <div class="text-introduction">
                        <h3>专栏简介</h3>
                        <div  v-html="pageData.introduction" class="introduction-content">
                          {{pageData.introduction}}
                        </div>
                      </div>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="发刊词" name="second">
                <div class="fkc_box_two">
                  <div class="audio_info">
                    <h3>音频</h3>
                    <div class="audio_style">
                      <audioVue :name="introducttionData.fileName" :url="imageHead + introducttionData.columnUrl" :size="introducttionData.fileSize"></audioVue>  
                    </div>
                  </div>
                  <div class="col_intro">
                    <h3>专栏简介</h3>
                    <div class="introduction-content" v-html="introducttionData.context">
                      {{introducttionData.context}}
                    </div>
                  </div>
                </div>
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
import audioVue from "components/common/MusicPlayer" 
import {mapGetters} from 'vuex'
import NoActive from 'components/common/NoActive'

export default {
  name: "MycolumnListStoreView",
  data() {
    return {
      activeName: 'first',
      pageData:{},
      introducttionData:{}
    };
  },
  
  computed:{
    ...mapGetters([
      'uploadImageHead',
      'imageHead',
      'isActive'
    ]),
  },

  components:{
    audioVue,
    NoActive
  },

  created(){
    this.init()
  },

  methods: {
    init(){
      api.getStoreColumnInfo({id:this.$route.query.id}).then(res=>{
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
          this.pageData = res.data
        }
      })

      api.getIntroductionInfo({
        columnId:this.$route.query.id
      }).then(res=>{
          if(res.success){
            this.introducttionData = res.data
          }
      })
    },

    editor(tab){
      this.$router.push({
        name:"MycolumnListStoreAdd",
        query:{
          editorId:this.$route.query.id,
          status:this.pageData.onStatus,
          tab
        }
      })
    },

    // 下架
    shelves(){ 
      const statusValue = this.pageData.onStatus === 0 ? 1 : 0

      api.updateColumnStatus({
        id: this.$route.query.id,
        status:statusValue
      }).then(res=>{
        if(res.success){
          if(this.pageData.onStatus === 0){
            this.$message.success("专栏上架成功")
          }else{
            this.$message.success("专栏下架成功")
          }
          this.init()
        }
      })
    },

    // 查看按钮触发事件
    goView(type){ 
      this.goContent()
    },

    // 路由跳转
    goContent(){ 
      this.$router.push({
        name:'MycolumnListStoreContent',
        query:{
          columnId:this.$route.query.id
        }
      })
    },

    back () {
      this.$router.back()
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
@import "~assets/styles/columnintroduce"
.see
  margin-top 0.32rem!important
.editor-btn
  text-align right
  flex()
  justify-content flex-end
  .el-button 
    padding 0!important
.text-introduction
  h3
    box-sizing border-box
    background-color #F9FAF9!important
.introduction-content
  padding-left 0.2rem
.img_box
  box-sizing border-box
  padding-left 0.2rem
</style>
<style lang="css">
.mycolumnupload .el-progress-bar__outer{
    width:100% !important;
}
.mycolumnupload .percent .el-progress__text{
  float:right;
  margin-top: 11px;
}
.mycolumnupload .percent .el-progress-bar{
  position: relative;
  width: 4.59rem;
  padding-right: 0;
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
