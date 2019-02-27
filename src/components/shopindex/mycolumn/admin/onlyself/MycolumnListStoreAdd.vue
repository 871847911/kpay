<template>
  <div style="width:100%;">
    <div class="inner_box" v-if="isActive == 4">
        <!-- 共有头部 -->
        <h-title></h-title>

        <div class="content">
            <!-- 上架下架通用按钮 -->
            <div class="btn_same" v-if="stateEdit == true">
              <button @click="gotoEdit" class="btn-active">编辑</button>
              <button @click="change" v-if="state">下架</button>
              <button @click="change" v-else>上架</button>
            </div>
            <!-- tabs栏目 -->
            <el-tabs v-model="activeName">
              <el-tab-pane label="专栏信息" name="first">
                  <!-- 二种情况展示页面 第一种添加 第二种保存和编辑 -->
                  <div class="colInfo" v-if="addinto">
                    <el-form ref="formData" :model="formData" :rules="rules" label-width="80px">
                        <!-- 基本信息 -->
                        <div class="baseInfo">
                          <h4 class="title">基本信息</h4>
                          <div class="colname message">
                            <el-form-item prop="columnName">
                              <div class="messageChild">
                                <p class="p_same">专栏名称</p>
                                <el-input
                                  placeholder="请输入专栏名称"
                                  :disabled="editorStatus"
                                  v-model="formData.columnName">
                                </el-input>
                              </div>
                            </el-form-item>
                            <el-form-item prop="userName">
                              <div class="messageChild">
                                <p class="p_same">专栏作者</p>
                                <el-input
                                  placeholder="请输入专栏作者"
                                  :disabled="aiticleState"
                                  v-model="formData.userName">
                                </el-input>
                              </div>
                            </el-form-item>
                          </div>
                          <div class="price_page">
                            <el-form-item prop="price">
                              <div class="left">
                                <p class="p_same">专栏价格</p>
                                  <el-input type="text" placeholder="请输入价格" v-model="formData.price" :disabled="aiticleState" auto-complete="off"></el-input>
                                <span class="tag">元</span>
                              </div>
                            </el-form-item>
                            <el-form-item prop="articleNumber">
                              <div class="right">
                                <p class="p_same">专栏篇数</p>
                                <el-input
                                    placeholder="请输入数量"
                                    :disabled="aiticleState"
                                    v-model="formData.articleNumber">
                                </el-input>
                                <span class="tag">篇</span>
                              </div>
                            </el-form-item>
                          </div>

                          <el-form-item prop="columnUrl">
                            <UploadImage @onImageData="handleImageData" :disabled="editorStatus" :getkeys="displayContentUrl" title="专栏封面"></UploadImage>
                          </el-form-item>

                          <div class="updateNum">
                              <p class="p_same">专栏篇数</p>
                              <div class="radios">
                              <el-radio-group v-model="formData.updateType" :disabled="aiticleState" @change="timeUpdate">
                                  <el-radio label="1">每日更新</el-radio>
                                  <el-radio label="2">每周更新</el-radio>
                                  <el-radio label="3">每月更新</el-radio>
                              </el-radio-group>
                              </div>
                              <div class="checkbox">
                                <el-form-item prop="monthUpdate" v-if="formData.updateType==3">
                                  <span>每月</span>
                                  <el-input v-if="aiticleState" :value="formData.monthUpdate" :disabled="aiticleState"></el-input>
                                  <ColumnMonth v-else @handleDay="handleDay"/>
                                  <span>日</span>
                                </el-form-item>
                                <el-form-item prop="frequency" style="margin-bottom:0px;" v-if="formData.updateType==2">
                                  <el-checkbox-group  size="medium" v-model="formData.frequency" style="display:flex;" :disabled="aiticleState" @change="dateSort">
                                      <el-checkbox-button v-for="city in cities"  :label="city" :key="city">{{city}}</el-checkbox-button>
                                  </el-checkbox-group>
                                </el-form-item>
                              </div>
                          </div>
                        </div>

                        <!-- 介绍信息 -->
                        <div class="Introinfo">
                          <h4 class="title" style="font-weight:600;">介绍信息</h4>
                          <div class="colname quill-editor mb-20">
                            <p class="p_same">专栏简介</p>
                            <div class='editor'>
                              <el-form-item>
                                <quill-editor-two @change="editorValueTwo" :editorValue="editorHtmlTwo"></quill-editor-two>
                              </el-form-item>
                            </div>
                          </div>

                          <div>
                            <p class="p_same">订阅须知</p>
                            <div class='editor'>
                                <el-form-item>
                                  <quill-editor @change="editorValueOne" :editorValue="editorHtml"></quill-editor>
                                </el-form-item>
                            </div>
                          </div>
                        </div>

                        <div class="btn">
                          <el-button type="success" @click="saveColumn('formData')">下一步</el-button>
                        </div>
                    </el-form>
                  </div>
              </el-tab-pane>
              <el-tab-pane label="发刊词" name="second">
                  <!-- 首次进入 -->
                  <div class="fkc_box_one" v-if="fkc_state">
                    <UploadMusic @onAudioData="onAudioData" :name="audioName"></UploadMusic>

                      <div class="contentarea">
                        <div class="colname quill-editor mb-20">
                          <p class="p_same"><span class="tscl">*</span> 图文内容</p>
                          <div class='editor'>
                              <quill-editor-three @change="editorIntroduction" :editorValue="editorHtmlThree"></quill-editor-three>
                          </div>
                        </div>

                        <div class="btn">
                          <el-button type="success" @click="save">保存</el-button>
                          <el-button type="success" @click="toList" plain>取消</el-button>
                        </div>
                      </div>
                  </div>
              </el-tab-pane>
            </el-tabs>
        </div>
    </div>
    <no-active v-if="isActive == 3" @reFresh="initTemplate"></no-active>
  </div>
