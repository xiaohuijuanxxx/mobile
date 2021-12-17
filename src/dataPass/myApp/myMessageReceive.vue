<template>
  <div :class="[receiveHeader ? 'haveTop' : '', 'receiveCon']">
    <!-- margin-top:0.92rem; -->
    <div
      class="minFontSize search-parent"
      v-if="receiveHeader"
      ref="searchParent"
    >
      <search
        @on-result-click="resultClick"
        @on-change="getResult"
        :results="results"
        v-model="value"
        placeholder="请输入邮件名称/内容"
         auto-scroll-to-top
        :auto-fixed="false"
        @on-focus="onFocus"
        @on-cancel="onCancel"
        @on-blur="onblur"
        @on-submit="onSubmit"
        class="my_search"
        ref="search"
      ></search>
    </div>
    <div>
      <div v-show="myReceive" style="margin-top: 1rem">
        <Myscroll
          ref="wrapper"
          class="wrapper"
          :data="data"
          :pulldown="pulldown"
          @pulldown="loadData"
          :listenScroll="listenScroll"
          @scroll="handlerScroll"
          :isLoadding.sync="isLoadding"
        >
          <div class="content" ref="content">
            <spinner
              v-if="isLoadding == 1"
              type="ios"
              style="
                position: absolute;
                top: -60px;
                width: 100%;
                text-align: center;
              "
            ></spinner>
            <div style="height: 45px" v-show="dataList.length">
              <flexbox :gutter="0" style="text-align: center">
                <flexbox-item>
                  <div
                    class="approvalPeople minFontSize"
                    @click="unreadList"
                    v-show="listJudge"
                  >
                    <img
                      style="width: 12%; vertical-align: middle"
                      src="static/unread.png"
                    />
                    未读
                  </div>
                  <div
                    class="approvalPeople minFontSize"
                    @click="allList"
                    v-show="!listJudge"
                  >
                    <img
                      style="width: 12%; vertical-align: middle"
                      src="static/unread.png"
                    />
                    全部
                  </div>
                </flexbox-item>
                <flexbox-item>
                  <div class="approvalPeople minFontSize" @click="editButton">
                    <img
                      style="width: 12%; vertical-align: middle"
                      src="static/edit.png"
                    />
                    编辑
                  </div>
                </flexbox-item>
              </flexbox>
            </div>
            <template v-if="dataList.length">
              <div v-for="(item, index) in dataList" :key="item.messageRcvId">
                <swipeout>
                  <swipeout-item transition-mode="follow" @on-open="swipeoutOpen(index)" ref="rcvId">
                    <div slot="right-menu">
                      <swipeout-button
                      v-if="item.messageCheckStatus == '0'"
                        @click.native="onButtonClick(item)"
                        background-color="#999999"
                      >
                        <img style="width: 30%" src="static/readIcon.png" />
                        <div>标记已读</div>
                      </swipeout-button>
                      <swipeout-button
                        @click.native="doDeleteClick(item)"
                        type="warn"
                      >
                        <img style="width: 30%" src="static/deleteIcon.png" />
                        <div>删除</div>
                      </swipeout-button>
                    </div>
                    <div
                      slot="content"
                      class="demo-content parent launchContent"
                      @click="gotoUserDetail(item)"
                      style="
                        border-bottom: 0.01rem solid #e3e4e5;
                        margin: 0 0.2rem;
                        padding-top: 0.44rem;
                      "
                    >
                      <flexbox style="display: flex; align-self: flex-start">
                        <flexbox-item :span="2" >
                          <!-- 用户头像 -->
                          <img v-if="item.sendUserName.includes('admin')" style="width:86%;" 
                          src="static/admin-logo.png"
                           />
                          <img
                          v-else-if="item.mxUserInfo"
                            style="width: 86%"
                            :src="item.mxUserInfo.avatarUrl"
                          />
                          
                          <img v-else style="width: 86%" src="static/title_picture.png" />
                        </flexbox-item>
                        <flexbox-item class="myFlexItem">
                          <flexbox orient="vertical" :gutter="0">
                            <flexbox-item style="margin-bottom: 0.1rem">
                              <flexbox>
                                <flexbox-item :span="9 / 12">
                                  <flexbox>
                                    <badge
                                      v-if="item.messageCheckStatus == 0"
                                      class="redDot"
                                    ></badge>
                                    <div class="minFontSize">
                                      {{
                                        item.sendUserName.substr(
                                          0,
                                          item.sendUserName.indexOf("/")
                                        )
                                      }}
                                    </div>
                                    <img
                                      v-if="item.attachmentPath !== '[]'"
                                      style="
                                        width: 7%;
                                        vertical-align: middle;
                                        margin-left: 0.15rem;
                                      "
                                      src="static/accessory.png"
                                    />
                                  </flexbox>
                                </flexbox-item>
                                <flexbox-item :span="3 / 12">
                                  <flexbox>
                                    <div
                                      class="approvalThing minFontSizemid lineHei overtime"
                                    >
                                      {{
                                        item.messageSendTime.substring(5, 10)
                                      }}
                                    </div>
                                    <img
                                      style="
                                        width: 13%;
                                        vertical-align: middle;
                                        margin-left: 0.1rem;
                                      "
                                      src="static/more.png"
                                    />
                                  </flexbox>
                                </flexbox-item>
                              </flexbox>
                            </flexbox-item>
                            <flexbox-item style="margin-bottom: 0.1rem">
                              <div class="minFontSizemid lineHei overone">
                                {{ item.messageTitle }}
                              </div>
                            </flexbox-item>
                            <flexbox-item
                              style="
                                min-height: 0.66rem;
                                margin-bottom: 0.12rem;
                              "
                            >
                              <div
                                class="appThing minFontSizemid overtwo lineHei"
                              >
                                {{ item.messageContent }}
                              </div>
                            </flexbox-item>
                          </flexbox>
                        </flexbox-item>
                      </flexbox>
                    </div>
                  </swipeout-item>
                </swipeout>
              </div>
            </template>
            <template v-else>
              <div class="nodatacss minFontSizemid">暂无数据</div>
            </template>
          </div>
        </Myscroll>
      </div>

      <div v-show="!myReceive">
        <template v-if="dataList.length">
          <div
            class="demo-content parent launchContent weui-actionsheet__action"
            style="margin-bottom: 10vh; margin-top: 0"
          >
            <el-checkbox-group
              v-model="checkedLists"
              @change="handleCheckedListsChange"
            >
              <el-checkbox
                v-for="item in dataList"
                :key="item.messageRcvId"
                :label="item.messageRcvId"
                style="
                  border-bottom: 0.01rem solid #e3e4e5;
                  width: 100%;
                  padding-top: 0.44rem;
                "
                @change="changeCheck"
              >
                <div
                  style="
                    position: absolute;
                    width: 0.5rem;
                    height: 0.5rem;
                    left: 0;
                    top: 32px;
                    z-index: 99;
                  "
                  @click="setCheckMyself(item.messageRcvId)"
                ></div>
                <div style="display: flex; align-self: flex-start">
                  <div style="text-align: center;">
                    <img
                          v-if="item.mxUserInfo"
                            style="width: 86%;"
                            :src="item.mxUserInfo.avatarUrl"
                            class="user-header-img"
                          />
                          <img v-else-if="item.sendUserName.includes('admin')" style="width:86%;"  class="user-header-img" src="static/admin-logo.png"
                           />
                          <img v-else style="width: 86%"  class="user-header-img" src="static/title_picture.png" />
                  </div>
                  <div class="myFlexItem" style="width: 80%;">
                    <flexbox orient="vertical" :gutter="0">
                      <flexbox-item style="margin-bottom: 0.1rem">
                        <flexbox>
                          <flexbox-item :span="2 / 3">
                            <div style="display: flex; width: 5rem">
                              <div
                                class="redDot"
                                v-if="item.messageCheckStatus == 0"
                              >
                                <badge></badge>
                              </div>
                              <div class="minFontSize" style="color: #323232">
                                {{
                                  item.sendUserName.substr(
                                    0,
                                    item.sendUserName.indexOf("/")
                                  )
                                }}
                              </div>
                              <img
                                v-if="item.attachmentPath !== '[]'"
                                style="
                                  width: 5%;
                                  height: 5%;
                                  vertical-align: middle;
                                  margin-left: 0.15rem;
                                "
                                src="static/accessory.png"
                              />
                            </div>
                          </flexbox-item>
                          <flexbox-item :span="1 / 3">
                            <flexbox>
                              <div
                                class="approvalThing minFontSizemid lineHei overtime"
                              >
                                {{ item.messageSendTime.substring(5, 10) }}
                              </div>
                              <img
                                style="
                                  width: 7%;
                                  vertical-align: middle;
                                  margin-left: 0.1rem;
                                "
                                src="static/more.png"
                              />
                            </flexbox>
                          </flexbox-item>
                        </flexbox>
                      </flexbox-item>
                      <flexbox-item style="margin-bottom: 0.1rem;">
                        <div
                          class="minFontSizemid lineHei overMessageTitle"
                          style="color: #323232"
                        >
                          {{ item.messageTitle }}
                        </div>
                      </flexbox-item>
                      <flexbox-item
                        style="min-height: 0.66rem; margin-bottom: 0.12rem"
                      >
                        <div
                          class="appThing minFontSizemid overMessageContent lineHei"
                        >
                          {{ item.messageContent }}
                        </div>
                      </flexbox-item>
                    </flexbox>
                  </div>
                </div>
              </el-checkbox>
            </el-checkbox-group>
          </div>
        </template>
        <template v-else>
          <div class="nodatacss">暂无数据</div>
        </template>
        <tabbar v-model="witchchoose" class="myTab">
          <tabbar-item @on-item-click="doBatchDelete">
            <img
              v-if="witchchoose == 0"
              slot="icon"
              src="../asssets/images/messageDelete.png"
            />
            <img v-else slot="icon" src="static/home_firstDefault.png" />
            <span slot="label" class="tabText">删除</span>
          </tabbar-item>
        </tabbar>
        <!-- <div class="myTab tabBox" style="z-index: 99">
          <div @click="doBatchDelete" class="tabCon">
            <img
              class="approvalPeople minFontSize"
              src="../asssets/images/messageDelete.png"
            />
            <span class="approvalPeople minFontSize lineHei">删除</span>
          </div>
        </div> -->
      </div>
    </div>
    <actionsheet
      v-model="hint"
      :menus="menusall"
      @on-click-menu-delete="toDeleteClick"
      show-cancel
      :close-on-clicking-mask="false"
    ></actionsheet>
    <actionsheet
      v-model="remind"
      :menus="menusall"
      @on-click-menu-delete="toBatchDelete"
      show-cancel
      :close-on-clicking-mask="false"
    ></actionsheet>
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
  </div>
