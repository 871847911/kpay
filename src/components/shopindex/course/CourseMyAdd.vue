<template>
    <div class="course-my-add">
        <div class="head">
            <button class="btn-one" @click="back">
                <i class="iconfont icon-fanhui"></i>
                <span>返回</span>
            </button>
            <button class="btn-three" @click="audit" v-if="auditFlag && (status == 10 || status == 30)">提交审核</button>
            <button class="btn-three" @click="updateCourseStatus($route.query.id, 50)" v-if="status == 40 && $route.query.id">下架</button>
            <button class="btn-three" @click="updateCourseStatus($route.query.id, 40)" v-if="status == 50 && $route.query.id">上架</button>
            <button class="btn-two" @click="save">保存</button>
        </div>
        <div class="content">
            <h2>添加课程</h2>
            <div id="content-box">
                <div class="content-basic">
                    <h3>基本信息</h3>
                    <div class="content-one">
                        <div class="title">
                            <h4>课程标题</h4>
                            <el-input placeholder="30字以内的中文，数字和英文" v-model="courseName" maxlength="30"></el-input>
                        </div>
                        <div class="author">
                            <h4>课程作者</h4>
                            <el-input placeholder="此处默认带出当前生产者姓名" v-model="createUser"></el-input>
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
                            <el-input type="number" placeholder="整数价格" v-model.number="price"></el-input>
                            <span class="unit">元</span>
                            <span>*填写0元则代表该课程免费</span>
                        </div>
                    </div>
                </div>
                <div class="content-body">
                    <h3>课程正文</h3>
                    <div class="content-six">
                        <div class="title">
                            <span class="course-type">课程类型</span>
                            <el-radio-group v-model="radio" class="course-radio" text-color="#1AA97B" @change="radioChange">
                                <el-radio label="img">图文</el-radio>
                                <el-radio label="audio">音频</el-radio>
                                <el-radio label="video" :disabled="putong">视频</el-radio>
                            </el-radio-group>
                            <a class="upload-methods" href="https://note.youdao.com/share/?id=f6ec5857fb603ced46d199aaf79d7d42&type=note#/" target="_blank"><i class="iconfont">&#xe619;</i>上传视频须知</a>
                        </div>
                        <div class="upload" v-show="radio!='img'">
                            <div class="upload-left" v-show="radio=='audio'">
                                <div style="width:100%;marginBottom:20px;">
                                  <el-input v-model="subName" placeholder="请输入音频标题" maxlength="24"></el-input>
                                </div>
                                <span class="tips" v-if="audioProgress==0 && !audioName">
                                    <i class="el-icon-upload"></i>支持扩展名：{{fileType}} 大小：不超过{{fileSize}}M。<span class="other-tips">{{subTips}}</span>
                                </span>
                                <div v-else class="file-info">
                                    <p class="audio-img">
                                        <i class="iconfont icon-mp"></i>
                                    </p>
                                    <span class="name">{{audioName}}</span>
                                    <el-progress :percentage="audioProgress" color="#1AA97B" v-if="audioProgress!=100 && audioProgress!=0"></el-progress>
                                </div>
                            </div>
                            <div class="upload-left" v-show="radio=='video'">
                                <div style="width:100%;marginBottom:20px;">
                                  <el-input v-model="subName" placeholder="请输入视频标题" maxlength="24"></el-input>
                                </div>
                                <span class="tips" v-if="videoProgress==0 && !videoName">
                                    <i class="el-icon-upload"></i>支持扩展名：{{fileType}} 大小：不超过{{fileSize}}M。<span class="other-tips">{{subTips}}</span>
                                </span>
                                <div v-else class="file-info">
                                    <p class="video-img">
                                        <i class="iconfont icon-bofang"></i>
                                    </p>
                                    <span class="name">{{videoName}}</span>
                                    <el-progress :percentage="videoProgress" color="#1AA97B" v-if="videoProgress!=100 && videoProgress!=0"></el-progress>
                                </div>
                            </div>
                            <div class="upload-right" v-show="radio=='audio'">
                                <button class="upload-btn" id="uploadAudio" v-show="audioProgress==0 && !audioName">上传文件</button>
                                <div class="mask" v-if="audioProgress==100 || audioName" @click="deleteAudio"></div>
                                <div class="mask" v-if="audioProgress>0&&audioProgress<100"></div>
                                <button class="upload-finish" v-if="audioProgress==100 || audioName">删除</button>
                            </div>
                            <div class="upload-right" v-show="radio=='video'">
                                <button class="upload-btn" id="uploadVideo" v-show="videoProgress==0 && !videoName">上传文件</button>
                                <div class="mask" v-if="videoProgress==100 || videoName" @click="deleteVideo"></div>
                                <div class="mask" v-if="videoProgress>0&&videoProgress<100"></div>
                                <button class="upload-finish" v-if="videoProgress==100 || videoName">删除</button>
                            </div>
                        </div>
                        <div v-show="radio=='img'" class='editor'>
                            <div style="width:100%;marginBottom:20px;">
                              <el-input v-model="subName" placeholder="请输入图文标题" maxlength="24"></el-input>
                            </div>
                            <quill-editor @change="editorValue" :editorValue="editorHtml"></quill-editor>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {conver, initQiniu} from 'assets/js/api'
