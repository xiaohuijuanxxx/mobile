<template>
  <div style="margin-top: 50px;" v-touch:right="back">
    <Header
      :backoptions="backoptions"
      @tobackpage="back"
      title="数据下发审批详情"
    />
    <CharacterIssueCommon />
    <group>
      <group-title slot="title" class="myGroupTit midFontSize"
        >审批
          <span style="font-size:0.3rem;padding-left:0.5rem;color:gray">审批意见请点击查看<img style="width: 4.5%;vertical-align: sub;" src="static/mydown.png" /></span>
        </group-title
      >
    </group>
    <flow orientation="vertical" class="flowtitlecss" :style="flowm">
      <template v-for="(i, index) in flowData">
        <flow-state
          :state="index + 1"
          :class="{refuse :flowData[index].status == '已退回' || flowData[index].status == '已拒绝' ? true : false}"
          :title="formatText(i)"
          :is-done="i.isDone"
          :key="index"
          @click.native="resultBT(flowData[index].result)"
        ></flow-state>
        <flow-line
          v-if="index != flowData.length - 1"
          :is-done="i.lineDone"
          :key="index"
        ></flow-line>
      </template>
    </flow>
    <group>
      <x-input
        title="数据管理部"
        v-model="sjglPeople"
        placeholder="请选择"
        v-if="this.$route.query.status != 5 && dealForm.dwpDataManageResult != '0'"
        @click.native="(showselcet = true), (isSjgl = true)"
      ></x-input>
      <x-input
        title="软件开发中心"
        v-model="rkPeople"
        placeholder="请选择"
        v-if="this.$route.query.status != 5 && dealForm.dwpDataManageResult != '0'"
        @click.native="(showselcet = true), (isSjgl = false)"
      ></x-input>
      <selector
        title="审批意见"
        class="mySel"
        v-model="dealForm.dwpDataManageResult"
        :options="selectlist"
        direction="rtl"
        @on-change="approveChange"
        placeholder="请选择"
      ></selector>
      <MyTextarea
        placeholder="请输入审批意见"
        :content.sync="dealForm.content"
      />
    </group>
    <flexbox style="margin-top: 1rem; padding-bottom: 1rem">
      <flexbox-item>
        <x-button type="warn" @click.native="beforeSubmit" style="width: 95%"
          >提交</x-button
        >
      </flexbox-item>
    </flexbox>
    <div v-transfer-dom>
      <popup
        v-model="showselcet"
        position="bottom"
        height="100%"
        :hide-on-blur="false"
        style="position: absolute !impotant; z-index: 999"
      >
        <seclect
          type="officeInter"
          :valueed="valueed"
          @changeselect="secletdata"
          @cancal="cancalback"
          @inputCli="inputCli"
        ></seclect>
      </popup>
    </div>
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
    <actionsheet
      v-model="showConfirm"
      :menus="menusall"
      @on-click-menu-delete="onSubmit"
      show-cancel
    ></actionsheet>
    <actionsheet
      v-model="tsShow"
      :menus="menusall"
      @on-click-menu-delete="tsClose"
      :close-on-clicking-mask="false"
    ></actionsheet>
  </div>
</template>
<script>
import Header from "@/common/header.vue";
import MyTextarea from "@/common/myTextarea.vue";
import CharacterIssueCommon from "../character/characterIssueCommon";
import seclect from "@/common/seclect.vue";
import { TransferDomDirective as TransferDom } from "vux";

import minxin from "@/common/commonfunction.js";
import {
  ajaxGet,
  ajaxPost,
  ajaxtokenPost,
  hideWebViewTitle,
  closeWindow,
} from "../../core/mxApi";

