import Vue from 'vue';
import Router from 'vue-router';
import store from '@/store';

// 路由懒加载

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

Vue.use(Router)
const router = new Router({
  routes: [{
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
      children: [{
        path: ':id',
        component: Disc,
        meta: {
          keepAlive: false,
        },
      }]
    },
    {
      path: '/singer',
      component: Singer,
      meta: {
        keepAlive: true,
      },
      children: [{
        path: ':id',
        component: SingerDetail,
        meta: {
          keepAlive: false,
        },
      }]
    },
    {
      path: '/rank',
      component: Rank,
      meta: {
        keepAlive: true,
      },
      children: [{
        path: ':id',
        component: TopList,
        meta: {
          keepAlive: false,
        },
      }]
    },
    {
      path: '/search',
      component: Search,
      meta: {
        keepAlive: true,
      },
      children: [{
        path: ':id',
        component: SingerDetail,
        meta: {
          keepAlive: false,
        },
      }]
    },
    {
      path: '/user',
      component: UserCenter,
      meta: {
        keepAlive: false,
      },
      children: [{
        path: ':id',
        component: SingerDetail,
        meta: {
          keepAlive: false,
        },
      }]
    },
   
  ]
})


router.beforeEach((to, from, next) => {
  const {
    fullScreen,
    playListVisible,
    addSongVisible,
    deleteSongVisible,
    lyricsetVisible,
    menuBarVisible
  } = store.getters;

  if (addSongVisible) {
    store.commit('SET_ADD_SONG_VISIBLE', false);
    next(false);
  }
  if (playListVisible) {
    store.commit('SET_PLAY_LIST_VISIBLE', false);
    next(false);
  } else if (playListVisible) {
    store.commit('SET_PLAY_LIST_VISIBLE', false);
    next(false);
  } else if (lyricsetVisible) {
    store.commit('SET_LYRICSET_VISIBLE', false);
    next(false);
  } else if (fullScreen) {
    store.commit('SET_FULL_SCREEN', false);
    next(false);
  }else if (deleteSongVisible) {
    store.commit('SET_DELETE_SONG_VISIBLE', false);
    next(false);
  } else  if (menuBarVisible) {
    store.commit('SET_MENUBAR_VISIBLE', false);
    next(true);
  }  else {
    next(true);
  }

});

export default router;