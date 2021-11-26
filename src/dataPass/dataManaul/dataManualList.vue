<template>
  <div style="overflow:hidden;">
    <template v-if="batchSwitch">
      <flexbox v-if="!isAssistant" class="appfirstboxt" @click.native="onOrOff(manualStatus, dataList, 'dataList', 'manualStatus')">
        <flexbox-item :span="5">
          <div class="midFontSize">手工数据需求审批 </div>
        </flexbox-item>
        <flexbox-item :span="1">
          <x-icon v-show="!manualStatus" type="ios-arrow-down"></x-icon>
          <x-icon v-show="manualStatus" type="ios-arrow-up"></x-icon>
        </flexbox-item>
        <flexbox-item :span="2.5">
          <x-button
            mini
            style="background: #fff; color: #e64340"
            v-if="batchSwitch && allCheckedOptions.length"
            @click.native="toEdit"
            >批量处理</x-button
          >
        </flexbox-item>
        <flexbox-item :span="1" v-if="dataList.length">
          <div style="display:block;height:0.4rem;width: 0.4rem; background:rgb(170, 23, 23);
            color:#fff;border-radius: 50%;margin-top: -0.07rem;" >
            <b style="padding:0.06rem 0.06rem 0.05rem 0.055rem;font-size: 0.25rem;display: block;text-align: center;">{{dataList.length}}</b>
          </div>
      </flexbox-item>
      </flexbox>
      <div class="parent" v-if="dataList.length">
        <flexbox
          v-for="(item, index) in (isAssistant ? dataList : dataListMid)"
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
              {{ item.dataManualUserName }}
            </div>
            <div class="approvalThing minFontSizemid lineHei overTwo">
              {{ item.dataManualTitle }}
            </div>
          </flexbox-item>
          <flexbox-item>
            <x-button
              class="ljManage minFontSizeMin"
              mini
              type="warn"
              @click.native="toManualDetail(item)"
              >立即处理</x-button
            >
          </flexbox-item>
        </flexbox>
      </div>
      <div v-show="manualStatus" class="nodatacss minFontSizemid" v-else>暂无数据</div>
    </template>
    <template v-else>
      <flexbox
        class="appfirstboxt"
      >
        <el-checkbox
          :indeterminate="isIndeterminate"
          v-model="checkAll"
          class="my-el-checkbox"
          style="position: relative"
        >
          <div
            style="
              position: absolute;
              left: -6px;
              top: -3px;
              width: 30px;
              height: 10vh;
              z-index: 99;
            "
            @click="handleCheckAllChange()"
          ></div>
        </el-checkbox>
        <flexbox-item :span="5">
          <div><span class="midFontSize">手工数据审批</span></div>
        </flexbox-item>
        <flexbox-item :span="3">
          <x-button mini type="warn" @click.native="dealAllHandler"
            >批量处理</x-button
          >
        </flexbox-item>
        <flexbox-item :span="2">
          <x-button
            mini
            style="background: #fff; color: #656565"
            @click.native="toEdit"
            >取消</x-button
          >
        </flexbox-item>
      </flexbox>
      <template v-if="dataList.length">
        <div class="parent">
          <el-checkbox-group v-model="checkedLists">
            <el-checkbox
              v-for="item in dataList"
              :label="item.dataManualId"
              :key="item.dataManualId"
              :disabled="checkboxT(item)"
              class="appfirstbox"
              style="position: relative"
            >
              <div
                style="
                  position: absolute;
                  width: 0.5rem;
                  left: 0;
                  top: 2px;
                  bottom: 2px;
                  z-index: 99;
                "
                v-show="!checkboxT(item)"
                @click="setCheckMyselfUser(item.dataManualId)"
              ></div>
              <div style="display: flex">
                <div style="width: 1.2rem">
                  <img
                    v-if="item.mxUserInfo"
                    class="img"
                    :src="item.mxUserInfo.avatarUrl"
                  />
                  <img v-else class="img" src="static/title_picture.png" />
                </div>
                <div class="myflexItem">
                  <div class="approvalpeople minFontSize">
                    {{ item.dataManualUserName }}
                  </div>
                  <div class="approvalThing minFontSizemid lineHei overone">
                    {{ item.dataManualTitle }}
                  </div>
                </div>
              </div>
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </template>
      <template v-else>
        <div class="nodatacss minFontSizemid">暂无数据</div>
      </template>
      <actionsheet
        v-model="msgShow"
        :menus="menusall"
        :close-on-clicking-mask="false"
      ></actionsheet>
      <div>
        <popup v-model="batchReviewVisible" :hide-on-blur="false">
          <popup-header
            left-text="取消"
            right-text="确定"
            title="请选择"
            :show-bottom-border="false"
            @on-click-left="batchReviewVisible = false"
            @on-click-right="rightReviewSubmit"
          ></popup-header>
          <group gutter="0">
            <radio :options="selectlist" v-model="approvalOption"></radio>
          </group>
        </popup>
      </div>
    </template>
  </div>
