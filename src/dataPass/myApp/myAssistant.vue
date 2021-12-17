<template>
  <div style="box-sizing: border-box; background-color: #fafafa; overflow: hidden;padding-top:45px;" v-touch:right="back">
    <Header :backoptions="backoptions" @tobackpage="back" title="智能助理" />
    <div class="assisantcss" v-if="totalCount">
      <div class="assisanttitle midFontSize">
        您有<label style="color: red">{{ totalCount }}</label
        >个事项待处理
      </div>
      <!-- 待处理事项列表 -->
      <group>
        <cell
          class="my_cell"
          :title="item.todoDesc"
          @click.native="gotoAppreview(item)"
          v-for="(item, index) in todoData"
          :key="index"
          is-link
        >
        <!-- 智能助理图片 -->
          <img
            slot="icon"
            style="
              display: block;
              margin-right: 0.3rem;
              width: 0.4rem;
              margin-left: 0.01rem;
            "
            src="static/job_review.png"
          />
        </cell>
      </group>

    </div>
    <div class="assisantcss" v-if="unableDealCount">
      <div class="assisanttitle midFontSize">
        以下<label style="color: red">{{ unableDealCount }}</label
        >条审批请在PC端处理
      </div>
      <group>
        <cell
          class="my_cell"
          :title="item.todoDesc"
          v-for="(item, index) in unableDealData"
          :key="index"
        >
          <img
            slot="icon"
            style="
              display: block;
              margin-right: 0.3rem;
              width: 0.4rem;
              margin-left: 0.01rem;
            "
            src="static/job_review.png"
          />
        </cell>
      </group>
    </div>
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
    <div
      class="assisantcss minFontSizemid noData"
      v-if="totalCount == 0 && unableDealCount == 0"
    >
      暂无数据
    </div>
  </div>
