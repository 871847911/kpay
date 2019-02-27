<template>
  <div style="width:100%;">
    <div class="balance" v-if="isActive == 4">
      <div class="topbar layout-head">
        <h3>结算规则</h3>
      </div>

      <div class="contain">
        <el-alert
          title="结算规则用于您和入驻生产者的资金结算。系统根据您设置的结算规则自动把用户实付金额分别计入您的收入和入驻生产者的收入中，结算规则更改后即时生效"
          show-icon
          type="warning">
        </el-alert>

        <BalanceCourse
          :courseList="templateList.course"
          @refresh="refresh"
          @courseDelItem="courseDelItem"
          @courseChangeItem="courseChangeItem"
          @courseChangeSettle="courseChangeSettle"
          />
        <BalanceColumn
          :columnList="templateList.specialColumn"
          :autoSettlement="templateList.autoSettlement"
          @refresh="refresh"
          @columnDelItem="columnDelItem"
          @columnChangeItem="columnChangeItem"
          />
      </div>
    </div>
    <no-active v-if="isActive == 3" @reFresh="initSettlement"></no-active>
  </div>

</template>

<script>
import api from 'fetch/api'
import BalanceColumn from './BalanceColumn'
import BalanceCourse from './BalanceCourse'
import NoActive from 'components/common/NoActive'
import { mapGetters } from 'vuex'

export default {
  name: 'BalanceRules',
  data () {
    return {
      templateList: []
    }
  },

  components: {
    BalanceColumn,
    BalanceCourse,
    NoActive
  },

  computed: {
    ...mapGetters([
      'userId',
      'isActive'
    ])
  },

  created() {
    if (this.isActive === 4) {
      this.initSettlement()
    }
  },

  methods: {
    // 获取专栏列表数据
    initSettlement() {
      api.getPayStoreRule().then(res => {
        if (res.data) {
          // 专栏添加删除开关
          res.data.specialColumn.map(v => {
            v.deleteRow = false
            return v
          })

          // 课程添加删除开关
          res.data.course.map(v => {
            v.deleteRow = false
            return v
          })

          this.templateList = res.data
        }
      })
    },

    // 课程和专栏新增后自刷新
    refresh() {
      this.initSettlement()
    },

    // 课程删除行数据
    courseDelItem(ruleId) {
      const data = [...this.templateList.course]

      this.templateList.course = data.filter(v => {
        return v.ruleId !== ruleId
      })
    },

    // 课程改变行费率的数据
    courseChangeItem(ruleId, newRate) {
      const data = [...this.templateList.course]

      this.templateList.course = data.map(v => {
        if (v.ruleId === ruleId) {
          v.serviceRate = newRate
        }
        return v
      })
    },

    // 课程改变行结算时间的数据
    courseChangeSettle(ruleId, newSettle) {
      const data = [...this.templateList.course]

      this.templateList.course = data.map(v => {
        if (v.ruleId === ruleId) {
          v.settlementTime = newSettle
        }
        return v
      })
    },

    // 专栏删除行数据
    columnDelItem(ruleId) {
      const data = [...this.templateList.specialColumn]

      this.templateList.specialColumn = data.filter(v => {
        return v.ruleId !== ruleId
      })
    },

    // 专栏改变行费率的数据
    columnChangeItem(ruleId, newRate) {
      const data = [...this.templateList.specialColumn]

      this.templateList.specialColumn = data.map(v => {
        if (v.ruleId === ruleId) {
          v.serviceRate = newRate
        }
        return v
      })
    }
  }
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.balance
  width 100%
  box-sizing border-box
  .topbar
    div
      flex()
      color $color-text-l
      &:last-child
        i
          display inline-block
          margin-right .04rem
    h3
      font-size 20px
      margin-right .2rem
      cursor pointer
    p
      cursor pointer
    a
      color $color-text-l
  .contain
    flex()
    flex-direction column
</style>

<style lang="stylus">
.balance .el-alert__title
  color #666666
</style>
