<template>
  <div style="margin-top: 50px;height:100%" v-touch:right="back">
    <Header
      :backoptions="backoptions"
      @tobackpage="back"
      title="特色需求审批详情"
    />
    <CharacterCommon />
    <group>
      <selector
        title="审批意见"
        class="mySel"
        v-model="dealForm.portalQaApproveResult"
        :options="selectlist"
        direction="rtl"
        @on-change="approveChange"
        placeholder="请选择"
      ></selector>
      <MyTextarea
        placeholder="请输入审批意见"
        :content.sync="dealForm.portalQaApproveContent"
      />
    </group>
    <flexbox style="margin-top: 1rem; padding-bottom: 1rem">
      <flexbox-item>
        <x-button type="warn" @click.native="beforeSubmit" style="width: 95%"
          >提交</x-button
        >
      </flexbox-item>
    </flexbox>
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
import { mapMutations } from 'vuex';

import minxin from "@/common/commonfunction.js";
import { ajaxGet, ajaxPost, ajaxtokenPost, hideWebViewTitle, closeWindow } from "../../core/mxApi";

import Bus from "@/bus/bus";
const URL = require("../asssets/Api/api");
export default {
  components: {
    Header,
    CharacterCommon,
    MyTextarea,
  },
  mixins: [minxin],
  data() {
    return {
      actionSheetVisable: false, // 用户是否填写相关审批信息
      showConfirm: false, // 提交确认弹框
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      tsShow: false, // 推送时的底部弹框
      // 用户审批时填写的意见
      dealForm: {
        portalQaId: this.$route.query.portalQaId,
        portalQaApproveResult: "", // 审批意见
        portalQaApproveContent: "", // 审批内容
      },
      selectlist: [
        { key: "1", value: "同意" },
        { key: "0", value: "拒绝" },
      ],
    };
  },
  created() {
    this.setTransitionName('slide-right')
    // 推送进来的
      let portalQaId = this.getquerystring('portalQaId')
      if (portalQaId && this.$route.query.hasOwnProperty('todoType')) {
        sessionStorage.setItem('isTui', true)
        hideWebViewTitle()
        //this.getinto(portalQaId)
        this.getApplyMsg()
        }
  },
  mounted() {
    //
  },
  methods: {
    ...mapMutations(['setTransitionName']),
    // 推送时底部弹框关闭并退出拉取jiemian
    tsClose() {
      closeWindow()
    },
    // 推送拉起时判断此流程状态
    getApplyMsg() {
      const params = { portalQaId: this.$route.query.portalQaId };
      ajaxGet(URL.url.getCharacterNeedDeptDealMsg, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            if (data =='' || data == null || data == 'null') {
               this.tsShow=true
               this.sheet('该申请单不存在！')
            } else if (data.portalQaApproveState != 0 && data.portalQaApproveState != null && data.portalQaApproveState != '') {
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
    // 审批意见发生改变时
    approveChange(key) {
      console.log(key);
      if (key == "1") {
        this.dealForm.portalQaApproveContent = "同意。";
      } else {
        this.dealForm.portalQaApproveContent = "";
      }
    },
    // 提交前校验
    beforeSubmit() {
      if (!this.dealForm.portalQaApproveResult) {
        this.actionSheetVisable = true;
        this.sheet("请选择审批意见");
        return;
      }
      if (!this.dealForm.portalQaApproveContent) {
        this.actionSheetVisable = true;
        this.sheet("请输入审批意见");
        return;
      }
      this.showConfirm = true;
      if (this.dealForm.portalQaApproveResult == "1") {
        this.sheet("你是否同意该条申请信息？");
      } else {
        this.sheet("你是否拒绝该条申请信息？");
      }
    },
    // 提交
    onSubmit() {
      const data = JSON.stringify(this.dealForm);
      ajaxPost(URL.url.getCharacterNeedDeptDeal, data)
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