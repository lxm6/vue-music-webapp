import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'
import axios from 'axios';

/**
 * 获取轮播图数据
 */
export function getRecommend() {
  const url = 'https://c.y.qq.com/musichall/fcgi-bin/fcg_yqqhomepagerecommend.fcg'

  const data = Object.assign({}, commonParams, {
    platform: 'h5',
    uin: 0,
    needNewCode: 1
  })

  return jsonp(url, data, options)
}


/**
 * @function getDiscList 获取推荐歌单
 * @param {Number} categoryId 歌单分类id
 * @param {Number} sortId 歌单类型
 * @param {Number} ein 歌单数目
 */
export function getDiscList(categoryId,sortId,ein) {
  const url = '/api/getDiscList'
  const data = Object.assign({}, commonParams, {
    platform: 'yqq', 
    hostUin: 0,
    sin: 0,
    ein: ein?ein:49,
    sortId: sortId?sortId:5,
    needNewCode: 0,
    categoryId: categoryId?categoryId:100000000,
    rnd: Math.random(),
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })
}
/**
 * @function getSongList 获取推荐歌单里的歌曲数据
 * @param {String} disstid 歌单id
 */
export function getSongList(disstid) {
  const url = '/api/getSongList'
  const data = Object.assign({}, commonParams, {
    disstid,
    type: 1,
    json: 1,
    utf8: 1,
    onlysong: 0,
    platform: 'yqq',
    hostUin: 0,
    needNewCode: 0,
    format: 'json'

  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}

