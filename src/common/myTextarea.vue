<template>
  <div @click="areaInputFocus" ref="spyj">
    <x-textarea
      :max="max"
      ref="spyjText"
      v-model="content"
      :placeholder="placeholder"
      @on-blur="textBlur"
    ></x-textarea>
  </div>
</template>
<script>
import Bus from "@/bus/bus";
export default {
  props: {
    placeholder: {
      type: String,
      default: "请输入",
    },
    content: {
      type: String
    },
    max: {
      type: Number,
      default: 200,
    },
  },
  methods: {
    // textarea 失去焦点时
    textBlur() {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS) {
        this.$refs.spyj.style.cssText = "padding-bottom:0px";
        Bus.$emit("textFocus", 1);
        window.ontouchstart = "";
        this.$refs.spyj.removeEventListener("touchstart", this.zuzhi);
        window.ontouchmove = "";
      }
    },
    // 监听事件的具体操作
    zuzhi(e) {
      e.preventDefault && e.preventDefault();
      e.returnValue = false;
      e.stopPropagation && e.stopPropagation();
      return false;
    },
    // textarea 聚焦时
    areaInputFocus() {
      var u = navigator.userAgent,
        app = navigator.appVersion;
      var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
      if (isIOS) {
        this.$refs.spyjText.focus();
        let hei = document.body.offsetHeight - window.innerHeight;
        this.$refs.spyj.style.cssText = "padding-bottom:" + hei + "px";
        setTimeout(() => {
          let scroll = document.body.offsetHeight + hei;
          document.documentElement.scrollTop = scroll;
          Bus.$emit("textFocus");
          window.ontouchmove = function (e) {
            e.preventDefault && e.preventDefault();
            e.returnValue = false;
            e.stopPropagation && e.stopPropagation();
            return false;
          };
          this.$refs.spyj.addEventListener("touchstart", this.zuzhi);
          this.$refs.userDetail.addEventListener("touchstart", this.zuzhi);
        }, 100);
      }
    },
  },
  watch: {
      content(val) {
          this.$emit('update:content', val)
      }
  }
};
</script>
<style scoped>
</style>