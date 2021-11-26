<template>
  <div style="background-color:#f3f3f3;height:100%;" v-touch:right="tobackpage">
    <Header :backoptions="backoptions" @tobackpage="tobackpage" title="详情列表" />
    <!-- <x-header :left-options="backoptions" @on-click-back="tobackpage" class="cjHeader">详情列表</x-header> -->
    <div class="sconendflexmm" v-if='doneList.length'>
      <div class='sconendgrouptwo' v-for="item in doneList" :key='item.applyId' @click="clickdiv">
          <div class="requirecss"><b>{{item.requireName}}</b></div>
          <div class="needcss"><div>需求描述:</div><span>{{item.requireMemo}}</span></div>
          <div class="needcss"><div>需求用途描述:</div><span>{{item.requireUseDesc}}</span></div>
          <hr>
          <div style="display:flex;font-size:0.4rem;">
            <span v-text="item.createTime"></span>
          </div>
      </div>
    </div>
    <div v-else>
        <div ref='noassisantd' style='text-align:center;font-size:0.4rem;'>暂无数据</div>
    </div>
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
  </div>
</template>

<script>
let URL=require('../asssets/Api/api')
import minxin from '@/common/commonfunction.js'
import Header from "@/common/header.vue";
import { ajaxGet,ajaxPost } from '../../core/mxApi'
export default {
  components: {
    Header
  },
  mixins:[minxin],
  data() {
    return {
        backoptions:{
            preventGoBack:true,
            backText: ''
        },
        doneList:[]
    }
  },
  mounted() {
    let _this=this
    let usernames=JSON.parse(sessionStorage.getItem('currentUser'))
    if(_this.doneList==0){
        let w=screen.width-21,h=screen.height-132
        this.$refs.noassisantd.style.height = h+'px'
        this.$refs.noassisantd.style.width= w+'px'
        this.$refs.noassisantd.style.lineHeight = h+'px'
      }
    let totype=sessionStorage.getItem('todoType')
    let approvewitchStatus,urlchoose
    switch (totype) {
        case '104':
            approvewitchStatus=3;
            urlchoose=URL.url.getApproveList;
            break;
        case '105':
            approvewitchStatus=2;
            urlchoose=URL.url.getApproveList;
            break;
        case '400':
            approvewitchStatus=9;
            urlchoose=URL.url.getneedList;
            break;
        case '401':
            approvewitchStatus=3;
            urlchoose=URL.url.getneedList;
            break;
        case '405':
            approvewitchStatus=2;
            urlchoose=URL.url.getneedList;
            break;
        default:
            break;
    }
    let parmas1={
      username: usernames.username, //usernames.username
      userId: usernames.userId,
      page: 1,
      per_page: 9999,
      approveStatus:approvewitchStatus
    },
    parmas2={
      username: usernames.username, //usernames.username
      userId: usernames.userId,
      page: 1,
      per_page: 9999,
      status:approvewitchStatus
    }
    _this.showloading()
    ajaxGet(urlchoose,(totype=='104'||totype=='105')?parmas1:parmas2).then(res=> {
          let {data:{data,code}}=res
          if(code=='0000'){
            data.forEach(item=>{
              item.createTime=item.createTime?item.createTime.replace("T"," "):''
            })
            _this.doneList=data
            _this.closeloading()
          }
        }).catch(err => {
          let omsg=_this.outmsg(err)
            _this.closeloading()
            if(!omsg){
              return
            }
          _this.actionSheetVisable=true
          _this.sheet(omsg)
        })
  },
  beforeRouteLeave(to,from,next){
    if(to.path=='/home'){
      this.$store.commit({
        type:"changepage",
        pageindex:2
      });
      this.$store.commit({
        type:"changetabContent",
        tabContent:1
      });
      next()
     }else{
      return
    }
  },
  methods:{
    clickdiv() {
      this.actionSheetVisable=true
      this.sheet('详细信息请移动至数聚通PC端查看')
      // this.$vux.alert.show({
      //   title:'提示',
      //   content: '详细信息请移动至数聚通PC端查看'
      // })
    },
    tobackpage(){
      this.push('home')
    }
  }
}
</script>
<style lang='less' scoped>
  .sconendflexmm {
    padding: 0.3rem;
    .sconendgrouptwo {
        height: auto;
        padding: 0.2rem;
        border: 0.05rem solid #d6cccc;
        margin-bottom: 0.3rem;
        background-color: #FFFFFF;
        border-radius: 0.2rem;
        .requirecss {
          height: 0.8rem;
          display: flex;
          margin-top: 0.2rem;
          font-size: 0.4rem;
          margin-bottom: 0.2rem;
          padding: 0rem 0.2rem;
          overflow-x: scroll;
        }
        .needcss {
          display: flex;
          font-size: 0.4rem;
          margin-bottom: 0.3rem;
          div {
            width: 2.8rem;
            text-align: right;
            color: darkslateblue;
            font-size: 0.4rem;
          }
        }
    }
  }
</style>