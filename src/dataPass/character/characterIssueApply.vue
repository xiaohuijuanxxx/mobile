<template>
  <div style="margin-top: 50px;height:100%;" v-touch:right="back">
    <Header :backoptions="backoptions" @tobackpage="back" title="数据下发审批详情" />
     <actionsheet v-model="tsShow" :menus="menusall" @on-click-menu-delete="tsClose" :close-on-clicking-mask='false'></actionsheet>
     <CharacterIssueCommon
      :isSentitiveState.sync="isSentitiveState"
      :sentitiveInfo.sync="sentitiveInfo"
    />
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
          @click.native="lookAll(flowData[index].result)"
        ></flow-state>
        <flow-line
          v-if="index != flowData.length - 1"
          :is-done="i.lineDone"
          :key="index"
        ></flow-line>
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
import Header from "@/common/header.vue";
import minxin from "@/common/commonfunction.js";
import CharacterIssueCommon from "../character/characterIssueCommon";
import { ajaxGet, ajaxPost, ajaxtokenPost, hideWebViewTitle, closeWindow } from "../../core/mxApi";
import Bus from "@/bus/bus";

const URL = require("../asssets/Api/api");
export default {
  components: {
    Header,
    CharacterIssueCommon,
  },
  mixins: [minxin],
  data() {
    return {
      lastback:'',
      tsShow: false, // 推送时的底部弹框
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      flowData: null, // 审批进度数据
      flowm: null,
    }
  },
  created() {
    // 推送进来的
    console.log(222,this.$route.query);
      if (this.$route.query.hasOwnProperty('todoType')) {
        hideWebViewTitle()
        this.getinto()
      } else {
        this.getTableData();
      }
  },
  methods: {
    lookAll(i){
      if(i){
        this.$vux.alert.show({
          title:'审批意见',
          content: `${i}`
        })
      }
    },
    //格式化表格数据
    formatText(item) {
      let text = ` ${item.username ? item.name + '/' + item.username : ''}`
      //修改过
      switch (item.node) {
        case "1":
          return `部门负责人：${text}`;
          break;
        case "2":
          return `分行主管科技行领导：${text}`;
          break;
        case "3":
          return `数据管理部${text}`;
          break;
        case "4":
          return `软件开发中心${text}`;
          break;
        case "5":
          return `总行接口人：${text}`;
          break;
        // case "6":
        //   return `软件开发中心领导：${text}`;
        //   break;
        // case "7":
        //   return `总行接口人：${text}`;
        //   break;
      }
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
    // 获取审批人兰信息
    getTableData() {
      const params = { dwpDataId: this.$route.query.dwpDataId };
      ajaxGet(URL.url.getCharacterIssueDeptSpeed, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            this.flowData = data;
            this.flowData.length && this.flowData[0].approveState == 2 ? this.lastback = '驳回   ' : this.lastback = '同意   ' 
            console.log(this.flowData);
            this.$forceUpdate()
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
      // 返回
    back() {
      if (this.$route.query.hasOwnProperty('todoType')) {
        this.pushLoginOut()
          return;
      }
      // this.$router.push({ path: "/myApproval" });
      this.$router.go(-1);
    },
    // 推送时底部弹框关闭并退出拉取jiemian
    tsClose() {
      closeWindow()
    },
    // 推送拉起时判断此流程状态
    getApplyMsg(username) {
      const params = { portalQaId: this.$route.query.dwpDataId };
      ajaxGet(URL.url.getCharacterIssueApplyMsg, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            if (data =='' || data == null || data == 'null') {
               this.tsShow=true
               this.sheet('该申请单不存在！')
            }  else {
              //  this.tsShow=true
              //  this.sheet('此流程请在PC端处理')
              //  return
              this.getTableData()
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
    }
  }
}
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
</style>
