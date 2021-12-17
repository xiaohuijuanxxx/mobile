<template>
    <div ref="userDetail" class="marginHeader" style="margin-top:0.8rem;" v-touch:right="tobackpage">
        <!-- <x-header :left-options="backoptions" @on-click-back="tobackpage" class="cjHeader headerFixed">用户审批详情</x-header> -->
        <!-- <Header :backoptions="backoptions" @tobackpage='tobackpage' title="需求审批详情" /> -->
        <Header :backoptions="backoptions" @tobackpage='tobackpage' title="用户审批详情" />
        <group>
            <group-title slot="title" class="myGroupTit midFontSize">用户基本信息</group-title>
            <x-input title="工号" v-model="rowInfo.username" readonly></x-input>
            <x-input title="姓名" v-model="rowInfo.name" readonly></x-input>
            <x-input title="总行/分行" v-model="userOrgNameo" readonly></x-input>
            <x-input title="部门" v-model="userDeptNameo" readonly></x-input>
            <x-input title="岗位" v-model="rowInfo.posotion" readonly></x-input>
            <x-textarea title="OA邮箱" v-model="rowInfo.email" readonly :rows='2'></x-textarea>
        </group>

        <group>
            <group-title slot="title" class="myGroupTit midFontSize">申请信息</group-title>
            <x-input v-if="rowInfo.useFunction.length < 15" title="使用功能" v-model="rowInfo.useFunction" readonly></x-input>
            <x-textarea v-else title="使用功能" v-model="rowInfo.useFunction" readonly></x-textarea>
            <template  v-if="rowInfo.dataAuthority.length > 2">
                <x-input v-if="rowInfo.dataAuthority.length < 15" title="数据权限" v-model="rowInfo.dataAuthority" readonly></x-input>
                <x-textarea v-else title="数据权限" v-model="rowInfo.dataAuthority" readonly></x-textarea>
            </template>
            <x-textarea v-show="rowInfo.dataAuthorityElse != ''" title="其他" v-model="rowInfo.dataAuthorityElse" readonly></x-textarea>
            <x-input title="一级标签" v-model="rowInfo.userLabel1ch" readonly></x-input>
            <x-input title="二级标签" v-model="rowInfo.userLabel2ch" readonly></x-input>
            <x-input title="时限类型" v-model="rowInfo.limitTypech" readonly></x-input>
            <x-input title="使用时限" v-model="rowInfo.invalidDate" readonly></x-input>
            <x-textarea title="申请原因" v-model="rowInfo.applyReason" readonly></x-textarea>
        </group>
        <group >
            <group-title slot="title" class="myGroupTit midFontSize">审批
                <span style="font-size:0.3rem;padding-left:0.5rem;color:gray">审批意见请点击查看<img style="width: 4.5%;vertical-align: sub;" src="static/mydown.png" /></span>
            </group-title>
        </group>
        <flow orientation="vertical" class='flowtitlecss' :style='flowm'>
            <!-- <flow-state  v-if='approveList.length>0' state="1" 
                :title="textRE(approveList[0].node)+approveList[0].userId+':'+approveList[0].orgName +resultList[0].opinion" 
                :is-done="!!(Number(approveList[0].approveStatus)>1)" 
                @click.native="resultBt(resultList[0].opinion)"
                :class="{refuse : approveList[0].approveStatus == 3 ? true : false}"
                ></flow-state> -->
            <flow-state  v-if='approveList.length>0' state="1" 
                :title="textRE(approveList[0].node)+approveList[0].userId+`${resultList[0].opinion ? ':'+resultList[0].opinion :''}`" 
                :is-done="!!(Number(approveList[0].approveStatus)>1)" 
                @click.native="resultBt(resultList[0].opinion)"
                :class="{refuse : approveList[0].approveStatus == 3 ? true : false}"
                ></flow-state>
            <flow-line v-if='approveList.length>1' :is-done='!!(Number(approveList[1].approveStatus)>1)' ></flow-line>
            <flow-state  v-if='approveList.length>1' state="2" 
                :title="textRE(approveList[1].node)+approveList[1].userId"
                :is-done="!!(Number(approveList[1].approveStatus)>1)" 
                @click.native="resultBt(resultList[1].opinion)"
                :class="{refuse : approveList[1].approveStatus == 3 ? true : false}"></flow-state>
            <flow-line v-if='approveList.length>2' :is-done='!!(Number(approveList[2].approveStatus)>1)' ></flow-line>
            <flow-state v-if='approveList.length>2' state="3" 
                :title="textRE(approveList[2].node)+approveList[2].userId" 
                :is-done="!!(Number(approveList[2].approveStatus)>1)" 
                @click.native="resultBt(resultList[2].opinion)"
                :class="{refuse : approveList[2].approveStatus == 3 ? true : false}"></flow-state>
            <flow-line v-if='approveList.length>3' :is-done='!!(Number(approveList[3].approveStatus)>1)' ></flow-line>
            <flow-state v-if='approveList.length>3' state="4" 
                :title="textRE(approveList[3].node)+approveList[3].userId" 
                :is-done="!!(Number(approveList[3].approveStatus)>1)" 
                @click.native="resultBt(resultList[3].opinion)"
                :class="{refuse : approveList[3].approveStatus == 3 ? true : false}"></flow-state>
            <flow-line v-if='approveList.length>4' :is-done='!!(Number(approveList[4].approveStatus)>1)' ></flow-line>
            <flow-state  v-if='approveList.length>4' state="5" 
                :title="textRE(approveList[4].node)+approveList[4].userId" 
                :is-done="!!(Number(approveList[4].approveStatus)>1)" 
                @click.native="resultBt(resultList[4].opinion)"
                :class="{refuse : approveList[4].approveStatus == 3 ? true : false}"></flow-state>
        </flow>
        <group>
            <x-textarea v-if="this.$route.query.applyStatus == '0' || this.$route.query.applyStatus == '6'"
            title="审批意见"
            readonly
            style="margin-bottom: 0.4rem;"
            class="label_color"
            :rows='1'
            v-html="lastback"
        ></x-textarea>
        </group>
        <group v-if="this.$route.query.applyStatus != '0' && this.$route.query.applyStatus != '6'">
            <selector class="mySel" title="审批意见" v-model="spyj" :options='selectlist' direction='rtl' @on-change='witchcho' placeholder='请选择'></selector>
            <div @click="inputCli" ref="spyj">
                <x-textarea :max="200" v-model="approvalText" placeholder="请输入审批意见" ref='spyjText' @on-blur="areaUnBlur"></x-textarea>
            </div>
        </group>
        <flexbox style="margin-top: 1rem;padding-bottom:1rem;" v-if="this.$route.query.applyStatus != '0' && this.$route.query.applyStatus != '6'">
            <flexbox-item>
                <x-button type="warn" @click.native="agreeConfirm" style="width:95%;">提交</x-button>
            </flexbox-item>
        </flexbox>
        <!-- <div v-transfer-dom>
          <confirm v-model="showConfirm"
          :title="operationTip"
          @on-cancel="onCancel"
          @on-confirm="onConfirm">
            <p style="text-align:center;">{{showConfirmText}}</p>
          </confirm>
        </div> -->
        <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
        <actionsheet v-model="showConfirm" :menus="menusall" @on-click-menu-delete="onConfirm" show-cancel></actionsheet>
        <actionsheet v-model="showConfirmt" :menus="menusall" @on-click-menu-delete="onConfirmt" :close-on-clicking-mask='false'></actionsheet>
    </div>
