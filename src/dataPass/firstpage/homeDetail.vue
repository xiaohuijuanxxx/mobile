<template>
  <div class="firstbox esHeader">
    <flexbox
      style="background: #ffffff; padding-top: 1.2vh; z-index: 999"
      ref="header"
      class="esheaderFixedfirst"
    >
      <flexbox-item :span="2" @click.native="tomypage">
        <img
          v-if="headerurl != undefined"
          :src="headerurl"
          style="display: inline-block; width: 8.2vw"
        />
        <img
          v-else
          src="static/title_picture.png"
          style="display: inline-block; width: 8.2vw"
        />
      </flexbox-item>
      <flexbox-item :span="8">
        <div class="flex-demo">
          <img
            slot="icon"
            src="static/sjtpacture.png"
            style="display: inline-block; width: 1.8rem; margin-left: -0.4rem"
          />
        </div>
      </flexbox-item>
      <flexbox-item @click.native="closewindn">
        <div class="flex-demo iconcss">
          <img
            slot="icon"
            src="../asssets/images/tuichu0920.png"
            style="
              display: inline-block;
              width: 7vw;
              margin: 0 auto;
              vertical-align: middle;
            "
          />
        </div>
      </flexbox-item>
    </flexbox>
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
      <div class="content" style="position: relative">
        <spinner
          v-if="isLoadding == 1"
          type="ios"
          style="position: absolute; top: 0; width: 100%; text-align: center"
        ></spinner>
        <flexbox
          v-if="coutreview"
          style="padding-top: 0.7rem; margin-bottom: -0.5rem"
        >
          <flexbox-item :span="1">
            <div class="flex-demo">
              <img
                style="width: 0.45rem"
                slot="icon"
                src="../asssets/images/notice.png"
              />
            </div>
          </flexbox-item>
          <flexbox-item :span="7" style="margin-left: 0.2rem">
            <div class="flex-demott" v-html="contents"></div>
          </flexbox-item>
          <flexbox-item>
            <div class="flex-demobutt">
              <x-button
                class="ljManage"
                mini
                type="warn"
                @click.native="detailreview"
                >立即处理</x-button
              >
            </div>
          </flexbox-item>
        </flexbox>
        <flexbox style="padding-top: 1.1rem" :gutter="0">
          <flexbox-item v-for="(i, index) in useData" :key="index" >
            <div class="flex-demo" @click="Skip(i.id)" >
              <img slot="icon" class="rwdemo" :src="i.url" />
              <div class="appcationName userZy">{{ i.value }}</div>
            </div>
          </flexbox-item>
          <flexbox-item>
            <div class="flex-demo" @click="toApplication">
              <img slot="icon" class="rwdemo" :src="allApplication.url" />
              <div class="appcationName minFontSizemid">
                {{ allApplication.value }}
              </div>
            </div>
          </flexbox-item>
        </flexbox>
        <flexbox style="margin-top: 0.6rem"
        >
          <swiper
            auto
            loop
            @on-index-change="onIndexChange"
            dots-position="center"
            v-model="swiperindex"
            style="width: 99%; margin: 0 auto"
            dots-class="custom-bottom"
          >
            <swiper-item
              class="swiper-demo-img pacturecss"
              v-for="(item, index) in bannerList"
              :key="index"
            >
              <img
                :src="'data:image/png;base64,' + item.imageBaseText"
                style="width: 100%; height: 100%"
              />
            </swiper-item>
          </swiper>
        </flexbox>
        <flexbox style="margin-top: 0.6rem">
          <flexbox-item :span="4">
            <div class="flex-demo midFontSize" style="text-align: left">
              京彩数聚
            </div>
          </flexbox-item>
          <flexbox-item>
            <div
              class="flex-demo minFontSizemid"
              style="text-align: right; color: #656565"
              @click="tomoredata"
            >
              更多
            </div>
          </flexbox-item>
        </flexbox>
        <br />
        <flexbox :gutter="0" wrap="wrap" style="justify-content: space-between">
          <flexbox-item
            :span="1 / 2"
            v-for="(item, index) in draggData"
            :key="index"
            class="itemcss"
          >
            <div
              class="flex-demotwo"
              :style="{
                backgroundImage: `url(${require('../asssets/images/jcsj' +
                  item.myImgSrc +
                  '.png')})`,
              }"
              @click="clickfordetail(item)"
            ><!-- @click="clickfordetail(item.reportId)" -->
              <div
                v-if="item.reportName != ''"
                class="demotwotitle minFontSizemid textOverf"
              >
                <b>{{ item.reportName }}</b>
              </div>
              <span
                style="
                  color: #656565;
                  display: inline-block;
                  width: 80%;
                  overflow: hidden;
                  line-height: 0.34rem;
                "
                class="minFontSizemid textOverf"
                >{{item.reportContents}}</span>
            </div><!-- {{ item.reportNR }} -->
          </flexbox-item>
        </flexbox>
        <flexbox style="margin-top: 0.5rem">
          <flexbox-item :span="4">
            <div class="flex-demo midFontSize" style="text-align: left">
              数聚动态
            </div>
          </flexbox-item>
          <flexbox-item>
            <div
              class="flex-demo minFontSizemid"
              style="text-align: right; color: #656565"
              @click="tomoreNumber"
            >
              更多
            </div>
          </flexbox-item>
        </flexbox>
        <ul class="number-dyna weui-actionsheet__action">
          <li
            v-for="(item, index) in numberDynaList"
            :key="index"
            @click="toNumberDyna(item)"
          >
            <div class="li-con-top">
              <div class="item-tit">
                <div>
                  <img
                    src="../asssets/images/numberDyna.png"
                    class="title-icon"
                  />
                </div>
                <h5 class="minFontSize textOvern">{{ item.fileTitle }}</h5>
                <badge v-show="!item.isNew" text="NEW" class="vux-badge-my"></badge>
              </div>
              <p class="overMore minFontSizemid">{{ item.fileIntroduction }}</p>
              <div class="time minFontSizeMin">{{ item.publishTime }}</div>
            </div>
            <div class="item-con">
              <img
                :src="
                  require('../asssets/images/numberDyna' +
                    (index % 10) +
                    '.png')
                "
              />
            </div>
          </li>
        </ul>
      </div>
    </Myscroll>

    <!-- <confirm content='<p class="bigFontSize">是否退出数聚通?</p>' v-model="conShow" @on-confirm="onConfirm"></confirm> -->
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
    <actionsheet
      v-model="conShow"
      :menus="menusall"
      @on-click-menu-delete="onConfirm"
      show-cancel
    ></actionsheet>
  </div>
