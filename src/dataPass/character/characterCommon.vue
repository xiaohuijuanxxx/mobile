<template>
  <div>
    <group>
      <group-title slot="title" class="myGroupTit midFontSize"
        >申请人</group-title
      >
      <x-input
        title="工号"
        v-model="userInfo.username"
        readonly
        class="label_color"
      ></x-input>
      <x-input
        title="申请人"
        v-model="userInfo.name"
        readonly
        class="label_color"
      ></x-input>
      <x-input
        title="所属机构"
        v-model="userInfo.orgName"
        readonly
        class="label_color"
      ></x-input>
      <x-input
        title="部门"
        v-model="userInfo.deptName"
        readonly
        class="label_color"
      ></x-input>
      <x-input
        title="固定电话"
        v-model="userInfo.telephone"
        readonly
        class="label_color"
      ></x-input>
      <x-input
        title="移动电话"
        v-model="userInfo.mobile"
        readonly
        class="label_color"
      ></x-input>
      <x-textarea
        title="OA邮箱"
        v-model="userInfo.email"
        readonly
        :rows="2"
        class="label_color"
      ></x-textarea>
    </group>
    <group>
      <group-title slot="title" class="myGroupTit midFontSize"
        >需求详情</group-title
      >
      <x-textarea
        title="需求名称"
        :style='fourBan'
        :rows='judgeLength(dataForm.portalQaName, "portalQaName") == "a" ? dataForm.portalQaName/13 : fourBanRows'
        v-model="dataForm.portalQaName"
        readonly
        class="label_color"
      ></x-textarea>
      <x-textarea
        title="需求背景"
        v-model="dataForm.portalQaBack"
        :style='fourBan'
        :rows='judgeLength(dataForm.portalQaBack, "portalQaBack") == "a" ? dataForm.portalQaBack/13 : fourBanRows'
        readonly
        :class="[dataForm.portalQaBack.length > 13 ? 'duiqi-between' : '','label_color','special-hei'] "
      ></x-textarea>
      <x-textarea
        title="实施方案"
        v-model="dataForm.portalQaAttachment"
        :style='fourBan'
        :rows='judgeLength(dataForm.portalQaAttachment, "portalQaAttachment") == "a" ? dataForm.portalQaAttachment/13 : fourBanRows'
        readonly
       :class="[dataForm.portalQaAttachment.length > 13 ? 'duiqi-between' : '','label_color','special-hei'] "
      ></x-textarea>
      <x-textarea
        v-if="font == 0.44"
        title="特色需求具体内容"
        v-model="dataForm.portalQaContent"
        :style='fourBan'
        :rows='judgeLength(dataForm.portalQaContent, "portalQaContent") == "a" ? dataForm.portalQaContent/13 : fourBanRows'
        readonly
       :class="[dataForm.portalQaContent.length > 13 ? 'duiqi-between' : '','label_color','special-hei','special-width'] "
      ></x-textarea>
      <x-textarea
        v-else-if="font == 0.40"
        title="特色需求具体内容"
        v-model="dataForm.portalQaContent"
        :style='fourBan'
        :rows='judgeLength(dataForm.portalQaContent, "portalQaContent") == "a" ? dataForm.portalQaContent/13 : fourBanRows'
        readonly
       :class="[dataForm.portalQaContent.length > 13 ? 'duiqi-between' : '','label_color','special-hei','special-width-big'] "
      ></x-textarea>
      <x-textarea
        v-else-if="font == 0.36"
        title="特色需求具体内容"
        v-model="dataForm.portalQaContent"
        :style='fourBan'
        :rows='judgeLength(dataForm.portalQaContent, "portalQaContent") == "a" ? dataForm.portalQaContent/13 : fourBanRows'
        readonly
       :class="[dataForm.portalQaContent.length > 13 ? 'duiqi-between' : '','label_color','special-hei','special-width-mid'] "
      ></x-textarea>
      <x-textarea
        v-else-if="font == 0.32"
        title="特色需求具体内容"
        v-model="dataForm.portalQaContent"
        :style='fourBan'
        :rows='judgeLength(dataForm.portalQaContent, "portalQaContent") == "a" ? dataForm.portalQaContent/13 : fourBanRows'
        readonly
       :class="[dataForm.portalQaContent.length > 13 ? 'duiqi-between' : '','label_color','special-hei','special-width-min'] "
      ></x-textarea>
      <div class="my-cell" v-show="dataForm.fileList != ''">
        <p class="minFontSize fj">附件</p>
        <p style="color:blue;" v-for="(item, index) in dataForm.fileList" :key="index" @click="downloadfile(item)">
          {{ item.fileName }}
        </p>
      </div>
    </group>
    <group v-show="isShowUpUser">
      <group-title slot="title" class="myGroupTit midFontSize"
        >上级答复信息</group-title
      >
      <x-textarea
        title="答复信息"
        v-model="upForm.upAnswerContext"
        readonly
        class="label_color"
      ></x-textarea>
      <div class="my-cell" v-show="upForm.upAnswerFiles != ''">
        <p class="minFontSize fj">附件</p>
        <p style="color:blue;" v-for="(item, index) in upForm.upAnswerFiles" :key="index+1" @click="downloadfile(item)">
          {{ item.fileName }}
        </p>
      </div>
    </group>
    <group>
      <group-title slot="title" class="myGroupTit midFontSize">审批
        <span style="font-size:0.3rem;padding-left:0.5rem;color:gray">审批意见请点击查看<img style="width: 4.5%;vertical-align: sub;" src="static/mydown.png" /></span>
      </group-title>
    </group>
    <flow orientation="vertical" class="flowtitlecss" :style='flowm' v-show="isDeptDeal">
      <template v-for="(i, index) in flowData"> 
        <flow-state 
         :state="index + 1" 
         :class="{refuse : flowData[index].status == '已拒绝' || flowData[index].status == '已退回'? true : false}"
         :title="gsh(i.node, i.name, i.username, i.deptName)" 
         :is-done="i.isDone" 
         :key='index' 
         @click.native="lookAll(resultList[index].result)">
        </flow-state>
        <flow-line v-if="index != (flowData.length - 1)" :is-done="i.lineDone" :key='index'></flow-line>
      </template>
    </flow>
    <!-- 2退回  3完结 -->
    <group v-if="this.flowData[0] && (this.flowData[0].approveState == 2 || this.flowData[0].approveState == 3)">
      <x-textarea
        title="审批意见"
        readonly
        class="label_color"
        :rows='2'
        v-model="lastback"
      ></x-textarea>
    </group>
  </div>
