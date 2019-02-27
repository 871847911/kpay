<template>
    <div class="carousel-home-detail">
        <div>
            <div class="topbar layout-head">
              <h3>轮播图详情</h3>
              <div>
                <h3 @click="goback">
                  <i class="iconfont icon-fanhui"></i>
                  返回
                </h3>
                <button class="mr-10 topbat-edit" @click="goToEdit">编辑</button>
              </div>
            </div>

            <div class="contain">
                <div class="box">
                  <el-form :model="bannerDetail" ref="bannerDetail" label-position="top">
                   <div class="item-box">
                      <el-form-item label="轮播图名称" prop="fileName">
                        <el-input type="text" :disabled="true" :value="bannerDetail.fileName" auto-complete="off" placeholder=""></el-input>
                      </el-form-item>
                   </div>

                    <div class="item-box">
                      <el-form-item label="轮播图位置" prop="platform">
                          <el-select v-model="bannerDetail.type" placeholder="请选择" :disabled="true">
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
                        <span v-if="bannerDetail.isOnline"><i class="iconfont icon-zitikuicon-" style="color: #6CDDC7;font-size:12px"></i>已启用</span>
                        <span v-else><i class="iconfont icon-zitikuicon-" style="color: #9B9B9B;font-size:12px"></i>未启用</span>
                      </div>
                    </div>

                    <div class="item-box img-box">
                      <p>轮播图片</p>
                      <div>
                        <img :src="imageHead + bannerDetail.sourceUrl" alt="轮播图片">
                      </div>
                    </div>

                    <div class="item-box">
                      <el-form-item label="跳转路径" prop="name">
                        <el-input type="text" :value="bannerDetail.linkGo" :disabled="true" auto-complete="off" placeholder=""></el-input>
                      </el-form-item>
                    </div>
                  </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from 'fetch/api'
import Cookies from 'js-cookie'
import {mapGetters} from 'vuex'

export default {
  name: 'CarouselHomeDetail',
  data () {
    return {
      bannerDetail: {},
      bannerOptions: [
        {
          value: 1,
          label: '首页轮播图'
        },
        {
          value: 2,
          label: '店铺详情轮播图'
        }
      ]
    }
  },

  computed: {
    ...mapGetters([
      'imageHead'
    ])
  },

  created() {
    this.init(this.$route.query.id)
  },

  methods: {
    init(id) {
      if (!id) return false

      api.getStoreAdvert({
        id: id
      }).then(res => {
        if (res.success) {
          const linkTypeArr = ['内容', '讲师', '营销']
          const data = res.data
          if (Number(data.linkType) === 4) {
            data.linkGo = linkTypeArr[0] + '/' + data.pageName
          } else {
            data.linkGo = linkTypeArr[data.linkType - 1] + '/' + data.pageName
          }
          this.bannerDetail = data
        }
      }).catch(er => {
        this.$message.error('加载出错啦!')
      })
    },

    goToEdit() {
      Cookies.remove('carouselDate')
      this.$router.push({
        path: 'carouselhomeedit',
        query: {
          id: this.$route.query.id
        }
      })
    },

    goback() {
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
    margin-top .2rem
.el-input
  width 6rem
.el-select
  width 4rem
.carousel-home-detail
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
    .topbat-edit
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
      padding .5rem 0
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
  p,i
    margin-right 6px
  span
    color #9B9B9B
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
        margin-bottom .14rem
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