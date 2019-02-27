import Vue from 'vue'
import Router from 'vue-router'
import distributionApi from './distribution'

/* eslint-disable */
import {
  resolve
} from 'path'

Vue.use(Router)

// 账户
const Login = () => import('components/login/Login')
// const Settings = () => import('components/settings/AccountSettings')
// const Basic = () => import('components/settings/Basic')
// const Account = () => import('components/settings/Account')
// const Index = () => import('components/shopindex/Index')
// const ShopView = () => import('components/shopindex/shop/ShopView')
// const ShopInfo = () => import('components/shopindex/shop/ShopInfo')
// const ShopInfoEdit = () => import('components/shopindex/shop/ShopInfoEdit')

// 课程
// const CourseCategory = () =>
//   import('components/shopindex/course/CourseCategory')
// const CourseMy = () => import('components/shopindex/course/CourseMy')
// const CourseMyAdd = () => import('components/shopindex/course/CourseMyAdd')
// const CourseMyAddFirst = () =>
//   import('components/shopindex/course/CourseMyAddFirst')
// const CourseMyAddSecond = () =>
//   import('components/shopindex/course/CourseMyAddSecond')
// const CourseMyDetail = () =>
//   import('components/shopindex/course/CourseMyDetail')
// const CourseAudit = () => import('components/shopindex/course/CourseAudit')
// const CourseAuditDetail = () =>
//   import('components/shopindex/course/CourseAuditDetail')
// const UserList = () => import('components/shopindex/user/UserList')
// const UserListDetail = () => import('components/shopindex/user/UserListDetail')
// const UserAudit = () => import('components/shopindex/user/UserAudit')
// const UserAuditDetail = () =>
//   import('components/shopindex/user/UserAuditDetail')

// 消息
// const MessageAd = () => import('components/shopindex/message/MessageAd')
// const MessageService = () =>
//   import('components/shopindex/message/MessageService')
// const MessageQa = () => import('components/shopindex/message/MessageQa')
// const ResourceMy = () => import('components/shopindex/resource/ResourceMy')
// const ResourceMarket = () =>
//   import('components/shopindex/resource/ResourceMarket')
// const ResourceAd = () => import('components/shopindex/resource/ResourceAd')

// 个人中心
// const PersonalCenter = () =>
//   import('components/shopindex/personal/PersonalCenter')
// const PersonalCenterEdit = () =>
//   import('components/shopindex/personal/PersonalCenterEdit')
// const TemplateDetail = () =>
//   import('components/shopindex/template/TemplateDetail')
// const PushTemplate = () => import('components/shopindex/template/PushTemplate')
// const ManageTpl = () => import('components/shopindex/template/ManageTpl')
// const TemplateInfo = () => import('components/shopindex/template/TemplateInfo')

// 订单
// const OrderMy = () => import('components/shopindex/order/OrderMy')
// const OrderShop = () => import('components/shopindex/order/OrderShop')
// const OrderMyDetail = () => import('components/shopindex/order/OrderMyDetail')
// const OrderShopDetail = () =>
//   import('components/shopindex/order/OrderShopDetail')
// const OrderTeacher = () =>
//   import('components/shopindex/order/OrderTeacher')
// const OrderTeacherDetail = () =>
//   import('components/shopindex/order/OrderTeacherDetail')

// 我的专柜
// const MycolumnList = () => import('components/shopindex/mycolumn/MycolumnList')
// const MycolumnListUpload = () =>
//   import('components/shopindex/mycolumn/MycolumnListUpload')
// const MycolumnVerify = () => import('components/shopindex/mycolumn/MycolumnVerify')
// const MycolumnCoVerify = () => import('components/shopindex/mycolumn/MycolumnCoVerify')
// const MycolumnListAdd = () =>
//   import('components/shopindex/mycolumn/MycolumnListAdd')
// const MycolumnListContent = () => import('components/shopindex/mycolumn/MycolumnListContent')
// const MycolumnListCoEdit = () => import('components/shopindex/mycolumn/MycolumnListCoEdit')
// const MycolumnListCoDetail = () => import('components/shopindex/mycolumn/MycolumnListCoDetail')
// const MycolumnListAddGraphic = () => import('components/shopindex/mycolumn/MycolumnListAddGraphic')

