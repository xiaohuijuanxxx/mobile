// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import App from './App';
import router from './rootRouter';
import store from './store/store.js';
import  { ToastPlugin, LoadingPlugin ,AlertPlugin,ConfirmPlugin} from 'vux';
import setRemUnit from './core/utils/fontRes'
import VueScroller from 'vue-scroller'

import VConsole from 'vconsole';
let vconsole = new VConsole();
export default vconsole;


//引入公共组件
import './share/assets/style/mx_ui.css';
import Header from './common/index.js'//引用全局组件Button


//引入cookie
// import VueCookie from 'vue-cookie';

import touch from 'vue-directive-touch';
Vue.use(touch)

import { 
  XImg, 
  XButton,
  Flexbox, 
  FlexboxItem,
  Group, 
  Divider,
  Tabbar, 
  TabbarItem, 
  Swiper,
  SwiperItem,
  Cell,
  Search,
  Icon,
  XHeader,
  GroupTitle,
  XInput,
  Confirm,
  XTextarea,
  Panel,
  CellBox,
  Card,
  Flow,
  FlowState,
  FlowLine,
  Tab, 
  TabItem,
  Popup,
  Picker,
  AjaxPlugin,
  PopupPicker,
  Selector,
  Scroller,
  Actionsheet,
  Radio,
  Swipeout, 
  SwipeoutItem,
  Spinner,
  SwipeoutButton
} from 'vux';
import 'babel-polyfill';
import Es6Promise from 'es6-promise';
import {Checkbox,CheckboxGroup} from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';

Es6Promise.polyfill()
Vue.use(Header)
Vue.use(ToastPlugin)
Vue.use(LoadingPlugin)
Vue.use(AlertPlugin)
Vue.use(AjaxPlugin)
Vue.use(ConfirmPlugin)
Vue.use(Checkbox)
Vue.use(CheckboxGroup)
Vue.use(VueScroller)

Vue.config.productionTip = false


Vue.component('x-img', XImg)
Vue.component('x-button', XButton)
Vue.component('flexbox', Flexbox)
Vue.component('flexbox-item', FlexboxItem)
Vue.component('divider', Divider)
Vue.component('tabbar', Tabbar)
Vue.component('tabbar-item', TabbarItem)
Vue.component('Group', Group)
Vue.component('swiper', Swiper)
Vue.component('swiper-item', SwiperItem)
Vue.component('cell', Cell)
Vue.component('search', Search)
Vue.component('icon', Icon)
Vue.component('x-header', XHeader)
Vue.component('group-title', GroupTitle)
Vue.component('x-input', XInput)
Vue.component('confirm', Confirm)
Vue.component('x-textarea', XTextarea)
Vue.component('panel', Panel)
Vue.component('cell-box', CellBox)
Vue.component('card', Card)
Vue.component('flow', Flow)
Vue.component('flow-state', FlowState)
Vue.component('flow-line', FlowLine)
Vue.component('tab', Tab)
Vue.component('tab-item', TabItem)
Vue.component('popup', Popup)
Vue.component('popup-picker', PopupPicker)
Vue.component('selector', Selector)
Vue.component('picker', Picker)
Vue.component('scroller', Scroller)
Vue.component('actionsheet', Actionsheet)
Vue.component('radio', Radio)
Vue.component('swipeout', Swipeout)
Vue.component('swipeout-button', SwipeoutButton)
Vue.component('swipeout-item', SwipeoutItem)
Vue.component('spinner', Spinner)

const FastClick = require('fastclick')
FastClick.attach(document.body)
// require('es6-promise').polyfill

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  components: { App },
  template: '<App/>'
})
