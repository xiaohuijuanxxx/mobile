<template>
  <div class="weui_tab">
    <div class="myContent"> 
      <homeDetail v-if="witchchoose==0" ></homeDetail>
      <titledata v-else-if="witchchoose==1"></titledata>
      <application v-else-if="witchchoose==2"></application>
      <myinfo v-else-if="witchchoose==3"></myinfo>
    </div>
    <tabbar v-model='witchchoose' class="myTab" ref="tabbarHeight">
      <tabbar-item @on-item-click="changeChos(0)"> 
        <img v-if="witchchoose==0" slot="icon" src="static/home_firstActive.png">
        <img v-else slot="icon" src="static/home_firstDefault.png">
        <span slot="label" class="tabText">首页</span>
      </tabbar-item>
      <tabbar-item @on-item-click="changeChos(1)">
        <img v-if="witchchoose==1" slot="icon" src="static/home_dataActive.png">
        <img v-else slot="icon" src="static/home_dataDefault.png">
        <span slot="label" class="tabText">数聚</span>
      </tabbar-item>
      <tabbar-item @on-item-click="changeChos(2)">
        <img v-if="witchchoose==2" slot="icon" src="static/home_applactionActive.png">
        <img v-else slot="icon" src="static/home_applactionDefault.png">
        <span slot="label" class="tabText">应用</span>
      </tabbar-item>
      <tabbar-item @on-item-click="changeChos(3)">
        <img v-if="witchchoose==3" slot="icon" src="static/home_myofActive.png">
        <img v-else slot="icon" src="static/home_myofDefault.png">
        <span slot="label" class="tabText">我的</span>
      </tabbar-item>
    </tabbar>
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
  </div>
</template>

