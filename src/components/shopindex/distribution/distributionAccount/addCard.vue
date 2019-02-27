
<template>
    <div class="add_card_page">
	    <div class="layout-head">
		    <span>{{cardId ? "修改对公账户" : "添加对公账户"}}</span>
		    <div class="btn_box">
			    <el-button class="return_btn" type="text" @click="$router.go(-1)"><i class="iconfont icon-fanhui1"></i> 返回</el-button>
		    </div>
	    </div>
	    <div class="add_card_content">
		    <p class="detail_title w580">*开户名称</p>
		    <el-input class="w580" v-model="cardDetail.company" placeholder="请输入开户名称"></el-input>
		    <p class="detail_title w580">*开户银行</p>
		    <el-input class="w580" v-model="cardDetail.bank" placeholder="请输入开户银行"></el-input>
		    <p class="detail_title w580">*对公银行账号</p>
		    <el-input class="w580" v-model="cardDetail.bankNo" placeholder="请输入对公银行账号" @change="isNumberInput"></el-input>
		    <div class="add_card_btn">
			    <el-button v-if="cardId" type="primary" @click="setCardDetail">修改</el-button>
			    <el-button v-else type="primary" @click="addCardFunc">添加</el-button>
		    </div>
	    </div>
    </div>
</template>

<script>
	import api from 'fetch/api'
export default {
    name: 'add_card_page',
    data () {
        return {
        	cardId : this.$route.query.cardId,
			cardDetail : {
				company : null,
				bank : null,
				bankNo : null
			}
        }
    },
	created(){
    	if(this.cardId){
    		this.getCardDetail();
	    }
	},
    methods: {
    	//获取银行卡详情
	    getCardDetail(){
	    	let params = {
				id : this.cardId
		    }
	    	api.getAccountSysUserApiBank(params).then(res => {
	    	    console.log(res)
	    	    if(res.serviceCode == 'E000000000'){
	    	        this.cardDetail = res.data;
	    	    }else{
	    	        this.$message.error(res.serviceMessage);
	    	    }
	    	})
	    },
	    //修改银行卡
	    setCardDetail(){
	    	let params = {
			    id : this.cardId,
			    bankNo : this.cardDetail.bankNo,
			    company : this.cardDetail.company,
			    bank : this.cardDetail.bank
		    }
			api.editAccountSysUserApiBank(params).then(res => {
			    console.log(res)
			    if(res.serviceCode == 'E000000000'){
				    this.$message.success("修改成功");
				    this.$router.push({
					    name : 'chooseCard'
				    })
			    }else{
			        this.$message.error(res.serviceMessage);
			    }
			})
	    },
	    //添加银行卡
	    addCardFunc(){
		    let params = {
			    bankNo : this.cardDetail.bankNo,
			    company : this.cardDetail.company,
			    bank : this.cardDetail.bank
		    }
		    api.addAccountSysUserApiBank(params).then(res => {
			    console.log(res)
			    if(res.serviceCode == 'E000000000'){
				    this.$message.success("添加成功");
				    this.$router.push({
					    name : 'chooseCard'
				    })
			    }else{
				    this.$message.error(res.serviceMessage);
			    }
		    })
	    },
	    isNumberInput(val){
		    let exp =/^[0-9]+([.]{1}[0-9]{1,2})?$/;
		    if(!exp.test(val)){
			    this.$message.error("请输入正整数数字,且只能输入两位小数")
		    }
	    }
    }
}
</script>

<style lang="stylus" scoped>
.add_card_page{
	width : 100%;
	.layout-head{
		.btn_box{
			.return_btn{
				color : #9B9B9B;
				font-size 20px;
			}
		}
	}
	.add_card_content{
		background: #fff;
		text-align : center;
		overflow : hidden;
		padding : 60px 150px;
		margin-top:10px;
		.detail_title{
			text-align : left;
			margin:30px auto 5px auto;
		}
		.w580{
			width:580px;
		}
		.add_card_btn{
			width: 100%;
			margin:60px auto 0 auto;
			text-align : center;
		}
	}
}
</style>
