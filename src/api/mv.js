import {
  commonParams,
} from './config'
import axios from 'axios';
import {
  getUid
} from '../common/js/util'


//mv列表
export function getMvlist(options) {
  const url = '/api/getMvlist';
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    utf8: 1,
    type: options.type? options.type:1,
    year: options.year? options.year:0,
    area: options.area? options.area:0,
    tag: options.tag? options.tag:0,
    pageno: options.pageno? options.pageno:0,
    pagecount: 40,
    otype: 'json',
    format: 'json',
    taglist: 1,
    _: getUid(),
  });
  return axios
    .get(url, {
      params: data
    })
    .then(res => Promise.resolve(res.data));
}

export function getMvUrl(vid) {
  const url = '/api/getMvUrl';
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    outCharset: 'GB2312',
    format: 'jsonp',
    needNewCode: 0,
    data: {
      "getMvUrl": {
        "module": "gosrf.Stream.MvUrlProxy",
        "method": "GetMvUrls",
        "param": {
          "vids": [vid],
          "request_typet": 10001
        }
      }
    }
  })

  return axios
    .get(url, {
      params: data
    })
    .then(res => Promise.resolve(res.data));
}
