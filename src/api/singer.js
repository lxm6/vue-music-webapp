import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'
import axios from 'axios';

// 获取歌手信息
export function getSingerList() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/v8.fcg'
  var data = Object.assign({}, commonParams, {
    channel: 'singer',
    page: 'list',
    key: 'all_all_all',
    pagesize: 100,
    pagenum: 1,
    hostUin: 0,
    needNewCode: 0,
    platform: 'yqq',
  })
  return jsonp(url, data, options)
}

//获取歌手详情/音乐
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
    num: 1,
    songstatus: 1
  });
  return jsonp(url, data, options);
}
//获取歌手音乐
export function getSingerMusic(id, page) {
  const url = 'https://v1.itooi.cn/tencent/song/artist';
  const data = {
    id: id,
    page: page,
    pageSize:80
  };
  return axios
    .get(url, {
      params: data
    })
    .then(res => Promise.resolve(res.data));
}
