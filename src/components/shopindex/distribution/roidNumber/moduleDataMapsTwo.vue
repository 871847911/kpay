
<template>
    <div class="module_data_line">
		<div class="title_box">
			<div class="left">分销订单数</div>
			<div class="right">
				<el-date-picker
					v-model="startTime"
					type="date"
					@change="dateValChange($event , 'start')"
					value-format="timestamp"
					placeholder="选择开始时间">
				</el-date-picker>
				<el-date-picker
					v-model="endTime"
					type="date"
					@change="dateValChange($event , 'end')"
					value-format="timestamp"
					placeholder="选择结束时间">
				</el-date-picker>
			</div>
		</div>

	    <div class="data_box">
		    <div id="dataBoxTwo" style="width:1558px;height:400px;"></div>
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
	        startTime : null,
	        endTime : null
        }
    },
	mounted(){

		this.endTime = new Date(new Date(new Date().toLocaleDateString()).getTime()).getTime() + 86400000 -1;
		this.startTime = this.endTime- 604800000 + 1;
		this.getDataMapTwo();
	},
    methods: {
	    getDataMapTwo(){
    		let params = {
			    userId : this.$store.state.userId,
				userType : 2,
			    startDate : String(this.startTime),
			    endDate : String(this.endTime)
		    }
			api.channelApiCurve(params).then(res => {
				console.log(res)
				if(res.serviceCode=="E000000000"){
					let myChart;
					if(myChart != null && myChart != "" && myChart != undefined) {
						myChart.dispose();
					}
					myChart = echarts.init(document.getElementById('dataBoxTwo'));
					let X_line =[];
					let Y_line = [];
					res.data.forEach(val => {
						X_line.push(val.date);
						Y_line.push(val.count);
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

		    if(date == 'start'){
			    this.endTime = this.startTime + 604800000
		    }else{
			    this.startTime = this.endTime - 604800000
		    }
	    	this.getDataMapTwo();
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
