<template>
  <div class="myclomun-list-co holder-common">
      <div>
          <div class="topbar layout-head">
            <h3>添加图文</h3>
            <div>
              <h3 @click="goback">
                <i class="iconfont icon-fanhui"></i>
                返回
              </h3>
            </div>
          </div>

          <div class="contain">
              <div class="box">
                <el-form :model="formData" ref="formData" label-position="top">
                  <p class="form-part-head">基本信息</p>

                  <div class="column-detail">
                    <div class="detail-left">
                      <p>专栏名称</p>
                      <strong>吴军的互联网方法论</strong>
                    </div>
                    <div class="detail-right">
                      <div>
                        <p>篇幅</p>
                        <strong>20</strong>
                      </div>
                       <div>
                        <p>当前篇幅</p>
                        <strong>08</strong>
                      </div>
                    </div>
                  </div>

                  <el-form-item 
                    prop="contentName">
                    <div class="column-item">
                      <p class="item-title">* 图文名称</p>
                      <el-input
                        placeholder="请输入专栏名称"
                        v-model="formData.contentName">
                      </el-input>
                    </div>
                  </el-form-item>

                  <div class="image-upload">
                    <UploadImage @onImageData="handleImageData" :getkeys="displayContentUrl"></UploadImage>
                  </div>

                  <p class="form-part-head">图文内容</p>

                  <div class="music-upload">
                    <UploadMusic @onAudioData="handleAudioData" :name="audioData.audioName"></UploadMusic>
                  </div>

                  <div class="editor-upload">
                    <p>* 图文内容</p>
                    <quill-editor @change="handleEditorValue" :editorValue="content"></quill-editor>
                  </div>

                  <div class="shelf-setting">
                    <p>* 上架设置</p>
                    <div>
                      <el-radio v-model="shelvesSet" label="2">暂不上架</el-radio>
                      <el-radio v-model="shelvesSet" label="3">立即上架</el-radio>
                    </div>
                    <span>注：此项为审核通过后的上架行为</span>
                  </div>

                  <el-form-item>
                    <el-button class="confirm-green" @click="submit">保存</el-button>
                  </el-form-item>
                </el-form>
              </div>
          </div>
      </div>
      <no-active v-if="isActive == 3" @reFresh="isEditorFunc"></no-active>
  </div>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from 'vuex'
import { initQiniu } from 'assets/js/api'
import NoActive from 'components/common/NoActive'
import UploadImage from "components/common/UploadImage"
import UploadMusic from "components/common/UploadMusic"
import QuillEditor from "components/common/Quilleditor";

