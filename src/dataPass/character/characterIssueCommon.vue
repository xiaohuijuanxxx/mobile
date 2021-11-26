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
        >申请详情</group-title
      >
      <x-textarea
        title="数据用途"
        v-model="dataForm.dwpDataUse"
        readonly
         :style='fourBan'
        :rows='judgeLength(dataForm.dwpDataUse) ? dataForm.dwpDataUse.length/13 : fourBanRows'
        :class="[dataForm.dwpDataUse.length > 13 ? 'duiqi-between' : '','label_color','special-hei'] "
      ></x-textarea>
      <x-textarea
        title="期望完成期限"
        v-model="dataForm.dwpDataExpect"
         :style='fourBan'
        :rows='judgeLength(dataForm.dwpDataExpect) ? dataForm.dwpDataExpect.length/13 : fourBanRows'
        readonly
        :class="[dataForm.dwpDataExpect.length > 13 ? 'duiqi-between' : '','label_color'] "
      ></x-textarea>
      <x-textarea
        title="需求内容"
        v-model="dataForm.dwpDataContext"
        readonly
        :style='fourBan'
        :rows='judgeLength(dataForm.dwpDataContext, dwpDataContext) ? dataForm.dwpDataContext.length/13 : fourBanRows'
        :class="[dataForm.dwpDataContext.length > 13 ? 'duiqi-between' : '','label_color','special-hei'] "
      ></x-textarea>
      <x-input
        title="特色需求编号"
        v-model="dataForm.portalQaId"
        readonly
        class="label_color"
      ></x-input>
      <x-input
        title="是否包含敏感信息"
        v-model="dataForm.isSentitive"
        readonly
        class="label_color"
      ></x-input>
      <x-textarea
        v-if="isSentitive"
        title="敏感信息"
        v-model="dataForm.sentitiveInfo"
        readonly
         :style='fourBan'
        :rows='fourBanRows'
        :class="[dataForm.sentitiveInfo.length > 13 ? 'duiqi-between' : '','label_color'] "
      ></x-textarea>
      <div class="my-cell" v-show="dataForm.dwpDataFiles != '' && dataForm.dwpDataFiles != null">
        <p class="minFontSize fj">附件</p>
        <p  style="color:blue;" v-for="(item, index) in dataForm.dwpDataFiles" :key="index" @click="downloadfile(item)">
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
        :rows="2"
        class="label_color"
      ></x-textarea>
      <div class="my-cell" v-show="upForm.upAnswerFiles != ''">
        <p class="minFontSize fj">附件</p>
        <p v-for="(item, index) in upForm.upAnswerFiles" :key="index + 1" @click="downloadfile(item)">
          {{ item.fileName }}
        </p>
      </div>
    </group>
    <!-- <group>
      <group-title slot="title" class="myGroupTit midFontSize">审批</group-title>
    </group>
    <flow orientation="vertical" class="flowtitlecss" :style='flowm' v-show="isDeptDeal">
      <template v-for="(i, index) in flowData"> 
        <flow-state :state="index + 1"   :title="gsh(i.name) + i.deptName" :is-done="i.isDone" :key='index'></flow-state>
        <flow-line v-if="index != (flowData.length - 1)" :is-done="i.lineDone" :key='index'></flow-line>
      </template>
    </flow> -->
  </div>
