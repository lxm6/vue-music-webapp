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
import Bmob from "hydrogen-js-sdk";
// 初始化
Bmob.initialize("1a1bbad97748771aa413459bee60d38f", "35cbfa01f72d4cbcdea8313b7f279aa7");
Vue.use(Bmob)
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
