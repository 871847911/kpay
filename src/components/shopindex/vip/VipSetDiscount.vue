<template>
    <div class="panel-face-vip">
      <div class="panel-face" @click="showDialog">
          <div>
            <i class="iconfont icon-zhekoutexiang- red-i"></i>
            <i class="iconfont icon-shezhi-" :class="[panelIndex===0?'green-i':'']"></i>
          </div>
          <h3>尊享折扣特权</h3>
          <p>建议使用场景：会员提升到一定等级。则享受课程折扣特权</p>
      </div>

      <el-dialog title="尊享折扣特权" :visible.sync="dialogFormVisible" :show-close="false" width="650px">
          <el-switch
            class="open-vip"
            v-model="isOpen"
            active-color="#6CDDC7"
            inactive-color="#AEB8BE">
          </el-switch>

          <div class="list-thead-gray">
            <el-table :data="ruleJson" stripe>
                <el-table-column type="index" label="序号" :index="indexMethod" width="50" align="center"></el-table-column>
                <el-table-column prop="levelName" label="等级名称" width="160" align="center"></el-table-column>
                <el-table-column prop="growRound" label="成长值满足点" align="center" width="160"></el-table-column>
                <el-table-column prop="sale" label="特权" align="center" min-width="200">
                  <template slot-scope="scope" v-if="scope.$index > 0">
                      <el-select v-model.number="scope.row.sale" @change="selectedChange(scope.row, scope.$index)">
                        <el-option v-for="(item, index) of saleOptions[scope.$index]" :key="index" :label="item" :value="item"></el-option>
                      </el-select>
                  </template>
                </el-table-column>
              </el-table>
           </div> 
    
          <div slot="footer" class="dialog-footer">
            <el-button class="cancel-btn" @click="dialogFormVisible = false">取 消</el-button>
            <el-button class="confirm-btn" @click="someEditConfirm">提 交</el-button>
          </div>
      </el-dialog>
    </div>
</template>

<script>
import api from 'fetch/api'

export default {
  name: "VipSetDiscount",
  data() {
    return {
      ruleJson: [],
      isOpen: false,
      resId: "",
      saleOptions: [],
      saleCt: ["请选择", 9.5, 9, 8.5, 8, 7.5, 7, 6.5, 6, 5.5, 5],
      dialogFormVisible: false,
    }
  },

  props:{
    panelIndex: Number
  },

  methods: {
    //获取等级列表
    initVipList(){
      const _this = this
    
      return api.getVipFunc({
        type: 1
      }).then(res => {
        if(res.success){
          if(res.data && res.data.rule.length > 0){
            res.data.rule.forEach(v => {
                v.growRound = v.growMax ? `${v.growMin}~${v.growMax}` : `>=${v.growMin}`

                if(v.sale === ''){
                   v.sale = '请选择'
                }
              }
            )

            _this.resId = res.data.id
            _this.isOpen = res.data.isOpen
            _this.ruleJson = res.data.rule
  
            this.initDropDown(res.data.rule.length)
            this.selectedChange()
          }
        }else{
          this.$message.error(res.message)
        }
      })
    },
  
    // 初始化下拉框
    initDropDown(len){
      const _this = this, saleOpts = new Array(len)

      _this.saleOptions = saleOpts.fill(0).map((v, index) => {
        if(index !== 0){
          v = [..._this.saleCt]
        }
        return v 
      })
    },

    // 下拉框选择改变
    selectedChange(row, index){
      this.recursion()
    },

    // 复杂的计算--选择框动态内容
    recursion(){
      const rules = this.ruleJson
      const opts = this.saleOptions
      const ct = [...this.saleCt]
      const please = '请选择'

      for (let i = 1; i < rules.length; i++) {
        let { sale } = rules[i]

        if(sale === please) sale = 0
        sale = typeof sale === 'string' ? Number(sale) : sale

        opts[i] = [...ct]

        for (let j = i - 1; j >= 1; j--) {
          let preSale = rules[j].sale

          if(preSale === please) preSale = 0
          preSale = typeof preSale === 'string' ? Number(preSale) : preSale

          const pos = ct.indexOf(preSale)
          opts[i].splice(1, pos - 1)

          if(sale > preSale){
            if(preSale !== 0){
              rules[i].sale = please
            }else{
              continue
            }
          }else if(sale === 0 && preSale === 0){
            continue
          }else{
            break
          }
        }
      }
    },

    // 序号补0
    indexMethod(index){
      index++
      return index;
    },

    // 批量编辑确认
    someEditConfirm(){
      const rules = JSON.parse(JSON.stringify(this.ruleJson))

      if(rules.length > 0){
        rules.forEach(item => {
          if(item.sale === '请选择'){
            item.sale = ''
          }
          delete item.growRound
        })

        api.updateSaleFunc({
          id: this.resId,
          type: 1,
          isOpen: this.isOpen,
          ruleJson: JSON.stringify(rules)
        }).then(res => {
          this.dialogFormVisible = false
          this.$message.success('提交成功')
        }).catch(err => {
          this.$message.error('提交失败')
        })
      }else{
        this.$message.warning('暂无等级数据，请勿提交')
      }
    },

    // 显示弹出框
    showDialog(){
      this.initVipList().then(res => {
        this.dialogFormVisible = true
      })
      this.$emit('cgIndex', 0)
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"

.cancel-btn
  margin-right .2rem
.el-dialog__body
  position relative
.open-vip
  position absolute
  top 0.28rem
  right 0.2rem
.el-form-item-center
  display flex
  justify-content center
  margin 40px 0 30px 0
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
    .red-i
      color #F42C21
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
