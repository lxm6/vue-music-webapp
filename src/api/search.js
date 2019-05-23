import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'
import axios from 'axios';
import {
  getUid
} from '../common/js/util'

//热门搜索
export function getHotKey() {
  const url = 'https://c.y.qq.com/splcloud/fcgi-bin/gethotkey.fcg'

  const data = Object.assign({}, commonParams, {
    uin: 0,
    needNewCode: 1,
    platform: 'h5'
  })

  return jsonp(url, data, options)
}

export function search(query, page, zhida, perpage) {
  const url = '/api/search2';
  const data = Object.assign({}, commonParams, {
    ct:24,
    qqmusic_ver:1298,
    new_json:1,
    remoteplace:'txt.yqq.song',
    searchid:66182022954806325,
    t:0,
    aggr:1,
    cr:1,
    catZhida:zhida ? 1 : 0,
    lossless:0,
    flag_qc:0,
    p:page,
    n:perpage,
    w:query,
    g_tk:getUid(),
    format:'json',
    platform:'yqq.json',
  })

  return axios
      .get(url, {
          params: data
      })
      .then(res => Promise.resolve(res.data));
}

//搜索结果数据
// export function search(query, page, zhida, perpage) {
//   const url = '/api/search';
//   const data = Object.assign({}, commonParams, {
//       w: query,  //搜索内容
//       p: page,   //搜索第几页数据
//       perpage:perpage,     //每一页展示几条数据
//       catZhida: zhida ? 1 : 0,  //是否进行搜索歌手
//       uin: 0,
//       needNewCode: 1,
//       platform: 'h5',
//       zhidaqu: 1,
//       t: 0,
//       flag: 1,
//       ie: 'utf-8',
//       sem: 1,
//       aggr: 0,
//       n: perpage,
//       remoteplace: 'txt.mqq.all',
//       format: 'json'
//   });
//   return axios
//       .get(url, {
//           params: data
//       })
//       .then(res => Promise.resolve(res.data));
// }