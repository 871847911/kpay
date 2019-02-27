
const state = {
  // 课程数据
  classData: {
    ruleId: null, // 课程id
    courseType: null, // 课程类型 "1"普通课程 "2"目录课程
    step: 1,
    putong:true,
    mulu:true,
  }
}
const mutations = {
  // 获取规则信息
  getRuleInfo(state, info) {
    state.classData.ruleId = info.ruleId
    state.classData.courseType = info.courseType
    state.classData.step = parseInt(info.step)
  },
  // 普通课程视频开关
  changePutoState(state,status){
    state.classData.putong = status
  },
  // 目录课程视频开关
  changeMuluState(state,status){
    state.classData.mulu = status
  }
}
const actions = {
  // 获取规则信息
  getRuleInfoAction(context, info) {
    context.commit('getRuleInfo', info)
  },
  // 普通课程视频开关
  changePutoState(context,status){
    context.commit('changePutoState', status)
  },
  // 目录课程视频开关
  changeMuluState(context,status){
    context.commit('changeMuluState', status)
  }
}

const share = {
  state,
  mutations,
  actions
}
export default share