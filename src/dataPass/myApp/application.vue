<template>
  <div style="width:100%;height:100%; background-color:#fafafa;" >
    <div v-if='isNull' style="height:100vh;">
      <x-header :left-options="{showBack: false}" >应用</x-header>    
      <img src="../asssets/images/kong.png" class="kong">
    </div>
  <div v-if='!isNull'>
    <div v-if="iseditor">
      <x-header>
        <span>应用</span>
        <div slot="overwrite-left" @click="noedite" class='midFontSize tit-cancel-save'> 取消</div>
        <div slot="right" @click="saveDraggle" class='midFontSize tit-cancel-save'>保存</div>
      </x-header>
    </div>
    <div v-else>
      <x-header :left-options="{showBack: false}">应用</x-header>   
    </div>
    <div style="background-color:#ffffff;">
    <div class="appXbox">
    <flexbox class="appBoxTitle">
      <flexbox-item :span="4"><div><b class='bigFontSize'>我的</b></div></flexbox-item>
      <flexbox-item v-show='!iseditor'><div class="flex-noeditor minFontSize" @click="changeditor" style="padding-right:0.3rem">编辑</div></flexbox-item>
    </flexbox>
    <br>
      <img src='../asssets/images/nodate.png' v-show="isdataNull" style="width:50%;display:block;margin:0 auto;">
      <flexbox :gutter="0" wrap="wrap" v-if='iseditor'>
          <draggable v-model="useData" class="vux-flexbox vux-flex-row" :end="end" :options="{handle:'.dd'}" style="flex-wrap:wrap">
            <flexbox-item :span="1/4" v-for="(item,index) in useData" :key="index"  style="margin-bottom:0.35rem;">
                <div class="appFloxBox" @click="dragHandle(item.id,item,index)" >
                  <!-- :class="[isDrag === true ? 'imgD' : '','appFloxBox']" -->
                    <span v-show='iseditor'><div class="appBotton"><img slot="icon" class="rwdemo" src="static/appDelete.png"></div></span>
                    <div class="dd">
                      <flexbox orient="vertical" class="appFlexdemotwo" style="text-align: center;min-height: 1.5rem;width:80%;">
                      <flexbox-item><div class="imgBox"><img slot="icon" class="rwdemo" :src="item.url"></div></flexbox-item>
                      <flexbox-item><div class="appcationName userZy" >{{item.value}}</div></flexbox-item>
                   </flexbox>
                 </div> 
                </div>
            </flexbox-item>
          </draggable>
      </flexbox>
      <flexbox :gutter="0" wrap="wrap"  v-if='!iseditor'>
          <flexbox-item :span="1/4" v-for="(item,index) in useData" :key="index" style="margin-bottom:0.35rem;">
              <div @click="dragHandle(item.id,item,index),Skip(item.id)">
                  <flexbox orient="vertical" class="appFlexdemo" style="text-align: center;min-height: 1.5rem;width:80%;">
                      <flexbox-item><div class="imgBox"><img slot="icon" class="rwdemo" :src="item.url"></div></flexbox-item>
                      <flexbox-item><div class="appcationName userZy" >{{item.value}}</div></flexbox-item>
                   </flexbox>
              </div>
          </flexbox-item>
      </flexbox>
      </div>
      </div>
    <div class="appBox">
      <div class="appXbox">
        <flexbox class="appBoxTitle">
          <flexbox-item :span="5"><div><b class="bigFontSize">全部</b></div></flexbox-item>
        </flexbox>
        <br>
        <img src='../asssets/images/nodate.png' v-show="isAllNull" style="width:50%;display:block;margin:0 auto;">
        <flexbox :gutter="0" wrap="wrap" v-if='iseditor'>
              <flexbox-item :span="1/4" v-for="(item,index) in useDataList" :key="index"  style="margin-bottom:0.35rem;">
                  <div class="appFloxBox" @click="clickfordetail(item.id,item,index)">
                    <!-- :class="[isDrag === true ? 'imgD' : '','appFloxBox']" -->
                      <span v-show='iseditor'><div class="appBotton"><img slot="icon" class="rwdemo" src="static/appAdd.png"></div></span>
                      <flexbox orient="vertical" class="appFlexdemotwo" style="text-align: center;min-height: 1.5rem;width:80%;">
                        <flexbox-item><div class="imgBox"><img slot="icon" class="rwdemo" :src="item.url"></div></flexbox-item>
                        <flexbox-item><div class="appcationName userZy" >{{item.value}}</div></flexbox-item>
                      </flexbox>
                </div>
              </flexbox-item>
        </flexbox>
        <flexbox :gutter="0" wrap="wrap"  v-if='!iseditor'>
              <flexbox-item :span="1/4" v-for="(item,index) in useDataList" :key="index"  style="margin-bottom:0.35rem;">
                  <div @click="clickfordetail(item.id,item,index);Skip(item.id)">
                      <flexbox orient="vertical" class="appFlexdemo" style="text-align: center;min-height: 1.5rem;width:80%;">
                          <flexbox-item><div class="imgBox"><img slot="icon" class="rwdemo" :src="item.url"></div></flexbox-item>
                          <flexbox-item><div class="appcationName userZy" >{{item.value}}</div></flexbox-item>
                      </flexbox>
                  </div>
              </flexbox-item>  
        </flexbox>
      </div>
    </div>
      <!-- <Toast v-model="toastShow" type="text" :time="800" is-show-mask :text="mesg" position="top"></Toast> -->
      <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
    </div>
  </div>

