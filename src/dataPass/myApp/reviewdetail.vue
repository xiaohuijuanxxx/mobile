<template>
  <div class="marginHeader" style="height:100%;" v-touch:right="tobackpage">
    <!-- 用户审批 -->
    <div v-if="reviewtype == '100' || reviewtype == '104' || reviewtype == '105'">
      <Header
        :backoptions="backoptions"
        title="用户审批"
        @tobackpage="tobackpage"
      />
      <!-- <x-header :left-options="backoptions" @on-click-back="tobackpage" class="cjHeader headerFixed bigFontSize">用户审批</x-header> -->
      <template v-if="userlist.length">
        <div class="parent">
          <flexbox
            v-for="item in userlist"
            :key="item.applyId"
            class="appfirstbox"
          >
            <flexbox-item :span="2">
              <!-- <div class="headeruser">{{item.name.substr((item.name.length-2),2)}}</div> -->
              <!-- <x-img style="width:86%;" :src="item.mxUserInfo?item.mxUserInfo.avatarUrl:null" default-src='static/title_picture.png'></x-img> -->
              <img
                v-if="item.mxUserInfo"
                style="width: 86%"
                :src="item.mxUserInfo.avatarUrl"
              />
              <img v-else style="width: 86%" src="static/title_picture.png" />
            </flexbox-item>
            <flexbox-item :span="6" class="myFlexItem">
              <div class="approvalPeople minFontSize">{{ item.name }}</div>
              <div class="approvalThing minFontSizemid lineHei overTwo">
                {{ gsh(item.applyType) }}
              </div>
            </flexbox-item>
            <flexbox-item>
              <x-button
                mini
                class="ljManage minFontSizeMin"
                type="warn"
                @click.native="gotoUserDetail(item)"
                >立即处理</x-button
              >
            </flexbox-item>
          </flexbox>
        </div>
      </template>
      <template v-else>
        <div class="nodatacss minFontSizemid">暂无数据</div>
      </template>
    </div>
    <!-- 特色需求、下发审批 -->
    <div v-else-if="isCharacter">
      <Header
        :backoptions="backoptions"
        :title="titleCharacter"
        @tobackpage="tobackpage"
      />
      <template v-if="characterList != ''">
        <div class="parent">
          <flexbox
            v-for="im in characterList"
            :key="im.requireId"
            class="appfirstbox"
          >
            <flexbox-item :span="2">
              <img
                v-if="im.mxUserInfo"
                style="width: 86%"
                :src="im.mxUserInfo.avatarUrl"
              />
              <img v-else style="width: 86%" src="static/title_picture.png" />
            </flexbox-item>
            <flexbox-item :span="6" class="myFlexItem">
              <div class="approvalPeople minFontSize">{{ im.createName }}</div>
              <div class="approvalThing minFontSizemid lineHei overTwo" v-if="!isIssue">
                {{ im.portalQaTitle }}
              </div>
              <div class="approvalThing minFontSizemid lineHei overTwo" v-else>
                {{ im.dwpDataApplyTitle }}
              </div>
            </flexbox-item>
            <flexbox-item>
              <x-button
                mini
                class="ljManage minFontSizeMin"
                type="warn"
                @click.native="toCharacterNeedDetail(im)"
                >立即处理</x-button
              >
            </flexbox-item>
          </flexbox>
        </div>
      </template>
      <template v-else>
        <div class="nodatacss minFontSizemid">暂无数据</div>
      </template>
    </div>
    <!-- 手工数据 -->
    <div v-else-if="isManual">
      <Header
        :backoptions="backoptions"
        title="手工数据需求流程"
        @tobackpage="tobackpage"
      />
      <DataManualList :isApplyer="isApplyer" :isAssistant="true" />
    </div>
    <!-- 手工数据备案流程 -->
    <div v-else-if="isRecord">
      <Header
        :backoptions="backoptions"
        title="手工数据备案流程"
        @tobackpage="tobackpage"
      />
      <DataRecordList :isApplyerRe="isApplyerRe" :isAssistant="true" />
    </div>
    <!-- 数据需求审批 -->
    <div v-else>
      <Header
        :backoptions="backoptions"
        title="需求审批"
        @tobackpage="tobackpage"
      />
      <!-- <x-header :left-options="backoptions" @on-click-back="tobackpage" class="cjHeader headerFixed bigFontSize">需求审批</x-header> -->
      <template v-if="requirementlist.length">
        <div class="parent">
          <flexbox
            v-for="im in requirementlist"
            :key="im.requireId"
            class="appfirstbox"
          >
            <flexbox-item :span="2">
              <!-- <div class="headeruser">{{im.userName.substr((im.userName.length-2),2)}}</div> -->
              <!-- <x-img style="width:86%;" :src="im.mxUserInfo?im.mxUserInfo.avatarUrl:null" default-src='static/title_picture.png'></x-img> -->
              <img
                v-if="im.mxUserInfo"
                style="width: 86%"
                :src="im.mxUserInfo.avatarUrl"
              />
              <img v-else style="width: 86%" src="static/title_picture.png" />
            </flexbox-item>
            <flexbox-item :span="6" class="myFlexItem">
              <div class="approvalPeople minFontSize">{{ im.userName }}</div>
              <div class="approvalThing minFontSizemid lineHei overTwo">
                {{ im.requireName }}
              </div>
            </flexbox-item>
            <flexbox-item>
              <x-button
                mini
                class="ljManage minFontSizeMin"
                type="warn"
                @click.native="gotoRequirementDetail(im)"
                >立即处理</x-button
              >
            </flexbox-item>
          </flexbox>
        </div>
      </template>
      <template v-else>
        <DataRecordList></DataRecordList>
        <div class="nodatacss minFontSizemid">暂无数据</div>
      </template>
    </div>
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
  </div>