</template>
<script>
import minxin from "@/common/commonfunction.js";
import { ajaxGet, ajaxPost } from "../../core/mxApi";

const URL = require("../asssets/Api/api");
import Bus from "@/bus/bus";
export default {
  props: {
     upId: {
            type: String,
            default: ''
        },
        isShowUpUser: {
            type: Boolean,
            default: false
        },
        isDeptDeal:  {
            type: Boolean,
            default: true
        },
        isApplyUser:  { // 是否为申请人查看
            type: Boolean,
            default: false
        },
  },
  mixins: [minxin],
  data() {
    return {
      lastback:'',
      resultList:[],
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      // 申请人个人信息
      userInfo: {
        name: "",
        username: "",
        orgName: "",
        deptName: "",
        telephone: "",
        mobile: '',
        email: "",
      },
      // 申请人申请时填写的信息
      dataForm: {
        portalQaName: "",
        portalQaBack: "",
        portalQaContent: "",
        portalQaAttachment: "",
        fileList: [],
        portalQaFeedback: "",
        portalQaFeedbackFile: [],
      },
      // 上一层级信息
      upForm: {
        upAnswerContext: "",
        upAnswerFiles: [],
      },
      flowData: [], // 审批栏数据
      flowm: null,
      fourBan: null,
      fourBanRows: 1,
      font: null,
    };
  },
  created() {
  },
  mounted() {
    let font = document.body.style.getPropertyValue('--minSize').trim();
    if (font === '') {
      font = '0.36rem'
    }
    font = font.slice(0, font.indexOf('r'))
    this.font = Number(font)
    this.fourBanRows = (Number(font)) * 5.5 * 3
    this.fourBan = `max-height:${(Number(font)) * 5.5}rem;overflow:hidden;`;
    if (this.$route.query.hasOwnProperty('todoType')) {
       this.tsData()
    } else {
      this.getApplyMsg();
      this.getTableData()
      this.getUpDealMsg()
    }
  },
  methods: {
    gsh(node, name, username, deptName){
      if(node == 1){
        return '申请部门负责人 ' + name + '/' + username
      }else{
        return deptName
      }
    },
    // 敏行查看附件
    downloadfile(item) {
      const params = { fileId: item.fileId };
      ajaxGet(URL.url.getFileUrl, params)
        .then((res) => {
          if (
            res.data.data != "" &&
            res.data.data != null &&
            res.data.data != "null"
          ) {
            let ul = URL.url.downApplyFile + res.data.data.fileUrl;
            this.getWpsFile(ul, item.fileId);
           // MXCommon.download(ul);
          } else {
            this.actionSheetVisable = true;
            this.sheet("该文件不存在");
          }
        })
        .catch((error) => {
          let omsg = this.outmsg(error);
          this.closeloading();
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
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
            MXCommon.openUrlPage(res.data.data);
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
    // 推送时加载的数据
    tsData() {
      Bus.$on('startShow', () => {
        this.getApplyMsg();
        this.getTableData()
        this.getUpDealMsg()
      })
    },
    // 上级处理的信息
    getUpDealMsg() {
      if (
        this.upId != "" &&
        this.upId != null &&
        this.upId != "null"
      ) {
        const params = { id: this.upId };
        ajaxGet(URL.url.getCharacterNeedTransactorDealMsg, params)
          .then((res) => {
            if (
              res.data.data != "" &&
              res.data.data != "null" &&
              res.data.data != null
            ) {
              this.upForm.upAnswerContext = res.data.data.portalQaDealContext;
              this.upForm.upAnswerFiles = [];
              if (
                res.data.data.portalQaDealFiles != null &&
                res.data.data.portalQaDealFiles != ""
              ) {
                let arr = JSON.parse(res.data.data.portalQaDealFiles);
                this.upForm.upAnswerFiles = arr
                // for (let i = 0; i < arr.length; i++) {
                //   this.upForm.upAnswerFiles.push(arr[i].fileName);
                // }
              } else {
                res.data.data.portalQaDealFiles = [];
              }
            }
          })
          .catch((error) => {
            let omsg = this.outmsg(err);
            this.closeloading();
            if (!omsg) {
              return;
            }
            this.actionSheetVisable = true;
            this.sheet(omsg);
          });
      }
    },
    // 获取用户申请时填写的信息
    getApplyMsg() {
      const params = { portalQaId: this.$route.query.portalQaId };
      ajaxGet(URL.url.getCharacterNeedApplyMsg, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            this.getApplyInfo(res.data.data.createrUser);
            let {
              data: { data, code },
            } = res;
            this.dataForm = data;
            // 申请时上传的附件
            if (
              data.portalQaFile != null &&
              data.portalQaFile != ""
            ) {
              const files = JSON.parse(data.portalQaFile);
              // let arr = [];
              // for (let i = 0; i < files.length; i++) {
              //   arr.push(files[i].fileName);
              // }
              this.dataForm.fileList = files;
            }
            // 反馈时上传的附件
            if (
              data.portalQaFeedbackFile != null &&
              data.portalQaFeedbackFile != ""
            ) {
              const files = JSON.parse(data.portalQaFeedbackFile);
              this.dataForm.portalQaFeedbackFile = files;
            }
            for(let item in this.dataForm){
              if (this.dataForm[item].length > 52) {
                if (this.font == 0.44) {
                  this.dataForm[item] = `${this.dataForm[item]}\n\n\n`
                } else if (this.font == 0.40) {
                  this.dataForm[item] = `${this.dataForm[item]}\n\n`
                } else {
                  this.dataForm[item] = `${this.dataForm[item]}\n`
                }
              }
            }
          }
        })
        .catch((error) => {
          let omsg = this.outmsg(error);
          if (!omsg) {
            return;
          }
          this.closeloading();
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
    // 获取申请人 个人信息
    getApplyInfo(userName) {
      const params = { userName: userName };
      ajaxGet(URL.url.getCharacterIssueApplyInfo, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            this.userInfo = data;
          }
        })
        .catch((error) => {
          let omsg = this.outmsg(error);
          if (!omsg) {
            return;
          }
          this.closeloading();
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
    // 获取审批人兰信息
    getTableData() {
      const params = { portalQaId: this.$route.query.portalQaId };
      ajaxGet(URL.url.getCharacterNeedDealSpeed, params)
        .then((res) => {
          this.resultList = res.data.data
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            this.flowData = data;
            if (data.length > 1) {
              this.flowm = `height:${(Number(data.length) - 1) * 0.75}rem;`;
            }
            this.flowData.length && this.flowData[0].approveState == 2 ? this.lastback = '驳回   ' : this.lastback = '同意   ';
            console.log(111,this.flowData);
            this.flowData.forEach(item => {
              if (item.status === '待处理' || item.status === '处理中') {
                item.isDone = false
                item.lineDone = false
              } else {
                item.isDone = true
                item.lineDone = true
              }
            })
          }
        })
        .catch((error) => {
          let omsg = this.outmsg(error);
          if (!omsg) {
            return;
          }
          this.closeloading();
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
    // 点击查看全部审批意见
    lookAll(i){
      if(!i){
        // alert('暂未审批')
      }else {
        this.$vux.alert.show({
          title:'审批意见',
          content: `${i}`
        })
      }
      // alert(JSON.stringify(this.flowData))
      // for(var i=0;i<this.flowData.length;i++){
      //   if(this.flowData[i].result == ''){
      //     alert(`我是${this.flowData[i].deptName}目前暂未审批完成`)
      //   }else {
      //     alert(`我是${this.flowData[i].name}${this.flowData[i].deptName}表示${this.flowData[i].result}`)
      //   }
      // }
    }
  },
};
</script>
<style scoped lang="less">
.label_color {
  /deep/ .weui-label {
    color: #999999;
  }
  /deep/ .weui-input {
    color: black;
    text-align: right;
  }
  /deep/ .weui-textarea {
    color: black;
    text-align: right;
  }
}
.duiqi-between{
  /deep/ .weui-textarea {
    text-align: justify;
    white-space:normal;
    word-break:break-all;
    white-space:pre;
    white-space:pre-wrap;
  }
  }
  .special-hei{
    /deep/ .weui-textarea {
      height: auto !important;
    }
  }
  .special-width{
    /deep/ .weui-label {
    width:1.8rem !important;
    margin-right:0.4rem;
  }
  }
  .special-width-mid{
    /deep/ .weui-label {
    width:1.5rem !important;
    margin-right:0.3rem;
  }
  }
  .special-width-big{
    /deep/ .weui-label {
    width:1.8rem !important;
    margin-right:0.18rem;
  }
  }
  .special-width-min{
    /deep/ .weui-label {
    width:1.5rem !important;
    margin-right:0.1rem;
  }
  }
.myLabel-long{
   /deep/ .weui-label {width:1.6rem !important;}
}
// 附件样式
.my-cell {
  margin-left: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 0.5px solid #d9d9d9;
  .fj {
    color: #999999;
  }
}
// 流程图解样式
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
/deep/.refuse .weui-wepay-flow__state{ 
  background: rgb(238, 68, 68) !important;
}
</style>