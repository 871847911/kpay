import Vue from 'vue'
import router from './router'
import ElementUI from 'element-ui'
import store from './store'
import axios from 'axios'
import VueLazyload from 'vue-lazyload'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import VueClipboard from 'vue-clipboard2'
import $ from 'jquery'

import '../static/umeditor/themes/default/css/umeditor.css'
import '../static/umeditor/umeditor.config.js'
import '../static/umeditor/umeditor.js'
import '../static/umeditor/lang/zh-cn/zh-cn.js'
import './router/config'
import './fetch/http'
import '../static/qiniu.js'
import 'babel-polyfill'
import 'swiper/dist/css/swiper.css'
import './theme/index.css'
import 'styles/index.styl'

import App from './App'
window.$ = $
window.jQuery = $

/* eslint-disable */
require('script-loader!../static/js/iconfont.js')
require('script-loader!../static/webuploader/webuploader-0.1.5.min.js')

Vue.config.productionTip = false
Vue.use(ElementUI)
Vue.use(VueAwesomeSwiper)
Vue.use(VueClipboard)
Vue.prototype.$http = axios

Vue.use(VueLazyload, {
  loading: require('assets/image/loading.png')
})

new Vue({
  el: '#app',
  router,
  store,
  components: {
    App
  },
  template: '<App/>'
})
