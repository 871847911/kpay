
<template>
    <div class="apply_shopping">
	    <div class="layout-head">
		    <span>申请分销商品</span>
		    <div class="btn_box">
			    <el-button class="return_btn" type="text" @click="$router.go(-1)"><i class="iconfont icon-fanhui1"></i> 返回</el-button>
			    <el-button type="primary" @click="shenheShoppingDalogBoxShow = true">审核规则说明</el-button>
		    </div>
	    </div>

	    <div class="content_box">
		    <div class="content_box_main">
			    <step v-model="active" :data="stepData"></step>
			    <div class="active_one_box" v-show="active == 0">
				    <p>商品封面</p>
				    <p class="small_text top2">建议尺寸400*300，大小不超过2M，支持Jpg、Png格式</p>
				    <img class="shopping_img_head top10" :src="shoppingDetail.imageUrl" alt="">
				    <p class="top20">商品类型</p>
				    <el-input class="width580 top5" v-model.trim="shoppingLeixing" placeholder="请输入商品类型" :disabled="true"></el-input>
				    <p class="top20">商品名称</p>
				    <el-input class="width580 top5" v-model.trim="courseName" placeholder="请输入商品名称"></el-input>
				    <p class="top20">商品简介</p>
				    <div class="width100 top5">
					    <quill-editor @change="editorValue" :editorValue="editorHtml"></quill-editor>
				    </div>
				    <div class="btn_box">
					    <el-button type="primary" @click="getActiveIndex(1)">下一步</el-button>
				    </div>
			    </div>
			    <div class="active_two_box" v-show="active == 1">
					<div class="active_input_flex_box">
						<div class="left">
							平台抽成
						</div>
						<div class="right">
							分销价格
						</div>
					</div>
				    <div class="active_input_flex_box top5">
					    <div class="left">
						    <el-input placeholder="请输入平台抽成" v-model.trim="pingtaiyongjing" @change="isNumInput($event,'pingtaiyongjing')" :disabled="true">
							    <template slot="append">%</template>
						    </el-input>
					    </div>
					    <div class="right">
						    <el-input placeholder="请输入分销价格" v-model.trim="fenxiaojiage" @change="isNumInput($event,'fenxiaojiage')">
							    <template slot="append">元</template>
						    </el-input>
					    </div>
				    </div>





				    <div class="active_input_flex_box top20">
					    <div class="left">
						    推客佣金
					    </div>
					    <div class="right">

					    </div>
				    </div>
				    <div class="active_input_flex_box top5">
					    <div class="left">
						    <el-input v-model.trim="tuikeyongjin" placeholder="请输入推客佣金" @change="isNumInput($event , 'tuikeyongjin')">
							    <template slot="append">%</template>
						    </el-input>
					    </div>
					    <div class="right">

					    </div>
				    </div>




				    <div class="active_input_flex_box top20">
					    <div class="left">
						    商品分类
					    </div>
					    <div class="right">

					    </div>
				    </div>
				    <div class="active_input_flex_box top5">
					    <div class="left">
						    <el-select v-model="yijifenleiVal" class="width100" placeholder="一级分类" @change="yijifenleiChange">
							    <el-option v-for="(item,index) in yijifenleiOptions" :key="index" :label="item.name" :value="item.id" ></el-option>
						    </el-select>
					    </div>
					    <div class="right">
						    <el-select v-model="erjifenleiVal" class="width100" placeholder="二级分类">
							    <el-option v-for="(item,index) in erjifenleiOptions" :key="index" :label="item.name" :value="item.id"></el-option>
						    </el-select>
					    </div>
				    </div>




				    <div class="active_input_flex_box top20">
					    <div class="left">
						    推文链接
					    </div>
					    <div class="right">

					    </div>
				    </div>
				    <div class="active_input_flex_box top5">
					    <div class="center">
						    <el-input placeholder="请输入内容" v-model.trim="tuiwenlianjie"></el-input>
					    </div>
				    </div>



				    <div class="btn_box">
					    <el-button @click="getActiveIndex(0)">上一步</el-button>
					    <el-button type="primary" class="left10" @click="dalogShow = true">提交申请</el-button>
				    </div>
			    </div>
		    </div>

	    </div>


	    <el-dialog class="choose_shopping_dalog_box" top="35vh" title="课程审核" :visible.sync="dalogShow" width="50%">
		    <div class="dalog_main_box">
			    为保证学兽推客大厅良好的运营环境，我们将对您上传的课程进行安全检测，检测时间约为24小时，届时将以店铺通知形式告知您是否通过安全检测，请耐心等待。
			    <p style="margin-top : 20px;">在此期间，您可以在【商品审核】查看您提交审核的商品详情。</p>

		    </div>

		    <span slot="footer" class="dialog-footer">
			    <el-button @click="dalogShow = false">取 消</el-button>
			    <el-button type="primary" @click="toShoppingDetailPage">确定提交</el-button>
		    </span>
	    </el-dialog>


	    <el-dialog class="shenhe_shopping_dalog_box" top="8vh" title="审核规则说明" :visible.sync="shenheShoppingDalogBoxShow" width="50%">
		    <div class="dalog_main_box">
			    <p>审核规则如下:</p>
			    <p class="bold top20 size16">（一）课程名称</p>
			    <p class="top10">1 ）课程名称或介绍涉及“日/月赚xx元”“0成本赚钱”“时时彩”“翻墙”等不实宣传及违规内容，则审核不通过；</p>
			    <p class="top5">2 ）商品标题不得涉及色情、暴力、盗版、预测、赌博、彩票、伪科学等有违反法律、行政法规的内容。商品标题字符限制200个字符。</p>
			    <p class="bold top20 size16">（二）课程分类</p>
			    <p class="top10">1 ）课程名称及课程所描述内容必须与课程一级和二级类目一致，如不一致则审核不通过。</p>
			    <p class="bold top5">课程分类:</p>
			    <p class="top5">1 ）个人提升：个人提升、阅读听书、沟通表达、时间管理；    </p>
			    <p class="top5">2 ）职场提升：通用技能、求职加薪、职业规划、PPT技能；</p>
			    <p class="top5">3 ）美体瘦身：瑜伽、健身、塑形、瘦身； </p>
			    <p class="top5">4 ）女性时尚：时尚穿搭、护肤美妆、气质提升； </p>
			    <p class="top5">5 ）母婴亲子：母婴育儿、孕产、儿童护理；</p>
			    <p class="top5">6 ）情感心理：心理成长、恋爱技巧、婚姻经营、两性关系；</p>
			    <p class="top5">7 ）在线教育：兴趣教育、小初高、学历提升、K12教育、英语培训、留学考试、职称技能、公务求职、早教幼教； </p>
			    <p class="top5">8 ）健康养生：中医护理、养生康复、医疗健康； </p>
			    <p class="top5">9 ）商业经管：营销推广、互联网、区块链、人力资源、团队管理、创业增长；</p>
			    <p class="top5">10）理财楼市：理财投资、基金股票、房地产； </p>
			    <p class="top5">11 ）生活文艺：摄影文艺、美食、绘画、音乐、体育、游戏、乐器、书法、茶艺、舞蹈、萌宠。 </p>
			    <p class="top5">12 ）其他</p>
			    <p class="bold top20 size16">（三）课程封面</p>
			    <p class="top10">1 ）课程封面图片禁止出现赠送、优惠、价格、点击报名等宣传广告信息； </p>
			    <p class="top5">2 ）课程封面不能含有电话号码，QQ号码，QQ群号，YY号码，二维码，网站链接等； </p>
			    <p class="top5">3 ）课程封面图片文字显示不完整或人物头部被裁切显示不全；</p>
			    <p class="bold top20 size16">（四）课程详情</p>
			    <p class="top10">1 ）课程详情中含有店铺链接和商品促销信息；</p>
			    <p class="top5">2 ）课程详情中含有自有公众号二维码、客服联系方式； </p>
			    <p class="top5">3 ）详情页中含有自有店铺相关的文字或图片广告及水印； </p>
			    <p class="top5">4 ）内容方明示有附带赠送服务或商品但无法为渠道方提供的商品，附赠服务包括微信群、免费资料文件等； </p>
			    <p class="top5">5 ）课程详情需与课程类目、课程标题、课程封面内容一致；</p>
			    <p class="top5">6 ）课程概况中不得出现引导平台外的支付信息； </p>
			    <p class="top5">7 ）课程概况中的价格介绍需与课程价格一致，免费课程的课程概述中不得出现其他收费标准，同时也不得出现“无效退款”等字样。</p>

		    </div>

		    <!--<span slot="footer" class="dialog-footer">-->
			    <!--<el-button @click="dalogShow = false">取 消</el-button>-->
			    <!--<el-button type="primary">确定提交</el-button>-->
		    <!--</span>-->
	    </el-dialog>
    </div>
