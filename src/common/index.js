import HeaderCom from './header.vue'
 
// 添加install方法
// Header.install = function(Vue) {
//   Vue.component(Header.name, Header);
// };
const Header = {
    install: function (Vue) {
      Vue.component("header", HeaderCom);
    }
  }


export default Header;
 
