<template>
    <div class="course-my-add-second">
        <div class="head">
            <button class="btn-one" @click="back">
                <i class="iconfont icon-fanhui"></i>
                <span>返回</span>
            </button>
            <button class="btn-three" @click="updateCourseStatus(courseId, 20)" v-if="auditFlag && (status == 10 || status == 30)">提交审核</button>
            <button class="btn-three" @click="updateCourseStatus(courseId, 50)" v-if="status == 40">下架</button>
            <button class="btn-three" @click="updateCourseStatus(courseId, 40)" v-if="status == 50">上架</button>
        </div>
        <div class="content">
            <h2>添加课程</h2>
            <div id="content-box">
                <div class="content-body">
                    <h3>课程正文</h3>
                    <p class="create-course-tips" v-if="tipsFlag">
                        <i class="el-icon-warning" style="color:#FFAA00;margin-left:.16rem;margin-right:.1rem;"></i>如需更换课时类型，请先删除已添加的课时！
                    </p>
                    <div class="content-six">
                        <div class="title">
                            <span class="course-type">正文类型</span>
                            <el-radio-group v-model="radio" class="course-radio" text-color="#1AA97B" @change="radioChange">
                                <el-radio label="img">图文</el-radio>
                                <el-radio label="audio">音频</el-radio>
                                <el-radio label="video" :disabled="mulu">视频</el-radio>
                            </el-radio-group>
                            <a class="upload-methods" href="https://note.youdao.com/share/?id=f6ec5857fb603ced46d199aaf79d7d42&type=note#/" target="_blank"><i class="iconfont">&#xe619;</i>上传视频须知</a>
                            <button class="create-btn" @click="createCourse">创建课时</button>
                        </div>
                    </div>
                    <ul class="content-main">
                        <li class="main-img" v-for="(item, index) of courseSubList" v-if="realSubType == 1" :key="item.id">
                            <div class="img-name">
                                <div class="img-l" @click="editImg(item.subName, item.context, item.id)">
                                    <span class="img-l-num">{{index+1}}</span>
                                    <span class="img-l-name">{{item.subName}}</span>
                                </div>
                                <div class="img-r">
                                    <i class="iconfont icon-lajitong-" @click="deletCourseSub(item.id)"></i>
                                </div>
                            </div>
                        </li>
                        <li class="main-audio" v-if="realSubType == 2" v-for="(item, index) of courseSubList" :key="item.id">
                            <div class="audio-name">
                                <div class="img-l">
                                    <span class="img-l-num">{{index+1}}</span>
                                    <span class="img-l-name">{{item.subName}}</span>
                                </div>
                                <div class="img-r" @click="showHide(index)" ref="arrow">
                                    <i class="iconfont">&#xe606;</i>
                                </div>
                            </div>
                            <div class="audio-body" ref="child">
                                <div class="body-l" @click="editAudio(item.subName, item.fileName, item.id)">
                                    <p class="body-l-num">
                                        <i class="iconfont">&#xe62d;</i>
                                    </p>
                                    <span class="body-l-name">{{item.fileName}}</span>
                                </div>
                                <div class="body-r">
                                    <i class="iconfont icon-lajitong-" @click="deletCourseSub(item.id)"></i>
                                </div>
                            </div>
                        </li>
                        <li class="main-video" v-if="realSubType == 3" v-for="(item, index) of courseSubList" :key="item.id">
                            <div class="audio-name">
                                <div class="img-l">
                                    <span class="img-l-num">{{index+1}}</span>
                                    <span class="img-l-name">{{item.subName}}</span>
                                </div>
                                <div class="img-r" @click="showHide(index)" ref="arrow">
                                    <i class="iconfont">&#xe606;</i>
                                </div>
                            </div>
                            <div class="audio-body" ref="child">
                                <div class="body-l" @click="editVideo(item.subName, item.fileName, item.id)">
                                    <p class="body-l-num body-l-num-video">
                                        <i class="iconfont">&#xe62e;</i>
                                    </p>
                                    <span class="body-l-name">{{item.fileName}}</span>
                                </div>
                                <div class="body-r">
                                    <i class="iconfont icon-lajitong-" @click="deletCourseSub(item.id)"></i>
                                </div>
                            </div>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

        <!-- 图文 -->
        <el-dialog
            title="添加课程"
            :visible.sync="imgDialogVisible"
            width="10rem"
            class="editor-dialog"
            :show-close="false">
            <p class="list-name">目录名称</p>
            <input type="text" class="list-name-input" v-model="subImgName">
            <quill-editor @change="editorValue" :editorValue="editorHtml" class="editor"></quill-editor>
            <span slot="footer" class="dialog-footer">
                <el-button @click="imgDialogVisible = false">取消</el-button>
                <el-button type="primary" @click="saveCourseImg">保存</el-button>
            </span>
        </el-dialog>

        <!-- 音频 -->
        <div class="audio-dialog" v-show="audioDialogVisible">
            <div class="audio">
                <p class="close"><i class="icon-cha iconfont" @click="cancelAudio"></i></p>
                <p class="add-course">添加课程</p>
                <p class="list-name">目录名称</p>
                <input type="text" v-model="subAudioName">
                <div class="upload">
                    <p class="upload-tips" v-if="audioProgress==0 && !audioName">
                        <i class="el-icon-upload"></i>支持扩展名：.mp3 大小：不超过20M。<span style="color:#FF6767">{{subTips}}</span>
                    </p>
                    <div v-else class="file-info">
                        <p class="audio-img">
                            <i class="iconfont">&#xe62d;</i>
                        </p>
                        <span class="name">{{audioName}}</span>
                        <el-progress :percentage="audioProgress" color="#1AA97B" v-if="audioProgress!=100 && audioProgress!=0"></el-progress>
                    </div>
                    <div class="upload-right">
                        <button class="upload-btn" id="uploadAudio" v-show="audioProgress==0 && !audioName">上传文件</button>
                        <div class="mask" v-if="audioProgress==100 || audioName" @click="deleteAudio"></div>
                        <div class="mask" v-if="audioProgress>0&&audioProgress<100"></div>
                        <button class="upload-finish" v-if="audioProgress==100 || audioName">删除</button>
                    </div>
                </div>
                <div class="bottom">
                    <button class="cancel" @click="cancelAudio">取 消</button>
                    <button class="confirm" @click="saveCourseAudio">保 存</button>
                </div>
            </div>
        </div>

        <!-- 视频 -->
        <div class="audio-dialog" v-show="videoDialogVisible">
            <div class="audio">
                <p class="close"><i class="icon-cha iconfont" @click="cancelVideo"></i></p>
                <p class="add-course">添加课程</p>
                <p class="list-name">目录名称</p>
                <input type="text" v-model="subVideoName">
                <div class="upload">
                    <p class="upload-tips" v-if="videoProgress==0 && !videoName">
                        <i class="el-icon-upload"></i>支持扩展名：.mp4，.webm，.ogg 大小：不超过500M。<span style="color:#FF6767">{{subTips}}</span>
                    </p>
                    <div v-else class="file-info">
                        <p class="video-img">
                            <i class="iconfont">&#xe62e;</i>
                        </p>
                        <span class="name">{{videoName}}</span>
                        <el-progress :percentage="videoProgress" color="#1AA97B" v-if="videoProgress!=100 && videoProgress!=0"></el-progress>
                    </div>
                    <div class="upload-right">
                        <button class="upload-btn" id="uploadVideo" v-show="videoProgress==0 && !videoName">上传文件</button>
                        <div class="mask" v-if="videoProgress==100 || videoName" @click="deleteVideo"></div>
                        <div class="mask" v-if="videoProgress>0&&videoProgress<100"></div>
                        <button class="upload-finish" v-if="videoProgress==100 || videoName">删除</button>
                    </div>
                </div>
                <div class="bottom">
                    <button class="cancel" @click="cancelVideo">取 消</button>
                    <button class="confirm" @click="saveCourseVideo">保 存</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {conver, initQiniu} from 'assets/js/api'
