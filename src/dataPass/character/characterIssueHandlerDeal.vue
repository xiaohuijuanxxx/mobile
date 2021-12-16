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
        >更改处理人<span style="color:#b2b2b2;" class="minFontSizeMin">（此项非必填）</span></group-title
      >
      <template style="position:relative;" v-if="$route.query.level == '1'">
      <x-input
        title="数据/软开接口人"
        class="my-clear-position"
        v-model="deptApproveUserName"
        show-clear="true"
        placeholder="请选择"
      ></x-input>
      <div class="input-zhe" @click="showselcet = true,currentRole = 'issueHandlerInterface',isNext = true"></div>
      <x-icon @click.native="clearInput" type="ios-close" class="my-close" size="15"></x-icon>
      </template>
      <template v-else style="position:relative;">
      <x-input
        title="数据/软开领导"
        class="my-clear-position"
        show-clear="true"
        v-model="deptApproveUserName"
        placeholder="请选择"
      ></x-input>
      <div class="input-zhe" @click="showselcet = true, currentRole = 'issueHandlerLeader',isNext = true"></div>
      <x-icon @click.native="clearInput" type="ios-close" class="my-close" size="15"></x-icon>
      </template>
    </group>
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
    <group v-show="isNext">
      <group-title slot="title" class="myGroupTit midFontSize"
        >审批
        </group-title
      >
      <x-input
      v-if="$route.query.level == 1"
        title="数据/软开领导"
        v-model="nextUserText"
        placeholder="请选择"
        @click.native="showselcet = true,currentRole = 'issueHandlerLeader',isNext = true"
      ></x-input>
      <selector
        title="审批意见"
        class="mySel"
        v-model="dealForm.dwpDataDealResult"
        :options="selectlist"
        direction="rtl"
        @on-change="approveChange"
        placeholder="请选择"
      ></selector>
      <MyTextarea
        placeholder="请输入审批意见"
        :content.sync="dealForm.dwpDataDealContext"
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
          :type="currentRole"
          v-if="showselcet"
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
     <actionsheet v-model="tsShow" :menus="menusall" @on-click-menu-delete="tsClose" :close-on-clicking-mask='false'></actionsheet>
  </div>
</template>
<script>
import Header from "@/common/header.vue";
import MyTextarea from "@/common/myTextarea.vue";
import CharacterIssueCommon from "../character/characterIssueCommon";
import seclect from "@/common/seclect.vue";
import { TransferDomDirective as TransferDom } from "vux";

