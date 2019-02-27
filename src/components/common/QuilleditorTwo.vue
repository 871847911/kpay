<template>
  <div>
    <script id="vd_editor2" type="text/plain"></script>
  </div>
</template>

<script>
import api from "fetch/api";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      editor: null,
      value: "",
      isLocked: false
    };
  },
  computed: {
    ...mapGetters(["token", "uploadImageHead"])
  },
  props: {
    editorValue: String,
    defalut: ""
  },
  watch: {
    editorValue: {
      handler(val, oldVal) {
        this.value = val;

        if (!this.value && !this.editor) {
          this.init(val);
        }
      },
      immediate: true
    },
    editor(edit) {
      if (edit) edit.setContent(this.value);
    },
    value(val) {
      if (!this.editor) return false;

      if (this.isLocked === false) {
        this.editor.setContent(val);
        this.isLocked = true;
      }
    }
  },
  methods: {
    init(val) {
      api.getUpToken(this.token).then(res => {
        this.showEditor(res.uptoken, val);
      });
    },

    editerChange(html) {
      this.value = html;
      this.$emit("change", html);
    },

    showEditor(upload_Token, val) {
      let self = this;

      this.$nextTick(function() {
        let qiniuConfig = {
          initialFrameWidth: null,
          initialFrameHeight: 320,
          toolbar: [
            "source | undo redo | bold italic  |  forecolor backcolor | removeformat |",
            "insertorderedlist insertunorderedlist | selectall cleardoc paragraph |  fontsize",
            "| justifyleft justifycenter justifyright justifyjustify |",
            "image"
          ],
          qiniuImgPrefix: self.uploadImageHead,
          qiniuToken: upload_Token,
          qiniuUploadUrl: "http://upload.qiniu.com",
          qiniuShowedUrl: self.uploadImageHead
        };

        UM.delEditor("vd_editor2");
        this.editor = UM.getEditor("vd_editor2", qiniuConfig);

        this.editor.ready(function() {
          self.editor.setContent(val || "");

          self.editor.fireEvent("contentChange");
          var $textarea = $("#vd_editor2")
            .parent()
            .find("iframe")
            .contents();
          var fn = function() {
            self.editerChange(self.editor.getContent());
          };

          if (document.all) {
            $textarea.get(0).attachEvent("onpropertychange", function(e) {
              fn();
            });
          } else {
            $textarea.on("input", fn);
          }
        });

        //选择变化
        this.editor.addListener("selectionchange", function(e) {
          self.editerChange(self.editor.getContent());
        });
      });
    }
  }
};
</script>