import QuillEditor from 'components/common/Quilleditor'
import api from 'fetch/api'
import {mapGetters} from 'vuex'
export default {
  name: 'CourseMyAddSecond',
  data () {
    return {
      courseId: '', // 课程id
      courseType: '', // 课程结构
      imageNoHead: [], // 图片不带前缀的key数组
      subType: 1, // 正文类型 1--图文 2--音频 3--视频
      realSubType: '', // 课程类型，从接口读到
      subId: '', // 课时id
      status: '', // 课程状态
      auditFlag: true, // 是否显示提交审核按钮
      tipsFlag: false, // 添加不同类型课时时提示用户只能添加同一类型课时
      radio: 'img', // 默认上传图文
      editorHtml: '', // 富文本的值
      imgDialogVisible: false, // 图文弹窗显示隐藏
      subImgName: '', // 图文目录名称
      courseSubList: [], // 课程正文

      audioUrl: '', // 音频Url
      videoUrl: '', // 视频Url

      audioName: '', // 音频名字
      videoName: '', // 视频名字

      audioProgress: 0, // 音频上传进度
      videoProgress: 0, // 视频上传进度

      subAudioSize: '', // 音频视频文件大小
      subVideoSize: '', // 视频文件大小

      audioDialogVisible: false, // 音频弹窗显示隐藏
      videoDialogVisible: false, // 视频弹窗显示隐藏

      subAudioName: '', // 音频目录名称
      subVideoName: '', // 视频目录名称

      subTips: '' // 视频音频上传失败提示！
    }
  },
  created () {
    if (this.$route.query.id) {
      this.getBaseInfo()
      this.courseId = this.$route.query.id
      this.courseType = 2
    } else {
      this.$router.push({name: 'CourseMy'})
    }
  },
  components: {
    QuillEditor
  },
  computed: {
    ...mapGetters([
      'token',
      'imageHead',
      'uploadImageHead'
    ]),
    mulu(){
      return this.$store.state.share.classData.mulu
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
      that.subAudioSize = conver(file.size)
      let newInfo = JSON.parse(info)
      that.audioUrl = newInfo.key
      that.audioName = file.name
    }, file => {
      if (file.isUpload === 1) {
        that.subTips = ''
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
      that.subVideoSize = conver(file.size)
      let newInfo = JSON.parse(info)
      that.videoUrl = newInfo.key
      that.videoName = file.name
    }, file => {
      if (file.isUpload === 1) {
        that.subTips = ''
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
  },
  methods: {
    showHide(index) {
      if (this.$refs.child[index].style.display === 'none') {
        this.$refs.child[index].style.display = 'flex'
        this.$refs.arrow[index].style.transform = 'rotateX(0deg)'
      } else {
        this.$refs.child[index].style.display = 'none'
        this.$refs.arrow[index].style.transform = 'rotateX(180deg)'
      }
    },
    cancelAudio() {
      this.audioDialogVisible = false
    },
    cancelVideo () {
      this.videoDialogVisible = false
    },
    radioChange () {
      if (this.radio === 'img') {
        this.subType = 1
        if (this.subType === this.realSubType) {
          this.tipsFlag = false
        }
      } else if (this.radio === 'audio') {
        this.subType = 2
        this.subTips = ''
        if (this.subType === this.realSubType) {
          this.tipsFlag = false
        }
      } else {
        this.subType = 3
        this.subTips = ''
        if (this.subType === this.realSubType) {
          this.tipsFlag = false
        }
      }
    },
    // 通过获取用户角色来显示隐藏提交审核按钮
    getBaseInfo () {
      let that = this
      that.getCourseDetail(that.$route.query.id)
      api.getBaseInfo().then(res => {
        if (res.success) {
          that.roleId = res.data.roleId
          if (that.roleId === 1) {
            that.auditFlag = false
          }
        }
      })
    },
    deletCourseSub (id) {
      let that = this
      api.deletCourseSub({
        id: id,
        subType: that.subType
      }).then(res => {
        if (res.success) {
          that.getCourseDetail(that.courseId)
          if(this.courseSubList.length<=1){
            this.tipsFlag = false
          }
        } else {
          that.$message.error('删除课时失败！')
        }
      })
    },
    editImg (name, editor, id) {
      let that = this
      that.imgDialogVisible = true
      that.editorHtml = editor
      that.subImgName = name
      that.subId = id
    },
    editAudio (name, editor, id) {
      let that = this
      that.audioDialogVisible = true
      that.subAudioName = name
      that.audioName = editor
      that.subId = id
    },
    editVideo (name, editor, id) {
      let that = this
      that.videoDialogVisible = true
      that.subVideoName = name
      that.videoName = editor
      that.subId = id
    },
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
          } else {
            that.$message.success('已提交审核，请耐心等待。')
          }
          that.$router.push(`/index/coursemydetail${id}`)
        } else {
          that.$message.error('更改课程状态失败！')
        }
      })
    },
    createCourse () {
      if (this.realSubType) {
        if (this.realSubType === this.subType) {
          if (this.realSubType === 1) {
            this.subImgName = ''
            this.editorHtml = ''
            this.imgDialogVisible = true
          } else if (this.realSubType === 2) {
            this.subAudioName = ''
            this.audioName = ''
            this.audioDialogVisible = true
            this.audioProgress = 0
          } else {
            this.subVideoName = ''
            this.videoName = ''
            this.videoDialogVisible = true
            this.videoProgress = 0
          }
        } else {
          this.tipsFlag = true
        }
      } else {
        if (this.subType === 1) {
          this.imgDialogVisible = true
          this.subImgName = ''
          this.editorHtml = ''
        } else if (this.subType === 2) {
          this.audioDialogVisible = true
          this.subAudioName = ''
          this.audioProgress = 0
          this.audioName = ''
        } else {
          this.videoDialogVisible = true
          this.videoProgress = 0
          this.subVideoName = ''
          this.videoName = ""
        }
      }
    },
    saveCourseImg () {
      let that = this
      if (that.subImgName) {
        if (that.editorHtml) {
          if(this.courseSubList <=0){
            that.subId = ""
          }
          api.saveCourseSub({
            courseId: that.courseId,
            subName: that.subImgName,
            subType: that.subType,
            context: that.editorHtml,
            id: that.subId
          }).then(res => {
            if (res.success) {
              that.imgDialogVisible = false
              that.getCourseDetail(that.courseId)
            }
          })
        } else {
          that.$message.error('富文本内容不能为空！')
        }
      } else {
        that.$message.error('目录名称不能为空！')
      }
    },
    saveCourseAudio () {
      let that = this
      if (that.subAudioName) {
        if (that.audioUrl) {
          if(this.courseSubList <=0){
            that.subId = ""
          }
          api.saveCourseSub({
            courseId: that.courseId,
            subName: that.subAudioName,
            subType: that.subType,
            fileName: that.audioName,
            fileSize: that.subAudioSize,
            subUrl: that.audioUrl,
            id: that.subId
          }).then(res => {
            if (res.success) {
              that.audioDialogVisible = false
              that.getCourseDetail(that.courseId)
            }
          })
        } else {
          that.$message.error('音频文件不能为空！')
        }
      } else {
        that.$message.error('目录名称不能为空！')
      }
    },
    saveCourseVideo () {
      let that = this
      if (that.subVideoName) {
        if (that.videoUrl) {
          if(this.courseSubList <=0){
            that.subId = ""
          }
          api.saveCourseSub({
            courseId: that.courseId,
            subName: that.subVideoName,
            subType: that.subType,
            fileName: that.videoName,
            fileSize: that.subVideoSize,
            subUrl: that.videoUrl,
            id: that.subId
          }).then(res => {
            if (res.success) {
              that.videoDialogVisible = false
              that.getCourseDetail(that.courseId)
            }
          })
        } else {
          that.$message.error('视频文件不能为空！')
        }
      } else {
        that.$message.error('目录名称不能为空！')
      }
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
    getCourseDetail (id) {
      let that = this
      api.getCourseDetail({
        id: id
      }).then(res => {
        if (res.success) {
          that.status = res.data.status
          if (res.data.courseSubList && res.data.courseSubList.length > 0) {
            that.courseSubList = res.data.courseSubList

            that.realSubType = that.courseSubList[0].subType
            that.subType = that.realSubType

            if (that.realSubType === 1) {
              this.radio = 'img'
            } else if (that.realSubType === 2) {
              this.radio = 'audio'
              this.audioUrl=that.courseSubList[0].subUrl 
            } else {
              this.radio = 'video'
              this.videoUrl=that.courseSubList[0].subUrl   
            }
          } else {
            that.realSubType = ""
            that.courseSubList = []
          }
        } else {
          that.$message.error('获取课程正文失败！')
        }
      })
    },
    editorValue(val) {
      this.editorHtml = val
    },
    back () {
      this.$router.push({
        name: 'CourseMyAddFirst',
        query: {
          id: this.$route.query.id
        }
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"
>>>.el-dialog__body
  align-items flex-start
  flex-direction column !important
>>>.dialog-footer
  display flex
  justify-content center !important
.el-button:focus, .el-button:hover
  background #ffffff
.course-my-add-second
  width 100%
  margin 0 auto
.audio-dialog
  z-index 999
  position absolute
  top 0
  bottom 0
  left 0
  right 0
  background rgba(0, 0, 0, 0.5)
  .audio
    height 3.76rem
    width 6.8rem
    position fixed
    top 0
    right 0
    bottom 0
    left 0
    margin auto
    background #fff
    border-radius .05rem
    display flex
    flex-direction column
    justify-content flex-start
    align-items flex-start
    .close
      height .14rem
      width 100%
      padding .2rem 0 .06rem
      position relative
      .iconfont
        position absolute
        right .2rem
        top .2rem
        color #4A4A4A
        font-weight 600
        cursor pointer
    .add-course
      height .25rem
      line-height .25rem
      margin-left .4rem
      font-size .18rem
      color #4A4A4A
      font-weight 600
      margin-bottom .34rem
    .list-name
      height .22rem
      line-height .22rem
      color #4A4A4A
      font-size .14rem
      margin-left .4rem
      margin-bottom .05rem
    input
      width 5.85rem
      height .4rem
      border-radius .04rem
      border .01rem solid rgba(0,0,0,0.15)
      margin-left .4rem
      padding-left .15rem
      font-size .14rem
      color #4A4A4A
      margin-bottom .4rem
    .upload
      height .4rem
      width 6rem
      margin-left .4rem
      display flex
      justify-content space-between
      align-items center
      margin-bottom .6rem
      .upload-tips
        font-size .12rem
        color #999
        .el-icon-upload
          margin-right .1rem
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
                font-size .4rem
                color $color-theme
            .video-img
              height .4rem
              width .64rem
              display block
              margin-right .1rem
              border-radius 0
              .iconfont
                font-size .4rem
                color $color-theme
            .name
              height .4rem
              line-height .4rem
              font-size .12rem
              color #4A4A4A
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
      #uploadAudio
        color #fff
        background $color-theme
        font-size .14rem
        height .4rem
        line-height .4rem
        text-align center
        border-radius .2rem
        width 1rem
        cursor pointer
    .bottom
      flex-1()
      display flex
      justify-content flex-end
      align-items center
      background #FAFAFA
      width 100%
      .cancel,.confirm
        width 1.33rem
        height .38rem
        border .01rem solid $color-theme
        border-radius .04rem
        text-align center
        font-size .12rem
        color $color-theme
        background #fff
        margin-right .1rem
        cursor pointer
      .confirm
        margin-right .4rem
        background $color-theme
        color #fff
        border none
.content-main
  width 8.45rem
  .main-img
    height .84rem
    background #FAFAFA
    &:hover
      background #EDEDED
    .img-name
      height .84rem
      display flex
      justify-content space-between
      align-items center
      .img-l
        display flex
        justify-content flex-start
        align-items center
        cursor pointer
        .img-l-num
          font-size .24rem
          color #9B9B9B
          margin-left .22rem
          margin-right .36rem
        .img-l-name
          font-size .14rem
          color #4A4A4A
      .img-r
        cursor pointer
        .iconfont
          margin-right .32rem
          color #9B9B9B
  .main-audio,.main-video
    width 8.45rem
    background #FAFAFA
    .audio-name
      height .84rem
      display flex
      justify-content space-between
      align-items center
      .img-l
        display flex
        justify-content flex-start
        align-items center
        cursor pointer
        .img-l-num
          font-size .24rem
          color #9B9B9B
          margin-left .22rem
          margin-right .36rem
        .img-l-name
          font-size .14rem
          color #4A4A4A
      .img-r
        cursor pointer
        .iconfont
          margin-right .32rem
          color #9B9B9B
    .audio-body
      height .74rem
      display flex
      justify-content space-between
      align-items center
      background #EDEDED
      .body-l
        display flex
        justify-content flex-start
        align-items center
        cursor pointer
        margin-left .71rem
        .body-l-num
          height .4rem
          width .4rem
          margin-right .15rem
          i
            font-size .4rem
            color $color-theme
        .body-l-num-video
          height .4rem
          width .64rem
          margin-right .15rem
          i
            font-size .4rem
            color $color-theme
        .body-l-name
          font-size .14rem
          color #4A4A4A
      .body-r
        cursor pointer
        .iconfont
          margin-right .32rem
          color #9B9B9B
.head
  height .4rem
  width 100%
  margin 0 auto .1rem
  position relative
  .btn-one
    background none
    cursor pointer
    position absolute
    left 0
    bottom 50%
    margin-bottom -0.14rem
    height .28rem
    line-height .28rem
    font-size .2rem
    color #9B9B9B
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
  min-height 7.41rem
  border-radius .05rem
  background #fff
  margin 0 auto .32rem
  width 100%
  box-sizing border-box
  padding .24rem
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
    width 8.45rem
    margin 0 auto .4rem
    h3
      height .2rem
      line-height .2rem
      font-size .14rem
      color $color-theme
      font-weight 600
      margin-bottom .2rem
    .content-one,.content-two,.content-three,.content-five
      display flex
      justify-content space-between
      align-items center
      margin-bottom .2rem
      .title,.author,.desc
        width 3.45rem
        box-sizing border-box
        height .59rem
        h4
          font-size .14rem
          height .22rem
          line-height .22rem
          color #4A4A4A
          margin-bottom .05rem
        input,textarea
          width 3.45rem
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
    margin 0 auto .28rem
    h3
      margin-bottom .26rem
    .create-course-tips
      height .3rem
      line-height .3rem
      background rgba(255,170,0,0.15)
      font-size .12rem
      color #666666
      border-radius .04rem
      margin-bottom .1rem
    .content-six
      .title
        height .4rem
        display flex
        justify-content flex-start
        align-items center
        margin-bottom .3rem
        position relative
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
        .create-btn
          position absolute
          right 0
          top 0
          width 1rem
          height .4rem
          border-radius .2rem
          text-align center
          font-size .14rem
          color #fff
          background $color-theme
          cursor pointer
        .upload-methods
          display block
          font-size .14rem
          color #9B9B9B
          margin-left 1rem
          cursor pointer
          .iconfont
            font-size .14rem
</style>
