<template>
    <div class="resource-ad">
        <div v-if="isActive == 4">
            <div class="head layout-head">
                <h3>广告轮播图</h3>
            </div>
            <div class="index-ad">
                <button class="head-r" @click="saveStoreAd(1)">保存</button>
                <h3 class="title">首页广告位设置</h3>
                <p class="tips">建议尺寸344*128，大小不超过2M，支持Jpg、Png格式。 <span style="color:#FF6767;">{{indexTips}}</span></p>
                <div class="image">
                    <div class="image-item" v-for="(item,index) of indexUrlList" :key="index" v-if="indexUrlList.length>0">
                        <img :src="item">
                        <i class="el-icon-close" @click="deleteIndexImg(index)"></i>
                        <!-- <p class="image-name">{{item.fileName}}</p>
                        <div class="sort">
                            <span>排序：</span>
                            <input type="number" v-model="item.sortNum">
                        </div> -->
                    </div>
                    <div id="index-upload" v-show="indexUrlList.length<3">
                        <i class="el-icon-plus"></i>
                        <p class="txt">上传照片</p>
                    </div>
                </div>
            </div>
            <div class="shop-ad">
                <button class="head-r" @click="saveStoreAd(2)">保存</button>
                <h3 class="title">店铺广告位设置</h3>
                <p class="tips">建议尺寸375*208，大小不超过2M，支持Jpg、Png格式。 <span style="color:#FF6767;">{{shopTips}}</span></p>
                <div class="image">
                    <div class="image-item shop-image-item" v-for="(item,index) of shopUrlList" :key="index" v-if="shopUrlList.length>0">
                        <img :src="item">
                        <i class="el-icon-close" @click="deleteShopImg(index)"></i>
                        <!-- <p class="image-name">{{item.fileName}}</p>
                        <div class="sort">
                            <span>排序：</span>
                            <input type="number">
                        </div> -->
                    </div>
                    <div id="shop-upload" v-show="shopUrlList.length<3">
                        <i class="el-icon-plus"></i>
                        <p class="txt">上传照片</p>
                    </div>
                </div>
            </div>
        </div>
        <no-active v-if="isActive == 3" @reFresh="getAdvertisementByType"></no-active>
    </div>
</template>

