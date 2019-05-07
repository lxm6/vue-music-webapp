import storage from 'good-storage'

const SEARCH_KEY = '__search__'
//最大缓存15条数据
const SEARCH_MAX_LEN = 15

const PLAY_KEY = '__play__'
//最近播放100首
const PLAY_MAX_LEN = 200

const FAVORITE_KEY = '__favorite__'
const FAVORITE_LIST_KEY = '__favoritelist__';
const FAVORITE_MAX_LEN = 200

const FONTSIZE = '__Fontsize__'
const COLOR = '__Color__'

//操作搜索历史数组的方法
//参数：数组，添加的项，前后比较的函数，最大数量
function insertArray(arr, val, compare, maxLen) {
  // 查找要传入的值是否已经在原存储的数据中存在，没有就返回-1
  const index = arr.findIndex(compare)
  if (index === 0) {
    return
  }
  if (index > 0) {
    arr.splice(index, 1)
  }
  arr.unshift(val)
  if (maxLen && arr.length > maxLen) {
    arr.pop()
  }
}
function deleteFromArray(arr, compare) {
  const index = arr.findIndex(compare)
  if (index > -1) {
    arr.splice(index, 1)
  }
}
//插入最新搜索历史到本地缓存，同时返回新的搜索历史数组
export function saveSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  insertArray(searches, query, (item) => {
    return item === query
  }, SEARCH_MAX_LEN)
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function deleteSearch(query) {
  let searches = storage.get(SEARCH_KEY, [])
  deleteFromArray(searches, (item) => {
    return item === query
  })
  storage.set(SEARCH_KEY, searches)
  return searches
}

export function clearSearch() {
  storage.remove(SEARCH_KEY)
  return []
}

export function loadSearch() {
  return storage.get(SEARCH_KEY, [])
}

export function savePlay(song) {
  let songs = storage.get(PLAY_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, PLAY_MAX_LEN)
  storage.set(PLAY_KEY, songs)
  return songs
}

export function loadPlay() {
  return storage.get(PLAY_KEY, [])
}

//保存收藏歌曲
export function saveFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  insertArray(songs, song, (item) => {
    return song.id === item.id
  }, FAVORITE_MAX_LEN)
  storage.set(FAVORITE_KEY, songs)
  return songs
}
//删除收藏歌曲
export function deleteFavorite(song) {
  let songs = storage.get(FAVORITE_KEY, [])
  deleteFromArray(songs, (item) => {
    return item.id === song.id
  })
  storage.set(FAVORITE_KEY, songs)
  return songs
}
//载入收藏歌曲
export function loadFavorite() {
  return storage.get(FAVORITE_KEY, [])
}
//清空收藏列表
export function clearFavoriteList() {
  storage.set(FAVORITE_KEY)
  return []
}
// 载入收藏的歌单
export function loadFavoriteList() {
  return storage.get(FAVORITE_LIST_KEY, []);
}
// 保存收藏的歌单
export function saveFavoriteList(list) {
  const lists = storage.get(FAVORITE_LIST_KEY, []);
  insertArray(lists, list, item => item.dissid === list.dissid, FAVORITE_MAX_LEN);
  storage.set(FAVORITE_LIST_KEY, lists);
  return lists;
}

// 取消某个歌单的收藏状态
export function deleteFavoriteList(list) {
  const lists = storage.get(FAVORITE_LIST_KEY, []);
  deleteFromArray(lists, item => item.dissid === list.dissid);
  storage.set(FAVORITE_LIST_KEY, lists);
  return lists;
}

export function saveFontsize(fontsize) {
  storage.set(FONTSIZE, fontsize);
}

export function loadFontsize() {
  return storage.get(FONTSIZE, 18)
}
export function saveColor(color) {
  storage.set(COLOR, color);
}

export function loadColor() {
  return storage.get(COLOR, "green")
}

//删除最近播放
export function deletePlay(query) {
  let play = storage.get(PLAY_KEY, [])
  deleteFromArray(play, item => item.id === query.id);
  storage.set(PLAY_KEY, play)
  return play
}

export function clearPlay() {
  storage.remove(PLAY_KEY)
  return []
}
//删除歌曲操作
export function delSong(array) {
  if (array[0] == 0) {
    let favorite = storage.get(FAVORITE_KEY, [])
    let result = favorite.filter(item => !array[1].some(ele => ele.id === item.id))
    storage.set(FAVORITE_KEY, result)
    return result
  } else {
    let play = storage.get(PLAY_KEY, [])
    let result = play.filter(item => !array[1].some(ele => ele.id === item.id))
    storage.set(PLAY_KEY, result)
    return result
  }

}