</template>
<script>
import { ajaxGet, ajaxPost } from "../../core/mxApi";
import minxin from "@/common/commonfunction.js";
import { mapMutations } from "vuex";
import { setCheckMyselves } from "@/common/commonfunction.js";
const URL = require("../asssets/Api/api");
import { PopupHeader, Popup, TransferDom, Radio } from 'vux'
export default {
  props: {
    isApplyer: {
      // 是否为申请人查看
      type: Boolean,
      default: false,
    },
    approveStatus: {
      type: String,
      default: "",
    },
    isAssistant: {
      // 是否是智能助理 若为智能助理 则不显示标题
      type: Boolean,
      default: false,
    }
  },
  data() {
    return {
      //手工数据需求审批展开/收起
      manualStatus: 0,
      //手工数据需求审批列表-展开/收起
      dataListMid: [],
      currentUser: JSON.parse(sessionStorage.getItem("currentUser")),
      dataList: [],
      batchSwitch: true, // 批量处理开关
      isIndeterminate: false,
      checkAll: false,
      checkedLists: [], // 被选中数据list
      allCheckedOptions: [], // 所有可被选中项
      batchReviewVisible: false,
      msgShow: false,
      selectlist: [
        { key: "1", value: "同意" },
        { key: "0", value: "退回" },
      ],
      approvalOption: "", // 批量审批意见
    };
  },
  components: {
    PopupHeader,
    Popup,
    Radio,
  },
  mixins: [minxin],
  mounted() {
    this.getData();
  },
  watch: {
    isApplyer: {
      handler() {
        this.getData();
      },
      deep: true,
    },
  },
  methods: {
    onOrOff(status, list, name1, name2){
      if(!status) this.turnOn(list, name1, name2);
      if(status) this.turnOff(list, name1, name2);
      else return
    },
    //展开
    turnOn(list, name, status){
      this[`${name}Mid`] = list;
      this[status] = !this[status];
    },
    //收起
    turnOff(list, name, status){
      if(this[`${name}`].length != 0){
        this[`${name}Mid`] = [];
        this[status] = !this[status];
      }else{
        if(list.length){
          this[`${name}`] = list;
        }else{//暂无数据的时候
          this[status] = 0;
        }
      }
    },
    // 批量审批 审批
    rightReviewSubmit() {
      let dataManual = [];
      this.checkedLists.forEach((id) => {
        this.dataList.forEach((item) => {
          if (id === item.dataManualId) {
            dataManual.push({
              id: item.id,
              dataManualId: item.dataManualId,
              node: item.node,
            });
          }
        });
      });
      let data = {
        dataManual: JSON.stringify(dataManual),
        userName: JSON.parse(sessionStorage.getItem("currentUser")).username,
        approveOption: this.approvalOption,
      };
      ajaxPost(URL.url.batchManual, JSON.stringify(data))
        .then((res) => {
          this.getData();
          this.batchSwitch = true, // 批量处理开关
          this.isIndeterminate = false,
          this.checkAll = false,
          this.checkedLists = [], // 被选中数据list
          this.allCheckedOptions = [], // 所有可被选中项
          this.batchReviewVisible = false,
          tshia.approvalOption = ""
          this.msgShow = true
          this.sheet("提交成功");
        })
        .catch((error) => {
          let omsg = this.outmsg(error);
          this.closeloading();
          if (!omsg) {
            return;
          }
          this.msgShow = true;
          this.sheet(omsg);
        });
    },
    dealAllHandler() {
      if (!this.checkedLists.length) {
        this.msgShow = true;
        this.sheet("至少选择一条数据");
      } else {
        this.batchReviewVisible = true;
      }
    },
    // CheckBox选中用户审批
    toEdit() {
      this.batchSwitch = !this.batchSwitch;
      if (this.batchSwitch) {
        this.checkedLists = [];
        this.checkAll = false;
      }
    },
    // 是否可被选择
    checkboxT(row) {
      if (row.node == "5") {
        return false;
      } else {
        return true;
      }
    },
    // 全选框改变时
    handleCheckAllChange() {
      this.checkAll = !this.checkAll;
      let val = this.checkAll;
      this.checkedLists = val ? this.allCheckedOptions : [];
      this.isIndeterminate = false;
    },
    setCheckMyselfUser(item) {
      let linshi = this.allCheckedOptions.slice(0);
      this.checkedLists = setCheckMyselves(item, this.checkedLists);
      this.allCheckedOptions = linshi;
      setTimeout(() => {
        this.handleCheckedChange(this.checkedLists);
      });
    },
    handleCheckedChange(value) {
      let checkedCount = value.length;
      this.checkAll = checkedCount === this.allCheckedOptions.length;
      this.isIndeterminate =
        checkedCount > 0 && checkedCount < this.allCheckedOptions.length;
    },
    changephotos(data) {
      let usercd = JSON.parse(sessionStorage.getItem("jzUser"));
      let earacode = usercd.avatar_url.split("/");
      data.length &&
        data.forEach((item) => {
          if (item.mxUserInfo) {
            item.mxUserInfo.avatarUrl = `${earacode[0]}//${earacode[2]}${item.mxUserInfo.avatarUrl}`;
          }
          if (item.node == "5") {
            this.allCheckedOptions.push(item.dataManualId);
          }
        });
      return data;
    },
    getData() {
      const params = {
        page: 1,
        per_page: 9999,
        approveStatus: 0,
        userName: this.currentUser.username,
        todoPara: this.$route.query.todoPara,
        todoFlag: this.$route.query.todoFlag,
      };
      let url = "";
      if (this.isApplyer) {
        url = URL.url.getManualApplyList; // 申请列表
      } else {
        url = URL.url.getManualDealList; // 待处理列表
      }
      ajaxGet(url, params)
        .then((res) => {
          let {
            data: { data, code },
          } = res;
          this.dataList = this.changephotos(data);
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
    // 跳转到详情页
    toManualDetail(item) {
      let type = "";
      this.$router.push({
        name: "dataManualDetail",
        query: {
          isApplyer:this.isApplyer,
          dataManualId: item.dataManualId,
          id: item.id,
          //type: item.todoType,
          status: item.dataManualStatus ? item.dataManualStatus : "",
          node: item.node,
          dataManualUserId: item.dataManualUserId, // 发起人
          userName: item.dataManualUser, // 发起人
        },
      });
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
.appfirstboxt {
  margin-top: 22px;
  padding: 0.35rem 0 0.25rem 4%;
  max-height: 15rem;
  overflow: scroll;
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
.img {
  width: 86%;
  vertical-align: middle;
}
.myflexItem {
  word-break: break-all;
  padding-left: 0.3rem;
  width: 5rem;
}
.approvalpeople{
  color:#333333 !important;
  padding-top:0.1rem;
  margin-bottom:0.2rem;
}
.my-el-checkbox{
  /deep/ .el-checkbox__inner{top:4px;}
}
</style>
