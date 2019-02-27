<template>
    <div>
        <quill-editor
            v-model="content"
            ref="myTextEditor"
            :options="editorOption"
            @change="onChange($event)">
            <div id="toolbar" slot="toolbar">
                <span class="ql-formats"><button type="button" class="ql-bold"></button></span>
                <span class="ql-formats"><button type="button" class="ql-italic"></button></span>
                <!-- <span class="ql-formats"><button type="button" class="ql-underline"></button></span> -->
                <!-- <span class="ql-formats"><button type="button" class="ql-strike"></button></span> -->
                <span class="ql-formats"><button type="button" class="ql-blockquote"></button></span>
                <span class="ql-formats"><button type="button" class="ql-code-block"></button></span>
                <span class="ql-formats"><button type="button" class="ql-header" value="1"></button></span>
                <span class="ql-formats"><button type="button" class="ql-header" value="2"></button></span>
                <span class="ql-formats"><button type="button" class="ql-list" value="ordered"></button></span>
                <span class="ql-formats"><button type="button" class="ql-list" value="bullet"></button></span>
                <!-- <span class="ql-formats"><button type="button" class="ql-script" value="sub"></button></span>
                <span class="ql-formats"><button type="button" class="ql-script" value="super"></button></span> -->
                <span class="ql-formats"><button type="button" class="ql-indent" value="-1"></button></span>
                <span class="ql-formats"><button type="button" class="ql-indent" value="+1"></button></span>
                <span class="ql-formats"> <button type="button" class="ql-direction" value="rtl"></button></span>
                <!-- <span class="ql-formats">
                    <select class="ql-size">
                        <option value="small"></option>
                        <option selected></option>
                        <option value="large"></option>
                        <option value="huge"></option>
                    </select>
                </span> -->
                <span class="ql-formats">
                    <select class="ql-header">
                        <option value="1"></option>
                        <option value="2"></option>
                        <option value="3"></option>
                        <option value="4"></option>
                        <option value="5"></option>
                        <option value="6"></option>
                        <option selected="selected">常规字体</option>
                    </select>
                </span>
                <span class="ql-formats">
                    <select class="ql-color">
                        <option selected="selected"></option>
                        <option value="#e60000"></option>
                        <option value="#ff9900"></option>
                        <option value="#ffff00"></option>
                        <option value="#008a00"></option>
                        <option value="#0066cc"></option>
                        <option value="#9933ff"></option>
                        <option value="#ffffff"></option>
                        <option value="#facccc"></option>
                        <option value="#ffebcc"></option>
                        <option value="#ffffcc"></option>
                        <option value="#cce8cc"></option>
                        <option value="#cce0f5"></option>
                        <option value="#ebd6ff"></option>
                        <option value="#bbbbbb"></option>
                        <option value="#f06666"></option>
                        <option value="#ffc266"></option>
                        <option value="#ffff66"></option>
                        <option value="#66b966"></option>
                        <option value="#66a3e0"></option>
                        <option value="#c285ff"></option>
                        <option value="#888888"></option>
                        <option value="#a10000"></option>
                        <option value="#b26b00"></option>
                        <option value="#b2b200"></option>
                        <option value="#006100"></option>
                        <option value="#0047b2"></option>
                        <option value="#6b24b2"></option>
                        <option value="#444444"></option>
                        <option value="#5c0000"></option>
                        <option value="#663d00"></option>
                        <option value="#666600"></option>
                        <option value="#003700"></option>
                        <option value="#002966"></option>
                        <option value="#3d1466"></option>
                    </select>
                </span>
                <span class="ql-formats">
                    <select class="ql-background">
                        <option value="#000000"></option>
                        <option value="#e60000"></option>
                        <option value="#ff9900"></option>
                        <option value="#ffff00"></option>
                        <option value="#008a00"></option>
                        <option value="#0066cc"></option>
                        <option value="#9933ff"></option>
                        <option selected="selected"></option>
                        <option value="#facccc"></option>
                        <option value="#ffebcc"></option>
                        <option value="#ffffcc"></option>
                        <option value="#cce8cc"></option>
                        <option value="#cce0f5"></option>
                        <option value="#ebd6ff"></option>
                        <option value="#bbbbbb"></option>
                        <option value="#f06666"></option>
                        <option value="#ffc266"></option>
                        <option value="#ffff66"></option>
                        <option value="#66b966"></option>
                        <option value="#66a3e0"></option>
                        <option value="#c285ff"></option>
                        <option value="#888888"></option>
                        <option value="#a10000"></option>
                        <option value="#b26b00"></option>
                        <option value="#b2b200"></option>
                        <option value="#006100"></option>
                        <option value="#0047b2"></option>
                        <option value="#6b24b2"></option>
                        <option value="#444444"></option>
                        <option value="#5c0000"></option>
                        <option value="#663d00"></option>
                        <option value="#666600"></option>
                        <option value="#003700"></option>
                        <option value="#002966"></option>
                        <option value="#3d1466"></option>
                    </select>
                </span>
                <!-- <span class="ql-formats">
                    <select class="ql-font">
                        <option selected="selected"></option>
                        <option value="serif"></option>
                        <option value="monospace"></option>
                    </select>
                </span> -->
                <span class="ql-formats">
                    <select class="ql-align">
                        <option selected="selected"></option>
                        <option value="center"></option>
                        <option value="right"></option>
                        <option value="justify"></option>
                    </select>
                </span>
                <span class="ql-formats">
                    <button type="button" class="ql-clean"></button>
                </span>
                <span class="ql-formats">
                    <button type="button" class="ql-link"></button>
                </span>
                <span class="ql-formats">
                    <i type="button" class="el-icon-picture icon" id="uploadImageone"></i>
                </span>
                <span class="ql-formats">
                    <button type="button" class="ql-video"></button>
                </span>
            </div>
        </quill-editor>
    </div>
</template>
<script>
import {quillEditor} from 'vue-quill-editor'
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'
import {initQiniu} from 'assets/js/api'
import {mapGetters} from 'vuex'
export default {
  data() {
    return {
      content: '',
      editorOption: {
        modules: {
          toolbar: '#toolbar'
        }
      },
      progress: '',
      uploadUrl: ''
    }
  },
  props: {
    editorValue: String
  },
  methods: {
    onChange({html, quill, text}) {
      this.$emit('change', html)
    }
  },
  computed: {
    ...mapGetters([
      'token',
      'uploadImageHead'
    ]),
    editor() {
      return this.$refs.myTextEditor.quill
    }
  },
  components: {
    quillEditor
  },
  mounted() {
    this.content = this.editorValue
    var that = this
    initQiniu('uploadImageone', 2, 'image/jpeg,image/jpg,image/png', (file, info) => {
      let newInfo = JSON.parse(info)
      that.uploadUrl = that.uploadImageHead + newInfo.key
      //   that.tips = '上传成功。'
      let length = that.editor.getSelection(true).index
      that.editor.insertEmbed(length, 'image', that.uploadUrl)
      that.editor.setSelection(length + 1)
    }, file => {
      if (file.isUpload === 1) {
        that.progress = file.percent
      } else if (file.isUpload === 2) {
        that.$message.warning('文件大小超出范围')
      } else {
        that.$message.warning("文件类型不正确！")
      }
    }, that.token)
  },
  watch: {
    editorValue(e) {
      this.content = e
    }
  }
}
</script>

<style lang="stylus" scoped>
.el-icon-picture
    font-size .18rem
    margin-left .1rem
    margin-bottom .05rem
    cursor pointer
    &:hover
        color #0066cc
</style>