// const MycolumnListStoreAdd = () => import('components/shopindex/mycolumn/admin/onlyself/MycolumnListStoreAdd')
// const MycolumnListStoreView = () => import('components/shopindex/mycolumn/admin/onlyself/MycolumnListStoreView')
// const MycolumnListStoreContent = () => import('components/shopindex/mycolumn/admin/onlyself/MycolumnListStoreContent')
// const MycolumnListStoreDetail = () => import('components/shopindex/mycolumn/admin/onlyself/MycolumnListStoreDetail')
// const MycolumnListStore = () => import('components/shopindex/mycolumn/admin/onlyself/MycolumnListStore')
// const MycolumnListStoreContentAdd = () => import('components/shopindex/mycolumn/admin/onlyself/MycolumnListStoreContentAdd')

// const MycolumnThird = () => import('components/shopindex/mycolumn/admin/third/MycolumnThird')
// const MycolumnThirdDetail = () => import('components/shopindex/mycolumn/admin/third/MycolumnThirdDetail')
// const MycolumnThirdContent = () => import('components/shopindex/mycolumn/admin/third/MycolumnThirdContent')
// const MycolumnThirdContentAuditDetail = () => import('components/shopindex/mycolumn/admin/third/MycolumnThirdContentAuditDetail')
// const MycolumnThirdViewDetail = () => import('components/shopindex/mycolumn/admin/third/MycolumnThirdViewDetail')
// const MycolumnThirdReviewDetail = () => import('components/shopindex/mycolumn/admin/third/MycolumnThirdReviewDetail')

// 我的会员
// const VipLv = () => import('components/shopindex/vip/VipLv')
// const VipLvList = () => import('components/shopindex/vip/VipLvList')
// const VipInfo = () => import('components/shopindex/vip/VipInfo')
// const VipLvPower = () => import('components/shopindex/vip/VipLvPower')
// const VipLvPowerSet = () => import('components/shopindex/vip/VipLvPowerSet')
// const VipInfoGrowRule = () =>import('components/shopindex/vip/VipInfoGrowRule')
// const VipInfoMission = () => import('components/shopindex/vip/VipInfoMission')
// const VipInfoGrow = () => import('components/shopindex/vip/VipInfoGrow')
// const MbRecordManage = () =>import('components/shopindex/memberRecord/MbRecordManage')
// const MbRecordSet = () =>import('components/shopindex/memberRecord/MbRecordSet')
// const MbRecordManageMission = () =>import('components/shopindex/memberRecord/MbRecordManageMission')
// const MbRecordManageGrow = () =>import('components/shopindex/memberRecord/MbRecordManageGrow')

// 分类
// const ClassifyList = () => import('components/shopindex/classify/ClassifyList')
// const ClassifyListSecond = () => import('components/shopindex/classify/ClassifyListSecond')
// const ClassifyListAdd = () => import('components/shopindex/classify/ClassifyListAdd')
// const ClassifyListAddSecond = () => import('components/shopindex/classify/ClassifyListAddSecond')

// 轮播图
// const CarouselHome = () => import('components/shopindex/carousel/CarouselHome')
// const CarouselHomeDetail = () => import('components/shopindex/carousel/CarouselHomeDetail')
// const CarouselHomeEdit = () => import('components/shopindex/carousel/CarouselHomeEdit')
// const CarouselShop = () => import('components/shopindex/carousel/CarouselShop')
// const CarouselAddEditor = () => import('components/shopindex/carousel/CarouselAddEditor')
// const CarouselResult = () => import('components/shopindex/carousel/CarouselResult')
// const CarouselLecturer = () => import('components/shopindex/carousel/CarouselLecturer')
// const CarousePersonal = () => import('components/shopindex/carousel/CarousePersonal')