</template>

<script>
	import api from 'fetch/api'
	import step from '../module/stepLine'
	import QuillEditor  from 'components/common/Quilleditor'
export default {
    name: 'apply_shopping',
    data () {
        return {
	        shoppingDetail : {},
	        shoppingLeixing : '',
	        courseName : '', // 商品名称
	        fenxiaojiage : 0, // 分销价格
	        tuikeyongjin : 0, //推客佣金
	        pingtaiyongjing : 5, // 平台佣金
	        tuiwenlianjie : '', //推文链接
	        active : 0,
	        stepData : [
		        {title : '设置商品信息'},
		        {title : '设置分销信息'}
	        ],
	        dalogShow : false,
			DAdalogShow : false,
	        shenheShoppingDalogBoxShow : false,
	        editorHtml : '',//商品简介
	        yijifenleiOptions : [], //商品一级分类列表
	        yijifenleiVal : null,  //商品一级分类
	        erjifenleiOptions : [], //商品二级分类列表
	        erjifenleiVal : null,
	        options: [{
		        value: '选项1',
		        label: '黄金糕'
	        }, {
		        value: '选项2',
		        label: '双皮奶'
	        }, {
		        value: '选项3',
		        label: '蚵仔煎'
	        }, {
		        value: '选项4',
		        label: '龙须面'
	        }, {
		        value: '选项5',
		        label: '北京烤鸭'
	        }],
	        value: ''
        }
    },
	components : {
		step,
		QuillEditor
	},
	destroyed(){
    	this.dalogShow = false;
	},
	created(){
    	this.getShoppingDetail();
    	this.getStorePeddleGoodsCategoryApiListOneFunc();
	},
	methods: {
    	//获取商品详情
    	getShoppingDetail(){
		    let params = {
			    courseId : this.$route.query.courseId
		    }
		    api.getCourseApiDetail(params).then(res => {
			    if(res.serviceCode == "E000000000"){
				    this.shoppingDetail = res.data;
				    this.shoppingLeixing = res.data.goodsType == 0 ? '课程' : '';
				    this.courseName = res.data.courseName;
				    this.editorHtml = res.data.courseIntroduction;
				    this.pingtaiyongjing = res.data.platformRate;
			    }else{
				    this.$message.error(res.serviceMessage)
			    }
		    })
	    },
		//获取一级商品分类列表
		getStorePeddleGoodsCategoryApiListOneFunc(){
    		let params = {}
    		api.getStorePeddleGoodsCategoryApiList(params).then(res => {
			    if(res.serviceCode == "E000000000"){
			    	this.yijifenleiOptions = res.data;
			    }else{
				    this.$message.error(res.serviceMessage)
			    }
		    })
		},
		yijifenleiChange(id){
    		this.erjifenleiVal = null;
    		let parent = this.yijifenleiOptions.find(item => {
			    return item.id === id;//筛选出匹配数据
		    })
			let params = {
				parentId : id,
				code : parent.number,
				name : parent.name
			}
			api.getStorePeddleGoodsCategoryApiList(params).then(res => {
				if(res.serviceCode == "E000000000"){
					this.erjifenleiOptions = res.data;
				}else{
					this.$message.error(res.serviceMessage)
				}
			})
		},
		isNumInput(val , data){
			// var regStrs = [
			// 	['^0(\\d+)$', '$1'], //禁止录入整数部分两位以上，但首位为0
			// 	['[^\\d\\.]+$', ''], //禁止录入任何非数字和点
			// 	['\\.(\\d?)\\.+', '.$1'], //禁止录入两个以上的点
			// 	['^(\\d+\\.\\d{2}).+', '$1'] //禁止录入小数点后两位以上
			// ];
			// for (var i = 0; i < regStrs.length; i++) {
			// 	var reg = new RegExp(regStrs[i][0]);
			// 	inputnam = inputnam.replace(reg, regStrs[i][1]);
			// }
			console.log(val)
			// let exp =/^[0]?[1-9]*([.]{1}[0-9]{1,2})?$/;
			let exp = /^(([1-9][0-9]*)|(([0]\.\d{1,2}|[1-9][0-9]*\.\d{1,2})))$/;
			if(!exp.test(val)){
				this.$message.error("请输入正整数数字,且只能输入两位小数")
				if(data == 'pingtaiyongjing'){
					this.pingtaiyongjing = null;
				}else if(data == 'fenxiaojiage'){
					this.fenxiaojiage = null;
				}else if(data == 'tuikeyongjin'){
					this.tuikeyongjin = null;
				}
			}else{
				if(data == 'tuikeyongjin'){
					if(val > 80 || val < 1){
						this.$message.error("推客佣金不能小于1%大于80%")
						this.tuikeyongjin = null;
					}

				}
			}
		},
	    editorValue(val) {
		    this.editorHtml = val
	    },
		getActiveIndex(ind){
	    	this.active = ind;
		},
		toShoppingDetailPage(){
    		if(this.yijifenleiVal == null ){
    			this.$message.error("请选择一级分类")
		    }else if(this.erjifenleiVal == null){
			    this.$message.error("请选择二级分类")
		    }else{
    			if(this.shoppingDetail.versionLevel == 1){
					this.$message.error("试用版没有权限添加商品")
				}else{
					let category = this.yijifenleiOptions.find(item => {
						return item.id === this.yijifenleiVal;
					})
					let typeName = this.erjifenleiOptions.find(item => {
						return item.id === this.erjifenleiVal;
					})
					let params = {
						goodsId : this.$route.query.courseId,
						imageUrl : this.shoppingDetail.imageUrl,
						goodsName : this.courseName,
						goodsType : this.shoppingDetail.goodsType,
						goodsIntroduction : this.editorHtml,
						price : this.fenxiaojiage,
						peddleRate : this.tuikeyongjin,
						platformRate : this.pingtaiyongjing,
						categoryId : this.yijifenleiVal,
						typeId : this.erjifenleiVal,
						categoryName : category.name,
						typeName : typeName.name,
						articleLink : this.tuiwenlianjie,
						authorId : this.shoppingDetail.authorId,
						authorName : this.shoppingDetail.authorName,
						subType : this.shoppingDetail.subType
					}
					api.addPeddleApiGoods(params).then(res => {
						console.log(res)
						if(res.serviceCode == "E000000000"){
							if(res.data.success){
								this.$router.push({
									// name : 'shoppingListDetail',
									// query : {
									//
									// }
									name : 'auditShoppingList'
								})
							}else{
								this.$message.error(res.data.errorMsg)
							}

						}else{
							this.$message.error(res.serviceMessage)
						}

					})
				}

		    }


		}
    }
}
</script>

