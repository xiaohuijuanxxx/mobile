<template>
  <div style="height:100%;" v-touch:right="back">
    <Header
      :backoptions="backoptions"
      @tobackpage="back"
      title="备案申请详情"
    />
    <UserInfoComn :isNeedInterFace="isNeedInterFace" :path="path" :cs="cs" />
    <group>
      <group-title slot="title" class="myGroupTit midFontSize"
        >备案申请详情</group-title
      >
      <x-textarea
        class="label_color"
        title="数据主题"
        readonly
        v-model="dataForm.dataRecordTitle"
      ></x-textarea>
      <x-input
        class="label_color"
        title="录入及使用频率"
        readonly
        v-model="dataForm.dataRecordRate"
      ></x-input>
      <x-input
        class="label_color"
        title="业务类型"
        readonly
        v-model="dataForm.dataRecordBustype"
      ></x-input>
      <x-input
        class="label_color"
        title="使用期限"
        readonly
        v-model="dataForm.dataRecordDate"
      ></x-input>
      <x-textarea
        title="具体内容"
        readonly
        :style='fourBan'
        :rows='judgeLength(dataForm.dataRecordContext) ? dataForm.dataRecordContext/13 : fourBanRows'
        :class="[dataForm.dataRecordContext.length > 13 ? 'duiqi-between' : '','label_color','special-hei'] "
        v-model="dataForm.dataRecordContext"
      ></x-textarea>
      <div class="my-cell" v-show="dataForm.dataRecordFile != ''">
        <p class="minFontSize fj">附件</p>
        <p
          style="color: blue"
          v-for="(item, index) in dataForm.dataRecordFile"
          :key="index"
          @click="openFile(item)"
        >
          {{ item.fileName }}
        </p>
      </div>
    </group>

    <group>
      <group-title slot="title" class="myGroupTit midFontSize"
        >审批
        <span style="font-size:0.3rem;padding-left:0.5rem;color:gray">审批意见请点击查看<img style="width: 4.5%;vertical-align: sub;" src="static/mydown.png" /></span>
      </group-title>
    </group>
    <flow orientation="vertical" class="flowtitlecss" :style="flowm">
      <template v-for="(i, index) in dealSpeedList">
        <flow-state
          :state="index + 1"
          :class="{refuse : dealSpeedList[index].approveStatus == 2 ? true : false}"
          :title="gsh(i)"
          :is-done="i.isDone"
          :key="index"
          @click.native="resultBtn(dealSpeedList[index].approveResult)"
        ></flow-state>
        <flow-line
          v-if="index != dealSpeedList.length - 1"
          :is-done="i.lineDone"
          :key="index"
        ></flow-line>
      </template>
    </flow>
    <group v-if="this.$route.query.status == 2 || this.$route.query.status == 3">
      <x-textarea
        title="反馈详情"
        readonly
        :style='fourBan'
        :rows='judgeLength(dataForm.feedback) ? dataForm.feedback/13 : fourBanRows'
        :class="[dataForm.feedback.length > 13 ? 'duiqi-between' : '','label_color','special-hei'] "
        v-model="dataForm.feedback"
      ></x-textarea>
      <x-textarea v-if="this.$route.query.status == '2' || this.$route.query.status == '3'"
        title="审批意见"
        readonly
        style="margin-bottom: 0.4rem;"
        class="label_color"
        :rows='1'
        v-html="lastback"
      ></x-textarea>
    </group>
    <div v-if="this.$route.query.status != 2 && this.$route.query.status != 3">
      <group>
        <div
        style="position:relative;"
          v-if="
          dealForm.approveOption != '0' && (
            this.$route.query.node == 2 ||
            (this.$route.query.node == 3 && isNode3Next))
          "
        >
          <x-input
            title="转处理人"
            v-model="dealPeople"
            class="my-clear-position"
            placeholder="请选择"
            direction="rtl"
            @click.native="(showselcet = true), (isDeal = true)"
          ></x-input>
          <div
            class="input-zhe"
            @click="
              (showselcet = true), (isDeal = true)
            "
          ></div>
          <!-- <div calss="close-par" @click="clearInput(true)"></div> -->
          <x-icon
          @click.native="clearInput(true)"
            type="ios-close"
            class="my-close"
            size="15"
          ></x-icon>
        </div>
        <!-- style="position:relative;"
           v-if="
           dealForm.approveOption != '0' &&
            ((this.$route.query.node == 3 && isNode3Dept) ||
            this.$route.query.node == 4)
          " -->
        <div
        style="position:relative;"
           v-if="
           dealForm.approveOption != '0' &&
            ((this.$route.query.node == 3 && isNode3Dept) )
          "
        >
         <!-- <x-input
          title="部门负责人"
          class="my-clear-position"
          v-model="deptPeople"
          placeholder="请选择"
          direction="rtl"
        ></x-input> -->
        <div
            class="input-zhe"
            @click="
              (showselcet = true), (isDeal = false)
            "
          ></div>
          <!-- <div calss="close-par" @click="clearInput(false)"></div> -->
          <!-- <x-icon
            @click.native="clearInput(false)"
            type="ios-close"
            class="my-close"
            size="15"
          ></x-icon> -->
        </div>
        <div v-if="this.$route.query.node == '3'" class="tishi-msg" style="padding-bottom:10px;"></div>
        <selector
          title="审批意见"
          class="mySel"
          v-model="dealForm.approveOption"
          :options="selectlist"
          direction="rtl"
          @on-change="approveChange"
          placeholder="请选择"
        ></selector>
        <MyTextarea
          placeholder="请输入审批意见"
          :content.sync="dealForm.approveResult"
        />
      </group>
      <flexbox style="margin-top: 1rem; padding-bottom: 1rem">
        <flexbox-item>
          <x-button type="warn" @click.native="beforeSubmit" style="width: 95%"
            >提交</x-button
          >
        </flexbox-item>
      </flexbox>
    </div>
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
    <div v-transfer-dom>
      <popup
        v-model="showselcet"
        position="bottom"
        height="98%"
        :hide-on-blur="false"
        style="position: absolute !impotant; z-index: 999"
      >
        <seclect
          type="require"
          :valueed="valueed"
          @changeselect="secletdata"
          @cancal="cancalback"
          @inputCli="inputCli"
        ></seclect>
      </popup>
    </div>
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
import UserInfoComn from "@/common/userInfoComn.vue";
import MyTextarea from "@/common/myTextarea.vue";
import {
  ajaxGet,
  ajaxPost,
  ajaxtokenPost,
  hideWebViewTitle,
  closeWindow,
} from "../../core/mxApi";
import { mapMutations } from 'vuex';
import seclect from "@/common/seclect.vue";
const URL = require("../asssets/Api/api");
import minxin from "@/common/commonfunction.js";
import { TransferDomDirective as TransferDom } from "vux";
import {Checkbox} from 'element-ui';
export default {
  directives: {
    TransferDom,
  },
  components: {
    Header,
    seclect,
    UserInfoComn,
    MyTextarea,
    Checkbox
  },
  mixins: [minxin],
  data() {
    return {
      lastback:'',
      resultList:[],
      font: null,
      fourBan: null,
      fourBanRows: 1,
      tsShow: false, // 推送时的底部弹框
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      actionSheetVisable: false,
      showConfirm: false, // 提交弹框
      selectlist: [
        { key: "1", value: "同意" },
        { key: "0", value: "拒绝" },
      ],
      dealPeople: "", // 处理人
      deptPeople: "", // 部门负责人
      isNode3Next: true, // 若为第三节点部门负责人 与 下一节点处理人 只能二选一 为互斥关系
      isNode3Dept: true, // 若为第三节点部门负责人 与 下一节点处理人 只能二选一 为互斥关系
      valueed: [],
      showselcet: false, // 选啧负责人弹框
      cs: null, // 子组件请求所需参数
      path: "", // 子组件请求路劲
      isNeedInterFace: false,
      dealSpeedList: [], // 审批人栏信息
      flowm: null, // 审批人栏高度
      isAgree: true,
      dataForm: {
        dataRecordTitle: "",
        dataRecordBustype: "",
        dataReqType: "",
        dataRecordRate: "",
        dataRecordDate: "",
        dataRecordReason: "",
        dataRecordContext: "",
        dataRecordFile: [],
        feedback: '',
        dataRecodeId:'',
        dataRecordTime: "",
      },
      dealForm: {
        approveOption: "",
        approveResult: "",
        nextUser: "",
        leadUser: "",
        id: "",
        node: "",
        userName: "",
        dataManualId: "",
        dataRecordId: ""
      },
      upPersonDealMesg: ''
    };
  },
  created() {
    this.setTransitionName('slide-right')
    let font = document.body.style.getPropertyValue('--minSize').trim();
    if (font === '') {
      font = '0.36rem'
    }
    font = font.slice(0, font.indexOf('r'))
    this.font = Number(font)
    this.fourBanRows = (Number(font)) * 5.5 * 3
    this.fourBan = `max-height:${(Number(font)) * 5.5}rem;overflow:hidden;`;
    if (this.$route.query.hasOwnProperty("todoType")) {
      sessionStorage.setItem("isTui", true);
      hideWebViewTitle();
      this.judgeApplyMsg();
    } else {
       if (this.$route.query.dataRecordUserId) {
        this.isNeedInterFace = true;
        this.path = "getApplyerInfo";
        this.cs = { userId: this.$route.query.dataRecordUserId };
      } else if (this.$route.query.data) {
         this.isNeedInterFace = true;
         this.path = "getCharacterIssueApplyInfo";
         this.cs = { userName: this.$route.query.userName };
     }
    }
  },
  mounted() {
    this.lastback = this.$route.query.status == '3'
      ? `<span style="color:grey;margin-right:4rem">审批意见</span>
      同意`
      : `<span style="color:grey;margin-right:4rem">审批意见</span>
      驳回`;
    if (!this.$route.query.hasOwnProperty("todoType")) {
      this.getDealSpeed();
      this.getApplyWriteMsg();
    }
  },
  methods: {
    ...mapMutations(['setTransitionName']),
    gsh(i) {
      // 格式化审批人栏信息
      let text = `${i.userName ? i.name+'/'+i.userName : ''}`;
      return `${i.node} ${text}`
    },
    openFile(item) {
       let ul = URL.url.downApplyFile + item.fileUrl;
      // MXCommon.download(ul)
      this.getWpsFile(ul, item.fileId);
      //  MXCommon.openFile({
      //    url: ul,
      //    onSuccess: function() { },
      //    onFail: function(err) {
           
      //    }
      // })
    },
    getWpsFile(ul, fileId) {
      let user = JSON.parse(sessionStorage.getItem("currentUser"));
      const params = {
        userName: user.username,
        name: encodeURIComponent(user.name),
        fileId: fileId,
        httpFileUrl: ul
      }
       ajaxGet(URL.url.getWpsUrl, params)
        .then((res) => {
          if (
            res.data.data != "" &&
            res.data.data != null &&
            res.data.data != "null"
          ) {
            //window.open(res.data.data, '_blank')
            //MXCommon.download(res.data.data);
            MXCommon.openUrlPage(res.data.data)
          }
      }).catch(error => {
        let omsg = this.outmsg(error);
          this.closeloading();
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
      })
    },
      // 推送时底部弹框关闭并退出拉取jiemian
    tsClose() {
      closeWindow();
    },
    ////////////////////////////////////////////////////////////////////////////////////////
    // 敏行查看附件
    toDetail(item) {
      // let ul = URL.url.downApplyFile + item;
      // MXCommon.download(ul)
      const params = {fileId: item.fileId}
      ajaxGet(URL.url.getFileUrl,params)
       .then((res)=>{
         if(res.data.data != "" && res.data.data != null && res.data.data != "null" )
            {
              let ul = URL.url.downApplyFile + res.data.data.fileUrl;
              this.getWpsFile(ul,item.fileId)
            } else {
              this.actionSheetVisable = true
              this.sheet("该文件不存在")
            }
       })
       .catch((error)=>{
         let omsg = this.outmsg(error)
         this.closeloading()
         if(!omsg){
           return;
         }
         this.actionSheetVisable = true
         this.sheet(omsg)
       })
    },
    //////////////////////////////////////////////////////////////////////////
       // 清除更改处理人此项选择
    clearInput(val) {
        if (val) {
            this.dealPeople = ''
            this.dealForm.leadUser = ''
            this.isNode3Dept = true
        } else {
            this.deptPeople = ''
            this.dealForm.leadUser = ''
            this.isNode3Next = true
        }
    },
    judgeApplyMsg() {
      // let todoType = this.$route.query.todoType;
      const params = {
        dataRecordId: this.$route.query.dataRecordId,
        id: this.$route.query.id,
        node: this.$route.query.node
      };
      ajaxGet(URL.url.checkDataRecordStatus, params)
        .then((res) => {
          // if (res.data.data != null && res.data.data != "") {
          let {
            data: { data, code },
          } = res;
          if (data === "" || data == null || data == "null") {
            this.tsShow = true;
            this.sheet("该流程单不存在！");
          } else if (data) {
            this.getinto();
          } else {
            this.tsShow = true;
            this.sheet("该流程单已审批！");
          }
          // }
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
                // Bus.$emit("startShowIssue");
                // if (this.$route.query.status != 2) {
                  this.isNeedInterFace = true;
                  this.path = "getCharacterIssueApplyInfo";
                  this.cs = { userName: this.$route.query.userName };
                // }
                this.getDealSpeed();
                this.getApplyWriteMsg();
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
      if (sessionStorage.getItem("isTui")) {
        this.pushLoginOut();
        return;
      }
      this.$router.go(-1)
      // this.$router.push({ path: "/myApproval" });
    },
    approveChange(key) {
      if (key == "1") {
        if (this.upPersonDealMesg) {
          this.dealForm.approveResult = this.upPersonDealMesg
        } else {
          this.dealForm.approveResult = "同意。";
        }
      } else {
        this.dealForm.approveResult = "";
      }
    },
    resultBtn(i){
      if(i){
        this.$vux.alert.show({
          title:'审批意见',
          content: `${i}`
        })
      }else{
        // alert('审批中···')
      }
    },
    // 获取审批人栏信息
    getDealSpeed() {
      const params = { dataRecordId: this.$route.query.dataRecordId };
      let url = ''
      if (this.$route.query.status == 2 || this.$route.query.status == 3) {
          url = URL.url.getApproveOut
      } else {
          if (this.$route.query.node == '1') {
              url = URL.url.getApproveOut
          } else {
              url = URL.url.getApproveIn
          }
      }
      ajaxGet(url, params)
        .then((res) => {
          this.resultList = res.data.data
          if (res.data) {
            let {
              data: { data, code },
            } = res;
            this.dealSpeedList = data;
            console.log(111,this.dealSpeedList);
            if (this.$route.query.node >= 3) {
              this.upPersonDealMesg = (data[data.length - 2]).approveResult
              this.dealForm.approveResult = (data[data.length - 2]).approveResult
            }
            if (data.length > 1) {
              this.flowm = `height:${(Number(data.length) - 1) * 0.75}rem;`;
            }
            if (this.dataForm.isAgree == 'true') {
              this.dataForm.isAgree = true
            }
            // this.flowm=`height:${(Number(data.length)-1)*0.75}rem;`
            this.dealSpeedList.forEach((item) => {
              if (item.status === "待处理" || item.status === "处理中") {
                item.isDone = false;
                item.lineDone = false;
              } else {
                item.isDone = true;
                item.lineDone = true;
              }
            });
            console.log(this.dealSpeedList[1].approveStatus);
          }
        })
        .catch((error) => {
          let omsg = this.outmsg(error);
          this.closeloading();
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
    getApplyWriteMsg() {
      const params = { dataRecordId: this.$route.query.dataRecordId,
                        todoPara: this.$route.query.todoPara,
                        todoFlag: this.$route.query.todoFlag };
      ajaxGet(URL.url.getMobileOne, params)
        .then((res) => {
          let {
            data: { data, code },
          } = res;
          if (data.dataRecordFile) {
            data.dataRecordFile = JSON.parse(data.dataRecordFile);
          } else {
            data.dataRecordFile = [];
          }
          this.dataForm = data;
          console.log(this.dataForm);
          for(let item in this.dataForm){
              if (this.dataForm[item].length > 52) {
                if (this.font == 0.44) {
                  this.dataForm[item] = `${this.dataForm[item]}\n\n\n`
                } else if (this.font == 0.40) {
                  this.dataForm[item] = `${this.dataForm[item]}\n\n`
                } else {
                  this.dataForm[item] = `${this.dataForm[item]}\n`
                }
              }
            }
        })
        .catch((error) => {
          let omsg = this.outmsg(error);
          this.closeloading();
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
    beforeSubmit() {
      if (this.dealForm.approveOption == "") {
        this.actionSheetVisable = true;
        this.sheet("请选择审批意见。");
        return;
      }
      if (Number(this.dealForm.approveOption)) {
          if (!this.dealPeople && this.$route.query.node == '2') {
              this.actionSheetVisable = true;
              this.sheet("请选择下一节点审批人。");
              return;
          }
      }
       if (!this.dealForm.approveResult) {
         this.actionSheetVisable = true;
         this.sheet("请输入审批意见。");
         return;
       }
      this.showConfirm = true;
      if (this.dealForm.approveOption == "1") {
        this.sheet("你是否同意该条申请信息？");
      } else {
        this.sheet("你是否拒绝该条申请信息？");
      }
    },
    onSubmit() {
      this.dealForm.id = this.$route.query.id;
      this.dealForm.node = this.$route.query.node;
      this.dealForm.userName = JSON.parse(
        sessionStorage.getItem("currentUser")
      ).username;
      this.dealForm.dataRecordId = this.$route.query.dataRecordId;
      let data = JSON.stringify(this.dealForm);
      // alert(data)
      ajaxPost(URL.url.getRecordApproveDeal, data)
        .then((res) => {
          this.setTransitionName('')
          this.$router.push({ name: "approvalFinish" });
        })
        .catch((error) => {
          let omsg = this.outmsg(error);
          this.closeloading();
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
    // 选择审批人 弹框相关事件开始
    secletdata(data) {
      if (this.isDeal) {
        this.dealPeople = `${data[0].name}/${data[0].username}`;
        this.dealForm.leadUser = data[0].username;
        this.isNode3Dept = false
      } else {
        this.deptPeople = `${data[0].name}/${data[0].username}`;
        this.dealForm.leadUser = data[0].username;
        this.isNode3Next = false
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
/deep/.refuse .weui-wepay-flow__state{ 
  background: rgb(238, 68, 68) !important;
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
.tishi-msg{width:92%;margin:0 auto;font-size:0.26rem;
/deep/ .el-checkbox__label {
  color:#666666 !important;
  font-size:0.26rem;
}
}
.my-close{position:absolute;right:10px;top:50%;transform:translateY(-50%);}
.input-zhe{position:absolute;left:140px;top:0;bottom:0;width:55%;}
.my-clear-position{
  /deep/ .weui-input{width:93%;text-align:right;}
  /deep/ .weui-icon-clear{display:none !important;}
}
.vux-x-icon{fill:#b2b2b2;}
// 附件样式
.my-cell {
  margin-left: 16px;
  padding-top: 10px;
  padding-bottom: 10px;
  border-top: 0.5px solid #d9d9d9;
  .fj {
    color: #999999;
  }
}
.duiqi-between{
  /deep/ .weui-textarea {
    text-align: justify;
    white-space:pre-wrap;
    word-break:break-all;
  }
  }
  .special-hei{
    /deep/ .weui-textarea {
      height: auto !important;
    }
  }
</style>
