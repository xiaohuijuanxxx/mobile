<template>
  <div style="height:100%;overflow:hidden;" ref="maintain" v-touch:right="backtohead">
    <Header :backoptions="backoptions" @tobackpage="backtohead" title="主题数据" />
    <!-- <x-header :left-options="backoptions" @on-click-back="backtohead" class="cjHeader">主题数据</x-header> -->
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
    <div style="width:100%;height: calc(100% - 50px);margin-top:0.8rem;" v-touch:right="backtohead">
      <iframe :src="src" class="iframe">
      </iframe>
    </div>
  </div>
</template>


<script>
import { url } from '../asssets/Api/api';
import { ajaxGet } from '../../core/mxApi';
import Header from "@/common/header.vue";
import minxin from '@/common/commonfunction.js'
import { removeWatermark, setWaterMark } from '@/common/watermark.js'

export default {
  data() {
    return {
      src: '',
      Arr: [],
      year: (new Date()).getFullYear(),
      mounth: ((new Date()).getMonth()+1).toString().padStart(2, '0'),
      date: ((new Date()).getDate()).toString().padStart(2, '0'),
      userInfo: JSON.parse(sessionStorage.getItem('currentUser')),
      backoptions: {
            preventGoBack: true,
            backText: '',
          }
    };
  },
  components: {
    Header
  },
  mixins:[minxin],
  created() {
    // alert(this.$route.params.id)
    for (let i = 0; i < 100; i++) {
      this.Arr.push(i)
    }
  },
  mounted() {
    let one = `${this.userInfo.username}-${this.userInfo.name}`
    let two = `${this.year}-${this.mounth}-${this.date}`
    setWaterMark(two, one);
    this.getUrl();
    this.touchMove(this.$refs.maintain, 'home',this)
    // this.touchMoveOver()
  },
  beforeRouteLeave(to, from, next){
    let pageindex = 0
    if (this.$route.query.hasOwnProperty('index')) {
      pageindex = 0
    } else {
      pageindex = 1
    }
    if(to.path=='/home'){
      this.$store.commit({
        type:'changepage',
        pageindex: pageindex
      })
      next()
    }else{
      return
    }
  },
  methods: {
    touchMoveOver() {
      var router = this.$router;
      this.$refs.maintain.addEventListener('touchstart', (e) => {
        console.log('qqqq')
        this.startX =  e.touches[0].pageX;
      })
      this.$refs.maintain.addEventListener('touchmove', (e) => {
        console.log('aaaa')
        var moveEndX = e.changedTouches[0].pageX;
        var  X = moveEndX - this.startX;
        this.$refs.maintain.style.position='relative';
        if ( X < -50 ) {//左滑
          this.$refs.maintain.style.left=X+'px';
        }if(X>50){//右滑
          this.$refs.maintain.style.left=X-50+'px';
        }
      })
      this.$refs.maintain.addEventListener('touchend', (e) => {
        console.log('ddddd')
        if ( this.$refs.maintain.offsetLeft < -50) {
          router.push('./inspect')
        }
        if(this.$refs.maintain.offsetLeft > 50){
          router.push('./equip')
        }
        else{
          this.$refs.maintain.style.left=0+'px';
        }
      })
    },
    backtohead() {
      //window.location.href=window.location.href.split('#')[0]
      removeWatermark()
      this.$router.push({path: '/home'})
    },
    getUrl() {
      // this.src= 'http://10.160.113.58:9704/analytics/saw.dll?dashboard&PortalPath=%2Fshared%2F2017NJ01_南京分行对公贷款分期还款计划表%2F_portal%2Ft&NQUser=weblogic&NQPassword=bank2021'

      /* 公共报表的查询和固定报表查询url走两个接口 */
      //公共报表获取url
      if(this.$route.params.isPublic == "Y"){
        const parmap = {
          userId: JSON.parse(sessionStorage.getItem("currentUser")).userId,
          userName: JSON.parse(sessionStorage.getItem("currentUser")).username,
          isMore: "N",
          isMobile: "Y",
          reportId: this.$route.params.id,
        };
        ajaxGet(url.getAllPublicUrl, parmap).then((res)=>{
          console.log(JSON.stringify(res.data.data))
          this.src = res.data.data;
        }).catch(error => {
          this.actionSheetVisable=true;
          this.sheet(JSON.parse(error.data).message, 'info');
        });
      }else if(this.$route.params.isPublic == "N" || this.$route.params.isPublic == ""){
        const params = {
          userId: JSON.parse(sessionStorage.getItem('currentUser')).userId,
          userName: JSON.parse(sessionStorage.getItem('currentUser')).username,
          reportId: this.$route.params.id,
        };
        ajaxGet(url.gettableau, params).then((res) => {
          //MXCommon.openUrlPage(res.data.data)
          console.log(JSON.stringify(res.data.data))
          this.src = res.data.data;
        }).catch(error => {
          this.actionSheetVisable=true;
          this.sheet(JSON.parse(error.data).message, 'info');
        });
      }
    },
  },
};
</script>

<style lang="less" scoped>
@import '~vux/src/styles/1px.less';

.firstbox {
   padding: 0.6rem;
}
.flex-demofordatadetail {
    width: 100%;
    height: 20rem;
    background-color: rgba(0, 0, 0, 0.06);
}
.iframe{width:100%;border:none;height:100%;}
</style>
