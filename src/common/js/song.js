import {
  getSongVkey,
  getSongURL,
  getLyric
} from 'api/song';
import {
  ERR_OK
} from 'api/config'
import {
  Base64
} from 'js-base64'

export default class Song {
  /**
   * @constructor
   * @param {*} id - 歌曲id
   * @param {*} mid - 歌曲mid
   * @param {*} singer - 歌手
   * @param {*} name - 歌曲名
   * @param {*} album - 专辑
   * @param {*} duration - 时长
   * @param {*} image - 歌曲图片
   * @param {*} url - 歌曲URL
   * @param {*} vid - mv的id
   * @param {Boolean} isPay 是否付费歌曲
   * @param {Boolean} isOnly 是否独家
   */
  constructor({
    id,
    mid,
    singerName,
    singerMid,
    name,
    album,
    duration,
    image,
    url,
    isPay = false,
    isOnly = false,
    vid,
  }) {
    this.id = id
    this.mid = mid
    this.singerName = singerName
    this.singerMid = singerMid
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.isPay = isPay;
    this.isOnly = isOnly;
    this.vid = vid;
    this.url = url;
  }

  // 获取歌曲的歌词
  getLyric() {
    // 如果歌词已存在
    if (this.lyric) {
      return Promise.resolve(this.lyric);
    }
    return new Promise((resolve, reject) => {
      getLyric(this.mid).then(res => {
        if (res.retcode === ERR_OK) {
          // 对歌词记性base64解码
          this.lyric = Base64.decode(res.lyric);
          resolve(this.lyric);
        } else {
          reject('no lyric');
        }
      });
    });
  }
  //获取歌曲url
  getSongUrl() {
    if (this.url) {
      return Promise.resolve(this.url);
    }
    return getSongVkey(this.mid).then((res) => {
      if (res.code === ERR_OK) {
        if (res.data.items.length > 0) {
          let vkey = res.data.items[0].vkey;
          if (!vkey) {
            return Promise.reject(new Error('获取vkey失败'));
          }
          console.log("dd")
          let currentSongUrl = getSongURL(this.mid, vkey);
          this.url = currentSongUrl;
          return Promise.resolve(currentSongUrl);
        }
      }
    }).catch((err) => {
      return Promise.reject(err);
    });
  }
}


// 工厂方法，创建歌曲对象
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singerName: filterSingerName(musicData.singer),
    singerMid: musicData.singer[0].mid,
    name: musicData.songname,
    album:musicData.albumname,
    duration: musicData.interval,
    vid:musicData.vid?musicData.vid:'',
    isPay: musicData.pay.payplay === 1,
    isOnly: musicData.isonly===1 ,
    image: musicData.albummid?`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`:'',
    url: `https://v1.itooi.cn/tencent/url?id=${musicData.songmid}&quality=192`
  })
}

// 如果有多个歌手名，则用/隔开
export function filterSingerName(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}

// 工厂方法，创建歌曲对象
export function createSearchSong(musicData) {
  return new Song({
    id: musicData.id,
    mid: musicData.mid,
    singerName: filterSingerName(musicData.singer),
    singerMid: musicData.singer[0].mid,
    name: musicData.title,
    album:musicData.album.name,
    duration: musicData.interval,
    vid:musicData.mv.vid?musicData.mv.vid:'',
    isPay: musicData.pay.pay_play === 1,
    isOnly: musicData.isonly===1 ,
    image: musicData.album.mid?`https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.album.mid}.jpg?max_age=2592000`:'static/defaultCD.png',
    url: `https://v1.itooi.cn/tencent/url?id=${musicData.mid}&quality=192`
  })
}