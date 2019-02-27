<template>
    <div style="background:#fff;borderRadius:5px;">
        <h2 class="name">基本设置</h2>
        <div class="content">
            <div class="shopname">
                <span>*店铺名称：</span>
                <input type="text" placeholder="30字以内的中文，数字和英文" v-model="shopName" maxlength="30">
            </div>
            <div class="shoplogo">
                <span>*店铺logo：</span>
                <div id="pickfiles" v-if="!shopImg">
                    <i class="el-icon-plus"></i>
                    <p class="txt">上传照片</p>
                </div>
                <div class="pickfiles" v-else>
                    <img :src="shopImg">
                </div>
                <p class="suggest">建议尺寸300*300，大小不超过2M， 支持Jpg、Png格式</p>
            </div>
            <p class="tips">{{tips}}</p>
            <div class="shopdesc">
                <span>店铺简介：</span>
                <textarea name="" id="" cols="30" rows="10" v-model="shopDesc"></textarea>
            </div>
            <button class="goto-account" to="/settings/account" @click="save">下一步：账户设置</button>
        </div>
    </div>
</template>
<script>
import Cookies from 'js-cookie'
import {initQiniu} from 'assets/js/api'
import api from 'fetch/api'
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'Basic',
  data () {
    return {
      progress: '',
      key: '',
      tips: '',
      shopName: '',
      shopImg: '',
      shopDesc: '',
      token: '' // 用户token
    }
  },
  computed: {
    shopInfo () {
      return {
        'name': this.shopName,
        'logoUrl': this.key,
        'information': this.shopDesc
      }
    },
    ...mapGetters([
      'uploadImageHead'
    ])
  },
  created () {
    this.token = Cookies.get('token')
    this.getBaseInfo()
  },
  mounted () {
    var that = this
    initQiniu('pickfiles', 2, 'image/jpeg,image/jpg,image/png', (file, info) => {
      let newInfo = JSON.parse(info)
      that.progress = file.percent
      that.key = newInfo.key
      that.shopImg = that.uploadImageHead + that.key
      that.tips = '上传成功。'
    }, file => {
      that.shopImg = ''
      if (file.isUpload === 2) {
        that.tips = '文件大小超出范围！'
      } else if (file.isUpload === 3) {
        that.tips = '文件类型不正确！'
      }
    }, that.token)
  },
  methods: {
    saveShopInfo (params) {
      let that = this
      api.saveShopInfo(params).then(res => {
        if (res.success) {
          that.setUserInfo()
          that.$router.push('/settings/account')
        } else {
          that.$message.error('保存店铺信息失败！')
        }
      })
    },
    save () {
      if (this.shopName && this.shopImg && this.shopDesc) {
        this.saveShopInfo(this.shopInfo)
      } else {
        this.$message.error('店铺信息未填写完整！')
      }
    },
    getBaseInfo () {
      let that = this
      api.getBaseInfo().then(res => {
        that.shopName = res.data.storeName
      })
    },
    setUserInfo() {
      let that = this
      api.getBaseInfo().then(res => {
        that.setIsActive(res.data.storeStatus)
        let userInfo = {
          'userId': res.data.userId,
          'roleId': res.data.roleId,
          'imageHead': 'http://' + res.data.bucketDomain + '/',
          'isActive': res.data.storeStatus,
          'storeId': res.data.storeId
        }
        Cookies.set('vdongUserInfo', userInfo, {expires: 1})
      })
    },
    ...mapMutations({
      'setIsActive': 'SET_ISACTIVE'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
.name
  height .66rem
  width 95.8%
  margin 0 1.5% 0 1.5%
  border-bottom $color-border-1
  line-height .66rem
  font-size $font-size-medium-x
  color $color-text-d
.content
  columnFlex()
  padding-top .53rem
  .shopname
    margin .53rem 0 .4rem
    flex()
    height .32rem
    span
      font-size $font-size-medium
      color #000
      line-height .32rem
      height 100%
      margin-right .01rem
    input
      width 4.68rem
      border-radius $radius-s
      box-sizing border-box
      line-height .32rem
      height .32rem
      border .01rem solid rgba(0,0,0,0.15)
      padding-left .16rem
      font-size $font-size-medium
      color $color-text-d
      placeholderStyle()
  .shoplogo
    display flex
    justify-content center
    align-items flex-start
    height 1.04rem
    #pickfiles,.pickfiles
      cursor pointer
      width 1.04rem
      height 1.04rem
      box-sizing border-box
      border .01rem dashed rgba(0,0,0,0.15)
      border-radius .04rem
      margin-right .2rem
      columnFlex()
      overflow hidden
      &:hover
        border .01rem dashed $color-theme
      .el-icon-plus
        margin .24rem 0 .14rem
        font-size .24rem
        color rgba(0,0,0,0.45)
      .txt
        font-size .14rem
        fontCenter(.22rem)
        color rgba(0,0,0,0.65)
      img
        width 100%
        height 100%
        display block
    .suggest
      width 2.92rem
      height .4rem
      line-height .2rem
      white-space pre-wrap
      font-size $font-size-medium
      color #9B9B9B
      margin .32rem .52rem 0 0
    span
      font-size $font-size-medium
      color #000
      line-height .32rem
      height 100%
      margin-right .01rem
  .tips
    height .4rem
    width 4.68rem
    margin-left .8rem
    font-size .16rem
    color #FF6767
    line-height .4rem
  .shopdesc
    display flex
    justify-content center
    align-items flex-start
    height 1.5rem
    span
      font-size $font-size-medium
      color #000
      line-height .32rem
      height 100%
      margin-right .01rem
    textarea
      width 4.68rem
      border-radius $radius-s
      box-sizing border-box
      line-height .32rem
      height 1.5rem
      border .01rem solid rgba(0,0,0,0.15)
      padding 0 .16rem 0 .16rem
      font-size $font-size-medium
      color $color-text-d
      resize none
  .goto-account
    display block
    border-radius $radius-s
    width 1.28rem
    background $color-theme
    color #fff
    fontCenter(.28rem)
    font-size $font-size-small
    margin .8rem 0 .5rem
    cursor pointer
</style>
