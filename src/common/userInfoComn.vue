<template>
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
</template>
<script>
import { ajaxGet } from '../core/mxApi';
const URL = require("@/dataPass/asssets/Api/api");
import minxin from "@/common/commonfunction.js";
export default {
    props: {
        cs: {
            type: Object,
            default: {}
        },
        path: {
            type: String,
            default: ''
        },
        isNeedInterFace: {
          type: Boolean,
          default: true
        }
    },
    mixins: [minxin],
    data() {
        return {
            // 申请人个人信息
            userInfo: {
                name: "",
                username: "",
                orgName: "",
                deptName: "",
                telephone: "",
                mobile: '',
                email: "",
            }
        }
    },
    mounted() {
        if (!this.isNeedInterFace) {
          this.userInfo = JSON.parse(sessionStorage.getItem("currentUser"))
        } else {
          this.getApplyInfo()
        }
    },
    watch: {
        cs: {
          handler(val) {
            if (this.isNeedInterFace) {
            this.getApplyInfo()
            }
          },
          deep: true
        },
    },
    methods: {
        // 获取申请人 个人信息
        getApplyInfo() {
        // const params = { userName: userName };
        ajaxGet(URL.url[this.path], this.cs)
            .then((res) => {
            if (res.data.data) {
                this.userInfo = res.data.data
                this.closeloading();
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
    }
}
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
</style>