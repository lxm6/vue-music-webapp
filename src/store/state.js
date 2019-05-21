import {
  playMode
} from 'common/js/config'
import {
  loadSearch,
  loadPlay,
  loadFavorite,
  loadFavoriteList
} from 'common/js/cache'
const state = {
  playing: false, //播放状态
  fullScreen: false, //播放器展开方式，全屏或收起
  playlist: [], //播放列表
  sequenceList: [], //顺序播放列表
  mode: playMode.sequence, //播放模式
  currentIndex: -1, //当前播放歌曲的index
  singer: {},
  playListVisible: false,
  addSongVisible: false,
  deleteSongVisible: false,
  lyricsetVisible: false,
  seekBarVisible: false,
  menuBarVisible: false,
  videoVisible: false,
  miniPlayerVisible: true,
  disc: {},
  topList: {},
  vid:'',
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite(),
  favoriteListList: loadFavoriteList(),
}
export default state
