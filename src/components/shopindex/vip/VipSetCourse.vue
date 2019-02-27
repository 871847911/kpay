<template>
  <div>
    <div class="panel-face" @click="showDialog">
      <div>
        <i class="iconfont icon-putongkecheng blue-i"></i>
        <i class="iconfont icon-shezhi-" :class="[panelIndex===3?'green-i':'']"></i>
      </div>
      <h3>独享赠送课程</h3>
      <p>达到固定级别可免费获赠一篇课程</p>
    </div>

    <el-dialog title="独享赠送课程" :visible.sync="dialogFormVisible" :show-close="true" width="680px">
        <el-table :data="gridData" stripe>
            <el-table-column prop="number" label="生效等级" align="center">
              <template slot-scope="scope">
                  <el-select v-model="scope.row.number" placeholder="请选择">
                    <el-option
                      v-for="item in levelOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="level" label="课程类型" align="center">
              <template slot-scope="scope">
                  <el-select v-model="scope.row.level" placeholder="请选择">
                    <el-option
                      v-for="item in courseOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </template>
            </el-table-column>
            <el-table-column prop="name" label="价格范围" align="center">
              <template slot-scope="scope">
                  <el-select v-model="scope.row.name" placeholder="请选择">
                    <el-option
                      v-for="item in priceOptions"
                      :key="item.value"
                      :label="item.label"
                      :value="item.value">
                    </el-option>
                  </el-select>
              </template>
            </el-table-column>
            <el-table-column label="是否启用" align="center">
              <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.open"
                    active-color="#6CDDC7"
                    inactive-color="#f42c21">
                  </el-switch>
                  <el-button @click="handleClick(scope.row)" type="text" size="small">
                    <i class="iconfont icon-cha delete"></i>
                  </el-button>
              </template>
            </el-table-column>
          </el-table>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "VipSetCourse",
  data() {
    return {
      dialogFormVisible: false,
      gridData: [
        {
          number: '1',
          level: 'WASDD',
          name: '钻石',
          growUp: '50~100',
          open: false
        },
        {
          number: '1',
          level: 'WASDD',
          name: '黄金',
          growUp: '20~100',
          open: false
        }
      ],
      levelOptions: [{
          value: '选项1',
          label: '黄金糕'
        }, {
          value: '选项2',
          label: '双皮奶'
        }],
      courseOptions: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }],
      priceOptions: [{
        value: '选项1',
        label: '黄金糕'
      }, {
        value: '选项2',
        label: '双皮奶'
      }]
    }
  },
  props:{
    panelIndex: Number
  },
  methods: {
    showDialog(){
      this.dialogFormVisible = true
      this.$emit('cgIndex', 3)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"

.delete
  color #9B9B9B
  font-size 14px
  margin-left .05rem
.panel-face
  width 3.6rem
  height 1.8rem
  background rgba(255,255,255,1) 
  box-shadow 0px 2px 11px 0px rgba(155,155,155,0.5) 
  border-radius .04rem
  margin-right .3rem
  margin-bottom .3rem
  padding .2rem
  box-sizing border-box
  cursor pointer
  div
    flex()
    height .35rem
    margin-bottom .1rem
    justify-content space-between
    align-items center
    i 
      &:first-child
        font-size 30px
      &:last-child
        display block
        width .4rem
        height .4rem
        background-color #F9FAF9
        color #9B9B9B
        border-radius 50%
        text-align center
        line-height .4rem
    .blue-i
      color #4A90E2
    .green-i
      color #6CDDC7 !important
  h3
    font-size 20px
    color #4A4A4A
    margin-bottom .1rem
  p
    font-size 14px
    color #9B9B9B
    line-height .2rem
</style>
