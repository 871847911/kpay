export const dyAdmin = {
  userlecture: {
    title: '入驻讲师',
    id: '2-2',
    path: '/index/userlecture'
  },
  member: {
    title: '会员系统',
    id: '1',
    tagUrl: '/index/vip',
    icon: 'icon-huiyuanguanli-',
    children: [
      {
        title: '会员等级管理',
        id: '1-1',
        path: '/index/viplv'
      },
      {
        title: '会员信息管理',
        id: '1-2',
        path: '/index/vipinfo'
      }
    ]
  },
  cord: {
    title: '积分系统',
    id: '2',
    tagUrl: '/index/mbrecord',
    icon: 'icon-jifenxitong-',
    children: [
      {
        title: '会员积分管理',
        id: '2-1',
        path: '/index/mbrecordmanage'
      },
      {
        title: '积分规则设置',
        id: '2-2',
        path: '/index/mbrecordset'
      }
    ]
  },
  grouplist: {
    title: '拼团管理',
    id: '4-1',
    path: '/index/marketgrouplist'
  },
  settlement: {
    title: '结算管理',
    id: '2',
    tagUrl: '/index/balance',
    icon: 'icon-jiesuanguanli-',
    children: [
      {
        title: '结算汇总',
        id: '2-1',
        path: '/index/balancesummary'
      },
      {
        title: '结算规则',
        id: '2-2',
        path: '/index/balancerules'
      }
    ]
  },
  transfer: {
    title: '转账管理',
    id: '3',
    tagUrl: '/index/transfer',
    icon: 'icon-tixiancishu-',
    children: [
      {
        title: '转账申请',
        id: '3-1',
        path: '/index/transferapply'
      },
      {
        title: '转账记录',
        id: '3-2',
        path: '/index/transferrecord'
      }
    ]
  }
}

export const dyCustom = {
  finaceusertransfer: {
    title: '结算明细',
    id: '1-2',
    path: '/index/finaceusertransfer'
  },
  withdrawal: {
    title: '提现管理',
    id: '2',
    tagUrl: '/index/withdrawal',
    icon: 'icon-tixianguanli-',
    children: [
      {
        title: '提现申请',
        id: '2-1',
        path: '/index/withdrawalapply'
      },
      {
        title: '提现记录',
        id: '2-2',
        path: '/index/withdrawalrecord'
      }
    ]
  }
}
