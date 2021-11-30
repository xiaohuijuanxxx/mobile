<template>
  <div :style="{ 'padding-bottom': isTextArea ? jpHeight : '0' }" v-touch:right="tobackpage">
    <!-- <x-header :left-options="backoptions" @on-click-back="tobackpage" class="cjHeader headerFixed">需求审批详情</x-header> -->
    <!-- <Header :backoptions="backoptions" @tobackpage='tobackpage' title="需求审批详情" />     -->
    <Header
      :backoptions="backoptions"
      @tobackpage="tobackpage"
      title="需求审批详情"
    />
    <group>
      <group-title slot="title" class="myGroupTit midFontSize"
        >申请人信息</group-title
      >
      <x-input title="申请人" v-model="userinfodata.name" readonly></x-input>
      <x-input
        title="工号"
        v-model="userinfodata.employeeNum"
        readonly
      ></x-input>
      <x-input
        title="人力资源所属机构"
        v-model="userinfodata.organName"
        readonly
      ></x-input>
      <x-input
        title="部门"
        v-model="userinfodata.department"
        readonly
      ></x-input>
      <x-input
        title="固定电话"
        v-model="userinfodata.fixPhone"
        readonly
      ></x-input>
      <x-input
        title="联系电话"
        v-model="userinfodata.mobilePhone"
        readonly
      ></x-input>
      <x-textarea
        title="联系邮箱"
        v-model="userinfodata.email"
        readonly
        :rows="2"
      ></x-textarea>
    </group>

    <group>
      <group-title slot="title" class="myGroupTit midFontSize"
        >需求信息</group-title
      >
      <x-input
        title="需求名称"
        v-model="userlist.requireName"
        readonly
      ></x-input>
      <x-input
        title="需求类型"
        v-model="userlist.requireType"
        readonly
      ></x-input>
      <x-input
        title="业务类型"
        v-model="userlist.businessType"
        readonly
      ></x-input>
      <x-textarea
        title="需求用途"
        v-model="userlist.requireUseDescT"
        readonly
      ></x-textarea>
      <x-input
        title="是否包含敏感信息"
        v-model="userlist.ifSensitivity"
        readonly
      ></x-input>
      <!-- <x-input v-if='userlist.ifSensitivity=="是"' title="敏感信息" v-model="userlist.sensitivity" readonly></x-input> -->
      <x-textarea
        v-if="userlist.ifSensitivity == '是'"
        title="敏感信息"
        v-model="userlist.sensitivity"
        readonly
      ></x-textarea>
      <x-textarea
        title="需求描述"
        v-model="userlist.requireMemo"
        readonly
      ></x-textarea>
      <div class="textareacss1">
        <p class="midFontSize">附件</p>
        <div
          v-for="item in userlist.fileId"
          :key="item.fileId"
          class="midFontSize"
          style="padding-left: 0.25rem"
        >
          {{ item.fileName }}
        </div>
        <!-- color:blue; @click="downloadfile(item)" -->
      </div>
      <!-- <div class='textareacss'>
              <div>需求描述</div>
              <div>{{userlist.requireMemo}}</div>
            </div> -->
    </group>
    <group>
      <group-title slot="title" class="myGroupTit midFontSize"
        >审批
        <span style="font-size:0.3rem;padding-left:0.5rem;color:gray">审批意见请点击查看<img style="width: 4.5%;vertical-align: sub;" src="static/mydown.png" /></span>
        </group-title
      >
    </group>
    
    <flow orientation="vertical" class="flowtitlecss" :style="flowm">
      <!-- <div class="revicss midFontSize">审批</div> -->
      <flow-state 
        v-if="statelist.length > 0"
        state='1'
        :class="{refuse : statelist[0].approveStatus == 3 ? true : false}"
        :title="
          textRE(statelist[0].node) +
          statelist[0].userId + '/' + statelist[0].userCode
        "
        :is-done="!!(Number(statelist[0].approveStatus) > 1)"
        @click.native='resultContent(0)'
      ></flow-state>
      <flow-line
        v-if="statelist.length > 1"
        :is-done="!!(Number(statelist[1].approveStatus) > 1)"
      ></flow-line>
      <flow-state
        v-if="statelist.length > 1"
        state="2"
        :class="{refuse : statelist[1].approveStatus == 3 ? true : false}"
        :title="
          textRE(statelist[1].node) +
          statelist[1].userId + '/' + statelist[1].userCode
        "
        :is-done="!!(Number(statelist[1].approveStatus) > 1)"
        @click.native='resultContent(1)'

      ></flow-state>
      <flow-line
        v-if="statelist.length > 2"
        :is-done="!!(Number(statelist[2].approveStatus) > 1)"
      ></flow-line>
      <flow-state
        v-if="statelist.length > 2"
        state="3"
        :class="{refuse : statelist[2].approveStatus == 3 ? true : false}"
        :title="
          textRE(statelist[2].node) + ` ${statelist[2].userId == '数据管理部' ? statelist[2].userId : statelist[2].userId + '/' + statelist[2].userCode}`
        "
        :is-done="!!(Number(statelist[2].approveStatus) > 1)"
        @click.native='resultContent(2)'

      ></flow-state>
      <flow-line
        v-if="statelist.length > 3"
        :is-done="!!(Number(statelist[3].approveStatus) > 1)"
      ></flow-line>
      <flow-state
        v-if="statelist.length > 3"
        state="4"
        :class="{refuse : statelist[3].approveStatus == 3 ? true : false}"
        :title="
          textRE(statelist[3].node) + ` ${statelist[3].userId == '数据管理部' ? statelist[3].userId : statelist[3].userId + '/' + statelist[3].userCode}`

        "
        :is-done="!!(Number(statelist[3].approveStatus) > 1)"
        @click.native='resultContent(3)'

      ></flow-state>
      <flow-line
        v-if="statelist.length > 4"
        :is-done="!!(Number(statelist[4].approveStatus) > 1)"
      ></flow-line>
      <flow-state
        v-if="statelist.length > 4"
        state="5"
        :class="{refuse : statelist[4].approveStatus == 3 ? true : false}"
        :title="
          textRE(statelist[4].node) + `${statelist[4].userId == '数据管理部' ? statelist[4].userId : statelist[4].userId + '/' + statelist[4].userCode}`

        "
        :is-done="!!(Number(statelist[4].approveStatus) > 1)"
        @click.native='resultContent(4)'

      ></flow-state>
    </flow>
    <x-textarea v-if="this.$route.query.status == '3' || this.$route.query.status == '9'"
      title="审批意见"
      readonly
      style="margin-top:0.4rem;margin-bottom: 0.4rem;"
      class="label_color"
      :rows='1'
      v-html="lastback"
    ></x-textarea>
    <template
      v-if="this.$route.query.status != '3' && this.$route.query.status != '9'"
    >
      <group>
        <x-input
          v-show="currentNode < 3"
          v-html="sensitiveInfoCommit"
          @click.native="showCommitment"
        ></x-input>
        <x-input
          v-if="nodeswitch && spyj != 0"
          title="转处理人"
          v-model="deptBankUser"
          placeholder="请选择"
          @click.native="clicktovirew"
        ></x-input>
        <x-input
          v-if="nodeswitch && spyj != 0"
          title="部门负责人"
          v-model="deptChiefUser"
          placeholder="请选择"
          @click.native="clickdept"
        ></x-input>
        <selector
          title="审批意见"
          class="mySel"
          v-model="spyj"
          :options="selectlist"
          direction="rtl"
          @on-change="witchcho"
          placeholder="请选择"
        ></selector>
        <MyTextarea
          placeholder="请输入审批意见"
          :content.sync="approvalText"
        />
        <!-- <div @click="areaInputFocus" ref="spyj">
          <x-textarea
            :max="200"
            ref="spyjText"
            v-model="approvalText"
            placeholder="请输入审批意见"
            @on-blur="textBlur"
          ></x-textarea>
        </div> -->
        
      </group>
      <flexbox style="margin-top: 1rem; padding-bottom: 1rem">
        <flexbox-item>
          <x-button type="warn" @click.native="agreeConfirm" style="width: 95%"
            >提交</x-button
          >
        </flexbox-item>
      </flexbox>
    </template>
    <div v-transfer-dom>
      <popup
        v-model="showCommitmentFlag"
        position="top"
        height="80%"
        :hide-on-blur="false"
        :show-mask="false"
      >
        <div
          v-show="showCommitmentFlag"
          style="padding: 0.2rem; margin-top: 1rem"
        >
          <h2
            style="
              color: red;
              text-align: center;
              font-size: 0.5rem;
              margin: 0.5rem auto;
            "
          >
            敏感信息保密承诺书
          </h2>
          <!-- <div style="height:30rem;overflow: scroll;"> -->
          <p
            style="
              color: #999999;
              margin-top: 0.4rem;
              margin-bottom: 0.4rem;
              font-size: 0.4rem;
              text-align: justify;
            "
          >
            &nbsp;&nbsp;&nbsp;&nbsp;申请数据仓库数据查询客户敏感数据使用安全保密承诺书
          </p>
          <p style="color: #999999; font-size: 0.4rem; text-align: justify">
            &nbsp;&nbsp;&nbsp;&nbsp;本机构在保存、使用数据仓库数据时，知悉应承担的保密义务，确保信息安全，防止因客户敏感数据泄露或挪作他用，造成对客户自身财产安全的不利影响以及由此引发的银行声誉风险。此次下发数据中涉及的敏感数据包括:
          </p>
          <p
              class="mgmessage"
              >{{ userlist.sensitivity }}</p
            >
          <p style="color: #999999; font-size: 0.4rem">
            &nbsp;&nbsp;&nbsp;&nbsp;现作出如下郑重承诺：
          </p>
          <p style="color: #999999; font-size: 0.4rem; text-align: justify">
            &nbsp;&nbsp;&nbsp;&nbsp;1、本分行严格遵守国家有关法律规定及行内相关管理要求，承担对客户信息保密的职责；
          </p>
          <p style="color: #999999; font-size: 0.4rem; text-align: justify">
            &nbsp;&nbsp;&nbsp;&nbsp;2、本分行将采取有效措施加强对客户敏感信息的保护，确保信息安全，数据使用人员不得通过移动存储或其他技术手段将数据泄露到行外，不得出售客户数据等；
          </p>
          <p style="color: #999999; font-size: 0.4rem; text-align: justify">
            &nbsp;&nbsp;&nbsp;&nbsp;3、严禁第三方机构人员接触我行客户数据，如确有系统建设等需要，应保证在有行内人员在场监督的情况下，方可安全使用；
          </p>
          <p style="color: #999999; font-size: 0.4rem; text-align: justify">
            &nbsp;&nbsp;&nbsp;&nbsp;4、如违反规定使用和对外提供客户金融信息，给全行及客户造成损害的，无条件接受相关处理，如违法愿承担相应的法律责任。
          </p>
          <!-- </div> -->
          <x-button
            type="warn"
            style="width: 80%; margin: 0.8rem auto"
            @click.native="hideCommitment"
            >我已阅读</x-button
          >
        </div>
      </popup>
    </div>

    <!-- <div v-transfer-dom>
          <confirm v-model="showConfirm"
          :title="operationTip"
          @on-cancel="onCancel"
          @on-confirm="onConfirm">
            <p style="text-align:center;">{{showConfirmText}}</p>
          </confirm>
        </div>  -->
    <div v-transfer-dom>
      <popup
        v-model="showselcet"
        position="bottom"
        height="100%"
        :hide-on-blur="false"
        style="position: absolute !impotant; z-index: 999"
      >
        <seclect
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
      @on-click-menu-delete="onConfirm"
      show-cancel
    ></actionsheet>
    <actionsheet
      v-model="showConfirmt"
      :menus="menusall"
      @on-click-menu-delete="onConfirmt"
      :close-on-clicking-mask="false"
    ></actionsheet>
  </div>
