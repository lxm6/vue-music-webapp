import originJSONP from 'jsonp'

export default function jsonp(url, data, option) {
  /* 将url 和 data 再拼接成url 作为参数 */
  url += (url.indexOf('?') < 0 ? '?' : '&') + param(data)

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

function param(data) {
  let url = ''
  for (let k in data) {
    let value = data[k] !== 'undefined' ? 'data[k]' : ''
    url += `&${k}=${encodeURIComponent(data[k])}`
  }
  return url ? url.substring(1) : ''
}
