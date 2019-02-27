<template>
  <div class="vip-power">
    <div class="topbar layout-head">
      <h3>等级对应特权</h3>
      <div>
        <h3 @click="goback">
          <i class="iconfont icon-fanhui"></i>
          返回
        </h3>
      </div>
    </div>

    <div class="contain">
      <router-link to="/index/viplvpowerset" class="powerSet">特权设置</router-link>

      <div class="box">
          <table>
            <tr>
              <th>会员特权</th>
              <th>说明</th>
              <th v-for="(item, index) of 10" :key="index">LV{{index + 1}}</th>
            </tr>
            <tr>
              <td>尊享折扣特权</td>
              <td>建议使用场景：会员提升到一定等级。则享受课程折扣特权</td>
              <td :class="[(index+1)%2!==0 ? 'bgGray' : '']" v-for="(item, index) of dataList" :key="item.id">
                <span v-if="item.id === 1 || !item.sale">-</span>
                <span v-else>{{item.sale}}折</span>
              </td>
            </tr>
            <!-- <tr>
              <td class="bgGray">免费查看付费提问</td>
              <td class="bgGray">固定次数的付费问题免费查看</td>
              <td :class="[(index+1)%2===0 ? 'bgGray' : '']" v-for="(item, index) of 10" :key="index">
                <i v-if="index > 1" class="iconfont icon-gou-"></i>
              </td>
            </tr>
            <tr>
              <td>专栏限时折扣订阅</td>
              <td>限时折扣订阅专栏课程，固定时间选择</td>
              <td :class="[(index+1)%2!==0 ? 'bgGray' : '']" v-for="(item, index) of 10" :key="index">
                <i v-if="index > 2" class="iconfont icon-gou-"></i>
              </td>
            </tr>
            <tr>
              <td class="bgGray">独享赠送课程</td>
              <td class="bgGray">达到固定级别可免费获赠一篇课程</td>
              <td :class="[(index+1)%2===0 ? 'bgGray' : '']" v-for="(item, index) of 10" :key="index">
                <i v-if="index > 1" class="iconfont icon-gou-"></i>
              </td>
            </tr>
            <tr>
              <td>限时提问置顶</td>
              <td>限时置顶自己的提问，固定时间选择</td>
              <td :class="[(index+1)%2!==0 ? 'bgGray' : '']" v-for="(item, index) of 10" :key="index">
                <i v-if="index > 5" class="iconfont icon-gou-"></i>
              </td>
            </tr> -->
          </table>
      </div>
    </div>
  </div>
</template>

<script>
import api from 'fetch/api'

export default {
  name: 'VipLvPower',
  data () {
    return {
      dataList: []
    }
  },
  created: function () {
    this.initList()
  },
  methods:{
    initList(){
      api.getVipFuncVOList().then(res => {
        if(res.data && res.data.length !== 0){
          this.dataList = res.data[0].rule
        }
      })
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

.vip-power
  width 100%
  box-sizing border-box
  .topbar
    div
      flex()
      color $color-text-l
    h3
      font-size 20px
      cursor pointer
    p
      cursor pointer
    a 
      color $color-text-l
  .contain
    flex()
    flex-direction column
    align-items flex-end
    .powerSet
      font-size 14px
      color #6CDDC7
      display block
      margin-bottom .1rem
    .box
      background #ffffff
      width 100%
      background rgba(255,255,255,1)
      border-radius 2px
      padding .2rem
      box-sizing border-box
      table
        width 100%
        tr
          height  .8rem
          font-size 14px
          color #4A4A4A
          &:first-child
            height .6rem
            background-color #6CDDC7
            th
              color #ffffff
              font-weight normal
              &:nth-child(1)
                width 1.8rem
              &:nth-child(2)
                width 2.4rem
          th,td
            line-height .22rem
            &:nth-child(1)
              padding-left .34rem
            &:nth-child(2)
              padding 0 .34rem
            &:nth-child(n+3)
              text-align center
          .bgGray
            background-color rgba(249,250,249,1)
          .icon-gou-
            color #6CDDC7
</style>