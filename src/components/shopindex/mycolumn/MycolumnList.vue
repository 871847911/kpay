<template>
  <div style="width:100%;">
    <div class="inner_box columnList" v-if="isActive == 4">
      <div class="head layout-head">
        <span>专栏列表</span>
        <el-button class='btn_name' @click="goAdd">添加专栏</el-button>
      </div>

      <NoData v-if="!list.length > 0" style="margin-top: 2rem;" />

      <div class="col_list_box" v-else>
        <div class="same_box_item" v-for="item in list" :key="item.id">
          <div class="shelf-status">
            <i class="iconfont icon-zitikuicon-" v-if="item.onStatus == 1" style="color:#6cddc7;"></i>
            <i class="iconfont icon-zitikuicon-" v-else style="color:#F42C21;"></i>
            <span class="state" v-if="item.onStatus == 1"><i class="iconfont icon-buxue"></i>已上架</span>
            <span class="state" v-else><i class="iconfont icon-buxue"></i>未上架</span>
          </div>

          <div class="check">
              <el-dropdown trigger="click" @command="handleDropDown($event,item)">
                  <span class="el-dropdown-link">
                      <span class="three_point clearfix"><i class="iconfont icon-gengduo-"></i></span>
                  </span>
                  <el-dropdown-menu slot="dropdown" class="check-head-dropdown-item">
                      <el-dropdown-item command="0"><i class="icon iconfont">&#xe624;</i>查看信息</el-dropdown-item>
                      <el-dropdown-item command="1" v-show="item.auditStatus !== 20"><i class="icon iconfont">&#xe608;</i>编辑信息</el-dropdown-item>
                      <el-dropdown-item command="2" v-show="item.auditStatus === 30 && item.onStatus == 1 || item.auditStatus === 40 &&item.onStatus == 1 || item.auditStatus === 50 && item.onStatus == 1"><i class="icon iconfont">&#xe630;</i>下架专栏</el-dropdown-item>
                  </el-dropdown-menu>
              </el-dropdown>
          </div>

          <div class="box" @click="handleLookChild(item)">
            <div class="info">
              <img :src="imageHead + item.columnUrl" alt="" style="width:2.4rem;height:1.5rem;">
              <div class="data">
                <p class="info_title ellipsis">{{item.columnName}}</p>
                <p class="time_line"><span class="update_time_title">更新时间</span><span class="update_time">{{item.modifyDate}}</span></p>
                <div class="info-content">
                  <p class="price "><span class="value">价格</span><span class="key">{{item.price}}元</span></p>
                  <p class="order_num"><span  class="value">订阅量</span><span class="key">{{item.buyNumber}}人</span></p>
                </div>
                <p v-show="item.auditStatus === 10" class="info-status unverify"><i class="iconfont icon-weishenhe_huaban_huaban"></i>未审核</p>
                <p v-show="item.auditStatus === 20" class="info-status verify"><i class="iconfont icon-shenhezhong_huaban_huaban"></i>审核中</p>
                <p v-show="item.auditStatus === 30" class="info-status pass"><i class="iconfont icon-yitongguo_huaban_huaban"></i>已通过</p>
                <p v-show="item.auditStatus === 40" class="info-status refuse"><i class="iconfont icon-weitongguo_huaban_huaban"></i>未通过</p>
              </div>
            </div>

            <div class="progress">
              <h2>更新进度</h2>
              <div class="progboxss">
                  <el-progress :show-text="false" :stroke-width="18" :percentage="item.percent" class="progbox"></el-progress>
                  <span>{{item.articleUpdateNumber}}/{{item.articleNumber}}</span>
              </div>   
            </div>
          </div>
        </div>
      </div>
      <div class="pagination" style="display:flex;justify-content:flex-end;">
        <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, sizes, jumper"
            :page-sizes="[5, 10, 15, 25]"
            :total="total">
        </el-pagination>
      </div>
    </div>
    <no-active v-if="isActive == 3" @reFresh="init"></no-active>
  </div>
</template>

<script>
import api from 'fetch/api'
import { mapGetters } from "vuex"
import NoData from "components/common/NoData";
import NoActive from 'components/common/NoActive'