import Bus from "@/bus/bus";
const URL = require("../asssets/Api/api");
export default {
  directives: {
    TransferDom,
  },
  components: {
    seclect,
    Header,
    CharacterIssueCommon,
    MyTextarea,
  },
  mixins: [minxin],
  data() {
    return {
      mid:{},
      tsShow: false, // 推送时的底部弹框
      isSjgl: false, // 判断是选择哪个部门的接口人
      showselcet: false, // 处理人弹框显示否
      valueed: [],
      selectlist: [
        { key: "1", value: "同意" },
        { key: "0", value: "拒绝" },
      ],
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      currentUserInfo: JSON.parse(sessionStorage.getItem("currentUser")),
      flowData: [], // 审批进度数据
      flowm: null,
      actionSheetVisable: false, // 用户是否填写相关审批信息
      showConfirm: false, // 提交确认弹框
      // 审批人填写的信息
      dealForm: {
        dwpDataId: "",
        dwpDataManageStatus: "", // 状态
        dwpDataManageTime: "", // 处理时间
        dwpDataManageUser: "", // 接口人
        dwpDataManageResult: "", // 审核意见
        dealUsers: "", // 转处理人
        content: "", // 答复内容
        files: "", // 答复附件
        sjglPeople: "", // 用来做空校验
        rkPeople: "", // 用来做空校验
      },
      sjglPeople: "", // 用来做空校验
      rkPeople: "", // 用来做空校验
    };
  },
  created() {
    this.mid = this.$route.query;
    if (this.$route.query.hasOwnProperty("todoType")) {
      sessionStorage.setItem('isTui', true)
      hideWebViewTitle();
      this.getApplyMsg();
    } else {
      this.getTableData();
    }
  },
  mounted() {},
  methods: {
    resultBT(i){
      if(i){
        this.$vux.alert.show({
          title:'审批意见',
          content: `${i}`
        })
      }
    },
    // 推送时底部弹框关闭并退出拉取jiemian
    tsClose() {
      closeWindow();
    },
    // 推送拉起时判断此流程状态
    getApplyMsg() {
      let todoType = this.$route.query.todoType;
      const params = { dwpDataId: this.$route.query.dwpDataId };
      ajaxGet(URL.url.getCharacterIssueInterfaceDealMsg, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            if (data == "" || data == null || data == "null") {
              this.tsShow = true;
              this.sheet("该申请单不存在！");
            } else if (
              data.dwpDataManageStatus != 0 &&
              data.dwpDataManageStatus != null &&
              data.dwpDataManageStatus != "" &&
              (todoType == "703" || todoType == "705" || todoType == "707")
            ) {
              this.tsShow = true;
              this.sheet("该申请单已审批！");
            } else if (
              data.dwpDataManageStatus != 5 &&
              data.dwpDataManageStatus != null &&
              data.dwpDataManageStatus != "" &&
              todoType == "706"
            ) {
              this.tsShow = true;
              this.sheet("该申请单已审批！");
            } else {
              this.getinto();
            }
            //  else if (this.$route.query.todoType != '703' && this.$route.query.todoType != '705' && this.$route.query.todoType != '706' && this.$route.query.todoType != '707') {
            //    this.tsShow=true
            //   this.sheet('此流程请在PC端处理')
            //   return
            // }
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
    // 从推送拉起该页面 需调用获取token方法
    getinto() {
      let _this = this;
      _this.showloading();
      document.addEventListener("deviceready", () => {
        MXCommon.getSSOToken("datamdwp", (ssoToken) => {
          window.sessionStorage.setItem("appToken", ssoToken);
          MXCommon.getCurrentUser((user) => {
            _this.closeloading();
            let params = {
              userName: user.login_name,
              loginChannel: "MX",
              mx_sso_token: ssoToken,
            };
            let tokenurl = `${URL.url.getToken}?grant_type=password&username=${user.login_name}&password=${user.login_name}`;
            ajaxtokenPost(tokenurl)
              .then((res) => {
                let token = `${res.data.token_type} ${res.data.access_token}`;
                _this.$store.commit({
                  type: "getssoToken",
                  ssoToken: token,
                });
                this.currentUserInfo = res.data.principal;
                let seeData = JSON.stringify(res.data.principal);
                window.sessionStorage.setItem("currentUser", seeData);
                Bus.$emit("startShowIssue");
                this.getTableData();
              })
              .catch((err) => {
                let omsg = _this.outmsg(err);
                if (!omsg) {
                  return;
                }
                _this.closeloading();
                _this.actionSheetVisable = true;
                _this.sheet(omsg);
              });
          });
        });
      });
    },
    secletdata(data) {
      if (this.isSjgl) {
        this.sjglPeople = `${data[0].name}/${data[0].username}`;
        this.dealForm.sjglPeople = data[0].username;
      } else {
        this.rkPeople = `${data[0].name}/${data[0].username}`;
        this.dealForm.rkPeople = data[0].username;
      }
    },
    cancalback() {
      this.valueed = [];
      this.showselcet = false;
    },
    inputCli() {
      setTimeout(() => {
        document.documentElement.scrollTop = document.body.offsetHeight;
      }, 100);
    },
    // 审批意见发生改变时
    approveChange(key) {
      if (key == "1") {
        this.dealForm.content = "同意。";
      } else {
        this.dealForm.content = "";
      }
    },
    //格式化表格数据
    formatText(item) {
      let text = ` ${item.name ? item.name + '/' + item.username : item.deptName}`
      switch (item.node) {
        case "1":
          return `部门负责人：${text}`;
          break;
        case "2":
          return `分行主管科技行领导：${text}`;
          break;
        case "3":
          return `数据管理部接口人：${text}`;
          break;
        case "4":
          return `数据管理部领导：${text}`;
          break;
        case "5":
          return `软件开发中心接口人：${text}`;
          break;
        case "6":
          return `软件开发中心领导：${text}`;
          break;
        case "7":
          return `总行接口人：${text}`;
          break;
      }
    },
    // 获取审批人兰信息
    getTableData() {
      const params = { dwpDataId: this.$route.query.dwpDataId };
      ajaxGet(URL.url.getCharacterIssueInterfaceSpeed, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            this.flowData = data;
            console.log(this.flowData);
            this.flowData.sort(function (a, b) {
              return a.node - b.node;
            });
            if (data.length > 1) {
              this.flowm = `height:${(Number(data.length) - 1) * 0.75}rem;`;
            }
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
    // 提交前校验
    beforeSubmit() {
      if (!this.sjglPeople && this.dealForm.dwpDataManageResult == "1" && this.mid.status !=5 ) {
        this.actionSheetVisable = true;
        this.sheet("请选择数据管理部门接口人");
        return;
      }
      if (!this.rkPeople && this.dealForm.dwpDataManageResult == "1" && this.mid.status !=5) {
        this.actionSheetVisable = true;
        this.sheet("请选择软件开发中心接口人");
        return;
      }
      if (!this.dealForm.dwpDataManageResult) {
        this.actionSheetVisable = true;
        this.sheet("请选择审批意见");
        return;
      }
      if (!this.dealForm.content) {
        this.actionSheetVisable = true;
        this.sheet("请输入审批意见");
        return;
      }
      this.showConfirm = true;
      if (this.dealForm.dwpDataManageResult == "1") {
        this.sheet("你是否同意该条申请信息？");
      } else {
        this.sheet("你是否拒绝该条申请信息？");
      }
    },
    // 提交
    onSubmit() {
      this.dealForm.dwpDataId = this.$route.query.dwpDataId;
      this.dealForm.dwpDataManageUser = this.currentUserInfo.username;
      this.dealForm.dwpDataManageStatus = this.$route.query.status;
      this.dealForm.dealUsers = `${this.dealForm.sjglPeople},${this.dealForm.rkPeople}`;
      const data = JSON.stringify(this.dealForm);
      ajaxPost(URL.url.characterIssueInterfaceDeal, data)
        .then((res) => {
          this.$router.push({ name: "approvalFinish" });
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
    },
    // 返回
    back() {
      if (sessionStorage.getItem('isTui')) {
        this.pushLoginOut()
        return;
        //Bus.$emit('refesh')
      }
      this.$router.go(-1);
      // this.$router.push({ path: "/myApproval" });
    },
  },
};
</script>
<style scoped lang="less">
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
  /deep/.refuse .weui-wepay-flow__state{ 
  background: rgb(238, 68, 68) !important;
}
}
</style>
