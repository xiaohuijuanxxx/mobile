<template>
  <div
    style="height: 100%; width: 97%"
    :class="[isCli ? 'isClick' : '']"
    @touchmove.prevent
  >
    <group-title class="titlecss">
      <div @click="okdata(0)">取消</div>
      <div @click="okdata(1)">完成</div>
    </group-title>
    <span @click="inputCli">
      <input
        placeholder="请输入搜索条件"
        v-model="invaule"
        ref="tempFocus"
        class="fisrtinput"
        @blur="isCli = false"
      />
    </span>
    <picker
      :data="tabledatau"
      v-model="valueed"
      style="margin-right: -0.2rem"
    ></picker>
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
  </div>
</template>
<script>
let URL = require("@/dataPass/asssets/Api/api");
import minxin from "./commonfunction.js";
import { ajaxGet } from "../core/mxApi";
import { mapState } from 'vuex';
export default {
  props: {
    valueed: {
      type: Array,
      default: [],
    },
    type: {
      type: String,
      default: "require",
    },
  },
  computed: {
     ...mapState({
        characterApplyPersonDeptId: state => state.characterApplyPersonDeptId,
      }),
  },
  mixins: [minxin],
  mounted() {
    this.isCli = false;
    //选择人的接
    if (this.$store.state.ssoToken) {
      if(this.type === 'currentDept' || this.type === 'currentDeptLeader') {
        this.getCurrentDept()
      } else if (this.type === "require") {
        this.getdata();
      } else if (this.type === "character" || this.type === "issueHandlerLeader" || this.type === 'officeInter' || this.type === 'issueHandlerInterface') {
        this.getCharacter();
      }
    }
  },
  watch: {
    invaule(input) {
      let reg1 = /^[\u4e00-\u9fa5]+$/,
        reg2 = /\d{6,8}/;
      let test1 = reg1.test(input),
        test2 = reg2.test(input);
      if (test1 || test2) {
        let newlist = this.tabledata[0].filter((e, index, self) => {
          return e.name.indexOf(input) > -1;
        });
        this.tabledatau = [newlist];
        this.valueed = [];
      } else if (!input) {
        this.tabledatau = this.tabledata;
      }
    },
    "$store.state.ssoToken": {
      handler(newval, oldval) {
        if (newval) {
          if(this.type === 'currentDept' || this.type === 'currentDeptLeader') {
            this.getCurrentDept()
          } else if (this.type === "require") {
            this.getdata();
          } else if (this.type === "character" || this.type === "issueHandlerLeader" || this.type === 'officeInter' || this.type === 'issueHandlerInterface') {
            this.getCharacter();
          }
        }
      },
    },
  },
  methods: {
    // 输入框被点击
    inputCli() {
      //this.isCli = true
      this.$refs.tempFocus.focus();
      this.$emit("inputCli");
    },
    getCharacter() {
      let roleSign = ''
      if (this.type === "character") {
        roleSign = "portalQaDeal"
      } else if (this.type === "issueHandlerLeader") {
        roleSign = "dwpDataDealLeader"
      } else if (this.type === 'officeInter') {
        roleSign = "dwpDataDeal" // dwpDataManage
      } else if (this.type === 'issueHandlerInterface') {
        roleSign = "dwpDataDeal"
      }
      let params = { 'roleSign':roleSign }
      this.showloading();
      ajaxGet(URL.url.getListByRoleType, params)
        .then((rk) => {
          if (rk.data.data != null && rk.data.data != '') {
            let tabledatao = [];
          rk.data.data.forEach((item) => {
            tabledatao.push({
              name: `${item.name}/${item.username}`,
              value: JSON.stringify(item),
            });
          });
          this.tabledata = this.tabledatau = [tabledatao];    
          }
          this.closeloading();
        })
        .catch((err) => {
          const omsg = this.outmsg(err);
          this.closeloading();
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
    getdata() {
      let _this = this;
      _this.showloading();
      ajaxGet(URL.url.getall)
        .then((rk) => {
          let tabledatao = [];
          rk.data.forEach((item) => {
            tabledatao.push({
              name: `${item.name}/${item.username}`,
              value: JSON.stringify(item),
            });
          });
          _this.tabledata = _this.tabledatau = [tabledatao];
          _this.closeloading();
        })
        .catch((err) => {
          const omsg = _this.outmsg(err);
          _this.closeloading();
          if (!omsg) {
            return;
          }
          _this.actionSheetVisable = true;
          _this.sheet(omsg);
        });
    },
    getCurrentDept() {
      let _this = this;
      _this.showloading();
      let params = {'deptId': this.characterApplyPersonDeptId}
      ajaxGet(URL.url.getCurrentUserDeptMsg, params)
        .then((rk) => {
          let tabledatao = [];
          if (this.type === 'currentDeptLeader') {
            rk.data.data.parentList.forEach((item) => {
            tabledatao.push({
              name: `${item.userName}/${item.userNum}`,
              value: JSON.stringify(item),
            });
          });
          } else {
            rk.data.data.list.forEach((item) => {
            tabledatao.push({
              name: `${item.userName}/${item.userNum}`,
              value: JSON.stringify(item),
            });
          });
          }
          _this.tabledata = _this.tabledatau = [tabledatao];
          _this.closeloading();
        })
        .catch((err) => {
          const omsg = _this.outmsg(err);
          _this.closeloading();
          if (!omsg) {
            return;
          }
          _this.actionSheetVisable = true;
          _this.sheet(omsg);
        });
    },
    okdata(data) {
      if (data == 1) {
        let values = JSON.parse(this.valueed);
        this.$emit("changeselect", [values]);
      }
      this.invaule = "";
      this.$emit("cancal");
    },
  },
  data() {
    return {
      invaule: "",
      tabledata: [],
      tabledatau: [],
      isCli: false,
    };
  },
};
</script>
<style lang="less">
.titlecss {
  display: flex;
  padding-top: 0.34rem;
  height: 0.3rem;
  div:first-child {
    width: 50%;
    text-align: left;
    font-size: 0.4rem;
    color: black;
  }
  div:last-child {
    width: 50%;
    text-align: right;
    font-size: 0.4rem;
    color: black;
  }
}
.fisrtinput {
  width: 100%;
  height: 0.8rem;
  margin: 0 0.1rem;
  border: none;
  font-size: 0.4rem;
}
.isClick {
  padding-top: 0.5rem;
}
</style>