import 'babel-polyfill'
import Mui from 'vue-awesome-mui';
import Vue from 'vue';
import App from './App';
import router from './router'
import fastclick from 'fastclick'
import VueLazyload from 'vue-lazyload'
import store from './store'
import MuseUI from 'muse-ui'
import 'muse-ui/dist/muse-ui.css'
import 'common/stylus/index.styl'

// 初始化

fastclick.attach(document.body)
Vue.use(MuseUI)
Vue.use(Mui);
Vue.use(VueLazyload, {
  loading: require('common/image/lazyimg1.png')
})
/* eslint-disable no-new */
new Vue({
  el: '#app',
  render: h => h(App),
  router,
  store
});