</template>


<script>
import minxin from "../../common/commonfunction";
import { judgeFontType } from "../../common/commonfunction";
import { mapState, mapMutations } from "vuex";
import { ajaxGet, ajaxPost, closeWindow } from "../../core/mxApi";
import Bus from "@/bus/bus";
import BScroll from "better-scroll";
import Myscroll from "@/common/myscroll.vue";
import { removeWatermark } from '@/common/watermark.js'
import { Badge} from 'vux'
import { isArray } from '../../core/utils';

const URL = require("../asssets/Api/api");
export default {
  components: {
    Myscroll,
    Badge
  },
  mixins: [minxin],
  data() {
    return {
      isLoadding: 0, // 0还没下拉 1 下拉中
      pulldown: true, // 开启下拉刷新监听
      listenScroll: true, // 开启滚动监听
      data: [],
      pulldown: true,
      numberDynaList: [], // 数聚动态数据
      // swiperlist: [],
      swiperindex: 0,
      coutreview: 0,
      conShow: false,
      draggData: [],
      useData: [],
      headerurl: "",
      publicReport: [
        {
          reportId: "NORMAL001",
          reportName: "示例：财务指标",
          reportNR: "财务指标趋势分析",
          myImgSrc: 0,
        },
        {
          reportId: "NORMAL002",
          reportName: "示例：会计数据",
          reportNR: "展示近年主要会计数据",
          myImgSrc: 1,
        },
        {
          reportId: "NORMAL003",
          reportName: "示例：营业收入",
          reportNR: "营业收入分布构成",
          myImgSrc: 2,
        },
        {
          reportId: "NORMAL004",
          reportName: "示例：资产负债",
          reportNR: "资产负债分布构成",
          myImgSrc: 3,
        },
      ],
      publicMyApp: [
        { id: "1", value: "审批中心", url: "static/ico_spzx.png" },
        { id: "2", value: "公告", url: "static/ico_gg.png" },
        { id: "3", value: "智能助理", url: "static/ico_znzl.png" },
        { id: "4", value: "数据收藏", url: "static/ico_wdsj.png" },
        { id: "5", value: "站内信", url: "static/ico_email.png" },
      ],
      useList: [
        { id: "1", value: "审批中心", url: "static/ico_spzx.png" },
        { id: "2", value: "公告", url: "static/ico_gg.png" },
        { id: "3", value: "智能助理", url: "static/ico_znzl.png" },
        { id: "4", value: "数据收藏", url: "static/ico_wdsj.png" },
        { id: "5", value: "站内信", url: "static/ico_email.png" },
        { id: "6", value: "知识库", url: "static/ico_zsk.png" },
        { id: "7", value: "数聚动态", url: "static/ico_sjdt.png" },
      ],
      allApplication: { id: "all", value: "全部", url: "static/allApp.png" },
    };
  },
  computed: {
    ...mapState({
      bannerList: (state) => state.bannerList,
      countHeight: (state) => state.countHeight,
      useDataList: (state) => state.useList,
      tabbarHeight: (state) => state.tabbarHeight,
      // draggData: state => state.draggData,
      // draggIds: state => state.draggIds,
    }),
    contents() {
      return `<span class='midFontSize' style="display:inline-block;line-height: var(--midSize);">您有<span style="color:#E92323;display:inline-block;">${this.coutreview}</span>个事项待处理</span>`;
    },
  },
  created() {
    this.setTransitionName('')
    this.getBannerList();
    // //this.loadData()
    // if (this.bannerList != "") {
    //     for (let i = 0; i < this.bannerList.length; i++) {
    //         // this.swiperlist.push(this.bannerList[i]);
    //         this.data = this.bannerList
    //     }
    //     //this.$forceUpdate()
    // }
    let initpage = this.$store.state.requirednode;
    if (initpage) {
      this.push(initpage.pages);
    }
  },
  mounted() {
    //轮播图
    // this.getBannerList();
    // 清除水印
    removeWatermark()
    let hei =
      document.body.offsetHeight -
      this.$refs.header.$el.offsetHeight -
      this.tabbarHeight;
    this.$refs.wrapper.$el.style.cssText = "height:" + hei + "px";
    let suerColor = document.getElementsByClassName(
      "weui-dialog__btn_primary"
    )[0];
    const userinfo = JSON.parse(sessionStorage.getItem("currentUser"));
    this.getFontSeted();
    this.getAllRole(userinfo.userId);
    suerColor.style.color = "red";
    if (this.$store.state.ssoToken) {
      this.getdata();
      //高级用户
      if (userinfo.userType != 2 && userinfo.status == "0") {
        //获取精彩数据报表
        this.getTheme();
      } else {
        /* 原逻辑是展示写死的四张固定报表---修改为展示查出来的四张公共报表 */
        this.getMyReport();
        // let dtArr = [],
        //   n = 0;
        // while (dtArr.length != 4) {
        //   dtArr.push(this.publicReport[n]);
        //   n += 1;
        // }
        // this.draggData = dtArr;
      }
      let user = JSON.parse(sessionStorage.getItem("jzUser"));
      this.headerurl = user ? user.avatar_url : undefined;
      this.$forceUpdate()
    }
    this.setTouX()
    this.serach();
    this.changeTodo();
    this.getMyApp();
    this.getNumberDynaData(userinfo.userId, userinfo.username);
    this.refreshData();
  },
  watch: {
    "$store.state.ssoToken": {
      handler(newval, oldval) {
        let hei =
          document.body.offsetHeight -
          this.$refs.header.$el.offsetHeight -
          this.tabbarHeight;
        this.$refs.wrapper.$el.style.cssText = "height:" + hei + "px";
        this.getFontSeted();
        const userinfo = JSON.parse(sessionStorage.getItem("currentUser"));
        this.getAllRole(userinfo.userId);
        this.getMyApp();
        this.getdata();
        if (userinfo.userType != 2 && userinfo.status == "0") {
          this.getTheme();
        } else {
          this.getMyReport();
        }
        let user = JSON.parse(sessionStorage.getItem("jzUser"));
        this.headerurl = user ? user.avatar_url : undefined;
        this.$forceUpdate()
        if (userinfo.userId) {
          this.getNumberDynaData(userinfo.userId, userinfo.username);
        }
        this.refreshData();
      },
    },
    "$store.state.reflashtodoform": {
      handler(newval, oldval) {
        if (newval == 1) {
          this.$store({
            type: "getreflashtodoform",
            reflashtodoform: 0,
          });
          this.getdata();
        }
      },
    },
  },
  methods: {
    ...mapMutations([
      "setHttpThemeList",
      "setDraggData",
      "setDraggIds",
      "setThemeList",
      "setUseIds",
      "setUseData",
      "setUseList",
      "setTransitionName",
    ]),
    // 轮播图
    getBannerList() {
      ajaxGet(URL.url.getBanner)
      .then((res) => {
        if (
            res.data.data != null &&
            res.data.data != "null" &&
            res.data.data != ""
        ) {
          const dt = res.data.data.filter((item) => item.isEnable === "Y");
          this.$store.commit({
              type: "setBannerList",
              data: dt,
          });
        }
      })
      .catch((error) => {
          const omsg = this.outmsg(error);
          if (!omsg) {
              return;
          }
          this.sheet(omsg);
      });
    },
    // 设置头像
    setTouX() {
      Bus.$on('setTou', () => {
        let user = JSON.parse(sessionStorage.getItem("jzUser"));
        this.headerurl = user ? user.avatar_url : undefined;
      })
    },
    // 获取字体
    getFontSeted() {
      let user = JSON.parse(sessionStorage.getItem("currentUser"));
      ajaxGet(URL.url.usersiting, { keyWord: user.username })
        .then((res) => {
          let {
            data: { code, message, data },
          } = res;
          if (code == "0000" && data != null) {
            judgeFontType(Number(data[0].susSetting1));
          }
        })
        .catch((err) => {
          let omsg = this.outmsg(err);
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
    // 监听滚动事件
    handlerScroll(pos) {
      if (pos.y > 50) {
        this.isLoadding = 1;
      }
    },
    // 下拉刷新
    loadData() {
      if (this.bannerList != "") {
          // this.swiperlist = [];
          for (let i = 0; i < this.bannerList.length; i++) {
            // this.swiperlist.push(this.bannerList[i]);
            this.data = this.bannerList
          }
          //this.$forceUpdate()
        }
      let hei =
        document.body.offsetHeight -
        this.$refs.header.$el.offsetHeight -
        this.tabbarHeight;
      this.$refs.wrapper.$el.style.cssText = "height:" + hei + "px";
      this.getFontSeted();
      let suerColor = document.getElementsByClassName(
        "weui-dialog__btn_primary"
      )[0];
      const userinfo = JSON.parse(sessionStorage.getItem("currentUser"));
      this.getAllRole(userinfo.userId);
      suerColor.style.color = "red";
      if (this.$store.state.ssoToken) {
        this.getdata();
        if (userinfo.userType != 2 && userinfo.status == "0") {
          this.getTheme();
        } else {
          this.getMyReport();
        }
        let user = JSON.parse(sessionStorage.getItem("jzUser"));
        this.headerurl = user ? user.avatar_url : undefined;
      }
      this.serach();
      this.changeTodo();
      this.getMyApp();
      this.getNumberDynaData(userinfo.userId, userinfo.username);
    },
    // 获取当前用户所有角色
    getAllRole(userId) {
      const params = { userId: userId };
      ajaxGet(URL.url.getAllRole, params)
        .then((res) => {
          let signs = "";
          if (
            res.data.data != null &&
            res.data.data != "null" &&
            res.data.data != ""
          ) {
            res.data.data.forEach((item) => {
              if (item.role_sign != null && item.role_sign != "") {
                signs = `${signs}${item.role_sign},`;
              }
            });
          }
          sessionStorage.setItem("signs", JSON.stringify(signs));
        })
        .catch((error) => {
          this.sheet(error);
        });
    },
    // 数聚动态 更多
    tomoreNumber() {
      this.push("/numberDynamics");
    },
    // 数聚动态详情页
    toNumberDyna(item) {
      this.push({
        name: "knowledgeDetail",
        params: { kbfileId: item.kbfileId ,isNew: item.isNew},
        query: { isNum: "yes", isHome: "yes" },
      });
    },
    // 获取数聚动态的数据
    getNumberDynaData(userId,username) {
      // 获取培训文档、制度文档数据
      // fileType: 4 准生产   fileType: 2 生产
      const parmas = {
        page: this.page,
        fileType: 4,
        // fileType: 2,
        per_page: 10,
        userId: Number(userId),
        userName: username
        // userId: Number(this.userInfo.userId),
        // userName: JSON.parse(sessionStorage.getItem('currentUser')).username
      };
      // alert(parmas.userId, parmas.userName);
      ajaxGet(URL.url.getDocumentData, parmas)
        .then((res) => {
          let {
            data: { data, code },
          } = res;
          // alert(data);
          this.numberDynaList = data.slice(0, 3);
          this.data = data;
          this.isLoadding = 0;
        })
        .catch((err) => {
          let omsg = _this.outmsg(err);
          if (!omsg) {
            return;
          }
          _this.actionSheetVisable = true;
          _this.sheet(omsg);
        });
    },
    // 当推送处理后回到应用要刷新首页数据
    refreshData() {
      Bus.$on("refesh", (e) => {
        if (sessionStorage.getItem("isTui")) {
          sessionStorage.removeItem("isTui");
        }
        if (this.bannerList != "") {
            // this.swiperlist = [];
            for (let i = 0; i < this.bannerList.length; i++) {
              // this.swiperlist.push(this.bannerList[i]);
              this.data = this.bannerList
            }
            //this.$forceUpdate()
          }
        let suerColor = document.getElementsByClassName(
          "weui-dialog__btn_primary"
        )[0];
        const userinfo = JSON.parse(sessionStorage.getItem("currentUser"));
        this.getAllRole(userinfo.userId);
        suerColor.style.color = "red";
        if (this.$store.state.ssoToken) {
          this.getdata();
          if (userinfo.userType != 2 && userinfo.status == "0") {
            this.getTheme();
          } else {
            this.getMyReport();
          }
          let user = JSON.parse(sessionStorage.getItem("jzUser"));
          this.headerurl = user ? user.avatar_url : undefined;
        }
        this.serach();
        this.changeTodo();
        this.getMyApp();
        this.getNumberDynaData(userinfo.userId, userinfo.username);
      });
    },
    serach() {
      Bus.$on("search", (e) => {
        const userinfo = JSON.parse(sessionStorage.getItem("currentUser"));
        if (userinfo.userType != 2 || userinfo.status != "0") {
          this.getTheme(e);
        } else {
          let dtArr = [],
            n = 0;
          while (dtArr.length != 4) {
            dtArr.push(this.publicReport[n]);
            n += 1;
          }
          this.draggData = dtArr;
        }
      });
    },
    changeTodo() {
      Bus.$on("changeTodo", () => {
        this.getdata();
      });
    },
    closewindn() {
      this.conShow = true;
      this.sheet("是否退出数聚通?");
    },
    onConfirm() {
      let vm = this;
      vm.showloading();
      sessionStorage.clear();
      ajaxGet(URL.url.loginout)
        .then((res) => {
          vm.closeloading();
          let {
            data: { code, message, data },
          } = res;
          if (code == "0000") {
            closeWindow();
          }
        })
        .catch((err) => {
          let omsg = vm.outmsg(err);
          vm.closeloading();
          if (!omsg) {
            return;
          }
          vm.actionSheetVisable = true;
          vm.sheet(omsg);
        });
    },
    async getTheme(e) {
      if (JSON.parse(sessionStorage.getItem("currentUser"))) {
        // 获取主题数据list
        let httpThemeList = [];
        const parmas = {
          userId: JSON.parse(sessionStorage.getItem("currentUser"))
            ? JSON.parse(sessionStorage.getItem("currentUser")).userId
            : "",
          isMoblie: "Y",
          reportName: e == undefined ? "" : encodeURIComponent(e),
          userName: JSON.parse(sessionStorage.getItem("currentUser")).username,
        };
        this.showloading();
        //获取全部固定报表的list
        await ajaxGet(URL.url.getThemeList, parmas)
          .then((res) => {
            this.closeloading();
            if (
              res.data.data &&
              res.data.data != null &&
              res.data.data != "null" &&
              res.data.data != ""
            ) {
              //设置报表背景图片，随机选用背景
              res.data.data.forEach((item) => {
                //charAt(index) 返回某一位置长度为一的字符串
                const last = item.reportId.charAt(item.reportId.length - 1);
                item.myImgSrc = Number(last);
              });
              httpThemeList = res.data.data;
              this.setHttpThemeList(res.data.data);
              this.data = res.data.data;
            } else {
              //let arr = this.publicReport
              //httpThemeList = this.publicReport
              let arr = [];
              this.setHttpThemeList(arr);
            }
          })
          .catch((error) => {
            const omsg = this.outmsg(error);
            this.closeloading();
            if (!omsg) {
              return;
            }
            this.actionSheetVisable = true;
            this.sheet(omsg);
          });

        //获取全部公共报表的list
        const parmaPublic = {
          userId: JSON.parse(sessionStorage.getItem("currentUser")).userId,
          userName: JSON.parse(sessionStorage.getItem("currentUser")).username,
          reportName: e == undefined ? "" : encodeURIComponent(e),
        };
        await ajaxGet(URL.url.getAllPublicTable, parmaPublic)
        .then((res) => {
          if (
            res.data.data &&
            res.data.data != null &&
            res.data.data != "null" &&
            res.data.data != ""
          ) {
            //报表背景设置
            res.data.data.forEach((item) => {
              const last = item.reportId.charAt(item.reportId.length - 1);
              item.myImgSrc = Number(last);
            });
            //公共报表在前，固定报表在后
            httpThemeList = res.data.data.concat(httpThemeList);
            this.setHttpThemeList(httpThemeList);
            this.setThemeList(httpThemeList);
            this.data = httpThemeList;
          } else {
            let arr = [];
            this.setHttpThemeList(arr);
            this.setThemeList(httpThemeList);
          }
        })
        .catch((error) => {
          const omsg = this.outmsg(error);
            this.closeloading();
            if (!omsg) {
              return;
            }
            this.actionSheetVisable = true;
            this.sheet(omsg);
        });
      }
      this.getMyReport();
    },
    /**
     * 查询用户用户自己的报--我的和首页一样
     * 高级用户可以编辑，在数聚详情页可以查看我的和全部
     * 普通用户（无报表权限）只在首页展示
     */
    getMyReport(){
      // 获取用户设置好的数聚list
      const params1 = {
        userName: JSON.parse(sessionStorage.getItem("currentUser")).username,
        userId: JSON.parse(sessionStorage.getItem("currentUser")).userId,
      };
      ajaxGet(URL.url.getMyTable, params1)
      .then((res) => {
        let data = [];
        let dataMid = [];
        if (
          res.data.data &&
          res.data.data != null &&
          res.data.data != "null" &&
          res.data.data != ""
        ) {
          dataMid = res.data.data;
          dataMid.forEach((item) => {
              data.push(item.reportId);
          });
          const dtArr = [];
          dataMid.forEach((item) => {
            // httpThemeList.forEach((item) => {
            //   if (id === item.reportId) {
            const last = item.reportId.charAt(item.reportId.length - 1);
            item.myImgSrc = Number(last);
            dtArr.push(item);
            //   }
            // });
          });
          this.draggData = dtArr;
          //强制刷新
          this.$forceUpdate();
        } else {
          // /* this.draggData存首页展示的报表数组 */
          this.draggData = [];
        }
        this.setDraggData(this.draggData);
        this.setDraggIds(data);
        this.data = data;
      })
      .catch((error) => {
          const omsg = this.outmsg(error);
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
    getdata() {
      const userinfo = JSON.parse(sessionStorage.getItem("currentUser"));
      if (!userinfo) {
        return;
      }
      const parmas = {
        page: 1,
        per_page: 9999,
        userId: (userinfo && userinfo.userId) || "",
        username: (userinfo && userinfo.username) || "",
        roleIds: (userinfo && JSON.stringify(userinfo.role_ids)) || "",
      };
      this.showloading();
      ajaxGet(URL.url.getToDoList, parmas)
        .then((res) => {
          let {
            data: { code, data },
          } = res;
          // data = data.filter(item => item.todoType != '105')
          // data = data.filter(item => item.todoType != '405') // 过滤 领导已处理
          // data = data.filter(item => item.todoType != '901') // 过滤 站内信
          //data = data.filter(item => item.todoType == '100' || item.todoType == '402' || item.todoType == '403' || item.todoType == '404')
          if ((code = "0000")) {
            let allcout = 0;
            data.forEach((item) => {
              allcout += Number(item.count);
            });
            this.coutreview = allcout;
            this.$store.commit({
              type: "getTodoData",
              todoData: data,
            });
          }
          this.data = data;
          // this.closeloading();
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
    onIndexChange(index) {
      this.swiperindex = index;
    },
    tomypage() {
      this.$emit("changeindex", 3);
    },
    tomoredata() {
      this.$store.commit({
        type: "changepage",
        pageindex: 1,
      });
      Bus.$emit("index", 1);
    },
    // 跳转到应用页面
    toApplication() {
      this.$store.commit({
        type: "changepage",
        pageindex: 2,
      });
      Bus.$emit("index", 2);
    },
    Skip(id) {
      if (id == 1) {
        this.$router.push({ path: "/myApproval" });
      } else if (id == 2) {
        this.$router.push("./myNotice");
      } else if (id == 3) {
          sessionStorage.setItem('source','home')
          this.$router.push({ path: '/myAssistant' });
      } else if (id == 6) {
        this.$router.push("/knowledge");
      } else if (id == 7) {
        this.$router.push("/numberDynamics");
      } else if (id == 4) {
        this.$store.commit({
          type: "changepage",
          pageindex: 1,
        });
        Bus.$emit("index", 1);
      } else if (id == 5) {
        this.$router.push("./myMessage");
      }
    },
    detailreview() {
      sessionStorage.setItem('source','home')
      this.$router.push("./myAssistant");
    },
    clickfordetail(item) {
      const u = navigator.userAgent;
      const isAndroid = u.indexOf("Android") > -1 || u.indexOf("Linux") > -1;
      if (!item.reportId) {
        return;
      }
      //if (isAndroid) {
        //this.openTableau(id);
        //this.push(`dataDetail/${id}`);

        /* isPublic Y代表公共，N代表固定 */
        this.$router.push({
          name: "titleDetail",
          params: {
            id: item.reportId,
            isPublic:"Y"
          },
          query: { index: "home" },
        });
      // } else {
      //   this.actionSheetVisable = true;
      //   this.sheet("此功能iOS版本正在建设中，敬请期待", "info");
      // }
    },
    getMyApp() {
      const params = {
        userName: JSON.parse(sessionStorage.getItem("currentUser")).username,
      };
      ajaxGet(URL.url.saveOrUpdatelist, params)
        .then((res) => {
          let data = [],
            befdrbgg = [];
          if (
            res.data.data &&
            res.data.data != null &&
            res.data.data != "null" &&
            res.data.data != ""
          ) {
            this.useList = [
              { id: "1", value: "审批中心", url: "static/ico_spzx.png" },
              { id: "2", value: "公告", url: "static/ico_gg.png" },
              { id: "3", value: "智能助理", url: "static/ico_znzl.png" },
              { id: "4", value: "数据收藏", url: "static/ico_wdsj.png" },
              { id: "5", value: "站内信", url: "static/ico_email.png" },
              { id: "6", value: "知识库", url: "static/ico_zsk.png" },
              { id: "7", value: "数聚动态", url: "static/ico_sjdt.png" },
            ];
            data = res.data.data[0].reportDragSetting.split(",");
            const appArr = [];
            data.forEach((id) => {
              this.useList.forEach((item) => {
                if (id === item.id) {
                  appArr.push(item);
                }
              });
            });
            if (appArr.length > 4) {
              befdrbgg = appArr.slice(0, 4);
            } else {
              let n = 0;
              while (appArr.length != 4) {
                appArr.push(this.publicMyApp[n]);
                n += 1;
              }
              befdrbgg = appArr;
            }
            this.useData = befdrbgg;
            this.$forceUpdate();
          } else {
            let n = 0;
            while (befdrbgg.length < 4) {
              befdrbgg.push(this.publicMyApp[n]);
              n += 1;
            }
            this.useData = befdrbgg;
            // befdrbgg = []; 为修改初始化应用那里显示此行代码挪到了下面
          }
          this.setUseData(befdrbgg);
          befdrbgg = [];
          if (this.useList.length > 0) {
            const arr = this.useList;
            const useLen = this.useList.length - 1;
            const idLen = data.length;
            if (idLen > 0) {
              for (let i = useLen; i >= 0; i--) {
                for (let j = 0; j < idLen; j++) {
                  if (data[j] === arr[i].id) {
                    arr.splice(i, 1);
                    break;
                  }
                }
              }
              this.setUseList(arr);
            } else {
              if (this.useData.length > 0) {
                const arr = this.useList;
                const useLen = this.useList.length - 1;
                const idLen = this.useData.length;
                for (let i = useLen; i >= 0; i--) {
                  for (let j = 0; j < idLen; j++) {
                    if (this.useData[j].id === arr[i].id) {
                      arr.splice(i, 1);
                      break;
                    }
                  }
                }
                this.setUseList(arr);
              } else {
                this.setUseList(this.useList);
              }
            }
          } else {
            this.setUseList(this.useList);
          }
          // this.setUseList(this.useDataList);
          this.setUseIds(data);
          this.data = data;
        })
        .catch((error) => {
          const omsg = this.outmsg(error);
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

<style lang="less" scoped>
@import "~vux/src/styles/1px.less";
.wrapper {
  overflow: hidden;
}
// /deep/.el-loading-spinner{
//   background: url(../asssets/images/loading.gif) no-repeat !important;
//   background-color: rgba(0, 0, 0, .3) !important;
//   background-size: 1rem, 1rem !important;
//   background-position: center center !important;
//   width: 1000% !important;
//   height: 1000% !important;
//   border-radius: 5% !important;
//   position: relative !important;
//   top: 50% !important;
//   left: 50% !important;
//   transform: translate(-50%, -50%) !important;
//   z-index: 9999;
//   .circular {
//     display: none !important;
//   }
// }
.firstbox {
  padding: 0.4rem 0 1rem 0;
  width: 92%;
  margin: 0 auto;
  overflow: scroll;
}

.iconcss {
  border: 1px solid gray;
  background-color: #ececec;
  border-radius: 1rem;
}

.flex-demo {
  text-align: center;

  .rwdemo {
    width: 0.55rem;
  }

  .appcationName {
    margin-top: 0.27rem;
  }
}

.flex-demott {
  text-align: left;
}

.flex-demobutt {
  text-align: right;
}
.flex-demotwo {
  text-align: center;
  min-height: 1.5rem;
  // background: url(/static/all_gives.png) no-repeat;
  background-size: 100% 100%;
  background-repeat: none;
  align-items: center;
  justify-content: center;
  position: relative;
  width: 94%;
  margin-left: 0.1rem;
  padding-bottom: 0.2rem;
  .demotwotitle {
    line-height: 0.3rem;
    padding-top: 0.5rem;
    padding-bottom: 0.2rem;
    color: #323232;
    pointer-events: none;
  }
}
.itemcss {
  margin-bottom: 0.21rem;
  height: 1.7rem;
  overflow: hidden;
}
.esHeader {
  margin-top: 0.2rem; // 所有页面有刘海屏幕 都是这个距离
}
.pacturecss img {
  border-radius: 0.2rem;
}
.dotcss {
  .vux-icon-dot {
    background-color: red !important;
  }
}
.esheaderFixedfirst {
  position: fixed !important;
  width: 92%;
  top: 0;
}
.textOverf {
  overflow: hidden;
  display: inline-block;
  width: 98%;
  line-height: 0.34rem;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.number-dyna {
  margin-bottom: 0.4rem;
  padding-top: 10px;
  li {
    border: 0.5px solid #eeeeee;
    border-radius: 5px;
    padding: 0.3rem 0.4rem;
    margin-top: 0.22rem;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .li-con-top {
    width: 76%;
  }
  .time {
    margin-top: 9px;
    color: #989898;
  }
}
.item-tit {
  display: flex;
  align-items: center;
  .title-icon {
    width: 0.18rem;
    display: block;
  }
  h5 {
    margin-left: 13px;
  }
}
.item-con {
  img {
    width: 1.25rem;
    display: block;
  }
}
.textOvern {
  overflow: hidden;
  //width: 95%;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block !important;
}
.overMore {
  overflow: hidden;
  text-overflow: ellipsis;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  color: rgba(155, 155, 155, 1);
  -webkit-box-orient: vertical;
  //text-align: justify;
}
</style>
