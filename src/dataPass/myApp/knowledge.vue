<template>
  <div class="know-packge" style="height:100%;" v-touch:right="back">
    <div style="background: #ffffff;height:44px;">
      <i class="my-back"></i>
      <i class="jia-back" @click="back"></i>
      <tab
        :line-width="0"
        active-color="#E64340"
        default-color="rgba(50,50,50,1)"
        v-model="activeTab"
        style="width: 91%; left:5%;"
      >
        <tab-item
          class="vux-center default-font minFontSize"
          @on-item-click="tabChange(index)"
          active-class="bigFontSize"
          :selected="activeTab === index"
          v-for="(item, index) in tabType"
          :key="index"
          >{{ item }}</tab-item
        >
      </tab>
    </div>
    <ul v-if="dataList.length" style="position:relative;z-index: 2;">
      <li
        v-for="(item, index) in dataList"
        :key="index"
        @click="toDetail(item)"
      >
        <div class="item-tit">
          <div>
            <img src="../asssets/images/knowIcon.png" class="title-icon" />
          </div>
          <h5 class="minFontSize textOvern" v-if="!Qashow">
            {{ item.fileTitle }}
          </h5>
          <h5 class="minFontSize textOvern" v-else>{{ item.qaShareTitile }}</h5>
           <badge text="NEW" class="vux-badge-my" v-if="!item.isNew"></badge>
        </div>
        <div class="item-con">
          <span class="time minFontSizeMin" v-show="!Qashow">{{
            item.publishTime
          }}</span>
          <span class="time textOvern minFontSizeMin" v-show="Qashow">{{
            item.tableName
          }}</span>
          <div><img src="static/more.png" class="more" /></div>
        </div>
      </li>
    </ul>
    <div v-if="noData && activeTab !== null" class="noData">
      <img src="../asssets/images/kong.png" />
    </div>
  </div>