<style lang="stylus" scoped>
	.apply_shopping{
		width:100%;
		.layout-head{
			.btn_box{
				.return_btn{
					color : #9B9B9B;
					font-size 20px;
				}
			}
		}
		.content_box{
			background: #fff;
			text-align : center;
			overflow : hidden;
			.content_box_main{
				width:720px;
				margin:40px auto 0 auto;
				text-align : left;
				padding-bottom : 40px;
			}
			.active_one_box,.active_two_box{
				margin-top:60px;
				font-size  : 14px;
				color: #4A4A4A;
				.top2{
					margin-top : 2px;
				}
				.top5{
					margin-top : 5px;
				}
				.top10{
					margin-top : 10px;
				}
				.top20{
					margin-top : 20px;
				}
				.width285{
					width:285px;
				}
				.width580{
					width : 580px;
				}
				.width100{
					width : 100%;
				}
				.left10{
					margin-left : 10px;
				}
				.small_text{
					color: #C7C7C7;
				}
				.shopping_img_head{
					width:170px;
					height:170px;
				}
				.btn_box{
					margin-top:40px;
					text-align : center;
				}
				.active_input_flex_box{
					display : flex;
					.left{
						flex : 1;
						padding-right : 10px;
					}
					.right{
						flex : 1;
						padding-left : 10px;
					}
					.center{
						flex : 1;
					}
				}
			}
		}
		.shenhe_shopping_dalog_box{
			.dalog_main_box{
				width:100%;
				font-size : 14px;
				.bold{
					font-weight : bold;
				}
				.size16{
					font-size : 16px;
				}
				.top5{
					margin-top : 5px;
					text-indent : 2em;
				}
				.top10{
					margin-top : 10px;
					text-indent : 2em;
				}
				.top20{
					margin-top : 20px;
				}
				.top30{
					margin-top : 30px;
				}
			}

		}
	}
</style>
