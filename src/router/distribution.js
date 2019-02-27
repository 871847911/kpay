export default [
	{
		path: 'distributionself',
		name: 'distributionSelf',
		component: resolve => require(['@/components/shopindex/distribution/self/selfShopping'], resolve)
	},


	{
		path: 'distrisshoppinglist',//商品列表
		name: 'shoppingList',
		component: resolve => require(['@/components/shopindex/distribution/contentManagement/distributionShoppingList'], resolve)
	},
	{
		path: 'distrisshoppinglistapplyshopping',//申请分销
		name: 'applyShopping',
		component: resolve => require(['@/components/shopindex/distribution/contentManagement/applyShopping'], resolve)
	},
	{
		path: 'distrisshoppinglistdetail',//商品列表商品详情
		name: 'shoppingListDetail',
		component: resolve => require(['@/components/shopindex/distribution/contentManagement/shoppingDetail'], resolve)
	},
	{
		path: 'distrisshoppingauditlist',//商品审核
		name: 'auditShoppingList',
		component: resolve => require(['@/components/shopindex/distribution/contentManagement/auditShoppingList'], resolve)
	},
	{
		path: 'distrisshoppingauditlistdetail',//商品审核商品详情
		name: 'auditShoppingDetail',
		component: resolve => require(['@/components/shopindex/distribution/contentManagement/auditShoppingDetail'], resolve)
	},
	{
		path: 'distrisgetoutshoppinglist',//违规商品
		name: 'getOutShoppingList',
		component: resolve => require(['@/components/shopindex/distribution/contentManagement/getOutShoppingList'], resolve)
	},
	{
		path: 'distrisGetOutShoppingListDetail',//违规商品详情
		name: 'getOutShoppingDetail',
		component: resolve => require(['@/components/shopindex/distribution/contentManagement/shoppingDetail'], resolve)
	},
	{
		path: 'roidnumber',//渠道管理  渠道数据
		name: 'roidNumber',
		component: resolve => require(['@/components/shopindex/distribution/roidNumber/roidData'], resolve)
	},
	{
		path: 'accountmangement',//分销账户  提现管理
		name: 'accountMangement',
		component: resolve => require(['@/components/shopindex/distribution/distributionAccount/accountMangement'], resolve)
	},
	{
		path: 'accountsettlementmangement',//分销账户  结算管理
		name: 'settlementMangement',
		component: resolve => require(['@/components/shopindex/distribution/distributionAccount/settlementMangement'], resolve)
	},
	{
		path: 'accountsettlementmangementdetail',//分销账户  结算详情
		name: 'settlementDetail',
		component: resolve => require(['@/components/shopindex/distribution/distributionAccount/settlementDetail'], resolve)
	},
	


	{
		path: 'accountmangementchoosemoney',//分销账户  结算管理
		name: 'chooseMoney',
		component: resolve => require(['@/components/shopindex/distribution/distributionAccount/chooseMoney'], resolve)
	},
	{
		path: 'accountmangementchoosecard',//分销账户  选择银行卡
		name: 'chooseCard',
		component: resolve => require(['@/components/shopindex/distribution/distributionAccount/chooseCard'], resolve)
	},
	{
		path: 'accountmangementaddcard',//分销账户  添加对公账户
		name: 'addCard',
		component: resolve => require(['@/components/shopindex/distribution/distributionAccount/addCard'], resolve)
	}

]
