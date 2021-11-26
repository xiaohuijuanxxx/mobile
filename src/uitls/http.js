import axios from 'axios'
import store from '../store/store'
// import router from '../router'
// import qs from 'qs'

const http = axios.create({
    // baseURL: 'http://10.160.100.102:9999/dlap',
    baseURL: '/dlap',
    withCredentials: true,
    timeout: 1000 * 10,
    headers: {
        'Content-Type':'application/json'
    }
  //  transformRequest: [
  //    function(data){
  //     let datas=JSON.parse(data)
  //      let newdata='';
  //      for (let k in datas) {
  //        if(datas.hasOwnProperty(k)===true) {
  //          newdata += k + '=' +datas[k]+'&';
  //        }
  //      }
  //      newdata=newdata.substring(0,newdata.length-1);
  //      return newdata;
  //    }
  //  ] 
})

//axios.defaults.baseURL = 'http://data.bj.bob:9999/dlap'
// axios.defaults.baseURL = 'http://10.160.100.102:9999/dlap'
//axios.defaults.baseURL = '/dlap'
// axios.defaults.withCredentials = true
//axios.defaults.timeout = 10000

axios.defaults.retry = 2 // 超时后，重新请求次数
axios.defaults.retryDelay = 1000 // 超时后，重新请求间隔时间
// axios.defaults.headers.post['Content-Type'] = 'application/json'

// http request 拦截器
http.interceptors.request.use(
  config => {
    // config.data=config.data?JSON.stringify(config.data):config.data
    let token = store.state.ssoToken
    token && (config.headers.Authorization = token)
    return config
  },
  error => {
    return Promise.reject(error)
  }
)

// http response 拦截器
http.interceptors.response.use(
  response => {
    return response
  },
  error => {
    let errors =error.response
    if (error.code === "ECONNABORTED" && error.message.indexOf('timeout') !== -1) {
      errors={
        message:'服务器超时'
      }
    }
    // const config = error.config
    // 超时处理
    // if (error.code === 'ECONNABORTED' && error.message.indexOf('timeout') !== -1) {
    //   if (!config || !config.retry) return Promise.reject(error)
    //   // 设置变量来跟踪重试次数
    //   config._retryCount = config._retryCount || 0
    //   // 判断是否已经达到最大重新请求次数
    //   if (config._retryCount >= config.retry) {
    //     Message.error('服务器超时！')
    //     return Promise.reject(error)
    //   }
    //   config._retryCount += 1
    //   // eslint-disable-next-line
    //   const backoff = new Promise(reslove => {
    //     setTimeout(() => {
    //       reslove()
    //     }, config.retryDelay || 1)
    //   })
    //   delete config.baseURL
    //   return backoff.then(() => axios(config))
    // }
    if (errors) {
      switch (errors.status) {
        case 401:
          errors.message='您没有权限'
          break
        case 404:
          let errMasge=error.response.data ? error.response.data.error : '接口未找到'
          errors.message=errMasge
          break
        case 406:
          let errMasger=error.response.data ? error.response.data.message : '服务器未反应'
          errors.message=errMasger
          break
        default:
          break
      }
    }
    return Promise.reject(errors && errors.message)
  }
)

function apiAxios(medthod,url,params,response) {
  http({
    method:medthod,
    url:url,
    data:medthod === 'POST' || medthod === 'PUT'? params:null,
    params:medthod === 'GET' || medthod === 'DELETE'? params:null,
  }).then(function(res){
    response(res);
  }).catch(function(err){
    response(err);
  })
}

export default http
