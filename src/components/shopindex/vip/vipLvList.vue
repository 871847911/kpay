<template>
    <div class="vip-lv-list holder-common">
        <div v-if="isActive == 4">
            <div class="topbar layout-head">
                <h3>会员等级管理</h3>
              <div style="font-size:14px;">
                <router-link to="/index/viplvpower"><i class="iconfont icon-liulan"></i>查看相应等级特权</router-link>
              </div>
            </div>

            <div class="contain">
                <div class="action-bar">
                  <div class="search">
                      <el-input placeholder="等级名称" v-model="searchName"></el-input>  
                      <!-- <el-select class="mr-10 el-select-custom" v-model="" placeholder="成长值范围">
                        <el-option
                          v-for=""
                          :key="item.value"
                          :label="item.label"
                          :value="item.value">
                        </el-option>
                      </el-select> -->
                      <button class="search-btn mr-10" @click="search">搜索</button>
                  </div>

                  <div class="action-btn">
                    <el-button class="editButton" @click="someEdit"><i class="iconfont icon-bianji"></i></el-button>

                    <!-- <el-tooltip content="添加等级" placement="top" class="btn-poper">
                      <el-button @click="addLevel"><i class="el-icon-plus"></i></el-button>
                    </el-tooltip> -->
                  </div>
              </div>

                <div class="list">
                    <div class="list-table list-thead-gray">
                        <el-table
                            :data="templateList"
                            stripe
                            style="width: 100%"
                            ref="multipleTable"
                            @selection-change="handleSelectionChange">
                            <el-table-column
                                align="center"
                                type="selection"
                                width="55">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                type="index"
                                label="序号"
                                :index="indexMethod"
                                width="150">
                            </el-table-column>
                           <!-- <el-table-column
                                align="center"
                                prop="levelCode"
                                label="等级编号"
                                min-width="150">
                            </el-table-column> -->
                            <el-table-column
                                align="center"
                                prop="levelName"
                                label="等级名称"
                                min-width="150">
                            </el-table-column>
                            <el-table-column
                                align="center"
                                prop="growRound"
                                label="成长值范围"
                                min-width="150">
                            </el-table-column>
                            <el-table-column
                                align="center" label="操作">
                              <template slot-scope="scope">
                                <el-button
                                  size="mini"
                                  @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
                              </template>
                            </el-table-column>
                        </el-table>
                    </div>
                </div>
            </div>
        </div>

        <no-active v-if="isActive == 3" @reFresh="initTemplates"></no-active>

        <el-dialog :title="formActionName" :visible.sync="dialogFormVisible" :show-close="true" width="650px">
          <el-form :model="editForm" ref="editForm" label-position="top">
            <el-form-item label="会员等级名称" :label-width="formLabelWidth" prop="name" :rules="[
              { required: true, message: '会员等级名称不能为空'}
            ]">
              <el-input v-model="editForm.name" maxlength="18" auto-complete="off" size="medium" class="form-item-unifiy-width"></el-input>
            </el-form-item>

            <el-form-item class="el-form-item-center">
              <el-button class="confirm-green" @click="editFormConfirm('editForm')">确 定</el-button>
            </el-form-item>
          </el-form>
        </el-dialog>

        <el-dialog title="批量编辑" :visible.sync="dialogTableVisible" class="list-thead-gray">
          <el-table :data="editGridData" :fit="true" stripe>
            <el-table-column type="index" label="序号" :index="indexMethod" width="70" align="center"></el-table-column>
            <el-table-column prop="levelCode" label="等级编号" min-width="200" align="center"></el-table-column>
            <el-table-column prop="levelName" label="等级名称" align="center" min-width="200">
              <template slot-scope="scope">
                  <el-input v-model="scope.row.levelName" maxlength="18" placeholder="请输入内容"></el-input>
              </template>
            </el-table-column>
            <el-table-column prop="growMin" label="成长值满足点" align="center" width="200"></el-table-column>
          </el-table>
          <div slot="footer" class="dialog-footer">
              <el-button class="confirm-green" @click="someEditConfirm">确 定</el-button>
          </div>
        </el-dialog>
    </div>
</template>

<script>
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
import {mapGetters} from 'vuex'

