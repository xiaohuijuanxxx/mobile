<template>
<div>
    <div v-if='isNull' style="height:100vh;">
     <search
      @on-result-click="resultClick"
      @on-change="getResult"
      :results="results"
      v-model="searchInfo"
      class="esheaderFixed"
      @on-focus="onFocus"
      @on-cancel="onCancel"
      @on-submit="onSubmit"
      ref="search"></search>
      <img src="../asssets/images/kong.png" class="kong">
    </div>
    <div v-if='!isNull' class="firstbox">
      <flexbox v-if="iseditor"  class="essjuheaderFixed">
          <flexbox-item :span='2'><div @click="noedite" class='midFontSize' style="padding-left:0.2rem;">取消</div></flexbox-item>
          <flexbox-item :span='7'><div class='bigFontSize' style="text-align:center;padding-left:0.36rem;">编辑我的数聚</div></flexbox-item>
          <flexbox-item><div class="datasavecss midFontSize" @click="saveDraggle">保存</div></flexbox-item>
      </flexbox>
      <flexbox v-else>
        <search
        @on-result-click="resultClick"
        @on-change="getResult"
        :results="results"
        v-model="searchInfo"
        @on-focus="onFocus"
        @on-blur='onblur'
        @on-cancel="onCancel"
        @on-submit="onSubmit"
        :class="isTextArea?null:'essjuheaderFixed1'"
        :style="{'padding-top': isTextArea ? jpHeight : '0.3rem','padding-bottom':'0rem'}"
        ref="search"></search>
      </flexbox>
      <flexbox class="eshder">
        <flexbox-item :span="4"><div><b class='bigFontSize'>我的</b></div></flexbox-item>
        <flexbox-item v-show='iseditor'><div class='midFontSize' style="color: #c9c9c9;">长按可以拖动排序</div></flexbox-item>
        <flexbox-item v-show='!iseditor'><div class="flex-noeditor minFontSize" @click="changeditor">编辑</div></flexbox-item>
      </flexbox>
      <br>
      <img src='../asssets/images/nodate.png' v-show="isdataNull" style="width:50%;display:block;margin:0 auto;">
      <flexbox :gutter="0" wrap="wrap" v-if='iseditor'>
          <draggable v-model="draggData" class="vux-flexbox vux-flex-row" :end="end" :options="{handle:'.dd'}" style="flex-wrap:wrap">
          <flexbox-item :span="1/2" v-for="(item, index) in draggData" :key="index" style="margin-bottom:0.23rem;">
              <div class="flex-demotwo" :style="{backgroundImage: `url(${require('../asssets/images/jcsj'+ item.myImgSrc +'.png')})`}" @click="dragHandle(item.reportId,item,index)">
                  <!-- <span v-show='iseditor'><x-icon type="ios-close-outline" size="15" class="icon_rigTop"></x-icon></span> -->
                  <span v-show='iseditor'><div class="appBotton"><img slot="icon" class="rwdemo" src="static/appDelete.png"></div></span>
                  <div class="dd">
                    <div class="demotwotitle minFontSizemid textOver"><b>{{item.reportName}}</b></div>
                    <span class="textOver minFontSizemid" style='width:80%;'>{{item.reportContents}}</span><!-- {{item.reportNR}} -->
                  </div>
              </div>
          </flexbox-item>
          </draggable>
      </flexbox>
      <flexbox :gutter="0" wrap="wrap"  v-if='!iseditor'>
          <flexbox-item :span="1/2" v-for="(item, index) in draggData" :key="index" style="margin-bottom:0.23rem;">
              <div class="flex-demotwo" :style="{backgroundImage: `url(${require('../asssets/images/jcsj'+ item.myImgSrc +'.png')})`}" @click="dragHandle(item.reportId,item,index)">
                  <div class="demotwotitle minFontSizemid textOver"><b>{{item.reportName}}</b></div>
                  <span class="textOver minFontSizemid" style='width:80%;'>{{item.reportContents}}</span>
              </div>
          </flexbox-item>
      </flexbox>
      <br>
      <flexbox>
        <flexbox-item :span="5"><div><b class="bigFontSize">全部</b></div></flexbox-item>
      </flexbox>
      <br>
      <img src='../asssets/images/nodate.png' v-show="isAllNull" style="width:50%;display:block;margin:0 auto;">
      <flexbox :gutter="0" wrap="wrap">
          <flexbox-item :span="1/2" v-for="(item, index) in themeDataList" :key="index" style="margin-bottom:0.23rem;">
              <div class="flex-demotwo add_icon" :style="{backgroundImage: `url(${require('../asssets/images/jcsj'+ item.myImgSrc +'.png')})`}" @click="clickfordetail(item.reportId,item,index)">
                  <!-- <span v-show='iseditor'><x-icon type="ios-plus-outline" size="15" class="icon_rigTop"></x-icon></span> -->
                  <span v-show='iseditor'><div class="appBotton"><img slot="icon" class="rwdemo" src="static/appAdd.png"></div></span>
                  <div class="demotwotitle minFontSizemid textOver"><b>{{item.reportName}}</b></div>

                  <span v-if="item.isPublic == 'Y'" class="textOver minFontSizemid" style='width:80%;'>{{item.reportContents}}</span>
                  <span v-if="item.isPublic == 'N'||''" class="textOver minFontSizemid" style='width:80%;'>{{item.reportNR}}</span>
              </div>
          </flexbox-item>
      </flexbox>
      <!-- <Toast v-model="toastShow" type="text" :time="800" is-show-mask :text="mesg" position="top"></Toast> -->
      <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
    </div>
  </div>
