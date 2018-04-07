var protocol = 'http'
var domain = '111.231.62.36'
var port = '8080'
var baseUrl = protocol + '://' + domain + ':' + port + '/pet/'

export default {
  getUploadUrl: function () {
    return baseUrl + 'file'
  },
  getWebBaseUrl: function () {
    return baseUrl
  }
}
