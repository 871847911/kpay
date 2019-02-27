
<template>
    <div class="choose_card_page">
	    <div class="layout-head">
		    <span>银行卡管理</span>
		    <div class="btn_box">
			    <el-button class="return_btn" type="text" @click="$router.go(-1)"><i class="iconfont icon-fanhui1"></i> 返回</el-button>
			    <el-button type="primary" @click="toAddCardPage">添加对公账户</el-button>
		    </div>
	    </div>
	    <div class="card_content_box">
		    <el-row :gutter="20">
			    <el-col v-for="(item,index) in cardList" :key="index" :span="6" class="top20">
				    <div class="card_box " :class="{bg1 : index%2 == 0 , bg2 : index%2 == 1}">
					    <p class="card_comp_title">
						    {{item.bank}}
						    <i class="iconfont icon-lajitong-" @click="deleteCard(item.id)"></i>
						    <i class="iconfont icon-yinhangqiabianji-" @click="setCard(item.id)"></i>
					    </p>
					    <p class="card_num">{{item.bankNo}}</p>
					    <p class="comp_name">{{item.company}}</p>
				    </div>
			    </el-col>
		    </el-row>
	    </div>
    </div>
</template>

<script>
	import api from 'fetch/api'
export default {
    name: 'choose_card_page',
    data () {
        return {
			cardList : []
        }
    },
	created(){
    	this.getChooseCardSysUserBankListFunc();
	},
    methods: {
	    //获取银行卡列表
	    getChooseCardSysUserBankListFunc(){
		    let params = {

		    }
		    api.getAccountSysUserBankApiList(params).then(res => {
			    console.log(res)
			    if(res.serviceCode == 'E000000000'){
				    this.cardList = res.data;
			    }else{
				    this.$message.error(res.serviceMessage);
			    }
		    })
	    },
	    //修改银行卡
	    setCard(id){
		    this.$router.push({
			    name : 'addCard',
			    query : {
			    	cardId : id
			    }
		    })
	    },
	    //删除银行卡
	    deleteCard(id){
	    	let params = {
				id : id
		    }
			api.delAccountSysUserApiBank(params).then(res => {
			    console.log(res)
			    if(res.serviceCode == 'E000000000'){
				    this.$message.success("删除成功");
				    this.getChooseCardSysUserBankListFunc();
			    }else{
			        this.$message.error(res.serviceMessage);
			    }
			})
	    },
	    toAddCardPage(){
	    	this.$router.push({
			    name : 'addCard'
		    })
	    }
    }
}
</script>

<style lang="stylus" scoped>
	.choose_card_page{
		width : 100%;
		.layout-head{
			.btn_box{
				.return_btn{
					color : #9B9B9B;
					font-size 20px;
				}
			}
		}
		.card_content_box{
			background: #fff;
			overflow : hidden;
			padding : 0.3rem 0.25rem;
			.top20{
				margin-top:0.2rem;
			}
			.card_box{
				padding: 0.4rem 0.2rem;
				border-radius : 5px;
				color: #fff;
				text-align : center;
				.iconfont{
					float : right;
					margin-left : 10px;
					cursor : pointer;
				}
				.card_comp_title{
					font-size : 0.16rem;
					text-align : left;
				}
				.card_num{
					font-size : 0.24rem;
					margin-top:0.5rem;
				}
				.comp_name{
					margin-top:0.3rem;
					font-size : 0.14rem
				}
			}
			.bg1{
				background: url("../../../../assets/image/cardBg01.jpg") no-repeat ;
				background-size : cover;
			}
			.bg2{
				background: url("../../../../assets/image/cardBg02.png") no-repeat ;
				background-size : cover;
			}
		}
	}

</style>