// 财务
// const FinanceIncome = () =>import('components/shopindex/finance/FinanceIncome')
// const FinaceUserIncome = () => import('components/shopindex/finance/FinaceUserIncome')
// const TransferApply = () =>import('components/shopindex/transfer/TransferApply')
// const TransferRecord = () =>import('components/shopindex/transfer/TransferRecord')
// const FinanceTrade = () => import('components/shopindex/finance/FinanceTrade')
// const FinaceUserTransfer = () => import('components/shopindex/finance/FinaceUserTransfer')// 资金结算明细
// const BalanceSummary = () =>import('components/shopindex/balance/BalanceSummary')
// const BalanceRules = () => import('components/shopindex/balance/BalanceRules')
// const WithdrawalApply = () => import('components/shopindex/withdrawal/WithdrawalApply')// 提现申请
// const WithdrawalApplyCash = () => import('components/shopindex/withdrawal/WithdrawalApplyCash')// 申请提现弹框页面
// const WithdrawalRecord = () => import('components/shopindex/withdrawal/withdrawalRecord')// 提现记录

// 分享免费读
// const ShareRule = () => import('components/shopindex/share/shareRule')
// const ShareInfo = () => import('components/shopindex/share/shareInfo')
// const ShareNew = () => import('components/shopindex/share/shareNew')
// const ShareDetail = () => import('components/shopindex/share/ShareDetail')

// 营销中心
// const gift = () => import('components/shopindex/market/gift')
// const Grouplist = () => import('components/shopindex/market/group/groupList')
// const GroupDetail = () => import('components/shopindex/market/group/groupDetail')
// const NewGroup = () => import('components/shopindex/market/group/newGroup')
// const SetGroup = () => import('components/shopindex/market/group/setGroup')

// 问答管理
// const QuesAskMy = () => import('components/shopindex/question/QuesAskMy')// 提问我的
// const QuesAskMyDetail = () => import('components/shopindex/question/QuesAskMyDetail')
// const QuesList = () => import('components/shopindex/question/QuesList')// 问题列表
// const QuesListAdd = () => import('components/shopindex/question/QuesListAdd')
// const QuesListDetail = () => import('components/shopindex/question/QuesListDetail')

