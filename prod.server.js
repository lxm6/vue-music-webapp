var express = require('express')
// var config = require('./config/index')
var axios = require('axios')

// var port = process.env.PORT || config.build.port
var port = 9000

var app = express()

var apiRoutes = express.Router()

// 推荐列表
apiRoutes.get('/getDiscList', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
/* 歌词 */
apiRoutes.get('/lyric', function (req, res) {
  var url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
  axios.get(url, {
    headers: {
      /* 根据访问的网址限制做的一种伪装 */
      referer: 'https://c.y.qq.com/',
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      var reg = /^\w+\(({[^()]+})\)$/
      var mathes = ret.match(reg)
      if (mathes) {
        ret = JSON.parse(mathes[1])
      }
    }
    res.json(response.data)
  }).catch((e) => {
    console.log(e);
  })
})
//获取热门歌单
apiRoutes.get('/getSongList', function (req, res) {
  var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://y.qq.com/',
    },
    params: req.query
  }).then((response) => {
    var ret = response.data
    if (typeof ret === 'string') {
      // var reg = /^\w+\(({[^()]+})\)$/
      var reg = /{.*}/
      var matches = ret.match(reg)
      if (matches) {
        ret = JSON.parse(matches[0])
      }
    }
    res.json(ret)
  }).catch((e) => {
    console.log(e)
  })
})
//搜索结果数据
apiRoutes.get('/search', (req, res) => {
  const url = 'https://c.y.qq.com/soso/fcgi-bin/search_for_qq_cp';
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((error) => {
    console.log(error)
  })
})

// 分类歌单标签
apiRoutes.get('/getSortTags', function (req, res) {
  var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_tag_conf.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
    },
    params: req.query
  }).then((response) => {
    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
//mvURL
apiRoutes.get('/api/getMvUrl', function (req, res) {
  const url = 'https://u.y.qq.com/cgi-bin/musicu.fcg'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
    },
    params: req.query
  }).then((response) => {

    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})
//MV列表
apiRoutes.get('/api/getMvlist', function (req, res) {
  const url = 'https://c.y.qq.com/mv/fcgi-bin/getmv_by_tag'
  axios.get(url, {
    headers: {
      referer: 'https://c.y.qq.com/',
    },
    params: req.query
  }).then((response) => {

    res.json(response.data)
  }).catch((e) => {
    console.log(e)
  })
})

app.use('/api', apiRoutes)

app.use(express.static('./dist'))
module.exports = app.listen(port, function (err) {
  if (err) {
    console.log(err)
    return
  }
  console.log('Listening at http://localhost:' + port + '\n')
})
