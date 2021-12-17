<template>
  <div style="width:100%;height:100%; background-color:#fafafa;" v-touch:right="tobackpage">
      <div class=" headerFixed " ref="emailAll">
        <!-- v-if="messageHeader" -->
        <x-header :left-options="backoptions" @on-click-back="tobackpage" >
          <tab v-model="tabContent" prevent-default @on-before-index-change="switchTabItem" class="tabcss" bar-active-color="#f43530" :line-width="2" :custom-bar-width="[tabContent != 2 ? '1.6rem' : '0.8rem']">
            <tab-item :selected="selected1" @on-click-item="showReceive" class="bigFontSize">收件箱</tab-item>    
            <tab-item :selected="selected3" @on-click-item="showLaunch" class="bigFontSize">发件箱</tab-item>
          </tab>
        </x-header>
        <!-- <x-header v-else>
          <span v-if="messageName">收件箱</span>
          <span v-else>发件箱</span>
          <div v-if="choose" slot="overwrite-left" @click="clickLeft" style="position:relative;top:0rem;left:-0.1rem;">全选</div>
          <div v-else slot="overwrite-left" @click="clickLeft" style="position:relative;top:0rem;left:-0.1rem;">全不选</div>
          <div slot="right" @click="clickRight" style="color:#000000;position:relative;top:0rem;left:-0.1rem;">完成</div>
        </x-header> -->
      </div>
      <div v-if="!messageHeader" style="margin-top:0.92rem;display:flex;justify-content:space-between;padding: 0 5%;background: #ffffff; ">
          <div v-if="choose" @click="clickLeft" class="minFontSize">全选</div>
          <div v-else @click="clickLeft" class="minFontSize" >全不选</div>
          <div @click="clickRight" class="minFontSize">完成</div>
      </div>
      <div id="myApp" ref="myAppbox">
        <div id="receive" v-if="isClickReceive" >
            <myMessageReceive :headerHeight='headerHeight' />
        </div> 
        <div id="launch" v-if="isClickLaunch" >
            <myMessageLaunch/>
        </div>
      </div>
  </div>
</template>

<script>