import minxin from "@/common/commonfunction.js";
import { mapMutations } from 'vuex';
import { ajaxGet, ajaxPost, ajaxtokenPost, hideWebViewTitle, closeWindow  } from "../../core/mxApi";

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
      result:'',
      resultList:[],
      tsShow: false, // 推送时的底部弹框
      currentRole: '', // 判断用户想要选择哪个下拉框的数据 传递不同的角色
      isNext: true, // 判断用户是要转处理人还是选择下级处理人
      deptApproveUser: '', // 更改的处理人
      deptApproveUserName: '', // 更改的处理人
      nextUserText: "", // 下级处理人显示文字
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
          dwpDataId: '',
          dwpDataDealId: '',
          dwpDataDealStatus: '', // 状态
          dwpDataDealLevel: '', // 层级
          dwpDataDealResult: '', // 审核意见
          nextUser: '', // 下级处理人
          dwpDataDealContext: '', // 答复内容
          dwpDataDealUser: '', // 处理人
          dwpDataDealType: '',
          dwpDataDealFiles: '' // 答复附件
        }
    };
  },
  created() {
    this.setTransitionName('slide-right')
    if (this.$route.query.hasOwnProperty('todoType')) {
      sessionStorage.setItem('isTui', true)
        hideWebViewTitle()
        this.getinto()
     } else {
       this.getTableData();
     }
  },
  mounted() {
    this.getResultList()
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
      }else {
        // alert()
      }
      // if(!i){
      //   // alert('暂未审批')
      // }
    },
    // 获取审批意见
    getResultList(){
      const params = { dwpDataId: this.$route.query.dwpDataId };
      ajaxGet(URL.url.getCharacterIssueDeptSpeed, params)
        .then((res) => {
          // alert(JSON.stringify())
          this.resultList = res.data.data
          // alert(JSON.stringify(this.resultList))

          for(var i=0;i<this.resultList.length;i++){
            // alert(JSON.stringify(this.resultList[i].result))
            this.result = this.resultList[i].result
            // alert(this.result)
            if(this.result){
              return this.result = this.result
            }else {
              return this.result = ''
            }
            // res.data.data[i]
            // alert(res.data.data[i])
          }
          // this.resultList = res.data.data
          // alert(JSON.stringify(this.result))
          // for(var i=0;i<this.resultList.length;i++){
          //   // alert(JSON.stringify(this.resultList[i].result))
          //   this.dds=this.resultList[i]
          //   // alert(JSON.stringify(this.dds.result))
          //   // alert(JSON.stringify(this.result))
          // }
        })
    },
    // 清除更改处理人此项选择
    clearInput() {
      this.isNext = true
      this.deptApproveUserName = ''
      this.deptApproveUser = ''
    },
     // 推送时底部弹框关闭并退出拉取jiemian
    tsClose() {
      closeWindow()
    },
    // 推送拉起时判断此流程状态
    getApplyMsg(username) {
      const params = { dwpDataDealId: this.$route.query.dwpDataApproveId, userName: username };
      ajaxGet(URL.url.getCharacterIssueHandlerDealMsg, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            if (data =='' || data == null || data == 'null') {
               this.tsShow=true
               this.sheet('该申请单不存在！')
            } else if (data.dwpDataDealStatus != 0 && data.dwpDataDealStatus != null && data.dwpDataDealStatus != '') {
              this.tsShow = true
              this.sheet('该申请单已审批！')
            }
          }
          this.getTableData();
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
                this.getApplyMsg(res.data.principal.username)
                this.currentUserInfo = res.data.principal
                let seeData = JSON.stringify(res.data.principal);
                window.sessionStorage.setItem("currentUser", seeData);
                Bus.$emit('startShowIssue')
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
    // 审批意见发生改变时
    approveChange(key) {
      if (key == "1") {
        this.dealForm.dwpDataDealContext = "同意。";
      } else {
        this.dealForm.dwpDataDealContext = "";
      }
    },
    secletdata(data) {
      if (this.currentRole == 'issueHandlerLeader' && this.isNext && this.$route.query.level == "1") {
        this.nextUserText = `${data[0].name}/${data[0].username}`;
        this.dealForm.nextUser = data[0].username;
      } else {
        this.isNext = false;
        this.deptApproveUserName = `${data[0].name}/${data[0].username}`;
        this.deptApproveUser = data[0].username;
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
    // 提交前校验
    beforeSubmit() {
      if (this.isNext) {
        if(!this.dealForm.nextUser && this.$route.query.level == 1) {
        this.actionSheetVisable = true;
        this.sheet("请选择下级处理人。");
        return;
      }
      if (!this.dealForm.dwpDataDealResult) {
        this.actionSheetVisable = true;
        this.sheet("请选择审批意见。");
        return;
      }
      if (!this.dealForm.dwpDataDealContext) {
        this.actionSheetVisable = true;
        this.sheet("请输入审批意见。");
        return;
      }
      this.showConfirm = true;
      if (this.dealForm.dwpDataDealResult == "1") {
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
      if (this.isNext) {
        this.dealForm.dwpDataId = this.$route.query.dwpDataId;
      this.dealForm.dwpDataDealUser = this.currentUserInfo.username;
      this.dealForm.dwpDataDealStatus = this.$route.query.status;
      this.dealForm.dwpDataDealId = this.$route.query.dwpDataApproveId;
      this.dealForm.dwpDataDealLevel = this.$route.query.level;
      this.dealForm.dwpDataDealType = this.$route.query.dwpType;
      const data = JSON.stringify(this.dealForm);
      ajaxPost(URL.url.characterIssueHandlerDeal, data)
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
        const params = {dwpDataDealId: this.$route.query.dwpDataApproveId, userName: this.deptApproveUser}
        ajaxGet(URL.url.handlerChangeDealPerson, params).then((res) => {
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
    // 返回
    back() {
      if (sessionStorage.getItem('isTui')) {
        this.pushLoginOut()
        return;
        //Bus.$emit('refesh')
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
          return `总行接口人：${text}`;
          break;
      }
    },
    // 获取审批人兰信息
    getTableData() {
      const params = { dwpDataId: this.$route.query.dwpDataId,dwpDataDealId: this.$route.query.dwpDataApproveId };
      ajaxGet(URL.url.getCharacterIssueHandlerSpeed, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            this.flowData = data;
            this.flowData.sort(function (a, b) {
              return a.node - b.node;
            });
            if (data.length > 1) {
              this.flowm = `height:${(Number(data.length) - 1) * 0.75}rem;`;
            }
            // this.flowm = `height:${(Number(data.length) - 1) * 0.75}rem;`;
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
.my-close{position:absolute;right:10px;top:50%;transform:translateY(-50%);}
.input-zhe{position:absolute;left:180px;top:0;bottom:0;width:43%;}
.my-clear-position{
  /deep/ .weui-input{width:93%;text-align:right;}
  /deep/ .weui-icon-clear{display:none !important;}
}
.vux-x-icon{fill:#b2b2b2;}
/deep/.refuse .weui-wepay-flow__state{ 
  background: rgb(238, 68, 68) !important;
}
</style>
