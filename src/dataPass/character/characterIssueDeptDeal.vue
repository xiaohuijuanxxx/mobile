<template>
  <div style="margin-top: 50px;height:100%" v-touch:right="back">
    <Header
      :backoptions="backoptions"
      @tobackpage="back"
      title="数据下发审批详情"
    />
    <CharacterIssueCommon
      :isSentitiveState.sync="isSentitiveState"
      :sentitiveInfo.sync="sentitiveInfo"
    />
    <!-- <group>
      <group-title slot="title" class="myGroupTit midFontSize"
        >更改处理人<span style="color: #b2b2b2" class="minFontSizeMin"
          >（此项非必填）</span
        ></group-title
      >
      <x-input
        v-if="$route.query.level == '1'"
        title="部门负责人"
        v-model="deptApproveUser"
        placeholder="请选择"
        @on-change="changeDealPerson"
        @click.native="showselcet = true"
      ></x-input>
      <template v-else style="position: relative">
        <x-input
          class="my-long-label my-clear-position"
          show-clear="false"
          title="分行主管科技行领导"
          v-model="deptApproveUser"
          placeholder="请选择"
          @on-change="changeDealPerson"
        ></x-input>
        <div class="input-zhe" @click="showselcet = true"></div>
        <x-icon
          @click="clearInput"
          type="ios-close"
          class="my-close"
          size="15"
        ></x-icon>
      </template>
    </group> -->
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
          :class="{refuse : flowData[index].status == '已退回' || flowData[index].status == '已拒绝' ? true : false}"
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
        v-if="isSentitiveState && !ifChangeDealPerson"
        v-html="sensitiveInfoCommit"
        @click.native="showCommitment"
      ></x-input>
      <selector
        v-show="!ifChangeDealPerson"
        title="审批意见"
        class="mySel"
        v-model="dealForm.dwpDataApproveResult"
        :options="selectlist"
        direction="rtl"
        @on-change="approveChange"
        placeholder="请选择"
      ></selector>
      <MyTextarea
        v-show="!ifChangeDealPerson"
        placeholder="请输入审批意见"
        :content.sync="dealForm.dwpDataApproveContent"
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
        height="98%"
        :hide-on-blur="false"
        style="position: absolute !impotant; z-index: 999"
      >
        <seclect
          :type="currentDeptType"
          v-if="showselcet"
          :valueed="valueed"
          @changeselect="secletdata"
          @cancal="cancalback"
          @inputCli="inputCli"
        ></seclect>
      </popup>
    </div>
    <div v-transfer-dom>
      <popup
        v-model="showCommitmentFlag"
        position="top"
        height="80%"
        :hide-on-blur="false"
        :show-mask="false"
      >
        <div
          v-show="showCommitmentFlag"
          style="padding: 0.2rem; margin-top: 1rem"
        >
          <h2
            style="
              color: red;
              text-align: center;
              font-size: 0.5rem;
              margin: 0.5rem auto;
            "
          >
            敏感信息保密承诺书
          </h2>
          <!-- <div style="height:30rem;overflow: scroll;"> -->
          <p
            style="
              color: #999999;
              margin-top: 0.4rem;
              margin-bottom: 0.4rem;
              font-size: 0.4rem;
              text-align: justify;
            "
          >
            &nbsp;&nbsp;&nbsp;&nbsp;申请数据仓库数据查询客户敏感数据使用安全保密承诺书
          </p>
          <p style="color: #999999; font-size: 0.4rem; text-align: justify">
            &nbsp;&nbsp;&nbsp;&nbsp;本机构在保存、使用数据仓库数据时，知悉应承担的保密义务，确保信息安全，防止因客户敏感数据泄露或挪作他用，造成对客户自身财产安全的不利影响以及由此引发的银行声誉风险。此次下发数据中涉及的敏感数据包括:
          </p>
          <p
              class="mgmessage"
              >{{ sentitiveInfo }}</p
            >
          <p style="color: #999999; font-size: 0.4rem">
            &nbsp;&nbsp;&nbsp;&nbsp;现作出如下郑重承诺：
          </p>
          <p style="color: #999999; font-size: 0.4rem; text-align: justify">
            &nbsp;&nbsp;&nbsp;&nbsp;1、本分行严格遵守国家有关法律规定及行内相关管理要求，承担对客户信息保密的职责；
          </p>
          <p style="color: #999999; font-size: 0.4rem; text-align: justify">
            &nbsp;&nbsp;&nbsp;&nbsp;2、本分行将采取有效措施加强对客户敏感信息的保护，确保信息安全，数据使用人员不得通过移动存储或其他技术手段将数据泄露到行外，不得出售客户数据等；
          </p>
          <p style="color: #999999; font-size: 0.4rem; text-align: justify">
            &nbsp;&nbsp;&nbsp;&nbsp;3、严禁第三方机构人员接触我行客户数据，如确有系统建设等需要，应保证在有行内人员在场监督的情况下，方可安全使用；
          </p>
          <p style="color: #999999; font-size: 0.4rem; text-align: justify">
            &nbsp;&nbsp;&nbsp;&nbsp;4、如违反规定使用和对外提供客户金融信息，给全行及客户造成损害的，无条件接受相关处理，如违法愿承担相应的法律责任。
          </p>
          <!-- </div> -->
          <x-button
            type="warn"
            style="width: 80%; margin: 0.8rem auto"
            @click.native="hideCommitment"
            >我已阅读</x-button
          >
        </div>
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
import { mapMutations } from 'vuex';

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
      resultList:[],
      isSentitiveState: false, // 是否包含敏感信息
      showCommitmentFlag: false, // 敏感信息弹框
      readdone: false, // 是否阅读敏感信息
      sensitiveInfoCommit: `<p class="innerpcss">敏感信息承诺</p><p class="innerpcsst">需阅读<span style="color:blue">《敏感信息保密承诺书》</span></p>`,
      tsShow: false, // 推送时的底部弹框
      showselcet: false, // 更改处理人弹框显示否
      currentDeptType: "", // 是部门经理还是部门领导
      deptApproveUser: "", // 更改的处理人
      deptApproveUserNum: "", // 更改的处理人工号
      ifChangeDealPerson: false,
      selectlist: [
        { key: "1", value: "同意" },
        { key: "0", value: "拒绝" },
      ],
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      valueed: [],
      currentUserInfo: JSON.parse(sessionStorage.getItem("currentUser")),
      flowData: [], // 审批进度数据
      flowm: null,
      actionSheetVisable: false, // 用户是否填写相关审批信息
      showConfirm: false, // 提交确认弹框
      // 审批人填写的信息
      dealForm: {
        dwpDataId: "",
        dwpDataApproveId: "",
        dwpDataApproveResult: "",
        dwpDataApproveContent: "",
        dwpDataApproveUser: "",
        dwpDataApproveTime: "",
        upId: "",
        dwpDataApproveStatus: "",
      },
    };
  },
  created() {
    this.setTransitionName('slide-right')
    if (this.$route.query.hasOwnProperty("todoType")) {
      hideWebViewTitle();
      sessionStorage.setItem("isTui", true);
      this.getinto();
    } else {
      this.getTableData();
    }
    if (this.$route.query.level == "1") {
      this.currentDeptType = "currentDept";
    } else {
      this.currentDeptType = "currentDeptLeader";
    }
  },
  mounted() {
  },
  methods: {
    ...mapMutations(['setTransitionName']),
    // 审批意见点击显示
    resultBT(i){
      if(i){
        this.$vux.alert.show({
          title:'审批意见',
          content: `${i}`
        })
      }
    },
    // 清除更改处理人此项选择
    clearInput() {
      this.ifChangeDealPerson = false;
      this.deptApproveUser = "";
      this.deptApproveUserNum = "";
    },
    // 推送时底部弹框关闭并退出拉取jiemian
    tsClose() {
      closeWindow();
    },
    // 推送拉起时判断此流程状态
    getApplyMsg(username) {
      const params = {
        dwpDataApproveId: this.$route.query.dwpDataApproveId,
        userName: username,
      };
      ajaxGet(URL.url.getCharacterIssueDeptDealMsg, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            if (data == "" || data == null || data == "null") {
              this.tsShow = true;
              this.sheet("该申请单不存在！");
            } else if (
              data.dwpDataApproveStatus != "0" &&
              data.dwpDataApproveStatus != null &&
              data.dwpDataApproveStatus != ""
            ) {
              this.tsShow = true;
              this.sheet("该申请单已审批！");
            }
            this.getTableData();
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
                this.getApplyMsg(res.data.principal.username);
                this.currentUserInfo = res.data.principal;
                let seeData = JSON.stringify(res.data.principal);
                window.sessionStorage.setItem("currentUser", seeData);
                Bus.$emit("startShowIssue");
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
    // 更改处理人时
    changeDealPerson(val) {
      if (val != "") {
        this.ifChangeDealPerson = true;
      } else {
        this.ifChangeDealPerson = false;
      }
    },
    // 审批意见发生改变时
    approveChange(key) {
      if (key == "1") {
        this.dealForm.dwpDataApproveContent = "同意。";
      } else {
        this.dealForm.dwpDataApproveContent = "";
      }
    },
    secletdata(data) {
      this.deptApproveUser = `${data[0].userName}/${data[0].userNum}`;
      this.deptApproveUserNum = data[0].userNum;
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
    // 提交前校验
    beforeSubmit() {
      if (!this.ifChangeDealPerson) {
        if (!this.dealForm.dwpDataApproveResult) {
          this.actionSheetVisable = true;
          this.sheet("请选择审批意见");
          return;
        }
        if (!this.dealForm.dwpDataApproveContent) {
          this.actionSheetVisable = true;
          this.sheet("请输入审批意见");
          return;
        }
        if (!this.readdone && this.isSentitiveState && this.dealForm.dwpDataApproveResult == '1') {
          this.actionSheetVisable = true;
          this.sheet("请先阅读敏感信息保密承诺书");
          return;
        }
        this.showConfirm = true;
        if (this.dealForm.dwpDataApproveResult == "1") {
          this.sheet("你是否同意该条申请信息？");
        } else {
          this.sheet("你是否拒绝该条申请信息？");
        }
      } else {
        this.showConfirm = true;
        this.sheet("确认提交？");
      }
    },
    // 提交
    onSubmit() {
      if (!this.ifChangeDealPerson) {
        this.dealForm.dwpDataId = this.$route.query.dwpDataId;
        this.dealForm.dwpDataApproveUser = this.currentUserInfo.username;
        this.dealForm.dwpDataApproveStatus = this.$route.query.status;
        this.dealForm.dwpDataApproveResult = Number(
          this.dealForm.dwpDataApproveResult
        );
        this.dealForm.dwpDataApproveId = this.$route.query.dwpDataApproveId;
        const data = JSON.stringify(this.dealForm);
        ajaxPost(URL.url.characterIssueDeptDeal, data)
          .then((res) => {
            this.setTransitionName('')
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
      } else {
        const params = {
          dwpDataApproveId: this.$route.query.dwpDataApproveId,
          userName: this.deptApproveUserNum,
        };
        ajaxGet(URL.url.deptChangeDealPerson, params)
          .then((res) => {
            this.setTransitionName('')
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
      }
    },
    // 敏感信息承诺书阅读
    hideCommitment() {
      let vm = this;
      vm.readdone = true;
      vm.showCommitmentFlag = false;
    },
    showCommitment() {
      let vm = this;
      this.showCommitmentFlag = true;
    },
    // 返回
    back() {
      if (sessionStorage.getItem("isTui")) {
        this.pushLoginOut()
        return;
      }
      // this.$router.push({ path: "/myApproval" });
      this.$router.go(-1)
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
          return `总行接口人审批：${text}`;
          break;
        case "8":
          return `总行接口人复核：${text}`;
          break;
        // case "7":
        //   return `总行接口人：${text}`;
        //   break;
      }
    },
    // 获取审批人兰信息
    getTableData() {
      const params = { dwpDataId: this.$route.query.dwpDataId };
      ajaxGet(URL.url.getCharacterIssueDeptSpeed, params)
        .then((res) => {
          this.resultList = res.data.data
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            this.flowData = data;
            console.log(this.flowData);
            // this.flowData.sort(function (a, b) {
            //   return a.node - b.node;
            // });
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
  },
};
</script>
<style scoped lang="less">
// 流程图解样式
.mgmessage{
  color:#e92323;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  font-size: 0.4rem;
}
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
.my-long-label {
  /deep/ .weui-label {
    width: 180px;
  }
}
.my-clear-position {
  /deep/ .weui-input {
    width: 93%;
    text-align: right;
  }
  /deep/ .weui-icon-clear {
    display: none !important;
  }
}
.my-close {
  position: absolute;
  right: 10px;
  top: 50%;
  transform: translateY(-50%);
}
.input-zhe {
  position: absolute;
  left: 180px;
  top: 0;
  bottom: 0;
  width: 43%;
}
.vux-x-icon {
  fill: #b2b2b2;
}
/deep/.innerpcss {
  color: #999999;
  width: 4rem;
}
/deep/.innerpcsst {
  text-align: right;
  width: calc(100%-4rem);
}
/deep/.refuse .weui-wepay-flow__state{ 
  background: rgb(238, 68, 68) !important;
}
</style> */
