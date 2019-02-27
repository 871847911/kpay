<template>
    <div class="shop-info-edit">
        <div class="save">
            <span class="major-btn" @click="toSave">保存</span>
        </div>
        <div class="content">
            <div class="line-one">
                <div class="item">
                    <h3>店铺名称</h3>
                    <input type="text" v-model="shopName">
                </div>
                <div class="item">
                    <h3>用户昵称</h3>
                    <input type="text" v-model="nickName">
                </div>
            </div>
            <div class="line-two">
                <div class="item">
                    <h3>所在地区</h3>
                    <v-distpicker :province="activeProvince" :city="activeCity" :area="activeArea" @province="onChangeProvince"
              @city="onChangeCity" @area="onChangeArea"></v-distpicker>
                </div>
                <div class="item">
                    <h3>客服电话</h3>
                    <input type="tel" v-model="phone">
                </div>
            </div>
            <div class="line-three">
                <div class="item">
                    <h3>详细地址</h3>
                    <input type="text" v-model="address">
                </div>
            </div>
            <div class="line-four">
                <div class="item">
                    <h3>店铺简介</h3>
                    <textarea v-model="desc"></textarea>
                </div>
            </div>
            <div class="line-five">
                <h3>店铺logo</h3>
                <div class="upload">
                    <div id="pickfiles" v-if="!imageUrl">
                        <i class="el-icon-plus"></i>
                        <p class="txt">上传照片</p>
                    </div>
                    <div id="pickfiles" v-else>
                        <img :src="imageUrl">
                    </div>
                    <p class="suggest">建议尺寸300*300，大小不超过2M， 支持Jpg、Png格式</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {initQiniu} from 'assets/js/api'
