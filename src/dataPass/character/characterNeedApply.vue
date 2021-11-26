<template>
  <div style="margin-top: 50px;height:100%" v-touch:right="back">
    <Header :backoptions="backoptions" @tobackpage="back" title="特色需求审批详情" />
    <CharacterCommon :isApplyUser="true" />
     <actionsheet v-model="tsShow" :menus="menusall" @on-click-menu-delete="tsClose" :close-on-clicking-mask='false'></actionsheet>
  </div>
</template>
<script>
import Header from "@/common/header.vue";
import minxin from "@/common/commonfunction.js";
import { ajaxGet, ajaxPost, ajaxtokenPost, hideWebViewTitle, closeWindow } from "../../core/mxApi";
import Bus from "@/bus/bus";

const URL = require("../asssets/Api/api");
import CharacterCommon from "../character/characterCommon";
export default {
  components: {
    Header,
    CharacterCommon
  },
  mixins: [minxin],
  data() {
    return {
      tsShow: false, // 推送时的底部弹框
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
    }
  },
  created() {
    // 推送进来的
      let portalQaId = this.getquerystring('portalQaId')
      if (portalQaId && this.$route.query.hasOwnProperty('todoType')) {
        sessionStorage.setItem('isTui', true)
        hideWebViewTitle()
        this.getApplyMsg()
      }
  },
  methods: {
      // 返回
    back() {
      if (sessionStorage.getItem('isTui')) {
         this.pushLoginOut()
          return;
      }
      // this.$router.push({ path: "/myApproval" });
      this.$router.go(-1)
    },
    // 推送时底部弹框关闭并退出拉取jiemian
    tsClose() {
      closeWindow()
    },
    // 推送拉起时判断此流程状态
    getApplyMsg() {
      const params = { portalQaId: this.$route.query.portalQaId };
      ajaxGet(URL.url.getCharacterNeedApplyMsg, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            if (data =='' || data == null || data == 'null') {
               this.tsShow=true
               this.sheet('该申请单不存在！')
            } else {
              this.getinto()
            }
            // else {
            //    this.tsShow=true
            //    this.sheet('此流程请在PC端处理')
            //    return
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
  }
}
</script>