export default {
  name: 'VipLvList',
  data () {
    return {
      templateList:[], // 列表数据
      editGridData: [], //批量编辑；列表暂存数据
      searchName: '', //  搜索框的等级名称
      //growUpValue: '', // 下拉列表值
      //growUpOptions: [], // 下拉列表选项
      dialogFormVisible: false, //对话框锁
      dialogTableVisible: false, //对话框锁
      formLabelWidth: '120px', //
      formActionName: '编辑会员等级',
      editForm: {
        name: ''
      }, // 编辑添加表单数据
      tableItemIndex: 0 // 选中的当前列表项索引
    }
  },

  computed: {
    ...mapGetters([
      'isActive'
    ])
  },

  components: {
    NoActive
  },

  created () {
    this.initTemplates()
  },

  methods: {
    // 初始化数据
    initTemplates(conf = {}) {
      api.getStoreVipLevelConfigList(conf).then(res => {
        if(res.data){
          res.data.forEach(v => {
            if(v.growMax){
              v.growRound = `${v.growMin}~${v.growMax}` 
            }else{
              v.growRound = `>=${v.growMin}`
            }
          })
          this.templateList = res.data
        }
      });
    },

    // 序号补0
    indexMethod(index){
      index++
      
      return index;
    },

    // 重置数据
    resetForm(formName) {
      if(this.$refs[formName]){
        this.$refs[formName].resetFields();
      }
    },

    // 选择框改变事件
    handleSelectionChange(val){
      this.editGridData = val
    },

    // 取消所有选择框
    cancelSelection(){
      this.$refs.multipleTable.clearSelection()
    },

    // 查询课程分类列表
    search () {
      this.cancelSelection()

      this.initTemplates({
        searchName: this.searchName
      })
    },

    // 单个编辑按钮
    handleEdit(i, row){
      this.resetForm("editForm")

      this.tableItemIndex = i
      this.dialogFormVisible = true
      this.editForm.name = this.templateList[i].levelName
      this.cancelSelection()
    },

    // 单个编辑确认
    editFormConfirm(formName){
      const _this = this

      _this.templateList[_this.tableItemIndex].levelName = _this.editForm.name

      _this.$refs[formName].validate((valid) => {
          if (valid) {
            api.modifyStoreVipLevelConfigInfo({
              id: _this.templateList[_this.tableItemIndex].id,
              levelName: _this.editForm.name
            }).then(res => {
              _this.dialogFormVisible = false
              _this.cancelSelection()

              _this.$message({
                message: '编辑成功',
                type: 'success'
              })
            }).catch(err => {
              _this.$message({
                message: '编辑失败',
                type: 'error'
              })
            })
          } else {
            return false;
          }
        })
    },

    // 批量编辑按钮
    someEdit(){
      this.formActionName = "编辑会员等级"
      this.dialogTableVisible = true
    },

    // 批量编辑确认
    someEditConfirm(){
      if(this.editGridData.length !== 0){
        api.vipLevelBatchSave(this.editGridData).then(res => {
          this.dialogTableVisible = false
          this.cancelSelection()

          this.$message({
            message: '编辑成功',
            type: 'success'
          })
        }).catch(err => {
          this.$message({
            message: '编辑失败',
            type: 'error'
          })
        })
      }else{
        this.$message({
          message: '请选择需要编辑的条目',
          type: 'warning'
        })
      }
    },

    // 添加等级
    // addLevel(){
    //   this.formActionName = "添加会员等级"
    //   this.dialogFormVisible = true
    // },
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
.vip-lv-list, .holder-common
  width 100%
  padding 0
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
  .contain
    .action-bar
      width 100%
      height .4rem
      margin-bottom .11rem
      flexBetween()
    .action-btn
      flex()
      .btn-poper, .editButton
        width .38rem
        height .38rem
        border-radius 4px
        border none
        flex()
        i
          color #ffffff
        .icon-bianji
          color $color-theme
      .el-button
        border 0
        padding 0 !important
    .search
      flex()
      .el-input
        width 3rem
        margin-right 5px
      .search-btn
        width .7rem
        height .4rem
        background $color-theme
        border-radius 4px
        font-size 14px
        color #ffffff
        cursor pointer
    .list
      width 100%
      margin 0 auto .33rem
      overflow-x hidden
      overflow-y auto
      border-radius .05rem
      background #fff
      padding 0 .2rem
      box-sizing border-box
      .list-table
        width 100%
        margin .2rem auto .3rem
      .pagination
        display flex
        justify-content flex-end
        align-items center
        padding-right .2rem
        margin-bottom .27rem
</style>
