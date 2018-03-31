function setCookie (key, value, hours) {
  var seconds = hours * 60 * 60
  document.cookie = key + '=' + escape(value) + ';max-age=' + seconds
}

function getCookie (key) {
  var arr
  var reg = new RegExp('(^| )' + key + '=([^;]*)(;|$)')

  if ((arr = document.cookie.match(reg))) return unescape(arr[2])
  else return null
}

function deleteCookie (key) {
  var exp = new Date()
  exp.setTime(exp.getTime() - 1)
  var cval = getCookie(key)
  if (cval !== null) {
    document.cookie = key + '=' + cval + ';expires=' + exp.toGMTString()
  }
}

function updateCookie (key, hours) {
  var value = getCookie(key)

  var seconds = hours * 60 * 60
  document.cookie = key + '=' + escape(value) + ';max-age=' + seconds
}

// 返回在vue模板中的调用接口
export default {
  set: function (key, value, hours) {
    return setCookie(key, value, hours)
  },
  get: function (key) {
    return getCookie(key)
  },
  delete: function (key) {
    return deleteCookie(key)
  },
  update: function (key, hours) {
    return updateCookie(key, hours)
  }
}
