<template>
<div ref="notice" v-touch:right="tobackpage">
    <div style="margin-bottom:50px;">
    <x-header :left-options="backoptions" @on-click-back="tobackpage" class=" headerFixed bigFontSize">公告</x-header>
    </div>
    <!-- <Header :backoptions="backoptions" @tobackpage="tobackpage" title="数聚动态" /> -->
  <div class='sconendflex'>
    <div class='firstgroup' v-for="item in noticeList" :key='item.noticeId'>
      <div>
        <img slot="icon" width="27" src="static/notice.png" class="notice">
        <div v-text='item.noticeName' style="color:black;" class="minFontSize textOvern"></div>
      </div>
      <p style="color:#656565; word-wrap: break-word;word-break:break-all;" class="minFontSizemid lineHei overNotice">{{item.noticeContent}}</p>
      <div style="border-top:.5px solid #eceaea;height:1px;"></div>
      <div>
        <span v-text="item.issueDate" class="minFontSizeMin"></span>
        <span @click="gotonoticedetail(item)" style='position:relative;display:flex;padding-right:0.3rem;'>
         <label class="minFontSizeMin" style="width:100%;">查看详情</label>
          <img src="static/more.png" style="position:absolute;right:4px;top:7px;width:0.12rem;">
        </span>
      </div>
    </div>
     <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
  </div>
</div>
</template>

<script>
let URL=require('../asssets/Api/api')
import Header from "@/common/header.vue";
import { ajaxGet,ajaxPost } from '../../core/mxApi'
import minxin from '@/common/commonfunction.js'
export default {
  components: {
    Header
  },
  mixins:[minxin],
  data() {
    return {
        backoptions: {
            preventGoBack: true,
            backText: '',
          },
        datalength:false,
        noticeList:[],
        noticeDate: '',
        noticeName: ''
    }
  },
  mounted() {
    this.gettable()
    // this.touchMove(this.$refs.notice, 'home',this)
  },
  methods:{
    gotonoticedetail(row){
      let seData=JSON.stringify(row)
      sessionStorage.setItem('noticerow',seData)
      this.$router.push('myNoticeDetail')
      // this.push('myNoticeDetail')
    },
    gettable(){
      let _this=this
      _this.showloading()
      let parmas={
        invalidDate: 'Y',
        page:1,
        per_page:9999
      }
      ajaxGet(URL.url.getNoticList,parmas).then(res=> {
          let {data:{data,code}}=res
          if(code=='0000'){
            if(data.length==1000){
              _this.datalength=true
            }
            _this.noticeList=data
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
    tobackpage() {
      this.push('home')
          this.$store.commit({
            type: 'changepage',
            pageindex: 2,
          });
    }
  }
}
</script>
<style lang='less' scoped>
  .sconendflex {
    box-sizing: border-box;
    padding: 22px 0.25rem 1.1rem 0.25rem;
    background-color:#fafafa;
    height: 100%;
    .firstgroup {
        height: auto;
        border-radius: 0.3rem;
        background-color: #FFFFFF;
        margin-bottom: 0.43rem;
        padding: 0.3rem 0.1rem;
        div:first-child {
          height: 0.5rem;
          display: flex;
          //font-weight: bold;
          margin-left: 0.3rem;
          margin-top: 0.1rem;
          align-items:center;
          img{
            height: 0.47rem;
          }
          div {
            margin-left:0.35rem;
            line-height:0.47rem;;
            height:0.6rem;
            color: #323232;
           // font-size:0.34rem;
         }
        }
        p:nth-child(2) {
          height: auto;
          display: -ms-flexbox;
          margin: 0.2rem 0.2rem 0.5rem 1.2rem;
         // font-size:0.32rem;
        }
        div:last-child {
          height: auto;
          display: flex;
          margin-left: 0.3rem;
          margin-top: 0.2rem;
          :first-child{
            width: 60%;
            color:#989898;
            //font-size:0.29rem;
          }
          :last-child {
            width: 40%;
            text-align: right;
            color:#656565;
           // font-size:0.29rem;
          }
        }
    }
  }
  .overNotice{
  overflow : hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp:4;
  -webkit-box-orient: vertical;
  //text-align: justify;
  }
  .textOvern {overflow: hidden;width:82%;text-overflow: ellipsis;white-space: nowrap;display: inline-block !important;}
</style>
