<template>
    <div id="app" 
    >
        <!-- <keep-alive> -->
          <transition :name="transitionName">
            <router-view></router-view>
          </transition>

        <!-- </keep-alive> -->
    </div>
</template>
<script>
import { mapState } from 'vuex'
const URL=require('./dataPass/asssets/Api/api')
import { ajaxGet } from './core/mxApi'
export default {
  data() {
    return {
      // transitionName:''
    }
  },
  computed:{
    ...mapState({
      transitionName: state=>state.transitionName,
      myloading: state=>state.myloading,
      myloadingStyle: state=>state.myloadingStyle,
    })
  },
  created(){
    const mystyle = 
      "background: " + `url(${require('./dataPass/asssets/images/loading.gif')}) no-repeat !important`+ ";background-color:rgba(0, 0, 0, .3) !important;background-size: 2rem, 2rem !important;animation: 0s steps(12, end) infinite !important;background-position: center center !important;width: 1000%;height: 1000%;position: fixed;top: 165% !important;left: 50% !important;transform: translate(-50%, -50%);"
    let mid = document.querySelectorAll('.weui-toast .weui-loading')[0];
    mid.setAttribute("style", `${mystyle}`);
    console.log(mid.style)
    this.$forceUpdate()
  }
}
</script>
<style lang='less'>
@import '~vux/src/styles/reset.less';
:root {
   --bigSize: 0.38rem;// 1 头
   --midSize:0.376rem;// 2 标题
   --minSize:0.36rem;// 3  这个只用审批中心用、公告详情 相当于副标题
   --minSizemid:0.32rem;// 4  一般内容都用这个就行
   --minSizeMin:0.29rem;// 5  小提示
   --userSizeZy: 0.32rem;// 4  应用下方字体专用
}
#app {
    height: 100%;
}
.slide-left-enter-active {
    animation-name: slide-left-in;
    animation-duration: .3s;
}
.slide-left-leave-active {
    animation-name: slide-left-out;
    animation-duration: .3s;
}
.slide-right-enter-active {
    animation-name: slide-right-in;
    animation-duration: .3s;
}
.slide-right-leave-active {
    animation-name: slide-right-out;
    animation-duration: .3s;
}

@keyframes slide-left-in {
    0% {
        transform: translate3d(100%, 0, 0);
    }
    100% {
        transform: translate3d(0, 0, 0);
    }
}

@keyframes slide-left-out {
    0% {
        transform: translate3d(0, 0, 0);
    }
    100% {
        transform: translate3d(-100%, 0, 0);
    }
}

@keyframes slide-right-in{
    0% {
        transform: translate3d(-100%, 0, 0);
    }
    100% {
        transform: translate3d(0, 0, 0);
    }
}
@keyframes slide-right-out  {
    0% {
        transform: translate3d(0, 0, 0);
    }
    100% {
        transform: translate3d(100%, 0, 0);
    }
}
.cjHeader{
  //padding-top:4.7vh !important;
  //padding-top: 3.2vh !important; //constant(safe-area-inset-top)
  //padding-top: 3.2vh !important; //env(safe-area-inset-top)
}
.vux-header{background-color:white !important;font-weight:650 !important;}//padding-top:4.7vh !important;
.vux-header-title{color:black !important;font-size:var(--bigSize) !important;font-weight:650 !important;}
.vux-header-left{margin-top:0.1vh;color:black !important;}
.approvalPeople{
  padding-top:0.2rem;
  margin-bottom:0.2rem;
}
.approvalThing{
  color:#656565 !important;
  font-weight: 0 !important;
}

