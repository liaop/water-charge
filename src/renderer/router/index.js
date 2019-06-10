import Vue from 'vue'
import Router from 'vue-router'
import Home from '../pages/Home'
import menus from '../menu'

Vue.use(Router)

const childrenRoutes = []

for (const menu of menus) {
  childrenRoutes.push(menu)
}

childrenRoutes.push({
  path: '*',
  redirect: menus[0].path
})

export default new Router({
  routes: [{
    path: '/',
    component: Home,
    children: childrenRoutes,
  }]
})
