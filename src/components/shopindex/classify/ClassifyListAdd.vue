<template>
    <div class="classify-add holder-common">
        <div v-if="isActive == 4">
            <div class="topbar">
              <div>
                <h3>添加一级分类</h3>
              </div>
              <div>
                <h3 @click="goback">
                  <i class="iconfont icon-fanhui"></i>
                  返回
                </h3>
              </div>
            </div>

            <div class="contain">
                <div class="box">
                  <el-form :model="classForm" ref="classForm" label-position="top">
                   <div class="item-box">
                      <el-form-item label="分类名称" prop="name">
                        <el-input type="text" v-model="classForm.name" maxlength="12" auto-complete="off"></el-input>
                      </el-form-item>
                   </div>

                    <div class="item-box">
                      <el-form-item label="平台类别" prop="platform">
                          <el-select v-model="classForm.platform" placeholder="请选择">
                          <el-option
                            v-for="item in platformOptions"
                            :key="item.id"
                            :label="item.name"
                            :value="item.id">
                          </el-option>
                        </el-select>
                      </el-form-item>

                      <div class="right-flex">
                        <el-popover
                          popper-class="popper-class"
                          placement="top-start"
                          width="200"
                          trigger="hover"
                          content="此选项为非必填项，但仍建议您选择。平台类别关联店铺一级分类后，通过平台的运营和相关措施为店铺引流和宣传">
                            <i slot="reference" class="iconfont icon-tanhao-"></i>
                        </el-popover>
                        <div class="right-switch">
                          <p>是否显示</p>
                          <el-switch
                            v-model="switchValue"
                            active-color="#6CDDC7"
                            inactive-color="#AEB8BE">
                          </el-switch>
                        </div>
                      </div>
                    </div>

                    <div class="upload-content">
                      <div class="content-four">
                        <h4>分类图标</h4>
                        <div class="image">
                            <div class="image-item" v-for="(item,index) of imageUrl" :key="index" v-if="imageUrl.length > 0">
                                <img :src="item">
                                <i class="el-icon-close" @click="deleteImg(index)"></i>
                            </div>
                            <div id="pickfiles" v-show="imageUrl.length < 1">
                                <i class="el-icon-plus"></i>
                                <p class="txt">分类logo</p>
                            </div>
                        </div>
                      </div>
                      <div class="mind">
                        <p style="color:#666666; margin-bottom:10px;">{{ tips }}</p>
                        <p>建议尺寸：36*36； </p>
                        <p>支持格式：PNG/JPG/JPEG；大小：不超过50KB</p>
                      </div>
                    </div>

                    <div class="item-box">
                      <el-form-item>
                        <el-button @click="submitForm('classForm')">提 交</el-button>
                      </el-form-item>
                    </div>
                  </el-form>
                </div>
            </div>
        </div>
        <no-active v-if="isActive == 3" @reFresh="initFirst"></no-active>
    </div>
</template>

<script>
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
import {mapGetters} from 'vuex'
import {initQiniu} from 'assets/js/api'

