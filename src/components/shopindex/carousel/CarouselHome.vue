<template>
  <div class="carouse-home">
    <div v-if="isActive == 4">
      <div class="topbar layout-head">
        <h3>小程序首页轮播图</h3>
      </div>

      <div class="contain">
        <div class="action-bar">
          <div class="search">
            <el-select class="mr-10 el-select-custom" v-model="allBanner" placeholder="轮播图位置">
              <el-option
                v-for="(item, index) of bannerOptions"
                :key="index"
                :label="item.label"
                :value="item.value"
              ></el-option>
            </el-select>
            <button class="search-btn mr-10" @click="search">搜索</button>
          </div>

          <div class="action-btn">
            <el-button @click="addBanner">
              <span>添加轮播图</span>
              <i class="iconfont icon-shangchuantupian"></i>
            </el-button>
          </div>
        </div>

        <el-alert :title="listTitle" type="warning" show-icon></el-alert>

        <div class="list">
          <div class="list-table list-thead-gray">
            <el-table :data="templateList" stripe style="width: 100%" ref="multipleTable">
              <el-table-column align="center" prop="sortNum" label="轮播序号" width="150"></el-table-column>
              <el-table-column align="center" prop="fileNum" label="编号" min-width="150"></el-table-column>
              <el-table-column align="center" prop="linkGo" label="轮播图跳转" min-width="150"></el-table-column>
              <el-table-column align="center" prop="growRound" label="轮播图片" min-width="150">
                <template slot-scope="scope">
                  <img class="classify-icon" :src="imageHead + scope.row.sourceUrl" alt="图片">
                </template>
              </el-table-column>
              <el-table-column align="center" label="上线/下线" min-width="150">
                <template slot-scope="scope">
                  <el-switch
                    v-model="scope.row.isOnline"
                    active-color="#6CDDC7"
                    inactive-color="#AEB8BE"
                    @change="handleIsShow(scope.row)"
                  ></el-switch>
                </template>
              </el-table-column>
              <el-table-column align="center" label="操作" width="150">
                <template slot-scope="scope">
                  <el-button size="mini" @click="handleLook(scope.$index, scope.row)">查看</el-button>
                  <el-button
                    size="mini"
                    class="delete-btn"
                    @click="handleDelete(scope.$index, scope.row)"
                  >删除</el-button>
                </template>
              </el-table-column>
            </el-table>
          </div>
        </div>

        <div class="pagination">
          <el-pagination
            background
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange"
            :current-page.sync="currentPage"
            :page-size="pageSize"
            layout="prev, pager, next, sizes, jumper"
            :page-sizes="[5, 10, 15, 25]"
            :total="total"
          ></el-pagination>
        </div>
      </div>
    </div>
    <no-active v-if="isActive == 3" @reFresh="initTemplates"></no-active>
  </div>
</template>

<script>
import api from 'fetch/api'
import NoActive from 'components/common/NoActive'
import Cookies from 'js-cookie'
import { mapGetters } from 'vuex'

export default {
  name: 'CarouselHome',
  data() {
    return {
      templateList: [], // 列表数据
      currentPage: 1, // 查询的是第几页
      pageSize: 10, // 每页条数
      total: 0, // 列表数据总条数
      allBanner: 1, // 全部内容
      bannerOptions: [
        {
          value: 1,
          label: '首页轮播图'
        },
        {
          value: 2,
          label: '店铺详情轮播图'
        }
      ],
      listTitle: ''
    }
  },

  computed: {
    ...mapGetters(['isActive', 'imageHead'])
  },

  components: {
    NoActive
  },

  created() {
    this.initTemplates()
    this.countBanner()
  },

  methods: {
    // 初始化数据
    initTemplates(
      conf = {
        type: '',
        page: this.currentPage,
        pageSize: this.pageSize
      }
    ) {
      api.carouselList(conf).then(res => {
        if (res.data) {
          const linkTypeArr = ['内容', '讲师', '营销']

          res.data.list.map(item => {
            if (item.linkType) {
              if (Number(item.linkType) === 4) {
                item.linkGo = linkTypeArr[0] + '/' + item.pageName
              } else {
                item.linkGo =
                  linkTypeArr[item.linkType - 1] + '/' + item.pageName
              }
            }
            return item
          })

          this.total = res.data.total
          this.templateList = res.data.list
        }
      })
    },

    // 轮播图bar
    countBanner() {
      api
        .countBanner({
          type: this.allBanner
        })
        .then(res => {
          if (res.data) {
            this.listTitle = `小程序首页轮播图共 ${res.data.total} 张，其中 ${
              res.data.onlineCount
            } 张已上线`
          }
        })
    },

    // 查询课程分类列表
    search() {
      this.initTemplates({
        type: this.allBanner,
        page: this.currentPage,
        pageSize: this.pageSize
      })
      this.countBanner()
    },

    // 添加轮播图
    addBanner() {
      Cookies.remove('carouselDate')
      this.$router.push({
        name: 'CarouselHomeEdit',
        params: {}
      })
    },

    // 删除按钮
    handleDelete(i, row) {
      api
        .deleteStoreAdvert({
          id: row.id
        })
        .then(res => {
          if (res.success) {
            const list = [...this.templateList]

            this.templateList = list.filter(item => {
              return item.id !== row.id
            })
            this.$message.success('删除成功!')
          }
        })
        .catch(er => {
          this.$message.error('删除失败!')
        })
    },

    // 开关
    handleIsShow(row) {
      api
        .bannerSetOnline({
          id: row.id,
          isOnline: row.isOnline
        })
        .then(res => {
          if (res.success) {
            if (res.message) {
              this.$message.success(res.message)
            } else {
              if (row.isOnline === true) {
                this.$message.success('轮播图上线成功')
              } else {
                this.$message.success('轮播图下线成功')
              }
            }
            this.countBanner()
          } else {
            this.$message.warning(res.message)
            row.isOnline = false
          }
        })
        .catch(er => {
          this.$message.error('操作失败！')
          this.initTemplates()
        })
    },

    // 查看按钮
    handleLook(i, row) {
      this.$router.push({
        path: 'carouselhomedetail',
        query: {
          id: row.id
        }
      })
    },

    // 改变每页显示的条数重新渲染列表
    handleSizeChange(val) {
      this.pageSize = val
      this.initTemplates()
    },

    // 改变页码重新渲染列表
    handleCurrentChange(val) {
      this.currentPage = val
      this.initTemplates()
    }
  }
}
</script>

