<template>
  <section class = "mycolumnupload">
    <div v-if="isActive == 4">
      <div class="layout-head">
        <span>专栏介绍</span>
        <div class="editor-btn"> 
          <span class="come-back" @click="back" style="margin-right:20xp;"><i class="iconfont icon-fanhui"></i>返回</span>
          <el-button class="bgThem" @click="applyOpen" v-show="pageData.auditStatus === 10 || pageData.auditStatus === 40">申请开通</el-button>
          <el-button :class="{bgThem:pageData.auditStatus !== 10}" @click="editor('info')" v-show="activeName === 'first'">编辑</el-button>
          <el-button :class="{bgThem:pageData.auditStatus !== 10}" @click="editor('word')" v-show="activeName === 'second'">编辑</el-button>
          <el-button class="borderThem" @click="shelves" v-show="pageData.auditStatus === 30">
            {{pageData.onStatus === 0 ? "上架" : "下架"}}
          </el-button>
        </div>
      </div>

      <el-alert show-icon :title="isOpen" type="success" v-if="pageData.auditStatus === 30"></el-alert>
      <el-alert show-icon :title="isOpen" type="warning" v-else></el-alert>

      <div class="content_box">
        <el-tabs v-model="activeName">
          <el-tab-pane label="专栏信息" name="first">
              <div class="column_box">
                  <div class="header">基本信息</div>
                  <div>
                    <div class="img_box">
                        <img :src="imageHead + pageData.columnUrl" alt="图片">
                        <div class="right_box">
                            <div class="title">
                              <span>{{pageData.columnName}}</span>
                              <span style="margin-left:10px;">{{pageData.onStatus==0?"未上架":"已上架"}}</span>
                            </div>
                            <div class="new_box">
                              <p class="new" v-if="pageData.updateType === 1">每日更新</p>
                              <p class="new" v-else-if="pageData.updateType === 2">每{{pageData.frequency}}更新</p>
                              <p class="new" v-else>每月{{pageData.frequency}}更新</p>
                              <span class="autor">作者 | <span>{{pageData.userName}}</span></span>
                              <span class="price">价格 | <span>{{pageData.price}}元</span></span>
                            </div>
                            <div class="line"></div>
                            <div class = "see">
                                <button style="cursor:pointer;" @click="goView(pageData.auditStatus)">查看</button>
                                <div class="pl20">
                                  <div class="update-time">
                                    <span>更新进度</span>
                                    <span>上次更新时间：{{pageData.modifyDate}}</span>
                                  </div>
                                  <div class="progress">
                                    <div class="percent">
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
                      <div  v-html="pageData.introduction" class="introduction-content" style="margin-top:0.2rem;min-height:226px;">
                        {{pageData.introduction}}
                      </div>
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
                <h3>图文内容</h3>
                <div class="introductContent" v-html="introducttionData.context" style="min-height:410px;" >
                    {{introducttionData.context}}
                </div>
              </div>
            </div>
          </el-tab-pane>
        </el-tabs>
      </div>
    </div>
    <no-active v-if="isActive == 3" @reFresh="init"></no-active>
  </section>
</template>

<script>
import api from 'fetch/api'
import audioVue from "components/common/MusicPlayer" 
import NoActive from 'components/common/NoActive'
import {mapGetters} from 'vuex'

export default {
  name: "CarouselHomeColumnDetail",
  data() {
    return {
      activeName: 'first',
      pageData:{},
      introducttionData:{},
      isOpen:'',
      isShow:true,
      alert:false
    };
  },

  computed:{
    ...mapGetters([
      'imageHead',
      'uploadImageHead',
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

              if(res.data.percent >100){
                res.data.percent = 100
              }
            }else{
              res.data.percent = 0
            }

            if(res.data.modifyDate ){
              res.data.modifyDate = res.data.modifyDate.substr(0,10)
            }

            this.pageData = res.data
            
            switch(this.pageData.auditStatus) {
              case 10:
                this.isOpen="专栏未审核，需向商户申请开通"
                break;
              case 20:
                this.isOpen="专栏正在审核中"
                break;
              case 30:
                this.isOpen="专栏审核已通过"
                break;
              case 40:
                this.isOpen="专栏审核未通过,原因：" + res.data.reason
              default:
                this.isOpen="专栏审核未通过,原因：" + res.data.reason
                break;
            }
          }
        })
        
        api.getIntroductionInfo({
          columnId:this.$route.query.id
        }).then(res=>{
            if(res.success){
              this.introducttionData = res.data
            }else{
              this.$message({
                message: res.message,
                type: "error"
              })
            }
        })
      },

      editor(tab){
        this.$router.push({
          name:"MycolumnListAdd",
          query:{
            editorId:this.$route.query.id,
            status:this.pageData.onStatus,
            tab
          }
        })
      },

      shelves(){ // 上下架
        const statusValue = this.pageData.onStatus===0 ? 1 : 0
        api.updateColumnStatus({id:this.$route.query.id,status:statusValue}).then(res=>{
          if(res.success){
            if(this.pageData.onStatus === 0){
              this.$message({
                message: '专栏上架成功',
                type: 'success'
              });
            }else{
              this.$message({
                message: '专栏下架成功',
                type: 'success'
              });
            }
         
            this.init()
          }else{
            this.$message({
              message: res.message,
              type: "error"
            })
          }
        })
      },

      applyOpen(){ // 申请开通
        api.updateColumnStatus({id:this.$route.query.id,status:20}).then(res=>{
          if(res.success){
            this.$message({
              message: '申请提交成功',
              type: 'success'
            });
            this.init()
          }else{
            this.$message({
              message: res.message,
              type: "error"
            })
          }
        })
      },

      back () {
        this.$router.back()
      },

      goView(type){ // 查看按钮触发事件
        switch(type){
          case 10:
            this.$message.info("专栏未审核，无法查看专栏内容")
            break;
          case 20:
            this.$message.info("专栏审核中，无法查看专栏内容")
            break;
          case 30:
            this.goContent()
            break;
          case 40:
            this.$message.info("专栏未通过审核，无法查看专栏内容")
            break;
        }
      },

      goContent(){ // 路由跳转
        this.$router.push({
          name:'MycolumnListContent',
          query:{
            columnId:this.$route.query.id
          }
        })
      }
  }
};
</script>

<style lang="stylus" scoped>
  @import "~assets/styles/mixins"
  @import "~assets/styles/varibles"
  @import "~assets/styles/columnintroduce"
</style>
