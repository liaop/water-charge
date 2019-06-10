import Vue from 'vue'
import App from './App'
import router from './router'
import logger from './utils/logger'
import db from './utils/db'
import iview from "./iview"
import { Notice, Message } from 'iview'
import 'iview/dist/styles/iview.css'
if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

Vue.use(iview)
Vue.prototype.$logger = logger
Vue.prototype.$db = db
Vue.prototype.$Notice = Notice
Vue.prototype.$Message = Message

new Vue({
  el: '#app',
  router,
  render: h => h(App),
})