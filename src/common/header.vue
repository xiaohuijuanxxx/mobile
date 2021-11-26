<template>
    <x-header style="height:0.8rem;" :left-options="backoptions" @on-click-back="tobackpage" class="headerFixed bigFontSize" ref="headerCom">{{title}}</x-header>
    <!-- <div class="headerFixed" :style="countHeight">{{title}}</div> -->
    <!--   -->
</template>

<script>
import { mapState} from 'vuex';
import Bus from '@/bus/bus';
export default {
    name: 'header',
    props: {
        title: {
            type: String,
            default: '数聚通'
        },
        backoptions: {
            type: Object,
        },
    },
    computed: {
     ...mapState({
        countHeight: state => state.countHeight
      }),
    },
    mounted() {
        this.jujiao()
    },
    methods: {
       tobackpage() {
           this.$emit('tobackpage')
       },
       jujiao() {
           let _this = this
           Bus.$on('textFocus', (e) => {
               if (e === 1) { 
                   // 失去焦点
                   this.$refs.headerCom.$el.style.cssText = ''
                   window.ontouchmove="";
               } else {
                   // 聚焦
                   let h =document.documentElement.scrollTop// + document.documentElement.clientHeight
                    _this.$refs.headerCom.$el.style.cssText= 'position:absolute !important;top:' + h + 'px !important;'
                    window.ontouchmove=function(e){
                            e.preventDefault && e.preventDefault();
                            e.returnValue=false;
                            e.stopPropagation && e.stopPropagation();    
                            return false;
                        };
               }
           })
       }
    }
}
</script>
<style scoped lang="less">
.vux-header-left{margin-top:0.1vh important;color:black !important;}
</style>