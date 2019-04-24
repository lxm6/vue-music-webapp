import axios from 'axios';

import {
  commonParams,
} from './config'

export function getSortTags() {
  const url = '/api/getSortTags'
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    format: 'json'
  })

  return axios.get(url, {
    params: data
  }).then((res) => {
    return Promise.resolve(res.data)
  })

}
