'use strict'

const utils = require('./utils')
const webpack = require('webpack')
const config = require('../config')
const merge = require('webpack-merge')
const path = require('path')
const baseWebpackConfig = require('./webpack.base.conf')
const CopyWebpackPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const FriendlyErrorsPlugin = require('friendly-errors-webpack-plugin')
const portfinder = require('portfinder')

var express = require('express')
var axios = require('axios')
var app = express()
var apiRoutes = express.Router()
app.use('/api', apiRoutes)

const HOST = process.env.HOST
const PORT = process.env.PORT && Number(process.env.PORT)

const devWebpackConfig = merge(baseWebpackConfig, {
  module: {
    rules: utils.styleLoaders({
      sourceMap: config.dev.cssSourceMap,
      usePostCSS: true
    })
  },
  // cheap-module-eval-source-map is faster for development
  devtool: config.dev.devtool,

  // these devServer options should be customized in /config/index.js
  devServer: {
    before(app) {
      //搜索结果数据有mv
   app.get('/api/search', function (req, res) {
    const url = 'https://c.y.qq.com/soso/fcgi-bin/client_search_cp'
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
      app.get('/api/getMvUrl', function (req, res) {
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
      app.get('/api/getMvlist', function (req, res) {
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

      // 分类歌单标签
      app.get('/api/getSortTags', function (req, res) {
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

      // 推荐列表
      app.get('/api/getDiscList', function (req, res) {
        var url = 'https://c.y.qq.com/splcloud/fcgi-bin/fcg_get_diss_by_tag.fcg'
        axios.get(url, { //通过axios发送http请求，同时更改referer，并且把参数给服务端
          headers: {
            referer: 'https://c.y.qq.com/',
          },
          params: req.query //浏览器请求该接口所带来的参数 
        }).then((response) => { //成功回调
          res.json(response.data) //response是QQ音乐接口返回的
        }).catch((e) => {
          console.log(e)
        })
      })
      /* 歌词 */
      app.get('/api/lyric', function (req, res) {
        const url = 'https://c.y.qq.com/lyric/fcgi-bin/fcg_query_lyric_new.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://c.y.qq.com/',
          },
          params: req.query
        }).then((response) => {
          var ret = response.data
          //将接收到的jsonp文件转换为json格式
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
      //获取歌单数据
      app.get('/api/getSongList', function (req, res) {
        var url = 'https://c.y.qq.com/qzone/fcg-bin/fcg_ucc_getcdinfo_byids_cp.fcg'
        axios.get(url, {
          headers: {
            referer: 'https://y.qq.com/',
          },
          params: req.query
        }).then((response) => {
          var ret = response.data
          if (typeof ret === 'string') {
            var reg = /^\w+\(({[^()]+})\)$/
            var matches = ret.match(reg)
            if (matches) {
              ret = JSON.parse(matches[1])

            }
          }
          res.json(ret)
        }).catch((e) => {
          console.log(e)
        })
      })

    },
    clientLogLevel: 'warning',
    historyApiFallback: {
      rewrites: [{
        from: /.*/,
        to: path.posix.join(config.dev.assetsPublicPath, 'index.html')
      }, ],
    },
    hot: true,
    contentBase: false, // since we use CopyWebpackPlugin.
    compress: true,
    host: HOST || config.dev.host,
    port: PORT || config.dev.port,
    open: config.dev.autoOpenBrowser,
    overlay: config.dev.errorOverlay ? {
      warnings: false,
      errors: true
    } : false,
    publicPath: config.dev.assetsPublicPath,
    proxy: config.dev.proxyTable,
    quiet: true, // necessary for FriendlyErrorsPlugin
    watchOptions: {
      poll: config.dev.poll,
    }
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': require('../config/dev.env')
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.NamedModulesPlugin(), // HMR shows correct file names in console on update.
    new webpack.NoEmitOnErrorsPlugin(),
    // https://github.com/ampedandwired/html-webpack-plugin
    new HtmlWebpackPlugin({
      filename: 'index.html',
      template: 'index.html',
      inject: true
    }),
    // copy custom static assets
    new CopyWebpackPlugin([{
      from: path.resolve(__dirname, '../static'),
      to: config.dev.assetsSubDirectory,
      ignore: ['.*']
    }])
  ]
})

module.exports = new Promise((resolve, reject) => {
  portfinder.basePort = process.env.PORT || config.dev.port
  portfinder.getPort((err, port) => {
    if (err) {
      reject(err)
    } else {
      // publish the new Port, necessary for e2e tests
      process.env.PORT = port
      // add port to devServer config
      devWebpackConfig.devServer.port = port

      // Add FriendlyErrorsPlugin
      devWebpackConfig.plugins.push(new FriendlyErrorsPlugin({
        compilationSuccessInfo: {
          messages: [`Your application is running here: http://${devWebpackConfig.devServer.host}:${port}`],
        },
        onErrors: config.dev.notifyOnErrors ?
          utils.createNotifierCallback() : undefined
      }))

      resolve(devWebpackConfig)
    }
  })
})
