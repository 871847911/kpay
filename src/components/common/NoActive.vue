<template>
    <div>
        <img src="../../assets/image/no-active.png" class="no-active-image">
        <h2 class="no-active-tip">暂无相关内容，请激活后使用完整功能</h2>
        <button class="no-active-btn" @click="toActive">去激活</button>
    </div>
</template>

<script>
import Cookies from 'js-cookie'
import api from 'fetch/api'
import {mapGetters, mapMutations} from 'vuex'
export default {
  name: 'NoActive',
  methods: {
    toActive () {
      let that = this
      api.activeShop().then(res => {
        if (res.success) {
          that.getBaseInfo()
          that.$emit('reFresh')
        } else {
          that.$message.error('店铺激活失败！请重新激活')
        }
      })
    },
    getBaseInfo () {
      let that = this
      api.getBaseInfo().then(res => {
        if (res.success) {
          that.setIsActive(res.data.storeStatus)
          let userInfo = {
            'userId': res.data.userId,
            'roleId': res.data.roleId,
            'imageHead': 'http://' + res.data.bucketDomain + '/',
            'isActive': res.data.storeStatus,
            'storeId': res.data.storeId
          }
          Cookies.set('vdongUserInfo', userInfo, {expires: 1})
        } else {
          if (res.code === 403) {
            that.$router.push({name: 'Login'})
          } else {
            that.$message.error('服务器异常！')
          }
        }
      })
    },
    ...mapMutations({
      'setIsActive': 'SET_ISACTIVE'
    })
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/varibles"

.no-active-image
    margin .45rem auto .45rem
    height 4.03rem
    width 4.24rem
    display block
.no-active-tip
    width 3.4rem
    height .28rem
    line-height .28rem
    color #9B9B9B
    font-size .2rem
    margin 0 auto .32rem
.no-active-btn
    width .95rem
    height .28rem
    border-radius .04rem
    background $color-theme
    color #fff
    font-size .12rem
    line-height .28rem
    text-align center
    margin 0 auto 0
    display block
    cursor pointer
</style>