</template>
<script>
let URL = require("../asssets/Api/api");
import { TransferDomDirective as TransferDom } from "vux";
import {
  ajaxGet,
  ajaxPost,
  ajaxGetdl,
  ajaxtokenPost,
  closeWindow,
  hideWebViewTitle,
} from "../../core/mxApi";
import minxin from "@/common/commonfunction.js";
import seclect from "@/common/seclect.vue";
import Bus from "@/bus/bus";
import Header from "@/common/header.vue";
import MyTextarea from "@/common/myTextarea.vue";
export default {
  directives: {
    TransferDom,
  },
  components: {
    seclect,
    Header,
    MyTextarea
  },
  mixins: [minxin],
  computed: {
    nodeswitch() {
      let crrutrowinf = this.rowinf1 ? this.rowinf1 : this.rowinf2;
      return !!(Number(crrutrowinf.node) == 3);
    },
  },
  watch: {
    actionSheetVisable(val) {
      if (val) {
        hideWebViewTitle();
      } else {
        //  MXWebui.showWebViewTitle()
      }
    },
    actionSheetVisableJ(val) {
      if (val) {
        hideWebViewTitle();
      } else {
        //  MXWebui.showWebViewTitle()
      }
    },
    showselcet(val) {
      if (val) {
        hideWebViewTitle();
      } else {
        // MXWebui.showWebViewTitle()
      }
    },
  },
  created() {
    //   alert(JSON.stringify(this.$route.query.node))
    // 获取审批意见
    this.getBusinessDict();
    //hideWebViewTitle()
    document.documentElement.scrollTop = 0;
  },
  mounted() {
    // this.getapplyuserinfo()
    // MXWebui.disableTranslucentHeader({
    // onSuccess: function() {}, // 禁⽌成功
    // onFail: function() {} // 禁⽌失败
    // });
    //详情
    this.lastback = this.$route.query.status == '3' 
    ? `<span style="color:grey;margin-right:4rem">审批意见</span>
    同意`
    : `<span style="color:grey;margin-right:4rem">审批意见</span>
    驳回`;
    let _this = this;
    let requireid = _this.getquerystring("requireId");
    let node = _this.getquerystring("node") || "";
    let approveStatus = _this.getquerystring("approveStatus") || "";
    let status = _this.getquerystring("status") || "";
    let id = _this.getquerystring("id") || "";
    let isZnzl = _this.getquerystring("isZnzl") || "";
    let pagedata = { requireid, node, approveStatus, id, isZnzl};
    if (requireid) {
      _this.rowinf1 = pagedata;
      //已完结,退回的不用校验状态 status == 3
      if(status != 3 && status != 9){
        let parms = {
          approvalId: id,
          requireId:this.$route.query.requireId
        };
        ajaxGet(URL.url.getDataStatus, parms)
          .then((res) => {
            let {
              data: { data, code },
            } = res;
            // alert(JSON.stringify(res))
            if (code == "0000") {
              // 0 提交 1 待审核 2 审核通过 3 退回
              if (Number(data) < 2) {
                if (node == "4") {
                  _this.showConfirmt = true;
                  _this.sheet("此流程请在PC端处理");
                  return;
                }
                _this.getinto(pagedata);
                sessionStorage.setItem("isTui", true);
              } else {
                if (
                  this.$route.query.status == "9" ||
                  this.$route.query.status == "3"
                ) {
                  pagedata = { requireid };
                  _this.getinto(pagedata);
                  sessionStorage.setItem("isTui", true);
                } else {
                  _this.showConfirmt = true;
                  _this.sheet("该申请单已审批！");
                }
              }
            } else {
              _this.showConfirmt = true;
              _this.sheet("该申请单不存在！");
            }
          })
          .catch((error) => {
            let omsg = _this.outmsg(error);
            if (!omsg) {
              return;
            }
            _this.actionSheetVisable = true;
            _this.sheet(omsg);
          });
      }else{
        pagedata = { requireid };
        _this.getinto(pagedata);
        sessionStorage.setItem("isTui", true);
      }
    } else {
      let rowinfos = (this.rowinf2 = JSON.parse(
        sessionStorage.getItem("needreviewitem")
      ));
      _this.showloading();
      let parmas = {
        requireId: rowinfos.requireId,
      };
      if (
        Number(rowinfos.node) > 2 &&
        this.$route.query.status != "9" &&
        this.$route.query.status != "3"
      ) {
        _this.getapplyuserinfo(parmas);
      } else {
        _this.getapplyinfo(parmas);
      }
      _this.getRequireByIdfun(parmas);
    }
  },
  beforeRouteLeave(to, from, next) {
    if (to.path == "/home") {
      this.$store.commit({
        type: "changepage",
        pageindex: 2,
      });
      this.$store.commit({
        type: "changetabContent",
        tabContent: 0,
      });
      next();
    } else {
      next();
    }
  },
  methods: {
      //审批意见弹框
      resultContent(state){
        if(!this.resultList[state].opinion){
          // alert('暂未审批')
        }else {
          this.$vux.alert.show({
              title: '审批意见',
              content: `${this.resultList[state].opinion}`,
          })
        }
      },
    onConfirmt() {
      closeWindow();
    },
    textBlur() {
      this.isTextArea = false;
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS) {
        this.$refs.spyj.style.cssText = "padding-bottom:0px";
        Bus.$emit("textFocus", 1);
        window.ontouchstart = "";
        this.$refs.spyj.removeEventListener("touchstart", this.zuzhi);
        //this.$refs.userDetail.removeEventListener("touchstart", this.zuzhi)
        window.ontouchmove = "";
      }
    },
    zuzhi(e) {
      e.preventDefault && e.preventDefault();
      e.returnValue = false;
      e.stopPropagation && e.stopPropagation();
      return false;
    },
    areaInputFocus() {
      // this.jpHeight = null
      // this.jpHeight = (window.outerHeight - window.innerHeight*1.7)+ 'px'
      // this.$refs.areaInput.focus()
      // this.isTextArea = true
      // this.ym = setTimeout(() => {
      //   document.documentElement.scrollTop = document.body.offsetHeight
      // }, 100)
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS) {
        this.$refs.spyjText.focus();
        let hei = document.body.offsetHeight - window.innerHeight;
        this.$refs.spyj.style.cssText = "padding-bottom:" + hei + "px";
        setTimeout(() => {
          let scroll = document.body.offsetHeight + hei;
          document.documentElement.scrollTop = scroll;
          Bus.$emit("textFocus");
          window.ontouchmove = function (e) {
            e.preventDefault && e.preventDefault();
            e.returnValue = false;
            e.stopPropagation && e.stopPropagation();
            return false;
          };
          this.$refs.spyj.addEventListener("touchstart", this.zuzhi);
          this.$refs.userDetail.addEventListener("touchstart", this.zuzhi);
        }, 100);
      }
    },
    inputCli() {
      setTimeout(() => {
        document.documentElement.scrollTop = document.body.offsetHeight;
      }, 100);
    },
    getBusinessDict() {
      const data = { type: "businessType" };
      ajaxPost(URL.url.getOneDict, JSON.stringify(data))
        .then((res) => {
          if (res.data.data) {
            this.businessTypeDict = res.data.data;
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
    getinto(pagedata) {
      let _this = this;
      _this.showloading();
      document.addEventListener("deviceready", () => {
        MXCommon.getSSOToken("datamdwp", (ssoToken) => {
          window.sessionStorage.setItem("appToken", ssoToken);
          MXCommon.getCurrentUser((user) => {
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
                let parmas = {
                  requireId: pagedata.requireid,
                };
                if (
                  Number(pagedata.node) > 2 &&
                  this.$route.query.status != "9" &&
                  this.$route.query.status != "3"
                ) {
                  _this.getapplyuserinfo(parmas);
                } else {
                  _this.getapplyinfo(parmas);
                }
                _this.getRequireByIdfun(parmas);
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
    //人员选择框出现时
    clicktovirew() {
      this.nodetwoc = 1;
      this.showselcet = true;
    },
    clickdept() {
      this.nodetwoc = 2;
      this.showselcet = true;
    },
    getRequireByIdfun(parmas) {
      let _this = this;
      ajaxGet(URL.url.getRequireById, parmas)
        .then((res) => {
          let requireTypelist = ["A类", "B类"],
            businessTypelist = this.businessTypeDict,
            requireUselist = ["经营分析", "客户营销", "风险管理", "后评价"];
          let {
            data: { data, code },
          } = res;
          if (code == "0000") {
            for (let k in data) {
              if (data[k] == null) {
                data[k] = "";
              }
              if (k == "requireType") {
                data[k] = requireTypelist[data[k]];
              }
              if (k == "businessType") {
                let dt = businessTypelist.filter(
                  (item) => item.value == data[k]
                );
                this.businessTypeNum = dt[0].value;
                data[k] = dt[0].name;
              }
              if (k == "requireUse") {
                data[k] = requireUselist[data[k]];
              }
              if (k == "ifSensitivity") {
                data[k] = data[k] == 1 ? "否" : "是";
              }
            }
            data.requireUseDescT = `${data.requireUse}-${data.requireUseDesc}`;
            data.fileId = data.fileId ? JSON.parse(data.fileId) : null;
            _this.userlist = data;
            _this.getuserinfomation(data);
          }
        })
        .catch((err) => {
          let omsg = _this.outmsg(err);
          _this.closeloading();
          if (!omsg) {
            return;
          }
          _this.actionSheetVisable = true;
          _this.sheet(omsg);
        });
    },
    downloadfile(item) {
      const params = { fileId: item.id };
      ajaxGet(URL.url.getFileUrl, params)
        .then((res) => {
          if (
            res.data.data != "" &&
            res.data.data != null &&
            res.data.data != "null"
          ) {
            let ul = URL.url.downApplyFile + res.data.data.fileUrl;
            this.getWpsFile(ul, item.id);
            // MXCommon.download(ul);
          } else {
            this.actionSheetVisable = true;
            this.sheet("该文件不存在");
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
    getWpsFile(ul, fileId) {
      let user = JSON.parse(sessionStorage.getItem("currentUser"));
      const params = {
        userName: user.username,
        name: encodeURIComponent(user.name),
        fileId: fileId,
        httpFileUrl: ul,
      };
      ajaxGet(URL.url.getWpsUrl, params)
        .then((res) => {
          if (
            res.data.data != "" &&
            res.data.data != null &&
            res.data.data != "null"
          ) {
            //window.open(res.data.data, '_blank')
            //MXCommon.download(res.data.data);
            MXCommon.openUrlPage(res.data.data);
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
    //没有经办人的审批状态轴
    getapplyinfo(parmas) {
      let _this = this;
      _this.closeloading();
      ajaxGet(URL.url.getReviewUserApply, parmas)
        .then((rk) => {
          this.resultList = rk.data.data
          for(var i=0;i<this.resultList.length;i++){
            // alert(JSON.stringify(this.resultList[i]))
            if(this.resultList[i].opinion){
              this.resultList[i].opinion = `${this.resultList[i].opinion}`
            }else {
              this.resultList[i].opinion = ''
            }
          }
            // alert(JSON.stringify(rk))
          let {
            data: { data, code },
          } = rk;
          let widlist = [1.1, 1.3, 2, 3.1, 5];
          if (code == "0000") {
            data.forEach((item) => {
              for (let k in item) {
                if (item[k] == null) {
                  item[k] = "";
                }
              }
            });
            _this.statelist = data;
            if(_this.statelist.length == 1){
              _this.flowm = `height:0.3rem;`;
            }else{
              _this.flowm = `height:${(Number(data.length) - 1) * 0.75}rem;`;
            }
            _this.closeloading();
          }
        })
        .catch((err) => {
          let omsg = _this.outmsg(err);
          _this.closeloading();
          if (!omsg) {
            return;
          }
          _this.actionSheetVisable = true;
          _this.sheet(omsg);
        });
    },
    //有经办人的审批状态轴
    getapplyuserinfo(parmas) {
      let _this = this;
      ajaxGet(URL.url.getReviewUser, parmas)
        .then((rk) => {
          this.resultList = rk.data.data
          for(var i=0;i<this.resultList.length;i++){
            if(this.resultList[i].opinion){
              this.resultList[i].opinion = `${this.resultList[i].opinion}`
            }else {
              this.resultList[i].opinion = ''
            }
          }
          let {
            data: { data, code },
          } = rk;
          let widlist = [1.1, 1.3, 2, 3.1, 5];
          if (code == "0000") {
            data.forEach((item) => {
              for (let k in item) {
                if (item[k] == null) {
                  item[k] = "";
                }
              }
            });
            _this.statelist = data;
            // let rowinfos=JSON.parse(sessionStorage.getItem('needreviewitem'))
            if(_this.statelist.length == 1){
              _this.flowm = `height:0.3rem;`;
            }else{
              _this.flowm = `height:${(Number(data.length) - 1) * 0.75}rem;`;
            }
            _this.closeloading();
          }
        })
        .catch((err) => {
          let omsg = _this.outmsg(err);
          _this.closeloading();
          if (!omsg) {
            return;
          }
          _this.actionSheetVisable = true;
          _this.sheet(omsg);
        });
    },
    refuseConfirm() {
      let crrutrowinf = this.rowinf1 ? this.rowinf1 : this.rowinf2;
      if (crrutrowinf.node == 3 && thid.spyj) {
        if (!this.deptBankUser || !this.deptChiefUser) {
          this.actionSheetVisable = true;
          this.sheet("请选择转处理人和部门负责人");
          return;
        }
      }
      if (!this.approvalText) {
        this.actionSheetVisable = true;
        this.sheet("请输入审批意见");
        return;
      }
      if (!this.readdone) {
        this.actionSheetVisable = true;
        this.sheet("请先阅读敏感信息保密承诺书");
        return;
      }
      this.showConfirm = true;
      this.sheet("你是否拒绝该条申请信息？");
      this.isAgree = false;
      //this.showConfirmText = '你是否拒绝该条申请信息？'
    },
    //申请人信息
    getuserinfomation(user) {
      ajaxGet(URL.url.getRequirePeoMsg, { userId: user.creUserId })
        .then((re) => {
          let {
            data: { data, code },
          } = re;
          if (code == "0000") {
            this.userinfodata.name = data.name;
            this.userinfodata.employeeNum = data.username;
            (this.userinfodata.department = data.deptName), // 部门
              (this.userinfodata.organName = data.orgName),
              (this.userinfodata.fixPhone = data.telephone),
              (this.userinfodata.mobilePhone = data.mobile),
              (this.userinfodata.email = data.email);
          }
          this.closeloading();
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
    witchcho(key) {
      if (key == "1") {
        this.approvalText = "同意。";
      } else {
        this.approvalText = "";
      }
    },
    onCancel() {
      this.showConfirm = false;
    },

    cancalback() {
      this.valueed = [];
      this.showselcet = false;
    },

    secletdata(data) {
      if (this.nodetwoc == 1) {
        this.deptBankUser = `${data[0].name}/${data[0].username}`;
        this.deptBankUserId = data[0].username;
      } else {
        this.deptChiefUser = `${data[0].name}/${data[0].username}`;
        this.deptChiefUserId = data[0].username;
      }
    },
    tobackpage() {
      this.approvalText = "";
      this.readdone = false;
      if (this.rowinf1 != null && this.rowinf1.id && !this.rowinf1.isZnzl) {
        ajaxGet(URL.url.loginout)
          .then((res) => {
            const {
              data: { code, message, data },
            } = res;
            if (code == "0000") {
              closeWindow();
            }
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
      } else {
        if (this.$route.query.type === "yhsp") {
          this.push("myApproval");
          // this.$store.commit({
          //     type: 'changepage',
          //     pageindex: 2,
          // });
        } else {
          this.push("reviewdetail");
        }
      }
    },
    onConfirm() {
      let status,
        {
          requireId,
          ifImportFollow,
          ifOwnAnalyse,
          reportReq,
          deptInnLeaderUser,
          acceptUserId,
          remark,
          fileId,
          file2Id,
          approveStatus,
          creUserId,
          id,
          approveType,
        } = this.userlist;
      let userinfo = JSON.parse(sessionStorage.getItem("currentUser"));
      let crrutrowinf = this.rowinf1 ? this.rowinf1 : this.rowinf2;
      if (this.isAgree === false) {
        status = 9;
      } else {
        // status=3
        status = 1;
      }
      let ids = [];
      if (fileId) {
        fileId.forEach((item) => {
          ids.push(item.fileId);
        });
      }
      let params = {
        requireId,
        ifImportFollow,
        ifOwnAnalyse,
        reportReq,
        deptInnLeaderUser: this.deptChiefUserId,
        acceptUserId: this.deptBankUserId,
        remark,
        status,
        fileId: ids.length ? JSON.stringify(ids) : undefined,
        file2Id,
        reviewOpinion: this.approvalText,
        approveStatus: crrutrowinf.approveStatus,
        creUserId,
        userIdNew: userinfo.userId,
        node: crrutrowinf.node,
        id: crrutrowinf.id,
        approveType,
        businessType: this.businessTypeNum,
      };
      let url = "";
      if (crrutrowinf.node == 1 || crrutrowinf.node == 2) {
        url = URL.url.deptApprove;
      } else if (crrutrowinf.node == 3) {
        url = URL.url.reqReviewAccept;
      } else if (crrutrowinf.node == 5) {
        url = URL.url.deptInner;
      } else if (crrutrowinf.node == 4) {
        return;
      }
      let dt = JSON.stringify(params);
      if (url != "") {
        ajaxPost(url, dt)
          .then((re) => {
            // alert(re);
            let {
              data: { code },
            } = re;
            if (code == "0000") {
              this.push("approvalFinish");
            }
          })
          .catch((err) => {
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
    agreeConfirm() {
      let crrutrowinf = this.rowinf1 ? this.rowinf1 : this.rowinf2;
      if ( this.spyj == "" ) {
        this.actionSheetVisable = true;
        this.sheet("请选择审批意见");
        return;
      }
      if (crrutrowinf.node == 3) {
        if( this.spyj == 1 ){//同意
          if (!this.deptBankUser || !this.deptChiefUser) {
            this.actionSheetVisable = true;
            this.sheet("请选择转处理人和部门负责人");
            return;
          }
        }
      }
      if (!this.approvalText) {
        this.actionSheetVisable = true;
        this.sheet("请输入审批意见");
        return;
      }
      if (this.$route.query.node < 3 && !this.readdone && this.spyj == 1) {
        this.actionSheetVisable = true;
        this.sheet("请先阅读敏感信息保密承诺书");
        return;
      }
      this.showConfirm = true;
      if (this.spyj == "1") {
        this.isAgree = true;
        this.sheet("你是否同意该条申请信息？");
        //this.showConfirmText = '你是否同意该条申请信息？'
      } else if (this.spyj == "0") {
        this.isAgree = false;
        this.sheet("你是否拒绝该条申请信息？");
        //this.showConfirmText = '你是否拒绝该条申请信息？'
      }
    },

    hideCommitment() {
      let vm = this;
      vm.readdone = true;
      vm.showCommitmentFlag = false;
    },
    showCommitment() {
      let vm = this;
      this.showCommitmentFlag = true;
    },
  },
  beforeDestroy() {
    clearTimeout(this.ym);
  },
  data() {
    return {
      //控制完结和退回的回复语
      lastback:'',
      requireId:'',
      resultList:[],//审批人栏信息
      ym: "",
      textRE(node) {
        let txt = "";
        if (node == 1) {
          txt = "申请部门负责人    ";
        } else if (node == 2) {
          if (this.userlist.approveType == 2) {
            txt = "申请部门主管行领导    ";
          } else if (this.userlist.approveType == 0) {
            txt = "申请部门条线总监    ";
          }
        } else if (node == 3) {
          txt = "数据管理部经办人    ";
        } else if (node == 4) {
          txt = "数据管理部受理人    ";
        }
        return txt;
      },
      isTextArea: false,
      businessTypeDict: [], // 业务类型数据字典
      businessTypeNum: null, // 业务类型对应的数据值
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      spyj: "",
      valueed: [],
      readdone: false,
      showselcet: false,
      flowm: "",
      rowinf1: null,
      rowinf2: {
        node: 0,
      },
      nodetwoc: "",
      statelist: [],
      selectlist: [
        { key: "1", value: "同意" },
        { key: "0", value: "拒绝" },
      ],
      deptBankUser: "",
      deptChiefUser: "",
      deptBankUserId: "",
      deptChiefUserId: "",
      userlist: {
        acceptUserId: "",
        approveStatus: "",
        approveType: "",
        backOpinion: "",
        businessType: "",
        creUserId: "",
        createTime: "2",
        delete: null,
        toreview: [],
        depresponse: [],
        deptBankUser: "",
        deptChiefUser: "",
        deptInnLeaderUser: "",
        deptLeaderUser: "",
        deptName: "",
        endTime: "",
        file2Id: "",
        fileId: "",
        handleUserId: "",
        id: "",
        ifImportFollow: "",
        ifOwnAnalyse: "",
        ifSensitivity: "",
        nextNode: "",
        node: "",
        opinion: "",
        orgName: "",
        organId: "",
        organName: "",
        remark: "",
        reportReq: "",
        reqNode: "",
        requireId: "",
        requireMemo: "",
        requireName: "",
        requireType: "",
        requireUse: "",
        requireUseDesc: "",
        reviewOpinion: "",
        sensitivity: "",
        status: "",
        userIdNew: "",
        userName: "",
      },
      userinfodata: {
        name: "",
        employeeNum: "",
        department: "", // 部门
        organName: "",
        fixPhone: "",
        mobilePhone: "",
        email: "",
      },
      approvalText: "",
      sensitiveInfoCommit: `<p class="innerpcss">敏感信息承诺</p><p class="innerpcsst">需阅读<span style="color:blue">《敏感信息保密承诺书》</span></p>`,
      showCommitmentFlag: false,
      operationTip: "操作提示",
      showConfirm: false,
      showConfirmt: false,
      isAgree: false,
      showConfirmText: "",
      currentNode: this.$route.query.node,
    };
  },
};
</script>
<style lang="less">
.mgmessage{
  color:#e92323;
  word-wrap: break-word;
  word-break: break-all;
  overflow: hidden;
  font-size: 0.4rem;
}
.textareacss {
  margin: 0rem 0rem 0rem 0.1rem;
  border-top: 1px solid #d9d9d9;
  div:first-child {
    //font-size: 0.3rem;
    color: #999999;
    margin: 0.1rem 0.1rem;
  }
  div:last-child {
    height: 2.4rem;
    margin: 0.3rem;
    word-wrap: break-word;
    border: 1px solid #d9d9d9;
    border-radius: 0.1rem;
  }
}
.textareacss1 {
  margin: 0rem 0rem 0rem 0.1rem;
  border-top: 1px solid #d9d9d9;
  height: auto;
  p:first-child {
    //font-size: 13px;
    color: #999999;
    margin: 0.2rem 0.2rem;
    line-height: 0.5rem;
  }
  div {
    width: 100%;
    font-size: 13px;
    // color: #10AEFF;
    margin-bottom: 0.5rem;
  }
}
.weui-label {
  width: 3em;
  color: #999999;
  text-align: left;
}
.weui-input {
  color: black;
  text-align: right;
}
/deep/.innerpcss {
  color: #999999;
  width: 4rem;
}
/deep/.innerpcsst {
  text-align: right;
  width: calc(100%-4rem);
}

.flowtitlecss {
  padding: 0 0.2rem !important;
  .weui-wepay-flow__bd {
    margin-left: -6.5rem;
  }
  .revicss {
    //font-size: 0.3rem;
    color: black;
    margin: 0 0 0.1rem 0.25;
  }
  .refuse .weui-wepay-flow__state{ 
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
