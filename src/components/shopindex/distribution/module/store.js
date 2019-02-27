
const state = {
	chooseShoppingDalogShow : false
}
const mutations = {
	changeChooseShoppingDalogShow(state ,val){
		state.chooseShoppingDalogShow = val
	}
}
const actions = {
	changeChooseShoppingDalogShow(context , val){
		context.commit("changeChooseShoppingDalogShow" , val)
	}
}

const module = {
	state,
	mutations,
	actions
}
export default module
