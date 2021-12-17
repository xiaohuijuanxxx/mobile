<template>
    <div style="height:100%;padding-top:0.1rem;" class="marginHeader" v-touch:right="tobackpage">
      <Header :backoptions="backoptions" title='设置' @tobackpage="tobackpage" />
        <!-- <x-header :left-options="backoptions" @on-click-back="tobackpage" class="cjHeader setheaderFixed">设置</x-header> -->
        <group style="height:calc(100%-46px);position:fixed;width:100%;">
            <div style="position: relative;" class="cellright">
                <X-switch title="推送通知" class="mySwi" v-model="noticeswitch" @on-change='changeswitch'></X-switch>
                <img  slot='icon' class="checklog open" src='static/ico.png'>
            </div>
            <cell title="字体设置" is-link @click.native="toSetFont" class="cellright">
                <img  slot='icon' class="checklog" src='static/fresh_clear.png'>
            </cell>
            <cell title="清理缓存" is-link @click.native="conShowing" class="cellright">
                <img  slot='icon' class="checklog" src='static/fresh_clear.png'>
            </cell>
            <cell title="关于我们" is-link @click.native="toAboutus" class="cellright">
                <img  slot='icon' class="checklog" src='static/aboutus.png'>
            </cell>
        </group>
        <!-- <confirm content='<p style="font-size:0.4rem;">确认要清除本地缓存？</p>' v-model="conShow" @on-confirm="onConfirmm"></confirm> -->
        <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
        <actionsheet v-model="conShow" :menus="menusall" @on-click-menu-delete="onConfirmm" show-cancel></actionsheet>    
	</div>
</template>

<script>
    let URL=require('../asssets/Api/api')
    import { XSwitch } from 'vux';
    import minxin from '../../common/commonfunction';
    import { mapMutations } from 'vuex';
    import { ajaxGet,ajaxPost, closeWindow } from '../../core/mxApi';
    import Header from '@/common/header.vue'
    export default {
      name: 'settings',
      components: {
        XSwitch,
        Header
      },
      mixins:[minxin],
      data() {
        return {
            conShow:false,
          backoptions: {
            preventGoBack: true,
            backText: '',
          },
          noticeswitch:true,
          font: null
        };
    },
      mounted() {
        let suerColor = document.getElementsByClassName('weui-dialog__btn_primary')[0]
         suerColor.style.color = 'red'
        let user=JSON.parse(sessionStorage.getItem('currentUser'))
         ajaxGet(URL.url.usersiting,{keyWord:user.username}).then(res=>{
            let {data:{code,message,data}}=res
            if(code=='0000' && data != null){
              this.noticeswitch=!!(Number(data[0].susPmPushMsg));
              this.font = Number(data[0].susSetting1)
            }
          }).catch(err=>{
            let omsg=this.outmsg(err)
            this.closeloading()
            if(!omsg){
              return
            }
            this.actionSheetVisable=true
            this.sheet(omsg)
          })
      },
      beforeRouteLeave(to,from,next){
        if(to.path=='/home'){
          this.$store.commit({
            type: 'changepage',
            pageindex: 3
          });
          next()
        }else if(from.path=='/settings'){
          next()
        }else{
          return
        }
      },
      methods: {
        ...mapMutations(['setTransitionName']),
        tobackpage() {
          this.setTransitionName('slide-right')
          this.push('home')
        },
        toAboutus() {
          this.setTransitionName('')
          this.$router.push({ path: '/aboutUs' })
        },
        toSetFont(){
          this.setTransitionName('')
          this.$router.push({path:'/setFont',query: {font: this.font}})
        },
        conShowing() {
          this.conShow=true
          this.sheet('确认要清除本地缓存？')
        },
        changeswitch(sw){
          let user=JSON.parse(sessionStorage.getItem('currentUser'))
          let parm={
            susUsercode:user.username,
            susPmPushMsg:sw ? 1:0
          }
          this.showloading()
          ajaxPost(URL.url.editsetting, JSON.stringify(parm)).then(res=>{
            let {data:{code,message,data}}=res
            this.closeloading()
            if(code=='0000'){
              console.log(data)
            }
          }).catch(err=>{
            let omsg=this.outmsg(err)
            this.closeloading()
            if(!omsg){
              return
            }
            this.actionSheetVisable=true
            this.sheet(omsg)
          })
        },
        onConfirmm() {
          this.actionSheetVisable=true
          this.sheet('已清除','success')
        }
      } 
    };
</script>

<style scoped lang="less">
    @import '~vux/src/styles/1px.less';
    .weui-cells{height:100%;}
    .checklog {
        margin-left: 0.3rem;
        margin-right: 0.3rem;
        height: 0.39rem;
        vertical-align: middle;
    }
    .mySwi{
        /deep/ .weui-label{padding-left: 1rem;height:0.4rem;color:black;}
        /deep/ .weui-switch{
          height: 0.55rem;
          width: 0.9rem;
          margin-right:-0.3rem;
          &::after{height: 0.54rem;width: 0.56rem;top:-1px;}
          &::before{
            background-color: #fafafa !important;
            height:0.54rem;width:0.56rem;top:-1px;
          }
          &:checked{
            opacity: 0.8;
            border-color: #e92323;
            background-color: #e92323 !important;
          }
        }
        // /deep/ .weui-switch:checked{
        //   border-color: red;
        //   background-color: red !important;
        // }
    }
    .cellright {padding-right: 0.6rem !important;}
    .open{position:absolute;top:0.4rem;left:0.3rem;}
    .setheaderFixed{position:fixed !important;top:0 !important;z-index: 999;width:100%;left:0;right:0;}
</style>
