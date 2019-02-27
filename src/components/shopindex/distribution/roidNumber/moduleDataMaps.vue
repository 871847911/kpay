
<template>
    <div class="module_data_line">
		<div class="title_box">
			<div class="left">分销收入</div>
			<div class="right">
				<el-date-picker
					v-model="timeScope"
					type="daterange"
					range-separator="至"
					start-placeholder="开始时间"
					end-placeholder="结束时间"
					@change="dateValChange($event)"
					value-format="timestamp">
				</el-date-picker>
			</div>
		</div>

	    <div class="data_box">
		    <div id="dataBoxOne" style="width:1558px;height:400px;"></div>
	    </div>
    </div>
</template>

<script>
	import api from 'fetch/api'
export default {
    name: 'module_data_line',
    data () {
        return {
			dataVal :'',
			timeScope : []
        }
    },
	created(){
		this.timeScope[1] = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() + 86400000 -1;
		this.timeScope[0] = this.timeScope[1] - 604800000 + 1;
		this.getDataMapOne();
	},
    methods: {
    	getDataMapOne(){
    		let params = {
			    userId : this.$store.state.userId,
			    startDate : String(this.timeScope[0]),
			    endDate : String(this.timeScope[1])
		    }
			api.channelEarningApiCurve(params).then(res => {
				console.log(res)
				if(res.serviceCode=="E000000000"){
					let myChart;
					if(myChart != null && myChart != "" && myChart != undefined) {
						myChart.dispose();
					}
					myChart = echarts.init(document.getElementById('dataBoxOne'));
					let X_line =[];
					let Y_line = [];
					res.data.forEach(val => {
						X_line.push(val.date);
						Y_line.push(val.money);
					})
					myChart.setOption({
						tooltip: {
							trigger: 'axis'
						},
						grid: {
							left: '3%',
							right: '3%',
							top : '3%',
							bottom: '3%',
							containLabel: true
						},

						xAxis: {
							type: 'category',
							boundaryGap: false,
							data: X_line
						},
						yAxis: {},
						series: [{
							name: '收入/元',
							type: 'line',
							data: Y_line
						}]
					});
				}else{
					this.$message.error(res.serviceMessage)
				}
			})
	    },
	    dateValChange(val,date){
	    	this.getDataMapOne();
	    }
    }
}
</script>

<style lang="stylus" scoped>
	.module_data_line{
		padding-top : 10px;
		.title_box{
			color: #9b9b9b;
			padding:20px 0;
			overflow : hidden;
			.left{
				float : left;
			}
			.right{
				float : right;

			}
		}
		.data_box{

			#dataBoxOne{

			}
		}

	}
</style>
