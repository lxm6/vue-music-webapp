import Vue from "vue";
import Router from "vue-router";
import store from "@/store";

// 路由懒加载

// 首页-推荐页
const Recommend = resolve => {
  import("components/recommend/recommend").then(module => {
    resolve(module);
  });
};
// 首页-歌手页
const Singer = resolve => {
  import("components/singer/singer").then(module => {
    resolve(module);
  });
};
// 首页-排行榜页
const Rank = resolve => {
  import("components/rank/rank").then(module => {
    resolve(module);
  });
};
// 首页-搜索页
const Search = resolve => {
  import("components/search/search").then(module => {
    resolve(module);
  });
};
// 歌手详情(所有歌曲)
const SingerDetail = resolve => {
  import("components/singer-detail/singer-detail").then(module => {
    resolve(module);
  });
};
// 歌单详情
const Disc = resolve => {
  import("components/disc/disc").then(module => {
    resolve(module);
  });
};
// 榜单详情
const TopList = resolve => {
  import("components/top-list/top-list").then(module => {
    resolve(module);
  });
};
import UserCenter from 'components/user-center/user-center'
// //用户中心
// const UserCenter = resolve => {
//   import("components/user-center/user-center").then(module => {
//     resolve(module);
//   });
// };
//歌单分类
const SaveList = resolve => {
  import("components/save-list/save-list").then(module => {
    resolve(module);
  });
};
//歌单分类
const Sort = resolve => {
  import("components/sort/sort").then(module => {
    resolve(module);
  });
};
//歌单分类
const SortDetail = resolve => {
  import("components/sort-detail/sort-detail").then(module => {
    resolve(module);
  });
};
//注册
const Register = resolve => {
  import("components/register/register").then(module => {
    resolve(module);
  });
};
//登录
const Login = resolve => {
  import("components/login/login").then(module => {
    resolve(module);
  });
};
const ChangePwd = resolve => {
  import("components/changePwd/changePwd").then(module => {
    resolve(module);
  });
};
Vue.use(Router);
const router = new Router({
  routes: [{
      path: "/",
      redirect: "/recommend"
    },

    {
      path: "/recommend",
      component: Recommend,
      children: [{
          path: ":id",
          component: Disc
        },
        {
          path: "/singer",
          component: Singer,
          children: [{
            path: ":id",
            component: SingerDetail,
          }]
        },
        {
          path: "/rank",
          component: Rank,
          children: [{
            path: ":id",
            component: TopList,
          }]
        },
        {
          path: "/sort",
          component: Sort,
          children: [{
            name: "SortDetail",
            path: "/main/sort/sortDetail",
            component: SortDetail,
            children: [{
              path: ":id",
              component: Disc,
            }]
          }]
        }
      ]
    },

    {
      path: "/search",
      component: Search,
      children: [{
        path: ":id",
        component: SingerDetail,
      }]
    },

    {
      path: "/user",
      component: UserCenter,
      children: [{
          path: "/user/saveList/:index",
          component: SaveList,
          children: [{
              path: "/user/singer/:id",
              component: SingerDetail,
            },
            {
              path: "/user/recommend/:id",
              component: Disc,
            }
          ]
        },
        {
          path: "/register",
          component: Register,
        },
        {
          path: "/login",
          component: Login,
        },
        {
          path: "/changePwd",
          component: ChangePwd,
        },
      ]
    }
  ]
});
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
    store.commit("SET_ADD_SONG_VISIBLE", false);
    next(false);
  }
  if (playListVisible) {
    store.commit("SET_PLAY_LIST_VISIBLE", false);
    next(false);
  } else if (playListVisible) {
    store.commit("SET_PLAY_LIST_VISIBLE", false);
    next(false);
  } else if (lyricsetVisible) {
    store.commit("SET_LYRICSET_VISIBLE", false);
    next(false);
  } else if (fullScreen) {
    store.commit("SET_FULL_SCREEN", false);
    next(false);
  } else if (deleteSongVisible) {
    store.commit("SET_DELETE_SONG_VISIBLE", false);
    next(false);
  } else if (menuBarVisible) {
    store.commit("SET_MENUBAR_VISIBLE", false);
    next(true);
  } else {
    next(true);
  }
});

export default router;
