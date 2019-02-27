// 讲师

/* eslint-disable */
export default [{
    title: '个人中心',
    id: '100',
    children: [{
        title: '概览',
        id: '1',
        tagUrl: '/index/personal',
        icon: 'icon-gaikuang-',
        children: [{
          title: '信息概览',
          id: '1-1',
          path: '/index/personalcenter'
        }]
      },
      {
        title: '店铺管理',
        id: '2',
        tagUrl: '/index/shop',
        icon: 'icon-dianpuguanli',
        children: [{
          title: '店铺信息',
          id: '2-1',
          path: '/index/shopinfo'
        }]
      }
    ]
  },
  {
    title: '内容中心',
    id: '200',
    children: [{
        title: '课程管理',
        id: '1',
        tagUrl: '/index/course',
        icon: 'icon-kechengguanli',
        children: [{
            title: '已审核课程',
            id: '1-1',
            path: '/index/coursemy'
          },
          {
            title: '审核课程',
            id: '1-2',
            path: '/index/courseaudit'
          }
        ]
      },
      {
        title: '专栏管理',
        id: '2',
        tagUrl: '/index/mycolumn',
        icon: 'icon-wodezhuanlan-',
        children: [{
            title: '专栏列表',
            id: '2-1',
            path: '/index/mycolumnlist'
          },
          {
            title: '专栏审核',
            id: '2-2',
            path: '/index/mycolumnverify'
          },
          {
            title: '内容审核',
            id: '2-3',
            path: '/index/mycolumncoverify'
          }
        ]
      },
      {
        title: '问答管理',
        id: '3',
        tagUrl: '/index/ques',
        icon: 'icon-wenda',
        children: [{
            title: '提问我的',
            id: '3-1',
            path: '/index/quesaskmy'
          },
          {
            title: '问题列表',
            id: '3-2',
            path: '/index/queslist'
          }
        ]
      }
    ]
  },
  {
    title: '财务中心',
    id: '300',
    children: [{
        title: '资金账户',
        id: '1',
        tagUrl: '/index/finaceuser',
        icon: 'icon-zijinzhanghu-',
        children: [{
            title: '收入明细',
            id: '1-1',
            path: '/index/finaceuserincome'
          },
          // {
          //   title: '结算明细',
          //   id: '1-2',
          //   path: '/index/finaceusertransfer'
          // }
        ]
      },
      // {
      //   title: '提现管理',
      //   id: '2',
      //   tagUrl: '/index/withdrawal',
      //   icon: 'icon-tixianguanli-',
      //   children: [
      //     {
      //       title: '提现申请',
      //       id: '2-1',
      //       path: '/index/withdrawalapply'
      //     },
      //     {
      //       title: '提现记录',
      //       id: '2-2',
      //       path: '/index/withdrawalrecord'
      //     }
      //   ]
      // }
    ]
  },
  {
    title: '运营中心',
    id: '400',
    children: [{
      title: '交易管理',
      id: '1',
      tagUrl: '/index/order',
      icon: 'icon-jiaoyi',
      children: [{
        title: '我的订单',
        id: '1-1',
        path: '/index/orderteacher'
      }]
    }]
  }
]