// ��д�ֲ�ͼ��ʽ
.vux-slider{
  .active{
  width: 12px !important;
  }
}
.weui-btn_mini {
  padding: 0 0.2rem !important;
}
// ͷ���̶�
.headerFixed{position:fixed !important;top:0 !important;z-index:9999;width:100%;left:0;right:0;float:inherit;top:0;}
.marginHeader{padding-top:4vh;}
.weui-toast{font-size:var(--minSizemid);}
.weui-cell{padding:0.25rem 4% !important;}
.vux-flexbox-item{line-height:0.3rem;}
//@bigFontSize:0.38rem !important;
.bigFontSize{font-size:var(--bigSize) !important;font-weight:650 !important;} // 1 头
.midFontSize{font-size:var(--midSize) !important;} // 2 标题
.minFontSize{font-size:var(--minSize) !important;;} // 3  这个只用审批中心用、公告详情
.minFontSizemid{font-size:var(--minSizemid) !important;} // 4  一般内容都用这个就行
.minFontSizeMin{font-size:var(--minSizeMin);} // 5
.userZy{font-size:var(--userSizeZy);} // 应用下方字体专用
// 覆盖alert弹窗 样式
.weui-dialog__hd{padding-top:0.3rem;line-height:0.5rem;font-size:var(--minSizemid);}
.weui-dialog__bd{padding:0.3rem 0;font-size:var(--minSizeMin);}
.weui-dialog__btn{color:#E92323 !important;}
.weui-actionsheet{border-radius:15px 15px 0 0;}
.weui-actionsheet__menu{border-radius:15px 15px 0 0;}
.myFlexItem{word-break:break-all;padding-left:0.2rem;}
.ljManage{opacity:0.9;padding:0 0.15rem !important;float:right;} // 立即处理样式
.parent{
  background-color:#ffffff;
  padding:0 0.25rem;
  :last-child{border-bottom:none;}
}
// 重写input框字体样式
.weui-cells, .vux-x-input, .vux-selector, .vux-x-textarea, .weui-cell, .my_cell{font-size:var(--minSize) !important;}
// 审批列表
.lineHei{line-height:0.4rem;}
.weui-tabbar__icon{height:0.45rem !important;width:0.45rem !important;margin-bottom:0.06rem;}
.vux-tab-item{background:none !important;}
.overTwo{display: -webkit-box;-webkit-box-orient: vertical;-webkit-line-clamp: 2;overflow: hidden;}
// sheet
.mySeetTop{padding:1.1vh 0;}
.sheetColor{color:#E92323;}
.myGroupTit{color:black !important;height:1rem;line-height:1.14rem;margin-top:0 !important;}
.weui-actionsheet__action{padding-bottom: constant(safe-area-inset-bottom) !important;
  padding-bottom: env(safe-area-inset-bottom) !important;}
.weui-wepay-flow__title-right{
  width:86vw;overflow: hidden;text-overflow: ellipsis;white-space: nowrap;
}
// 重写better-scrollbar 样式
.bscroll-vertical-scrollbar{width:5px !important;}
.bscroll-indicator{background: rgba(0, 0, 0, 0.36) !important;}
// 重写loading插件样式
.weui-toast{
  background: none !important;
  // .weui-loading {
  //     background-image: url(./dataPass/asssets/images/loading.gif) !important;
  //     background-color: rgba(0, 0, 0, .3) !important;
  //     background-size: 1rem, 1rem !important;
  //     animation: 0s steps(12, end) infinite !important;
  //     background-position: center center !important;
  //     width: 1000% !important;
  //     height: 1000% !important;
  //     position: fixed !important;
  //     top: 50% !important;
  //     left: 50% !important;
  //     transform: translate(-50%, -50%) !important;
  // }
}



// 动画
.slide-right-enter-active,
.slide-right-leave-active,
.slide-left-enter-active,
.slide-left-leave-active {
 will-change: transform;
 transition: all 500ms;
 position: absolute;
}
.slide-right-enter {
 opacity: 0;
 transform: translate3d(-100%, 0, 0);
}
.slide-right-leave-active {
 opacity: 0;
 transform: translate3d(100%, 0, 0);
}
.slide-left-enter {
 opacity: 0;
 transform: translate3d(100%, 0, 0);
}
.slide-left-leave-active {
 opacity: 0;
 transform: translate3d(-100%, 0, 0);
}

// 重写 流程样式
.flowtitlecss {
  padding: 0 0.2rem 0.2rem 0.2rem !important;
  /deep/ .weui-wepay-flow__bd {
    margin-left: -6.5rem;
  }
  .revicss {
    color: black;
    margin: 0 0 0.1rem 0.25;
  }
}
.vux-badge-my{color:#FE6F6F !important;margin-left:4px;background:#FFEAEA !important;}
.el-checkbox{font-weight:normal !important;}
//
</style>
