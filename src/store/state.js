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
  singer: {},
  playing: false,
  fullScreen: false,
  playlist: [],
  sequenceList: [],
  mode: playMode.sequence,
  currentIndex: -1,
  disc: {},
  topList: {},
  searchHistory: loadSearch(),
  playHistory: loadPlay(),
  favoriteList: loadFavorite(),
  favoriteListList: loadFavoriteList(),
  userCenterVisible: false,
}
export default state
