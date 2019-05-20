
function getRandomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min)
}

export function shuffle(arr) {
  let _arr = arr.slice()
  for (let i = 0; i < _arr.length; i++) {
    let j = getRandomInt(0, i)
    let t = _arr[i]
    _arr[i] = _arr[j]
    _arr[j] = t
  }
  return _arr
}

//节流函数
export function debounce(func, delay) {
  let timer
  return function (...args) {
    if (timer) {
      clearTimeout(timer)
    }
    timer = setTimeout(() => {
      func.apply(this, args)
    }, delay)
  }
}

export function downloadSong(name, url) {
  setTimeout(() => {
    if (url) {
      const filename = `${name}.mp3`;
      const a = document.createElement("a");
      a.href = url;
      a.download = filename;
      a.click();
    }
  }, 200);
}
export function getUid() {
  let _uid = ''
  if (_uid) {
    return _uid
  }
  if (!_uid) {
    const t = (new Date).getUTCMilliseconds()
    _uid = '' + Math.round(2147483647 * Math.random()) * t % 1e10
  }
  return _uid
}

