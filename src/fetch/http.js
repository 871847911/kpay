import axios from 'axios'
import router from '../router'
import store from '../store'

import Cookies from 'js-cookie'
import {
  Message,
  Loading
} from 'element-ui'

// 默认配置

axios.defaults.timeout = 10000
axios.defaults.headers['X-Requested-Page'] = 'json'
axios.defaults.withCredentials = true

// 请求拦截

axios.interceptors.request.use(config => {
  // 设置token

  const token = store.state.token
  token && (config.headers['X-Auth-Token'] = token)

  return config
}, error => {
  return Promise.reject(error)
})

// 响应拦截

axios.interceptors.response.use(response => {
  if (response.status === 200) {
    return Promise.resolve(response)
  } else {
    return Promise.reject(response)
  }
}, error => {
  if (error.response.status) {
    switch (error.response.status) {
      // 401: 未登录
      case 401:
        router.replace({
          path: '/',
          query: {
            redirect: router.currentRoute.fullPath
          }
        })
        break
        // 403 token过期
      case 403:
        Message.error({
          message: '登录过期，请重新登录'
        })
        // 清除token
        Cookies.remove('token')
        setTimeout(() => {
          router.replace({
            path: '/',
            query: {
              redirect: router.currentRoute.fullPath
            }
          })
        }, 1000)
        break
      case 404:
        Message.error({
          message: '网络请求不存在'
        })
        break
      default:
        Message.error({
          message: '请求数据失败'
        })
    }
    return Promise.reject(error.response)
  }
})

const loadingBg = {
  fullscreen: true,
  background: 'rgba(255,255,255,0.3)'
}

/**
 * get方法，对应get请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function Get(url, params = {}) {
  return new Promise((resolve, reject) => {
    let load = Loading.service(loadingBg)

    axios.get(url, {
      params: params
    }).then(res => {
      load.close()
      resolve(res.data)
    }).catch(err => {
      if (load) {
        load.close()
      }
      reject(err.data)
    })
  })
}

/**
 * post方法，对应post请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function Post(url, data = {}, config) {
  return new Promise((resolve, reject) => {
    let load = Loading.service(loadingBg)

    axios({
      method: 'post',
      url: url,
      data: data,
      ...config
    })
      .then(res => {
        load.close()
        resolve(res.data)
      })
      .catch(err => {
        if (load) {
          load.close()
        }
        reject(err.data)
      })
  })
}

/**
 * put方法，仅此一个想要用正常的自己封装一下  我的那个接口就长这样我也很无奈
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function PutMy(url, params = {}, userId) {
  return new Promise((resolve, reject) => {
    let load = Loading.service(loadingBg)

    axios.put(url + '?loginUserId=' + userId, params)
      .then(res => {
        load.close()
        resolve(res.data)
      })
      .catch(err => {
        if (load) {
          load.close()
        }
        reject(err.data)
      })
  })
}

/**
 * Delete方法，对应Delete请求
 * @param {String} url [请求的url地址]
 * @param {Object} params [请求时携带的参数]
 */
export function Delete(url, params = {}) {
  return new Promise((resolve, reject) => {
    let load = Loading.service(loadingBg)

    axios.put(url, params)
      .then(res => {
        load.close()
        resolve(res.data)
      })
      .catch(err => {
        if (load) {
          load.close()
        }
        reject(err.data)
      })
  })
}
