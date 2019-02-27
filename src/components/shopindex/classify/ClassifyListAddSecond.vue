<template>
    <div class="classify-add-sec holder-common">
        <div>
            <div class="topbar">
              <div>
                <h3>添加二级分类</h3>
              </div>  
              <div>
                <h3 @click="goback">
                  <i class="iconfont icon-fanhui"></i>
                  返回
                </h3>
              </div>
            </div>

            <div class="contain">
                <div class="box">
                  <el-form :model="classForm" ref="classForm" label-position="top">
                    <el-form-item label="分类名称" prop="name">
                      <el-input type="text" v-model="classForm.name" maxlength="18" auto-complete="off"></el-input>
                    </el-form-item>
                    <el-form-item label="上级类别" prop="platform">
                      <el-select v-model="classForm.platform" placeholder="请选择">
                        <el-option
                          v-for="item in platformOptions"
                          :key="item.id"
                          :label="item.name"
                          :value="item.id">
                        </el-option>
                      </el-select>
                    </el-form-item>
                    <el-form-item>
                      <el-button @click="submitForm('classForm')">提 交</el-button>
                    </el-form-item>
                  </el-form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import api from 'fetch/api'

export default {
  name: 'ClassifyListAddSecond',
  data () {
    return {
     classForm:{ //表单
       name: "",
       platform: ""
     },
     platformOptions: [], //选择框
     isEdit: false, //是否是编剧
    }
  },

  created () {
    this.initList().then(res => {
      const params = this.$route.query
      
      if(params.id){
        this.classForm.platform = Number(params.id)
      }

      if(params.name){
        this.isEdit = true

          const item = res.filter(v => {
            if(v.name == params.name) return v
          })
          this.classForm.platform = item.length !== 0 ? item[0].id : ""
          this.classForm.name = params.paltform
        }
    })
  },

  methods: {
    initList(){
      return api.getCatalogList({
        type: 1
      }).then(res => {
        if(res.data){
          return this.platformOptions = res.data
        }
      })
    },

    submitForm(){
      const { name, platform } = this.classForm

      let config = {
        name: name,
        catalogUrl: "",
        parentId: platform,
        showCatalog: 1
      }

      if(this.isEdit){
        config.id = this.$route.query.id
        this.submitEditFunc(config)
      }else{
        config.type = 3
        this.submitAddFunc(config)
      }
    },

    // 修改
    submitEditFunc(config){
      if(config.name === '' || config.parentId === ''){
        this.$message.warning("请填写分类名称或选择平台类别")
        return false
      }

      api.updateCourseCatalog(config).then(res => {
        if(res.success){
          this.$message({
            message: "提交成功",
            type: "success"
          })
          this.goback()
        }else{
            this.$message({
              message: "提交失败",
              type: "error"
            })
        }
      })
    },

    // 添加
    submitAddFunc(config){
      if(config.name === '' || config.parentId === ''){
        this.$message.warning("请填写分类名称或选择平台类别")
        return false
      }

      api.addCourseCatalog(config).then(res => {
        if(res.success){
          this.$message({
            message: "提交成功",
            type: "success"
          })
          this.goback()
        }else{
          this.$message({
            message: res.message,
            type: "warning"
          })
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

.el-form-item-center
  display flex
  justify-content center
  margin 40px 0 30px 0
>>>.el-form-item__content
  flex()
  button 
    border none
    width .82rem
    height .4rem
    background $color-theme
    border-radius 4px
    color #ffffff
    margin-top .2rem
.el-form-item, .el-select
  width 4rem
.classify-add-sec, .holder-common
  width 100%
  padding 0
  box-sizing border-box
  .topbar
      flexBetween()
      font-size 12px
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
        cursor pointer
      p
        cursor pointer
      a 
        color $color-text-l
  .contain
    margin-top .23rem
    .box
      flex()
      width 100%
      height 4.6rem
      background-color #ffffff
      padding .38rem 0
      border-radius 2px
</style>

