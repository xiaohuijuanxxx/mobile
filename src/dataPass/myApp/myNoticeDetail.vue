<template>
  <div style="height:100%;" ref="noticeDetail" v-touch:right="tobackpage">
    <Header :backoptions="backoptions" title="公告详情" @tobackpage="tobackpage" />
    <div class='sconendgroup'>
      <div style="margin-top:1rem;">
        <div><img slot="icon" width="27" height="30" src="static/notice.png"></div>
        <span v-text='noticeinfo.noticeName' class="minFontSize"></span>
      </div>
      <div v-text="noticeinfo.issueDate" class="minFontSizeMin"></div>
      <p class="minFontSizemid notice-con">
       {{noticeinfo.noticeContent}}
      </p>
    </div>
  </div>
</template>

<script>
import { mapMutations } from 'vuex';
import minxin from '../../common/commonfunction';
import Header from '@/common/header.vue'
export default {
  mixins: [minxin],
  components: {
  Header
  },
  data(){
      return {
          noticeinfo:{
            issueDate: '',
            noticeName: '',
            noticeContent:''
          },
          backoptions:{
            preventGoBack:true,
            backText: ''
          }
      }
  },
  mounted() {
    this.noticeinfo=JSON.parse(sessionStorage.getItem('noticerow'))
    //this.touchMove(this.$refs.noticeDetail, 'myNotice',this)
  },
  methods: {
    ...mapMutations(['setTransitionName']),
    tobackpage(){
      this.setTransitionName('slide-right')
      this.$router.push('myNotice')
      // this.push('myNotice')
    }
  }
}
</script>
<style lang='less' scoped>
.sconendgroup {
    //height: auto;
    background-color: white;
    padding: 0rem 0.25rem;
    height: clac(100% - 46px);
    overflow: hidden;
    overflow-y:scroll;
    -webkit-overflow-scrolling:touch;
    div:first-child {
      height: auto;
      display: flex;
      margin-left: 0.3rem;
      margin-top: 0.2rem;
      div{margin:0 !important;}
      img{
            height: 0.47rem;
          }
      span {
        //font-size:0.34rem;
          word-wrap: break-word;
          word-break:break-all;
          margin-left: 0.3rem;
      }
    }
    div:nth-child(2) {
      height: auto;
      margin-left: 1.21rem;
      //margin-top: 0.1rem;
      //font-size:0.29rem;
      color: #989898;
    }
    p:last-child {
      height: auto;
      display: -ms-flexbox;
      margin: 0.4rem 4% 0.3rem 4%;
      text-indent:2em;
     //font-size:0.32rem;
    }
}
.vux-header{background-color:white !important;}
.emHeader {
  padding-top: 0.2rem;
}
.notice-con{color:#656565;text-align:justify;line-height:0.45rem; word-wrap: break-word;word-break:break-all;white-space:pre;
  white-space:pre-wrap;}
</style>
