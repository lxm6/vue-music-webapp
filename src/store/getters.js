export const singer = state => state.singer
export const playing = state => state.playing
export const fullScreen = state => state.fullScreen
export const playlist = state => state.playlist
export const sequenceList = state => state.sequenceList
export const mode = state => state.mode
export const currentIndex = state => state.currentIndex
export const currentSong = (state) => {
  return state.playlist[state.currentIndex] || {}
}
export const disc = state => state.disc
export const topList = state => state.topList
export const searchHistory = state => state.searchHistory
export const playHistory = state => state.playHistory
export const favoriteList = state => state.favoriteList
export const favoriteListList = state => state.favoriteListList;
export const playListVisible = state => state.playListVisible;
export const addSongVisible = state => state.addSongVisible;
export const deleteSongVisible = state => state.deleteSongVisible;
export const lyricsetVisible = state => state.lyricsetVisible;
export const seekBarVisible = state => state.seekBarVisible;
export const menuBarVisible = state => state.menuBarVisible;
export const videoVisible = state => state.videoVisible;
export const vid = state => state.vid;
