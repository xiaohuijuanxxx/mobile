<template>
  <div style="height:100%;" v-touch:right="back">
    <div>
      <Header :backoptions="backoptions" @tobackpage="back" title="Q&A详情" />
      <group style="margin-top:40px">
        <group-title slot="title" class="myGroupTit midFontSize">调研信息</group-title>
          <x-textarea class="label_color" title="调研问题"  v-model="file.qaShareTitile" readonly :rows="file.qaShareTitile != null ? file.qaShareTitile.length/11 : 1"></x-textarea>
          <x-textarea class="label_color" title="表  名" v-model="file.tableName" readonly :rows="file.tableName != null ? file.tableName.length/11 : 1"></x-textarea>
          <x-textarea class="label_color" title="调研内容"  v-model="file.qaShareContext" readonly :rows="file.qaShareContext != null ? file.qaShareContext.length/11 : 1"></x-textarea>
          <div class="my-cell" v-show="fileList != ''">
              <flexbox>
                  <flexbox-item>
                      <p class="minFontSize fj">附件</p>
                  </flexbox-item>
                  <flexbox-item style="margin-left:-3.5rem;margin-top: -0.25rem;">
                      <ul>
                          <li v-for="(item, index) in fileList" :key="index" class="file-list">
                              <div><img :src="item.filePath" /></div>
                              <div class="file-con">
                                  <h5 class="minFontSizeMin textOvern">{{ item.fileName }}</h5>
                              </div>
                              <div><img src="static/more.png" class="more" /></div>
                          </li>
                      </ul>
                  </flexbox-item>
              </flexbox>
          </div>
      </group>
      <group>
          <group-title slot="title" class="myGroupTit midFontSize">反馈信息</group-title>
          <x-textarea class="label_color" title="问题反馈"  v-model="file.qaShareFeedback" readonly :rows="file.qaShareFeedback != null ? file.qaShareFeedback.length/11 : 1"></x-textarea>
          <div class="my-cell" v-show="fileListBack != ''">
              <flexbox>
                  <flexbox-item>
                      <p class="minFontSize fj">附件</p>
                  </flexbox-item>
                  <flexbox-item style="margin-left:-3.5rem;margin-top: -0.25rem;">
                      <ul>
                          <li v-for="(item, index) in fileListBack" :key="index" class="file-list">
                              <div><img :src="item.filePath" /></div>
                              <div class="file-con">
                                  <h5 class="minFontSizeMin textOvern">{{ item.fileName }}</h5>
                              </div>
                              <div><img src="static/more.png" class="more" /></div>
                          </li>
                      </ul>
                  </flexbox-item>
              </flexbox>
          </div>
      </group>
    </div>
  </div>
