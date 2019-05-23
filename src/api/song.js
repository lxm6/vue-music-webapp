import {
  commonParams
} from './config'
// ajax库axios,发起HTTPRequest
import axios from 'axios'
import jsonp from 'common/js/jsonp';

export function getLyric(mid) {
  // 浏览器访问地址, 后端代理地址
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
export function getSongVkey(songmid) {
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
    guid: 5678663290
  });
  return jsonp(url, data, {
    param: 'callback',
    timeout: 5000
  });
}

export function getSongURL(songmid, vkey) {
  return `http://streamoc.music.tc.qq.com/M500${songmid}.mp3?guid=5678663290&vkey=${vkey}&guid=BZQLL&uin=123456&fromtag=6
  `;
}

