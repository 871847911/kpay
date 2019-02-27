
<template>
    <div class="step_line">
		<div class="flex_box" >
			<template v-for="(item,index) in data">
				<div class="number_box" :class="{'is_active' :index <= value }">
					<span v-if="index >= value">{{index+1}}</span>
					<i v-if="index < value" class="iconfont icon-gou-"></i>
				</div>
				<div class="title_box" :class="{'is_active' :index <= value }">
					{{item.title}}
				</div>
				<div class="line_box" v-if="(index+1) != data.length"><div class="line"></div></div>
			</template>

		</div>
    </div>
</template>

<script>
export default {
    name: 'step_line',
	props : {
		value : {
			type : Number,
			request : true
		},
		data : {
			type : Array,
			request : true
		}
	},
    data () {
        return {

        }
    },

    methods: {

    }
}
</script>

<style lang="stylus" scoped>
	.step_line{
		.flex_box{
			display :  flex;
			.number_box{
				width:32px;
				height:32px;
				box-sizing : border-box;
				line-height :32px;
				text-align : center;
				border-radius : 50%;
				background: #fff;
				border : 1px solid #9B9B9B;
				color: #9B9B9B;
				font-size : 16px;
				span{
					display : inline-block;
				}
			}
			.number_box.is_active{
				/*background: #6CDDC7;*/
				border : 1px solid #6CDDC7;
				color: #6CDDC7;
				box-sizing : border-box;
			}
			.title_box{
				height:32px;
				line-height :32px;
				padding-left : 10px;
				box-sizing : border-box;
			}
			.title_box.is_active{
				font-weight :bold;
			}
			.line_box{
				flex : 1;
				display : flex;
				flex-direction : column;
				justify-content :center;
				padding : 0 10px;
				box-sizing : border-box;
				.line{
					width:100%;
					height:2px;
					background: #E6E6E6;
				}
			}
		}
	}
</style>
