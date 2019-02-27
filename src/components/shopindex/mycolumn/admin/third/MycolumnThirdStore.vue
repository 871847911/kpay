<template>
  <div style="width:100%;">
    <div>
      <div class="search">
        <el-select v-model="searchData.onStatus" placeholder="全部状态" class="el-select-custom">
          <el-option
              v-for="item in newOptions"
              :key="item.value"
              :label="item.label"
              :value="item.value">
          </el-option>
        </el-select>
        <el-input type="text" placeholder="专栏名称/作者" v-model="searchData.searchName"></el-input>
        <button class="search-btn" @click="search">搜索</button>
      </div>
      <NoData v-if="list.length === 0"></NoData>  

      <div class="col_list_box">
        <div class="same_box_item" v-for="item in list" :key="item.id">
            <div class="shelf-status" @click="handleLookChild(item.id)">
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
                        <el-dropdown-item command="2" v-show="item.auditStatus === 30 && item.onStatus == 1 || item.auditStatus === 40 &&item.onStatus == 1 || item.auditStatus === 50 && item.onStatus == 1"><i class="icon iconfont">&#xe630;</i>下架专栏</el-dropdown-item>
                    </el-dropdown-menu>
                </el-dropdown>
            </div>

            <div class="box" @click="handleLookChild(item.id)">
                <div class="info">
                    <img :src="imageHead + item.columnUrl " alt="图片" style="width:2.4rem;height:1.5rem;">
                    <div class="data">
                        <p class="info_title ellipsis">{{item.columnName}}</p>
                        <p class="time_line" style=""><span class="update_time_title">更新时间</span><span class="update_time">{{item.modifyDate}}</span></p>
                        <p class="autor"><span class="value">作者</span><span class="key">{{item.userName}}</span></p>
                        <p class="price"><span class="value">价格</span><span class="key">{{item.price}}元</span></p>
                        <p class="order_num"><span  class="value">订阅量</span><span class="key">{{item.buyNumber}}人</span></p>
                    </div>
                </div>

                <div class="progress">
                    <h2>更新进度</h2>
                    <div class="progboxss">
                        <el-progress :text-inside="true" :stroke-width="18" :percentage="item.percent" class="progbox"></el-progress>
                        <span>{{item.articleUpdateNumber}}/{{item.articleNumber}}</span>
                    </div>   
                </div>
            </div>
          </div>
      </div>
      <div class="pagination" style="display:flex;justify-content:flex-end;padding:20px 20px 20px 0;">
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
  </div>
   
</template>

<script>
import api from 'fetch/api'
import {mapGetters} from 'vuex'
import NoData from 'components/common/NoData'

const UNVERIFY = 10;
const VERIFYING = 20;
const VERIFYED = 50;

export default {
  name: 'MycolumnThirdStore',
  data () {
    return {
      list:[], // 列表数据
      newOptions: [{
        value: '',
        label: '全部'
      },{
        value: '0',
        label: '未上架'
      },{
        value:'1',
        label:'已上架'
      }],
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0, // 列表数据总条数
      activeIdx: 0,
      actionNames: ['专栏列表', '专栏审核', '内容审核'],
      currentStatus: UNVERIFY,
      inputValue: '',
      searchData:{
        onStatus:'',
        searchName:''
      },
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0 // 列表数据总条数
    }
  },

  computed: {
    ...mapGetters([
      'imageHead'
    ])
  },

  components: {
    NoData
  },

  created () {
    this.init()
  },

  methods: {
    // 初始化数据
    init(){ // 专栏列表
      api.getThirdList({
        onStatus:this.searchData.onStatus,
        searchName:this.searchData.searchName,
        page:this.currentPage,
        pageSize:this.pageSize
      }).then(res => {
        if(res.data){
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

    search(){
      this.init()
    },

    //切换状态
    handleTab(index){
      this.activeIdx = index

      switch (index) {
        case 0:
          this.currentStatus = UNVERIFY
          break;
        case 1:
          this.currentStatus = VERIFYING
          break;
        case 2:
          this.currentStatus = VERIFYED
          break;
      }

      this.init()
    },

    handleDropDown(e,item){
      switch (e) {
        case "0":
          this.$router.push({
            name:'MycolumnThirdViewDetail',
            query:{
              id:item.id
            }
          })
          break;
        case "2":
          this.shelves(item.id,item.onStatus)
          break; 
      }
    },

    // 查看按钮
    handleLook(i, row){
      this.$router.push({
        path: 'classifylistsecond', 
        query: { 
          id: row.id
        }
      })
    },

    handleLookChild(id){
      this.golook(id)
    },

    golook(id){
      this.$router.push({ 
        name: "MycolumnThirdContent",
        query: {
          columnId: id
        }
      });
    },

    // 下架
    shelves(itemid,onStatus){ 
      const statusValue = onStatus === 0 ? 1 : 0

      if(!statusValue){
        api.updateColumnStatus({
          id:itemid,
          status:statusValue
        }).then(res=>{
          if(res.success){
            this.init()
          }
        })
      }else{
        this.$message.warning('您已下架此专栏！')
      }
    },

    // 序号补0
    indexMethod(index){
      const cur = this.currentPage
      const size = this.pageSize
      
      index++
      if(cur > 1){
        index = (cur - 1) * size + index
      }

      return index;
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
}
</script>

<style lang="stylus" scoped>
@import "~assets/styles/mixins"
@import "~assets/styles/varibles"

>>>.el-dropdown, >>>.el-dropdown-link
  display flex
  align-items center
  justify-content center
  width .3rem
  height .3rem
.search
  width 100%
  height .4rem
  position relative
  margin 0 0 .15rem 0.2rem
  .el-input
    width 3rem
  .search-btn
    height .4rem
    fontCenter(.4rem)
    font-size .14rem
    color #fff
    border-radius .05rem
    background $color-theme
    width .7rem
    cursor pointer
.col_list_box 
  background-color #ffffff
  min-width 7rem
  display flex
  justify-content flex-start
  align-items center
  flex-wrap wrap !important
  padding .2rem
  .same_box_item 
    overflow hidden
    width calc(50% - 0.2rem)
    height auto
    background white
    margin-bottom 0.2rem
    cursor pointer
    position relative
    border 1px solid #F9FAF9
    border-radius 5px
    &:nth-child(2n) 
      margin-left 0.2rem
    .box 
      font-size 0.14rem
      padding .2rem
      box-sizing border-box
    .shelf-status
      width 100%
      background-color #F9FAF9
      height 0.4rem
      display flex !important
      align-items center
      font-size 14px
      padding 0 .15rem
      box-sizing border-box
    .check 
      display inline-block
      position absolute
      top .06rem
      right 0.15rem
      height 0.16rem
    .three_point 
      float right
      width 0.16rem
      height 0.16rem
      line-height 0.16rem
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
        .time_line 
          height 0.27rem
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
        .price, .order_num, .autor 
          margin-top 0.1rem
          span 
            height 0.2rem
            line-height 0.2rem
          .value 
            width 0.57rem
            color #9B9B9B
          .key 
            color #666666
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
        width 100%
        line-height 0.2rem
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