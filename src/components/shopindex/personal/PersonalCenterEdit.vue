<template>
    <div class="shop-info-edit">
        <div class="save">
            <h3>编辑资料</h3>
            <span @click="toSave">保存</span>
        </div>
        <div class="content">
            <div class="line-one">
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
            </div>
            <div class="line-three">
                <div class="item">
                    <h3>详细地址</h3>
                    <textarea type="text" v-model="address"></textarea>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from 'fetch/api'
import {mapGetters} from 'vuex'
import VDistpicker from 'v-distpicker'
export default {
  name: 'PersonalCenterEdit',
  data () {
    return {
      nickName: '', // 用户昵称
      address: '', // 详细地址
      activeProvince: '',
      activeCity: '',
      activeArea: ''
    }
  },
  computed: {
    ...mapGetters([
      'userId'
    ])
  },
  components: {
    VDistpicker
  },
  created () {
    this.getUserInfo()
  },
  methods: {
    saveUserInfo () {
      let that = this
      if (that.nickName) {
        if (that.activeProvince && that.activeCity && that.activeArea) {
          if (that.address) {
            api.saveUserInfo({
              id: that.userId,
              nickName: that.nickName,
              userInfo: {
                id: that.userId,
                province: that.activeProvince,
                city: that.activeCity,
                district: that.activeArea,
                address: that.address
              }
            }).then(res => {
              if (res.success) {
                that.$emit('getNickName')
                that.$router.back()
              } else {
                that.$message.error('保存用户信息失败！')
              }
            })
          } else {
            that.$message.error('详细地址不能为空！')
          }
        } else {
          that.$message.error('所在地区选择不完整！')
        }
      } else {
        that.$message.error('用户昵称不能为空！')
      }
    },
    getUserInfo () {
      let that = this
      api.getUserInfo({
        userId: that.userId
      }).then(res => {
        if (res.success) {
          let userInfo = res.data.userInfo
          that.nickName = res.data.nickName
          that.address = userInfo.address
          that.activeProvince = userInfo.province
          that.activeCity = userInfo.city
          that.activeArea = userInfo.district
        }
      })
    },
    toSave () {
      this.saveUserInfo()
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
  display flex
  flex-flow row nowrap
  align-items center
  justify-content space-between
  margin-bottom .2rem
  h3
    color #9b9b9b
    font-size 0.2rem
  span
    cursor pointer
    float right
    width .82rem
    height .4rem
    text-align center
    border-radius .04rem
    background $color-theme
    color #fff
    font-size 14px
    line-height .4rem
.content
  background #fff
  width 100%
  border-radius .05rem
  margin 0 auto
  columnFlex()
  overflow hidden
  .line-one,.line-two,.line-three
    display flex
    justify-content space-between
    align-items center
    width 6rem
    height .59rem
    margin .52rem 0 .4rem
    .item
      width 6rem
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
        width 6rem
        border-radius .04rem
        padding-left .1rem
  .line-two
    margin-top 0
  .line-three
    margin-top 0
    height 1.31rem
    .item
      width 100%
      textarea
        height 1.04rem
        resize none
</style>