import QuillEditor from 'components/common/Quilleditor'
import QuillEditorTwo from 'components/common/QuilleditorTwo'
import api from 'fetch/api'
import {mapGetters} from 'vuex'
export default {
  name: 'CourseMyAdd',
  data () {
    return {
      courseId: '', // 课程id
      imageUrl: [], // 图片数组
      imageNoHead: [], // 图片不带前缀的key数组
      audioUrl: '', // 音频Url
      videoUrl: '', // 视频Url

      audioName: '', // 音频名字
      videoName: '', // 视频名字

      audioProgress: 0, // 音频上传进度
      videoProgress: 0, // 视频上传进度

      tips: '', // 图片上传状态提示
      radio: 'img', // 默认上传图文
      progress: '', // 上传图片进度
      editorHtml: '', // 富文本的值
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
      subType: 1, // 正文类型 1--图文 2--音频 3--视频
      courseSubList: [], // 课程正文
      // 非结构
      fileName: '', // 非结构正文名称
      subUrlSize: '', // 音频视频文件大小
      subId: '', // 课时id
      status: '', // 课程状态
      subTips: '', // 视频音频上传失败提示！
      auditFlag: true, // 是否显示提交审核按钮
      subName: '' // 图文音频和视频标题
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
    QuillEditor,
    QuillEditorTwo
  },
  computed: {
    ...mapGetters([
      'token',
      'uploadImageHead',
      'imageHead',
      'roleId'
    ]),
    putong() {
      return this.$store.state.share.classData.putong
    },
    fileType () {
      if (this.radio === 'audio') {
        return '.mp3'
      } else {
        return '.mp4'
      }
    },
    fileSize () {
      if (this.radio === 'audio') {
        return 20
      } else {
        return 500
      }
    }
  },

  mounted () {
    var that = this
    // 上传音频
    initQiniu('uploadAudio', 20, 'audio/mp3,video/3gpp', (file, info) => {
      that.subUrlSize = conver(file.size)
      let newInfo = JSON.parse(info)
      that.audioUrl = newInfo.key
      that.audioName = file.name
    }, file => {
      if (file.isUpload === 1) {
        that.audioProgress = file.percent
      } else if (file.isUpload === 2) {
        that.audioUrl = ''
        that.audioProgress = 0
        that.audioName = ''
        that.subTips = '文件大小超出范围'
      } else {
        that.audioUrl = ''
        that.audioProgress = 0
        that.audioName = ''
        that.subTips = '文件类型不正确！'
      }
    }, that.token)

    // 上传视频
    initQiniu('uploadVideo', 500, 'video/mp4', (file, info) => {
      that.subUrlSize = conver(file.size)
      let newInfo = JSON.parse(info)
      that.videoUrl = newInfo.key
      that.videoName = file.name
    }, file => {
      if (file.isUpload === 1) {
        that.videoProgress = file.percent
      } else if (file.isUpload === 2) {
        that.videoUrl = ''
        that.videoProgress = 0
        that.videoName = ''
        that.subTips = '文件大小超出范围'
      } else {
        that.videoUrl = ''
        that.videoProgress = 0
        that.videoName = ''
        that.subTips = '文件类型不正确！'
      }
    }, that.token)

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
    updateCourseStatus (id, status) {
      let that = this
      api.updateCourseStatus({
        id: id,
        status: status
      }).then(res => {
        if (res.success) {
          if (status === 50) {
            that.$message.success('课程下架成功。')
          }
          if (status === 40) {
            that.$message.success('课程上架成功。')
          }
          that.$router.push(`/index/coursemydetail${id}`)
        } else {
          that.$message.error('更改课程状态失败！')
        }
      })
    },
    // 通过获取用户角色来显示隐藏提交审核按钮
    getBaseInfo (id) {
      let that = this
      if (id) {
        that.courseId = that.$route.query.id
        that.getCourseCatalog()
        that.getCourseDetail(that.$route.query.id)
      } else {
        this.courseType = 1
        this.getCourseCatalog()
        api.getBaseInfo().then(res => {
          if (res.success) {
            that.createUser = res.data.realName
            if (that.roleId === 2) {
              that.status = 10
            }
            if (that.roleId === 1) {
              that.status = 50
              that.auditFlag = false
            }
          }
        })
      }
    },
    // 提交审核
    // updateCourseStatus(id, status) {
    //   let that = this
    //   api.updateCourseStatus(that.token, {
    //     id: id,
    //     status: status
    //   }).then(res => {
    //     if (res.success) {
    //       that.$router.push(`/index/coursemydetail${id}`)
    //     } else {
    //       that.$message.error('提交审核失败！')
    //     }
    //   })
    // },
    // 获取课程分类
    getCourseCatalog () {
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
        }
      })
    },
    // 删除当前音频
    deleteAudio () {
      this.audioUrl = ''
      this.audioProgress = 0
      this.audioName = ''
    },
    // 删除当前视频
    deleteVideo() {
      this.videoUrl = ''
      this.videoProgress = 0
      this.videoName = ''
    },
    changeCatelog (val) {
      this.catelogId = val
      this.isCatalogOne = false
      this.catelogIdTwo = this.catalogNameTwo = ''
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
          that.subUrlSize = data.fileSize
          that.status = data.status
          that.catalogNameTwo = data.catalogSecondName
          that.catelogIdTwo = data.catalogSecondId

          if (data.introduction) {
            that.editorHtmlTwo = data.introduction
          }
          if (!that.subType || parseInt(that.subType) === 1) {
            that.radio = 'img'
          } else if (parseInt(that.subType) === 2) {
            that.radio = 'audio'
          } else {
            that.radio = 'video'
          }
          if (data.courseUrlList) {
            that.imageNoHead = data.courseUrlList
            let imageArr = data.courseUrlList
            for (var i = 0; i < imageArr.length; i++) {
              that.imageUrl.push(that.imageHead + imageArr[i])
            }
          }
          that.courseSubList = data.courseSubList
          if (data.courseSubList.length > 0) {
            that.subId = that.courseSubList[0].id
            that.subType = that.courseSubList[0].subType
            that.subName = data.courseSubList[0].subName

            if (that.subType === 1) {
              that.editorHtml = that.courseSubList[0].context
            } else if (that.subType === 2) {
              that.radio = 'audio'
              that.audioName = that.courseSubList[0].fileName
              that.audioUrl = that.courseSubList[0].subUrl
            } else {
              that.radio = 'video'
              that.videoName = that.courseSubList[0].fileName
              that.videoUrl = that.courseSubList[0].subUrl
            }
          }
        }
      })
    },
    save () {
      this.judge().then(res => {
        this.saveCourseMain()
      })
    },
    audit () {
      this.judge().then(res => {
        this.auditCourseMain()
      })
    },
    // 判断
    judge() {
      let that = this
      const reg = /^([1-9]\d*|0)(\.\d{1,2})?$/

      return new Promise(resolve => {
        if (!that.courseName) {
          that.$message.error('课程标题不能为空！')
        } else if (!that.createUser) {
          that.$message.error('课程作者不能为空！')
        } else if (!that.catelogId) {
          that.$message.error('课程分类不能为空！')
        } else if (!that.catelogIdTwo && that.catelogListTwo.length > 0) {
          that.$message.error('课程二级分类不能为空！')
        } else if (!that.editorHtmlTwo) {
          that.$message.error('课程简介不能为空！')
        } else if (that.imageNoHead.length <= 0) {
          that.$message.error('课程封面需至少上传一张图片！')
        } else if (!reg.test(that.price)) {
          that.$message.error('请正确输入课程价格！')
        } else if (!that.subName) {
          if (that.subType === 1) {
            that.$message.error('请填写图文标题！')
          } else if (that.subType === 2) {
            that.$message.error('请填写音频标题！')
          } else if (that.subType === 3) {
            that.$message.error('请填写视频标题！')
          } else {
            resolve(true)
          }
        } else {
          resolve(true)
        }
      })
    },
    saveCourseMain () {
      let uploadUrl = ''
      let fileName = ''
      if (this.subType === 2) {
        uploadUrl = this.audioUrl
        fileName = this.audioName
        this.editorHtml = ''
      }
      if (this.subType === 3) {
        uploadUrl = this.videoUrl
        fileName = this.videoName
        this.editorHtml = ''
      }

      let that = this
      api.saveCourseMain({
        id: that.courseId,
        subType: that.subType,
        courseName: that.courseName,
        createUser: that.createUser,
        catalogId: that.catelogId,
        catalogSecondId: that.catelogIdTwo,
        introduction: that.editorHtmlTwo,
        courseUrlList: that.imageNoHead,
        price: that.price,
        subUrl: uploadUrl,
        context: that.editorHtml,
        fileSize: that.subUrlSize,
        courseType: that.courseType,
        subId: that.subId,
        fileName: fileName,
        subName: that.subName,
        status: that.status
      }).then(res => {
        if (res.success) {
          if (res.data.isShow) {
            that.$message.error('由于课程价格变动，首页展示功能需手动开启！')
          }
          if (that.courseId) {
            that.$router.push(`/index/coursemydetail${that.courseId}`)
          } else {
            that.$router.push(`/index/coursemydetail${res.data.id}`)
          }
        } else {
          that.$message.error(res.message)
        }
      })
    },
    auditCourseMain () {
      let uploadUrl = ''
      let fileName = ''
      if (this.subType === 2) {
        uploadUrl = this.audioUrl
        fileName = this.audioName
        this.editorHtml = ''
      }
      if (this.subType === 3) {
        uploadUrl = this.videoUrl
        fileName = this.videoName
        this.editorHtml = ''
      }
      let that = this
      api.saveCourseMain({
        id: that.courseId,
        subType: that.subType,
        courseName: that.courseName,
        createUser: that.createUser,
        catalogId: that.catelogId,
        catalogSecondId: that.catelogIdTwo,
        introduction: that.editorHtmlTwo,
        courseUrlList: that.imageNoHead,
        price: that.price,
        subUrl: uploadUrl,
        context: that.editorHtml,
        fileSize: that.subUrlSize,
        courseType: that.courseType,
        subId: that.subId,
        fileName: fileName,
        subName: that.subName,
        status: that.status
      }).then(res => {
        if (res.success) {
          if (res.data.isShow) {
            that.$message.error('由于课程价格变动，首页展示功能需手动开启！')
          }
          if (that.courseId) {
            that.updateCourseStatus(that.courseId, 20)
          } else {
            that.updateCourseStatus(res.data.id, 20)
          }
        } else {
          if (res.message) {
            that.$message(res.message)
          } else {
            that.$message.error('提交审核失败！')
          }
        }
      })
    },
    editorValue(val) {
      this.editorHtml = val
    },
    editorValueTwo(val) {
      this.editorHtmlTwo = val
    },
    radioChange () {
      if (this.radio === 'img') {
        this.subType = 1
        this.subName = ''
      } else if (this.radio === 'audio') {
        this.subType = 2
        this.subTips = this.subName = ''
      } else {
        this.subType = 3
        this.subTips = this.subName = ''
      }
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

.course-my-add
  width 100%
  margin 0 auto
  >>>.el-select, >>>.el-input
    width 4rem
.head
  height .4rem
  width 100%
  display flex
  align-items center
  margin 0 auto .1rem
  position relative
  .btn-one
    cursor pointer
    position absolute
    left 0
    height .28rem
    line-height .28rem
    font-size .2rem
    color #9B9B9B
    background-color transparent
    .iconfont
      font-size .2rem
  .btn-two
    cursor pointer
    height .4rem
    line-height .4rem
    box-sizing border-box
    color #4A4A4A
    border-color #E6E6E6
    background #FFFFFF
    font-size .12rem
    width .82rem
    border-radius .04rem
    position absolute
    right 0
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
    right .92rem
    top 0
.content
  min-height 12.41rem
  border-radius .05rem
  background #fff
  margin 0 auto
  width 100%
  padding .24rem .24rem .4rem 0.24rem
  box-sizing border-box
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
    margin 0 auto
    h3
      height .2rem
      line-height .2rem
      font-size .14rem
      color $color-theme
      font-weight 600
      margin-bottom .2rem
    .content-one,.content-two,.content-three,.content-five
      display flex
      height auto
      justify-content flex-start
      align-items center
      margin-bottom .2rem
      >div:not(:first-child)
        margin-left .4rem
      .title,.author,.desc
        width 4rem
        box-sizing border-box
        h4
          font-size .14rem
          height .22rem
          line-height .22rem
          color #4A4A4A
          margin-bottom .05rem
        input,textarea
          width 4rem
          box-sizing border-box
          height .32rem
          line-height .32rem
          font-size .14rem
          color #4A4A4A
          border .01rem solid rgba(0,0,0,0.15)
          padding-left .12rem
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
        margin-bottom 5px
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
          width 3.17rem
        span
          height .32rem
          line-height .32rem
          font-size .14rem
          color #9B9B9B
          margin-right .3rem
        .unit
          color rgba(0,0,0,0.85)
  .content-body
    h3
      margin: .6rem 0 .2rem 0;
    .content-six
      .title
        height 100%
        display flex
        justify-content flex-start
        align-items center
        margin-bottom .3rem
        .course-type
          width .8rem
          font-size .14rem
          height .22rem
          line-height .22rem
          color #4A4A4A
        .course-radio
          height .22rem
          line-height .22rem
          display flex
          justify-content flex-start
          align-items center
        .upload-methods
          display block
          font-size .14rem
          color #9B9B9B
          margin-left .2rem
          cursor pointer
          .iconfont
            font-size .14rem
      .upload
        display flex
        justify-content space-between
        align-items flex-end
        .upload-right
          width 1rem
          height .4rem
          position relative
          .upload-btn,.upload-finish
            cursor pointer
            width 100%
            border-radius .2rem
            background $color-theme
            fontCenter(.4rem)
            font-size .14rem
            color #fff
          .mask
            cursor pointer
            width 1.2rem
            height .6rem
            position absolute
            left 50%
            top 50%
            margin-left -0.6rem
            margin-top -0.3rem
            background rgba(0, 0, 0, 0)
            z-index 99
        .upload-left
          flex-grow 1
          display flex
          flex-direction column
          align-items flex-start
          justify-content center
          .tips
            height .17rem
            line-height .17rem
            color #999999
            font-size .12rem
            .el-icon-upload
              font-size .12rem
              color #979797
              margin-right .1rem
            .other-tips
              color #FF6767
          .file-info
            height .4rem
            display flex
            justify-content flex-start
            align-items center
            .audio-img
              height .4rem
              border-radius 50%
              width .4rem
              margin-right .1rem
              .iconfont
                flex()
                border-radius 50%
                width 0.44rem
                height 0.44rem
                background #fafaFa
                font-size 19px
                color #AEB8BE
            .video-img
              height .4rem
              width .64rem
              display block
              margin-right .1rem
              border-radius 0
              .iconfont
                flex()
                border-radius 50%
                width 0.44rem
                height 0.44rem
                background #fafaFa
                font-size 19px
                color #AEB8BE
            .name
              height .4rem
              line-height .4rem
              font-size .12rem
              color #4A4A4A
      .editor
        min-height 3.26rem
        width 8.45rem
</style>
