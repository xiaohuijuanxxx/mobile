<template>
  <div v-touch:right="back">
    <Header
      :backoptions="backoptions"
      @tobackpage="back"
      title="需求申请详情"
    />
    <UserInfoComn :isNeedInterFace="isNeedInterFace" :path="path" :cs="cs" />
    <group>
      <group-title slot="title" class="myGroupTit midFontSize"
        >需求详情</group-title
      >
      <x-textarea
        class="label_color"
        title="需求名称"
        readonly
        v-model="dataForm.dataManualTitle"
      ></x-textarea>
      <x-input
        class="label_color"
        title="申请类型"
        readonly
        v-model="dataForm.dataManualType"
      ></x-input>
      <x-input
        class="label_color"
        title="业务类型"
        readonly
        v-model="dataForm.dataReqType"
      ></x-input>
      <x-input
        class="label_color"
        title="使用频率"
        readonly
        v-model="dataForm.dataManualRate"
      ></x-input>
      <x-input
        class="label_color"
        title="使用期限"
        readonly
        v-model="dataForm.dataManualDate"
      ></x-input>
      <x-textarea
        class="label_color"
        title="相关备案"
        readonly
        :rows='judgeLength(dataForm.dataRecodeId) ? dataForm.dataRecodeId/13 : 2'
        v-model="dataForm.dataRecodeId"
      ></x-textarea>
      <x-textarea
        :style='fourBan'
        :rows='judgeLength(dataForm.dataManualReason) ? dataForm.dataManualReason/13 : fourBanRows'
        :class="[dataForm.dataManualReason.length > 13 ? 'duiqi-between' : '','label_color','special-hei'] "
        title="申请原因"
        readonly
        v-model="dataForm.dataManualReason"
      ></x-textarea>
      <x-textarea
        title="具体内容"
        readonly
        :style='fourBan'
        :rows='judgeLength(dataForm.dataManualContext) ? dataForm.dataManualContext/13 : fourBanRows'
        :class="[dataForm.dataManualContext.length > 13 ? 'duiqi-between' : '','label_color','special-hei'] "
        v-model="dataForm.dataManualContext"
      ></x-textarea>
      <div class="my-cell" v-show="dataForm.dataManualFile != ''">
        <p class="minFontSize fj">附件</p>
        <p
          style="color: blue"
          v-for="(item, index) in dataForm.dataManualFile"
          :key="index"
          @click="toDetail(item)"
        >
          {{ item.fileName }}
        </p>
      </div>
    </group>
    <div class="tishi-msg" style="padding-top:10px;" v-if="this.$route.query.node < 2">
      <el-checkbox v-model="isAgree" style="display:flex;white-space:pre-wrap;" disabled>需求申请部门承诺对录入信息的真实性、准确性、及时性和完整性负责。</el-checkbox>
    </div>
    <group>
      <group-title slot="title" class="myGroupTit midFontSize"
        >审批
          <span style="font-size:0.3rem;padding-left:0.5rem;color:gray">审批意见请点击查看<img style="width: 4.5%;vertical-align: sub;" src="static/mydown.png" /></span>
        </group-title>
    </group>
    <!-- /////////////////////////////////////////////////////////////////////////// -->
    <flow orientation="vertical" class="flowtitlecss" :style="flowm">
      <template v-for="(i, index) in dealSpeedList">
        <flow-state
          :state="index + 1"
          :class="{refuse : dealSpeedList[index].approveStatus == 2 ? true : false}"
          :title="gsh(i)"
          :is-done="i.isDone"
          :key="index"
          @click.native="resultBt(dealSpeedList[index].approveResult)"
        ></flow-state>
        <flow-line
          v-if="index != dealSpeedList.length - 1"
          :is-done="i.lineDone"
          :key="index"
        ></flow-line>
      </template>
    </flow>
    <!-- ////////////////////////////////////////////////////////////////////////// -->
    <!-- 需求申请审批人模块 -->
    <!-- <flow orientation="vertical" class="flowtitlecss" :style="flowm">
      <flow-state
        v-if="dealSpeedList.length > 0"
        state="1"
        :title="
          gsh(dealSpeedList[0].name) +
          dealSpeedList[0].deptName +
          dealForm.approveResult
        "
        :is-done="!!(Number(dealSpeedList[0].approveStatus) > 1)"
      ></flow-state>
      <flow-line
        v-if="dealSpeedList.length > 1"
        :is-done="!!(Number(dealSpeedList[1].approveStatus) > 1)"
        :line-span="15"
      ></flow-line>
      <flow-state
        v-if="dealSpeedList.length > 1"
        state="2"
        :title="
          gsh(dealSpeedList[1].name) +
          dealSpeedList[1].deptName +
                    dealForm.approveResult

        "
        :is-done="!!(Number(dealSpeedList[1].approveStatus) > 1)"
      ></flow-state>
      <flow-line
        v-if="dealSpeedList.length > 2"
        :is-done="!!(Number(dealSpeedList[2].approveStatus) > 1)"
        :line-span="15"
      ></flow-line>
      <flow-state
        v-if="dealSpeedList.length > 2"
        state="3"
        :title="
          gsh(dealSpeedList[2].name) +
          dealSpeedList[2].deptName +
                    dealForm.approveResult

        "
        :is-done="!!(Number(dealSpeedList[2].approveStatus) > 1)"
      ></flow-state>
      <flow-line
        v-if="dealSpeedList.length > 3"
        :is-done="!!(Number(dealSpeedList[3].approveStatus) > 1)"
        :line-span="15"
      ></flow-line>
      <flow-state
        v-if="dealSpeedList.length > 3"
        state="4"
        :title="
          gsh(dealSpeedList[3].name) +
          dealSpeedList[3].deptName +
          dealForm.approveResult
        "
        :is-done="!!(Number(dealSpeedList[3].approveStatus) > 1)"
      ></flow-state>
      <flow-line
        v-if="dealSpeedList.length > 4"
        :is-done="!!(Number(dealSpeedList[4].approveStatus) > 1)"
        :line-span="15"
      ></flow-line>
      <flow-state
        v-if="dealSpeedList.length > 4"
        state="5"
        :title="
          gsh(dealSpeedList[4].name) +
          dealSpeedList[4].deptName +
          dealForm.approveResult

        "
        :is-done="!!(Number(dealSpeedList[4].approveStatus) > 1)"
      ></flow-state>
    </flow> -->
    <!-- //////////////////////////////////////////////////////////////////////////// -->
    <group v-if="this.$route.query.status == 2 || this.$route.query.status == 3">
      <x-textarea
        title="反馈详情"
        readonly
        :style='fourBan'
        :rows='judgeLength(dataForm.feedback) ? dataForm.feedback/13 : fourBanRows'
        :class="[dataForm.feedback.length > 13 ? 'duiqi-between' : '','label_color','special-hei'] "
        v-model="dataForm.feedback"
      ></x-textarea>
      <x-textarea
        title="审批意见"
        readonly
        class="label_color"
        :rows='2'
        v-model="lastback"
      ></x-textarea>
    </group>
    <!-- 完结是3  退回是2 -->
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
        <div
        style="position:relative;"
           v-if="
           dealForm.approveOption != '0' &&
            ((this.$route.query.node == 3 && isNode3Dept) ||
            this.$route.query.node == 4)
          "
        >
         <x-input
          title="部门负责人"
          class="my-clear-position"
          v-model="deptPeople"
          placeholder="请选择"
          direction="rtl"
        ></x-input>
        <div
            class="input-zhe"
            @click="
              (showselcet = true), (isDeal = false)
            "
          ></div>
          <!-- <div calss="close-par" @click="clearInput(false)"></div> -->
          <x-icon
            @click.native="clearInput(false)"
            type="ios-close"
            class="my-close"
            size="15"
          ></x-icon>
        </div>
        <div v-if="this.$route.query.node == '3'" class="tishi-msg" style="padding-bottom:10px;">可转至他人处理或选择部门负责人结束本流程。</div>
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
        height="100%"
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
        dataManualTitle: "",
        dataManualType: "",
        dataReqType: "",
        dataManualRate: "",
        dataManualDate: "",
        dataManualReason: "",
        dataManualContext: "",
        dataManualFile: [],
        feedback: '',
        dataRecodeId:''
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
      },
      upPersonDealMesg: ''
    };
  },
  created() {
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
       if (this.$route.query.dataManualUserId) {
        this.isNeedInterFace = true;
        this.path = "getApplyerInfo";
        this.cs = { userId: this.$route.query.dataManualUserId };
      } else if (this.$route.query.data) {
         this.isNeedInterFace = true;
         this.path = "getCharacterIssueApplyInfo";
         this.cs = { userName: this.$route.query.userName };
     }
    }
  },
  mounted() {
    this.lastback = this.$route.query.status == '3' ? '同意   ' : '驳回   ';
    if (!this.$route.query.hasOwnProperty("todoType")) {
      this.getDealSpeed();
      this.getApplyWriteMsg();
    }
  },
  methods: {
    gsh(i) {
      // 格式化审批人栏信息
      let text = `${i.username ? i.name+'/'+i.username : ''}`;
      return `${i.node} ${text}`
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
    getWpsFile(ul,fileId){
      let uesr = JSON.parse(sessionStorage.getItem("currentUser"))
      const parmas = {
        userName:user.username,
        name : encodeURIComponent(user.name),
        fileId: fileId,
        httpFileUrl:ul
      }
      aiaxGet(URL.url.getWpsFile,parmas)
      .then((res)=>{
        if(res.data.data != "" && res.data.data != null && res.data.data != "null"){
          MXCommon.openUrlPage(res.data.data)
        }
      }).catch((error)=>{
        let omsg= this.outmsg(error)
        this.closeloading()
        if(!omsg){
          return
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
            this.dealForm.nextUser = ''
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
        dataManualId: this.$route.query.dataManualId,
        id: this.$route.query.id,
        node: this.$route.query.node
      };
      ajaxGet(URL.url.judgeManualStatus, params)
        .then((res) => {
          // if (res.data.data != null && res.data.data != "") {
          let {
            data: { data, code },
          } = res;
          if (data === "" || data == null || data == "null") {
            this.tsShow = true;
            this.sheet("该申请单不存在！");
          } else if (data) {
            this.getinto();
          } else {
            this.tsShow = true;
            this.sheet("该申请单已审批！");
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
          let ResultList = []
          localStorage.setItem('result',this.upPersonDealMesg)
        } else {
          this.dealForm.approveResult = "同意。";
        }
      } else {
        this.dealForm.approveResult = "";
      }
    },
    // 审批意见点击展示
    resultBt(i){
      if(!i){
        // alert('审批中···')
      }else {
        this.$vux.alert.show({
          title:'审批意见',
          content: `${i}`
        })
      }
    },
    // 获取审批人栏信息
    getDealSpeed() {
      const params = { dataManualId: this.$route.query.dataManualId };
      let url = ''
      if (this.$route.query.status == 2 || this.$route.query.status == 3) {
          url = URL.url.getDealSpeedOut
      } else {
          if (this.$route.query.node == '1') {
              url = URL.url.getDealSpeedOut
          } else {
              url = URL.url.getDealSpeedIn
          }
      }
      ajaxGet(url, params)
        .then((res) => {
          if (res.data) {
            let {
              data: { data, code },
            } = res;
            this.dealSpeedList = data;
            this.resultList = res.data.data
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
      const params = { dataManualId: this.$route.query.dataManualId };
      ajaxGet(URL.url.getManualWriteInfo, params)
        .then((res) => {
          let {
            data: { data, code },
          } = res;
          if (data.dataManualFile) {
            data.dataManualFile = JSON.parse(data.dataManualFile);
          } else {
            data.dataManualFile = [];
          }
          this.dataForm = data;
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
          if (!this.dealPeople && !this.deptPeople && this.$route.query.node == 3) {
              this.actionSheetVisable = true;
              this.sheet("请选择审批人。");
              return;
          }
          if (!this.deptPeople && this.$route.query.node == '4') {
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
      this.dealForm.dataManualId = this.$route.query.dataManualId;
      let data = JSON.stringify(this.dealForm);
      ajaxPost(URL.url.dealManual, data)
        .then((res) => {
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
        this.dealForm.nextUser = data[0].username;
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
    .refuse .weui-wepay-flow__state{ 
    background: rgb(238, 68, 68) !important;
  }
</style>
