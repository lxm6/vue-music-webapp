import Vue from 'vue'
import Router from 'vue-router'

// 路由懒加载
Vue.use(Router)
// 首页-推荐页
const Recommend = (resolve) => {
  import('components/recommend/recommend').then((module) => {
    resolve(module)
  })
}
// 首页-歌手页
const Singer = (resolve) => {
  import('components/singer/singer').then((module) => {
    resolve(module)
  })
}
// 首页-排行榜页
const Rank = (resolve) => {
  import('components/rank/rank').then((module) => {
    resolve(module)
  })
}
// 首页-搜索页
const Search = (resolve) => {
  import('components/search/search').then((module) => {
    resolve(module)
  })
}
// 歌手详情(所有歌曲)
const SingerDetail = (resolve) => {
  import('components/singer-detail/singer-detail').then((module) => {
    resolve(module)
  })
}
// 歌单详情
const Disc = (resolve) => {
  import('components/disc/disc').then((module) => {
    resolve(module)
  })
}
// 榜单详情
const TopList = (resolve) => {
  import('components/top-list/top-list').then((module) => {
    resolve(module)
  })
}

//用户中心
const UserCenter = (resolve) => {
  import('components/user-center/user-center').then((module) => {
    resolve(module)
  })
}

export default new Router({
  routes: [
    {
      path: '/',
      redirect: '/recommend',
      meta: {
        keepAlive: true, 
      },

    },
    {
      path: '/recommend',
      component: Recommend,
      meta: {
        keepAlive: true, 
      },
      children: [
        {
          path: ':id',
          component: Disc,
          meta: {
            keepAlive: true, 
          },
        }
      ]
    },
    {
      path: '/singer',
      component: Singer,
      meta: {
        keepAlive: true, 
      },
      children: [
        {
          path: ':id',
          component: SingerDetail,
          meta: {
            keepAlive: true, 
          },
        }
      ]
    },
    {
      path: '/rank',
      component: Rank,
      meta: {
        keepAlive: true, 
      },
      children: [
        {
          path: ':id',
          component: TopList,
          meta: {
            keepAlive: true, 
          },
        }
      ]
    },
    {
      path: '/search',
      component: Search,
      meta: {
        keepAlive: true, 
      },
      children: [
        {
          path: ':id',
          component: SingerDetail,
          meta: {
            keepAlive: true, 
          },
        }
      ]
    },
    {
      path: '/user',
      component: UserCenter,
      meta: {
        keepAlive: false, 
      },
    }
  ]
})
