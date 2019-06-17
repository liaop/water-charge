import { Tooltip, Button, Card, Select, Option, DatePicker, Radio, Tabs, RadioGroup, TabPane, Table, Page, Menu, Poptip, Icon, Input, Form, Modal, MenuItem, FormItem } from 'iview'

const iview = {
    install: function (Vue) {
        Vue.component('Tooltip', Tooltip)
        Vue.component('Radio', Radio)
        Vue.component('RadioGroup', RadioGroup)
        Vue.component('Option', Option)
        Vue.component('Tabs', Tabs)
        Vue.component('Select', Select)
        Vue.component('Poptip', Poptip)
        Vue.component('Button', Button)
        Vue.component('Table', Table)
        Vue.component('Menu', Menu)
        Vue.component('TabPane', TabPane)
        Vue.component('MenuItem', MenuItem)
        Vue.component('Icon', Icon)
        Vue.component('Card', Card)
        Vue.component('Form', Form)
        Vue.component('Input', Input)
        Vue.component('Page', Page)
        Vue.component('Modal', Modal)
        Vue.component('FormItem', FormItem)
        Vue.component('DatePicker', DatePicker)
    }
}

export default iview