export default {
  name: "MycolumnList",
  data() {
    return {
      list: [],
      sj_state: 1,
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0, // 列表数据总条数
    };
  },

  computed: {
    ...mapGetters([
      'imageHead',
      'isActive'
    ])
  },

  components: {
    NoData,
    NoActive

  },

  created() {
    this.init()
  },

  methods: {
    // 初始化数据
    init(){
      api.getStoreColumnList({
        onStatus:　'',
        searchName: '',
        page:this.currentPage,
        pageSize:this.pageSize
      }).then(res => {
          if(res.success){
            res.data.list.forEach(item => {
              if(item.articleNumber !== 0){
                item.percent = item.articleUpdateNumber / item.articleNumber * 100

                if(item.percent > 100){
                  item.percent = 100
                }
              }else{
                item.percent = 0
              }

              if(item.modifyDate){
                item.modifyDate = item.modifyDate.substr(0, 10)
              }

              if(item.columnName.length > 12){
                item.columnName = item.columnName.substr(0, 12) + '...'
              }
            });

            this.list = res.data.list;
            this.total = res.data.total
          }
      })
    },

    goAdd() {
      this.$router.push({ name: "MycolumnListAdd" });
    },

    handleLookChild(item){
      const {id, auditStatus} = item

      if(auditStatus === 30 || auditStatus === 50){
        this.$router.push({ 
          name: "MycolumnListContent",
          query: {
            columnId: id
          }
        })
      }else{
        this.$router.push({ 
          name: "MycolumnListUpload",
          query: {
            id: id
          }
        })
      }
    },

    handleDropDown(e,item){
      switch (e) {
        case "0":
          this.$router.push({
            name:'MycolumnListUpload',
            query:{
              id:item.id
            }
          })
          break;
        case "1":
          this.$router.push({
            name:"MycolumnListAdd",
            query:{
              editorId:item.id
            }
          })
          break;
        case "2":
          this.shelves(item.id,item.onStatus)
          break; 
      }
    },
    shelves(itemid,onStatus){ // 下架
      const statusValue = onStatus === 0 ? 1 : 0

      if(!statusValue){
        api.updateColumnStatus({
          id:itemid,
          status:statusValue
        }).then(res=>{
          if(res.success){
            this.$message.success('专栏下架成功')
            this.init()
          }
        })
      }else{
        this.$message.warning('您已下架此专栏！')
      }
    },

    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      this.init()
    },

    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      this.init()
    }
  }
};
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

.inner_box 
  width 100%
  >>>.el-dropdown, >>>.el-dropdown-link
    display flex
    align-items center
    justify-content center
    width .3rem
    height .3rem
  .head 
    .btn_name 
      font-size 14px
      text-align center
      background $color-theme
      border-radius 4px
      cursor pointer
      color #FFFFFF
      border none
  .col_list_box 
    min-width 7rem
    display flex
    justify-content flex-start
    align-items center
    flex-wrap wrap !important
    .same_box_item 
      width calc(50% - 0.1rem)
      height 2.8rem
      background white
      margin-bottom 0.2rem
      cursor pointer
      position relative
      &:nth-child(2n) 
        margin-left 0.2rem
      .box 
        height 100%
        font-size 0.14rem
        padding .4rem .2rem 0 0.2rem
        box-sizing border-box
      .shelf-status
        display flex
        flex-flow row nowrap
        align-items center
        position absolute
        top .1rem
        left .18rem
        font-size 14px
      .check 
        display inline-block
        position absolute
        top .08rem
        right .16rem
        height 0.3rem
      .three_point 
        float right
        margin-top0.04rem
        width 0.16rem
        height 0.16rem
        line-height 0.08rem
        text-align center
        cursor pointer
      .state 
        color #9B9B9B
        height 0.2rem
        line-height 0.2rem
        i 
          font-size 0.05rem
          width 0.14rem
          height 0.14rem
          color $color-theme
      .info 
        width 100%
        display flex
        justify-content space-between
        img 
          width 2.4rem
          height 1.5rem
        .data 
          width calc(100% - 2.6rem)
          .info_title 
            font-weight bold
            height 0.22rem
            line-height 0.22rem
            font-size 0.16rem
            color #4A4A4A
            margin-bottom 0.12rem
          .info-content
            padding-top .26rem
            display flex
            flex-flow row nowrap
            align-items center
          .time_line 
            height 0.4rem
            border-bottom 1px solid #E6E6E6
            font-size 0.12rem
            box-sizing border-box
            span 
              height 0.17rem
              line-height 0.17rem
            .update_time_title 
              text-align center
              color #FFFFFF
              background $color-theme
              padding 0.005rem 0.04rem
              border-radius 0.02rem
            .update_time 
              color #9B9B9B
              margin-left 0.08rem
          .price, .order_num 
            position relative
            span 
              height 0.2rem
              line-height 0.2rem
            .value 
              width 0.57rem
              color #9B9B9B
            .key 
              color #666666
          .price
            padding-right .2rem
            &::after
              content ''
              position absolute
              right 0
              top 2px
              width 2px
              height 16px
              background-color #e6e6e6
          .order_num 
            padding-left .2rem
          .info-status
            display inline-flex
            align-items center
            color #ffffff
            border-radius 4px
            margin-top .1rem
            &.pass
              color $color-theme
            &.unverify
              color #f0c070
            &.verify
              color #7eb4f2
            &.refuse
              color #9b9b9b
            i 
              font-size 20px
              margin-right 5px
      .progress 
        width 100%
        h2 
          margin-top 0.2rem
          height 0.2rem
          line-height 0.2rem
          color #9B9B9B
        .progboxss 
          margin-top 0.07rem
          height 0.2rem
          display flex
          justify-content space-between
          align-items center
          width 100%
          line-height 0.2rem
          >>>.el-progress
            height auto
          span 
            height 0.2rem
            line-height 0.2rem
            color #9B9B9B
            font-size 0.14rem
          .progbox 
            margin 0
            width 83.5%
          >>> .el-progress-bar__outer 
            height 0.06rem !important
          >>> .el-progress-bar__innerText 
            display none
            font-size 0.06rem !important
            position relative
            bottom 0.03rem
          >>>.el-progress-bar__inner
              background-color $color-theme
</style>