</template>

<script>
import HTitle from "components/common/htitle.vue"
import NoActive from 'components/common/NoActive'
import { conver, initQiniu } from "assets/js/api"
import UploadMusic from "components/common/UploadMusic"
import QuillEditor from "components/common/Quilleditor"
import QuillEditorTwo from "components/common/QuilleditorTwo"
import QuillEditorThree from "components/common/QuillEditorThree"
import UploadImage from "components/common/UploadImage"
import ColumnMonth from "../../ColumnMonth";
import { mapGetters } from "vuex"
import api from "fetch/api"
const cityOptions = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];

export default {
  name: "MycolumnListStoreAdd",
  data() {
    var validatePercent = (rule, value, callback) => {
      if (value === '') {
        if(rule.field === 'price'){
          callback('价格不能为空')
        }else if(rule.field === 'articleNumber'){
          callback('篇数不能为空')
        }
      } else {
        if(!Number.isInteger(value) && isNaN(value)){
          callback(new Error('请输入整数值'))
        }else{
          if(value <= 0){
              callback(new Error('请输入大于0的数字值'))
          }else{
              callback()
          }
        }
      }
    }
    const spacialWord = (rule, value, callback) => {
      // const pattern = new RegExp("[`~!@#$^&*()=|{}':;',\\[\\].<>/?~！@#￥……&*（）——|{}【】‘；：”“'。，、？]");
      // if(value === ''){
      //   callback('请输入专栏名称')
      // }else if(pattern.test(value)){
      //   callback('专栏名称不能为特殊字符')
      // }else{
      //   callback()
      // }
      if(value === ""){
        callback("请输入专栏名称");
      }else{
        callback()
      }
    }
    return {
      rules:{
        userName: [
          {required: true, message: '请输入专栏作者', trigger: 'blur'}
        ],
        columnName: [
          { validator: spacialWord, trigger: 'blur' }
        ],
        columnUrl: [
          { required: true, message: '请上传封面', trigger: 'blur'}
        ],
        price: [
          { validator: validatePercent, trigger: 'blur' }
        ],
        articleNumber: [
          { validator: validatePercent, trigger: 'blur'}
        ],
        frequency: [
          {required: true, message: '请选择日期', trigger: 'blur'}
        ]
      },
      audioName:'',
      subTips:'',
      msg: "MycolumnAdd",
      activeName: "first",
      introductionUrl:"",// 发刊词url
      radio: "1",
      aiticleState: false,
      cities: cityOptions,
      checkboxGroup2: ["周一"],
      addinto: true, //默认是添加专柜 否则就是保存 或者 编辑进入
      fkc_state: true, //发刊词进入 首次填写 否则就是有信息保存或者编辑
      state: true, //上架和下架的状态
      displayContentUrl: [],
      editorHtml: "", // 富文本的值
      editorHtmlTwo: "", // 课程简介
      editorHtmlThree: "",
      tips: "",
      stateEdit: false, //看情况全局或者局部管理 编辑和上架的按钮显示隐藏
      audioProgress: 0, // 音频上传进度
      fileSize: 50,
      fileType: ".mp3",
      formData:{ // 专栏编辑添加
        columnName:'',
        columnUrl:'',
        price:'',
        articleNumber:'',
        updateType:'1',
        frequency:[],
        introduction:'',
        notice:'',
        userName:'',
        monthUpdate:'',
        columnType:''
      },
      columnId:'',// 专栏id
      introductionId:'',// 发刊词id
      editorStatus:'',
      dateUpdate:''
    }
  },

  computed: {
    ...mapGetters(["token", "uploadImageHead", "imageHead", "roleId",'isActive'])
  },

  created(){
    if(JSON.stringify(this.$route.query)!=='{}'){
      this.initTemplate()
      this.aiticleState = true
    }

    const {status, tab} = this.$route.query

    this.editorStatus = status === 1 ? true : false

    if(tab === 'word'){
      this.activeName = 'second'
    }
    this.formData.columnType= this.roleId===1?2:1// 判断是否是自营

  },
  components: {
    HTitle,
    QuillEditor,
    QuillEditorTwo,
    QuillEditorThree,
    UploadMusic,
    UploadImage,
    ColumnMonth,
    NoActive
  },
  methods: {
    initTemplate(){
      api.getStoreColumnInfo({id:this.$route.query.editorId}).then(res=>{
        if(res.success){
          if(res.data.onStatus==1){
            this.editorStatus=true
          }

          let {columnName, columnUrl, price, articleNumber, updateType, frequency, introduction, notice,userName,monthUpdate} = res.data
          updateType = updateType.toString()

          if(updateType==3){
            monthUpdate=frequency
          }
          frequency = frequency.split(',')
          this.formData = Object.assign(this.formData, {
            columnName,
            columnUrl,
            price,
            articleNumber,
            updateType,
            frequency,
            introduction,
            notice,
            userName,
            monthUpdate
          })

          this.editorHtmlTwo = this.formData.introduction
          this.editorHtml =  this.formData.notice
          this.displayContentUrl = [res.data.columnUrl]
        }
      })
      api.getIntroductionInfo({columnId:this.$route.query.editorId}).then(res=>{
        if(res.success){
          this.editorHtmlThree = res.data.context
          this.audioName = res.data.fileName
          this.introductionUrl = res.data.columnUrl
          this.introductionId= res.data.id
        }
      })
    },

    editorIntroduction(val){
      this.editorHtmlThree = val
    },

    editorValueOne(val) {
      this.editorHtml = val;
    },

    editorValueTwo(val) {
      this.editorHtmlTwo=val
    },

    saveColumn(formData) { // 添加专栏
      this.$refs[formData].validate((valid) => {
        if (valid) {
          if(this.formData.updateType==3){
            this.formData.frequency = this.formData.monthUpdate
            this.formData.frequency = this.formData.monthUpdate
            if(this.formData.frequency === ""){
              this.$message({
                message: "更新日期不能为空",
                type: 'warning'
              });
              return;
            }
          }

          this.formData.frequency = this.formData.frequency.toString()
          this.formData.columnUrl = this.formData.columnUrl.toString()
          this.formData.introduction =  this.editorHtmlTwo
          this.formData.notice = this.editorHtml

          if(this.$route.query.editorId){
            this.formData.id=this.$route.query.editorId

            api.modifyColumn(this.formData).then(res=>{
              if(res.success){
                this.tip("专栏信息编辑成功", "success");
                this.activeName="second"
              }else {
                this.tip(res.message, "error");
              }
            })
          }else{
            api.addColumn(this.formData).then(res => {
              if(res.success){
                this.columnId=res.data
                this.tip("专栏信息添加成功", "success");
                this.activeName="second"
              }else {
                this.tip(res.message, "error");
              }
            });
          }
        } else {
          return false;
        }
      });
    },
    save() { // 添加发刊词
      if(JSON.stringify(this.$route.query)==='{}'){
        if(this.columnId === ""){
          this.$message({
            showClose: true,
            message: '请完善专栏信息',
            type: 'warning'
          });
          return;
        }

        if(this.introductionUrl === ''){
          this.tip('请上传音频文件',"warning")
          return;
        }else if(this.editorHtmlThree === ''){
          this.tip('图文内容不能为空',"warning")
          return;
        }else{
          this.saveIntroduct()
        }
      }else{
        if(this.introductionUrl === ''){
          this.tip('请上传音频文件',"warning")
          return;
        }else if(this.editorHtmlThree === ''){
          this.tip('图文内容不能为空',"warning")
          return;
        }else{
        this.editorIntroduct()
        }
      }
    },

    saveIntroduct() { // 保存发刊词
      api.addIntroduction({
        columnId:this.columnId,
        columnUrl:this.introductionUrl,
        context:this.editorHtmlThree,
        fileSize:this.fileSize,
        fileName:this.fileName
      }).then(res => {
        this.tip("发刊词信息添加成功", 'success')
        this.$router.push({
          name:"MycolumnListStoreView",
          query:{
            id:this.columnId
          }
        })
      })
    },

    editorIntroduct(){ // 编辑发刊词
      api.modifyIntroduction({
        columnUrl:this.introductionUrl,
        context:this.editorHtmlThree,
        columnId:this.$route.query.editorId,
        id:this.introductionId,
        fileSize:this.fileSize,
        fileName:this.fileName
      }).then(res => {
        this.tip("发刊词信息编辑成功","success")
        this.$router.push({
          name:"MycolumnListStoreView",
          query:{
            id:this.$route.query.editorId
          }
        })
      })
    },

    // 上传图片回调
    handleImageData(urls){
      this.formData.columnUrl = urls[0]
    },

    toList() { // 取消
      this.$router.push({ name: "MycolumnList" });
    },

    tip(value,typeValue) {// 信息提示框
      this.$message({
        message: value,
        type: typeValue
      });
      this.state = !this.state;
    },

    onAudioData({size,key,name}){ // 接受音频文件
      this.fileSize = size
      this.introductionUrl = key
      this.fileName = name
    },

    // 每月更新时间
    handleDay(str) {
      this.formData.monthUpdate = str;
    },

    timeUpdate(val){
      this.formData.updateType = val
      this.formData.frequency = []
    },

    // 日期排序
    dateSort(val){
      const arr = []

      val.forEach(item => {
        const num = cityOptions.indexOf(item)
        arr[num] = item
      })

      this.formData.frequency = [...arr].filter(item => true)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.tscl
    color $color-theme
    position relative
.p_same
    margin-bottom 0.05rem
    font-size 0.14rem
    color #4A4A4A
    height 0.22rem
    line-height 0.22rem
    width 100%
.title
    color $color-theme
    font-size 0.12rem
    height 0.17rem
    line-height 0.17rem
    margin-bottom 0.32rem
.btn-active
    background $color-theme !important
    color #FFFFFF !important
.content-four
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
    margin-bottom 0.2rem
    h4
        font-size 0.14rem
        height 0.22rem
        line-height 0.22rem
        color #4A4A4A
        margin-bottom 0.02rem
    .tips
        font-size 0.14rem
        height 0.2rem
        line-height 0.2rem
        color #9B9B9B
        margin-bottom 0.1rem
        span
            color $color-theme
    .image
        display flex
        justify-content flex-start
        align-items center
        .image-item
            width 2rem
            height 1.38rem
            border-radius 0.04rem
            margin-right 0.1rem
            position relative
            z-index 99
            img
                display block
                height 100%
                width 100%
                border 0.01rem dashed rgba(0, 0, 0, 0.15)
                box-sizing border-box
                border-radius 0.05rem
            .el-icon-close
                font-size 0.3rem
                position absolute
                top 0
                right 0
                z-index 99
                cursor pointer
                background #ccc
                border-radius 0 0.05rem 0 0
        #pickfiles
            width 1.38rem
            height 1.38rem
            box-sizing border-box
            border 0.01rem dashed rgba(0, 0, 0, 0.15)
            border-radius 0.04rem
            display flex
            flex-direction column
            justify-content center
            align-items center
            cursor pointer
            &hover
                border 0.01rem dashed $color-theme
            .el-icon-plus
                margin 0 0 0.14rem
                font-size 0.24rem
                color rgba(0, 0, 0, 0.45)
            .txt
                font-size 0.14rem
                fontCenter(0.22rem)
                color rgba(0, 0, 0, 0.65)

.audio_style
  audio
    width 80%
    margin-top 0.2rem
.inner_box
    width calc(100%)
    margin 0 auto
    .content
        background #FFFFFF
        padding 0 0.2rem
        position relative
        .btn_same
            position absolute
            right 0.2rem
            top 0.1rem
            z-index 1 !important
            button
                height 0.4rem
                line-height 0.4rem
                border-radius 0.04rem
                border 1px solid $color-theme
                box-sizing border-box
                background #FFFFFF
                font-size 0.12rem
                color $color-theme
                width 0.82rem
                text-align center
                cursor pointer
                &nth-child(2)
                    margin-left 0.05rem
        .colInfo
            width 7.2rem
            margin 0.25rem auto 0
        .baseInfo
            margin-bottom 0.6rem
          >>>.el-form-item__content
            margin-left 0 !important
        .title
            color $color-theme
            font-size 0.12rem
            height 0.17rem
            line-height 0.17rem
            margin-bottom 0.32rem
        .colname
          margin-bottom 0.2rem
          .p_same
              font-size 0.14rem
              color #4A4A4A
              height 0.22rem
              line-height 0.22rem
              margin-bottom 0.05rem
          .el-input
              >>> .el-input__inner
                  padding 0 0.25rem !important
        .message
          flexBetween()
          .messageChild
            width 345px
        .colimg
            margin-bottom 0.2rem
            .p_same
                font-size 0.14rem
                color #4A4A4A
                height 0.22rem
                line-height 0.22rem
            .spe
                font-size 0.14rem
                color #9B9B9B
                height 0.2rem
                line-height 0.2rem
                margin-bottom 0.1rem
            .pic
                height 1.5rem
                background #FFFFFF
                border 1px solid pink
        .price_page
            display flex
            justify-content space-between
            margin-bottom 0.2rem
            .el-form-item
              width calc(50% - 0.15rem)
            .left, .right
                // width calc(50% - 0.15rem)
                >>> .el-input
                    display inline-block !important
                    width calc(100% - 0.3rem)
                .p_same
                    font-size 0.14rem
                    color #4A4A4A
                    height 0.22rem
                    line-height 0.22rem
                .tag
                    height 0.22rem
                    line-height 0.22rem
                    font-size 0.14rem
        .updateNum
            display flex
            justify-content flex-start
            flex-wrap wrap
            .radios, .checkbox
                // width calc(50% - 0.15rem)
                width 3.52rem
                // margin-left 0.23rem
            .checkbox
                margin-left 0.15rem
                position relative
                left 0.07rem
              .el-form-item
                margin-bottom 0
                >>>.el-form-item__content
                  line-height 0.24rem
              .el-input
                  width 2.74rem
                >>>.el-input__inner
                  height 0.24rem
                  line-height 0.24rem
                  border-radius 0.12rem
              label
                margin-right 0.05rem
              label:last-child
                margin-right 0 !important
              >>>.checkbox .el-checkbox-group .el-checkbox-button .el-checkbox-button__inner
                margin-right 0!important
    .btn
        margin-top 0.4rem
        margin-bottom 0.2rem
        text-align center
        >>>.el-button--success
            background-color $color-theme
            border 1px solid $color-theme
        >>>.el-button--success.is-plain
            background-color #ffffff
            color rgba(155,155,155,1)
            border 1px solid rgba(155,155,155,1)
.colInfoList, .fkc_box_two
    width 5.32rem
    margin 0.4rem auto 0
    .audio_info, .base_info, .col_intro
        h3
            color #9B9B9B
            background #EEF2F3
            font-size 0.14rem
            height 0.3rem
            line-height 0.3rem
            padding-left 0.08rem
    .base_info
        min-width 5rem
        .info
            margin-top 0.2rem
            font-size 0.14rem
            display flex
            justify-content flex-start
            img
                width 2.4rem
                height 1.5rem
            .box_info
                margin-left 0.2rem
                font-size 0.14rem
                width calc(100% - 2.6rem)
                .info_title
                    height 0.22rem
                    line-height 0.22rem
                    margin-bottom 0.2rem
                    .title
                        color #4A4A4A
                        font-weight bold
                        font-size 0.16rem
                        height 0.22rem
                        line-height 0.22rem
                        margin 0 !important
                    .sjzt
                        font-size 0.12rem
                        color #FFFFFF
                        height 0.18rem
                        line-height 0.18rem
                        background $color-theme
                        margin-left 0.1rem
                        position relative
                        bottom 0.01rem
                        padding 0.005rem 0.045rem
                    .wsj
                        background #E6E6E6
                        color #9B9B9B
                .up_time
                    height 0.2rem
                    line-height 0.2rem
                    color $color-theme
                    margin-bottom 0.05rem
                    font-size 0.14rem
                .price_num
                    height 0.3rem
                    border-bottom 1px solid #E6E6E6
                    span
                        color #9B9B9B
                    .cl
                        color #666666
                    .fh
                        width 0.01rem
                        height 0.1rem
                        background #9B9B9B
                        line-height 0.1rem
                        margin 0 0.05rem
                .btn_check
                    background $color-theme
                    width 1rem
                    color #FFFFFF
                    font-size 0.12rem
                    height 0.32rem
                    line-height 0.32rem
                    border-radius 0.04rem
                    cursor pointer
                .zt
                    color #9B9B9B
                    font-size 0.12rem
                    margin-left 0.15rem
        .progress
            width 100%
            margin-top 0.24rem
            h4
                color #9B9B9B
                font-size 0.12rem
                margin-bottom 0.1rem
            .progboxss
                height 0.2rem
                display flex
                justify-content space-between
                width 100%
                line-height 0.2rem
                span
                    height 0.2rem
                    line-height 0.2rem
                    color #9B9B9B
                    font-size 0.14rem
                .progbox
                    margin 0
                    width 83.5%
                >>> .el-progress-bar__outer
                    height 0.1rem !important
                >>> .el-progress-bar__innerText
                    font-size 0.06rem !important
                    position relative
                    bottom 0.03rem
    .col_intro
        margin-top 0.5rem
        color #4A4A4A
        font-size 0.14rem
        h3
            margin-bottom 0.2rem
        >>>img
            width auto
            max-width 100%
            height auto
            max-height 6rem
            margin 0.14rem 0 0.31rem 0
        p
            line-height 0.2rem
            min-height 1.19rem
.fkc_box_one
    width 7.2rem
    margin 0 auto
    font-size 0.14rem
    .audio_area
        h4
            color #4A4A4A
            margin-top 0.15rem
            margin-bottom 0.3rem
        .upload
            height 0.4rem
            display flex
            justify-content space-between
            align-items center
            .upload-right
                width 1rem
                height 0.4rem
                position relative
                .upload-btn, .upload-finish
                    cursor pointer
                    width 100%
                    border-radius 0.2rem
                    background $color-theme
                    text-align center
                    height 0.4rem
                    line-height 0.4rem
                    font-size 0.14rem
                    color #fff
                .mask
                    cursor pointer
                    width 1.2rem
                    height 0.6rem
                    position absolute
                    left 50%
                    top 50%
                    margin-left -0.6rem
                    margin-top -0.3rem
                    background rgba(0, 0, 0, 0)
                    z-index 99
            .upload-left
                -webkit-box-flex 1
                -webkit-flex 1
                -ms-flex 1
                flex 1
                justify-content flex-start
                .tips
                    height 0.17rem
                    line-height 0.17rem
                    color #999999
                    font-size 0.12rem
                    .el-icon-upload
                        font-size 0.12rem
                        color #979797
                        margin-right 0.1rem
                    .other-tips
                        color #FF6767
                .file-info
                    height 0.4rem
                    display flex
                    justify-content flex-start
                    align-items center
                    .audio-img
                        height 0.4rem
                        border-radius 50%
                        width 0.4rem
                        margin-right 0.1rem
                        .iconfont
                            font-size 0.4rem
                            color $color-theme
    .contentarea
        margin-top 0.4rem
</style>
