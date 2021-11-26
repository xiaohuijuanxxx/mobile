<template>
  <div>
    <div class="parent" v-if="needData != ''">
      <flexbox
        v-for="(item, index) in tRequirementlistMid"
        :key="index"
        class="appfirstbox"
      >
        <flexbox-item :span="2">
          <img
            v-if="item.mxUserInfo"
            style="width: 86%"
            :src="item.mxUserInfo.avatarUrl"
          />
          <img v-else style="width: 86%" src="static/title_picture.png" />
        </flexbox-item>
        <flexbox-item :span="6" class="myFlexItem">
          <div class="approvalPeople minFontSize">
            {{ item.createName }}
          </div>
          <div class="approvalThing minFontSizemid lineHei overTwo" v-if="!isIssue">
            {{ item.portalQaTitle }}
          </div>
          <div class="approvalThing minFontSizemid lineHei overTwo" v-else>
            {{ item.dwpDataApplyTitle }}
          </div>
        </flexbox-item>
        <flexbox-item>
          <x-button
            class="ljManage minFontSizeMin"
            mini
            type="warn"
            @click.native="toCharacterNeedDetail(item)"
            >立即处理</x-button
          >
        </flexbox-item>
      </flexbox>
    </div>
    <div v-show="tRequireStatus" class="nodatacss minFontSizemid" v-else>暂无数据</div>
  </div>
</template>
<script>
import { ajaxGet, ajaxPost } from "../../core/mxApi";
import minxin from "@/common/commonfunction.js";
import { mapMutations } from 'vuex';
const URL = require("../asssets/Api/api");
export default {
  props: {
    isIssue: {
      type: Boolean,
      default: false,
    },
    tRequirementlistMid: {
      type: Array,
    },
    tRequireStatus: {
      type: Boolean,
      default: false,
    }
  },
  mixins: [minxin],
  data() {
    return {
      needData: [],
      page: {
        currentPage: 1,
        pageSize: 9999,
      },
      userInfo: JSON.parse(sessionStorage.getItem("currentUser")),
    };
  },
  created() {
    const signs = JSON.parse(sessionStorage.getItem('signs'))
    this.getAllData(signs);
  },
  mounted() {},
  methods: {
    ...mapMutations(['setCharacterSurveyNotMobile', 'setCharacterIssueNotMobile']),
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
    // 获取特色需求所有 列表数据
    getAllData(signs) {
      let url = "";
      if (this.isIssue) {
         url = URL.url.getCharacterIssueAllData;
       } else {
        url = URL.url.getCharacterAllData;
      }
      const parmas = {
        page: this.page.currentPage,
        per_page: this.page.pageSize,
        userName: this.userInfo.username,
        roles: signs,
        isTodo: 'N'
      };
      ajaxGet(url, parmas)
        .then((res) => {
          let {
            data: { data, code },
          } = res;
          let recordsdata = this.changephotos(data);
          //   node
          //   1 部门审批    2 接口人审批    3 处理人审批    4 接口人待复核
          if (this.isIssue) {
            // 特色数据下发所有流程均可在移动端进行审批
            this.needData = recordsdata
            console.log(this.needData)
            this.$emit('showlist', this.needData, 'dataDownlist', 'dataDownStatus')
            // recordsdata.forEach((item) => {
            //  let not = []
           // if (item.node != 4) {
           //   this.needData.push(item);
          //  } else {
           //   not.push(item)
          //  }
         // });
         // this.setCharacterIssueNotMobile(not)
          } else {
            let not = []
            recordsdata.forEach((item) => {
              if (item.node == 1 || item.node == 3) {
                this.needData.push(item);
              } else {
                not.push(item)
              }
            });
            this.$emit('showlist', this.needData, 'tRequirementlist', 'tRequireStatus')
            this.setCharacterSurveyNotMobile(not)
          }
        })
        .catch((error) => {
          this.sheet(error);
        });
    },
    // 跳转详情
    toCharacterNeedDetail(item) {
      //   node
      //   1 部门审批    3 处理人审批
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
        } else if(item.node == 3) {
          name = 'characterIssueHandlerDeal'
           status = item.dwpDataDealStatus
          level  = item.dwpDataDealLevel
          dwpType = item.dwpDataDealType
        }
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
        // 特色需求流程
        if (item.node == 1) {
          this.push({
            name: "characterSurvey",
            //params: { portalQaId: item.portalQaId },
            query: { portalQaId: item.portalQaId }
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
  },
};
</script>
<style scoped lang="less">
.appfirstbox {
  padding: 0.33rem 0;
  border-bottom: 0.5px solid #eceaea;
  width: 100%;
  background-color: #ffffff;
}
.myflexItem {
  word-break: break-all;
  padding-left: 0.3rem;
  width: 5rem;
}
.overone {
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.nodatacss {
  font-size: 0.3rem;
  text-align: center;
  color: #656565;
  padding: 0.5rem 0 0.75rem 0;
  background-color: #ffffff;
}
</style>