export default new Router({
  base: '/vue-web/',
  mode: 'history',
  routes: [{
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/settings',
      name: 'Settings',
      component: resolve => require(['@/components/settings/AccountSettings'], resolve),
      redirect: '/settings/basic',
      children: [{
          path: 'basic',
          name: 'Basic',
          component: resolve => require(['@/components/settings/Basic'], resolve)
        },
        {
          path: 'account',
          name: 'Account',
          component: resolve => require(['@/components/settings/Account'], resolve)
        }
      ]
    },
    {
      path: '/index',
      name: 'Index',
      component: resolve => require(['@/components/shopindex/Index'], resolve),
      redirect: '/index/shopview',
      children: [{
          path: 'shopview',
          name: 'ShopView',
          component: resolve => require(['@/components/shopindex/shop/ShopView'], resolve)
        },
        {
          path: 'shopinfo',
          name: 'ShopInfo',
          component: resolve => require(['@/components/shopindex/shop/ShopInfo'], resolve)
        },
        {
          path: 'shopinfoedit',
          name: 'ShopInfoEdit',
          component: resolve => require(['@/components/shopindex/shop/ShopInfoEdit'], resolve)
        },
        {
          path: 'coursecategory',
          name: 'CourseCategory',
          component: resolve => require(['@/components/shopindex/course/CourseCategory'], resolve)
        },
        {
          path: 'coursemy',
          name: 'CourseMy',
          component: resolve => require(['@/components/shopindex/course/CourseMy'], resolve)
        },
        {
          path: 'courseaudit',
          name: 'CourseAudit',
          component: resolve => require(['@/components/shopindex/course/CourseAudit'], resolve)
        },
        {
          path: 'coursethird',
          name: 'CourseThird',
          component: resolve => require(['@/components/shopindex/course/CourseThird'], resolve)
        },
        {
          path: 'coursethirddetail:id',
          name: 'CourseThirdDetail',
          component: resolve => require(['@/components/shopindex/course/CourseThirdDetail'], resolve)
        },
        {
          path: 'coursemyadd',
          name: 'CourseMyAdd',
          component: resolve => require(['@/components/shopindex/course/CourseMyAdd'], resolve)
        },
        {
          path: 'coursemyaddfirst',
          name: 'CourseMyAddFirst',
          component: resolve => require(['@/components/shopindex/course/CourseMyAddFirst'], resolve)
        },
        {
          path: 'coursemyaddsecond',
          name: 'CourseMyAddSecond',
          component: resolve => require(['@/components/shopindex/course/CourseMyAddSecond'], resolve)
        },
        {
          path: 'coursemydetail:id',
          name: 'CourseMyDetail',
          component: resolve => require(['@/components/shopindex/course/CourseMyDetail'], resolve)
        },
        // {
        //   path: 'courseaudit',
        //   name: 'CourseAudit',
        //   component: resolve => require(['@/components/shopindex/course/CourseAudit'], resolve)
        // },
        {
          path: 'courseauditdetail:id',
          name: 'CourseAuditDetail',
          component: resolve => require(['@/components/shopindex/course/CourseAuditDetail'], resolve)
        },
        {
          path: 'userlist',
          name: 'UserList',
          component: resolve => require(['@/components/shopindex/user/UserList'], resolve)
        },
        {
          path: 'userlistdetail',
          name: 'UserListDetail',
          component: resolve => require(['@/components/shopindex/user/UserListDetail'], resolve)
        },
        // 店铺信息讲师列表路由专用
        {
          path: 'shopinfouserlistdetail',
          name: 'ShopinfoUserListDetail',
          component: resolve => require(['@/components/shopindex/user/UserListDetail'], resolve)
        },
        { // 入驻讲师主页面 1.入驻申请
          path: 'userlecture',
          name: 'UserLecture',
          component: resolve => require(['@/components/shopindex/user/UserLecture'], resolve)
        },
        {
          path: 'userlectureadd',
          name: 'UserLectureAdd',
          component: resolve => require(['@/components/shopindex/user/UserLectureAdd'], resolve)
        },
        {
          path: 'userlectureaccount',
          name: 'UserLectureAccount',
          component: resolve => require(['@/components/shopindex/user/UserLectureAccount'], resolve)
        },
        { // 2.入驻审核
          path: 'userlectureaudit',
          name: 'UserLectureAudit',
          component: resolve => require(['@/components/shopindex/user/UserLectureAudit'], resolve)
        },
        {
          path: 'userlectureauditdetail:id',
          name: 'UserLectureAuditDetail',
          component: resolve => require(['@/components/shopindex/user/UserLectureAuditDetail'], resolve)
        },
        {
          path: 'ordermyordermy',
          name: 'OrderMy',
          component: resolve => require(['@/components/shopindex/order/OrderMy'], resolve)
        },
        {
          path: 'ordershop',
          name: 'OrderShop',
          component: resolve => require(['@/components/shopindex/order/OrderShop'], resolve)
        },
        {
          path: 'ordermyordermydetail',
          name: 'OrderMyDetail',
          component: resolve => require(['@/components/shopindex/order/OrderMyDetail'], resolve)
        },
        {
          path: 'ordershopdetail',
          name: 'OrderShopDetail',
          component: resolve => require(['@/components/shopindex/order/OrderShopDetail'], resolve)
        },
        {
          path: 'orderteacher',
          name: 'OrderTeacher',
          component: resolve => require(['@/components/shopindex/order/OrderTeacher'], resolve)
        },
        {
          path: 'orderteacherdetail',
          name: 'OrderTeacherDetail',
          component: resolve => require(['@/components/shopindex/order/OrderTeacherDetail'], resolve)
        },
        {
          path: 'messagead',
          name: 'MessageAd',
          component: resolve => require(['@/components/shopindex/message/MessageAd'], resolve)
        },
        {
          path: 'messageservice',
          name: 'MessageService',
          component: resolve => require(['@/components/shopindex/message/MessageService'], resolve)
        },
        {
          path: 'messageqa',
          name: 'MessageQa',
          component: resolve => require(['@/components/shopindex/message/MessageQa'], resolve)
        },
        {
          path: 'resourcemy',
          name: 'ResourceMy',
          component: resolve => require(['@/components/shopindex/resource/ResourceMy'], resolve)
        },
        {
          path: 'resourcemarket',
          name: 'ResourceMarket',
          component: resolve => require(['@/components/shopindex/resource/ResourceMarket'], resolve)
        },
        {
          path: 'resourcead',
          name: 'ResourceAd',
          component: resolve => require(['@/components/shopindex/resource/ResourceAd'], resolve)
        },
        {
          path: 'resourcemarketdetail',
          name: 'TemplateDetail',
          component: resolve => require(['@/components/shopindex/template/TemplateDetail'], resolve)
        },
        {
          path: 'resourcemypushtpl',
          name: 'PushTemplate',
          component: resolve => require(['@/components/shopindex/template/PushTemplate'], resolve)
        },
        {
          path: 'resourcemymanagetpl',
          name: 'ManageTpl',
          component: resolve => require(['@/components/shopindex/template/ManageTpl'], resolve)
        },
        {
          path: 'authsmallprogramtemplateinfo',
          name: 'TemplateInfo',
          component: resolve => require(['@/components/shopindex/template/TemplateInfo'], resolve)
        },
        {
          path: 'personalcenter',
          name: 'PersonalCenter',
          component: resolve => require(['@/components/shopindex/personal/PersonalCenter'], resolve)
        },
        {
          path: 'personalcenteredit',
          name: 'PersonalCenterEdit',
          component: resolve => require(['@/components/shopindex/personal/PersonalCenterEdit'], resolve)
        },

        // =============================================================
        //                专柜
        // ==============================================================
        {
          path: 'mycolumnlist',
          name: 'MycolumnList',
          component: resolve => require(['@/components/shopindex/mycolumn/MycolumnList'], resolve)
        },
        {
          path: 'mycolumnverify',
          name: 'MycolumnVerify',
          component: resolve => require(['@/components/shopindex/mycolumn/MycolumnVerify'], resolve)
        },
        {
          path: 'mycolumncoverify',
          name: 'MycolumnCoVerify',
          component: resolve => require(['@/components/shopindex/mycolumn/MycolumnCoVerify'], resolve)
        },
        {
          path: 'mycolumncoverifydetail',
          name: 'MycolumnCoVerifyDetail',
          component: resolve => require(['@/components/shopindex/mycolumn/MycolumnCoVerifyDetail'], resolve)
        },
        {
          path: 'mycolumnlistadd',
          name: 'MycolumnListAdd',
          component: resolve => require(['@/components/shopindex/mycolumn/MycolumnListAdd'], resolve)
        },

        {
          path: 'mycolumnlistupload',
          name: 'MycolumnListUpload',
          component: resolve => require(['@/components/shopindex/mycolumn/MycolumnListUpload'], resolve)
        },
        // =============================================================
        //                end
        // ==============================================================

        // =============================================================
        //                我的会员
        // ==============================================================
        {
          path: 'mycolumnlistcontent',
          name: 'MycolumnListContent',
          component: resolve => require(['@/components/shopindex/mycolumn/MycolumnListContent'], resolve)
        },
        {
          path: 'mycolumnlistcoedit',
          name: 'MycolumnListCoEdit',
          component: resolve => require(['@/components/shopindex/mycolumn/MycolumnListCoEdit'], resolve)
        },
        {
          path: 'mycolumnlistcodetail',
          name: 'MycolumnListCoDetail',
          component: resolve => require(['@/components/shopindex/mycolumn/MycolumnListCoDetail'], resolve)
        },
        {
          path: 'mycolumnlistaddgraphic',
          name: 'MycolumnListAddGraphic',
          component: resolve => require(['@/components/shopindex/mycolumn/MycolumnListAddGraphic'], resolve)
        },
        {
          path: 'mycolumnliststore',
          name: 'MycolumnListStore',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/onlyself/MycolumnListStore'], resolve)
        },
        {
          path: 'mycolumnliststoreadd',
          name: 'MycolumnListStoreAdd',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/onlyself/MycolumnListStoreAdd'], resolve)
        },
        {
          path: 'mycolumnliststorecontent',
          name: 'MycolumnListStoreContent',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/onlyself/MycolumnListStoreContent'], resolve)
        },
        {
          path: 'mycolumnliststoredetail',
          name: 'MycolumnListStoreDetail',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/onlyself/MycolumnListStoreDetail'], resolve)
        },
        {
          path: 'mycolumnliststoreview',
          name: 'MycolumnListStoreView',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/onlyself/MycolumnListStoreView'], resolve)
        },
        {
          path: 'mycolumnliststorecontentadd',
          name: 'MycolumnListStoreContentAdd',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/onlyself/MycolumnListStoreContentAdd'], resolve)
        },
        {
          path: 'mycolumnthird',
          name: 'MycolumnThird',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/third/MycolumnThird'], resolve)
        },
        {
          path: 'mycolumnthirdcontentauditdetail',
          name: 'MycolumnThirdContentAuditDetail',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/third/MycolumnThirdContentAuditDetail'], resolve)
        },
        {
          path: 'mycolumnthirdviewdetail',
          name: 'MycolumnThirdViewDetail',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/third/MycolumnThirdViewDetail'], resolve)
        },
        {
          path: 'mycolumnthirdcontent',
          name: 'MycolumnThirdContent',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/third/MycolumnThirdContent'], resolve)
        },
        {
          path: 'mycolumnthirddetail',
          name: 'MycolumnThirdDetail',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/third/MycolumnThirdDetail'], resolve)
        },
        {
          path: 'mycolumnthirdreviewdetail',
          name: 'MycolumnThirdReviewDetail',
          component: resolve => require(['@/components/shopindex/mycolumn/admin/third/MycolumnThirdReviewDetail'], resolve)
        },
        {
          path: 'viplv',
          name: 'VipLv',
          component: resolve => require(['@/components/shopindex/vip/VipLv'], resolve)
        },
        {
          path: 'viplvlist',
          name: 'VipLvList',
          component: resolve => require(['@/components/shopindex/vip/vipLvList'], resolve)
        },
        {
          path: 'vipinfo',
          name: 'VipInfo',
          component: resolve => require(['@/components/shopindex/vip/VipInfo'], resolve)
        },
        {
          path: 'viplvpower',
          name: 'VipLvPower',
          component: resolve => require(['@/components/shopindex/vip/VipLvPower'], resolve)
        },
        {
          path: 'viplvpowerset',
          name: 'VipLvPowerSet',
          component: resolve => require(['@/components/shopindex/vip/VipLvPowerSet'], resolve)
        },
        {
          path: 'vipinfogrowrule',
          name: 'VipInfoGrowRule',
          component: resolve => require(['@/components/shopindex/vip/VipInfoGrowRule'], resolve)
        },
        {
          path: 'vipinfomission',
          name: 'VipInfoMission',
          component: resolve => require(['@/components/shopindex/vip/VipInfoMission'], resolve)
        },
        {
          path: 'vipinfogrow',
          name: 'VipInfoGrow',
          component: resolve => require(['@/components/shopindex/vip/VipInfoGrow'], resolve)
        },
        {
          path: 'mbrecordmanage',
          name: 'MbRecordManage',
          component: resolve => require(['@/components/shopindex/memberRecord/mbRecordManage'], resolve)
        },
        {
          path: 'mbrecordset',
          name: 'MbRecordSet',
          component: resolve => require(['@/components/shopindex/memberRecord/mbRecordSet'], resolve)
        },
        {
          path: 'mbrecordmanagemission',
          name: 'MbRecordManageMission',
          component: resolve => require(['@/components/shopindex/memberRecord/mbRecordManageMission'], resolve)
        },
        {
          path: 'mbrecordmanagegrow',
          name: 'MbRecordManageGrow',
          component: resolve => require(['@/components/shopindex/memberRecord/mbRecordManageGrow'], resolve)
        },
        // =============================================================
        //                end
        // ==============================================================

        // =============================================================
        //                财务
        // ==============================================================

        {
          path: 'financeincome',
          name: 'financeincome',
          component: resolve => require(['@/components/shopindex/finance/FinanceIncome'], resolve)
        },
        {
          path: 'transferapply',
          name: 'transferapply',
          component: resolve => require(['@/components/shopindex/transfer/TransferApply'], resolve)
        },
        {
          path: 'transferrecord',
          name: 'transferrecord',
          component: resolve => require(['@/components/shopindex/transfer/TransferRecord'], resolve)
        },
        {
          path: 'financetrade',
          name: 'financetrade',
          component: resolve => require(['@/components/shopindex/finance/FinanceTrade'], resolve)
        },
        {
          path: 'balancesummary',
          name: 'balancesummary',
          component: resolve => require(['@/components/shopindex/balance/BalanceSummary'], resolve)
        },
        {
          path: 'balancerules',
          name: 'balancerules',
          component: resolve => require(['@/components/shopindex/balance/BalanceRules'], resolve)
        },
        {
          path: 'ordershareinfo',
          name: 'orderShareInfo',
          component: resolve => require(['@/components/shopindex/share/shareInfo'], resolve)
        },

        {
          path: 'finaceuserincome',
          name: 'FinaceUserIncome',
          component: resolve => require(['@/components/shopindex/finance/FinaceUserIncome'], resolve)
        },
        {
          path: 'finaceusertransfer',
          name: 'FinaceUserTransfer',
          component: resolve => require(['@/components/shopindex/finance/FinaceUserTransfer'], resolve)
        },
        {
          path: 'withdrawalapply',
          name: 'WithdrawalApply',
          component: resolve => require(['@/components/shopindex/withdrawal/withdrawalApply'], resolve)
        },
        {
          path: 'withdrawalapplycash',
          name: 'WithdrawalApplyCash',
          component: resolve => require(['@/components/shopindex/withdrawal/WithdrawalApplyCash'], resolve)
        },
        {
          path: 'withdrawalrecord',
          name: 'WithdrawalRecord',
          component: resolve => require(['@/components/shopindex/withdrawal/withdrawalRecord'], resolve)
        },
        // =============================================================
        //                end
        // ==============================================================

        // =============================================================
        //                分享免费读
        // ==============================================================
        {
          path: 'sharerule',
          name: 'shareRule',
          component: resolve => require(['@/components/shopindex/share/shareRule'], resolve)
        },
        {
          path: 'sharerulenew',
          name: 'shareNew',
          component: resolve => require(['@/components/shopindex/share/shareNew'], resolve)
        },
        {
          path: 'shareruledetail',
          name: 'shareDetail',
          component: resolve => require(['@/components/shopindex/share/shareDetail'], resolve)
        },
        {
          path: 'shareinfo',
          name: 'shareInfo',
          component: resolve => require(['@/components/shopindex/share/shareInfo'], resolve)
        },
        // =============================================================
        //                end
        // ==============================================================

        // =============================================================
        //                营销中心
        // ==============================================================
        {
          path: 'marketgift',
          name: 'marketGift',
          component: resolve => require(['@/components/shopindex/market/gift'], resolve)
        },
        {
          path: 'marketgrouplist',
          name: 'groupList',
          component: resolve => require(['@/components/shopindex/market/group/groupList'], resolve)
        },
        {
          path: 'marketgrouplistdetail',
          name: 'groupDetail',
          component: resolve => require(['@/components/shopindex/market/group/groupDetail'], resolve)
        },
        {
          path: 'marketgrouplistnew',
          name: 'newGroup',
          component: resolve => require(['@/components/shopindex/market/group/newGroup'], resolve)
        },
        {
          path: 'marketgrouplistset',
          name: 'setGroup',
          component: resolve => require(['@/components/shopindex/market/group/setGroup'], resolve)
        },
        // =============================================================
        //                end
        // ==============================================================

        // =============================================================
        //                问答管理
        // ==============================================================
        {
          path: 'quesaskmy',
          name: 'QuesAskMy',
          component: resolve => require(['@/components/shopindex/question/QuesAskMy'], resolve)
        },
        {
          path: 'queslist',
          name: 'QuesList',
          component: resolve => require(['@/components/shopindex/question/QuesList'], resolve)
        },
        {
          path: 'quesaskmydetail',
          name: 'QuesAskMyDetail',
          component: resolve => require(['@/components/shopindex/question/QuesAskMyDetail'], resolve)
        },
        {
          path: 'queslistadd',
          name: 'QuesListAdd',
          component: resolve => require(['@/components/shopindex/question/QuesListAdd'], resolve)
        },
        {
          path: 'queslistdetail',
          name: 'QuesListDetail',
          component: resolve => require(['@/components/shopindex/question/QuesListDetail'], resolve)
        },
        // =============================================================
        //                end
        // ==============================================================

        // =============================================================
        //                分销中心
        // ==============================================================
		  ...distributionApi,
        // =============================================================
        //                end
        // ==============================================================

        // =============================================================
        //                分类
        // ==============================================================
        {
          path: 'classifylist',
          name: 'ClassifyList',
          component: resolve => require(['@/components/shopindex/classify/ClassifyList'], resolve)
        },
        {
          path: 'classifylistsecond',
          name: 'ClassifyListSecond',
          component: resolve => require(['@/components/shopindex/classify/ClassifyListSecond'], resolve)
        },
        {
          path: 'classifylistadd',
          name: 'ClassifyListAdd',
          component: resolve => require(['@/components/shopindex/classify/ClassifyListAdd'], resolve)
        },
        {
          path: 'classifylistaddsecond',
          name: 'ClassifyListAddSecond',
          component: resolve => require(['@/components/shopindex/classify/ClassifyListAddSecond'], resolve)
        },
        // =============================================================
        //                end
        // ==============================================================

        // =============================================================
        //                轮播图
        // ==============================================================
        {
          path: 'carouselhome',
          name: 'CarouselHome',
          component: resolve => require(['@/components/shopindex/carousel/CarouselHome'], resolve)
        },
        {
          path: 'carouselhomedetail',
          name: 'CarouselHomeDetail',
          component: resolve => require(['@/components/shopindex/carousel/CarouselHomeDetail'], resolve)
        },
        {
          path: 'carouselhomeedit',
          name: 'CarouselHomeEdit',
          component: resolve => require(['@/components/shopindex/carousel/CarouselHomeEdit'], resolve)
        },
        {
          path: 'carouselhomeaddeditor',
          name: 'CarouselHomeAddEditor',
          component: resolve => require(['@/components/shopindex/carousel/CarouselHomeAddEditor'], resolve)
        },
        {
          path: 'carouselhomelecturer',
          name: 'CarouselHomeLecturer',
          component: resolve => require(['@/components/shopindex/carousel/CarouselHomeLecturer'], resolve)
        },
        {
          path: 'carouselhomepersonal',
          name: 'CarouselHomePersonal',
          component: resolve => require(['@/components/shopindex/carousel/CarouselHomePersonal'], resolve)
        },
        {
          path: 'carouselhomecontentdetail',
          name: 'CarouselHomeContentDetail',
          component: resolve => require(['@/components/shopindex/carousel/CarouselHomeContentDetail'], resolve)
        },
        {
          path: 'carouselhomeleturerdetail',
          name: 'CarouselHomeLeturerDetail',
          component: resolve => require(['@/components/shopindex/carousel/CarouselHomeLeturerDetail'], resolve)
        },
        {
          path: 'carouselhomecd',
          name: 'CarouselHomeColumnDetail',
          component: resolve => require(['@/components/shopindex/carousel/CarouselHomeColumnDetail'], resolve)
        },
        // =============================================================
        //                end
        // ==============================================================

        // =============================================================
        //                start  流量
        // ==============================================================
        {
          path: 'trafficaccount',
          name: 'TrafficAccount',
          component: resolve => require(['@/components/shopindex/traffic/TrafficAccount'], resolve)
        },
        {
          path: 'trafficlist',
          name: 'TrafficList',
          component: resolve => require(['@/components/shopindex/traffic/TrafficList'], resolve)
        },
        {
          path: 'trafficaccountrecharge',
          name: 'TrafficAccountRecharge',
          component: resolve => require(['@/components/shopindex/traffic/TrafficAccountRecharge'], resolve)
        },
        {
          path: 'authpublic',
          name: 'AuthPublic',
          component: resolve => require(['@/components/shopindex/release/AuthPublic'], resolve)
        },
        {
          path: 'authsmallprogram',
          name: 'AuthSmallProgram',
          component: resolve => require(['@/components/shopindex/release/AuthSmallProgram'], resolve)
        },
        {
          path: 'authpublicpay',
          name: 'AuthPublicPay',
          component: resolve => require(['@/components/shopindex/release/AuthPublicPay'], resolve)
        },
        {
          path: 'authsmallprogrampay',
          name: 'AuthSmallProgramPay',
          component: resolve => require(['@/components/shopindex/release/AuthSmallProgramPay'], resolve)
        },
        {
          path: 'authsmallprogramcode',
          name: 'AuthSmallProgramCode',
          component: resolve => require(['@/components/shopindex/release/AuthSmallProgramCode'], resolve)
        }
      ]
    }
  ]
})
