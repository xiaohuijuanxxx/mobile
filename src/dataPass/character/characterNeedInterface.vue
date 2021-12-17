<template>
  <div style="margin-top: 50px;height:100%" v-touch:right="back">
    <Header :backoptions="backoptions" @tobackpage="back" title="特色需求审批详情" />
     <actionsheet v-model="tsShow" :menus="menusall" @on-click-menu-delete="tsClose" :close-on-clicking-mask='false'></actionsheet>
  </div>
</template>
<script>
import Header from "@/common/header.vue";
import { mapMutations } from 'vuex';
import minxin from "@/common/commonfunction.js";
import { ajaxGet, ajaxPost, ajaxtokenPost, hideWebViewTitle, closeWindow } from "../../core/mxApi";

const URL = require("../asssets/Api/api");
export default {
  components: {
    Header
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
    ...mapMutations(['setTransitionName']),
      // 返回
    back() {
      if (sessionStorage.getItem('isTui')) {
        this.pushLoginOut()
        return;
        //Bus.$emit('refesh')
      }
      this.setTransitionName('slide-right')
      // this.$router.push({ path: "/myApproval" });
        this.$router.go(-1)
    },
    // 推送时底部弹框关闭并退出拉取jiemian
    tsClose() {
      closeWindow()
    },
    // 推送拉起时判断此流程状态
    getApplyMsg() {
      let todoType = this.$route.query.todoType
      const params = { portalQaId: this.$route.query.portalQaId };
      ajaxGet(URL.url.getCharacterNeedInterfaceDealMsg, params)
        .then((res) => {
          if (res.data.data != null && res.data.data != "") {
            let {
              data: { data, code },
            } = res;
            if (data =='' || data == null || data == 'null') {
               this.tsShow=true
               this.sheet('该申请单不存在！')
            } else if (data.portalQaManageState != 0 && data.portalQaManageState != null && data.portalQaManageState != '' && (todoType == '604' || todoType == '606')) {
              this.tsShow = true
              this.sheet('该申请单已审批！')
            } else if (data.portalQaManageState != 5 && data.portalQaManageState != null && data.portalQaManageState != '' && todoType == '605') {
              this.tsShow = true
              this.sheet('该申请单已审批！')
            } else {
               this.tsShow=true
               this.sheet('此流程请在PC端处理')
               return
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
