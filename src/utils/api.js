// 配置API接口地址
// var root = 'http://111.231.62.36:8081/api'
var root = '/api'
// 引用axios
var axios = require('axios')

function updateCookie (key, hours) {
  var arr
  var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')
  var value
  if ((arr = document.cookie.match(reg))) {
    value = unescape(arr[2])
  }
  var seconds = hours * 60 * 60
  document.cookie = key + '=' + escape(value) + ';max-age=' + seconds
}

// 自定义判断元素类型JS
function toType (obj) {
  return ({}).toString.call(obj).match(/\s([a-zA-Z]+)/)[1].toLowerCase()
}
// 参数过滤函数
function filterNull (o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key]
    }
    if (toType(o[key]) === 'string') {
      o[key] = o[key].trim()
    } else if (toType(o[key]) === 'object') {
      o[key] = filterNull(o[key])
    } else if (toType(o[key]) === 'array') {
      o[key] = filterNull(o[key])
    }
  }
  return o
}

function apiAxios (method, url, params, success) {
  if (params) {
    params = filterNull(params)
  }
  axios({
    method: method,
    url: url,
    data: method === 'POST' || method === 'PUT' ? params : null,
    params: method === 'GET' || method === 'DELETE' ? params : null,
    baseURL: root,
    withCredentials: false
  },
  {
    'Access-Control-Allow-Origin': '*'
  })
    .then(function (res) {
      if (url !== '/user/login') {
        updateCookie('name', 0.25)
        updateCookie('auth', 0.25)
        updateCookie('picUrl', 0.25)
      }
      if (success) {
        success(res.data) // 返回的是res.data而不是res
      }
    })
    .catch(function (err) {
      let res = err.response
      if (err) {
        window.alert('api error, HTTP CODE: ' + res.status) // 504（json-server关闭时）
      }
    })
}

// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success) {
    return apiAxios('GET', url, params, success)
  },
  post: function (url, params, success) {
    return apiAxios('POST', url, params, success)
  },
  put: function (url, params, success) {
    return apiAxios('PUT', url, params, success)
  },
  delete: function (url, params, success) {
    return apiAxios('DELETE', url, params, success)
  },
  getRootUrl: function () {
    return root
  }
}