import minxin from '@/common/commonfunction.js'
import { XHeader,PopupHeader} from 'vux'
import myMessageReceive from './myMessageReceive'
import myMessageLaunch from './myMessageLaunch'
import { mapState,  mapMutations } from 'vuex';
import Bus from '@/bus/bus';
export default {
  components: {
    XHeader,
    myMessageReceive,
    myMessageLaunch,
    PopupHeader
  },
  mixins: [minxin],
  props:{
    appindex: {
      type: [Number,null],
      default: null
    }
  },
  computed: {
     ...mapState({
        countHeight: state => state.countHeight
      }),
  },
  created() {
    this.$nextTick(() => {
       this.headerHeight = this.$refs.emailAll.offsetHeight
    })
  },
  methods: {
    ...mapMutations(['setTransitionName']),
    // 监听是否搜索框聚焦
    childSearch() {
      let _this = this
      Bus.$on('isSearchFocus', (e) => {
        if (e) {
           let h =document.documentElement.scrollTop// + document.documentElement.clientHeight
           _this.$refs.emailAll.style.cssText= 'position:absolute !important;top:' + h + 'px !important;'
        } else {
          _this.$refs.emailAll.style.cssText = ''
        }
      })
    },
    // 站內信监听滚动 开始
        // scrollEvent() {
        //     var scrollTop =
        //         document.documentElement.scrollTop || document.body.scrollTop;
        //       if (scrollTop == 0) {
        //         let num = 0
        //         let scrollMy = setInterval(() => {
        //           if (num < 40) {
        //             num++
        //             document.documentElement.scrollTop = num
        //           }
        //           if (num == 40) {
        //             window.clearInterval(scrollMy)
        //           }
        //         }, 4)
        //       }
        //   },
        //   watchScroll() {
        //     window.addEventListener("scroll", this.scrollEvent)
        //   },
    switchTabItem (index) {
        this.tabContent = index
        if (index == 0){
           this.showReceive()
        }else if (index == 1){
           this.showLaunch()
        }
    }, 
    showReceive (){
        let self = this
        this.messageHeader = true
        self.isClickReceive = true
        self.isClickLaunch= false
        self.selected1= true
        self.selected2= false
        Bus.$emit('initRe')
       // this.scrollEvent()
       // this.watchScroll()
    }, 
   showLaunch(){
        this.messageHeader = true
        let self = this
        self.isClickLaunch = true
        self.isClickReceive  = false
        self.selected1= false
        self.selected2= true
        Bus.$emit('initSend')
        // this.scrollEvent()
        // this.watchScroll()
    },     
    computtopage(appindex) {
      if(appindex === null){
        this.isClickReceive = true;
        this.switchTabItem(0);
      }else{
        switch(appindex){
          case 0:
            this.isClickReceive = true;
            this.switchTabItem(0);
            break;
          case 1:
            this.isClickLaunch = true;
            this.switchTabItem(1);
            break;
        }
      }
    },
    compile(){
      Bus.$on('on',(open) => {
         if(open==true){
           this.messageHeader=false
           this.messageName=true
         }else if(open==false){
            this.messageHeader=false
           this.messageName=false
         }
  
        })
    },
    clickLeft(){
      if(this.selected1==true){
        if(this.choose==true){
          let reOrder=0
          Bus.$emit('select',reOrder) 
          this.choose=false 
        }else if(this.choose==false){
          let reOrder=1
          Bus.$emit('select',reOrder) 
          this.choose=true
        } 
      }else if(this.selected2==true){
        if(this.choose==true){
          let laOrder=0
          Bus.$emit('select',laOrder) 
          this.choose=false 
        }else if(this.choose==false){
          let laOrder=1
          Bus.$emit('select',laOrder) 
          this.choose=true
        } 
      }
      
    },
    clickRight(){
      this.messageHeader=true
      this.choose=true
      if(this.selected1==true){
        let reOrder=2
        Bus.$emit('select',reOrder)
      }else if(this.selected2==true){
        let laOrder=2
        Bus.$emit('select',laOrder)
      } 
      // this.scrollEvent()
      // this.watchScroll()
    },
    tobackpage() {
       this.setTransitionName('slide-right')
       this.$route.query.isZnzl ? this.$router.go(-1) :
       this.push('home');
       this.$store.commit({
            type: 'changepage',
            pageindex: 2,
          });

      },
      removeEvent() {
        Bus.$on('removeEvent', () => {
          window.removeEventListener("scroll", this.scrollEvent)
        })
      }
  },
  mounted(){
    this.childSearch()
    let tabContent=this.$store.state.tabContent
    if(tabContent !=null){
      this.computtopage(tabContent)
      this.$store.commit({
          type:"changetabContent",
          tabContent:null
        });
    }else{
      this.computtopage(this.appindex)
    }
    this.compile()
    // this.scrollEvent()
    // this.watchScroll()
    // this.removeEvent()
  },
  beforeDestroy() {
    window.clearInterval()
    window.removeEventListener("scroll", this.scrollEvent, false )
  },
  data () {
    return {
      headerHeight: null,
      backoptions: {
        preventGoBack: true,
        backText: '',
      },
      tabContent:0,
      messageHeader:true,
      choose:true,
      messageTabbar:true,
      isClickReceive:false,
      isClickLaunch:false,
      selected1: false,
      selected2: false,
      messageName:true,
      componentKey: 0,
      shut:1,
    }
  }
}
</script>

<style lang="less" scoped>
    .vux-tab .vux-tab-item.vux-tab-selected {
        color: red !important;
    }
    .tabcss{
      .vux-tab {
          overflow: hidden;
          div {
          color: black !important;
          }
      }
    }
    .esHeader{
    margin-top:12vh;
    }
    .active{
        color:red  !important;
        border-color: red !important;
    }
</style>