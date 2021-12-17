<template>
    <div style="height:100%;" v-touch:right="tobackpage">
        <Header :backoptions="backoptions" title="关于我们" @tobackpage="tobackpage" />
        <!-- <x-header :left-options="backoptions" @on-click-back="tobackpage" class="cjHeader">关于我们</x-header> -->
        <img src="../../../static/favicon.png" style="display:block;width:4rem;padding:1.8rem 0 1.2rem 0;margin:0 auto;">
        <group class="aboutUs">
            <cell title="联系我们" value="shujutong@bankofbeijing.com.cn"></cell>
            <cell title="版本" :value="verson" class="celltwo"></cell>
        </group>
       <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';
    import { url } from '../asssets/Api/api';
    import { ajaxGet} from '../../core/mxApi';
    import minxin from '@/common/commonfunction.js';
    import Header from '@/common/header.vue'
    export default {
      name: 'aboutUs',
      mixins:[minxin],
     components: {
        Header
      },
      data() {
        return {
          backoptions: {
            preventGoBack: true,
            backText: '',
          },
          verson: '',
        };
      },
      mounted() {
        this.getAppVerson();
      },
     beforeRouteLeave(to, from, next){
        if(to.path=='/settings'){
          next()
        }else{
          return
        }
      },
      methods: {
        ...mapMutations(['setTransitionName']),
        tobackpage() {
          this.setTransitionName('slide-right')
          this.push('settings')
        },
        getAppVerson() {
          this.showloading()
          ajaxGet(url.getVersion).then((res) => {
             this.closeloading()
            if (res.data.data != null && res.data.data != 'null' && res.data.data != '') {
             this.verson = res.data.data.versionStr;
            }
          }).catch((error) => {
            this.closeloading()
            let omsg=this.outmsg(error)
              this.closeloading()
              if(!omsg){
                return
              }
            this.actionSheetVisable=true
            this.sheet(omsg);
          });
          },
      },
    };
</script>

<style scoped lang="less">
.aboutUs{
   /deep/ .vux-cell-bd{
   font-size:var(--minSize) !important;
     .vux-label {
       width: 1.5rem;
     }
   }
   /deep/ .weui-cell__ft{font-size:var(--minSize);}
}
</style>
