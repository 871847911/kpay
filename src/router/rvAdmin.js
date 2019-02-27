// 商家

/* eslint-disable */
export default [{
	title: '店铺中心',
	id: '100',
	children: [{
		title: '店铺管理',
		id: '1',
		tagUrl: '/index/shop',
		icon: 'icon-dianpuguanli',
		children: [{
			title: '店铺概览',
			id: '1-1',
			path: '/index/shopview'
		},
			{
				title: '店铺信息',
				id: '1-2',
				path: '/index/shopinfo'
			}]
	},
		{
			title: '用户管理',
			id: '2',
			tagUrl: '/index/user',
			icon: 'icon-yonghuguanli',
			children: [{
				title: '用户列表',
				id: '2-1',
				path: '/index/userlist'
			}
				// {
				//   title: '入驻审核',
				//   id: '2-2',
				//   path: '/index/useraudit'
				// },
				// {
				//   title: '入驻讲师', // 版本控制功能动态添加路由
				//   id: '2-3',
				//   path: '/index/userlecture'
				// }
			]
		}
	]
},
	{
		title: '内容中心',
		id: '200',
		children: [{
			title: '分类管理',
			id: '1',
			tagUrl: '/index/classify',
			icon: 'icon-lunbotu_huaban',
			children: [{
				title: '分类列表',
				id: '1-1',
				path: '/index/classifylist'
			}
				// {
				//   title: '添加分类',
				//   id: '1-2',
				//   path: '/index/classifyadd'
				// }
			]
		},
			{
				title: '课程管理',
				id: '2',
				tagUrl: '/index/course',
				icon: 'icon-kechengguanli',
				children: [
					// {
					//   title: '课程分类',
					//   id: '2-1',
					//   path: '/index/coursecategory'
					// },
					{
						title: '我的课程',
						id: '2-1',
						path: '/index/coursemy'
					},
					{
						title: '第三方课程',
						id: '2-2',
						path: '/index/coursethird'
					}
				]
			},
			{
				title: '专栏管理',
				id: '3',
				tagUrl: '/index/mycolumn',
				icon: 'icon-wodezhuanlan-',
				children: [{
					title: '自营专栏',
					id: '3-1',
					path: '/index/mycolumnliststore'
				},
					{
						title: '第三方专栏',
						id: '3-2',
						path: '/index/mycolumnthird'
					}
				]
			},
			{
				title: '问答管理',
				id: '4',
				tagUrl: '/index/ques',
				icon: 'icon-wenda',
				children: [{
					title: '提问我的',
					id: '4-1',
					path: '/index/quesaskmy'
				},
					{
						title: '问题列表',
						id: '4-2',
						path: '/index/queslist'
					}
				]
			}
		]
	},
	{
		title: '营销中心',
		id: '300',
		children: [
			// {
			//   title: '会员系统', // 版本控制功能动态添加路由
			//   id: '1',
			//   tagUrl: '/index/vip',
			//   icon: 'icon-huiyuanguanli-',
			//   children: [
			//     {
			//       title: '会员等级管理',
			//       id: '1-1',
			//       path: '/index/viplv'
			//     },
			//     {
			//       title: '会员信息管理',
			//       id: '1-2',
			//       path: '/index/vipinfo'
			//     }
			//   ]
			// },
			// {
			//   title: '积分系统', // 版本控制功能动态添加路由
			//   id: '2',
			//   tagUrl: '/index/mbrecord',
			//   icon: 'icon-jifenxitong-',
			//   children: [
			//     {
			//       title: '会员积分管理',
			//       id: '2-1',
			//       path: '/index/mbrecordmanage'
			//     },
			//     {
			//       title: '积分规则设置',
			//       id: '2-2',
			//       path: '/index/mbrecordset'
			//     }
			//   ]
			// },
			{
				title: '分享免费读',
				id: '3',
				tagUrl: '/index/share',
				icon: 'icon-fenxiangkecheng-',
				children: [{
					title: '分享规则查询',
					id: '3-1',
					path: '/index/sharerule'
				},
					{
						title: '分享信息统计',
						id: '3-2',
						path: '/index/shareinfo'
					}
				]
			},
			{
				title: '营销管理',
				id: '4',
				tagUrl: '/index/market',
				icon: 'icon-yingxiaoguanli',
				children: [
					// {
					//   title: '拼团管理', // 版本控制功能动态添加路由
					//   id: '4-1',
					//   path: '/index/marketgrouplist'
					// },
					{
						title: '赠送管理',
						id: '4-2',
						path: '/index/marketgift'
					}
				]
			}
		]
	},
	{
		title: '分销中心',
		id: '700',
		children: [
			// {
			// 	title: '自营分销',
			// 	id: '1',
			// 	tagUrl: '/index/distribution',
			// 	icon: 'icon-huiyuanguanli-',
			// 	children: [{
			// 		title: '分销商品',
			// 		id: '1-1',
			// 		path: '/index/distributionself'
			// 	}]
			// },
			// {
			// 	title: '内容管理',
			// 	id: '2',
			// 	tagUrl: '/index/contentMangement',
			// 	icon: 'icon-neirongguanli1',
			// 	children: [{
			// 		title: '分销商品',
			// 		id: '2-1',
			// 		path: '/index/contentMangementShoppingList'
			// 	}]
			// }
			{
				title: '内容管理',
				id: '2',
				tagUrl: '/index/distris',
				icon: 'icon-huiyuanguanli-',
				children: [
					{
						title: '分销商品',
						id: '2-1',
						path: '/index/distrisshoppinglist'
					},
					{
						title: '商品审核',
						id: '2-2',
						path: '/index/distrisshoppingauditlist'
					},
					{
						title: '违规商品',
						id: '2-3',
						path: '/index/distrisgetoutshoppinglist'
					}
				]
			},{
				title: '渠道管理',
				id: '3',
				tagUrl: '/index/roid',
				icon: 'icon-qudaoguanli',
				children: [
					{
						title: '渠道数据',
						id: '3-1',
						path: '/index/roidnumber'
					}
				]
			},{
				title: '分销账户',
				id: '4',
				tagUrl: '/index/account',
				icon: 'icon-fenxiaozhanghu',
				children: [
					{
						title: '提现管理',
						id: '4-1',
						path: '/index/accountmangement'
					},
					{
						title: '结算管理',
						id: '4-2',
						path: '/index/accountsettlementmangement'
					}
				]
			}
		]
	},
	{
		title: '财务中心',
		id: '400',
		children: [{
			title: '资金账户',
			id: '1',
			tagUrl: '/index/finance',
			icon: 'icon-zijinzhanghu-',
			children: [{
				title: '收入明细',
				id: '1-1',
				path: '/index/financeincome'
			},
				{
					title: '交易明细',
					id: '1-2',
					path: '/index/financetrade'
				}
			]
		}
			// {
			//   title: '结算管理', // 版本控制功能动态添加路由
			//   id: '2',
			//   tagUrl: '/index/balance',
			//   icon: 'icon-jiesuanguanli-',
			//   children: [
			//     {
			//       title: '结算汇总',
			//       id: '2-1',
			//       path: '/index/balancesummary'
			//     },
			//     {
			//       title: '结算规则',
			//       id: '2-2',
			//       path: '/index/balancerules'
			//     }
			//   ]
			// },
			// {
			//   title: '转账管理', // 版本控制功能动态添加路由
			//   id: '3',
			//   tagUrl: '/index/transfer',
			//   icon: 'icon-tixiancishu-',
			//   children: [
			//     {
			//       title: '转账申请',
			//       id: '3-1',
			//       path: '/index/transferapply'
			//     },
			//     {
			//       title: '转账记录',
			//       id: '3-2',
			//       path: '/index/transferrecord'
			//     }
			//   ]
			// }
		]
	},
	{
		title: '运营中心',
		id: '500',
		children: [{
			title: '交易管理',
			id: '1',
			tagUrl: '/index/order',
			icon: 'icon-jiaoyi',
			children: [{
				title: '自营订单',
				id: '1-1',
				path: '/index/ordermyordermy'
			},
				{
					title: '第三方订单',
					id: '1-2',
					path: '/index/ordershop'
				}
			]
		},
			{
				title: '轮播图设置',
				id: '2',
				tagUrl: '/index/carousel',
				icon: 'icon-lunbotu-',
				children: [{
					title: '小程序轮播图',
					id: '2-1',
					path: '/index/carouselhome'
				}]
			}
		]
	},
	{
		title: '系统管理',
		id: '600',
		children: [{
			title: '流量管理',
			id: '1',
			tagUrl: '/index/traffic',
			icon: 'icon-liuliangguanli-',
			children: [{
				title: '流量账户',
				id: '1-1',
				path: '/index/trafficaccount'
			},
				{
					title: '流量明细',
					id: '1-2',
					path: '/index/trafficlist'
				}
			]
		},
			{
				title: '发布管理',
				id: '2',
				tagUrl: '/index/auth',
				icon: 'icon-fabu_huaban',
				children: [{
					title: '公众号发布',
					id: '2-1',
					path: '/index/authpublic'
				},
					{
						title: '小程序发布',
						id: '2-2',
						path: '/index/authsmallprogram'
					}
				]
			}
		]
	}
]
