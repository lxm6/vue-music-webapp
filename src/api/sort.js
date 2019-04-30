import axios from 'axios';

import {
  commonParams,
} from './config'

export function getSortTags() {
  const url = '/api/getSortTags'
  const data = Object.assign({}, commonParams, {
    g_tk: '5381',
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })

}