<style lang="stylus" scoped>
@import '~assets/styles/mixins';
@import '~assets/styles/varibles';

.el-form-item-center {
  display: flex;
  justify-content: center;
  margin: 40px 0 30px 0;
}

.carouse-home {
  width: 100%;
  box-sizing: border-box;

  .topbar {
    div {
      flex();
      color: $color-text-l;

      a {
        flex();
        align-items: center;
      }

      i {
        font-size: 18px;
        display: inline-block;
        margin-right: 0.04rem;
        float: left;
      }
    }

    h3 {
      font-size: 20px;
      margin-right: 0.2rem;
      cursor: pointer;
    }

    p {
      cursor: pointer;
    }

    a {
      color: $color-text-l;
    }
  }

  .contain {
    .action-bar {
      width: 100%;
      height: 0.4rem;
      margin-bottom: 0.11rem;
      flexBetween();
    }

    .action-btn {
      flex();

      .el-button {
        flex();
        width: 1rem;
        height: 0.4rem;
        border: 0;
        padding: 0 !important;
        border-radius: 4px;
        background-color: $color-theme;
        font-size: 14px;
        color: #ffffff;

        i {
          font-size: 14px;
        }
      }
    }

    .search {
      flex();

      input {
        height: 0.4rem;
        width: 2.8rem;
        border-radius: 0.05rem;
        background: #fff;
        padding-left: 0.2rem;
        font-size: 14px;
        color: #4A4A4A;
        placeholderStyle();
      }

      .search-btn {
        width: 0.7rem;
        height: 0.4rem;
        background: $color-theme;
        border-radius: 4px;
        font-size: 14px;
        color: #ffffff;
        cursor: pointer;
      }
    }

    .list {
      width: 100%;
      margin: 0 auto 0.33rem;
      overflow-x: hidden;
      overflow-y: auto;
      border-radius: 0.05rem;
      background: #fff;
      padding: 0 0.2rem;
      box-sizing: border-box;

      .list-table {
        width: 100%;
        margin: 0.2rem auto 0.3rem;
      }

      .classify-icon {
        width: 0.5rem;
        height: 0.5rem;
      }
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 0.2rem;
      margin-bottom: 0.27rem;
    }
  }
}
</style>

<style lang="stylus">
@import '~assets/styles/mixins';
@import '~assets/styles/varibles';

.el-form-item-center {
  display: flex;
  justify-content: center;
  margin: 40px 0 30px 0;
}

.carouse-home {
  width: 100%;
  box-sizing: border-box;

  .topbar {
    div {
      flex();
      color: $color-text-l;

      a {
        flex();
        align-items: center;
      }

      i {
        font-size: 18px;
        display: inline-block;
        margin-right: 0.04rem;
        float: left;
      }
    }

    h3 {
      font-size: 20px;
      margin-right: 0.2rem;
      cursor: pointer;
    }

    p {
      cursor: pointer;
    }

    a {
      color: $color-text-l;
    }
  }

  .contain {
    .action-bar {
      width: 100%;
      height: 0.4rem;
      margin-bottom: 0.11rem;
      flexBetween();
    }

    .action-btn {
      flex();

      .el-button {
        flex();
        width: 1rem;
        height: 0.4rem;
        border: 0;
        padding: 0 !important;
        border-radius: 4px;
        background-color: $color-theme;
        font-size: 14px;
        color: #ffffff;

        i {
          font-size: 14px;
        }
      }
    }

    .search {
      flex();

      input {
        height: 0.4rem;
        width: 2.8rem;
        border-radius: 0.05rem;
        background: #fff;
        padding-left: 0.2rem;
        font-size: 14px;
        color: #4A4A4A;
        placeholderStyle();
      }

      .search-btn {
        width: 0.7rem;
        height: 0.4rem;
        background: $color-theme;
        border-radius: 4px;
        font-size: 14px;
        color: #ffffff;
        cursor: pointer;
      }
    }

    .list {
      width: 100%;
      margin: 0 auto 0.33rem;
      overflow-x: hidden;
      overflow-y: auto;
      border-radius: 0.05rem;
      background: #fff;
      padding: 0 0.2rem;
      box-sizing: border-box;

      .list-table {
        width: 100%;
        margin: 0.2rem auto 0.3rem;
      }

      .classify-icon {
        width: 0.5rem;
        height: 0.5rem;
      }
    }

    .pagination {
      display: flex;
      justify-content: flex-end;
      align-items: center;
      padding-right: 0.2rem;
      margin-bottom: 0.27rem;
    }
  }
}
</style>
