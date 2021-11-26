<template>
  <div
    class="start"
    :style="{backgroundImage: `url(${src})`,}"
  >
  <!-- style="
      background: url('static/noBQ.png') no-repeat;
      background-size: contain;
    " -->
    <div class="bq">
      数据管理部版权所有 Copyright © 2001-{{ new Date().getFullYear() }} All
      Rights Reserved
    </div>
  </div>
</template>

<script>
import minxin from "@/common/commonfunction.js";
import { hideWebViewTitle, ajaxGet } from "../core/mxApi";
const URL = require("../dataPass/asssets/Api/api");
export default {
  components: {},
  mixins: [minxin],
  methods: {
    success(src, ele) {
      const span = ele.parentNode.querySelector("span");
      ele.parentNode.removeChild(span);
    },
    error(src, ele, msg) {
      const span = ele.parentNode.querySelector("span");
      span.innerText = "load error";
    },
    tohome() {
      this.push("home");
    },
    getUrl() {
      let pamars = {
        page: 1,
        status: "Y",
        per_page: 1,
      };
      ajaxGet(URL.url.getStartBg, pamars)
        .then((res) => {
          if (res.data.data) {
            this.src = URL.url.downApplyFile + res.data.data[0].fileUrl
          }
        })
        .catch((error) => {
        });
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
            this.push("home");
            // this.swiperlist = dt;
            // this.data = dt;
          }
        })
        .catch((error) => {
          this.push("home");
          const omsg = this.outmsg(error);
          this.closeloading();
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
  },
  created() {
    // this.getUrl();
  },
  mounted() {
    hideWebViewTitle();
    let vm = this; //ajaxGet   vm.$http.get
    this.getBannerList()
    setTimeout(() => {
      vm.push("home");
    }, 3000);
  },
  data() {
    return {
      src: "static/noBQ.png",
      // list: ["static/noBQ.png"],
    };
  },
};
</script>

<style>
.start {
  width: 100%;
  height: 100%;
  background-size: cover;
  background-position: center;
}
.bq {
  color: #c0c0c0;
  font-size: 0.21rem;
  position: fixed;
  bottom: 30px;
  width: 100%;
  text-align: center;
}
.ximg-demo {
  width: 100%;
  height: auto;
}
.ximg-error {
  background-color: yellow;
}
.ximg-error:after {
  content: "加载失败";
  color: red;
}
</style>