export default {
  name: 'ClassifyListAdd',
  data () {
    return {
     classForm:{ //表单
       name: '',
       platform: ''
     },
     platformOptions: [], //选择框
     isEdit: false, //是否是编剧
     params: {}, //路由参数
     switchValue: true,
     imageUrl: [], // 图片数组
     tips: "",
     uploadKey: ""
    }
  },

  computed: {
    ...mapGetters([
      'isActive',
      'token',
      'uploadImageHead',
      'imageHead'
    ])
  },

  components: {
    NoActive
  },

  created () {
    
  },

  mounted () {
    const that = this

    this.initFirst().then(res => {
      initQiniu('pickfiles', 0.5, 'image/jpeg,image/jpg,image/png', (file, info) => {
        let newInfo = JSON.parse(info)
        const _url = that.uploadImageHead + newInfo.key

        if(that.imageUrl.length !== 0){
          that.imageUrl[0] = _url
        }else{
          that.imageUrl.push(_url)
        }
        
        that.uploadKey = newInfo.key
        that.tips = '上传成功。'
      }, file => {
        if (file.isUpload === 1) {
          that.progress = file.percent
        } else if (file.isUpload === 2) {
          that.tips = '文件大小超出范围！'
        } else {
          that.tips = '文件类型不正确！'
        }
      }, that.token)
    }) 
  },

  methods: {
    initFirst(){
      return this.initList().then(res => {
        const params = this.$route.params

        if(JSON.stringify(params) !== "{}"){
          this.isEdit = true
          this.params = params
          this.uploadKey = params.catalogUrl

          const item = res.filter(v => {
            if(v.name === params.platformCatalog){
              return v
            }
          })

          this.classForm.platform = item.length !== 0 ? item[0].id : ""
          this.classForm.name = params.name
          this.switchValue = params.isShow

          if(params.catalogUrl !== ''){
            this.imageUrl.push(this.imageHead + params.catalogUrl)
            this.catalogUrl = params.catalogUrl
          }
        }
      })
    },

    initList(){
      return api.getCatalogList({
        type: 2
      }).then(res => {
        if(res.data){
          return this.platformOptions = res.data
        }
      })
    },

    submitForm(){
      const { name, platform } = this.classForm

      let config = {
        name: name,
        catalogUrl: this.uploadKey,
        parentId: platform,
        showCatalog: this.switchValue ? 1 : 2
      }

      if(this.isEdit){
        config.id = this.params.id
        this.submitEditFunc(config)
      }else{
        config.type = 1
        this.submitAddFunc(config)
      }
    },

    // 修改
    submitEditFunc(config){
      if(config.name === ''){
        this.$message.warning("请填写分类名称")
        return false
      }else if(config.parentId === ''){
        this.$message.warning("请选择平台类别")
        return false
      }else if(config.catalogUrl === ''){
        this.$message.warning("请上传分类图标")
        return false
      }

      api.updateCourseCatalog(config).then(res => {
        if(res.success){
          this.$message({
            message: "提交成功",
            type: "success"
          })

          this.$router.push({
            name: 'ClassifyList',
          })
        }else{
          this.$message({
            message: res.message,
            type: "error"
          })
        }
      })
    },

    // 添加
    submitAddFunc(config){
      if(config.name === '' || config.parentId === ''){
        this.$message.warning("请填写分类名称或选择平台类别")
        return false
      }else if(config.catalogUrl === ''){
        this.$message.warning("请上传分类图标")
        return false
      }

      api.addCourseCatalog(config).then(res => {
        if(res.success){
          this.$message({
            message: "提交成功",
            type: "success"
          })

          this.$router.push({
            name: 'ClassifyList',
          })
        }else{
          this.$message({
            message: res.message,
            type: "error"
          })
        }
      })
    },

    deleteImg(index) {
      this.imageUrl.splice(this.imageUrl.findIndex((value, inx, arr) => inx === index), 1)
      this.uploadKey = ''
    },

    goback(){
      this.$router.back()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.el-form-item-center
  display flex
  justify-content center
  margin 40px 0 30px 0
>>>.el-form-item__content
  flex()
  button 
    width .82rem
    height .4rem
    background $color-theme
    border-radius 4px
    color #ffffff
    margin-top .4rem
    border none
.el-form-item, .el-select
  width 4rem
.classify-add, .holder-common
  width 100%
  padding 0
  box-sizing border-box
  .topbar
      flexBetween()
      font-size 12px
      div
        flex()
        color $color-text-l
        a
          flex()
          align-items center
        i 
          font-size 18px
          display inline-block
          margin-right .04rem
          float left
      h3
        font-size 20px
        cursor pointer
      p
        cursor pointer
      a 
        color $color-text-l
  .contain
    margin-top .23rem
    .box
      flex()
      width 100%
      height 4.6rem
      background-color #ffffff
      padding .38rem 0
      border-radius 2px
    .item-box
      width 5.6rem
      flex()
      justify-content flex-start
.right-flex
  flex()
  margin-top .1rem
  .right-switch
    width 1.1rem
    flex()
    justify-content space-between
    font-size 14px
    color #4A4A4A
    margin-top .03rem
.upload-content
  display flex
  flex-flow row nowrap
  align-items flex-end
  margin-top .1rem
  p
    font-size 14px
  >div
    &:first-child
      p
        color #4A4A4A
    &:last-child
      margin-left .2rem
      p
        color #999999
        line-height .2rem
.icon-tanhao-
  display inline-block
  color #D8D8D8
  font-size 20px
  margin-left 0.15rem
  margin-right .5rem
  text-align center
  cursor pointer
.content-four
  display flex
  flex-direction column
  justify-content flex-start
  align-items flex-start
  h4
    font-size .14rem
    height .22rem
    line-height .22rem
    color #4A4A4A
    margin-bottom .2rem
  .tips
    font-size .14rem
    height .2rem
    line-height .2rem
    color #9B9B9B
    margin-bottom .1rem
    span
      color $color-theme
  .image
    display flex
    justify-content flex-start
    align-items center
    .image-item
      width 2rem
      height 1.38rem
      border-radius .04rem
      margin-right .1rem
      position relative
      z-index 99
      img
        display block
        height 100%
        width 100%
        border .01rem dashed rgba(0,0,0,0.15)
        box-sizing border-box
        border-radius .05rem
      .el-icon-close
        font-size .3rem
        position absolute
        top 0
        right 0
        z-index 99
        cursor pointer
        background #ccc
        border-radius 0 .05rem 0 0
    #pickfiles
      width 1.38rem
      height 1.38rem
      box-sizing border-box
      border .01rem dashed rgba(0,0,0,0.15)
      border-radius .04rem
      display flex
      flex-direction column
      justify-content center
      align-items center
      cursor pointer
      &:hover
        border .01rem dashed $color-theme
      .el-icon-plus
        margin 0 0 .14rem
        font-size .24rem
        color rgba(0,0,0,0.45)
      .txt
        font-size .14rem
        fontCenter(.22rem)
        color rgba(0,0,0,0.65)
</style>

<style lang="stylus">
.avatar-uploader .el-upload 
  border 1px dashed #d9d9d9
  border-radius 6px
  cursor pointer
  position relative
  overflow hidden
.avatar-uploader .el-uploadhover 
  border-color #409EFF
.avatar-uploader-icon 
  font-size 28px
  color #8c939d
  width 1.2rem
  height 1.2rem
  line-height 1.2rem
  text-align center
.avatar 
  width 1.2rem
  height 1.2rem
  display block
</style>