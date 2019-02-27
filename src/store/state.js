import Cookies from 'js-cookie'

let userInfo = ''

if (Cookies.get('vdongUserInfo')) {
  userInfo = JSON.parse(Cookies.get('vdongUserInfo'))
} else {
  userInfo = ''
}

const state = {
  userId: userInfo ? userInfo.userId : '', // 用户id
  roleId: userInfo ? userInfo.roleId : '', // 角色id
  imageHead: userInfo ? userInfo.imageHead : '', // 图片前缀
  uploadImageHead: userInfo ? userInfo.uploadImageHead : '', // 上传时图片前缀
  isActive: userInfo ? userInfo.isActive : '', // 获取店铺目前信息完善的程度（1：店铺信息未完善，2：账户信息未完善，3：未激活，4:已激活）
  token: Cookies.get('token'), // 登录token
  storeId: userInfo ? userInfo.storeId : '', // 店铺id
  realName: userInfo ? userInfo.realName : '', // 登录用户名
  phone: userInfo ? userInfo.phone : '', // 管理员手机号
  isFirstCome: false // 判断是否是首次登陆
}

export default state
