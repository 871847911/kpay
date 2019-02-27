<template>
    <div class="carousel-home-edit">
        <div v-show="!isNext">
            <div class="topbar layout-head">
              <h3>添加/编辑轮播图</h3>
              <div>
                <h3 @click="goback">
                  <i class="iconfont icon-fanhui"></i>
                  返回
                </h3>
                <button class="mr-10 topbat-next" @click="next">下一步</button>
              </div>
            </div>

            <div class="contain">
                <div class="box">
                  <el-form :model="bannerDetail" ref="bannerDetail" label-position="top" :rules="rules">
                   <div class="item-box">
                      <el-form-item label="轮播图名称" prop="fileName">
                        <el-input type="text" v-model="bannerDetail.fileName" maxlength="18" auto-complete="off" placeholder=""></el-input>
                      </el-form-item>
                   </div>

                    <div class="item-box">
                      <el-form-item label="轮播图位置" prop="type">
                          <el-select v-model="bannerDetail.type" :disabled="isEdit" placeholder="请选择">
                          <el-option
                            v-for="(item, index) in bannerOptions"
                            :key="index"
                            :label="item.label"
                            :value="item.value">
                          </el-option>
                        </el-select>
                      </el-form-item>

                      <div class="right-flex">
                        <p>是否上线：</p>
                        <el-switch
                          v-model="bannerDetail.isOnline"
                          active-color="#6CDDC7"
                          inactive-color="#AEB8BE">
                        </el-switch>
                      </div>
                    </div>

                    <div class="upload-content">
                      <div class="content-four">
                        <h4>轮播图</h4>
                        <div class="image">
                          <div class="image-item" v-for="(item,index) of imageUrl" :key="index" v-if="imageUrl.length > 0">
                              <img :src="item">
                              <i class="el-icon-close" @click="deleteImg(index)"></i>
                          </div>
                          <div id="pickfiles" v-show="imageUrl.length < 1">
                              <i class="el-icon-plus"></i>
                              <p class="txt">上传图片</p>
                          </div>
                        </div>
                      </div>
                      <div class="mind">
                        <p style="color:#666666; margin-bottom:10px;">{{ tips }}</p>
                        <p>建议尺寸：344*128；</p>
                        <p>支持格式：PNG/JPG/JPEG；</p>
                        <p>大小：不超过2MB</p>
                      </div>
                    </div>

                    <div class="item-box" style="margin-top: 20px">
                      <el-form-item label="轮播顺序（数值越小越靠前）" prop="sortNum">
                        <el-input type="number" v-model.number="bannerDetail.sortNum" maxlength="18"  auto-complete="off" placeholder="请选择展示顺序"></el-input>
                      </el-form-item>
                    </div>

                    <div class="item-box choose-link">
                      <p>选择跳转路径：</p>
                      <ul>
                        <li @click="chooseLink(initLinkType)" :class="bannerDetail.linkType === 1 || bannerDetail.linkType === 4 ? 'active' : ''">
                          <i class="iconfont icon-neirong-"></i>
                          <p>内容</p>
                        </li>
                        <li @click="chooseLink(2)" :class="bannerDetail.linkType === 2 ? 'active' : ''">
                          <i class="iconfont icon-dingyuejiangshi"></i>
                          <p>讲师</p>
                        </li>
                        <li @click="chooseLink(3)" :class="bannerDetail.linkType === 3 ? 'active' : ''">
                          <i class="iconfont icon-yingxiao-"></i>
                          <p>营销</p>
                        </li>
                      </ul>
                    </div>
                  </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from 'fetch/api'
import {mapGetters} from 'vuex'
import {initQiniu} from 'assets/js/api'
import Cookies from 'js-cookie'