</template>

<script>
import { Swipeout, SwipeoutItem, SwipeoutButton, Badge } from "vux";
let URL = require("../asssets/Api/api");
import { ajaxGet, ajaxPost } from "../../core/mxApi";
import minxin from "@/common/commonfunction.js";
import { setCheckMyselves } from "@/common/commonfunction.js";
import Bus from "@/bus/bus";
import { mapMutations } from 'vuex';
import BScroll from "better-scroll";
import Myscroll from "@/common/myscroll.vue";
export default {
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Badge,
    Myscroll,
  },
  // props: {
  //   headerHeight: {
  //     type: Number
  //   }
  // },
  computed: {
    tabbarHeight() {
      return this.$store.state.tabbarHeight;
    },
  },
  mixins: [minxin],
  data() {
    return {
      data: [], // 下拉刷新的的数据
      isLoadding: 0, // 0还没下拉 1 下拉中
      pulldown: true, // 开启下拉刷新监听
      listenScroll: true, // 开启滚动监听
      witchchoose: 0,
      dataList: [],
      messageRcvIdList: [],
      myReceive: true,
      receiveHeader: true,
      checkedLists: [],
      multipleSelection: [],
      dataUser: [],
      hint: false,
      remind: false,
      itemList: [],
      results: [],
      value: "",
      open: true,
      listJudge: true,
      slideMessageRcvId: '', // 左滑时的index
    };
  },
  created() {
    this.getTable();
  },
  mounted() {
    document.documentElement.scrollTop = 0
    let hei =
      document.body.offsetHeight - 46 - this.$refs.search.$el.offsetHeight; //this.headerHeight //this.$refs.header.$el.offsetHeight //- this.tabbarHeight;
    this.$refs.wrapper.$el.style.cssText = "height:" + hei + "px";
    const conHei = hei + 48;
    this.$refs.content.style.cssText = "min-height:" + conHei + "px";
    this.init();
    setTimeout(() => {
      this.initScroll();
    }, 500);
  },
  methods: {
    ...mapMutations(['setTransitionName']),
    // 右滑时
    swipeoutOpen(index) {
      if (index != this.slideMessageRcvId && this.slideMessageRcvId !== '') {
        this.$refs.rcvId[this.slideMessageRcvId].close()
      }
      this.slideMessageRcvId = index
    },
    // 滚动到指定位置
    scrollToPosi() {
      if (this.dataList != "") {
        this.$refs.wrapper.scroll.scrollTo(0, -48, 500)
      }
    },
    // 监听滚动事件
    handlerScroll(pos) {
      if (pos.y > 50) {
        this.isLoadding = 1;
      }
    },
    // 下拉刷新
    loadData(e) {
      let hei =
        document.body.offsetHeight - 46 - this.$refs.search.$el.offsetHeight; //this.$refs.header.$el.offsetHeight - this.tabbarHeight;
      this.$refs.wrapper.$el.style.cssText = "height:" + hei + "px";
      const conHei = hei + 48;
      this.$refs.content.style.cssText = "min-height:" + conHei + "px";
      this.$route.query.todoPara = ''
      this.$route.query.todoFlag = ''
      this.getTable();
    },
    // 初始化数据
    init() {
      Bus.$on("initRe", () => {
        this.receiveHeader = true;
        this.myReceive = true;
      });
    },
    setCheckMyself(item) {
      this.checkedLists = setCheckMyselves(item, this.checkedLists);
    },
    changeCheck(val) {},
    setFocus() {
      this.$refs.search.setFocus();
    },
    resultClick(item) {
      this.$refs.search.setBlur();
      this.getTable(this.value);
    },
    getResult(val) {
      let rs = [];
      rs.push({
        title: val,
      });
      this.results = rs;
    },
    onSubmit() {
      this.$refs.search.setBlur();
      this.getTable(this.value);
    },
    onFocus() {
      let _this = this;
      Bus.$emit("isSearchFocus", true);
      let h = document.documentElement.scrollTop; // + document.documentElement.clientHeight
      this.$refs.searchParent.style.cssText =
        "position:absolute !important;top:" + h + "px !important;";
      this.$refs.search.$el.style.cssText =
        "position:absolute !important;top:0.92rem !important;z-index:999999;";
      window.ontouchmove = function (e) {
        _this.$refs.search.setBlur();
      };
    },
    onblur() {
      Bus.$emit("isSearchFocus", false);
      this.$refs.searchParent.style.cssText = "";
      this.$refs.search.$el.style.cssText = "";
      //this.onCancel()
      window.ontouchmove = "";
      this.isTextArea = false;
    },
    onCancel() {
      this.value = "";
      this.getTable(this.value);
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
    getTable(e) {
      let _this = this;
      _this.showloading();
      let usernames = JSON.parse(sessionStorage.getItem("currentUser"));
      let parmas = {
        rcvUserCode: usernames.username,
        page: 1,
        per_page: 9999,
        keyWord: e == undefined ? "" : encodeURIComponent(e),
        checkStatus: "",
        sendUserCode: "",
        todoPara: this.$route.query.todoPara ? this.$route.query.todoPara : '',
        todoFlag: this.$route.query.todoFlag ? this.$route.query.todoFlag : '',
        rcvDate: null,
      };
      ajaxGet(URL.url.getMessageReceive, parmas)
        .then((res) => {
          this.isLoadding = 0;
          _this.dataList = this.changephotos(res.data.data);
          this.data = res.data.data;
          _this.ifShow(_this.dataList);
          _this.closeloading();
          setTimeout(() => {
            this.scrollToPosi();
          },500)
        })
        .catch((err) => {
          this.isLoadding = 0;
          let omsg = _this.outmsg(err);
          _this.closeloading();
           setTimeout(() => {
            this.scrollToPosi();
          },500)
          if (!omsg) {
            return;
          }
          _this.actionSheetVisable = true;
          _this.sheet(omsg);
        });
    },
    gotoUserDetail(item) {
      this.setTransitionName('')
      this.$router.push({ name: "messageReceiveDetail", query: item });
      this.onButtonClick(item);
    },
    doDeleteClick(item) {
      this.itemList = item;
      this.hint = true;
      this.sheet("确定要删除吗？");
    },
    toDeleteClick() {
      this.messageRcvIdList.push(this.itemList.messageRcvId);
      let data = { messageRcvIdList: this.messageRcvIdList, messageType: "in" };
      ajaxPost(URL.url.doDeleteMessageReceive, JSON.stringify(data))
        .then((res) => {
          this.getTable();
          this.closeloading();
          this.actionSheetVisable = true;
          this.sheet("删除成功");
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
    },
    doBatchDelete() {
      if (this.checkedLists == 0) {
        this.actionSheetVisable = true;
        this.sheet("请选择一条信息");
      } else {
        this.remind = true;
        this.sheet("确定要删除吗？");
      }
    },
    toBatchDelete() {
      let data = { messageRcvIdList: this.checkedLists, messageType: "in" };
      ajaxPost(URL.url.doDeleteMessageReceive, JSON.stringify(data))
        .then((res) => {
          this.getTable();
          this.closeloading();
          this.actionSheetVisable = true;
          this.sheet("删除成功");
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
    },
    ifShow(data) {
      Bus.$on("select", (raOrder) => {
        if (raOrder == 0) {
          data.forEach((res) => {
            this.dataUser.push(res.messageRcvId);
          });
        } else if (raOrder == 1) {
          this.dataUser = [];
        } else if (raOrder == 2) {
          this.dataUser = [];
          this.receiveHeader = true;
          this.myReceive = true;
        }
        this.checkedLists = this.dataUser;
        // this.scrollEventRe()
        // this.watchScrollRe();
      });
    },
    editButton() {
      Bus.$emit("removeEvent");
      this.myReceive = false;
      this.receiveHeader = false;
      Bus.$emit("on", this.open);
    },
    unreadList() {
      this.listJudge = false;
      let newArr = [];
      this.dataList.forEach((res) => {
        if (res.messageCheckStatus == 0) {
          newArr.push(res);
        }
      });
      this.dataList = newArr;
    },
    allList() {
      this.listJudge = true;
      this.getTable();
    },
    onButtonClick(item) {
      this.messageRcvIdList.push(item.messageRcvId);
      let data = { messageRcvStatusList: this.messageRcvIdList };
      ajaxPost(URL.url.updateCheckStatus, JSON.stringify(data))
        .then((res) => {
          this.getTable();
          this.closeloading();
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
    },
  },
};
</script>

<style lang='less' scoped>
@import "~vux/src/styles/1px.less";
.wrapper {
  overflow: hidden;
}
.content {
  position: relative;
  padding-bottom: 0.36rem;
}
.receiveCon {
  box-sizing: border-box;
  width: 100%;
  overflow: hidden;
  background-color: #fafafa;
}
.haveTop {
  margin-top: 0.92rem;
}
.overone {
  width: 90%;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.overtwo {
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -moz-box;
  -moz-line-clamp: 2;
  -moz-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}
.overtime {
  text-align: center;
  color: #9b9b9b;
}
.overMessageTitle {
  width: 66vw;
  text-overflow: ellipsis;
  white-space: nowrap;
  overflow: hidden;
}
.overMessageContent {
  width: 90%;
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  display: -moz-box;
  -moz-line-clamp: 2;
  -moz-box-orient: vertical;
  word-wrap: break-word;
  word-break: break-all;
  white-space: normal;
}
.nodatacss {
  font-size: 0.3rem;
  text-align: center;
  color: #656565;
  padding: 0.5rem 0 0.75rem 0;
  background-color: #ffffff;
  position: absolute;
  bottom: 0;
  right: 0;
  left: 0;
  top: 0;
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
.redDot {
  display: inline-block;
  margin-right: 0.1rem;
}
// .tabBox {
//   width: 100%;
//   height: 10%;
//   background: #ffffff;
//   text-align: center;
// }
.tabCon {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  img {
    width: 0.38rem;
  }
  span {
    padding-left: 10px;
    color: #e92323;
    display: block;
  }
}
.appThing {
  color: #9b9b9b;
}
.el-checkbox {
  /deep/.el-checkbox__inner {
    border-radius: 50%;
    width: 0.5rem;
    height: 0.5rem;
    position: relative;
  }
  /deep/.el-checkbox {
    color: #323232;
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #323232;
    text-align: center;
  }
  /deep/.el-checkbox__label {
    font-weight: normal !important;
  }
  /deep/.el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #ee554b;
    border-color: #ee554b;
    text-align: center;
  }
  /deep/.el-checkbox__input .el-checkbox__inner::after {
    border: 2px solid #fff;
    box-sizing: content-box;
    content: "";
    border-left: 0;
    border-top: 0;
    height: 0.25rem;
    left: 0.15rem;
    position: absolute;
    top: 0.07rem;
    width: 0.1rem;
    transform: rotate(45deg) scaleY(1);
    z-index: 1;
  }
}
.my_search {
  /deep/ .weui-search-bar__box {
    .weui-icon-search {
      line-height: 0.65rem !important;
    }
  }
}
.search-parent {
  background: #ffffff;
  position: fixed;
  z-index: 99;
  width: 100%;
}
.user-header-img{position:relative;top:0.3rem;}
</style>