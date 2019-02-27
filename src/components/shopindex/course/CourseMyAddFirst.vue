<template>
    <div class="course-my-add-first">
        <div class="head">
            <button class="btn-one" @click="back">
                <i class="iconfont icon-fanhui"></i>
                <span>返回</span>
            </button>
        </div>
        <div class="content">
            <h2>添加课程</h2>
            <div id="content-box">
                <div class="content-basic">
                    <h3>基本信息</h3>
                    <div class="content-one">
                        <div class="title">
                            <h4>课程标题</h4>
                            <input type="text" placeholder="30字以内的中文，数字和英文" v-model="courseName" maxlength="30">
                        </div>
                        <div class="author">
                            <h4>课程作者</h4>
                            <input type="text" placeholder="此处默认带出当前生产者姓名" v-model="createUser">
                        </div>
                    </div>
                    <div class="content-two">
                        <div class="title search">
                            <h4>一级分类</h4>
                            <el-select v-model="catalogName" placeholder="请选择" @change="changeCatelog">
                                <el-option
                                    v-for="item in catelogList"
                                    :key="item.value"
                                    :label="item.label"
                                    :value="item.value">
                                </el-option>
                            </el-select>
                        </div>
                        <div class="title search" v-show="isCatalogOne">
                            <h4>二级分类</h4>
                            <el-select v-model="catalogNameTwo" placeholder="请选择" @change="changeCatelogTwo">
                                <el-option
                                    v-for="item in catelogListTwo"
                                    :key="item.id"
                                    :label="item.name"
                                    :value="item.id">
                                </el-option>
                            </el-select>
                        </div>
                    </div>
                    <div class="content-three">
                        <div class="desc">
                            <h4>课程简介</h4>
                            <div class='editor'>
                              <quill-editor-two @change="editorValueTwo" :editorValue="editorHtmlTwo"></quill-editor-two>
                            </div>
                            <div style="clear:both;"></div>
                        </div>
                    </div>
                    <div class="content-four">
                        <h4>课程封面</h4>
                        <p class="tips">建议尺寸800*500，大小不超过2M，支持Jpg、Png格式。<span>{{tips}}</span></p>
                        <div class="image">
                            <div class="image-item" v-for="(item,index) of imageUrl" :key="index" v-if="imageUrl.length>0">
                                <img :src="item">
                                <i class="el-icon-close" @click="deleteImg(index)"></i>
                            </div>
                            <div id="pickfiles" v-show="imageUrl.length<3">
                                <i class="el-icon-plus"></i>
                                <p class="txt">上传照片</p>
                            </div>
                        </div>
                    </div>
                    <div class="content-five">
                        <div class="title">
                            <h4>设置价格</h4>
                            <input type="number" placeholder="整数价格" v-model="price">
                            <span class="unit">元</span>
                            <span>*填写0元则代表该课程免费</span>
                        </div>
                    </div>
                </div>
                <div class="next" @click="save">下一步：课程正文</div>
            </div>
        </div>
    </div>
</template>

