<template>
  <div style="width:100%;">
    <GraphicComponents :name="name"></GraphicComponents>
  </div>
</template>

<script>
  import GraphicComponents from './GraphicComponents'
  export default {
    name: "MycolumnCoVerifyDetail",
    data() {
      return {
        name:""
      };
    },

    created(){
      this.name=this.$route.query.idex
    },

    components:{
      GraphicComponents
    },

    mounted(){
    
    },

    methods: {
      
    }
  };
</script>


