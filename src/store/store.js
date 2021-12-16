import Vue from 'vue';
import Vuex from 'vuex';
import { url } from '../dataPass/asssets/Api/api';
import { ajaxGet, ajaxPost } from '@/core/mxApi';

Vue.use(Vuex)

const state= {
   transitionName:'',//右滑动画
   pageindex:null, //首页的第几个页面
   tabContent:null, //应用的第几个页面
   ssoToken:'',
   reflashtodoform:0,
   todoData:[],
   draggIds: [], // 首页数聚用户设置展示的ID list
   draggData: [], // 首页数聚用户设置展示的 list
   themeList: [], // 数聚页list
   useIds: [], 
   useData: [], 
   useList: [],
   httpThemeList: [], // http请求来的
   bannerList: [],
   requirednode:null,
   countHeight: null,
   characterApplyPersonDeptId: null, //特色下发调研申请人所属部门id
   characterSurveyNotMobile: null,// 特色下发不能在移动端处理的list集合
   characterIssueNotMobile: null,// 特色需求不能在移动端处理的list集合
   tabbarHeight: null, //页面底部tabbar高度
}
//同步提交
const mutations={
    setTransitionName(state, data){
        state.transitionName=data
    },
    setTabbarHeight(state,payload){
        state.tabbarHeight=payload.tabbarHeight
    },
    setCharacterSurveyNotMobile(state, data) {
        state.characterSurveyNotMobile = data;
    },
    setCharacterIssueNotMobile(state, data) {
        state.characterIssueNotMobile = data;
    },
    changepage(state,payload){
        state.pageindex=payload.pageindex
    },
    getDeptId(state,data) {
        state.characterApplyPersonDeptId=data
    },
    changePadTop(state,payload){
        state.countHeight=payload.countHeight
    },
    changetabContent(state,payload){
        state.tabContent=payload.tabContent
    },
    getssoToken(state,payload){
        state.ssoToken=payload.ssoToken
    },
    getTodoData(state,payload){
        state.todoData=payload.todoData
    },
    getreflashtodoform(state,payload){
        state.reflashtodoform=payload.reflashtodoform
    },
    setDraggIds(state, data) {
      state.draggIds = data;
    },
    setThemeList(state, data) {
      state.themeList = data;
    },
    setHttpThemeList(state, data) {
      state.httpThemeList = data;
    },
    setDraggData(state, data) {
      state.draggData = data;
    },
    setBannerList(state, payload) {
        state.bannerList = payload.data;
    },
    setrequirednode(state, data) {
        state.requirednode = data;
    },

    setUseIds(state, data) {
        state.useIds = data;
    },
    setUseData(state, data) {
        state.useData = data;
    },
    setUseList(state, data) {
        state.useList = data;
    }
}
//异步提交
const actions={
    changepageAsync(context,payload){
        setTimeout(()=>{
            context.commit('changepage',payload)
        },1000)
    },
    changetabContentAsync(context,payload){
        setTimeout(()=>{
            context.commit('changetabContent',payload)
        },1000)
    },
    getssoTokenAsync(context,payload){
        setTimeout(()=>{
            context.commit('getssoToken',payload)
        },1000)
    },
    getTodoDataAsync(context,payload){
        setTimeout(()=>{
            context.commit('getTodoData',payload)
        },1000)
    }
}
export default new Vuex.Store({
    state,
    mutations,
    actions
})