
// 用于更改状态（state中的数据）
import * as types from './mutation-types'

const matutaions = {
    [types.SET_SINGER](state, singer) {
      state.singer = singer
    },
}
export default matutaions