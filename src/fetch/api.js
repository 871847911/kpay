import {
  Get,
  Post,
  PutMy,
  Delete
} from './http'
import distribution from './distribution'
import qs from 'qs'

let variable = ''

if (process.env.NODE_ENV === 'development') {
  variable = '/local'
}

if (process.env.NODE_ENV === 'production') {
  variable = 'http://' + window.location.host
}

export default {
  // 定义全局变量，可供js文件读取此变量的值
  global() {
    return variable
  },

  ...distribution,

  // 登录接口
  login(params) {
    return Post(`${variable}/wechat/login`, qs.stringify(params))
  },

  // 登出
  logout() {
    return Get(`${variable}/backend/logout`)
  },

  // 店铺首页获取用户信息
  getBaseInfo() {
    return Get(`${variable}/backend/mgt/sys/base/info`)
  },

  // 获取上传七牛云的uptoken
  getUpToken() {
    return Get(`${variable}/backend/mgt/cloud/uploadToken`)
  },

  // 获取登录成功后的用户信息
  loginUserInfo() {
    return Get(`${variable}/backend/mgt1/me`)
  },

  // 获取店铺信息
  getShopInfo() {
    return Get(`${variable}/backend/mgt/store/getStoreInfo`)
  },
  getShopView() {
    return Get(`${variable}/backend/mgt/store/getStoreOverview`)
  },

  // 保存店铺信息
  saveShopInfo(params) {
    return Post(`${variable}/backend/mgt/store/saveStoreInfo`, params)
  },

  // 获取验证码
  getCode(params) {
    return Get(`${variable}/backend/mgt/user/getVerificationCode`, params)
  },

  // 校验验证码是否正确
  checkCode(params) {
    return Get(`${variable}/backend/mgt/user/checkIsCorrectCode`, params)
  },

  // 获取用户信息
  getUserInfo(params) {
    return Get(`${variable}/backend/mgt/user/getUserInfo`, params)
  },

  // 获取原密码
  getPwd(params) {
    return Get(`${variable}/backend/mgt/user/checkPassWord`, params)
  },

  // 首次登录保存用户信息
  saveUserInfo(params) {
    return Post(`${variable}/backend/mgt/user/saveUser`, params)
  },

  // 判断用户修改账号是否唯一
  checkUsername(params) {
    return Get(`${variable}/backend/mgt/user/checkUserName`, params)
  },

  // 店铺激活

  activeShop(params) {
    return Post(`${variable}/backend/mgt/store/activeSubAccount`, params)
  },

  // 获取店铺目前信息完善的程度（1：店铺信息未完善，2：账户信息未完善，3：未激活，4:已激活）
  getStoreStatus() {
    return Get(`${variable}/backend/mgt/store/getStoreStatus`)
  },

  // 查询用户列表
  searchUserlist(params) {
    return Get(`${variable}/backend/mgt/user/getUserList`, params)
  },

  // 用户统计数据
  getUserPayOverview(params) {
    return Get(`${variable}/backend/mgt/user/getUserPayOverview`, params)
  },

  // 订单列表
  // getOrderList(params) {
  //   return Get(`${variable}/backend/mgt/courseOrder/pageLecturerOrder`, params)
  // },
  getOrderList(params) {
    return Get(`${variable}/backend/mgt/courseOrder/pageUserOrder`, params)
  },

  // 订单详情查询
  getOrderDetail(params) {
    return Get(`${variable}/backend/mgt/courseOrder/getCourseOrderInfo`, params)
  },

  // 课程分类列表查询
  getCourseCategory(params) {
    return Get(`${variable}/backend/mgt/courseCatalog/findCourseCatalog`, params)
  },

  // 添加/更改课程分类
  saveCourseCategory(params) {
    return Post(`${variable}/backend/mgt/courseCatalog/saveCourseCatalog`, qs.stringify(params))
  },

  // 课程列表
  getMyCourse(params) {
    return Get(`${variable}/backend/mgt/courseMain/findCourseMainView`, params)
  },

  // 第三方课程
  findThirdCourseMain(params) {
    return Get(`${variable}/backend/mgt/courseMain/findThirdCourseMain`, params)
  },

  // 课程详情查询/编辑课程时渲染页面
  getCourseDetail(params) {
    return Get(`${variable}/backend/mgt/courseMain/getCourseMainInfo`, params)
  },

  // 保存课程信息
  saveCourseMain(params) {
    return Post(`${variable}/backend/mgt/courseMain/saveCourseMain`, qs.stringify(params))
  },

  // 讲师入驻申请列表查询
  getAuditList(params) {
    return Get(`${variable}/backend/mgt/user/getApplyUserList`, params)
  },

  // 审核通过
  auditPass(params) {
    return Post(`${variable}/backend/mgt/user/dealTeacherApply`, qs.stringify(params))
  },

  // 保存店铺广告位,批量
  saveStoreAd(params) {
    return Post(`${variable}/backend/mgt/store/saveStoreAdvert`, params)
  },

  // 课程是否首页展示
  homeDisplay(params) {
    return Get(`${variable}/backend/mgt/courseMain/getIsShow`, params)
  },

  // 课程上架或下架
  updateCourseStatus(params) {
    return Get(`${variable}/backend/mgt/courseMain/updateCourseStatus`, params)
  },

  // 获取课程分类
  getCourseCatalog() {
    return Get(`${variable}/backend/mgt/courseCatalog/getCourseCatalog`)
  },

  // 保存课时
  saveCourseSub(params) {
    return Post(`${variable}/backend/mgt/courseMain/saveCourseSub`, qs.stringify(params))
  },

  // 删除课时
  deletCourseSub(params) {
    return Get(`${variable}/backend/mgt/courseMain/updateCourseSub`, params)
  },
  // 课程审核列表
  findAuditCourseMain(params) {
    return Get(`${variable}/backend/mgt/courseMain/findAuditCourseMain`, params)
  },

  // 登录页获取验证码
  sendLoginCode(params) {
    return Get(`${variable}/backend/basic/sendLoginVerificationCode`, params)
  },

  // 修改密码时获取验证码
  getChangePwdCode(params) {
    return Get(`${variable}/backend/basic/sendModifyPasswordCode`, params)
  },

  // 校验修改密码时的手机号是否正确
  checkChangePwdCode(params) {
    return Get(`${variable}/backend/basic/checkIsCorrectCode`, params)
  },

  // 修改密码数据提交
  changePwd(params) {
    return Get(`${variable}/backend/basic/modifyPassword`, params)
  },

  // 发送更换手机号验证码
  sendModifyPhoneCode(params) {
    return Get(`${variable}/backend/basic/sendModifyPhoneCode`, params)
  },

  // 修改手机号
  changePhone(params) {
    return Get(`${variable}/backend/mgt/user/changePhone`, params)
  },

  // 获取模板市场
  templateMarketList() {
    return Get(`${variable}/backend/mgt/myAppTemplate/templateMarketList`)
  },

  // 获取我的模板市场
  getMyAppTemplateList() {
    return Get(`${variable}/backend/mgt/myAppTemplate/getMyAppTemplateList`)
  },

  // 获取我的模详情
  getMyAppTemplate(params) {
    return Get(`${variable}/backend/mgt/myAppTemplate/getMyAppTemplate`, params)
  },

  // 模板详情
  getTemplate(params) {
    return Get(`${variable}/backend/mgt/myAppTemplate/getTemplate`, params)
  },

  // 加入我的模板
  joinMyAppTemplate(params) {
    return Get(`${variable}/backend/mgt/myAppTemplate/joinMyAppTemplate`, params)
  },

  // 判断授权绑定
  isAuth(params) {
    return Get(`${variable}/backend/admin/miniapp/isAuth`, params)
  },

  // POST 更新小程序绑定信息、商户支付设置
  updateProgram(params) {
    return Post(`${variable}/backend/admin/miniapp/updateProgram`, qs.stringify(params))
  },

  // 提交小程序代码
  commitCode(params) {
    return Post(`${variable}/backend/admin/miniapp/commitCode`, qs.stringify(params))
  },

  // 获取二维码
  genAppQrcode(params) {
    return Get(`${variable}/backend/admin/miniapp/genAppQrcode`)
  },

  // 小程序设置信息
  getWechatConfigInfo(params) {
    return Get(`${variable}/backend/admin/miniapp/getWechatConfigInfo`, params)
  },

  // 获取店铺广告位
  getAdvertisementByType() {
    return Get(`${variable}/backend/mgt/store/getAdvertisementByType`)
  },

  // 获取线上版本号
  getOnlineVersion(params) {
    return Get(`${variable}/backend/admin/miniapp/getOnlineVersion`, params)
  },

  // 提交体验版
  submitAppAudit(params) {
    return Post(`${variable}/backend/admin/miniapp/submitAppAudit`, qs.stringify(params))
  },

  // 获取类目
  getAppCategory(params) {
    return Get(`${variable}/backend/admin/miniapp/getAppCategory`)
  },

  // 获取类目
  getAppPages(params) {
    return Get(`${variable}/backend/admin/miniapp/getAppPages`)
  },

  // 开发版本信息
  getWechatPublishSettingsInfo(params) {
    return Get(`${variable}/backend/admin/miniapp/getWechatPublishSettingsInfo`, params)
  },

  // 审核版本信息
  getWechatOnlineVersionInfo(params) {
    return Get(`${variable}/backend/admin/miniapp/getWechatOnlineVersionInfo`, params)
  },

  // 发布
  postedOnline(params) {
    return Get(`${variable}/backend/admin/miniapp/postedOnline`, params)
  },

  // version2.0 api
  // ======================================================
  //
  //                杨贵捷 2018 08 23
  //
  // =======================================================

  getClassDetail(params) { // 规则详情列表
    return Get(`${variable}/backend/mgt/shareCourse/getShareCourseRule`, params)
  },
  getClassRuleList(params) { // 课程规则列表查询
    return Get(`${variable}/backend/mgt/shareCourse/getShareCourseRules`, params)
  },
  deleteClassRuleList(params) { // 删除规则
    return Delete(`${variable}/backend/mgt/shareCourse/deleteRule`, params)
  },
  putStepOne(userId, params) { // 新增规则第一步    -----后台接口就长这样，活久见------
    return PutMy(`${variable}/backend/mgt/shareCourse/insertRule`, params, userId)
  },
  getStepTwoClassList(params) { // 新增规则第二步   获取课程列表
    return Get(`${variable}/backend/mgt/shareCourse/getShareCourseDTO`, params)
  },
  setClassList(params) { // 新增规则第二步   绑定课程
    return Post(`${variable}/backend/mgt/shareCourse/bindingRule`, qs.stringify(params))
  },
  deleteClassList(params) { // 新增规则第二步   解绑课程
    return Post(`${variable}/backend/mgt/shareCourse/relieveBinding`, qs.stringify(params))
  },
  getRuleList(params) { // 规则第三步  获取规则列表
    return Get(`${variable}/backend/mgt/shareCourse/getShareRuleDTO`, params)
  },
  setRoutineDiscount(params) { // 规则第三步  普通课程分享优惠参数设置
    return Post(`${variable}/backend/mgt/shareCourse/setRoutineDiscount`, params)
  },
  setCatalogDiscount(params) { // 规则第三步  目录课程分享优惠参数设置
    return Post(`${variable}/backend/mgt/shareCourse/setCatalogDiscount`, params)
  },
  setClassRule(params) { // 修改规则
    return Post(`${variable}/backend/mgt/shareCourse/updateRule`, params)
  },
  shareInfoList(params) { // 分享信息统计
    return Get(`${variable}/backend/mgt/shareCourse/updateRule`, params)
  },
  getGroupList(params) { // 查看拼团列表
    return Get(`${variable}/backend/groupBuy/groupList`, params)
  },
  getGroupDetail(params) { // 查看拼团详情
    return Get(`${variable}/backend/groupBuy/getGroupBuyRule`, params)
  },
  setNewGroup(params) { // 新增拼团
    return Post(`${variable}/backend/groupBuy/addGroupBuy`, qs.stringify(params))
  },
  setGroup(params) { // 修改拼团
    return Post(`${variable}/backend/groupBuy/updateGroupBuy`, qs.stringify(params))
  },
  getGroupClassList(params) {
    return Get(`${variable}/backend/groupBuy/getCourses`, params)
  },

  // ======================================================
  //
  //                陈新刷 内容管理 2018 08 23
  //
  // =======================================================

  listLecturer(params) { // 提问我的 添加问题 讲师列表
    return Get(`${variable}/backend/mgt/questionAndAnswer/listLecturer`, params)
  },
  getCourse(params) { // 获取对应问题的课程介绍相关
    return Get(`${variable}/backend/mgt/questionAndAnswer/getCourse`, params)
  },
  addStar(params) { // 点赞接口
    return Post(`${variable}/backend/mgt/questionAndAnswer/addStar`, qs.stringify(params))
  },
  saveQuestionAndPics(params) { // 步骤一、 添加问题及图片
    return Post(`${variable}/backend/mgt/questionAndAnswer/saveQuestionAndPics`, qs.stringify(params))
  },
  // 步骤二、列表有三种数据
  myQuestion(params) { // 1.我的提问问题列表
    return Get(`${variable}/backend/mgt/questionAndAnswer/myQuestion`, params)
  },
  askMe(params) { // 2.提问我的问题列表
    return Get(`${variable}/backend/mgt/questionAndAnswer/askMe`, params)
  },
  questionList(params) { // 3.问答专区问题列表
    return Get(`${variable}/backend/mgt/questionAndAnswer/questionList`, params)
  },
  queryById(params) { // 步骤三、根据问题编号或者ID 查 问题详情
    return Get(`${variable}/backend/mgt/questionAndAnswer/queryById`, params)
  },
  addAnswerAndPics(params) { // 步骤四、根据提问id查答案图片
    return Post(`${variable}/backend/mgt/questionAndAnswer/addAnswerAndPics`, qs.stringify(params))
  },

  // ======================================================
  //
  //                沈泳 2018 08 23
  //
  // =======================================================

  // 会员等级模板详情
  getVipLevelTemplateDTOList() {
    return Get(`${variable}/backend/mgt/storeVipLevelConfig/getVipLevelTemplateDTOList`)
  },

  // 获取店铺会员等级列表
  getStoreVipLevelConfigList(params) {
    return Get(`${variable}/backend/mgt/storeVipLevelConfig/getStoreVipLevelConfigList`, params)
  },

  // 启用会员模板
  enableTemplateLevel(params) {
    return Get(`${variable}/backend/mgt/storeVipLevelConfig/enableTemplateLevel`, params)
  },

  // 单个编辑会员等级信息
  modifyStoreVipLevelConfigInfo(params) {
    return Get(`${variable}/backend/mgt/storeVipLevelConfig/modifyStoreVipLevelConfigInfo`, params)
  },

  // 批量编辑会员等级信息
  vipLevelBatchSave(params) {
    return Post(`${variable}/backend/mgt/storeVipLevelConfig/batchSave`, params)
  },

  // 会员信息管理
  findStoreVipList(params) {
    return Get(`${variable}/backend/mgt/storeVipGrowRecord/findStoreVipList`, params)
  },

  // 店铺会员信息
  getUserMainInfo(params) {
    return Get(`${variable}/backend/mgt/storeVipGrowRecord/getUserMainInfo`, params)
  },

  // 成长值明细列表
  findStoreVipGrowRecord(params) {
    return Get(`${variable}/backend/mgt/storeVipGrowRecord/findStoreVipGrowRecord`, params)
  },

  // 成长值规则列表
  getStoreVipGrowRuleByType(params) {
    return Get(`${variable}/backend/mgt/storeVipGrowRule/getStoreVipGrowRuleByType`, params)
  },

  // 成长值规则批量编辑
  growRuleBatchSave(params) {
    return Post(`${variable}/backend/mgt/storeVipGrowRule/batchSave`, params)
  },

  // 获取成长值任务列表
  getStoreVipTaskGrowConfigByType(params) {
    return Get(`${variable}/backend/mgt/storeVipTaskGrowConfig/getStoreVipTaskGrowConfigByType`, params)
  },

  // 成长值任务列表批量编辑
  vipTaskGrowBatchSave(params) {
    return Post(`${variable}/backend/mgt/storeVipTaskGrowConfig/batchSave`, params)
  },

  // 成长值任务单个编辑
  modifyStoreVipTaskGrowConfigInfo(params) {
    return Post(`${variable}/backend/mgt/storeVipTaskGrowConfig/modifyStoreVipTaskGrowConfigInfo`, params)
  },

  // 会员积分管理
  findRecrodStoreVipList(params) {
    return Get(`${variable}/backend/mgt/storeVipScoreRecord/findStoreVipList`, params)
  },

  // 获取积分明细列表
  findStoreVipScoreRecord(params) {
    return Get(`${variable}/backend/mgt/storeVipScoreRecord/findStoreVipScoreRecord`, params)
  },

  // 获取店铺会员积分店铺信息
  getScoreUserMainInfo(params) {
    return Get(`${variable}/backend/mgt/storeVipScoreRecord/getUserMainInfo`, params)
  },

  // 获取积分规则列表
  getStoreVipScoreRuleByType(params) {
    return Get(`${variable}/backend/mgt/storeVipScoreRule/getStoreVipScoreRuleByType`, params)
  },

  // 积分规则列表批量编辑
  vipScoreRuleBatchSave(params) {
    return Post(`${variable}/backend/mgt/storeVipScoreRule/batchSave`, params)
  },

  // 积分规则单个编辑
  modifyStoreVipScoreRuleInfo(params) {
    return Post(`${variable}/backend/mgt/storeVipScoreRule/modifyStoreVipScoreRuleInfo`, params)
  },

  // 获取积分任务列表
  getStoreVipTaskScoreConfigByType(params) {
    return Get(`${variable}/backend/mgt/storeVipTaskScoreConfig/getStoreVipTaskScoreConfigByType`, params)
  },

  // 积分任务列表批量编辑
  vipTaskScoreBatchSave(params) {
    return Post(`${variable}/backend/mgt/storeVipTaskScoreConfig/batchSave`, params)
  },

  // 积分任务单个编辑
  modifyStoreVipTaskScoreConfigInfo(params) {
    return Post(`${variable}/backend/mgt/storeVipTaskScoreConfig/modifyStoreVipTaskScoreConfigInfo`, params)
  },

  // 获取特权等级列表
  getVipFuncVOList(params) {
    return Get(`${variable}/backend/mgt/storeVipFuncConfig/getVipFuncVOList`, params)
  },

  // 获取特权信息
  getVipFunc(params) {
    return Get(`${variable}/backend/mgt/storeVipFuncConfig/getFunc`, params)
  },

  // 更新特权信息
  updateSaleFunc(params) {
    return Post(`${variable}/backend/mgt/storeVipFuncConfig/updateSaleFunc`, params)
  },

  // 新增结算规则
  addPayStoreRule(params) {
    return Get(`${variable}/backend/mgt/settlement/addPayStoreRule`, params)
  },

  // 获取结算规则
  getPayStoreRule(params) {
    return Get(`${variable}/backend/mgt/settlement/getPayStoreRule`, params)
  },

  // 结算汇总列表
  getSettlementList(params) {
    return Get(`${variable}/backend/mgt/settlement/getSettlementList`, params)
  },

  // 删除费率
  deletePayStoreRule(params) {
    return Get(`${variable}/backend/mgt/settlement/deletePayStoreRule`, params)
  },

  // 修改费率
  updateServiceRate(params) {
    return Get(`${variable}/backend/mgt/settlement/updateServiceRate`, params)
  },

  // 查看可关联的生产者
  getRelationUserList(params) {
    return Get(`${variable}/backend/mgt/settlement/getRelationUserList`, params)
  },

  // 关联生产者
  relationUser(params) {
    return Post(`${variable}/backend/mgt/settlement/relationUser`, params)
  },

  // 查看关联生产者
  getAllRelationUserList(params) {
    return Get(`${variable}/backend/mgt/settlement/getAllRelationUserList`, params)
  },

  // 修改结算时间
  updateSettlementTime(params) {
    return Get(`${variable}/backend/mgt/settlement/updateSettlementTime`, params)
  },

  // 修改专栏结算方式
  updateStoreConfig(params) {
    return Get(`${variable}/backend/mgt/settlement/updateStoreConfig`, params)
  },

  // 统计一级分类数量以及首先展示数量
  getCatalogSummary(params) {
    return Get(`${variable}/backend/mgt/newCourseCatalog/getCatalogSummary`, params)
  },

  // 课程分类分页列表
  getStoreIncomeDetailList(params) {
    return Get(`${variable}/backend/mgt/newCourseCatalog/getStoreIncomeDetailList`, params)
  },

  // 课程分类列表
  getCatalogList(params) {
    return Get(`${variable}/backend/mgt/newCourseCatalog/getCatalogList`, params)
  },

  // 新增分类
  addCourseCatalog(params) {
    return Get(`${variable}/backend/mgt/newCourseCatalog/addCourseCatalog`, params)
  },

  // 修改分类
  updateCourseCatalog(params) {
    return Get(`${variable}/backend/mgt/newCourseCatalog/updateCourseCatalog`, params)
  },

  // 删除分类
  deleteCourseCatalog(params) {
    return Get(`${variable}/backend/mgt/newCourseCatalog/deleteCourseCatalog`, params)
  },

  // 内容中心 课程二级类目
  findSecondCatalogName(params) {
    return Get(`${variable}/backend/mgt/courseCatalog/findSecondCatalogName`, params)
  },

  // 公众号绑定
  updateH5Config(params) {
    return Post(`${variable}/backend/admin/miniapp/updateH5Config`, qs.stringify(params))
  },

  // 上传支付证书
  updatePayCert(params) {
    return Post(`${variable}/backend/admin/miniapp/updatePayCert`, params, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  },

  // 轮播图总结
  countBanner(params) {
    return Get(`${variable}/backend/mgt/store/countBanner`, params)
  },

  // 轮播图开关
  bannerSetOnline(params) {
    return Get(`${variable}/backend/mgt/store/setOnline`, params)
  },

  // 轮播图专栏接口
  carouselColumn(params) {
    return Get(`${variable}/backend/mgt/storeColumn/findShowStoreColumn`, params)
  },

  // 专栏列表
  getStoreColumnList(params) {
    return Get(`${variable}/backend/mgt/storeColumn/getStoreColumnList`, params)
  },

  // 专栏内容列表
  findColumnContent(params) {
    return Get(`${variable}/backend/mgt/columnContent/findColumnContent`, params)
  },

  // 获取专栏内容下专栏名称和进度
  getColumnInfo(params) {
    return Get(`${variable}/backend/mgt/columnContent/getColumnInfo`, params)
  },

  // 更新内容状态
  updateColumnContentStatus(params) {
    return Get(`${variable}/backend/mgt/columnContent/updateColumnContentStatus`, params)
  },

  // 添加专栏内容
  createColumnContent(params) {
    return Post(`${variable}/backend/mgt/columnContent/createColumnContent`, qs.stringify(params))
  },

  // 获取专栏内容
  getColumnContentInfo(params) {
    return Get(`${variable}/backend/mgt/columnContent/getColumnContentInfo`, params)
  },

  // 修改专栏内容
  modifyColumnContent(params) {
    return Post(`${variable}/backend/mgt/columnContent/modifyColumnContent`, qs.stringify(params))
  },

  // 专栏审核
  findStoreColumnAudit(params) {
    return Get(`${variable}/backend/mgt/storeColumn/findStoreColumnAudit`, params)
  },

  // 专栏内容审核
  findColumnContentAudit(params) {
    return Get(`${variable}/backend/mgt/columnContent/findColumnContentAudit`, params)
  },

  // 第三方专栏列表
  getThirdList(params) {
    return Get(`${variable}/backend/mgt/storeColumn/getThirdStoreColumnList`, params)
  },

  // 店铺订单
  pageStoreOrder(params) {
    return Get(`${variable}/backend/mgt/courseOrder/pageStoreOrder`, params)
  },

  // 生产者订单
  pageLecturerOrder(params) {
    return Get(`${variable}/backend/mgt/courseOrder/pageLecturerOrder`, params)
  },

  // 订单详情
  getCourseOrderInfo(params) {
    return Get(`${variable}/backend/mgt/courseOrder/getCourseOrderInfo`, params)
  },

  // 欠费通知
  getBalanceNotice(params) {
    return Get(`${variable}/backend/mgt/qiniuFlow/getBalanceNotice`, params)
  },

  // 流量店铺信息
  getStoreDetail(params) {
    return Get(`${variable}/backend/mgt/qiniuFlow/getStoreDetail`, params)
  },

  // 流量账户列表
  pageAllRecord(params) {
    return Get(`${variable}/backend/mgt/qiniuFlow/pageAllRecord`, params)
  },

  // 存储流量详情
  getSpaceDetail(params) {
    return Get(`${variable}/backend/mgt/qiniuFlow/getSpaceDetail`, params)
  },

  // 充值流量详情
  getRechargeDetail(params) {
    return Get(`${variable}/backend/mgt/qiniuFlow/getRechargeDetail`, params)
  },

  // 外网流量详情
  getFlowDetail(params) {
    return Get(`${variable}/backend/mgt/qiniuFlow/getFlowDetail`, params)
  },

  // 外网流量明细
  pageFlowDetail(params) {
    return Get(`${variable}/backend/mgt/qiniuFlow/pageFlowDetail`, params)
  },

  // 存储流量明细
  pageSpaceDetail(params) {
    return Get(`${variable}/backend/mgt/qiniuFlow/pageSpaceDetail`, params)
  },

  // 创建二维码
  createQrCode(params) {
    return Post(`${variable}/backend/mgt/qiniuFlow/createQrCode`, qs.stringify(params))
  },

  // 创建订单id
  createUnifyOrder(params) {
    return Post(`${variable}/backend/mgt/qiniuFlow/createUnifyOrder`, qs.stringify(params))
  },

  // 查询充值信息
  queryRechargeResult(params) {
    return Post(`${variable}/backend/mgt/qiniuFlow/queryRechargeResult`, qs.stringify(params))
  },

  // 查询授权信息
  getAuthorizerInfo(params) {
    return Get(`${variable}/backend/mgt/wechatAuthorizerInfo/getAuthorizerInfo`, params)
  },

  // 授权取消发短信
  sendVerificationCodeDelAuth(params) {
    return Post(`${variable}/backend/mgt/wechatAuthorizerInfo/sendVerificationCodeDelAuth`, qs.stringify(params))
  },

  // 解绑公众号
  unbundAuthorizerInfo(params) {
    return Post(`${variable}/backend/mgt/wechatAuthorizerInfo/unbundAuthorizerInfo`, qs.stringify(params))
  },

  // 保存支付配置
  savePayCert(params) {
    return Post(`${variable}/backend/mgt/wechatAuthorizerInfo/savePayCert`, qs.stringify(params))
  },

  // 保存微信支付信息
  saveWechatConfig(params) {
    return Post(`${variable}/backend/mgt/wechatAuthorizerInfo/saveWechatConfig`, qs.stringify(params))
  },

  // 获取支付配置
  findByAppId(params) {
    return Get(`${variable}/backend/mgt/wechatAuthorizerInfo/findByAppId`, params)
  },

  // 获取线上版本
  getOnlineVersionNew(params) {
    return Get(`${variable}/backend/admin/miniapp/getOnlineVersion`, params)
  },

  // 获取开发版本
  getLastPublishSettingsInfo(params) {
    return Get(`${variable}/backend/admin/miniapp/getLastPublishSettingsInfo`, params)
  },

  // 获取审核版本
  getAuditVersion(params) {
    return Get(`${variable}/backend/admin/miniapp/getAuditVersion`, params)
  },

  // 审核查询
  getAuditVersionWithUpdate(params) {
    return Get(`${variable}/backend/admin/miniapp/getAuditVersionWithUpdate`, params)
  },
  // ======================================================
  //
  //                蒋祥顺 资金模块,专栏2018 09 10
  //
  // =======================================================
  addColumn(params) { // 添加专栏
    return Post(`${variable}/backend/mgt/storeColumn/createStoreColumn`, qs.stringify(params))
  },
  modifyColumn(params) { // 修改专栏
    return Post(`${variable}/backend/mgt/storeColumn/modifyStoreColumn`, qs.stringify(params))
  },
  getStoreColumnInfo(params) { // 获取专栏信息
    return Get(`${variable}/backend/mgt/storeColumn/getStoreColumnInfo`, params)
  },
  updateColumnStatus(params) { // 更新上下架状态,申请开通
    return Get(`${variable}/backend/mgt/storeColumn/updateColumnStatus`, params)
  },
  addIntroduction(params) { // 添加专栏发刊词
    return Post(`${variable}/backend/mgt/storeColumn/createColumnIntroduction`, qs.stringify(params))
  },
  modifyIntroduction(params) { // 修改专栏发刊词
    return Post(`${variable}/backend/mgt/storeColumn/modifyColumnIntroduction`, qs.stringify(params))
  },
  getIntroductionInfo(params) { // 获取发刊词信息
    return Get(`${variable}/backend/mgt/storeColumn/getColumnIntroductionInfo`, params)
  },
  // 店铺收入明细统计
  // getSummary(params) {
  //   return Get(`${variable}/backend/mgt/balance/getStoreSummary`, params)
  // },
  getSummary(params) {
    return Post(`${variable}/trading/finance/earning`, params)
  },

  // 生产者收入明细统计
  getUserSummary(params) {
    return Get(`${variable}/backend/mgt/userSettlement/getUserIncomeSummary`, params)
  },

  // 店铺获取收入明细列表
  // getIncomeDetailList(params) {
  //   return Get(`${variable}/backend/mgt/balance/getStoreIncomeDetailList`, params)
  // },
  getIncomeDetailList(params) {
    return Post(`${variable}/order/finance/detailEarningList`, params)
  },
  // 店铺收入明细列表详情信息
  getIncomeDetail(params) {
    return Get(`${variable}/backend/mgt/balance/getStoreIncomeDetail`, params)
  },
  getIncomeDetail2(params) {
    return Post(`${variable}/order/finance/detailEarningDetail`, params)
  },

  // 店铺交易明细列表
  // getTradeList(params) {
  //   return Get(`${variable}/backend/mgt/balance/getStoreTradeDetailList`, params)
  // },
  getTradeList(params) {
    return Post(`${variable}/order/trading/transactionList`, params)
  },

  // 店铺交易明细详情
  // getTradeDetail(params) {
  //   return Get(`${variable}/backend/mgt/balance/getStoreTradeDetail`, params)
  // },
  getTradeDetail(params) {
    return Post(`${variable}/order/trading/transactionDetail`, params)
  },

  // 结算统计
  getStatsBalance(params) {
    return Get(`${variable}/backend/mgt/settlement/getSummary`, params)
  },
  // 结算列表
  getBalanceList(params) {
    return Get(`${variable}/backend/mgt/settlement/getCategorySettlementList`, params)
  },

  // 结算详情
  getBalanceDetail(params) {
    return Get(`${variable}/backend/mgt/settlement/getSettlement`, params)
  },

  // 专栏结算列表
  getColumnList(params) {
    return Get(`${variable}/backend/mgt/settlement/getSettlementList`, params)
  },

  // 结算接口
  settlement(params) {
    return Get(`${variable}/backend/mgt/settlement/settlement`, params)
  },

  // 店铺转账统计
  getStatstransfer(params) {
    return Get(`${variable}/backend/mgt/withdraw/withdrawSummary`, params)
  },

  // 转账申请列表
  getApplyList(params) {
    return Get(`${variable}/backend/mgt/withdraw/applyWithdrawList`, params)
  },

  // 确认转账
  confirmTransfer(params) {
    return Get(`${variable}/backend/mgt/withdraw/agreeWithdraw`, params)
  },

  // 转账记录列表
  transferRecordList(params) {
    return Get(`${variable}/backend/mgt/withdraw/getUserWithdrawList`, params)
  },

  // 转账记录详情
  transferRecord(params) {
    return Get(`${variable}/backend/mgt/withdraw/getUserWithdraw`, params)
  },

  // 生产者收入明细列表
  getUserIncomeList(params) {
    return Get(`${variable}/backend/mgt/userSettlement/getUserIncomeList`, params)
  },

  // 生产者收入明细列表详情信息
  getUserIncomeDetail(params) {
    return Get(`${variable}/backend/mgt/userSettlement/getUserIncomeDetail`, params)
  },

  // 生产者课程、专栏待结算明细统计
  getUsertransferStats(params) {
    return Get(`${variable}/backend/mgt/userSettlement/getSettlementSummary`, params)
  },

  // 生产者课程、专栏待结算明细列表
  getUserWaittransfer(params) {
    return Get(`${variable}/backend/mgt/userSettlement/getNeedSettlementList`, params)
  },

  // 生产者课程、专栏已结算明细列表
  getUserAlreadytransfer(params) {
    return Get(`${variable}/backend/mgt/userSettlement/getSettlementDetailList`, params)
  },

  // 生产者提现账户金额统计
  getUserAccountStats(params) {
    return Get(`${variable}/backend/mgt/userWithdraw/getPayUserBalance`, params)
  },

  // 生产者提现申请列表
  getWithdrawalApplyList(params) {
    return Get(`${variable}/backend/mgt/userWithdraw/getUserWithdrawList`, params)
  },

  // 生产者申请提现详情
  getWithdrawalApplyListDetail(params) {
    return Get(`${variable}/backend/mgt/userWithdraw/getUserWithdraw`, params)
  },

  // 申请提现
  applyWithdrawal(params) {
    return Get(`${variable}/backend/mgt/userWithdraw/applyWithdraw`, params)
  },

  // 生产者新增银行卡
  addBankCard(params) {
    return Get(`${variable}/backend/mgt/userWithdraw/addUserBank`, params)
  },

  // 生产者删除银行卡
  deleteBankCard(params) {
    return Get(`${variable}/backend/mgt/userWithdraw/deleteUserBank`, params)
  },

  // 生产者修改银行卡
  modifyBankCard(params) {
    return Get(`${variable}/backend/mgt/userWithdraw/updateUserBank`, params)
  },

  // 生产者提现规则
  withdrawalRule(params) {
    return Get(`${variable}/backend/mgt/userWithdraw/getUserWithdrawRule`, params)
  },

  // 银行卡列表
  getBankCardList(params) {
    return Get(`${variable}/backend/mgt/userWithdraw/getUserBankList`, params)
  },

  // 轮播图
  carouselList(params) {
    return Get(`${variable}/backend/mgt/store/searchBannerPage`, params)
  },

  // 删除轮播图
  deleteStoreAdvert(params) {
    return Get(`${variable}/backend/mgt/store/deleteStoreAdvert`, params)
  },

  // 查询轮播图详情
  getStoreAdvert(params) {
    return Get(`${variable}/backend/mgt/store/getStoreAdvert`, params)
  },

  // 课程轮播列表
  courseList(params) {
    return Get(`${variable}/backend/mgt/courseMain/findShowCourseMain`, params)
  },

  // 添加轮播图
  addCoursel(params) {
    return Post(`${variable}/backend/mgt/store/addStoreAdvert`, params)
  },
  // 编辑轮播图
  editorCoursel(params) {
    return Post(`${variable}/backend/mgt/store/updateStoreAdvert`, params)
  },
  // 讲师列表轮播图
  getLecturerList(params) {
    return Get(`${variable}/backend/mgt/user/getUserList`, params)
  },

  // ======================================================
  //
  //               xxx 2018 09 11
  //
  // =======================================================

  queryGiftRules(params) {
    return Get(`${variable}/backend/gift/giftManage/queryGiftRules`, params)
  },

  savaGiftRule(params) {
    return Post(`${variable}/backend/gift/giftManage/savaGiftRule`, qs.stringify(params))
  },

  // ======================================================
  //
  //               陈新刷 讲师入驻 2018 10 15
  //
  // =======================================================
  lectureList(params) { // 讲师入驻列表
    return Get(`${variable}/backend/lecturer/lectureList`, params)
  },

  addOrEditLecture(params) { // 添加编辑 入驻讲师
    return Post(`${variable}/backend/lecturer/addOrEditLecture`, qs.stringify(params))
  },

  lectureDetail(params) { // 讲师信息详情
    return Get(`${variable}/backend/lecturer/lectureDetail`, params)
  },

  deleteLecture(params) { // 讲师删除
    return Post(`${variable}/backend/lecturer/deleteLecture`, qs.stringify(params))
  },

  lecturerBindPhoneQrcode(params) { // 讲师绑定手机号二维码
    return Get(`${variable}/backend/lecturer/lecturerBindPhoneQrcode`, params)
  }
}