export default {
  name: "MycolumnListAddGraphic",
  data() {
    return {
      formData:{
        contentName: '',
        contentUrl: ''
      },
      displayContentUrl: [], //回显数组
      audioData: {
        audioSize: '',
        audioUrl: '',
        audioName: ''
      },
      content: '',
      shelvesSet: '2',
      isEditor: false
    };
  },

  computed: {
    ...mapGetters([
      'isActive',
      'storeId',
      'userId'
    ])
  },

  components: {
    UploadImage,
    UploadMusic,
    QuillEditor,
    NoActive

  },

  created(){
    this.isEditor = this.$route.query.contentId ? true : false
  },

  mounted(){
    this.isEditorFunc()
  },

  methods: {
    // 判断是否是编辑
    isEditorFunc(){
      if(this.isEditor){
        api.getColumnContentInfo({
          id: this.$route.query.contentId
        }).then(res => {
          const { contentName, contentUrl, audioSize, audioUrl, audioName, content, shelvesSet } = res.data

          if(res.data){
            this.formData = Object.assign(this.formData, {
              contentName,
              contentUrl
            })

            this.audioData = Object.assign(this.audioData, {
              audioSize,
              audioUrl,
              audioName
            })

            this.content = content
            this.shelvesSet = shelvesSet.toString()
            this.displayContentUrl = [contentUrl]
          }
        })
      }
    },

    // 保存
    submit(){
      const _this = this
      const { content, shelvesSet, storeId, userId, formData, audioData} = _this
      let { columnId, columnNo } = _this.$route.query

      if(!columnNo){
        columnNo = ''
      }else if(!columnId){
        columnId = ''
      }

      if(formData.contentName === ''){
        _this.remind('请填写图文名称！')
      }else if(formData.contentUrl === ''){
        _this.remind('请上传图文封面！')
      }else if( audioData.audioUrl === ''){
        _this.remind('请上传音频 ！')
      }else if(content === ''){
        _this.remind('请填写图文内容！')
      }else{
        let postData = {
          storeId,
          userId,
          columnId,
          columnNo,
          content,
          shelvesSet,
          ...audioData,
          ...formData,
        }

        if(_this.isEditor){
          postData.id = _this.$route.query.contentId

          _this.modifyColumnContent(postData)
        }else{
          _this.createColumnContent(postData)
        }
      }
    },

    // 添加
    createColumnContent(postData){
      api.createColumnContent({
        ...postData
      }).then(res => {
        if(res.success){
          this.$message.success('保存成功！')

          this.$router.push({
            name: 'MycolumnListCoDetail',
            query: {
              contentId: this.$route.query.contentId
            }
          })
        }else{
          this.$message.error(res.message)
        }
      })
    },

    // 编辑
    modifyColumnContent(postData){
      api.modifyColumnContent({
        ...postData
      }).then(res => {
        if(res.success){
          this.$message.success('保存成功！')

          this.$router.push({
            name: 'MycolumnListCoDetail',
            query: {
              contentId: this.$route.query.contentId
            }
          })
        }else{
          this.$message.error(res.message)
        }
      })
    },

    // 上传图片回调
    handleImageData(urls){
      this.formData.contentUrl = urls[0]
    },

    // 上传音频回调
    handleAudioData({ size, key, name }){
      let audio = this.audioData

      audio.audioSize = size
      audio.audioUrl = key
      audio.audioName = name
    },

    // 编辑器回调
    handleEditorValue(val) {
      this.content = val;
    },

    // 提示
    remind(msg){
      this.$message.error(msg)
    },

    // 回退
    goback(){
      this.$router.back()
    }
  },
};
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.el-form-item
  display flex
  flex-direction column
  align-items center
  justify-content center
  .column-item
    width 720px
  .item-title
    color #4A4A4A
.myclomun-list-co, .holder-common
  width 100%
  padding 0
  box-sizing border-box
  .topbar
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
      margin-right .2rem
      cursor pointer
    p
      cursor pointer
    a 
      color $color-text-l
.contain
  .box
    width 100%
    background-color #ffffff
    padding .05rem .28rem .5rem .28rem
    border-radius 2px
    box-sizing border-box
    .form-part-head 
      font-size 14px
      line-height 49px
      color $color-theme
      border-bottom 1px solid #E6E6E6
      margin-bottom .3rem
    .column-detail
      width 720px
      margin 0 auto
      flex()
      justify-content space-between
      margin-bottom .6rem
      .detail-left
        width 50%
        position relative
        &::after
          content ""
          position absolute
          right 0
          top 0
          width 2px
          height .56rem
          background-color rgba(230,230,230,.5)
      .detail-right
        width 50%
        flex()
        justify-content flex-start
        >div
          margin-left .4rem
      p
        color #9B9B9B
        font-size 14px
        margin-bottom .1rem
      strong 
        color #4A4A4A
        font-size 20px
    .music-upload, .image-upload, 
    .editor-upload, .shelf-setting
      width 720px
      margin 0 auto
    .editor-upload
      margin-top .5rem
      p 
        font-size 14px
        color #4A4A4A
        line-height: 0.22rem;
        margin-bottom .1rem
    .shelf-setting
      flex()
      align-items center
      justify-content flex-start
      margin-top .3rem
      margin-bottom .6rem
      >div
        flex()
        margin-right .5rem
        margin-left .2rem
      p 
        font-size 14px
        color #4A4A4A
      span 
        color #9B9B9B
        font-size 12px
</style>