<script>
let URL=require('./asssets/Api/api')
import { ajaxGet,ajaxPost,ajaxtokenPost,hideWebViewTitle,closeWindow } from '../core/mxApi'
import homeDetail from './firstpage/homeDetail'
import myinfo from './myinfo/myinfo'
// import titledata from './datasheet/titledata'
import titledata from './firstpage/moreDatasheet'
import application from './myApp/application'
import minxin from '@/common/commonfunction.js'
import Bus from '@/bus/bus';
import http from '@/uitls/http'
export default {
  components: {
    homeDetail,
    myinfo,
    titledata,
    application
  },
  mixins: [minxin],
  created() {
    hideWebViewTitle()
    let _this=this
    let pageindex=_this.$store.state.pageindex
    if(pageindex !=null){
      _this.witchchoose=pageindex;
      _this.$store.commit({
          type:"changepage",
          pageindex:null
        });
    }
    _this.$nextTick(()=>{
      if(window.history && window.history.pushState){
        history.pushState(null,null,document.URL);
        window.addEventListener('popstate',_this.backpage,false)
      }
    })
  },
  mounted(){
    this.$store.commit({
      type:"setTabbarHeight",
      tabbarHeight: this.$refs.tabbarHeight.$el.offsetHeight
    });
    // return this.$store.state.todoData
    let _this=this
    // _this.getin()
    _this.setIndex()
    _this.showloading()
    document.addEventListener('deviceready',()=> {
       //MXWebui.enableTranslucentHeader({    
       // height: '140',    
        //onSuccess: function() {
        //}, // 设置成功   
        //onFail: function() {
       // } // 设置失败 
       // });
      MXWebui.getNavBarHeight({
        onSuccess: res => {
        _this.countHeight = `padding-top:${res-40}px !important;`;
        _this.$store.commit({
          type: 'changePadTop',
          countHeight: _this.countHeight
        })
          }, // 设置成功
         onFail(err){ 
         } // 设置失败
        });
      MXCommon.getEncryptString({
        onSuccess: encryptString=>{
        //这里可以拿到随机token
          console.log('getEncryptString' + encryptString);
          if(encryptString){
            window.sessionStorage.setItem('appToken',encryptString)
            MXCommon.getCurrentUser(user=> {
                sessionStorage.setItem('jzUser', JSON.stringify(user))
                Bus.$emit('setTou')
                let parmas={
                    grant_type:'password',
                    username: user.login_name,
                    password: user.login_name
                    // username: 'admin',
                    // password: '123456'
                }
                _this.getin(parmas,encryptString)
                _this.closeloading()
            });
          }else {
            this.$vux.alert.show({
                title: '警告',
                content: '您好，您暂未拥有京智办公的使用权限',
                onHide() {
                    closeWindow()
                }
            })
          }
        },
        onFail: err=>{
            console.log('err',err)
            this.$vux.alert.show({
                title: '警告',
                content: '您好，您暂未拥有京智办公的使用权限',
                onHide() {
                    closeWindow()
                }
            })
        }
      });
      // MXCommon.getSSOToken(
      //   'datamdwp',
      //   encryptString=> {
      //     window.sessionStorage.setItem('appToken',encryptString)
      //     MXCommon.getCurrentUser(user=> {
      //       sessionStorage.setItem('jzUser', JSON.stringify(user))
      //       Bus.$emit('setTou')
      //       let parmas={
      //         grant_type:'password',
      //         username: user.login_name,
      //         password: user.login_name
      //         // username: 'admin',
      //         // password: '123456'
      //       }
      //       _this.getin(parmas,encryptString)
      //       _this.closeloading()
      //     });
      //   }
      // );
    }) 
  },
  data(){
      return {
          witchchoose:0,
          appindex:null,
          countHeight: null // 状态栏高度
      }
  },
  beforeDestroy(){
    window.removeEventListener('popstate', this.backpage,false)
  },
  beforeRouteLeave(to,from,next){
    if(from.path=='/home'){
      window.removeEventListener('popstate',this.backpage,false)
      next()
    }else{
      if(window.history && window.history.pushState){
        history.pushState(null,null,document.URL);
        window.addEventListener('popstate',this.backpage,false)
      }
      next()
    }
  },
  methods:{
    setIndex() {
      Bus.$on('index', (e) => {
        this.witchchoose = e;
      });
    },
    backpage(){
      let _this=this
      const u= navigator.userAgent
      const isAndroid = u.indexOf('Android') >-1 || u.indexOf('Linux')> -1
      if(isAndroid) {
        _this.showloading()
        sessionStorage.clear()
        ajaxGet(URL.url.loginout).then(res=>{
          _this.closeloading()
          let {data:{code,message,data}}=res
          if(code=='0000'){
            closeWindow()
          }
        }).catch(err=>{
          let omsg=_this.outmsg(err)
          _this.closeloading()
          if(!omsg){
            return
          }
          _this.actionSheetVisable=true
          _this.sheet(omsg)
        })
      }else{
        return
      }
    },
    getin(parmas,encryptString) {
        let _this=this
        let  params={userName: parmas.username,loginChannel:'h5',mx_sso_token:encryptString}
        const u = navigator.userAgent;
        // if (u.indexOf('Android') > -1 || u.indexOf('Linux') > -1) { //安卓手机
          ajaxGet(URL.url.getBeforeLogin,params)
          /* http({
            method:'get',
            url: URL.url.getBeforeLogin,
            params: params
          }) */
          .then(userI=> {
            let {data:{data,code}}=userI
            if(code=='0000'){
              if(data=='x'){
              let parades= {userName:parmas.username}
                ajaxGet(URL.url.addEhrUser,parades).then(rs=> {
                    // let {data:{data,code}}=rs
                    //seeData=JSON.stringify(data)
                    //window.sessionStorage.setItem('currentUser',seeData)
                    let tokenurl=`${URL.url.getToken}?grant_type=password&username=${parmas.username}&password=${parmas.password}`
                    ajaxtokenPost(tokenurl).then(res=> {
                        let token=`${res.data.token_type} ${res.data.access_token}`
                        _this.$store.commit({
                          type:"getssoToken",
                          ssoToken: token
                        });
                      let seeData=JSON.stringify(res.data.principal)
                        window.sessionStorage.setItem('currentUser',seeData)
        
                        _this.closeloading()
                      }).catch(err => {
                        console.log('getToken'+JSON.stringify(err))
                        let omsg=_this.outmsg(err)
                        if(!omsg){
                          return
                        }
                        _this.closeloading()
                        _this.actionSheetVisable=true
                        _this.sheet(omsg)
                      })
                  }).catch(err => {
                    console.log('addEhrUser'+JSON.stringify(err))
                    let omsg=_this.outmsg(err)
                    _this.closeloading()
                    if(!omsg){
                      return
                    }
                    _this.actionSheetVisable=true
                    _this.sheet(omsg)
                  })
              }
              else{
                let tokenurl=`${URL.url.getToken}?grant_type=password&username=${parmas.username}&password=${parmas.password}`
                ajaxtokenPost(tokenurl).then(res=> {
                    let token=`${res.data.token_type} ${res.data.access_token}`
                    _this.$store.commit({
                      type:"getssoToken",
                      ssoToken: token
                    });
                    let seeData=JSON.stringify(res.data.principal)
                    window.sessionStorage.setItem('currentUser',seeData)
                  }).catch(err => {
                    console.log('getToken1'+JSON.stringify(err))
                    let omsg=_this.outmsg(err)
                    if(!omsg){
                      return
                    }
                    _this.closeloading()
                    _this.actionSheetVisable=true
                    _this.sheet(omsg)
                  })
              }
            }
          }).catch(err => {
            console.log('getBeforeLogin'+JSON.stringify(err))
            let omsg=_this.outmsg(err)
            _this.closeloading()
            if(!omsg){
              return
            }
            _this.actionSheetVisable=true
            _this.sheet(omsg)
          })
        // }
      },
      getPersonInfo(){
        let _this=this
        ajaxGet(URL.url.getPersonInfo).then(res=> {
          if(res.data.code=='0000'){
            let {data:{data}}=res
            let seeData=JSON.stringify(data)
            window.sessionStorage.setItem('currentUser',seeData)
            _this.closeloading()
          }  
        }).catch(err => {
          let omsg=_this.outmsg(err)
          if(!omsg){
            return
          }
          _this.closeloading()
          _this.actionSheetVisable=true
          _this.sheet(omsg)
        }) 
      },
      changeChos(value){
        // if (value == '0') {
        //   this.$router.push('/home/homeDetail')
        // } else if (value == '1') {
        //   this.$router.push('/home/moreDatasheet')
        // } else if (value == '2') {
        //   this.$router.push('/home/application')
        // } else if (value == '3') {
        //   this.$router.push('/home/myinfo')
        // }
        this.witchchoose=value
      }
  }
}
</script>
<style lang='less'>
@import '~vux/src/styles/1px.less';

.weui_tab{
    display: flex;
    -webkit-box-orient: vertical;
    flex-direction: column;
    width: 100%;
    height: 100%;
}

.myContent {
    -webkit-box-float:1;
    -webkit-flex:1;
    flex:1;
    width:100%;
    font-size:0.30rem;
  .vux-no-group-title {
    margin-top: 0em;
    position: inherit;
  }
}

.weui-tabbar__item.weui-bar__item_on .weui-tabbar__label {
    color: #f43530 !important;
}
.myTab {
  position:fixed !important;bottom:0;z-index: 999999;
  padding-bottom: constant(safe-area-inset-bottom) !important;
  padding-bottom: env(safe-area-inset-bottom) !important;
}
.myTab2 {
  padding-bottom: constant(safe-area-inset-bottom) !important;
  padding-bottom: env(safe-area-inset-bottom) !important;
}
.myHeader{
  padding-top: constant(safe-area-inset-bottom) !important;
  padding-top: env(safe-area-inset-bottom) !important;
}
.tabText{font-size:0.24rem;}
</style>