</template>


<script>
import minxin from '@/common/commonfunction.js';
import { Toast } from 'vux';
import { mapState, mapMutations } from 'vuex';
import draggable from 'vuedraggable';
import { ajaxGet } from '../../core/mxApi';
import Bus from '@/bus/bus';
const URL = require('../asssets/Api/api');

export default {
  mixins: [minxin],
  data() {
    return {
     myinfoOptions: {
          backText: '',
          showBack: false,
        },
      inputdata: '',
      jpHeight:null,
      isTextArea:false,
      results: [],
      iseditor: false,
      draggable: false,
      userSetDragg: [],
      tempThemeDataList: [],
      tempDraggData: [],
      //我的报表
      draggData: [],
      mesg: '',
      //我的和全部都为空
      isNull: true,
      //全部为空
      isdataNull: false,
      isAllNull: false,
      searchInfo: ''
    };
  },
  computed: {
    ...mapState({
      themeDataList: state => state.themeList,
      draggDataState: state => state.draggData,
      countHeight: state => state.countHeight,
      tabbarHeight: state => state.tabbarHeight,
      // setHttpThemeList:state =>state.httpThemeList,
    }),
  },
  watch: {
   themeDataList: {
      handler(val) {
        const userinfo = JSON.parse(sessionStorage.getItem("currentUser"));
        if (userinfo.userType != 2 && userinfo.status == "0") {//高级用户
          if (this.themeDataList.length > 0) {
            this.isAllNull = false
          } else {
            this.isAllNull = true
          }
          if(this.draggDataState == '' && this.themeDataList == ''){
            this.isNull = true
          }else {
            this.isNull = false
          }
        }else {
          //普通用户
          this.isNull = false
        }
      },
      immediate: true,
      deep: true,
    },
    draggDataState: {
      handler(val) {
        // let reportidarr=['NORMAL001','NORMAL002','NORMAL003','NORMAL004']
        // this.draggData = this.draggDataState.filter(item=>{return reportidarr.indexOf(item.reportId) == -1});
        const userinfo = JSON.parse(sessionStorage.getItem("currentUser"));
        if (userinfo.userType != 2 && userinfo.status == "0") {//高级用户
          this.draggData = this.draggDataState;
          if (this.draggData.length > 0) {
            this.isdataNull = false
          } else {
            //我的报表或全部报表为空时
            this.isdataNull = true
          }
          this.$forceUpdate()
          if(this.draggDataState == '' && this.themeDataList == ''){
            this.isNull = true
          }else {
            //我的报表和全部都为空
            this.isNull = false
          }
        }else{
          this.isNull = true
        }
      },
      immediate: true,
      deep: true,
    },
  },
  mounted() {
    //全部报表
    this.tempThemeDataList = this.themeDataList.slice(0);
    //我的报表
    this.tempDraggData = this.draggDataState.slice(0);
    // let hei =
    //   document.body.offsetHeight -
    //   this.$refs.header.$el.offsetHeight -
    //   this.tabbarHeight;
    // this.$refs.wrapper.$el.style.cssText = "height:" + hei + "px";
    // this.getUserAddList();
    // this.getThemeList();
  },
  components: {
    Toast,
    draggable,
  },
  methods: {
    ...mapMutations([
      "setHttpThemeList",
      "setDraggData",
      "setDraggIds",
      "setThemeList",
      "setUseIds",
      "setUseData",
      "setUseList",
      "setTransitionName",
    ]),
    setFocus () {
      this.$refs.search.setFocus()
    },
    resultClick (item) {
      this.$refs.search.setBlur()
      // Bus.$emit('search', this.searchInfo);
      this.searchTable(this.searchInfo);
    },
    getResult (val) {
      let rs = []
      rs.push({
        title: val
      })
      this.results = rs
    },
    onSubmit () {
      this.$refs.search.setBlur()
      // Bus.$emit('search', this.searchInfo)
      this.searchTable(this.searchInfo);
    },
    async searchTable(e) {
      if (JSON.parse(sessionStorage.getItem("currentUser"))) {
        // 获取主题数据list
        let httpThemeList = [];
        const parmas = {
          userId: JSON.parse(sessionStorage.getItem("currentUser"))
            ? JSON.parse(sessionStorage.getItem("currentUser")).userId
            : "",
          isMoblie: "Y",
          reportName: e == undefined ? "" : encodeURIComponent(e),
        };
        this.showloading();
        //获取全部固定报表的list
        await ajaxGet(URL.url.getThemeList, parmas)
          .then((res) => {
            this.closeloading(parmas);
            if (
              res.data.data &&
              res.data.data != null &&
              res.data.data != "null" &&
              res.data.data != ""
            ) {
              res.data.data.forEach((item) => {
                //charAt(index) 返回某一位置长度为一的字符串
                const last = item.reportId.charAt(item.reportId.length - 1);
                item.myImgSrc = Number(last);
              });
              httpThemeList = res.data.data;
              this.setHttpThemeList(res.data.data);
              this.data = res.data.data;
            } else {
              //let arr = this.publicReport
              //httpThemeList = this.publicReport
              httpThemeList = res.data.data;
              let arr = [];
              this.setHttpThemeList(arr);
            }
          })
          .catch((error) => {
            const omsg = this.outmsg(error);
            this.closeloading();
            if (!omsg) {
              return;
            }
            this.actionSheetVisable = true;
            this.sheet(omsg);
          });

        //获取全部公共报表的list
        const parmaPublic = {
          userId: JSON.parse(sessionStorage.getItem("currentUser")).userId,
          userName: JSON.parse(sessionStorage.getItem("currentUser")).username,
          reportName: e == undefined ? "" : encodeURIComponent(e),
        };
        await ajaxGet(URL.url.getAllPublicTable, parmaPublic)
        .then((res) => {
          if (
            res.data.data &&
            res.data.data != null &&
            res.data.data != "null" &&
            res.data.data != ""
          ) {
            res.data.data.forEach((item) => {
              const last = item.reportId.charAt(item.reportId.length - 1);
              item.myImgSrc = Number(last);
              // alert(item.myImgSrc)
            });
            httpThemeList = res.data.data.concat(httpThemeList);
            this.setHttpThemeList(httpThemeList);
            this.data = httpThemeList;
          } else {
            httpThemeList = res.data.data.concat(httpThemeList);
            this.setHttpThemeList(httpThemeList);
          }
        })
        .catch((error) => {
          const omsg = this.outmsg(error);
            this.closeloading();
            if (!omsg) {
              return;
            }
            this.actionSheetVisable = true;
            this.sheet(omsg);
        });
        this.setThemeList(httpThemeList);
        this.data = data;
      }
    },
    onFocus () {
      this.jpHeight = null
      // this.jpHeight = (window.outerHeight - window.innerHeight*1.7)+ 'px'
      this.jpHeight = '0.3rem !important'
      this.isTextArea = true
      let suerColor = document.getElementsByClassName('vux-search_show')[0]
      suerColor.style.height = '0rem'
      // setTimeout(() => {
      //   document.documentElement.scrollTop = document.body.offsetHeight
      // }, 100)
    },
    onblur() {
       this.isTextArea = false
    },
    onCancel () {
      this.searchInfo = ''
      // Bus.$emit('search', this.searchInfo)
      this.searchTable(this.searchInfo);
    },
    changeditor() {
      this.iseditor = true;
      this.draggable = true;
    },
    //取消编辑时，还原为原来我的报表
    noedite() {
      this.iseditor = false;
      this.draggable = false;
      this.init();
    },
    init() {
      this.setDraggData(this.tempDraggData);
      this.setThemeList(this.tempThemeDataList);
      // this.$nextTick(()=>{
        // this.draggData = this.tempDraggData;
      //   this.themeDataList = this.tempThemeDataList;
      //   this.$forceUpdate();
      // })
    },

    //全部报表连接跳转
    clickfordetail(id, item, index) {
      if (!this.iseditor) {
        const u= navigator.userAgent
        const isAndroid = u.indexOf('Android') >-1 || u.indexOf('Linux')> -1
        if(!id){
          return
        }
      //  if(isAndroid){
          //this.openTableau(id)
          // this.$router.push(`dataDetail/${id}`);
      //  }else{
      //    this.actionSheetVisable=true
      //    this.sheet('此功能iOS版本正在建设中，敬请期待','info')
      //  }
         this.setTransitionName('slide-right')
          this.$router.push({
            name: "titleDetail",
            params:{
              id:id,
              isPublic:item.isPublic
            }
          });
      } else if (this.draggData.length === 4) {
        this.actionSheetVisable=true;
        this.sheet('我的数聚最多只能保存4条');
        // this.mesg = '我是有底线的';
        // this.toastShow = true;
      } else {
        this.addDaggle(item, index);
      }
    },
    //我的报表连接跳转
    dragHandle(id, item, index) {
      if (!this.iseditor) {//非编辑则跳转
        const u= navigator.userAgent
        const isAndroid = u.indexOf('Android') >-1 || u.indexOf('Linux')> -1
        if(!id){
          return
        }
        // if(isAndroid){
          //this.openTableau(id)
          // this.$router.push(`dataDetail/${id}`);
          this.$router.push({
            name: "titleDetail",
            params:{
              id:id,
              isPublic:"Y"
            }
          });
      //  }else{
      //    this.actionSheetVisable=true
      //    this.sheet('此功能iOS版本正在建设中，敬请期待','info')
      //  }

      } else {
        this.addTheme(item, index);
        /* this.themeDataList.push(item);
        this.draggData.splice(index, 1); */
      }
    },
    //从我的移动到全部
    addTheme(item, index) {
      const theme = this.themeDataList.slice(0);
      theme.push(item);
      this.setThemeList(theme);
      const dt = this.draggData.slice(0);
      dt.splice(index, 1);
      this.setDraggData(dt);
    },
    //从全部添加到我的
    addDaggle(item, index) {
      const dt = this.draggData.slice(0);
      dt.push(item);
      this.setDraggData(dt);
      const theme = this.themeDataList.slice(0);
      theme.splice(index, 1);
      this.setThemeList(theme);
    },
    saveDraggle() {
      const dt = [];
      this.draggData.forEach((item) => {
        let tag = ''
        dt.push(`${item.reportId}_${tag = item.isSensitive ? 'Y' : 'N'}`);
      });
      console.log(dt)
      let setting = ''
      if (dt.length > 0) {
          setting = dt.join(',')
      }
      this.iseditor = false;
      let params = { setting: setting, userName: JSON.parse(sessionStorage.getItem('currentUser')).username }
      ajaxGet(URL.url.saveOrUpdateSetting, params).then((res) => {
        //全部报表重新备份拖拽前
        this.tempThemeDataList = this.themeDataList.slice(0);
        //我的报表重新备份拖拽前
        this.tempDraggData = this.draggDataState.slice(0);
        this.actionSheetVisable=true;
        this.sheet('保存成功');
        // this.mesg = '保存成功';
        // this.toastShow = true;
      }).catch((error) => {
        let omsg=this.outmsg(error)
        this.closeloading()
        if(!omsg){
          return
        }
        this.actionSheetVisable=true;
        this.sheet(omsg);
        // this.mesg = '保存失败，请再试试看~';
        // this.toastShow = true;
        this.init();
      });
    },
    // 对应用进行位置调换
    end(e) {
      const newIndex = e.newIndex;
      const oldIndex = e.oldIndex;
      [this.draggData[oldIndex], this.draggData[newIndex]] = [this.draggData[newIndex], this.draggData[oldIndex]];
      this.setDraggData(this.draggData);
    },
  },
};
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