</template>
<script>
const URL = require("../asssets/Api/api");
import minxin from "@/common/commonfunction.js";
import { mapMutations } from 'vuex';
import { ajaxGet, ajaxPost } from "../../core/mxApi";
import { Badge} from 'vux'
export default {
  mixins: [minxin],
  components: {
    Badge
  },
  data() {
    return {
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      file:{
        fileTitle: '',
        publishTime:'',
        fileIntroduction:''
      },
      fileList: [],
      minHei: 0,
      // 根据文件类型判断显示图片
      fileType() {
        return "require(static/pdfImg.png)";
      },
      noData: false,
      activeTab: null, // tab切换开关
      tabType: [],
      userInfo: JSON.parse(sessionStorage.getItem("currentUser")),
      dataList: [],
      tabData0: [],
      tabData1: [],
      tabData2: [],
      QaIndex: null,
      Qashow: false,
      page: 1,
      getBarWidth: function (index) {
        return (index + 1) * 22 + "px";
      },
      //tab2Data: [],
    };
  },
  created() {
    this.getMenu();
  },
  mounted() {
    setTimeout(() => {
      if (sessionStorage.getItem("activeTab") != undefined) {
        this.activeTab = Number(sessionStorage.getItem("activeTab"));
      } else {
        this.activeTab = 0
      }
    }, 520);
  },
  destroyed() {
    //sessionStorage.removeItem('activeTab')
  },
  beforeRouteLeave(to, from, next) {
    if (to.name != "qaDetail" && to.name != "knowledgeDetail") {
      if (sessionStorage.getItem("activeTab")) {
        sessionStorage.removeItem("activeTab");
      }
      next();
    } else {
      next();
    }
  },
  methods: {
    ...mapMutations(['setTransitionName']),
    back() {
      this.setTransitionName('slide-right')
      setTimeout(()=>{
        this.push("home");
        this.$store.commit({
          type: "changepage",
          pageindex: 2,
        });
      })
    },
    // 获取显示的文档栏目的类型
    getMenuTypeCur(name, index) {
      const params = { menuName: encodeURIComponent(name) };
      ajaxGet(URL.url.getMenuType, params)
        .then((res) => {
          let {
            data: { data, code },
          } = res;
          if (data != "" && data != null && data != "null") {
            this.getData(data.documentValue, index);
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
    getDatas(){
      var isSHOW = this.$route.params.isNew
      if(isSHOW == "false" || isSHOW == false){
        const parmas = {
          'userName':JSON.parse(sessionStorage.getItem('currentUser')).username,
          'kbfileId':this.$route.params.kbfileId
        };
        let a= JSON.stringify(parmas)
         ajaxPost(URL.url.getRaed,a)
         .then((res)=>{
           this.toNumberDyna()
         })
         .catch((err)=>{})
      }
    },
    // 获取显示的文档栏目
    getMenu() {
      // this.getDatas()
      const params = { userId: Number(this.userInfo.userId), appName: "ZSK" };
      ajaxGet(URL.url.getMenu, params)
        .then((res) => {
          let {
            data: { data, code },
          } = res;
          this.tabType = [];
          data.forEach((item) => {
            if (
              item.menu_id == 399 ||
              item.menu_id == 392 ||
              item.menu_id == 404
            ) {
              if (item.menu_id == 404) {
                this.getQaData(this.tabType.length);
              } else {
                this.getMenuTypeCur(item.name, this.tabType.length);
              }
              this.tabType.push(item.name);
            }
          });
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
    // 跳转到文档详情页
    toDetail(item) {
      // 数据QA
      if (this.Qashow) {
        this.setTransitionName('')
        this.push({
          name: "qaDetail",
          params: { qaShareId: item.qaShareId,isNew: item.isNew },
        });
      } else {
        this.setTransitionName('')
        // 培训、制度
        this.push({
          name: "knowledgeDetail",
          params: { kbfileId: item.kbfileId,isNew: item.isNew },
        });
      }
      sessionStorage.setItem("activeTab", this.activeTab);
    },
    tabChange(index) {
      this.dataList = this["tabData" + index];
      // if (!this.dataList.length) {
      //       this.noData = true
      // } else {
      //   this.noData = false
      // }
      if (index == this.QaIndex) {
        this.Qashow = true;
      } else {
        this.Qashow = false;
      }
    },
    getData(type, index) {
      // this.noData = false
      // 获取培训文档、制度文档数据
      const parmas = {
        page: this.page,
        fileType: type,
        per_page: 9999,
        userId: Number(this.userInfo.userId),
        userName:JSON.parse(sessionStorage.getItem('currentUser')).username
      };
      ajaxGet(URL.url.getDocumentData, parmas)
        .then((res) => {
          let {
            data: { data, code },
          } = res;
          this["tabData" + index] = data;
          this.dataList = this["tabData" + this.activeTab];
          // if (!this.dataList.length) {
          //   this.noData = true
          // } else {
          //     this.noData = false
          //   }
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
    getQaData(index) {
      // this.noData = false
      const parmas = {
        page: this.qaPage,
        per_page: 9999,
        isMobile: "Y",
        userName: JSON.parse(sessionStorage.getItem('currentUser')).username
      };
      this.QaIndex = index;
      ajaxGet(URL.url.getQaData, parmas)
        .then((res) => {
          let {
            data: { data, code },
          } = res;
          this["tabData" + index] = data;
          this.dataList = this["tabData" + this.activeTab];
          //  if (!this.dataList.length) {
          //   this.noData = true
          // } else {
          //     this.noData = false
          //   }
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
  },
  watch: {
    activeTab(val) {
      this.tabChange(val);
    },
    dataList(val) {
        if (val && !val.length) {
        this.noData = true
      } else {
        this.noData = false
      }
    }
  },
};
</script>
<style lang="less" scoped>
.default-font {
  font-weight: 350;
}
.noData{
  img{
    width:60%;position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);z-index:1;
  }
}
.know-packge {
  background: #f3f3f3;
  height: 100%;
  overflow: hidden;
}
ul {
  height:calc(~"100% - 44px");;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
  padding: 0 4%;
  li {
    background: #ffffff;
    padding: 0.2rem 0.4rem;
    margin-top: 0.22rem;
    border-radius: 5px;
  }
  .item-tit {
    display: flex;
    align-items:center;
    .title-icon {
      width: 0.36rem;
      display: block;
      margin-top: 3px;
    }
    h5 {
      margin-left: 13px;
      text-align:justify;
    }
  }
  .item-con {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top:5px;
    .more {
      width: 0.13rem;
      display: block;
    }
  }
}
.time {
  flex: 1;
  color: #989898;
}

.textOvern {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: inline-block !important;
}
.my-back {
  content: "";
  position: absolute;
  width: 12px;
  height: 12px;
  border: 1px solid #ccc;
  border-width: 1px 0 0 1px;
  -webkit-transform: rotate(315deg);
  transform: rotate(315deg);
  top: 16px;
  left: 15px;
}
.jia-back{position: absolute; width:30px;top:13px;z-index: 998;
  left:10px;
  height: 20px;}
</style>
