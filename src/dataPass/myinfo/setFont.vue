<template>
  <div style="border: none !important;height:100%;" v-touch:right="onSwipeRight">
    <Header
      :backoptions="backoptions"
      title="字体设置"
      @tobackpage="tobackpage"
    >
    </Header>
    <div class="minFontSize save" @click="save">保存</div>
    <group title="default range" class="mygroup">
      <div class="standardPar standardParFont">
        <span class="standard" style="font-size: 0.34rem">小</span>
        <span class="standard" style="font-size: 0.38rem">标准</span>
        <span class="standard" style="font-size: 0.42rem">大</span>
        <span class="standard" style="font-size: 0.46rem">特大</span>
      </div>
      <div class="standardPar">
        <span class="standard" @click="nodeCli(0)" :style="{ zIndex: range == 0 ? '-1' : '1' }"
          >▌</span
        >
        <span class="standard" @click="nodeCli(1)" :style="{ zIndex: range == 1 ? '-1' : '1' }"
          >▌</span
        >
        <span class="standard" @click="nodeCli(2)" :style="{ zIndex: range == 2 ? '-1' : '1' }"
          >▌</span
        >
        <span class="standard" @click="nodeCli(3)" :style="{ zIndex: range == 3 ? '-1' : '1' }"
          >▌</span
        >
      </div>
      <cell primary="content" class="myscell">
        <div class="zhe zhe-left"></div>
        <div class="zhe zhe-right"></div>
        <div class="zhe-bottom"></div>
        <range
          v-model="range"
          @on-change="onChange"
          :min="0"
          :max="3"
          style="margin-left: 30px"
          class="my-range"
        ></range>
      </cell>
    </group>
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
  </div>
</template>
<script>
// let less = {
//   env: 'development',
//   javascriptEnabled: true
// }
import { Range } from "vux";
import Header from "@/common/header.vue";
import minxin from "../../common/commonfunction";
import {judgeFontType} from "../../common/commonfunction";
import { ajaxGet, ajaxPost} from '../../core/mxApi';
const URL = require('../asssets/Api/api');
export default {
  components: {
    Range,
    Header,
  },
  mixins: [minxin],
  data() {
    return {
      boDate: "",
      actionSheetVisable: false,
      range: 1, // 默认为标准
      backoptions: {
        preventGoBack: true,
        backText: "",
      },
    };
  },
  created() {
    let font = this.$route.query.font
    if (font !== null && font !== '') {
      this.range = font
    }
  },
  methods: {
    // 返回设置页面
    onSwipeRight(){
      this.push("settings");
    },
    tobackpage() {
      let user = JSON.parse(sessionStorage.getItem("currentUser"));
      ajaxGet(URL.url.usersiting, { keyWord: user.username })
        .then((res) => {
          let {
            data: { code, message, data },
          } = res;
          this.closeloading();
          if (code == "0000" && data != null) {
            judgeFontType(Number(data[0].susSetting1));
          }
          this.push("settings");
        })
        .catch((err) => {
          let omsg = this.outmsg(err);
          this.closeloading();
          this.push("settings");
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
      
    },
    // 标志性节点被点击时
    nodeCli(val) {
      this.range = val
      judgeFontType(val)
    },
    onChange(val) {
      //  --bigSize: 0.38rem;// 1 头
      //  --midSize:0.376rem;// 2 标题
      //  --minSize:0.36rem;// 3  这个只用审批中心用、公告详情 相当于副标题
      //  --minSizemid:0.32rem;// 4  一般内容都用这个就行
      //  --minSizeMin:0.29rem;// 5  小提示
      judgeFontType(this.range)
    },
    save() {
      let user = JSON.parse(sessionStorage.getItem("currentUser"));
      let parm = {
        susUsercode: user.username,
        susSetting1: this.range,
      };
      this.showloading();
      ajaxPost(URL.url.editsetting, JSON.stringify(parm))
        .then((res) => {
          this.closeloading()
          let {
            data: { code, message, data },
          } = res;
          this.actionSheetVisable = true;
          this.sheet('字号设置成功');
        })
        .catch((error) => {
          this.closeloading()
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
<style lang="less" scoped>
.mygroup {
  border: none !important;
  &::after {
    border-bottom: none !important;
    border: none !important;
  }
  // /deep/ .weui-cell{height:30vh !important;background:aquamarine !important;}
}
.myscell {border: none !important;
  height: 40vh !important;
  &::after {
    border-bottom: none !important;
    border: none !important;
  }
}

.standardPar {
  position: absolute;
  top: 20.2vh;
  width: 97%;
  left: 9px;
  display: flex;
  justify-content: space-around;
  align-items: flex-end;
}
.standardParFont {
  top: 14.2vh;
}
.standard {
  color: #e92323;
  position: relative;
}
.my-range {
  /deep/ .range-bar {
    border-top: 1px dashed #e92323;
  }
  /deep/ .range-handle {
    background: #e92323;
    &::after {
      content: "";
      background-color: #fff;
      border-radius: 100%;
      cursor: move;
      height: 16px;
      left: 7px;
      top: 7px;
      position: absolute;
      width: 16px;
    }
  }
}
.zhe {
  position: absolute;
  top: 0;
  width: 0.70rem;
  bottom: 0;
  z-index: 99;
  background: #ffffff;
}
.zhe-left {
  left: 0;
}
.zhe-right {
  right: 0;
}
.zhe-bottom{position: absolute;
  width: 100%;
  bottom: 0;
  height: 1px;
  z-index: 99;
  background: #ffffff;}
.save{position:fixed;right:13px;top:0;z-index:99999;height:46px;line-height:46px;width:1rem;font-weight: normal;}
</style>
<style lang="less">

</style>