import api from 'fetch/api'
import {mapGetters} from 'vuex'
import VDistpicker from 'v-distpicker'
export default {
  name: 'ShopInfoEdit',
  data () {
    return {
      key: '',
      imageUrl: '', // 店铺url
      tips: '', // 图片上传成功与否的提示
      shopName: '', // 店铺名称
      nickName: '', // 用户昵称
      phone: '', // 手机号
      address: '', // 详细地址
      desc: '', // 店铺简介
      mapJson: '',
      activeProvince: '',
      activeCity: '',
      activeArea: ''
    }
  },
  components: {
    VDistpicker
  },
  mounted () {
    var that = this
    initQiniu('pickfiles', 2, 'image/jpeg,image/jpg,image/png', (file, info) => {
      let newInfo = JSON.parse(info)
      that.imageUrl = that.uploadImageHead + newInfo.key
      that.key = newInfo.key
      that.tips = '上传成功。'
    }, file => {
      if (file.isUpload === 1) {
        //
      } else if (file.isUpload === 2) {
        that.tips = '文件大小超出范围！'
      } else {
        that.tips = '文件类型不正确！'
      }
    }, that.token)
  },
  computed: {
    ...mapGetters([
      'token',
      'imageHead',
      'uploadImageHead'
    ])
  },
  created () {
    this.getStoreInfo()
  },
  methods: {
    saveStoreInfo () {
      let that = this
      if (that.shopName) {
        if (that.nickName) {
          if (that.activeProvince && that.activeCity && that.activeArea) {
            if (that.phone) {
              if (that.address) {
                if (that.desc) {
                  if (that.key) {
                    api.saveShopInfo({
                      province: that.activeProvince,
                      city: that.activeCity,
                      area: that.activeArea,
                      name: that.shopName,
                      information: that.desc,
                      logoUrl: that.key,
                      customerPhone: that.phone,
                      userMain: {
                        nickName: that.nickName,
                        userInfo: {
                          address: that.address
                        }
                      }
                    }).then(res => {
                      if (res.success) {
                        that.$emit('getNickName')
                        that.$router.back()
                      } else {
                        that.$message.error('保存店铺信息失败！')
                      }
                    })
                  } else {
                    that.$message.error('店铺logo不能为空！')
                  }
                } else {
                  that.$message.error('店铺简介不能为空！')
                }
              } else {
                that.$message.error('详细地址不能为空！')
              }
            } else {
              that.$message.error('客服电话不能为空！')
            }
          } else {
            that.$message.error('所在地区选择不完整！')
          }
        } else {
          that.$message.error('用户昵称不能为空！')
        }
      } else {
        that.$message.error('店铺名称不能为空！')
      }
    },
    getStoreInfo () {
      let that = this
      api.getShopInfo().then(res => {
        if (res.success) {
          let storeInfo = res.data
          let userMain = res.data.userMain
          let userInfo = res.data.userMain.userInfo
          if (storeInfo.logoUrl) {
            that.key = storeInfo.logoUrl
            if (that.imageHead !== 'http:///') {
              that.imageUrl = that.imageHead + storeInfo.logoUrl
            } else {
              that.imageUrl = 'http://kpay.qiniu.vdongchina.com/' + storeInfo.logoUrl
            }
          }
          that.shopName = storeInfo.name
          that.nickName = userMain.nickName
          that.phone = storeInfo.customerPhone
          that.address = userInfo.address
          that.desc = storeInfo.information
          that.activeProvince = storeInfo.province
          that.activeCity = storeInfo.city
          that.activeArea = storeInfo.area
        } else {
          this.$message.error('获取用户信息失败！')
        }
      }, ret => {
        that.$message.error('获取用户信息失败！')
      })
    },
    toSave () {
      this.saveStoreInfo()
    },
    onChangeProvince(data) {
      this.activeProvince = data.value
    },
    onChangeCity(data) {
      this.activeCity = data.value
    },
    onChangeArea(data) {
      this.activeArea = data.value
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.shop-info-edit
  width 100%
  margin 0 auto
.save
  width 100%
  height auto 
  overflow hidden
  margin 0 auto .2rem
  span
    float right
.content
  min-height 8.13rem
  background #fff
  width 100%
  border-radius .05rem
  margin 0 auto
  columnFlex()
  overflow hidden
  .line-one,.line-two,.line-three,.line-four
    display flex
    justify-content space-between
    align-items center
    width 7.85rem
    height .59rem
    margin .52rem 0 .4rem
    .item
      width 3.45rem
      h3
        height .22rem
        line-height .22rem
        font-size .14rem
        color rgba(0,0,0,0.85)
        margin-bottom .05rem
      input,textarea
        border .01rem solid rgba(0,0,0,0.15)
        box-sizing border-box
        height .32rem
        line-height .32rem
        font-size .14rem
        width 3.45rem
        border-radius .04rem
        padding-left .1rem
  .line-two
    margin-top 0
  .line-three,.line-four
    margin-top 0
    .item
      width 100%
      input,textarea
        width 100%
  .line-four
    height 1.31rem
    .item
      textarea
        height 1.04rem
        resize none
  .line-five
    width 7.85rem
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
    height 2.3rem
    h3
      width 100%
      height .22rem
      line-height .22rem
      font-size .14rem
      color rgba(0,0,0,0.85)
      margin-bottom .11rem
    .upload
      height 1.97rem
      width 100%
      display flex
      justify-content flex-start
      align-items center
      #pickfiles
        cursor pointer
        width 1.97rem
        height 1.97rem
        box-sizing border-box
        border .01rem dashed rgba(0,0,0,0.15)
        border-radius .04rem
        margin-right .35rem
        columnFlex()
        background rgba(0,0,0,0.02)
        &:hover
          border .01rem dashed $color-theme
        .el-icon-plus
          margin .69rem 0 .14rem
          font-size .24rem
          color rgba(0,0,0,0.45)
          font-weight 600
        .txt
          font-size .14rem
          fontCenter(.22rem)
          color rgba(0,0,0,0.65)
        img
            width 100%
            height 100%
      .suggest
        width 2.92rem
        font-size .14rem
        color #9B9B9B
        line-height .2rem
        height .4rem
  .tips
    height .4rem
    width 4.68rem
    margin-left .8rem
    font-size .16rem
    color #FF6767
    line-height .4rem
</style>
