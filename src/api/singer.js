import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'

// 获取歌手信息
export function getSingerList(index) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  var data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: index,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
    data: JSON.stringify(commonParams)
  })
  return jsonp(url, data, options)
}

// 获取歌曲信息
export function getSingerDetail(id) {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_singer_track_cp.fcg';
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    format: jsonp,
    notice: 0,
    platform: 'yqq',
    singermid: id,
    order: 'listen',
    begin: 0,
    num: 80,
    songstatus: 1
  });
  return jsonp(url, data, options);
}
