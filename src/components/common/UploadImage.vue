<template>
  <div class="upload-image">
    <div class="content">
      <h4 class="title">{{title}}</h4>
      <p>建议尺寸300*400，大小不超过{{size}}M，支持Jpeg、Jpg、Png格式 <span :class="[status !== '' && status ? 'success' : 'error']">{{tips}}</span></p>
      
      <div class="image">
          <div class="image-item" v-for="(item,index) of imgUrls" :key="index" v-if="imgUrls.length > 0">
              <img :src="item">
              <i v-show="!disabled" class="el-icon-close" @click="deleteImg(index)"></i>
          </div>

          <div id="pickfiles" v-show="imgUrls.length < limit">
              <i class="el-icon-plus"></i>
              <p class="upload-txt">上传图片</p>
          </div>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from 'vuex'
import { initQiniu } from 'assets/js/api'

export default {
    name:"UploadImage",
    data () {
      return {
        imgUrls: [],
        uploadKeys: [],
        tips: '',
        status: ''
      }
    },

    props: {
      // 音频数量
      title: {  
        type: String,
        default: '* 图文封面'
      },

      // 音频大小
      size: {  
        type: Number,
        default: 2
      },

      // 限制上传数量
      limit: {
        type: Number,
        default: 1
      },

      // 回显获取key
      getkeys: {
        type: Array,
        default: []
      },

      // 是否禁用
      disabled: {
        type: Boolean,
        default: false
      }
    },

    computed: {
      ...mapGetters([
        'token',
        'imageHead',
        'uploadImageHead'
      ])
    },

    mounted () {
      this.init() 
    },

    watch: {
      getkeys(){
        if(this.getkeys.length > 0){
          this.getkeys.forEach(item => {
            this.uploadKeys.push(item)
            this.imgUrls.push(this.imageHead + item)
          });
        }
      }
    },

    methods:{
      // 初始化
      init(){
        const _this = this

        initQiniu('pickfiles', this.size, 'image/jpeg,image/jpg,image/png', (file, info) => {
          const newInfo = JSON.parse(info)
          const _url = _this.uploadImageHead + newInfo.key

          _this.uploadKeys.push(newInfo.key)
          _this.imgUrls.push(_url)

          _this.tips = '上传成功！'
          _this.status = true
          
          // 图片方法
          _this.$emit('onImageData', _this.uploadKeys)
        }, file => {
          if (file.isUpload !== 1) {
            if (file.isUpload === 2) {
              _this.tips = '文件大小超出范围！'
            } else {
              _this.tips = '文件类型不正确！'
            }
            _this.status = false
          }
        }, _this.token)
      },

      // 删除图片
      deleteImg(index) {
        const _this = this

        _this.imgUrls.splice(_this.imgUrls.findIndex((val, i, arr) => i === index), 1)
        _this.uploadKeys.splice( _this.uploadKeys.findIndex((val, i, arr) => i === index), 1)
        _this.status = _this.tips = ''

        _this.$emit('onImageData', _this.uploadKeys)
      }
    }
}
</script>

<style lang="stylus" scoped>
.upload-image
  display flex
  flex-flow row nowrap
  align-items flex-end
  margin .1rem auto .2rem auto
  .title
    color #4A4A4A
  p
    font-size 14px
  .content
    >p
      color #999999
      line-height .2rem
    .error
      color #f56c6c
    .success 
      color #6cddc7
  .content
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
    h4
      font-size .14rem
      height .22rem
      line-height .22rem
      color #4A4A4A
      margin-bottom .05rem
    >p
      margin-bottom .1rem
    .tips
      font-size .14rem
      height .2rem
      line-height .2rem
      color #9B9B9B
      margin-bottom .1rem
      span
        color #6cddc7
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
          border .01rem dashed #6cddc7
        .el-icon-plus
          margin 0 0 .14rem
          font-size .24rem
          color rgba(0,0,0,0.45)
        .upload-txt
          font-size .14rem
          color rgba(0,0,0,0.65)
</style>