.firstbox {
   padding: 0 0.25rem 1.7rem 0.25rem;
   height: auto;
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

.flex-demotwo {
    text-align: center;
    min-height: 1.5rem;
    // background: url(/static/all_gives.png) no-repeat;
    background-size:100% 100%;
    background-repeat:none;
    align-items:center;
    justify-content:center;
    position:relative;
    width:94%;
    /*margin-left: 0.2rem;*/
    margin: 0 auto;
    padding-bottom:0.2rem;
    .demotwotitle{
        line-height: 0.3rem;
        padding-top:0.5rem;
        padding-bottom:0.2rem;
        color:#323232;
        pointer-events: none;
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
.icon_rigTop{position:absolute;top:-6px;right:-6px;}
    .add_icon{
        .vux-x-icon{fill:#0778e6;}
    }
.eshder {
  margin-top: 1.8rem;
}
.weui-search-bar__cancel-btn {
  display: none;
  margin-left: 10px;
  line-height: 28px;
  color: black !important;
  white-space: nowrap;
}
.kong{width:60%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%)}
.esheaderFixed{position:fixed !important;z-index:999;width:100%;left:0;padding-top:0.3rem;right:0;margin-top: 0rem;background-color: white;}
.essjuheaderFixed{position:fixed !important;z-index:999;width:100%;top:0;left:0;right:0;background-color: white;padding-top:0.3rem;}
.essjuheaderFixed1{position:fixed !important;z-index:999;width:100%;top:0rem;left:0;right:0;background-color: white;}
.weui-cells .vux-search_show {
  height: 0px !important;
}
.textOver {overflow: hidden;color:#656565;display:inline-block;width:98%;line-height: 0.34rem;text-overflow:ellipsis;
white-space: nowrap;}
.appBotton{
  position:absolute;
  top:-0.15rem;
  right:-0.1rem;
  z-index: 100;
  img{
    width:0.3rem;
  }
}
.rwdemo{
       width: 0.55rem;
  }
</style>
