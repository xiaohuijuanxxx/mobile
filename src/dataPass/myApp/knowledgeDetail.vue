<template>
  <div style="height:100%;" v-touch:right="back">
    <Header :backoptions="backoptions" @tobackpage="back" title="文档详情" />
    <div style="padding: 0 4%;height: clac(100% - 46px);" class="know-content">
      <div class="title">
        <div>
          <img src="../asssets/images/numberDyna.png" class="title-icon isNum" v-if="$route.query.isNum === 'yes'" />
          <img src="../asssets/images/knowIcon.png" class="title-icon" v-else />
      </div>
        <div class="title-con">
          <h4 class="minFontSize">{{file.fileTitle}}</h4>
          <span class="minFontSizeMin">{{file.publishTime}}</span>
        </div>
      </div>
      <!-- <template v-if="file.fileText != null && file.fileText != 'null'">
        <p v-html="file.fileText"></p>
      </template>  v-else-->
      <p class="minFontSizemid know-con" :style="{minHeight: minHei+ 'px'}">
        {{file.fileIntroduction}}
      </p>
    </div>
    <ul v-show="fileList">
      <li v-for="(item, index) in fileList" :key="index" class="file-list" @click="openFile(item)">
        <div><img :src="item.filePath" /></div>
        <div class="file-con">
          <h5 class="minFontSizeMin textOvern">{{ item.fileName }}</h5>
        </div>
        <div><img src="static/more.png" class="more" /></div>
      </li>
    </ul>
  </div>
</template>
<script>
import Header from "@/common/header.vue";
import minxin from "@/common/commonfunction.js";
import { ajaxGet, ajaxPost } from "../../core/mxApi";
import {judgeFileType} from '@/common/commonfunction.js'
const URL = require('../asssets/Api/api');
export default {
  components: {
    Header,
  },
  mixins: [minxin],
  data() {
    return {
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      file:{
        fileTitle: '',
        publishTime:'',
        fileIntroduction:''
      },
      fileList: [],
      minHei: 0,
      // 根据文件类型判断显示图片
      fileType() {
        return "require(static/pdfImg.png)";
      },
    };
  },
  // mixins:[minxin],
  created() {
    this.getData()
  },
  mounted() {
    this.minHei = window.screen.height - 300
  },
  methods: {
    openFile(item) {
       let ul = URL.url.downApplyFile + item.fileUrl;
      // MXCommon.download(ul)
      this.getWpsFile(ul, item.id);
      //  MXCommon.openFile({
      //    url: ul,
      //    onSuccess: function() { },
      //    onFail: function(err) {
           
      //    }
      // })
    },
    // 返回ann
    back() {
      if (this.$route.query.isNum === 'yes') {
        if (this.$route.query.isHome === 'yes') {
          this.push('home')
        } else {
          this.push({ name: "numberDynamics"})
        }
      } else {
         this.push({ name: "knowledge"})
      }
    },
   //查看附件
    getWpsFile(ul, fileId) {
      let user = JSON.parse(sessionStorage.getItem("currentUser"));
      const params = {
        userName: user.username,
        name: encodeURIComponent(user.name),
        fileId: fileId,
        httpFileUrl: ul
      }
       ajaxGet(URL.url.getWpsUrl, params)
        .then((res) => {
          if (
            res.data.data != "" &&
            res.data.data != null &&
            res.data.data != "null"
          ) {
            //window.open(res.data.data, '_blank')
            //MXCommon.download(res.data.data);
            MXCommon.openUrlPage(res.data.data)
          }
      }).catch(error => {
        let omsg = this.outmsg(error);
          this.closeloading();
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
      })
    },
    getDatas(){
      var isSHOW = this.$route.params.isNew
      if(isSHOW =='false' || isSHOW == false) {
        const parmas = {
          'userName': JSON.parse(sessionStorage.getItem('currentUser')).username,
          'kbfileId': this.$route.params.kbfileId
        };
        let a = JSON.stringify(parmas)
        ajaxPost(URL.url.getRaed,a)
        .then((res)=>{
          this.toNumberDyna()
        })
        .catch((error)=>{

        })
      }
    },
    //数聚动态详情页
    toNumberDyna(item) {
      this.push({
        name: "knowledgeDetail",
        params: { kbfileId: item.kbfileId,isNew:item.isNew },
        query: { isNum: "yes", isHome: "yes" },
      });
    },

    // 详情页数据
    getData() {
      this.getDatas()
      const params = {KbfileId: this.$route.params.kbfileId}
      ajaxGet(URL.url.getKnowDetail, params).then((res) => {
          if (res.data.data != null && res.data.data != "null" && res.data.data != "") {
            this.file = res.data.data;
            if (res.data.data.uploadId != null && res.data.data.uploadId != '') {
              let arr = []
              arr = JSON.parse(res.data.data.uploadId)
              const len = arr.length
              let filePath = ''
              for (let i = 0; i < len; i++) {
                filePath = judgeFileType(arr[i].fileName)
                this.fileList.push({'fileName': arr[i].fileName, 'id': arr[i].fileId,'filePath': filePath,'fileUrl': arr[i].fileUrl})
              }
            }
          }
        }).catch((error) => {
        });
    },
  },
};
</script>
<style scoped lang="less">
.know-content{
  height: 100%;
  overflow: hidden;
  overflow-y:scroll;
  -webkit-overflow-scrolling:touch;
}
.title {
  display: flex;
  margin-top: 50px;
  align-items: start;
  .title-icon {
    width: 0.36rem;
    display: block;
    margin-top: 3px;
  }
  .isNum{
    width: 0.21rem !important;
    margin-top: 5px;
  }
  .title-con {
    display: flex;
    flex-direction: column;
    padding-left: 12px;
    span {
      color: #989898;
    }
  }
}
.know-con {
  width:100%;
  //padding-top:10px;
  padding-bottom:25px;
  text-indent: 2em;
  text-align: justify;
  white-space:pre;
  white-space:pre-wrap;
  color:#656565;
}
ul {
  background: #ffffff;
  // position: fixed;
  // bottom: 0;
  width: 100%;
  padding-bottom: 43px;
}
.file-list {
  display: flex;
  align-items: center;
  //justify-content: space-between;
  padding: 9px 0.4rem 9px 0.3rem;
  border: 0.5px solid #eceaea;
  img {
    width: 0.86rem;
    display: block;
  }
  .file-con {
    display: flex;
    flex-direction: column;
    width:85%;
    padding-left: 11px;
    span {
      color: #9B9B9B;
      font-size: 0.22rem;
    }
  }
  .more {
    width: 0.13rem;
    display: block;
  }
  .textOvern {
    overflow: hidden;
    width: 95%;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block !important;
  }
}
</style>