</template>
<script>
import minxin from "../../common/commonfunction";
import { mapState, mapMutations } from "vuex";
import Header from "@/common/header.vue";
export default {
  components: {
    Header,
  },
  created(){
    // alert(JSON.stringify(this.$store.state.todoData))
  },
  mixins: [minxin],
  computed: {
    todoData() {
      let titleInfos = this.$store.state.todoData;
      this.unableDealData = titleInfos.filter(
        (item) =>
          item.todoType != "100" &&
          item.todoType != "104" && // 用户申请被退回
          item.todoType != "105" && // 用户申请已完结
          item.todoType != "400" && // 数据需求被退回
          item.todoType != "401" && // 数据需求已完结
          item.todoType != "402" &&
          item.todoType != "403" &&
          item.todoType != "601" && // 特色需求已完结
          item.todoType != "602" && // 特色需求被退回
          item.todoType != "603" &&
          item.todoType != "606" &&
          item.todoType != "701" && // 数据下发已完结
          item.todoType != "702" && // 数据下发被退回
          item.todoType != "703" &&
          item.todoType != "800" && // 手工数据已完结
          item.todoType != "801" && // 手工数据待处理
          item.todoType != "802" && // 手工数据被退回
          item.todoType != "705" &&
          item.todoType != "706" &&  // 数据下发带复核
          item.todoType != "707" &&
          item.todoType != "901" &&
          item.todoType != "404" &&
          item.todoType != "803" && //备案流程完结
          item.todoType != "804" && //备案流程退回
          item.todoType != "805"    //备案流程待处理
      );
      if (this.unableDealData) {
        let allcout = 0;
        this.unableDealData.forEach((item) => {
          allcout += Number(item.count);
        });
        this.unableDealCount = allcout;
      } else {
        this.unableDealCount = 0;
      }
      titleInfos = titleInfos.filter(
        (item) =>
          item.todoType == "100" ||
          item.todoType == "104" || // 用户申请被退回
          item.todoType == "105" || // 用户申请已完结
          item.todoType == "400" || // 数据需求被退回
          item.todoType == "401" || // 数据需求已完结
          item.todoType == "402" ||
          item.todoType == "403" ||
          item.todoType == "601" || // 特色需求已完结
          item.todoType == "602" || // 特色需求被退回
          item.todoType == "603" ||
          item.todoType == "606" ||
          item.todoType == "701" || // 数据下发已完结
          item.todoType == "702" || // 数据下发被退回
          item.todoType == "703" ||
          item.todoType == "705" ||
          item.todoType == "706" ||
          item.todoType == "707" ||
          item.todoType == "901" ||
          item.todoType == "800" || // 手工数据已完结
          item.todoType == "801" || // 手工数据待处理
          item.todoType == "802" || // 手工数据被退回
          item.todoType == "404" ||
          item.todoType == "803" || //备案流程完结
          item.todoType == "804" || //备案流程退回
          item.todoType == "805"    //备案流程待处理
      );
      if (titleInfos) {
        let allcout = 0;
        titleInfos.forEach((item) => {
          allcout += Number(item.count);
        });
        this.totalCount = allcout;
      } else {
        this.totalCount = 0;
      }
      return titleInfos;
      //return this.$store.state.todoData
    },
  },
  watch: {
    todoData: {
      handler(val) {
        if (this.titleInfos) {
          let allcout = 0;
          val.forEach((item) => {
            allcout += Number(item.count);
          });
          this.totalCount = allcout;
        } else {
          this.totalCount = 0;
        }
      },
      deep: true,
    },
  },
  mounted() {
    if (!this.totalCount) {
      let w = screen.width - 21,
        h = screen.height - 132;
      this.$refs.noassisant.style.height = h + "px";
      this.$refs.noassisant.style.width = w + "px";
      this.$refs.noassisant.style.lineHeight = h + "px";
    }
  },
  data() {
    return {
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
      userName: "张晓明",
      titleInfos: [],
      totalCount: 0,
      unableDealCount: 0, // 不能处理数据总数
      actionSheetVisable: false,
      unableDealData: [], // 不能处理的数据
    };
  },
  methods: {
    ...mapMutations(['setTransitionName']),
    back() {
        let index;
        let source = sessionStorage.getItem('source') || '';
        source == 'home' ? index=0 : index = 2;
        this.setTransitionName('slide-right')
        this.push('home');
        this.$store.commit({
            type: 'changepage',
            pageindex: index,
        });
    },
    gotoAppreview(row) {
      let allTypeList=["100","104","105", "400","401","402", "403", "404", "601","602","603", "606", "701","702","703", "705", "706", "707", "800", "801", "802","803","804","805"]
      //手工数据流程type
      let typelist = ["100","104","105", "400","401","402", "403", "404", "601","602","603", "606", "701","702","703", "705", "706", "707", "800", "801", "802"];// 706特色数据下发 待复核
      //备案流程 type
      let recordList = ["803","804","805"]

      if (row.todoType == '901') {
        this.setTransitionName('')
        this.$router.push({path:'myMessage',query:{todoPara: row.todoPara,todoFlag: row.todoState, isZnzl : true}})
        return
      }
      // alert(JSON.stringify(row))
      sessionStorage.setItem("todoType", row.todoType);
      if (allTypeList.indexOf(row.todoType) == -1) {
        this.actionSheetVisable = true;
        this.sheet("此流程请在PC端处理");
        return;
      }
      //####################################################
      //  if (recordList.indexOf(row.todoType) > -1) {
      //   this.$router.push({path: 'dataRecordList', query: {todoPara: row.todoPara,todoState: row.todoState, todoType: row.todoType,todoFlag:row.todoFlag}})
      // }
      if (allTypeList.indexOf(row.todoType) > -1) {
        // this.$emit("showreviewpage")
        this.setTransitionName('')
        this.$router.push({path: 'reviewdetail', query: {todoPara: row.todoPara,todoState: row.todoState, todoType:  row.todoType}})
        //this.push("reviewdetail");
      }  else {
        this.setTransitionName('')
        this.push("showdonelist");
      }
    },
  },
};
</script>
<style lang='less' scoped>
.assisantcss {
 // padding: 0 0 0 0;
  //padding: 2.8vh 0 0 0;
  margin-top:22px;
  background-color:#ffffff;
  .assisanttitle {
    height: 0.4rem;
    line-height: 0.4rem;
    padding-left: 4%;
    padding-bottom:0.3rem;
    margin-top:0.21rem;
    padding-top:0.4rem;
    background-color:#ffffff;
  }
}
.noData {
  text-align: center;
  padding-top: 20px;
}
</style>
