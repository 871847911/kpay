import {
	Get,
	Post
} from './http'
import qs from 'qs'
let variable = ''
if (process.env.NODE_ENV === 'development') {
	variable = '/local'
}

if (process.env.NODE_ENV === 'production') {
	variable = 'http://' + window.location.host
}
export default {
	//分销商品列表
	getStorePeddleGoodsList(params) {
		return Post(`${variable}/goods/peddleGoods/getStorePeddleGoodsList`, params,{
			'Content-Type': 'application/json'
		})
	},
	//商品详情
	getPeddleGoodsDetailFunc(params){
		return Post(`${variable}/goods/peddleGoods/getStroePeddleGoodsDetail`, params)
	},
	//修改商品信息
	updatePeddleApiGoods(params){
		return Post(`${variable}/promote/peddleGoods/updatePeddleGoods`, params)
	},
	//选择分销商品列表
	goodsChoice(params){
		return Post(`${variable}/goods/course/getGoodsChoice`, params)
	},
	//分销商品详情
	getCourseApiDetail(params){
		return Post(`${variable}/goods/course/getCourseDetail`, params)
	},
	//审核商品列表 || 违规商品列表
	getShenhePeddleGoodsList(params){
		return Post(`${variable}/goods/peddleGoods/getStorePeddleGoodsList`, params)
	},
	//商品分类列表
	getStorePeddleGoodsCategoryApiList(params){
		return Post(`${variable}/goods/peddleGoods/getStorePeddleGoodsCategoryList`, params)
	},
	//提交推广商品
	addPeddleApiGoods(params){
		return Post(`${variable}/promote/peddleGoods/addPeddleGoods`, params)
	},
	//修改商品上架
	openStatePeddleApiGoods(params){
		return Post(`${variable}/promote/peddleGoods/openStatePeddleGoods`, params)
	},


	//渠道数据 订单曲线图
	channelApiCurve(params){
		return Post(`${variable}/order/channelCurve`, params,{
			'Content-Type': 'application/json'
		})
	},
	//渠道数据 收益曲线图
	channelEarningApiCurve(params){
		return Post(`${variable}/trading/finance/channelEarningCurve`, params,{
			'Content-Type': 'application/json'
		})
	},
	//日 月 总 收入
	earningShouRuApi(params){
		return Post(`${variable}/trading/finance/earning`, params)
	},
	//日 月 总 订单数
	countApiOrder(params){
		return Post(`${variable}/order/channelCurve/countOrder`, params)
	},




	//个人账户详情 /trading/Amount/userAmount
	userApiAmount(params){
		return Post(`${variable}/trading/Amount/userAmount`, params)
	},
	// 提现申请记录
	withdrawApplyApiList(params){
		return Post(`${variable}/trading/withdraw/withdrawApplyList`, params)
	},
	//提现申请记录详情
	withdrawApplyApiDetail(params){
		return Post(`${variable}/trading/withdraw/withdrawApplyDetail`, params)
	},
	//提现记录
	withdrawRecordApiList(params){
		return Post(`${variable}/trading/withdraw/withdrawRecordList`, params)
	},
	//提现记录详情/trading/withdraw/withdrawDetail
	withdrawApiDetail(params){
		return Post(`${variable}/trading/withdraw/withdrawDetail`, params)
	},
	//银行卡列表 /account/sysUserbank/getAccountSysUserBankList
	getAccountSysUserBankApiList(params){
		return Post(`${variable}/account/sysUserbank/getAccountSysUserBankList`, params)
	},
	//银行卡详情 /account/sysUserbank/getAccountSysUserBank
	getAccountSysUserApiBank(params){
		return Post(`${variable}/account/sysUserbank/getAccountSysUserBank`, params)
	},
	//修改银行卡 /account/sysUserbank/editAccountSysUserBank
	editAccountSysUserApiBank(params){
		return Post(`${variable}/account/sysUserbank/editAccountSysUserBank`, params)
	},
	//添加银行卡 /account/sysUserbank/addAccountSysUserBank
	addAccountSysUserApiBank(params){
		return Post(`${variable}/account/sysUserbank/addAccountSysUserBank`, params)
	},
	//删除银行卡  /account/sysUserbank/delAccountSysUserBank
	delAccountSysUserApiBank(params){
		return Post(`${variable}/account/sysUserbank/delAccountSysUserBank`, params)
	},

	//结算记录 /trading/merchant/settlementRecord
	settlementApiRecord(params){
		return Post(`${variable}/trading/merchant/settlementRecord`, params)
	},
	//结算详情 /trading/merchant/settlementDetail
	settlementApiDetail(params){
		return Post(`${variable}/trading/merchant/settlementDetail`, params)
	},
	//结算订单数 /trading/merchant/settlementDetailEarnings
	settlementDetailApiEarnings(params){
		return Post(`${variable}/trading/merchant/settlementDetailEarnings`, params)
	},
	//提现申请 /trading/withdraw/merchantWithdraw
	merchantApiWithdraw(params){
		return Post(`${variable}/trading/withdraw/merchantWithdraw`, params)
	},
	//商户提现详情 /trading/withdraw/withdrawConfig
	withdrawApiConfig(params){
		return Post(`${variable}/trading/withdraw/withdrawConfig`, params)
	},



	//分销订单 订单列表 /order/DistributionOrderList
	DistributionOrderApiList(params){
		return Post(`${variable}/order/DistributionOrderList`, params)
	},
	//分销订单 订单详情  order/DistributionOrderDetail
	DistributionOrderApiDetail(params){
		return Post(`${variable}/order/DistributionOrderDetail`, params)
	}
}
