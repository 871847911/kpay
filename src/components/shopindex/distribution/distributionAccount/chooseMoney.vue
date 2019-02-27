
<template>
    <div class="choose_money_page">
	    <div class="layout-head">
		    <span>提现申请</span>
		    <div class="btn_box">
			    <el-button class="return_btn" type="text" @click="$router.go(-1)"><i class="iconfont icon-fanhui1"></i> 返回</el-button>
		    </div>
	    </div>
	    <el-alert :title="`一个月共可提现${shopPriceDetail.totalCount}次，本月还可提现 ${shopPriceDetail.count} 次；大于 ${shopPriceDetail.minAmount}元才能提现`" type="warning" show-icon></el-alert>
	    <div class="choose_money_page_box">
			<p class="price_title">{{userChooseMoneyPriceNum}}</p>
		    <p class="price_small">可提现金额</p>
		    <div class="line"></div>
		    <p class="detail_title w360">*银行卡</p>
		    <el-select v-model="priceCardVal" placeholder="请选择储蓄卡银行" class="w360">
			    <el-option v-for="item in priceCardOption" :key="item.id" :label="item.bank" :value="item.id"></el-option>
		    </el-select>
		    <p class="guanliyinhangka w360" @click="toChooseCardPage">管理银行卡</p>
		    <p class="detail_title w360">*金额</p>
		    <el-input class="w360" v-model="priceNumVal" placeholder="请输入提现金额" @change="isNumberInput">
			    <template slot="append">元</template>
		    </el-input>
		    <div class="tixian_btn">
			    <el-button type="primary" @click="requestGetMouney">提现</el-button>
		    </div>

	    </div>
    </div>
</template>

<script>
	import api from 'fetch/api'
export default {
    name: 'choose_money_page',
    data () {
        return {
	        priceCardOption : [],
	        priceCardVal : null,//银行卡id,
	        userChooseMoneyPriceNum : null,
	        priceNumVal : null,//提现金额
			shopPriceDetail : {}
        }
    },
	created(){
    	this.userChooseMoneyAmountFunc();
    	this.withdrawConfigFunc();
    	this.getAccountSysUserBankListFunc();
	},
    methods: {
    	//获取用户账户详情
	    userChooseMoneyAmountFunc(){
		    let params ={
			    userId : this.$store.state.userId,
			    userType : 2
		    }
		    api.userApiAmount(params).then(res => {
			    console.log(res)
			    if(res.serviceCode == 'E000000000'){
				    this.userChooseMoneyPriceNum = res.data.balance;
			    }else{
				    this.$message.error(res.serviceMessage);
			    }
		    })
	    },
		//获取商户可提现详情
		withdrawConfigFunc(){
	    	let params = {
				userId : this.$store.state.userId,
				userType : 2
			}
	    	api.withdrawApiConfig(params).then(res => {
	    	    console.log(res)
	    	    if(res.serviceCode == 'E000000000'){
	    	        this.shopPriceDetail = res.data;
	    	    }else{
	    	        this.$message.error(res.serviceMessage);
	    	    }
	    	})
		},
	    //获取银行卡列表
	    getAccountSysUserBankListFunc(){
	    	let params = {

		    }
	    	api.getAccountSysUserBankApiList(params).then(res => {
	    	    console.log(res)
	    	    if(res.serviceCode == 'E000000000'){
	    	        this.priceCardOption = res.data;
	    	    }else{
	    	        this.$message.error(res.serviceMessage);
	    	    }
	    	})
	    },
	    //提现
	    requestGetMouney(){

			let exp =/^[0-9]+([.]{1}[0-9]{1,2})?$/;
			if(!exp.test(this.priceNumVal)){
				this.priceNumVal = null
				this.$message.error("请输入正整数数字,且只能输入两位小数")
			}else if(this.shopPriceDetail.count == 0){
				this.$message.error("本月可提现次数不足")
			}else if(this.priceNumVal < this.shopPriceDetail.minAmount){
				this.priceNumVal = null
				this.$message.error(`大于 ${this.shopPriceDetail.minAmount} 元才可提现`)
			}else if(this.priceNumVal > this.userChooseMoneyPriceNum){
				this.priceNumVal = null
				this.$message.error("不能大于可提现余额")
			}else{
				if(!this.priceCardVal){
					this.$message.error("请选择银行卡");
				}else if(!this.priceNumVal){
					this.$message.error("请输入提现金额");
				}else{
					let params = {
						amount : this.priceNumVal,
						bankId : this.priceCardVal,
						userId : this.$store.state.userId
					}
					api.merchantApiWithdraw(params).then(res => {
						console.log(res)
						if(res.serviceCode == 'E000000000'){
							// this. = res.data;
							if(res.data.success){
								this.$message.success("提现申请成功")
								this.userChooseMoneyAmountFunc();
								this.$router.push({
									name : 'accountMangement'
								})
							}else{
								this.$message.error(res.data.errorMsg);
							}
						}else{
							this.$message.error(res.serviceMessage);
						}
					})

				}
			}


	    },
    	//选择银行卡
	    toChooseCardPage(){
	    	this.$router.push({
			    name : 'chooseCard'
		    })
	    },
	    isNumberInput(val){

	    }
    }
}
</script>

<style lang="stylus" scoped>
.choose_money_page{
	width:100%;
	.layout-head{
		.btn_box{
			.return_btn{
				color : #9B9B9B;
				font-size 20px;
			}
		}
	}
	.choose_money_page_box{
		background: #fff;
		text-align : center;
		overflow : hidden;
		padding : 60px 150px;
		margin-top:10px;
		.price_title{
			color: #6CDDC7;
			font-size : 30px;
			font-weight : bold;
		}
		.price_small{
			color: #9B9B9B;
			margin-top:10px;
		}
		.line{
			margin-top:30px;
			width:100%;
			height:1px;
			background: #E6E6E6;
		}
		.w360{
			width:360px;
		}
		.detail_title{
			text-align : left;
			margin:30px auto 5px auto;
		}
		.guanliyinhangka{
			color: #6CDDC7;
			text-align : right;
			margin : 10px auto 0 auto;
			cursor : pointer;
		}
		.tixian_btn{
			width: 100%;
			margin:60px auto 0 auto;
			text-align : center;
		}
	}
}
</style>