</template>

<script>
let URL = require("../asssets/Api/api");
import { mapMutations } from 'vuex';
import { ajaxGet, ajaxPost } from "../../core/mxApi";
import minxin from "@/common/commonfunction.js";
import Header from "@/common/header.vue";
import DataManualList from "@/dataPass/dataManaul/dataManualList.vue"
import DataRecordList from "@/dataPass/dataManaul/DataRecordList.vue"

export default {
  components: {
    Header,
    DataManualList,
    DataRecordList
  },
   props: {
    isApplyer: {
      // 是否为申请人查看
      type: Boolean,
      default: false,
    },
    dataRecordStatus: {
      type: String,
      default: "",
    },
    isAssistant: {
      // 是否是智能助理 若为智能助理 则不显示标题
      type: Boolean,
      default: false,
    },
  },
  mixins: [minxin],
  methods: {
    ...mapMutations(['setTransitionName']),
    tobackpage() {
      //this.push("home");
      this.setTransitionName('slide-right')
      setTimeout(()=>{
        this.push('myAssistant')
      })
    },
    gotoUserDetail(row) {
      let vm = this,
        rowinfo = JSON.stringify(row);
      sessionStorage.setItem("userreviewitem", rowinfo);
      if (row.node == 5) {
        this.actionSheetVisable = true;
        this.sheet("此流程请在PC端处理");
      } else {
        this.setTransitionName('')
        vm.push({
          path: "/userApprovalDetail",
          query: { node: row.node, applyId: row.applyId,applyStatus: row.applyStatus },
        });
        //vm.push('userApprovalDetail')
      }
    },
    changephotos(data) {
      let usercd = JSON.parse(sessionStorage.getItem("jzUser"));
      let earacode = usercd.avatar_url.split("/");
      data.length &&
        data.forEach((item) => {
          if (item.mxUserInfo) {
            item.mxUserInfo.avatarUrl = `${earacode[0]}//${earacode[2]}${item.mxUserInfo.avatarUrl}`;
          }
        });
      return data;
    },
    // 跳转特色需求、特色下发详情
    toCharacterNeedDetail(item) {
      //   node
      //   1 部门审批     2 接口人    3 处理人审批     5 退回     6 完结
      if (this.isIssue) {
        // 特色下发流程
        let name = '',status,level,dwpType
        if (item.node == 1) {
          name = 'characterIssueDeptDeal'
          status = item.dwpDataApproveStatus
          level  = item.dwpDataApprovelLevel
        } else if (item.node == 2 || item.node == 4) {
          name = 'characterIssueOfficeInterfaceDeal'
           status = item.dwpDataManageStatus
        } else if(item.node == 3){
          name = 'characterIssueHandlerDeal'
           status = item.dwpDataDealStatus
          level  = item.dwpDataDealLevel
          dwpType = item.dwpDataDealType
        }else if(item.node == 5 || item.node == 6){
          name = 'characterIssueApply'
           status = item.dwpDataDealStatus
          level  = item.dwpDataDealLevel
          dwpType = item.dwpDataDealType
        }
        this.setTransitionName('')
        this.push({
            name: name,
            // params: {
            //   dwpDataId: item.dwpDataId,
            // },
            query: {
              'dwpDataId': item.dwpDataId,
              'status': status,
              'dwpDataApproveId': item.dealId,
              'level': level,
              'dwpType': dwpType
            }
          });
      } else {
        this.setTransitionName('')
        // 特色需求流程
        console.log(item)
        if (item.node == 1) {
          this.push({
            name: "characterSurvey",
            //params: { portalQaId: item.portalQaId },
            query: { portalQaId: item.portalQaId }
          });
        } else if(item.node == 5 || item.node == 6){
          this.push({
            name: "characterNeedApply",
            query: {
              portalQaId: item.portalQaId,
              id: item.dealId,
              upId: item.upDealId,
            },
          });
        } else {
          this.push({
            name: "transactorDealDetail",
            //params: { portalQaId: item.portalQaId },
            query: {
              // status: row.portalQaManageState,
              portalQaId: item.portalQaId,
              id: item.dealId,
              upId: item.upDealId,
            },
          });
        }
      }
    },
    gotoRequirementDetail(row) {
      // alert(JSON.stringify(row))
      let vm = this,
        rowinfom = JSON.stringify(row);
      sessionStorage.setItem("needreviewitem", rowinfom);
      if (row.node == 4) {
        vm.actionSheetVisable = true;
        vm.sheet("此流程请在PC端处理");
      } else {
        this.setTransitionName('')
        vm.push({
          path: "/requirementApprovalDetail",
          query: { node: row.node, status: row.status ,requireId:row.requireId, id: row.id || '', isZnzl : true},
        });
      }
    },
    getCharacterData(params) {
      ajaxGet(URL.url.getCharacterAllData, params).then((res) => {
        let {data: { data, code },} = res;
        let recordsdata = this.changephotos(data);
        recordsdata.forEach(item => {
          if (item.todoType == this.reviewtype) {
            this.characterList.push(item)
          }
        })
      }).catch((error) => {
        let omsg = _this.outmsg(err);
        _this.closeloading();
        if (!omsg) {
          return;
        }
        _this.actionSheetVisable = true;
        _this.sheet(omsg);
      });
    },
    getCharacterIssueData(params) {
      ajaxGet(URL.url.getCharacterIssueAllData, params).then((res) => {
        let {data: { data, code },} = res;
        let recordsdata = this.changephotos(data);
        recordsdata.forEach(item => {
          if (item.todoType == this.reviewtype) {
            this.characterList.push(item)
          }
        })
      }).catch((error) => {
        let omsg = _this.outmsg(err);
        _this.closeloading();
        if (!omsg) {
          return;
        }
        _this.actionSheetVisable = true;
        _this.sheet(omsg);
      });
    },
  },
  mounted() {
    if (this.$route.query.todoPara) {
      sessionStorage.setItem('todoPara', this.$route.query.todoPara)
      sessionStorage.setItem('todoState', this.$route.query.todoState)
      sessionStorage.setItem('todoType', this.$route.query.todoType)
    }
    let _this = this;
    // 获取当前用户所有角色
    const signs = JSON.parse(sessionStorage.getItem("signs"));
    _this.reviewtype = sessionStorage.getItem("todoType");
    let usernames = JSON.parse(sessionStorage.getItem("currentUser"));
    const characterParmas = {
      page: 1,
      per_page: 9999,
      userName: usernames.username,
      roles: signs,
      todoPara: sessionStorage.getItem('todoPara') ? sessionStorage.getItem('todoPara') : '',
      isTodo: 'Y'
    };
    let url='';
    // 获取特色需求智能助理对应数据
    if (/^6/.test(this.reviewtype)) {
      // this.reviewtype == "601" || this.reviewtype == "602" || this.reviewtype == "603" || this.reviewtype =="606"
      this.isCharacter = true
      this.titleCharacter = '特色需求审批'
      this.getCharacterData(characterParmas);
    }
    // 获取特色下发智能助理对应数据
    if (/^7/.test(this.reviewtype)) {
      // this.reviewtype == "701" || this.reviewtype == "702" || this.reviewtype == "703" || this.reviewtype =="705" || this.reviewtype =="706" || this.reviewtype =="707"
      this.isCharacter = true
      this.titleCharacter = '数据下发审批'
      this.isIssue = true
      this.getCharacterIssueData(characterParmas);
    }
    let recordList =['800','801','802'];//手工数据
    let records =['803','804','805'];//手工数据备案
    if (/^8/.test(this.reviewtype)) {
      if(recordList.indexOf(this.reviewtype)>-1){
          this.isManual = true
          if (this.reviewtype != '801') {this.isApplyer = true} else {this.isApplyer = false}
      }else if(records.indexOf(this.reviewtype)>-1){
          this.isRecord = true
          if (this.reviewtype != '805') {//'803','804'
            this.isApplyerRe = true
            url = URL.url.list; // 申请完结、退回列表
          } else {//'805'
            this.isApplyerRe = false
              url = URL.url.getRecordApproveList; // 待处理列表
          }
          //获取手工数据备案
          let  paraback = {
              page: 1,
              per_page: 9999,
              userName: usernames.username,
              todoPara: sessionStorage.getItem('todoPara') ? sessionStorage.getItem('todoPara') : '',
              todoFlag: sessionStorage.getItem('todoFlag') ? sessionStorage.getItem('todoFlag') : '',
              dataRecordStatus: this.dataRecordStatus
          };
          ajaxGet(url, paraback)
              .then((res) => {
                  let {
                      data: { data, code },
                  } = res;
                  // alert(JSON.stringify(res.data))
                  this.dataList = this.changephotos(data);

              })
              .catch((error) => {
                  // alert(JSON.stringify(error))
                  let omsg = this.outmsg(error);
                  this.closeloading();
                  if (!omsg) {
                      return;
                  }
                  this.actionSheetVisable = true;
                  this.sheet(omsg);
              });
      }
    }
    let parmas = {
      username: usernames.username, //usernames.username
      page: 1,
      per_page: 9999,
      todoPara: sessionStorage.getItem('todoPara') ? sessionStorage.getItem('todoPara') : '',
      todoState: sessionStorage.getItem('todoState') ? sessionStorage.getItem('todoState') : '',
      todoType: sessionStorage.getItem('todoType') ? sessionStorage.getItem('todoType') : '',
      //approveStatus: 1,
    };
    // alert(JSON.stringify(parmas));
    _this.showloading();
    // 获取用户申请列表
    ajaxGet(URL.url.getUserApproveList, parmas)
    // ajaxGet(url, parmas)
      .then((res) => {
        let {
          data: { data, code },
        } = res;
        if (code == "0000") {
          let recordsdata = _this.changephotos(data);
          _this.userlist = recordsdata;
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

      // 获取数据需求申请列表
    let ps2 = {
      userCode: usernames.username,
      userId: usernames.userId,
      page: 1,
      per_page: 9999,
      todoPara: sessionStorage.getItem('todoPara') ? sessionStorage.getItem('todoPara') : '',
      todoState: sessionStorage.getItem('todoState') ? sessionStorage.getItem('todoState') : '',
      todoType: sessionStorage.getItem('todoType') ? sessionStorage.getItem('todoType') : '',
    };
    ajaxGet(URL.url.getApprovalListMobile, ps2)
      .then((rej) => {
        let {
          data: { data, code },
        } = rej;
       if (code == "0000" && data.records.length) {
          let recordsdata = _this.changephotos(data.records);
          _this.requirementlist = recordsdata;
          // alert(JSON.stringify(requirementlist))
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
  beforeRouteLeave(to, from, next) {
    if (to.path == "/home") {
      this.$store.commit({
        type: "changepage",
        pageindex: 2,
      });
      this.$store.commit({
        type: "changetabContent",
        tabContent: 1,
      });
      next();
    } else {
      next();
    }
  },
  data() {
    return {
      isRecord:false,
      isApplyer: false, // 是否为手工数据待处理
      isApplyerR: false, // 是否为手工数据待处理
      isManual: false, // 是否为手工数据
      titleCharacter: '', // 特色需求标题
      isIssue: false, // 是否为特色下发调研
      isCharacter: false, // 是否为特色需求或特色下发调研
      characterList: [], // 特色调研list
      type: "1",
      userlist: [],
      dataList: 'g',
      requirementlist: [],
      reviewtype: "",
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      gsh(val) {
        if (val == "user_update1" || val == "user_update2") {
          return "用户变更申请";
        } else if (val == "user_apply1" || val == "user_apply2") {
          return "用户注册申请";
        } else if (val == "user_delete2" || val == "user_delete2") {
          return "用户注销申请";
        }
      },
    };
  },
};
</script>


<style lang='less' scoped>
@import "~vux/src/styles/1px.less";

.headeruser {
  width: 3.5rem;
  height: 3.5rem;
  background-color: #51b7de;
  border-radius: 50%;
  text-align: center;
  line-height: 3.5rem;
  -moz-border-radius: 50%;
  -webkit-border-radius: 50%;
}
.appfirstbox {
  padding: 0.33rem 0;
  border-bottom: 0.5px solid #eceaea;
  width: 100%;
  background-color: #ffffff;
}
.nodatacss {
  //font-size:0.29rem;
  text-align: center;
  margin-bottom: 0.5rem;
  padding: 0.75rem 0;
}

.diverline {
  background-color: #ececec;
  height: 1rem;
}
.otherreview {
  margin-left: 1rem;
  margin-top: 1rem;
}
.vux-header {
  background-color: white !important;
}
</style>
