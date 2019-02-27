<template>
   <OrderDetail :data="data" :orderType="orderType" />
</template>

<script>
import api from "fetch/api";
import OrderDetail from "components/shopindex/order/OrderDetail";

export default {
  name: "OrderShopDetail",
  data() {
    return {
      data: {},
      orderType: ''
    };
  },

  components: {
    OrderDetail,
  },

  created() {
    this.init();
  },

  methods: {
    // 初始化
    init() {
      const { id, type } = this.$route.query
      
      this.judgeTypes(type)

      api
        .getCourseOrderInfo({ id })
        .then(res => {
          if(res.data){
            const { status, channelType } = res.data
            const chTypes = ['普通订单','赠送','拼团','分享','分销']
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
