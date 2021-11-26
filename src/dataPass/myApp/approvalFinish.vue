<template>
    <div v-touch="backHome">
      <x-header :left-options="{backText: ''}" style="background:red" class="cjHeader" >审批结果</x-header>
      <div>
      <div style="margin-bottom: 2rem;text-align: center;">
        <img src="static/approval_finish.png" class="approval_finish_img"/>
        <div class="approval_finish_text">审批处理完成</div>
      </div>
      <flexbox>
        <flexbox-item>
          <x-button plain @click.native="backHome" style="width: 85%;">回到首页</x-button>
        </flexbox-item>
        <flexbox-item v-if="!isTui">
          <x-button plain type="warn" @click.native="continueProcess" style="width: 85%;">继续处理</x-button>
        </flexbox-item>
      </flexbox> 
      </div>
    </div>
</template>
<script>
 import {XHeader, XButton, XImg, Group, Flexbox, FlexboxItem, } from 'vux'
 import minxin from '@/common/commonfunction.js'
 import Bus from '@/bus/bus';
 export default{
    components: {
      XButton,
      XImg,
      Group,
      Flexbox, 
      FlexboxItem,
      XHeader
    },
    mixins: [minxin],
    methods: {
      backHome () {
          let vm = this;
          vm.push("home")
      },
      continueProcess () {
        let vm = this;
        // vm.$store.commit({
        //   type:"changepage",
        //   pageindex:2
        // });
        if (sessionStorage.getItem('isTui')) {
           sessionStorage.removeItem('isTui')
         }
        Bus.$emit('refesh')
        Bus.$emit('changeTodo')
        vm.push("myApproval")
      }       
    },
    mounted() {
      if (sessionStorage.getItem('isTui')) {
        this.isTui = true
      }
      
    },
    data () {
      return {
        finishImage:'static/approval_finish.png',
        isTui: false,
      }
    }
 }
</script>
<style scoped>
  .approval_finish_img {
    margin-top: 1.2rem;
    width: 3.5rem;

  }
  .approval_finish_text {
    font-weight:bold;
    font-size:0.4rem;
  }
</style>