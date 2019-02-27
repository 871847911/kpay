import * as types from './mutation-types'

const mutations = {
  [types.SET_USERID](state, userId) {
    state.userId = userId
  },
  [types.SET_ROLEID](state, roleId) {
    state.roleId = roleId
  },
  [types.SET_ISACTIVE] (state, isActive) {
    state.isActive = isActive
  },
  [types.SET_IMAGEHEAD] (state, imageHead) {
    state.imageHead = imageHead
  },
  [types.SET_UPLOADIMAGEHEAD] (state, uploadImageHead) {
    state.uploadImageHead = uploadImageHead
  },
  [types.SET_TOKEN] (state, token) {
    state.token = token
  },
  [types.SET_STOREID](state, storeId) {
    state.storeId = storeId
  },
  [types.SET_NAME](state, name) {
    state.realName = name
  },
  [types.SET_NAME](state, phone) {
    state.phone = phone
  },
  [types.SET_ISFIRSTCOMIMG](state, isFirstComing) {
    state.isFirstCome = isFirstComing
  }
}

export default mutations