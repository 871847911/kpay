
<template>
    <div class="roid_data_page">
	    <div class="layout-head">
		    <span>渠道数据</span>
	    </div>
	    <div class="roid_top_content">
		    <el-tabs v-model="activeName" @tab-click="handleClick">
			    <el-tab-pane label="收益" name="0">
					<div class="shouyi_box">
						<div class="box__main">
							<div class="box__main_left bg_1">
								<i class="iconfont icon-jinrishouru-"></i>
							</div>
							<div class="box__main_right">
								<p class="bold">&yen;{{shouruObj.todayEarning}}</p>
								<p class="small">今日收入</p>
							</div>
						</div>

						<div class="box__main">
							<div class="box__main_left bg_2">
								<i class="iconfont icon-benyueshouru-"></i>
							</div>
							<div class="box__main_right">
								<p class="bold">&yen;{{shouruObj.monthEarning}}</p>
								<p class="small">本月收入</p>
							</div>
						</div>

						<div class="box__main">
							<div class="box__main_left bg_3">
								<i class="iconfont icon-leijishouru-"></i>
							</div>
							<div class="box__main_right">
								<p class="bold">&yen;{{shouruObj.totalEarning}}</p>
								<p class="small">累计收入</p>
							</div>
						</div>
					</div>
			    </el-tab-pane>
			    <el-tab-pane label="订单数" name="1">
				    <div class="shouyi_box">
					    <div class="box__main">
						    <div class="box__main_left bg_1">
							    <i class="iconfont icon-jinrishouru-"></i>
						    </div>
						    <div class="box__main_right">
							    <p class="bold">{{accountObj.todayOrder}}</p>
							    <p class="small">今日订单</p>
						    </div>
					    </div>

					    <div class="box__main">
						    <div class="box__main_left bg_2">
							    <i class="iconfont icon-benyueshouru-"></i>
						    </div>
						    <div class="box__main_right">
							    <p class="bold">{{accountObj.monthOrder}}</p>
							    <p class="small">本月订单</p>
						    </div>
					    </div>

					    <div class="box__main">
						    <div class="box__main_left bg_3">
							    <i class="iconfont icon-leijishouru-"></i>
						    </div>
						    <div class="box__main_right">
							    <p class="bold">{{accountObj.totalOrder}}</p>
							    <p class="small">累计订单</p>
						    </div>
					    </div>
				    </div>
			    </el-tab-pane>
		    </el-tabs>
	    </div>

	    <dataMap v-if="activeName == 0" :active="activeName"></dataMap>
	    <dataMapTwo v-if="activeName == 1" :active="activeName"></dataMapTwo>
    </div>
</template>

<script>
	import dataMap from './moduleDataMaps'
	import dataMapTwo from './moduleDataMapsTwo'
	import api from 'fetch/api'
export default {
    name: 'roid_data_page',
    data () {
        return {
	        activeName : 0,
	        shouruObj : {},
	        accountObj : {}
        }
    },
	components : {
		dataMap,
		dataMapTwo
	},
	create(){
		if(this.activeName == 0){
			this.earningShouRuFunc();
		}else{
			this.countOrderFunc();
		}
	},
	watch: {
		activeName(val){
			if(val == 0){
				this.earningShouRuFunc();
			}else{
				this.countOrderFunc();
			}
		}
	},
    methods: {
    	//获取总订单数
	    countOrderFunc(){
	    	let params = {
			    userId : this.$store.state.userId,
				userType : 2
		    }
	    	api.countApiOrder(params).then(res => {
	    	    console.log(res)
	    	    if(res.serviceCode == 'E000000000'){
	    	        this.accountObj = res.data;
	    	    }else{
	    	        this.$message.error(res.serviceMessage);
	    	    }
	    	})
	    },
	    //获取日月总收入
	    earningShouRuFunc(){
	    	console.log(this.$store.state)
	    	let params = {
			    userId : this.$store.state.userId,
			    userType : 2
		    }
	    	api.earningShouRuApi(params).then(res => {
	    	    console.log(res)
	    	    if(res.serviceCode == 'E000000000'){
	    	        this.shouruObj = res.data;
	    	    }else{
	    	        this.$message.error(res.serviceMessage);
	    	    }
	    	})

	    },
		handleClick(tab, event) {
			console.log(tab, event);
		}
    }
}
</script>

<style lang="stylus" scoped>
	.roid_data_page{
		width:100%;
		.roid_top_content{
			background: #fff;
			padding : 20px;
			overflow : hidden;
			margin-top:20px;
			.shouyi_box{
				width : 100%;
				box-sizing : border-box;
				display : flex;
				.box__main{
					flex : 1;
					padding : 40px;
					border-right : 1px solid #ddd;
					.box__main_left{
						width:60px;
						height:60px;
						border-radius : 50%;
						color: #fff;
						text-align : center;
						line-height : 60px;
						float : left;
						.iconfont{
							font-size : 40px;
						}
					}
					.box__main_right{
						float: left ;
						line-height : 30px;
						padding-left : 30px;
						.bold{
							font-size : 30px;
						}
						.small{
							color: #9B9B9B;
						}
					}
					.bg_1{
						background : #FAA7BB;
					}
					.bg_2{
						background : #76D8C6;
					}
					.bg_3{
						background : #8AB8F3;
					}
					.bg_4{
						background  : #9FB6FF;
					}
					.bg_5{
						background  : #90DDF5;
					}
					.bg_4{
						background  : #F9A3D6;
					}

				}
			}
		}
	}
</style>
