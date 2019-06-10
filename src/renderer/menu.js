import Person from './pages/menu/Person.vue'
import Record from './pages/menu/Record.vue'
import Total from './pages/menu/Total.vue'

const menu = [
  {
    icon: 'md-person',
    title: '住户',
    path: '/person',
    component: Person
  },
  {
    icon: 'md-clipboard',
    title: '记录',
    path: '/record',
    component: Record
  }, {
    icon: 'md-stats',
    title: '统计',
    path: '/total',
    component: Total
  }
]
export default menu