</template>
<script>
import Header from "@/common/header.vue";
import { mapMutations } from 'vuex';
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
      autosize: true,
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
     
      file:{
        qaShareTitile:'',
        qaShareId:'',
        tableName: '',
        qaShareContext:'',
        qaShareFeedback:''
      },
      
      fileList: [],
      fileListBack: [],
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
  mounted() {},
  methods: {
    ...mapMutations(['setTransitionName']),
    // 返回ann
    back() {
      this.setTransitionName('slide-right')
      setTimeout(()=>{
        this.push({ name: "knowledge"})
      })
    },
    getDatas() {
      let isSHOW = this.$route.params.isNew
      if(isSHOW == 'false' || isSHOW == false) {
        const parmas = {
          'userName': JSON.parse(sessionStorage.getItem('currentUser')).username,
          'qaShareId': this.$route.params.qaShareId
        };
        let a = JSON.stringify(parmas)
        ajaxPost(URL.url.qaNewChange, a)
        .then((res) => {
          // alert(111)
        })
        .catch((error) => {
          // alert(JSON.stringify(error))
        });
      }
      },
    // 详情页数据
    getData() {
      this.getDatas()
      // alert(this.$route.params.qaShareId)
      const params = {qaShareId: this.$route.params.qaShareId}
      ajaxGet(URL.url.getQaDetail, params).then((res) => {
          if (res.data.data != null && res.data.data != "null" && res.data.data != "") {
            this.file = res.data.data;
            if(this.file.tableName!=null && this.file.tableName!=''&&this.file.tableName!='null'){
              const arr = JSON.parse(this.file.tableName);
              this.file.tableName = arr.join(',')
            }
            if(res.data.data.qaShareFiles!=null&&res.data.data.qaShareFiles!=''){
              let arr = [];
              arr = JSON.parse(res.data.data.qaShareFiles);
              const len = arr.length;
              let filePath = '';
              for(let i=0;i<len;i++){
                filePath = judgeFileType(arr[i].fileName);
                this.fileList.push({'fileName':arr[i].fileName,'id':arr[i].fileId,'filePath':filePath})
              }
            }
            if(res.data.data.qaShareFeedbackFiles!=null&&res.data.data.qaShareFeedbackFiles!=''){
              let arr = [];
              arr = JSON.parse(res.data.data.qaShareFeedbackFiles);
              const len = arr.length;
              let filePath = '';
              for(let i=0;i<len;i++){
                filePath = judgeFileType(arr[i].fileName);
                this.fileList.push({'fileName':arr[i].fileName,'id':arr[i].fileId,'filePath':filePath})
              }
            }
            // if (res.data.data.uploadId != null && res.data.data.uploadId != '') {
            //   let arr = []
            //   arr = JSON.parse(res.data.data.uploadId)
            //   const len = arr.length
            //   let filePath = ''
            //   for (let i = 0; i < len; i++) {
            //     filePath = judgeFileType(arr[i].fileName)
            //     this.fileList.push({'fileName': arr[i].fileName, 'id': arr[i].fileId,'filePath': filePath,'fileUrl': arr[i].fileUrl})
            //   }
            // }
          }
        }).catch((error) => {
          // alert(JSON.parse(error))
        });
    },
    ///////////////////////////////////////////////////////
    // getData() {
    //   this.getDatas()
    //   const params = {qaShareId: this.$route.params.qaShareId}
    //   ajaxGet(URL.url.getQaDetail, params).then((res) => {
    //       if (res.data.data != null && res.data.data != "null" && res.data.data != "") {
    //         this.file = res.data.data;
    //         if (this.file.tableName != null && this.file.tableName != '' && this.file.tableName != 'null') {
    //           const arr = JSON.parse(this.file.tableName)
    //           this.file.tableName = arr.join(',')
    //         }
    //         if (res.data.data.qaShareFiles != null && res.data.data.qaShareFiles != '') {
    //           let arr = []
    //           arr = JSON.parse(res.data.data.qaShareFiles)
    //           const len = arr.length
    //           let filePath = ''
    //           for (let i = 0; i < len; i++) {
    //             filePath = judgeFileType(arr[i].fileName)
    //             this.fileList.push({'fileName': arr[i].fileName, 'id': arr[i].fileId, 'filePath': filePath})
    //           }
    //         }
    //       }
    //     }).catch((error) => {
          
    //     });
    // },
  },
};
</script>
<style scoped lang="less">
.label_color{
        /deep/ .weui-label{color: #999999;text-align: justify;width:1.7rem !important;margin-right:0.35rem;display: inline-block;text-align-last: justify;
        &::after{
          display:inline-block;content:'';overflow:hidden;width:100%;height: 0;}
        }
        /deep/ textarea{text-align:justify;}
    }
    .my-cell{margin-left:16px;padding-top:10px;border-top: .5px solid #d9d9d9;
      .fj{color: #999999;text-align: justify;width:1.68rem !important;display: inline-block;text-align-last: justify;
        &::after{
          display:inline-block;content:'';overflow:hidden;width:100%;height: 0;}
        }
    }
ul {
  width: 100%;
  display: inline-block;
  //padding-bottom: 43px;
}
.file-list {
  display: flex;
  align-items: center;
  //justify-content: space-between;
  padding: 9px 0.2rem 9px 0.2rem;
  border-bottom: 0.5px solid #eceaea;
  img {
    width: 0.56rem;
    display: block;
  }
  .file-con {
    display: flex;
    flex-direction: column;
    width:75%;
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
    line-height:0.6rem;
    overflow: hidden;
    width: 95%;
    text-overflow: ellipsis;
    white-space: nowrap;
    display: inline-block !important;
  }
}
.every-tit{padding:12px 0;}
</style>