<script>
import api from 'fetch/api'
import {initQiniu} from 'assets/js/api'
import {mapGetters} from 'vuex'
import NoActive from 'components/common/NoActive'
export default {
  name: 'ResourceAd',
  data () {
    return {
      indexUrlList: [], // 首页广告数组
      shopUrlList: [], // 店铺广告数组

      indexUrlNoHead: [], // 保存时用到
      shopUrlNoHead: [], // 保存时用到

      indexTips: '', // 提示图片上传成功与否
      shopTips: '' // 提示图片上传成功与否
    }
  },
  created () {
    this.getAdvertisementByType()
  },
  components: {
    NoActive
  },
  computed: {
    ...mapGetters([
      'token',
      'uploadImageHead',
      'imageHead',
      'isActive'
    ])
  },
  mounted () {
    let that = this
    // 上传图片
    initQiniu('index-upload', 2, 'image/jpeg,image/jpg,image/png', (file, info) => {
      let newInfo = JSON.parse(info)
      that.indexUrlList.push(that.uploadImageHead + newInfo.key)
      that.indexUrlNoHead.push(newInfo.key)
      that.indexTips = '上传成功。'
    }, file => {
      if (file.isUpload === 1) {
        // that.progress = file.percent
      } else if (file.isUpload === 2) {
        that.indexTips = '文件大小超出范围！'
      } else {
        that.indexTips = '文件类型不正确！'
      }
    }, that.token)

    initQiniu('shop-upload', 2, 'image/jpeg,image/jpg,image/png', (file, info) => {
      let newInfo = JSON.parse(info)
      that.shopUrlList.push(that.uploadImageHead + newInfo.key)
      that.shopUrlNoHead.push(newInfo.key)
      that.shopTips = '上传成功。'
    }, file => {
      if (file.isUpload === 1) {
        // that.progress = file.percent
      } else if (file.isUpload === 2) {
        that.shopTips = '文件大小超出范围！'
      } else {
        that.shopTips = '文件类型不正确！'
      }
    }, that.token)
  },
  methods: {
    // 获取广告数组
    getAdvertisementByType () {
      let that = this
      that.indexTips = ''
      that.shopTips = ''
      that.indexUrlList = []
      that.shopUrlList = []
      that.indexUrlNoHead = []
      that.shopUrlNoHead = []
      api.getAdvertisementByType().then(res => {
        if (res.success) {
          let tempIndexArr = res.data.home
          if (tempIndexArr && tempIndexArr.length > 0) {
            for (var i = 0; i < tempIndexArr.length; i++) {
              that.indexUrlList.push(that.imageHead + tempIndexArr[i])
              that.indexUrlNoHead.push(tempIndexArr[i])
            }
          }
          let tempShopArr = res.data.store
          if (tempShopArr && tempShopArr.length > 0) {
            for (var j = 0; j < tempShopArr.length; j++) {
              that.shopUrlList.push(that.imageHead + tempShopArr[j])
              that.shopUrlNoHead.push(tempShopArr[j])
            }
          }
        }
      })
    },
    saveStoreAd (type) {
      let that = this
      if (type === 1) {
        if (that.indexUrlNoHead.length > 0) {
          api.saveStoreAd({
            advertisements: that.indexUrlNoHead,
            type: type
          }).then(res => {
            if (res.success) {
              that.getAdvertisementByType()
            }
          })
        } else {
          that.$message.error('图片不能少于1张！')
        }
      } else {
        if (that.shopUrlNoHead.length > 0) {
          api.saveStoreAd({
            advertisements: that.shopUrlNoHead,
            type: type
          }).then(res => {
            if (res.success) {
              that.getAdvertisementByType()
            }
          })
        } else {
          that.$message.error('图片不能少于1张！')
        }
      }
    },
    deleteIndexImg(index) {
      let that = this
      that.indexUrlList.splice(that.indexUrlList.findIndex((value, inx, arr) => inx === index), 1)
      that.indexUrlNoHead.splice(that.indexUrlNoHead.findIndex((value, inx, arr) => inx === index), 1)
    },
    deleteShopImg(index) {
      let that = this
      that.shopUrlList.splice(that.shopUrlList.findIndex((value, inx, arr) => inx === index), 1)
      that.shopUrlNoHead.splice(that.shopUrlNoHead.findIndex((value, inx, arr) => inx === index), 1)
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/varibles"

.resource-ad
    width 100%
    margin 0 auto
.index-ad,.shop-ad
    width 100%
    height 3.22rem
    background #fff
    border-radius .05rem
    margin-bottom .2rem
    padding .3rem
    position relative
    box-sizing border-box
    .head-r
        position absolute
        top .3rem
        right .4rem
        width .65rem
        height .28rem
        background $color-theme
        color #fff
        font-size .12rem
        border-radius .04rem
        cursor pointer
    .title,.tips
        height .2rem
        line-height .2rem
        font-size .14rem
        color #9B9B9B
        margin-bottom .2rem
        font-weight 600
    .tips
        font-weight 100
    .image
        display flex
        justify-content flex-start
        align-items center
        .image-item
            width 30%
            height 1.28rem
            border-radius .04rem
            margin-right .2rem
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
            .image-name
                height .2rem
                line-height .2rem
                color #9B9B9B
                font-size .14rem
                position absolute
                left 0
                bottom -0.3rem
            .sort
                position absolute
                right 0
                bottom -0.3rem
                width .8rem
                height .2rem
                display flex
                justify-content flex-start
                align-items center
                span
                    font-size .14rem
                    color #9B9B9B
                    line-height .2rem
                    height .2rem
                    width .42rem
                input
                    width .36rem
                    height .18rem
                    line-height .18rem
                    border-radius .05rem
                    border .01rem solid #E6E6E6
                    text-align center
                    font-size .14rem
                    color rgba(0,0,0,0.65)
        .shop-image-item
            height 1.8rem
        #index-upload,#shop-upload
            width 1.28rem
            height 1.28rem
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
        #shop-upload
            width 1.8rem
            height 1.8rem
.shop-ad
    height 4.16rem
    margin none
</style>
