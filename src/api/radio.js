import jsonp from 'common/js/jsonp'
import {
  commonParams,
  options
} from './config'
import axios from 'axios';


//获取电台数据
export function getRadio() {
  const url = 'https://c.y.qq.com/v8/fcg-bin/fcg_v8_radiolist.fcg'

  const data = Object.assign({}, commonParams, {
    channel: 'radio',
    page: 'index',
    tpl: 'wk',
    new: 1,
    p: 0.17910908857451946,
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
  })

  return jsonp(url, data, options)
}

export function getRadioDesc(id) {
  const url = '/api/getRadioDesc'
  const data = Object.assign({}, commonParams, {
    loginUin: 0,
    hostUin: 0,
    platform: 'yqq',
    needNewCode: 0,
    data: {
      "songlist": {
        "module": "pf.radiosvr",
        "method": "GetRadiosonglist",
        "param": {
          "id": Number(id),
          "firstplay": 1,
          "num": 30
        }
      },
      "comm": {
        "ct": "24"
      }
    }
  })
  return axios.get(url, {
    params: data
  }).then(res => {
    return Promise.resolve(res.data)
  })
}
