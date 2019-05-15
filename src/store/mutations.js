// 用于更改状态（state中的数据）
import * as types from './mutation-types'

const matutaions = {
  [types.SET_PLAYING_STATE](state, flag) {
    state.playing = flag
  },
  [types.SET_FULL_SCREEN](state, flag) {
    state.fullScreen = flag
  },
  [types.SET_PLAYLIST](state, list) {
    state.playlist = list
  },
  [types.SET_SEQUENCE_LIST](state, list) {
    state.sequenceList = list
  },
  [types.SET_PLAY_MODE](state, mode) {
    state.mode = mode
  },
  [types.SET_CURRENT_INDEX](state, index) {
    state.currentIndex = index
  },
  [types.SET_SINGER](state, singer) {
    state.singer = singer
  },
  [types.SET_MV](state, mv) {
    state.mv = mv
  },
  [types.SET_DISC](state, disc) {
    state.disc = disc
  },
  [types.SET_TOP_LIST](state, topList) {
    state.topList = topList
  },
  [types.SET_SEARCH_HISTORY](state, history) {
    state.searchHistory = history
  },
  [types.SET_PLAY_HISTORY](state, history) {
    state.playHistory = history
  },
  [types.SET_FAVORITE_LIST](state, list) {
    state.favoriteList = list
  },
  [types.SET_FAVORITE_LIST_LIST](state, list) {
    state.favoriteListList = list;
  },
  [types.SET_PLAY_LIST_VISIBLE](state, visible) {
    state.playListVisible = visible;
  },
  [types.SET_ADD_SONG_VISIBLE](state, visible) {
    state.addSongVisible = visible;
  },
  [types.SET_DELETE_SONG_VISIBLE](state, visible) {
    state.deleteSongVisible = visible;
  },
  [types.SET_LYRICSET_VISIBLE](state, visible) {
    state.lyricsetVisible = visible;
  },
  [types.SET_SEEKBAR_VISIBLE](state, visible) {
    state.seekBarVisible = visible;
  },
  [types.SET_MENUBAR_VISIBLE](state, visible) {
    state.menuBarVisible = visible;
  },
}
export default matutaions