</template>
<script>
import minxin from '@/common/commonfunction.js';
import { Toast,XHeader,PopupHeader} from 'vux';
import { mapState, mapMutations } from 'vuex';
import draggable from 'vuedraggable';
import { ajaxGet } from '../../core/mxApi';
import Bus from '@/bus/bus';
const URL = require('../asssets/Api/api');

export default {
  mixins: [minxin],
  data() {
    return {
      inputdata: '',
      jpHeight:null,
      isTextArea:false,
      results: [],
      iseditor: false,
      draggable: false,
      userSetDragg: [],
      tempUseDataList: [],
      tempUseData: [],
      useData: [],
      mesg: '',
      isNull: true,
      isdataNull: false,
      isAllNull: false,
      isDrag: false // 是否开启应用图标抖动动画
    };
  },
  computed: {
    ...mapState({
      useDataList: state => state.useList,
      useDataState: state => state.useData,
      countHeight: state => state.countHeight
    }),
  },
  watch: {
   useDataList: {
      handler(val) {
        if (this.useDataList.length > 0 ) {
          this.isAllNull = false
        } else {
          this.isAllNull = true
        }
        if(this.useDataState == '' && this.useDataList == ''){
          this.isNull = true
        }else {
          this.isNull = false
        }
      },
      immediate: true,
      deep: true,
    },
    useDataState: {
      handler(val) {
        let reportidarr=['01','02','03','04','05',"06","07"]
        this.useData = this.useDataState.filter(item=>{return reportidarr.indexOf(item.id) == -1});
        if (this.useData.length > 0) {
          this.isdataNull = false
        } else {
          this.isdataNull = true
        }
        this.$forceUpdate()
        if(this.useDataState == '' && this.useDataList == ''){
          this.isNull = true
        }else {
          this.isNull = false
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    this.tempUseDataList = this.useDataList.slice(0);
    this.tempUseData = this.useDataState.slice(0);
  },
  components: {
    Toast,
    draggable,
    XHeader,
    PopupHeader
  },
  methods: {
    ...mapMutations(['setUseData', 'setUseList']),
    Skip(id){
      if(id==1){
        this.$router.push({ path: '/myApproval' });
      }else if(id==2){
        this.$router.push('./myNotice');
      }else if(id==3){
          sessionStorage.setItem('source','app')
          this.$router.push({ path: '/myAssistant' });
      }else if(id==6){
        this.$router.push('/knowledge');
      }else if(id==7){
        this.$router.push('/numberDynamics');
      }else if(id==4){
        this.$store.commit({
          type: 'changepage',
          pageindex: 1,
        });
        Bus.$emit('index', 1);
      }else if(id==5){
        this.$router.push('./myMessage');
      }              
    },
    changeditor() {
      this.iseditor = true;
      this.draggable = true;
      //this.isDrag = true
    },
    noedite() {
      
      this.iseditor = false;
      this.draggable = false;
      this.init();

    },
    init() {
      this.setUseData(this.tempUseData);
      this.setUseList(this.tempUseDataList);
    },
    clickfordetail(id, item, index) {
      if (!this.iseditor) {
        const u= navigator.userAgent
        const isAndroid = u.indexOf('Android') >-1 || u.indexOf('Linux')> -1
        if(!id){
          return
        }
       // if(isAndroid){
          this.openTableau(id)
          //this.$router.push(`dataDetail/${id}`);
       // }else{
        //  this.actionSheetVisable=true
        //  this.sheet('此功能iOS版本正在建设中，敬请期待','info')
       // }
      }else if (this.useData.length ===4) {
        this.actionSheetVisable=true;
        this.sheet('我的应用只能保存4个');
        // this.mesg = '我是有底线的';
        // this.toastShow = true;
      }else {
        this.addDaggle(item, index);
      }
    },
    dragHandle(id, item, index) {
      if (!this.iseditor) {
        const u= navigator.userAgent
        const isAndroid = u.indexOf('Android') >-1 || u.indexOf('Linux')> -1
        if(!id){
          return
        }
        //if(isAndroid){
          this.openTableau(id)
          // this.$router.push(`dataDetail/${id}`);
       // }else{
        //  this.actionSheetVisable=true
        //  this.sheet('此功能iOS版本正在建设中，敬请期待','info')
       // }
      } else {
        this.addTheme(item, index);
        /* this.themeDataList.push(item);
        this.draggData.splice(index, 1); */
      }
    },
    addTheme(item, index) {
      const theme = this.useDataList.slice(0);;
      theme.push(item);
      this.setUseList(theme);
      const dt = this.useData.slice(0);;
      dt.splice(index, 1);
      this.setUseData(dt);
      // this.isDrag = false
      // setTimeout(() => {
      //   this.isDrag = true
      // },100)
    },
    addDaggle(item, index) {
      const dt = this.useData;
      dt.push(item);
      this.setUseData(dt);
      const theme = this.useDataList.slice(0);
      theme.splice(index, 1);
      this.setUseList(theme);
      // this.isDrag = false
      // setTimeout(() => {
      //   this.isDrag = true
      // },100)
    },
    saveDraggle() {
      if(this.useData.length<4) {
        this.actionSheetVisable=true;
        this.sheet('我的应用必须保存4个');
      }else {
        const dt = [];
        this.useData.forEach((item) => {
          dt.push(item.id);
        });
        let setting = ''
        if (dt.length > 0) {
            setting = dt.join(',')
        }
        this.iseditor = false;
        let params = { 'userName': JSON.parse(sessionStorage.getItem('currentUser')).username,
                       'reportDragSetting':dt
                    }

        ajaxGet(URL.url.saveOrUpdateMobileAppDrag, params).then((res) => {
          this.actionSheetVisable=true;
          this.sheet('保存成功');
        }).catch((error) => {
          let omsg=this.outmsg(error)
          this.closeloading()
          if(!omsg){
            return
          }
          this.actionSheetVisable=true;
          this.sheet(omsg);
          this.init();
        });
      }
    },
    // 对应用进行位置调换
    end(e) {
      const newIndex = e.newIndex;
      const oldIndex = e.oldIndex;
      [this.useData[oldIndex], this.useData[newIndex]] = [this.useData[newIndex], this.useData[oldIndex]];
      this.setUseData(this.useData);
    },
  }
  }
function getResult (val) {
  let rs = []
  for (let i = 0; i < 20; i++) {
    rs.push({
      title: `${val} result: ${i + 1} `,
      other: i
    })
  }
  return rs
}
</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';

.appBox{
  margin-top:0.2rem;
  background-color:#ffffff;
}
 .appXbox{
    padding:0.3rem 0.3rem 0 0;
    .appBoxTitle{
      padding:0 0 0 0.3rem;
    }
  }

.appFloxBox{
  position:relative;
}
.appBotton{
  position:absolute;
  top:-0.15rem;
  right:-0.1rem;
  z-index: 9999;
  img{
    width:0.3rem;
  }
}


.headerbox {
   margin-bottom:1.2rem;
   height:auto;
}

.flex-noeditor{
  text-align: right;
  padding-right: 0.1rem;
  color:#656565;
}

.datasavecss {
  text-align: right;
  padding-right: 0.2rem;
}

.flex-demotitle {
  text-align: center;
  margin-top: 1rem;
  .headercss{
       border: 0;
        width: 3rem;
        height: 3rem;
   }
   .headerpacture {
        margin-left: -3rem;
        width: 7rem;
        height: 3rem;
   }
}

.appFlexdemo{
    background-size:100% 100%;
    margin-left: 0.3rem;
    .imgBox{
      padding-top:0.1rem;
    }
}

.appFlexdemotwo{
    background-size:100% 100%;
    position:relative;
    margin-left: 0.3rem;
    box-shadow: 0px 0px 2px #b2b2b2;
  .imgBox{
      padding-top:0.1rem;
    }
}

.inutbox {
    box-sizing: border-box;
    width:90%;
    border: 0.08rem solid #b2b2b2;
    border-radius: 0.3rem;
    margin-left: 1rem;
    .inputCss{
       outline: none;
       border:0;
       width: 90%;
    }
}
.icon_rigTop{position:absolute;top:3px;right:3px;z-index: 9999;}
    .add_icon{
        .vux-x-icon{fill:#0778e6;}
    }
.apphder {
  padding-top: 1.2rem;
}
.weui-search-bar__cancel-btn {
  display: none;
  margin-left: 10px;
  line-height: 28px;
  color: black !important;
  white-space: nowrap;
}
.kong{width:60%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
.esheaderFixed{position:fixed !important;z-index:999;width:100%;left:0;right:0;margin-top: 0rem;background-color: white;}
.applicationFixed{position:fixed !important;z-index:999;width:100%;top:0;left:0;right:0;background-color: white;padding:0.33rem 0;}
.applicationFixed1{position:fixed !important;z-index:999;width:100%;top:0rem;left:0;right:0;background-color: white;}
.weui-cells .vux-search_show {
  height: 0px !important;
}
.textOver {overflow: hidden;color:#656565;display:inline-block;width:98%;line-height: 0.34rem;text-overflow:ellipsis;
white-space: nowrap;}
.rwdemo{
       width: 0.55rem;
  }
  .tit-cancel-save{position:relative;top:0rem;left:-0.1rem;font-weight:normal;color:#323232;}
 @-webkit-keyframes dd {
   10%{transform: rotate(20deg);}
   20%{transform: rotate(-10deg);}
   30%{transform: rotate(5deg);}
   40%{transform: rotate(-5deg);}
   50%, 100%{transform: rotate(0deg);}
 }
 @-moz-keyframes dd {
   10%{transform: rotate(20deg);}
   20%{transform: rotate(-10deg);}
   30%{transform: rotate(5deg);}
   40%{transform: rotate(-5deg);}
   50%, 100%{transform: rotate(0deg);}
 }
 .imgD{animation: dd 2.6s .16s linear infinite;}
</style>
