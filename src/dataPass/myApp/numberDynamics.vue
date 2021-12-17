<template>
  <div style="height:100%;" v-touch:right="back">
    <Header :backoptions="backoptions" @tobackpage="back" title="数聚动态" />
    <div class="know-packge">
      <ul>
        <li
          v-for="(item, index) in dataList"
          :key="index"
          @click="toDetail(item)"
        >
          <div>
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
          </div>
          <div class="item-con">
            <span class="time minFontSizeMin">{{ item.publishTime }}</span>
            <div><img src="static/more.png" class="more" /></div>
          </div>
        </li>
      </ul>
    </div>
  </div>
</template>
<script>
const URL = require("../asssets/Api/api");
import Header from "@/common/header.vue";
import minxin from "@/common/commonfunction.js";
import { ajaxGet, ajaxPost } from "../../core/mxApi";
import { Badge} from 'vux'
import { mapMutations } from 'vuex';
export default {
  mixins: [minxin],
  components: {
    Header,
    Badge
  },
  data() {
    return {
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      userInfo: JSON.parse(sessionStorage.getItem("currentUser")),
      dataList: [],
      page: 1,
    };
  },
  created() {
    this.getMenuTypeCur();
  },
  mounted() {},
  destroyed() {},
  methods: {
    ...mapMutations(['setTransitionName']),
    back() {
      this.setTransitionName('slide-right')
      this.push("home");
      this.$store.commit({
        type: "changepage",
        pageindex: 2,
      });
    },
    // 获取显示的文档栏目的类型
    getMenuTypeCur() {
      const params = { menuName: encodeURIComponent("数聚动态") };
      ajaxGet(URL.url.getMenuType, params)
        .then((res) => {
          let {
            data: { data, code },
          } = res;
          if (data != "" && data != null && data != "null") {
            this.getData(data.documentValue);
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
    // 跳转到文档详情页
    toDetail(item) {
      this.setTransitionName('')
      this.push({
        name: "knowledgeDetail",
        params: { kbfileId: item.kbfileId ,isNew: item.isNew},
        query: { isNum: "yes" },
      });
    },
    getData(type, index) {
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
          this.dataList = data;
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
};
</script>
<style lang="less" scoped>
.default-font {
  font-weight: 350;
}
.know-packge {
  background: #f3f3f3;
  height: 100%;
  overflow: auto;
  -webkit-overflow-scrolling: touch;
}
ul {
  padding: 0 4% 20px 4%;
  margin-top: 57px;
  li {
    background: #ffffff;
    padding: 0.3rem 0.4rem;
    margin-top: 0.22rem;
    border-radius: 5px;
  }
  .item-tit {
    display: flex;
    align-items: center;
    .title-icon {
      width: 0.18rem;
      display: block;
      margin-top: 7px;
    }
    h5 {
      margin-left: 13px;
    }
  }
  .item-con {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-top: 14px;
    .more {
      width: 0.13rem;
      display: block;
    }
  }
}
.time {
  color: #989898;
}

.textOvern {
  overflow: hidden;
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