</template>
<script>
    let URL=require('../asssets/Api/api')
    import { TransferDomDirective as TransferDom} from 'vux'
    import { mapMutations, mapState } from 'vuex';
    import { ajaxGet,ajaxPost,closeWindow,ajaxtokenPost,hideWebViewTitle } from '../../core/mxApi'
    import minxin from '@/common/commonfunction.js'
    import Header from '@/common/header.vue'
    import Bus from '@/bus/bus';
    export default {
        directives: {
            TransferDom
        },
        components: {
            Header
        },
        mixins: [minxin],
        computed:{
            userOrgNameo:{
                get(){
                    if(this.rowinf !=null){
                        return this.rowinf.userOrgName
                    }else{
                        let rowInfo=JSON.parse(sessionStorage.getItem('userreviewitem'))
                        return rowInfo?rowInfo.userOrgName:''
                    }
                },
                set(val){}
            },
            userDeptNameo:{
                get(){
                    if(this.rowinf !=null){
                        return this.rowinf.userDeptName
                    }else{
                        let rowInfo=JSON.parse(sessionStorage.getItem('userreviewitem'))
                        return rowInfo?rowInfo.userDeptName:''
                    }
                },
                set(val){}
            }
        },
        // },
        watch: {
            actionSheetVisable(val) {
                if (val) {
                    hideWebViewTitle()
                }else {
                    //  MXWebui.showWebViewTitle()
                }
            },
            actionSheetVisableJ(val) {
                if (val) {
                    hideWebViewTitle()
                }else {
                    //  MXWebui.showWebViewTitle()
                }
            }
        },
        mounted() {
            // MXWebui.disableTranslucentHeader({
            //  onSuccess: function() {}, // 禁⽌成功
            //  onFail: function() {} // 禁⽌失败
            // });
            this.lastback = this.$route.query.applyStatus == '0'
                ? `<span style="color:grey;margin-right:4rem">审批意见</span>
                驳回`
                : `<span style="color:grey;margin-right:4rem">审批意见</span>
                完结`;
            let _this=this,
                requireid=_this.getquerystring('requireId'),
                node=_this.getquerystring('node') || '',
                id=_this.getquerystring('id') || '',
                userDeptNameic=_this.getquerystring('userDeptName') || '',
                userOrgNameic=_this.getquerystring('userOrgName') || '',
                userDeptName=userDeptNameic?decodeURI(userDeptNameic):'',
                userOrgName=userOrgNameic?decodeURI(userOrgNameic):''
            let pagedata={requireid,node,id,userDeptName,userOrgName}
            if(requireid){
                _this.rowinf=pagedata
                _this.getinto(pagedata)
                sessionStorage.setItem("isTui", true);
            }else{
                let rowInfo=JSON.parse(sessionStorage.getItem('userreviewitem'))
                let parmas={
                    applyId: rowInfo.applyId,
                }
                let params2 = {
                    applyId: _this.$route.query.applyId,
                    node: _this.$route.query.node
                }
                _this.showloading()
                _this.getApproveDetailfun(parmas)
                _this.getApproveSpeed(params2)
            }
        },
        methods: {
            ...mapMutations(['setTransitionName']),
            onConfirmt()  {
                closeWindow()
            },
            // 审批意见 textArea 失去焦点
            areaUnBlur() {
                var u = navigator.userAgent, app = navigator.appVersion;
                var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isIOS) {
                    this.$refs.spyj.style.cssText=  'padding-bottom:0px'
                    Bus.$emit('textFocus', 1)
                    window.ontouchstart =""
                    this.$refs.spyj.removeEventListener("touchstart", this.zuzhi)
                    //this.$refs.userDetail.removeEventListener("touchstart", this.zuzhi)
                    window.ontouchmove="";
                }
            },
            zuzhi(e) {
                e.preventDefault && e.preventDefault();
                e.returnValue=false;
                e.stopPropagation && e.stopPropagation();
                return false;
            },
            // 审批意见 textArea 聚焦
            inputCli() {
                var u = navigator.userAgent, app = navigator.appVersion;
                var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isIOS) {
                    this.$refs.spyjText.focus();
                    let hei = document.body.offsetHeight - window.innerHeight
                    this.$refs.spyj.style.cssText=  'padding-bottom:' + hei + 'px'
                    setTimeout(() => {
                        document.documentElement.scrollTop = document.body.offsetHeight
                        Bus.$emit('textFocus')
                        window.ontouchmove=function(e){
                            e.preventDefault && e.preventDefault();
                            e.returnValue=false;
                            e.stopPropagation && e.stopPropagation();
                            return false;
                        };
                        this.$refs.spyj.addEventListener("touchstart", this.zuzhi)
                        //this.$refs.userDetail.addEventListener("touchstart", this.zuzhi)
                    }, 100)
                }
            },
            // 获取审批进度 并展示
            getApproveSpeed(params) {
                let url = ''
                if (this.$route.query.node == 1 || this.$route.query.node == 2) {
                    url = URL.url.getApproveList1
                }else if(this.$route.query.node == 3 || this.$route.query.node == 4 || this.$route.query.node == 5) {
                    url = URL.url.getApproveList2
                } else if (this.$route.query.applyStatus == '0' || this.$route.query.applyStatus == '6') { // 0 退回 6完结 9撤回
                    url = URL.url.getApproveList1
                }
                ajaxGet(url,params).then(res => {
                    let {data:{data,code}}=res
                    if(data.length == 1){
                        this.flowm = `height:0.3rem;`;
                    }else{
                        this.flowm = `height:${(Number(data.length) - 1) * 0.75}rem;`;
                    }
                    this.approveList = data
                    console.log(this.approveList);
                    this.resultList = res.data.data
                }).catch(error => {
                    let omsg = this.outmsg(error)
                    if(!omsg){
                        return
                    }
                    this.closeloading()
                    this.actionSheetVisable= true
                    this.sheet(omsg)
                })
            },
             // 审批栏审批信息点击查看
            resultBt(i){
                if(!i){
                    // alert('暂未审批')
                }else {
                    this.$vux.alert.show({
                        title:'审批意见',
                        content: `${i}`
                    })
                }
            },
            witchcho(key){
                if(key=='1'){
                    this.approvalText='同意。'
                }else{
                    this.approvalText=''
                }
            },
            getinto(pagedata){
                let _this=this
                document.addEventListener('deviceready',()=> {
                    MXCommon.getSSOToken(
                        'datamdwp',
                        ssoToken=> {
                            window.sessionStorage.setItem('appToken',ssoToken)
                            MXCommon.getCurrentUser(user=> {
                                let  params={userName: user.login_name,loginChannel:'MX',mx_sso_token:ssoToken}
                                let tokenurl=`${URL.url.getToken}?grant_type=password&username=${user.login_name}&password=${user.login_name}`
                                ajaxtokenPost(tokenurl).then(res=> {
                                    let token=`${res.data.token_type} ${res.data.access_token}`
                                    _this.$store.commit({
                                        type:"getssoToken",
                                        ssoToken: token
                                    });
                                    let seeData=JSON.stringify(res.data.principal)
                                    window.sessionStorage.setItem('currentUser',seeData)
                                    let parmsid={
                                        approvalId:pagedata.id
                                    }
                                    ajaxGet(URL.url.getUserStatus,parmsid).then(resid=>{
                                        let {data:{data,code}}=resid
                                        if(code=='0000'){
                                            if(Number(data)<2){ // 0 提交 1 待审核 2 审核通过 3 退回
                                                if(pagedata.node == '5'){
                                                    _this.showConfirmt=true
                                                    _this.sheet('此流程请在PC端处理','info')
                                                    return
                                                }
                                                let parmas={
                                                    applyId: pagedata.requireid,
                                                }
                                                let parmas2={
                                                    applyId: pagedata.requireid,
                                                    node: pagedata.node
                                                }
                                                _this.getApproveDetailfun(parmas)
                                                _this.getApproveSpeed(parmas2)
                                            }else{
                                                if (this.$route.query.applyStatus == '0' || this.$route.query.applyStatus == '6') {
                                                    let params = {applyId: pagedata.requireid,}
                                                     _this.getApproveDetailfun(params)
                                                     _this.getApproveSpeed(params)
                                                     sessionStorage.setItem("isTui", true);
                                                } else {
                                                    _this.showConfirmt=true
                                                    _this.sheet('该申请单已审批！','info')
                                                }
                                            }
                                        }else{
                                            _this.showConfirmt=true
                                            _this.sheet('该申请单不存在！')
                                        }
                                    }).catch(error=>{
                                        let omsg = _this.outmsg(error)
                                        if(!omsg){
                                            return
                                        }
                                        _this.closeloading()
                                        _this.showConfirmt=true
                                        _this.sheet(omsg,'info')
                                    })
                                }).catch(err => {
                                    let omsg=_this.outmsg(err)
                                    if(!omsg){
                                        return
                                    }
                                    _this.closeloading()
                                    _this.actionSheetVisable= true
                                    _this.sheet(omsg)
                                })
                            });
                        }
                    );
                })
            },
            getApproveDetailfun(parmas){
                let _this=this
                ajaxGet(URL.url.getApproveDetail,parmas).then(res=> {
                    let {data:{data,code}}=res
                    if(code=='0000'){
                        for(let key in data){
                            if(data[key]==null){
                                data[key]=''
                            }
                        }
                        data.userLabel1ch=''
                        data.userLabel2ch=''
                        data.limitTypech=''
                        _this.getlabel1()
                        _this.getlabel2(data)
                        _this.getlimttype()
                        _this.rowInfo=data

                    }
                }).catch(err => {
                    let omsg=this.outmsg(err)
                    _this.closeloading()
                    if(!omsg){
                        return
                    }
                    _this.actionSheetVisable= true
                    _this.sheet(omsg)
                })
            },
            getlabel1(){
                ajaxGet(URL.url.getAllLabel).then(response=> {
                    let {data:{data,code}}=response
                    this.rowInfo.userLabel1ch=''
                    if(code=='0000' && data.length){
                        this.rowInfo.userLabel1ch=data.find(item=>{
                            return item.labelId==this.rowInfo.userLabel1
                        }).labelName
                        this.closeloading()
                    }
                }).catch(err => {
                    this.rowInfo.userLabel1ch=''
                    let omsg=this.outmsg(err)
                    this.closeloading()
                    if(!omsg){
                        return
                    }
                    this.actionSheetVisable= true
                    this.sheet(omsg)
                })
            },
            getlabel2(leb){
                ajaxGet(URL.url.getLabel2,{label:leb.userLabel1}).then(reh=> {
                    let {data:{data,code}}=reh
                    this.rowInfo.userLabel2ch=''
                    if(code=='0000' && data.length){
                        let label2name=data.map(item=>{
                            return item.labelName
                        })
                        this.rowInfo.userLabel2ch=label2name.join(',')
                        this.closeloading()
                    }
                }).catch(err => {
                    this.rowInfo.userLabel2ch=''
                    let omsg=this.outmsg(err)
                    this.closeloading()
                    if(!omsg){
                        return
                    }
                    this.actionSheetVisable= true
                    this.sheet(omsg)
                })
            },
            getlimttype(){
                ajaxGet(URL.url.getAllDict).then(reh=> {
                    let {data:{data,code}}=reh
                    if(code=='0000'){
                        let limitTypelist=data.userLimit
                        this.rowInfo.limitTypech=limitTypelist.find(item=>{
                            return item.value==this.rowInfo.limitType
                        })?limitTypelist.find(item=>{
                            return item.value==this.rowInfo.limitType
                        }).name:''
                        this.closeloading()
                    }
                }).catch(err => {
                    this.rowInfo.limitTypech=''
                    let omsg=this.outmsg(err)
                    this.closeloading()
                    if(!omsg){
                        return
                    }
                    this.actionSheetVisable= true
                    this.sheet(omsg)
                })
            },
            refuseConfirm () {
                if(!this.approvalText){
                    this.actionSheetVisable = true
                    this.sheet('请先填写审批意见')
                    return
                }
                this.showConfirm = true
                this.isAgree = false
                this.sheet('你是否拒绝该条申请信息？')

                //this.showConfirmText = '你是否拒绝该条申请信息？'
            },
            onCancel () {
                this.showConfirm = false
            },
            tobackpage(){
                if(this.rowinf != null){
                    this.showloading()
                    ajaxGet(URL.url.loginout).then((res) => {
                        const { data: { code, message, data } } = res;
                        if (code == '0000') {
                            closeWindow();
                        }
                    }).catch((err) => {
                        const omsg = this.outmsg(err);
                        this.closeloading();
                        if (!omsg) {
                            return;
                        }
                        this.actionSheetVisable= true
                        this.sheet(omsg)
                    });
                }else{
                    if (this.$route.query.type === 'yhsp'){
                        this.setTransitionName('slide-right')
                        this.push('myApproval')
                        // this.$store.commit({
                        //     type: 'changepage',
                        //     pageindex: 2,
                        // });
                    }else {
                        this.setTransitionName('slide-right')
                        this.push('reviewdetail')
                    }
                }
            },
            onConfirm () {
                let _this=this,rowInfom
                
                if(this.rowinf){
                    rowInfom=this.rowinf
                }else{
                    rowInfom=JSON.parse(sessionStorage.getItem('userreviewitem'))
                }
                let userinfo=JSON.parse(sessionStorage.getItem('currentUser'))
                let parmas={
                    applyId: this.rowInfo.applyId, //usernames.username
                    applyType: this.rowInfo.applyType,
                    username: this.rowInfo.username,
                    followType: this.rowInfo.followType,
                    usernameNew:userinfo.username,
                    context:this.approvalText,
                    node:rowInfom.node,
                    id:rowInfom.id
                }
                if (this.isAgree === false){
                    _this.showloading()
                    ajaxPost(URL.url.approveDealRefuse,JSON.stringify(parmas)).then(res=> {
                        let {data:{data,code}}=res
                        if(code=='0000'){
                            this.$store({
                                type:'getreflashtodoform',
                                reflashtodoform:1
                            })
                            _this.closeloading()
                        }
                    }).catch(err => {
                        let omsg=_this.outmsg(err)
                        _this.closeloading()
                        if(!omsg){
                            return
                        }
                        _this.actionSheetVisable= true
                        _this.sheet(omsg)
                    })
                }else {
                    _this.showloading()
                    ajaxPost(URL.url.approveDealPass,JSON.stringify(parmas)).then(res=> {
                        let {data:{data,code}}=res
                        if(code=='0000'){
                            _this.closeloading()
                        }
                    }).catch(err => {
                        let omsg=this.outmsg(err)
                        _this.closeloading()
                        if(!omsg){
                            return
                        }
                        _this.actionSheetVisable= true
                        _this.sheet(omsg)
                    })
                }
                _this.setTransitionName('')
                _this.push("approvalFinish")
            },
            agreeConfirm () {
                if (!this.spyj) {
                    // this.menu = this.menus1
                    this.actionSheetVisable = true
                    this.sheet('请选择审批意见')
                    //this.message('请选择审批意见','warn')
                    return
                }
                if(!this.approvalText){
                    this.actionSheetVisable = true
                    this.sheet('请先填写审批意见')
                    return
                }
                this.showConfirm = true
                if(this.spyj=='1'){
                    this.isAgree = true
                    this.sheet('你是否同意该条申请信息？')
                    //this.showConfirmText = '你是否同意该条申请信息？'
                }else{
                    this.isAgree = false
                    this.sheet('你是否拒绝该条申请信息？')
                    //this.showConfirmText = '你是否拒绝该条申请信息？'
                }
            }
        },
        data () {
            return {
                //控制完结和退回的回复语
                lastback:'',
                resultList:[],
                approveList: [], // 审批进度 list
                flowm: '',
                textRE(node) {
                    let txt = ''
                    if (node == 1) {
                        txt = '申请部门负责人    '
                    } else if(node == 2) {
                        if (this.rowInfo.applyType == 'user_apply1' || this.rowInfo.applyType == 'user_update1' || this.rowInfo.applyType == 'user_deletee1') {
                            txt = '申请部门主管行领导    '
                        } else if (this.rowInfo.applyType == 'user_apply2' || this.rowInfo.applyType == 'user_update2' || this.rowInfo.applyType == 'user_deletee2') {
                            txt = '申请部门条线总监    '
                        }
                    } else if(node == 3) {
                        txt = '总行管理部门预审    '
                    } else if(node == 4) {
                        txt = '总行管理部门领导审批    '
                    } else if(node == 6) {
                        txt = '数据管理部审批    '
                    }
                    return txt
                },
                rowInfo:{
                    username:'',
                    name:'',
                    userOrgName:'',
                    userDeptName:'',
                    posotion:'',
                    email:'',
                    useFunction:'',
                    dataAuthority:'',
                    userLabel1:'',
                    userLabel2:'',
                    limitType:'',
                    userLabel1ch:'',
                    userLabel2ch:'',
                    limitTypech:'',
                    invalidDate:'',
                    applyReason:'',
                    node:'',
                    deptLeaderUser:'',
                    applyType:'',
                    deptChiefUser:'',
                    deptBankUser:'',
                    approveUser:'',
                    dataAuthorityElse:'',
                    id:''
                },
                backoptions:{
                    preventGoBack:true,
                    backText: ''
                },
                rowinf:null,
                spyj:'',
                selectlist:[{key:'1',value:'同意'},{key:'0',value:'拒绝'}],
                approvalText: '',
                operationTip: '操作提示',
                showConfirm: false,
                showConfirmt:false,
                isAgree: false,
                showConfirmText: ""
            }
        }
    }
</script>
<style lang="less">
    .weui-label {
        width: 3em;
        color: #999999;
        text-align: left;
    }
    .weui-input {
        color: black;
        text-align: right;
    }
    // .weui-cells {
    //   font-size: 13px !important;
    // }

    // .weui-cells__title {
    //   font-size: 13px !important;
    // }
    .flowtitlecss {
        padding: 0.1rem 0.2rem 0 0.2rem !important;
        .weui-wepay-flow__bd {
            margin-left: -6.5rem;
        }
        .revicss {
            //font-size: 0.3rem;
            color: black;
            margin: 0 0 0.1rem 0.25rem;
        }
        /deep/.refuse .weui-wepay-flow__state{ 
            background: rgb(238, 68, 68) !important;
        }
    }
    
    .mySel {
        .weui-label{width:110px !important;}
    }
    .label_color {
        /deep/ .weui-label {
            color: #999999;
        }
        /deep/ .weui-input {
            color: black;
            text-align: right;
        }
        /deep/ .weui-textarea {
            color: black;
            text-align: right;
        }
    }
</style>
