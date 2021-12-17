<template>
  <div class="firstbox1 marginHeader">
    <Header :backoptions="myinfoOptions" title="我的" />
    <!-- <x-header :left-options="myinfoOptions" class="cjHeader esheaderFixed bigFontSize">我的</x-header> -->
    <group label-width="1.5rem" label-margin-right="1rem" label-align="left" class="firstgroup">
      <div class="personinfo">
          <img  slot="icon" :src="users.header" style="display:inline-block;width:16vw;margin:0.1rem 0 0.3rem 0;">
          <div style="margin-bottom:0.1rem;" class="minFontSize">{{users.name}}</div>
          <!-- <div class="minFontSizemid">{{users.position}}&nbsp;|&nbsp;{{users.dept}}</div> -->
      </div>
        <cell title="个人信息" is-link value-align="left" class="cell_my minFontSize" @click.native="editinfo">
            <img  slot='icon' class="checklog" src='static/editor.png'>
        </cell>
        <cell title="用户协议" is-link value-align="left" class="cell_my minFontSize" @click.native="agreeMentAndPolicy(1)">
            <img  slot='icon' class="checklog" src='static/checklog.png'>
        </cell>
        <cell title="隐私政策" is-link value-align="left" class="cell_my minFontSize" @click.native="agreeMentAndPolicy(0)">
            <img  slot='icon' class="checklog" src='static/sujest_info.png'>
       </cell>
        <cell title="设置" is-link value-align="left" class="cell_my minFontSize" @click.native="setting">
          <img  slot='icon' class="checklog" src='static/editor.png'>
      </cell>
      
    </group>
   <!-- <confirm content='<p style="font-size:0.4rem;">是否退出数聚通?</p>' v-model="conShow" @on-confirm="onConfirm"></confirm> -->
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
    <actionsheet v-model="conShow" :menus="menusall" @on-click-menu-delete="onConfirm" show-cancel></actionsheet>   
    <x-button class="out minFontSizemid" @click.native="clwindow">退出登录</x-button>
    </div>
</template>

<script>
  import { mapMutations } from 'vuex';
  let URL=require('../asssets/Api/api')
  import minxin from '../../common/commonfunction';
  import { ajaxGet, closeWindow } from '../../core/mxApi';
  import Header from '@/common/header.vue'
  export default {
    components: {
      Header
    },
    mixins:[minxin],
    mounted() {
      let suerColor = document.getElementsByClassName('weui-dialog__btn_primary')[0]
      suerColor.style.color = 'red'
      let user = JSON.parse(sessionStorage.getItem('jzUser'))
      this.users.header = user?user.avatar_url:''
      this.users.name = user.name
      this.users.position = user.network_unique_name
      let dept = user.dept_name.split('/')
      this.users.dept = dept[dept.length-1]
    },
    data() {
      return {
        myinfoOptions: {
          backText: '',
          showBack: false,
        },
        conShow: false,
        users: {
          header: '',
          name: '',
          position: '',
          dept: ''
        }
      };
    },
    methods: {
      ...mapMutations(['setTransitionName']),
      agreeMentAndPolicy(num) {
        let title = '';
        if (num === 1) {
          title = '用户协议';
        } else {
          title = '隐私政策';
        }
        this.setTransitionName('')
        this.$router.push({ path: '/agreeMentAndPolicy', query: { title } });
      },
      editinfo() {
        this.setTransitionName('')
        this.$router.push({ path: '/personInfo' });
      },
      setting() {
        this.setTransitionName('')
        this.$router.push({ path: '/settings' });
      },
      clwindow() {
        let _this=this
        _this.conShow=true
        _this.sheet('是否退出数聚通?')
      },
      onConfirm () {
         let vm=this
	    vm.showloading()
	    sessionStorage.clear()
	    ajaxGet(URL.url.loginout).then(res=>{
	      vm.closeloading()
	      let {data:{code,message,data}}=res
	      if(code=='0000'){
	        closeWindow()
	      }
	    }).catch(err=>{
	      let omsg=vm.outmsg(err)
	      vm.closeloading()
	      if(!omsg){
	        return
	      }
	      vm.actionSheetVisable=true
	      vm.sheet(omsg)
        })
      }
    },
  };
</script>
<style lang="less" scoped>
@import '~vux/src/styles/1px.less';

.firstbox1 {
   border: none !important;
   position: relative;
   box-sizing:border-box;
   height:calc(100% - 10rem);
   .checklog {
       height: 0.39rem;
       vertical-align:middle;
       margin-left: 0.1rem;
       margin-right: 0.3rem;
   }
}
.firstgroup{
    background-color: white;
    .weui-cells__title {
        margin-top: 0em;
        margin-bottom: 0em;
        padding-left: 15px;
        padding-right: 15px;
        color: #999999;
        background-color: red;
        text-align: center;
        font-size: 14px;
        height: 0rem;
        line-height: 2rem;
    }
}
.cell_my{
  padding-right: 0.4rem !important;
  /deep/ .vux-label{width:2rem !important;}
}
.personinfo{

    text-align: center;
    margin-top: 0.6rem;
    margin-bottom:0.50rem;
}
.cmjHeader{
  padding-top: 4vh !important;
}
.esheaderFixed{position:fixed !important;top:0rem !important;z-index:10000;width:100%;left:0;right:0;margin-top: 0rem;}
.out{padding:1vh;width:95%;border-radius:99px;//margin-bottom:0rem;margin-top:2rem;
    position:absolute;bottom:50px;
    left:0;right:0;
     background-color: #fafafa;color:#E92323;
      &::after{border:none !important;}
    }
</style>