</template>
<script>
import Header from "@/common/header.vue";
import minxin from "@/common/commonfunction.js";
import { ajaxGet, ajaxPost } from "../../core/mxApi";
import { mapMutations } from 'vuex';
import Bus from "@/bus/bus";
const URL = require("../asssets/Api/api");
export default {
  props: {
    upId: {
      type: String,
      default: "",
    },
    isShowUpUser: {
      type: Boolean,
      default: false,
    },
    isDeptDeal: {
      type: Boolean,
      default: true,
    },
    isSentitiveState: {
      type: Boolean,
      default: false,
    },
    sentitiveInfo: {
      type: String,
      default: "",
    }
  },
  mixins: [minxin],
  data() {
    return {
      gsh(name) {
        let text = "";
        if (name == null || name == "null") {
          return text;
        } else {
          return name;
        }
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
        dwpDataId: "", // 主键
        portalQaId: "", // 特色需求调研编号
        dwpDataUse: "", // 数据用途
        dwpDataExpect: "", // 期望完成期限
        dwpDataContext: "", // 需求内容
        dwpDataFiles: "", // 上传的附件
        isSentitive: "", // 敏感信息
        dwpDataFeedback: "", // 反馈内容
        dwpDataFeedbackFiles: "", // 反馈的附件
        dwpDataFeedbakcTime: "", // 反馈时间
        dwpDataCreateTime: "", // 创建时间
        createUser: "", // 发起人
        dwpDataApplyStatus: "", // 状态
        deptApproveUser: "", // 部门负责人
        branchBankApproveUser: "", // 分行领导负责人
        sentitiveInfo: "", // 敏感信息
      },
      isSentitive: false, // 是否为敏感信息
      // 上一层级信息
      upForm: {
        upAnswerContext: "",
        upAnswerFiles: [],
      },
      flowData: [], // 审批栏数据
      flowm: null,
      fourBan: null,
      fourBanRows: 1,
    };
  },
  created() {
    let font = document.body.style.getPropertyValue('--minSize').trim();
    if (font === '') {
      font = '0.36rem'
    }
    font = font.slice(0, font.indexOf('r'))
    this.fourBanRows = (Number(font)) * 5.5 * 3
    //敏感信息样式设置
    // this.fourBan = `max-height:${(Number(font)) * 5.5}rem;overflow:hidden;`;
  },
  mounted() {
    if (this.$route.query.hasOwnProperty('todoType')) {
       this.tsData()
    } else {
      this.getApplyMsg();
    }
    //this.getTableData()
    // this.getUpDealMsg()
  },
  methods: {
    ...mapMutations(['getDeptId']),
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
            this.getWpsFile(ul, item.fileId)
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
    // 推送时加载的数据
    tsData() {
      Bus.$on('startShowIssue', () => {
         this.getApplyMsg();
      })
    },
    // 上级处理的信息
    getUpDealMsg() {
      if (this.upId != "" && this.upId != null && this.upId != "null") {
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
      const params = { portalQaId: this.$route.query.dwpDataId };
      ajaxGet(URL.url.getCharacterIssueApplyMsg, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            this.getApplyInfo(res.data.data.createUser);
            let {
              data: { data, code },
            } = res;
            this.dataForm = data;
            if (this.dataForm.isSentitive == 1) {
              this.isSentitive = false
              this.dataForm.isSentitive = "否";
              this.$emit('update:isSentitiveState', false)
            } else {
              this.isSentitive = true
              this.dataForm.isSentitive = "是";
              this.$emit('update:sentitiveInfo',this.dataForm.sentitiveInfo)
              this.$emit('update:isSentitiveState', true)
            }
            if (
              this.dataForm.dwpDataFiles != null &&
              this.dataForm.dwpDataFiles != ""
            ) {
              const files = JSON.parse(this.dataForm.dwpDataFiles);
              // let arr = [];
              // for (let i = 0; i < files.length; i++) {
              //   arr.push(files[i].fileName);
              // }
              this.dataForm.dwpDataFiles = files;
            }
            this.dataForm.forEach(item => {
                if (item.length > 52) {
                  item = `${item}`
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
    // 获取申请人 个人信息
    getApplyInfo(userName) {
      const params = { userName: userName };
      ajaxGet(URL.url.getCharacterIssueApplyInfo, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            this.getDeptId(data.deptId)
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
      const params = { portalQaId: this.$route.params.portalQaId };
      ajaxGet(URL.url.getCharacterNeedDealSpeed, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            this.flowData = data;
            this.flowm = `height:${(Number(data.length) - 1) * 0.75}rem;`;
            this.flowData.forEach((item) => {
              if (item.status === "待处理" || item.status === "处理中") {
                item.isDone = false;
                item.lineDone = false;
              } else {
                item.isDone = true;
                item.lineDone = true;
              }
            });
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
  }
  }
  .special-hei{
    /deep/ .weui-textarea {
      height: auto !important;
    }
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
</style>