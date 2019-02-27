<template>
   <div class="upload-music">
     <p class="title">音频上传 <span :class="[status !== '' && status == 'success' ? 'success' : 'error']">{{tips}}</span></p>

     <div class="upload" v-show="isUpload">
      <el-progress v-show="uploading" class="progress" :percentage="progress" :status="status" color="#6cddc7"></el-progress>
      <div v-show="!uploading">
        <i class="el-icon-upload"> 
          可上传{{nums}}个音频文件，大小不超过{{size}}M 。支持扩展名：{{extension}} 
        </i>
        <el-button id="uploadAudio" class="upload-btn">上传文件</el-button>
      </div>
     </div>

     <div class="removed" v-show="!isUpload">
      <div class="content">
        <i class="iconfont icon-mp"></i>
        <p>{{audioName}}</p>
      </div>
      <el-button class="remove-btn" @click="handleRemove">移除文件</el-button>
     </div>
   </div>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from 'vuex'
import { initQiniu, conver } from 'assets/js/api'

export default {
    name:"UploadMusic",
    data () {
        return {
          isUpload: true,
          uploading: false,
          audioName: '',
          progress: 0,
          tips: '',
          status: '',
          uploadKey: ''
        }
    },

    props: {
      // 音频数量
      nums: {  
        default: 1
      },

      // 音频大小
      size: {  
        default: 50
      },

      // 音频类型
      extension: { 
        default: '.mp3'
      },

      // 回显音乐名称
      name: {
        type: String
      }
    },

    computed: {
      ...mapGetters([
        'token'
      ])
    },

    watch: {
      name(){
        if(this.name){
          this.audioName = this.name
          this.isUpload = false
          this.uploading = true
        }
      }
    },

    mounted () {
      this.init() 
    },

    methods:{
      // 初始化
      init(){
        const extensions = this.extension.replace(/\./g, 'audio/').replace(/\ /g, ',')
        const _this = this

        initQiniu('uploadAudio', this.size, extensions, (file, info) => {
          const newInfo = JSON.parse(info)

          _this.uploadKey = newInfo.key
          _this.audioName = file.name
          _this.tips = "上传成功！"

          const convey = {
            size: conver(file.size),
            key: _this.uploadKey,
            name: file.name
          }

          // 音频方法
          _this.$emit('onAudioData', convey)
        }, file => {
          if (file.isUpload === 1) {
            _this.tips = ''
            _this.progress = file.percent
            _this.uploading = true

            if( _this.progress === 100){
               _this.status = 'success'
               _this.isUpload = false
            }
          } else {
            _this.setEmpty()
            _this.status = 'exception'
            file.isUpload === 2 ? _this.tips = '文件大小超出范围！' : _this.tips = '文件类型不正确！';
          }
        }, _this.token)
      },

      // 移除
      handleRemove(){
        const _this = this

        _this.setEmpty()
        _this.isUpload = true
        _this.uploading = false
        _this.status = _this.uploadKey = _this.tips = ''

        _this.$emit('onAudioData', {
          size: 0,
          key: _this.uploadKey,
          name: ''
        })
      },

      // 设置空
      setEmpty(){
        this.audioName = ''
        this.progress = 0
      }
    }
}
</script>

<style lang="stylus" scoped>
.upload-music
  width 100%
  display flex
  flex-direction column
  font-size 14px
  color #4A4A4A
  >>>.el-progress.is-success .el-progress__text
    color #6cddc7
  .title
    margin-bottom .3rem
  .error
    color #f56c6c
  .success 
    color #6cddc7
  .progress
    margin 0
  .upload
    >div
      display flex
      flex-flow row nowrap
      justify-content space-between
      align-items center
      color #999999
  .removed
    display flex
    flex-flow row nowrap
    color #999999
    justify-content space-between
    .content
      display flex
      flex-flow row nowrap
      align-items center
      i 
        font-size 30px
        color #6cddc7
        margin-right .2rem
  .upload-btn, .remove-btn
    width 1.5rem
    height .4rem
    background #6cddc7
    border-radius .2rem
    color #ffffff
    font-size 14px
    border 0
</style>