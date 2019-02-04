import {commonParams} from './config'
import axios from 'axios'
export function getLyric(mid) {
  const url = '/api/lyric'

  const data = Object.assign({}, commonParams, {
    songmid: mid,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    categoryId: 10000000,
    pcachetime: +new Date(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
// 获取某个歌曲的vkey
export function getSongVkey (songmid) {
  const url = 'https://c.y.qq.com/base/fcgi-bin/fcg_music_express_mobile3.fcg';
  const data = Object.assign({}, commonParams, {
    g_tk: 195219765,
    hostUin: 0,
    notice: 0,
    platform: 'yqq',
    needNewCode: 0,
    cid: 205361747,
    songmid: songmid,
    filename: `C400${songmid}.m4a`,
    guid: 3009522126
  });
  return jsonp(url, data, {
    param: 'callback',
    timeout: 5000
  });
}
// 获取歌曲的url
export function getSongURL (songmid, vkey) {
  return `http://dl.stream.qqmusic.qq.com/C400${songmid}.m4a?vkey=${vkey}&guid=3009522126&uin=0&fromtag=66`;
}
