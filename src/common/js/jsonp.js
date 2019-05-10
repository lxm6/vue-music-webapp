import originJSONP from 'jsonp'
/**
 * @function jsonp - 对jsonp模块的封装
 * @param {String} url - 请求地址
 * @param {Object} data - 请求数据
 * @param {Object} option - 请求选项
 */
export default function jsonp(url, data, option) {
  //url拼接
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)
//Promise()回调函数，resolve(完成)，reject(失败)
  return new Promise((resolve, reject) => {
    originJSONP(url, option, (err, data) => {
      if (!err) {
        resolve(data)
      } else {
        reject(err)
      }
    })
  })
}
//将数据对象转为querystring字符串
function param(data) {
  let url = ""
  for(var k in data){
       let value = data[k] !== undefined ? data[k] : ''
       url += `&${k}=${encodeURIComponent(value)}`
  }
  return url ? url.substring(1) : ''
}