<script>
import {initQiniu} from 'assets/js/api'
import QuillEditorTwo from 'components/common/QuilleditorTwo'
import api from 'fetch/api'
import {mapGetters} from 'vuex'
export default {
  name: 'CourseMyAddFirst',
  data () {
    return {
      courseId: '', // 课程id
      imageUrl: [], // 图片数组
      imageNoHead: [], // 图片不带前缀的key数组
      tips: '', // 图片上传状态提示
      progress: '', // 上传图片进度
      editorHtmlTwo: '', // 课程简介
      courseType: '', // 课程结构
      courseInfo: '', // 课程信息
      courseName: '', // 课程名称
      createUser: '', // 课程作者
      catalogName: '', // 课程分类值
      catelogList: [], // 课程分类数组(下拉菜单选项内容)
      catelogId: '', // 课程分类id
      catalogNameTwo: '', // 二级分类值
      catelogListTwo: [], // 二级分类数组
      catelogIdTwo: '', // 二级分类id
      isCatalogOne: false,
      price: 0, // 课程价格
      status: '' // 课程状态
    }
  },
  created () {
    if (this.$route.query.id) {
      this.getBaseInfo(this.$route.query.id)
    } else {
      this.getBaseInfo()
    }
  },
  components: {
    QuillEditorTwo
  },
  computed: {
    ...mapGetters([
      'token',
      'uploadImageHead',
      'imageHead',
      'roleId'
    ])
  },

  mounted () {
    var that = this
    // 上传图片
    initQiniu('pickfiles', 2, 'image/jpeg,image/jpg,image/png', (file, info) => {
      let newInfo = JSON.parse(info)
      that.imageUrl.push(that.uploadImageHead + newInfo.key)
      that.imageNoHead.push(newInfo.key)
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

  methods: {
    // 通过获取用户角色来显示隐藏提交审核按钮
    getBaseInfo (id) {
      let that = this
      api.getBaseInfo().then(res => {
        if (res.success) {
          if (id) {
            that.courseId = id
            that.getCourseCatalog(id)
          } else {
            that.createUser = res.data.realName
            that.courseType = 2
            that.getCourseCatalog()
            if (that.roleId === 1) {
              that.status = 50
            } else {
              that.status = 10
            }
          }
        }
      })
    },
    // 获取课程分类
    getCourseCatalog (id) {
      let that = this
      api.getCourseCatalog().then(res => {
        if (res.success) {
          let cateList = res.data
          cateList.forEach(function(item) {
            that.catelogList.push({
              value: item.id,
              label: item.name
            })
          })
          if (id) {
            that.getCourseDetail(id)
          }
        }
      })
    },
    changeCatelog (val) {
      this.catelogId = val
      this.isCatalogOne = false
      this.catalogNameTwo = ''
      this.catelogListTwo = []

      this.findSecondCatalogName(val)
    },
    // 请求分类二列表
    findSecondCatalogName(val) {
      api.findSecondCatalogName({
        id: val
      }).then(res => {
        if (res.data && res.data.length > 0) {
          this.catelogListTwo = res.data
          this.isCatalogOne = true
        }
      })
    },
    // 改变所选分类id
    changeCatelogTwo(val) {
      this.catelogIdTwo = val
    },
    getCourseDetail (id) {
      let that = this
      api.getCourseDetail({
        id: id
      }).then(res => {
        if (res.success) {
          let data = res.data

          this.findSecondCatalogName(data.catalogId)

          that.courseName = data.courseName
          that.createUser = data.createUser
          that.catalogName = data.catalogName
          that.catelogId = data.catalogId
          that.courseType = data.courseType
          that.price = data.price
          that.status = data.status

          that.catalogNameTwo = data.catalogSecondName
          that.catelogIdTwo = data.catalogSecondId

          if (data.introduction) {
            that.editorHtmlTwo = data.introduction
          }
          if (data.courseUrlList) {
            that.imageNoHead = data.courseUrlList
            let imageArr = data.courseUrlList
            for (var i = 0; i < imageArr.length; i++) {
              that.imageUrl.push(that.imageHead + imageArr[i])
            }
          }
        }
      })
    },
    save() {
      let that = this
      if (that.catelogId) {
        if (that.editorHtmlTwo) {
          if (that.imageNoHead.length > 0) {
            that.saveCourseMain()
          } else {
            that.$message.error('课程封面需至少上传一张图片！')
          }
        } else {
          that.$message.error('课程简介不能为空！')
        }
      } else {
        that.$message.error('课程分类不能为空！')
      }
    },
    saveCourseMain () {
      let that = this
      api.saveCourseMain({
        id: that.courseId,
        courseName: that.courseName,
        createUser: that.createUser,
        catalogId: that.catelogId,
        catalogSecondId: that.catelogIdTwo,
        introduction: that.editorHtmlTwo,
        courseUrlList: that.imageNoHead,
        price: that.price,
        courseType: that.courseType,
        status: that.status
      }).then(res => {
        if (res.success) {
          if (res.data.isShow) {
            that.$message.error('由于课程价格变动，首页展示功能需手动开启！')
          }
          if (that.courseId) {
            this.$router.push({
              name: 'CourseMyAddSecond',
              query: {
                id: that.courseId
              }
            })
          } else {
            this.$router.push({
              name: 'CourseMyAddSecond',
              query: {
                id: res.data.id
              }
            })
          }
        } else {
          if (res.message) {
            that.$message.error(res.message)
          } else {
            that.$message.error('保存课程基本信息失败！')
          }
        }
      })
    },
    editorValueTwo(val) {
      this.editorHtmlTwo = val
    },
    deleteImg(index) {
      let that = this
      that.imageUrl.splice(that.imageUrl.findIndex((value, inx, arr) => inx === index), 1)
      that.imageNoHead.splice(that.imageNoHead.findIndex((value, inx, arr) => inx === index), 1)
    },
    handleCommand(command) {
      this.$message('click on item ' + command)
    },
    back () {
      this.$router.back()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
.course-my-add-first
  width 100%
  margin 0 auto
  >>>.el-select, >>>.el-input
    width 4rem
.head
  height .4rem
  width 100%
  margin 0 auto .1rem
  position relative
  .btn-one
    cursor pointer
    position absolute
    left 0
    bottom 50%
    margin-bottom -0.14rem
    height .28rem
    line-height .28rem
    font-size .2rem
    color #9B9B9B
    background transparent
    .iconfont
      font-size .2rem
  .btn-two
    cursor pointer
    height .4rem
    line-height .4rem
    box-sizing border-box
    background #fff
    color $color-theme
    font-size .12rem
    border .01rem solid $color-theme
    width .82rem
    border-radius .04rem
    position absolute
    right .87rem
    top 0
  .btn-three
    cursor pointer
    height .4rem
    line-height .4rem
    background $color-theme
    color #fff
    font-size .12rem
    width .82rem
    border-radius .04rem
    position absolute
    right 0
    top 0
.content
  border-radius .05rem
  background #fff
  width 100%
  box-sizing border-box
  padding .24rem .24rem .4rem .24rem
  h2
    height .25rem
    line-height .25rem
    font-size .18rem
    color #4A4A4A
    margin-bottom .18rem
#content-box
  border-top .01rem solid #E6E6E6
  padding-top .24rem
  .content-basic,.content-body
    width 10rem
    margin 0 auto .5rem
    h3
      height .2rem
      line-height .2rem
      font-size .14rem
      color $color-theme
      font-weight 600
      margin-bottom .2rem
    .content-one,.content-two,.content-three,.content-five
      display flex
      justify-content flex-start
      // justify-content space-between
      align-items center
      margin-bottom .2rem
      >div:not(:first-child)
        margin-left .4rem
      .title,.author,.desc
        width 4rem
        box-sizing border-box
        height auto
        h4
          font-size .14rem
          height .22rem
          line-height .22rem
          color #4A4A4A
          margin-bottom .05rem
        input,textarea
          width 4rem
          box-sizing border-box
          height .4rem
          line-height .4rem
          font-size .14rem
          color #4A4A4A
          border .01rem solid rgba(0,0,0,0.15)
          padding 0 0.15rem
          placeholderStyle()
          border-radius .04rem
      .desc
        width 100%
        height auto
        .editor
          min-height 3.26rem
          width 8.45rem
    .content-four
      display flex
      flex-direction column
      justify-content flex-start
      align-items flex-start
      margin-bottom .2rem
      h4
        font-size .14rem
        height .22rem
        line-height .22rem
        color #4A4A4A
        margin-bottom .02rem
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
            border .01rem dashed $color-theme
          .el-icon-plus
            margin 0 0 .14rem
            font-size .24rem
            color rgba(0,0,0,0.45)
          .txt
            font-size .14rem
            fontCenter(.22rem)
            color rgba(0,0,0,0.65)
    .content-five
      .title
        width 11.4rem
        input
          width 4rem
        span
          height .32rem
          line-height .32rem
          font-size .14rem
          color #9B9B9B
          margin-right .3rem
        .unit
          color rgba(0,0,0,0.85)
  .next
    width 1.4rem
    height .4rem
    border-radius .04rem
    text-align center
    line-height .4rem
    font-size 14px
    color #fff
    background $color-theme
    margin 0 auto
    cursor pointer
</style>
