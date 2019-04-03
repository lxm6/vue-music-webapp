import { getSongVkey, getSongURL, getLyric } from 'api/song';
import {
  ERR_OK
} from 'api/config'
import {
  Base64
} from 'js-base64'
export default class Song {
  constructor({
    id,
    mid,
    singer,
    name,
    album,
    duration,
    image,
    url,
    isPay = false,
  }) {
    this.id = id
    this.mid = mid
    this.singer = singer
    this.name = name
    this.album = album
    this.duration = duration
    this.image = image
    this.isPay = isPay;
    this.url = url
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
  // 获取歌曲url
//   getSongUrl () {
//     if (this.url) {
//       return Promise.resolve(this.url);
//     }
//     return getSongVkey(this.mid).then((res) => {
//       if (res.code === ERR_OK) {
//         if (res.data.items.length > 0) {
//           let vkey = res.data.items[0].vkey;
//           if (!vkey) { 
//             isEmpty=true;
//             return Promise.reject(new Error('getSongKey function got vkey is null')); 
//           }
//           let currentSongUrl = getSongURL(this.mid, vkey);
//           this.url = currentSongUrl;
//           return Promise.resolve(currentSongUrl);
//         }
//       }
//     }).catch((err) => {
//       return Promise.reject(err);
//     });
//   }
}


// 工厂方法，创建歌曲对象
export function createSong(musicData) {
  return new Song({
    id: musicData.songid,
    mid: musicData.songmid,
    singer: filterSinger(musicData.singer),
    name: musicData.songname,
    album: musicData.albumname,
    duration: musicData.interval,
    isPay: musicData.pay.payplay === 1,
    image: `https://y.gtimg.cn/music/photo_new/T002R300x300M000${musicData.albummid}.jpg?max_age=2592000`,
    // url: ` https://api.bzqll.com/music/tencent/url?key=579621905&id=${musicData.songmid}&br=320`
  })
}

// 如果有多个歌手名，则用/隔开
export function filterSinger(singer) {
  let ret = []
  if (!singer) {
    return ''
  }
  singer.forEach((s) => {
    ret.push(s.name)
  })
  return ret.join('/')
}
