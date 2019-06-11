import { Tooltip, Button, Table, Page, Menu,Poptip, Icon, Input, Form, Modal, MenuItem, FormItem } from 'iview'

const iview = {
    install: function (Vue) {
        Vue.component('Tooltip', Tooltip)
        Vue.component('Poptip', Poptip)
        Vue.component('Button', Button)
        Vue.component('Table', Table)
        Vue.component('Menu', Menu)
        Vue.component('MenuItem', MenuItem)
        Vue.component('Icon', Icon)
        Vue.component('Form', Form)
        Vue.component('Input', Input)
        Vue.component('Page', Page)
        Vue.component('Modal', Modal)
        Vue.component('FormItem', FormItem)
    }
}

export default iview
