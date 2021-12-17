<template>
  <div :class="[myLaunchHeader ? 'haveTop' : '', 'receiveCon']">
    <div
      v-if="myLaunchHeader"
      class="minFontSize search-parent"
      ref="searchParent"
    >
      <search
        @result-click="resultClick"
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
      <div v-show="myLaunch" style="margin-top: 1rem">
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
                  <div class="approvalPeople minFontSize" @click="editButton">
                    <img
                      style="width: 6%; vertical-align: middle"
                      src="static/edit.png"
                    />
                    编辑
                  </div>
                </flexbox-item>
              </flexbox>
            </div>
            <template v-if="dataList.length">
              <div v-for="(item, index) in dataList" :key="item.messageSendId">
                <swipeout>
                  <swipeout-item transition-mode="follow" @on-open="swipeoutOpen(index)" ref="rcvId">
                    <div slot="right-menu">
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
                        <flexbox-item :span="2">
                          <img
                            style="width: 86%"
                            src="static/title_picture.png"
                          />
                          <!-- 用户头像 -->
                          <!-- <img v-if="item.sendUserName.includes('admin')" style="width:86%;" 
                          src="static/admin-logo.png"
                           />
                          <img
                          v-else-if="item.mxUserInfo"
                            style="width: 86%"
                            :src="item.mxUserInfo.avatarUrl"
                          />
                          
                          <img v-else style="width: 86%" src="static/title_picture.png" /> -->
                        </flexbox-item>
                        <flexbox-item class="myFlexItem">
                          <flexbox orient="vertical" :gutter="0">
                            <flexbox-item style="margin-bottom: 0.1rem">
                              <flexbox>
                                <flexbox-item :span="9 / 12">
                                  <flexbox>
                                    <div class="minFontSize">{{ name }}</div>
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
      <div v-show="!myLaunch">
        <template v-if="dataList.length">
          <div
            class="demo-content parent launchContent weui-actionsheet__action"
            style="margin-bottom: 10vh; margin-top: 0"
          >
            <el-checkbox-group
              v-model="checkedUsers"
              @change="handleCheckedListsChange"
            >
              <el-checkbox
                v-for="item in dataList"
                :key="item.messageSendId"
                :label="item.messageSendId"
                style="
                  border-bottom: 0.01rem solid #e3e4e5;
                  width: 100%;
                  padding-top: 0.44rem;
                "
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
                  @click="setCheckMyself(item.messageSendId)"
                ></div>
                <div style="display: flex; align-self: flex-start">
                  <div style="text-align: center">
                    <img
                      style="width: 86%; vertical-align: middle"
                      src="static/title_picture.png"
                    />
                  </div>
                  <div class="myFlexItem" style="width: 80%">
                    <flexbox orient="vertical" :gutter="0">
                      <flexbox-item style="margin-bottom: 0.1rem">
                        <flexbox>
                          <flexbox-item :span="2 / 3">
                            <div style="display: flex; width: 5rem">
                              <div class="minFontSize">{{ name }}</div>
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
                      <flexbox-item style="margin-bottom: 0.1rem">
                        <div class="minFontSizemid lineHei overMessageTitle">
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
          <div class="tabCon" @click="doBatchDelete">
            <img
              class="approvalPeople minFontSize"
              src="../asssets/images/messageDelete.png"
            />
            <span class="approvalPeople minFontSize lineHei"> 删除 </span>
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
import BScroll from "better-scroll";
import { mapMutations } from 'vuex';
import Myscroll from "@/common/myscroll.vue";
export default {
  components: {
    Swipeout,
    SwipeoutItem,
    SwipeoutButton,
    Badge,
    Myscroll,
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
      messageSendIdList: [],
      checkedUsers: [],
      myLaunch: true,
      dataUser: [],
      itemList: [],
      hint: false,
      results: [],
      myLaunchHeader: true,
      value: "",
      open: false,
      name: "",
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
    //this.scrollEventSend()
    //this.watchScrollSend();
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
    scrollTo() {
      if (this.dataList != "") {
        this.$refs.wrapper.scroll.scrollTo(0, -48, 500);
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
      this.getTable();
     // this.scrollTo();
    },
    // 初始化数据
    init() {
      Bus.$on("initSend", () => {
        this.myLaunchHeader = true;
        this.myLaunch = true;
        // this.scrollEventSend()
        //this.watchScroll()
      });
    },
    setCheckMyself(item) {
      this.checkedUsers = setCheckMyselves(item, this.checkedUsers);
    },
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
    getTable(e) {
      let _this = this;
      _this.showloading();
      let usernames = JSON.parse(sessionStorage.getItem("currentUser"));
      this.name = usernames.name;
      let parmas = {
        page: 1,
        per_page: 9999,
        rcvDate: null,
        rcvUserCode: "",
        sendUserCode: usernames.username,
        keyWord: e == undefined ? "" : encodeURIComponent(e),
        roleId: "",
      };
      ajaxGet(URL.url.getMessageLaunch, parmas)
        .then((res) => {
          this.isLoadding = 0;
          _this.dataList = res.data.data;
          this.data = res.data.data;
          _this.ifShow(_this.dataList);
          _this.closeloading();
          setTimeout(() => {
            this.scrollTo();
          },500)
        })
        .catch((err) => {
          this.isLoadding = 0;
          let omsg = _this.outmsg(err);
          _this.closeloading();
          setTimeout(() => {
            this.scrollTo();
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
      this.$router.push({ name: "messageLaunchDetail", params: { id: item } });
    },
    doDeleteClick(item) {
      this.itemList = item;
      this.hint = true;
      this.sheet("确定要删除吗？");
    },
    toDeleteClick() {
      this.messageSendIdList.push(this.itemList.messageSendId);
      let data = {
        messageSendIdList: this.messageSendIdList,
        messageType: "out",
      };
      ajaxPost(URL.url.doDeleteMessageReceive, JSON.stringify(data))
        .then((res) => {
          this.getTable();
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
      if (this.checkedUsers == 0) {
        this.actionSheetVisable = true;
        this.sheet("请选择一条信息");
      } else {
        this.remind = true;
        this.sheet("确定要删除吗？");
      }
    },
    toBatchDelete() {
      let data = { messageSendIdList: this.checkedUsers, messageType: "out" };
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
      Bus.$on("select", (laOrder) => {
        if (laOrder == 0) {
          data.forEach((res) => {
            this.dataUser.push(res.messageSendId);
          });
        } else if (laOrder == 1) {
          this.dataUser = [];
        } else if (laOrder == 2) {
          this.dataUser = [];
          this.myLaunchHeader = true;
          this.myLaunch = true;
        }
        this.checkedUsers = this.dataUser;
        //this.scrollEventSend()
        //this.watchScrollSend();
      });
    },
    editButton() {
      Bus.$emit("removeEvent");
      this.myLaunch = false;
      this.myLaunchHeader = false;
      Bus.$emit("on", this.open);
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
.img {
  width: 86%;
  vertical-align: middle;
}
.myflexItem {
  word-break: break-all;
  padding-left: 0.3rem;
  width: 5rem;
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
.appThing {
  color: #9b9b9b;
}
.tabBox {
  width: 100%;
  height: 10%;
  background: #ffffff;
  text-align: center;
}
.el-checkbox {
  /deep/.el-checkbox__inner {
    border-radius: 50%;
    width: 0.5rem;
    height: 0.5rem;
    position: relative;
    z-index: 99;
  }
  /deep/.el-checkbox {
    color: #ee554b;
  }
  /deep/.el-checkbox__input.is-checked + .el-checkbox__label {
    color: #ee554b;
    text-align: center;
  }
  /deep/.el-checkbox__input.is-checked .el-checkbox__inner {
    background-color: #ee554b;
    border-color: #ee554b;
    text-align: center;
  }
  /deep/.el-checkbox__label {
    font-weight: normal !important;
  }
  /deep/.el-checkbox__input .el-checkbox__inner::after {
    // 对号
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
</style> background: red;