export default {
  name: 'CarouselHomeEdit',
  data () {
    var validOrder = (rule, value, callback) => {
      if (value === '') {
        callback()
      } else {
        if(!Number.isInteger(value)){
          callback(new Error('请输入数字值'))
        }else{
          if(value < 0){
              callback(new Error('请输入大于0的数字值'))
            }else{
              callback()
          }
        }
      }
    }
    return {
      initLinkType: 1,
      tips: "",
      isEdit: false, //是否是编辑
      imageUrl: [], //上传图片保存的图片数组
      bannerDetail: {
        fileName: "",
        isOnline: true,
        linkType: 0, // 路径类型
        linkValue: "",
        pageName: "",
        sourceUrl: "", //上传图片保存的key
        sortNum: 0, //轮播图顺序
        type: 1,
        storeId:""
     },
     bannerOptions: [
        {
          value: 1,
          label: "首页轮播图"
        },
        {
          value: 2,
          label: "店铺详情轮播图"
        }
      ],
      rules: {
        sortNum:[
          { required: true, validator: validOrder, trigger: 'blur' }
        ],
      },
      isNext: false, //是否下一步了
      finalData: {} //最终传入下一步的数据
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

  created () {
    // 编辑时根据根据id获取信息
    const ids = this.$route.query.id
    if(ids){
      this.isEdit = true
      this.init(this.$route.query.id)
    }else{
      this.initQiniu()
      this.isEdit = false
      if(Cookies.get('carouselDate')){
        this.bannerDetail = JSON.parse(Cookies.get('carouselDate'))
        const { linkType } = this.bannerDetail

        if(linkType == 1 || linkType == 4){
          this.initLinkType = Number(linkType)
        }
        this.imageUrl.push(this.uploadImageHead + this.bannerDetail.sourceUrl)
      }
    }
  },

  mounted (){
   this.sourceDate = {...this.source}
  },

  methods: {
    // 编辑获取数据
   init(id){
     if(!id) return false

      api.getStoreAdvert({
        id: id
      }).then(res => {
        if(res.success){
          if(!res.data) return false

          let _url = res.data.sourceUrl
          let cookData = null
          let finalData = null
          this.imageUrl = []

          if(Cookies.get('carouselDate')){
            cookData = JSON.parse(Cookies.get('carouselDate'))
          }
          if(cookData){
            finalData = cookData

            if(cookData.sourceUrl === _url){
              this.imageUrl.push(this.imageHead + _url)
            }else{
              this.imageUrl.push(this.uploadImageHead + cookData.sourceUrl)
            }
          }else{
            this.imageUrl.push(this.imageHead + _url)
            finalData = res.data
          }
          this.bannerDetail = {...this.bannerDetail, ...finalData}

          const { linkType } = this.bannerDetail
          if(linkType == 1 || linkType == 4){
            this.initLinkType = Number(linkType)
          }
        }else{
          this.$message.error(res.message)
        }
      })
      
      this.initQiniu()
    },

    //初始化千牛
    initQiniu(){
      const that = this

      initQiniu('pickfiles', 2, 'image/jpeg,image/jpg,image/png', (file, info) => {
        let newInfo = JSON.parse(info)
        const _url = that.uploadImageHead + newInfo.key

        if(that.imageUrl.length !== 0){
          that.imageUrl[0] = _url
        }else{
          that.imageUrl.push(_url)
        }

        that.bannerDetail.sourceUrl = newInfo.key
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
    },

    // 选择路径类型
    chooseLink(num){
      this.bannerDetail.linkType = num
    },

    // 删除图片
    deleteImg(index) {
      this.imageUrl.splice(this.imageUrl.findIndex((value, inx, arr) => inx === index), 1)
    },

    // 下一步
    next(){
      this.$refs['bannerDetail'].validate(valid => {
        if(valid){
          const {sourceUrl, linkType} = this.bannerDetail

          if(sourceUrl === ''){
            this.$message.warning("请上传轮播图！")
            return false
          }else if(linkType === 0){
            this.$message.warning("选择跳转路径！")
            return false
          }else{
            switch (this.bannerDetail.linkType) {
              case 1:
              case 4:
                this.goRouter("/index/carouselhomeaddeditor")
                break;
              case 2:
                this.goRouter("/index/carouselhomelecturer")
                break;
              case 3:
                this.goRouter("/index/carouselhomepersonal")
                break;
            }
            this.isNext = true
            this.finalData = {...this.bannerDetail}
            Cookies.set('carouselDate', this.finalData, {expires: 1})
          }
        }
      })
    },

    // 回退
    goback(){
      this.$router.back()
    },

    // 路由跳转
    goRouter(value){
      this.$router.push({
        path:value
      })
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
    margin-top .2rem
.el-input
  width 6rem
.el-select
  width 4rem
.carousel-home-edit
  width 100%
  color #4A4A4A
  box-sizing border-box
  .topbar
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
      .topbat-next
        width .85rem
        height .4rem
        background-color $color-theme
        color #ffffff
        border-radius 4px
        cursor pointer
  .contain
    .box
      flex()
      width 100%
      background-color #ffffff
      padding .38rem 0
      border-radius 2px
    .item-box
      width 6rem
      flex()
      justify-content flex-start
    .img-box
      margin .25rem 0
      flex-flow column wrap
      align-items flex-start
      font-size 14px
      >div
        width 6rem
        height 1.5rem
      img 
        width 100%
        height 100%
        margin-top .15rem
.right-flex
  width 2rem
  flex()
  margin-top .165rem
  font-size 14px
  p
    margin-right .18rem
  span
    color #9B9B9B
.choose-link
  display flex
  flex-direction column
  align-items flex-start !important
  margin-top .12rem !important
  font-size 14px
  margin-top 0
  p
    margin-right .18rem
  ul
    flex()
    flex-flow row nowrap
    margin-top .13rem
    li 
      width 1.2rem
      height 1.2rem
      background #ffffff
      border-radius 4px
      border 1px solid rgba(230,230,230,1)
      margin-right .2rem
      cursor pointer
      flex()
      flex-direction column
      &.active
        border-color $color-theme
      i 
        font-size .35rem
        color $color-theme
        margin-bottom .2rem
      p
        margin 0
        color #9B9B9B
.upload-content
  display flex
  flex-flow row nowrap
  align-items flex-end
  margin-top .12rem
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
        line-height .23rem
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
      width 4rem
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
.icon-tanhao-
  display inline-block
  color #D8D8D8
  font-size 20px
  margin-left 0.15rem
  margin-right .5rem
  text-align center
  cursor pointer
</style>

<style lang="stylus">
.avatar-uploader .el-upload 
  width 4rem
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