<template>

	<orderDetailType5 v-if="type == 5" :data="data"></orderDetailType5>
	<OrderDetail v-else :data="data" :orderType="orderType" />
</template>

<script>
	import api from "fetch/api";
	import OrderDetail from "components/shopindex/order/OrderDetail";
	import orderDetailType5 from 'components/shopindex/order/OrderDetailType5'
	export default {
		name: "OrderMyDetail",
		data() {
			return {
				data: {},
				orderType: '',
				type : null
			};
		},

		components: {
			OrderDetail,
			orderDetailType5
		},

		created() {
			this.type = this.$route.query.type
			this.init();
		},

		methods: {
			// 初始化
			init() {
				let { id, type } = this.$route.query
				this.judgeTypes(type)
				if(this.$route.query.type != 5){
					api.getCourseOrderInfo({ id }).then(res => {
						if(res.data){
							const { status, channelType } = res.data
							const chTypes = ['普通订单','赠送订单','拼团订单','分享订单','分销订单']
							let statusStr = ''

							switch (status) {
								case 1:
									statusStr = "待支付";
									break;
								case 2:
									statusStr = "已支付";
									break;
								case 3:
									statusStr = "已失效";
									break;
							}

							this.data = {...res.data}
							this.data.statusStr = statusStr
							this.data.channelTypeStr = chTypes[channelType - 1]
						}
					})
				}
			},

			// 判断类别
			judgeTypes(type){
				if(type){
					if(typeof type === "string"){
						type = parseInt(type, 10)
					}

					switch (type) {
						case 3:
							this.orderType = "group";
							break;
						case 4:
							this.orderType = "share";
							break;
						case 5:
							this.orderType = "sale";
							break;
					}
				}
			},

			// 返回
			toBack() {
				this.$router.back()
			}
		}
	};
</script>

<style lang="stylus" scoped>

</style>
