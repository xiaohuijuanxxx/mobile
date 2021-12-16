<template>
  <div style="margin-top: 50px;height:100%" v-touch:right="back">
    <Header :backoptions="backoptions" @tobackpage="back" title="特色需求审批详情" />
    <CharacterCommon :upId="$route.query.upId" :isShowUpUser="isShowUpUser" isDeptDeal="false" />
    <group>
      <x-input
        title="转处理人"
        v-model="nextUserText"
        v-if="!isShowNextUser"
        placeholder="请选择"
        @click.native="showselcet = true"
      ></x-input>
      <selector
        title="审批意见"
        class="mySel"
        v-model="dealForm.portalQaDealResult"
        :options="selectlist"
        direction="rtl"
        @on-change="approveChange"
        placeholder="请选择"
      ></selector>
      <MyTextarea
        placeholder="请输入审批意见"
        :content.sync="dealForm.portalQaDealContext"
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
          type="character"
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
import CharacterCommon from "../character/characterCommon";
import seclect from "@/common/seclect.vue";
import { TransferDomDirective as TransferDom } from "vux";

import minxin from "@/common/commonfunction.js";
import { mapMutations } from 'vuex';
import { ajaxGet, ajaxPost, ajaxtokenPost, hideWebViewTitle, closeWindow } from "../../core/mxApi";

import Bus from "@/bus/bus";
const URL = require("../asssets/Api/api");
export default {
  directives: {
    TransferDom,
  },
  components: {
    seclect,
    CharacterCommon,
    MyTextarea,
    Header,
  },
  mixins: [minxin],
  data() {
    return {
      tsShow: false, // 推送时的底部弹框
      isShowUpUser: false, // 上级答复信息是否显示
      isShowNextUser: false, // 转处理人按钮是否显示
      answerFiles: [], // 附件
      selectlist: [
        { key: "1", value: "同意" },
        { key: "0", value: "拒绝" },
      ],
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      showselcet: false, // 处理人弹框显示否
      actionSheetVisable: false,
      valueed: [],
      currentUser: JSON.parse(sessionStorage.getItem("currentUser")), // 当前用户信息
      // 处理的信息
      nextUserText: "",
      dealForm: {
        portalQaId: this.$route.query.portalQaId, // 调研id
        portalQaDealUser: "", // 当前处理人
        portalQaDealContext: "", // 审批内容
        portalQaDealFiles: [], // 附件
        portalQaDealLevel: "", // 层级
        portalQaDealState: "", // 状态
        portalQaDealResult: "", // 处理意见
        nextUser: "", // 下个节点处理人
      },
    };
  },
  created() {
    this.setTransitionName('slide-right')
    // 推送进来的
      let portalQaId = this.getquerystring('portalQaId')
      if (portalQaId && this.$route.query.hasOwnProperty('todoType')) {
        sessionStorage.setItem('isTui', true)
        hideWebViewTitle()
        this.getApplyMsg()
      }
  },
  mounted() {
    this.getDealMsg();
  },
  methods: {
    ...mapMutations(['setTransitionName']),
    // 推送时底部弹框关闭并退出拉取jiemian
    tsClose() {
      closeWindow()
    },
    // 推送拉起时判断此流程状态
    getApplyMsg() {
      const params = { id: this.$route.query.id };
      ajaxGet(URL.url.getCharacterNeedTransactorDealMsg, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            if (data =='' || data == null || data == 'null') {
               this.tsShow=true
               this.sheet('该申请单不存在！')
            } else if (data.portalQaDealState != 0 && data.portalQaDealState != null && data.portalQaDealState != '') {
              this.tsShow = true
              this.sheet('该申请单已审批！')
            } else if (this.$route.query.todoType != '603' && this.$route.query.todoType != '606') {
               this.tsShow=true
               this.sheet('此流程请在PC端处理')
               return
            } else {
              this.getinto()
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
                this.currentUser = res.data.principal
                let seeData = JSON.stringify(res.data.principal);
                window.sessionStorage.setItem("currentUser", seeData);
                Bus.$emit('startShow')
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
    getDealMsg() {
      const params = { id: this.$route.query.id };
      ajaxGet(URL.url.getCharacterNeedTransactorDealMsg, params)
        .then((res) => {
          if (
            res.data.data != "" &&
            res.data.data != "null" &&
            res.data.data != null
          ) {
            let arr = [];
            this.answerFiles = [];
            if (
              res.data.data.portalQaDealFiles != null &&
              res.data.data.portalQaDealFiles != ""
            ) {
              arr = JSON.parse(res.data.data.portalQaDealFiles);
              for (let i = 0; i < arr.length; i++) {
                this.answerFiles.push({
                  label: arr[i].fileName,
                  value: false,
                  id: arr[i].fileId,
                });
              }
            } else {
              res.data.data.portalQaDealFiles = [];
            }
            if (res.data.data.portalQaDealLevel == "3") {
              this.isShowUpUser = true;
              // 2表示有上级层级
              this.isShowNextUser = true;
            } else if (res.data.data.portalQaDealLevel == "2") {
              this.isShowUpUser = true;
              // 2表示有上级层级
              this.isShowNextUser = false;
            } else {
              this.isShowUpUser = false;
              this.isShowNextUser = false;
            }
            if (
              res.data.data.portalQaDealResult != null &&
              res.data.data.portalQaDealResult != ""
            ) {
              res.data.data.portalQaDealResult = Number(
                res.data.data.portalQaDealResult
              );
            }
            this.dealForm = res.data.data;
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
    },
    // 返回
    back() {
      if (sessionStorage.getItem('isTui')) {
        this.pushLoginOut()
        return;
        //Bus.$emit('refesh')
      }
        this.$router.go(-1)
      // this.$router.push({ path: "/myApproval" });
      // this.push('myApproval')
    },
    secletdata(data) {
      this.nextUserText = `${data[0].name}/${data[0].username}`;
      this.dealForm.nextUser = data[0].username;
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
        this.dealForm.portalQaDealContext = "同意。";
        this.isShowNextUser = false;
      } else {
        this.dealForm.portalQaDealContext = "";
        this.isShowNextUser = true;
      }
    },
    // 提交前校验
    beforeSubmit() {
      if (!this.dealForm.nextUser && !this.isShowNextUser) {
        this.actionSheetVisable = true;
        this.sheet("请选择转处理人");
        return;
      }
      if (!this.dealForm.portalQaDealResult) {
        this.actionSheetVisable = true;
        this.sheet("请选择审批意见");
        return;
      }
      if (!this.dealForm.portalQaDealContext) {
        this.actionSheetVisable = true;
        this.sheet("请输入审批意见");
        return;
      }
      if(this.dealForm.portalQaDealResult != 1 && this.dealForm.portalQaDealContext){
        this.actionSheetVisable = true;
      }
      this.showConfirm = true;
      if (this.dealForm.portalQaDealResult == "1") {
        this.sheet("你是否同意该条申请信息？");
      } else {
        this.sheet("你是否拒绝该条申请信息？");
      }
    },
    // 提交
    onSubmit() {
      this.dealForm.portalQaDealUser = this.currentUser.username;
      this.dealForm.portalQaDealFiles = JSON.stringify(
        this.dealForm.portalQaDealFiles
      );
      const data = JSON.stringify(this.dealForm);
      ajaxPost(URL.url.getCharacterNeedTransactorDeal, data)
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
    },
  },
};
</script>
<style scoped lang="less">
</style>