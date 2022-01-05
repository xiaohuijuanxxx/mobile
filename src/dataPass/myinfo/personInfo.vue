<template>
    <div style="height:auto;padding-top:0.3rem;" class="marginHeader person" v-touch:right="tobackpage">
        <!-- <x-header :left-options="backoptions" @on-click-back="tobackpage" class="cjHeader headerFixed">个人信息</x-header> -->
        <Header :backoptions="backoptions" @tobackpage='tobackpage' title="个人信息" />
        <group style="height: auto;" class="grou">
            <cell title="工号" :value="userInfor.username"></cell>
            <cell title="姓名" :value="userInfor.name"></cell>
            <div style="width:100%;overflow:hidden;">
                <hr style="height:0;border:none;" />
                <popup-picker class="label_color" title="性别" :data="sexList" v-model="userInfor.sex" show-name :columns="1" :disabled=isEdit></popup-picker>
            </div>
            <cell title="机构" :value="userInfor.userOrg"></cell>
            <cell title="部门" :value="userInfor.userDept"></cell>
            <cell title="岗位" :value="userInfor.posotion"></cell>
            <div @click="inputCli('email')" ref="email"  class="canEditCon">
                <span class="bankFixed" v-show="!isEdit">@bankofbeijing.com.cn</span>
                <x-textarea @on-blur="textUnBlur('email')" title="OA 邮 箱" ref="email1" :class="[isEdit ? 'isEdit myTextArea' : 'myTextAreaLeft','label_color','line']" v-model="userInfor.email" :readonly='isEdit' :rows='2'></x-textarea>
                <!-- @on-change="emailChange()" -->
            </div>
            <div @click="inputCli('telephone')" ref="telephone"  class="canEditCon">
                <x-input v-if="isEdit" title="固定电话"  ref="telephone1" :class="[isEdit ? 'noEditInput' : '','label_color','line']" v-model="userInfor.telephone" keyboard="number" :disabled='isEdit' :text-align="alignState"></x-input>
                <flexbox v-else :gutter="0">
                    <flexbox-item :span="3">
                        <div>固定电话</div>
                    </flexbox-item>
                    <flexbox-item :span="2.5">
                        <x-input @on-blur="textUnBlur('telephone2')" ref="telephone2" class="label_color line" v-model="userInfor.telephone2" keyboard="number" :disabled='isEdit' :text-align="alignState"></x-input>
                    </flexbox-item>
                    <flexbox-item :span="1.5"><span style="color:#000000;font-size:0.2rem;">—</span></flexbox-item>
                    <flexbox-item :span="4">
                        <x-input  @on-blur="textUnBlur('telephone3')"  ref="telephone3" class="label_color line" v-model="userInfor.telephone3" keyboard="number" :disabled='isEdit' :text-align="alignState"></x-input>
                    </flexbox-item>
                </flexbox>
            </div>
            <div @click="inputCli('mobile')" ref="mobile"  class="canEditCon">
                <x-input @on-blur="textUnBlur('mobile')" title="移动电话" ref="mobile1" :class="[isEdit ? 'noEditInput' : '','label_color','line']" v-model="userInfor.mobile" keyboard="number" is-type="china-mobile" :disabled='isEdit' :text-align="alignState"></x-input>
            </div>
            <div style="position:relative;z-index:383;">
                <div class="butCon" v-if="isEdit">
                    <x-button class="myButton editBut" type="warn" @click.native="toEdit">编辑</x-button>
                </div>
                <div v-else class="butCon">
                    <x-button class="myButton one"  @click.native="cancle" plain>取消</x-button>
                    <x-button type="warn" class="myButton" @click.native="toSave">保存</x-button>
                </div>
            </div>
            <span class="info minFontSizemid"><x-icon type="ios-information" size="15" ></x-icon>修改联系方式等信息可点击下方按钮进行修改；修改所属机构、岗位、使用功能、使用时限等移步至PC端进行流程审批。</span>
        </group>
        <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
    </div>
</template>

<script>
    import { url } from '../asssets/Api/api';
    import minxin from '@/common/commonfunction.js';
    import { ajaxGet, ajaxPost } from '../../core/mxApi';
    import { mapMutations } from 'vuex';
    import Header from '@/common/header.vue'
    import Bus from '@/bus/bus';
    export default {
        name: 'personInfo',
        data() {
            return {
                backoptions: {
                    preventGoBack: true,
                    backText: '',
                },
                userInfor: {
                    username: '', // 工号
                    name: '', // 姓名
                    sex: [],
                    userOrg: '', // 所属机构
                    userDept: '', // 所属部门
                    posotion: '',
                    email: '',
                    telephone: '', // 固定电话
                    mobile: '', // 移动电话
                },
                org: [],
                isSex: false,
                sexList: [
                    { value: '0', name: '男' },
                    { value: '1', name: '女' },
                ],
                isEdit: true, // 是否编辑状态中
                alignState: 'right', // 是否为编辑状态决定值对齐的值
                mobileRight: true,
                emailRight: true,
                teleRight1: true,
                teleRight2: true,
                lsMobile:'',
                lsTele:'',
                lsEmail:'',
                sex: ''
            };
        },
        mixins: [minxin],
        components: {
            Header
        },
        mounted() {
            // MXWebui.disableTranslucentHeader({
            //     onSuccess: function() {}, // 禁⽌成功
            //     onFail: function() {} // 禁⽌失败
            // });
            this.getPerOrg();
        },
        beforeRouteLeave(to,from,next){
            if(to.path=='/home'){
                this.$store.commit({
                    type: 'changepage',
                    pageindex: 3,
                });
                next()
            }else{
                return
            }
        },
        methods: {
            ...mapMutations(['setTransitionName']),
            // 可输入框 失去焦点
            textUnBlur(type) {
                // 邮箱格式校验
                if (type == 'email' && !this.isEdit) {
                    if (/^[0-9a-zA-Z]*$/.test(this.userInfor.email)) {
                        this.emailRight = true
                    } else {
                        //this.$refs.email1.blur()
                        // this.actionSheetVisable=true
                        this.emailRight = false
                    }
                } else if (type == 'telephone2' && !this.isEdit) {
                    if (/^[0-9]{3,4}$/.test(this.userInfor.telephone2)) {
                        this.teleRight1= true
                    } else {
                        this.teleRight1= false
                        // this.actionSheetVisable=true
                    }
                } else if (type == 'telephone3' && !this.isEdit) {
                    if (/^[0-9]{7,8}$/.test(this.userInfor.telephone3)) {
                        this.teleRight2 = true
                    } else {
                        this.teleRight2= false
                        // this.actionSheetVisable=true
                    }
                } else if (type == 'mobile' && !this.isEdit) {
                    if (/^1[3456789]\d{9}$/.test(this.userInfor.mobile)) {
                        this.mobileRight = true
                    } else {
                        this.mobileRight = false
                        // this.actionSheetVisable=true
                    }
                }
                var u = navigator.userAgent, app = navigator.appVersion;
                var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                if (isIOS) {
                    Bus.$emit('textFocus', 1)
                    window.ontouchstart =""
                    this.$refs.type.removeEventListener("touchstart", this.zuzhi)
                    window.ontouchmove="";
                }
            },
            zuzhi(e) {
                e.preventDefault && e.preventDefault();
                e.returnValue=false;
                e.stopPropagation && e.stopPropagation();
                return false;
            },
            // 可输入框 聚焦
            inputCli(type) {
                var u = navigator.userAgent, app = navigator.appVersion;
                var isIOS = !!u.match(/\(i[^;]+;( U;)? CPU.+Mac OS X/); //ios终端
                // 临时存储用户未编辑前的数据
                if (isIOS && !this.isEdit) {
                    if (type == 'email') {
                        this.$refs.email1.focus()
                    } else if (type == 'telephone') {
                        this.$refs.telephone.focus()
                    }else if (type == 'mobile') {
                        this.$refs.mobile1.focus()
                    }
                    setTimeout(() => {
                        Bus.$emit('textFocus')
                        window.ontouchmove=function(e){
                            e.preventDefault && e.preventDefault();
                            e.returnValue=false;
                            e.stopPropagation && e.stopPropagation();
                            return false;
                        };
                        this.$refs.type.addEventListener("touchstart", this.zuzhi)
                    }, 50)
                }
            },
            getPerOrg() {
                this.showloading()
                ajaxGet(url.getAllOrgDept).then((res) => {
                    if (res.data.data != null && res.data.data != 'null' && res.data.data != '') {
                        this.org = res.data.data;
                    }
                    this.getPerInfo()
                    this.closeloading()
                }).catch((error) => {
                    this.getPerInfo()
                    let omsg=this.outmsg(error)
                    this.closeloading()
                    if(!omsg){
                        return
                    }
                    this.actionSheetVisable=true
                    this.sheet(omsg)
                });
            },
            getDept(id, type) {
                const params = { sysHeadDeptId: id, sysHeadDeptType: type };
                this.showloading()
                ajaxGet(url.getUserDept, params).then((res) => {
                    if (res.data.data != null && res.data.data != 'null' && res.data.data != '' && res.data.data.length >0) {
                        const dt = res.data.data.filter(item => id === item.value);
                        if (dt.length > 0) {
                            this.userInfor.userDept = dt[0].label;
                        }
                    } else {
                        this.userInfor.userDept = '';
                    }
                    this.closeloading()
                }).catch((error) => {
                    let omsg=this.outmsg(error)
                    this.closeloading()
                    if(!omsg){
                        return
                    }
                    this.actionSheetVisable=true
                    this.sheet(omsg)
                });
            },
            getPerInfo() {
                this.showloading()
                ajaxGet(url.getPersonApplyInfo).then((res) => {
                    if (res.data.data != null && res.data.data != 'null' && res.data.data != '') {
                        let dt = res.data.data
                        dt.sex = dt.sex.split('');
                        this.userInfor = dt;
                        for (let item in this.userInfor) {
                            if (this.userInfor[item] == 'null') {
                                //this.userInfor[item].replace('null', '')
                                let a = ''
                                this.$set(this.userInfor, item , a)
                            }
                        }
                        const org = this.org.filter(item => this.userInfor.userOrg === item.headDeptNum);
                        const dept = this.org.filter(item => this.userInfor.userDept === item.headDeptNum);
                        if (org.length !== 0) {
                            this.userInfor.userOrg = org[0].headDeptName;
                            //this.getDept(org[0].headDeptNum, org[0].headDeptType);
                        }else{
                            this.userInfor.userOrg = ''
                        }
                        if (dept.length !== 0) {
                            this.userInfor.userDept = dept[0].headDeptName;
                            //this.getDept(org[0].headDeptNum, org[0].headDeptType);
                        }else{
                            this.userInfor.userDept = ''
                        }
                    }
                    this.closeloading()
                }).catch((error) => {
                    let omsg=this.outmsg(error)
                    this.closeloading()
                    if(!omsg){
                        return
                    }
                    this.actionSheetVisable=true
                    this.sheet(omsg)
                });
            },
            tobackpage() {
                this.setTransitionName('slide-right')
                this.push('home')
            },
            toEdit() {
                this.lsEmail = this.userInfor.email
                this.lsTele = this.userInfor.telephone
                this.lsMobile = this.userInfor.mobile
                this.sex = this.userInfor.sex
                if (this.userInfor.email != '') {
                    this.userInfor.email = this.userInfor.email.replace('@bankofbeijing.com.cn', '');
                }
                if (this.userInfor.telephone != '') {
                    this.userInfor.telephone2 = this.userInfor.telephone.substr(0,this.userInfor.telephone.indexOf("-"));
                    this.userInfor.telephone3 = this.userInfor.telephone.substr(this.userInfor.telephone.indexOf("-")+1);
                }
                this.isEdit = false;
                this.alignState = 'left';
            },
            // emailChange(val) {
            //   // if (this.isEdit === false) {
            //   //   if (/^[0-9a-zA-Z]*$/.test(this.userInfor.email)) {
            //   //   } else {
            //   //     this.$refs.email1.blur()
            //   //     this.actionSheetVisable=true
            //   //     this.sheet('请输入数字或者字母')
            //   //   }
            //   // }
            // },
            toSave() {
                if (this.userInfor.sex[0] === '' || this.userInfor.sex[0] === 'n') {
                    this.actionSheetVisable=true
                    this.sheet('请选择性别');
                    return
                }
                if (this.userInfor.email === '') {
                    this.actionSheetVisable=true
                    this.sheet('邮箱不能为空');
                    return
                }
                if (this.userInfor.telephone2 === '' || this.userInfor.telephone3 === '') {
                    this.actionSheetVisable=true
                    if (this.userInfor.telephone2 === '') {
                        this.sheet('区号不能为空');
                    }else {
                        this.sheet('座机号不能为空');
                    }
                    return
                }
                if (this.userInfor.mobile === '') {
                    this.actionSheetVisable=true
                    this.sheet('移动电话不能为空');
                    return
                }
                if (!this.emailRight) {
                    this.actionSheetVisable=true
                    this.sheet('邮箱格式有误，请输入数字或字母')
                    return
                }
                if (!this.teleRight1 || !this.teleRight2) {
                    this.actionSheetVisable=true
                    if (!this.teleRight1) {
                        this.sheet('区号格式有误');
                    }else {
                        this.sheet('座机号格式有误');
                    }
                    return
                }
                if (!this.mobileRight) {
                    this.actionSheetVisable=true
                    this.sheet('移动电话格式有误，请输入有效的11位数字')
                    return
                }
                const email = `${this.userInfor.email}@bankofbeijing.com.cn`;
                this.userInfor.telephone=this.userInfor.telephone2+"-"+this.userInfor.telephone3
                // const sex = Number(this.userInfor.sex[0]);
                this.showloading()
                let data = {sex: this.userInfor.sex[0], email: email, telephone: this.userInfor.telephone, mobile: this.userInfor.mobile };
                ajaxPost(url.saveUserInfo, JSON.stringify(data)).then((res) => {
                    this.closeloading()
                    this.isEdit = true;
                    this.alignState = 'right';
                    this.userInfor.email = email//.replace('@bankofbeijing.com.cn', '');;
                    this.actionSheetVisable=true
                    this.sheet('保存成功');
                }).catch((error) => {
                    let omsg=this.outmsg(error)
                    this.closeloading()
                    if(!omsg){
                        return
                    }
                    this.actionSheetVisable=true
                    this.sheet(omsg);
                });
            },
            cancle() {
                this.isEdit = true;
                this.alignState = 'right';
                this.userInfor.email = this.lsEmail
                this.userInfor.telephone = this.lsTele
                this.userInfor.mobile =this.lsMobile
                this.userInfor.sex = this.sex
            },

        },
    };
</script>

<style scoped lang="less">
    .butCon{position:fixed;bottom:0;width:100%;display:flex;align-items: baseline;background:#ffffff;padding:2vh 0;z-index:9;}
    .editBut{display:block;width:96%;right:-6%;color:#ffffff;}
    .one{margin-left:0.6rem}
    .myButton{border-radius:99px;margin-right:0.6rem;margin-top:0;opacity:0.9;}
    .info{position: relative;display:block;padding-left:30px;padding-top:20px;margin-bottom:1.8rem;
        /deep/ .vux-x-icon{fill:rgb(64, 158, 255);position: absolute;top:20px;left:13px;}
    }
    .person{
        /deep/ .weui-cells{
            &::after{position: fixed !important;bottom:0;}
        }
    }
    .grou{
        &::after{border-bottom:none !important;}
    }
    .label_color{
        /deep/ .weui-label{color:#000000;}
    }
    .noEditInput{
        /deep/ .weui-label{color:#000000;}
        /deep/ .weui-input{-webkit-text-fill-color:#999999 !important;}
    }
    .line{padding:0.25rem 4% 0.25rem 0 !important;}
    .isEdit{
        /deep/ .weui-textarea {color:#999999 !important;}
    }
    .myTextArea{
        /deep/ textarea{text-align:right;color:#999999 !important;}
    }
    .myTextAreaLeft{
        /deep/ textarea{text-align:left;}
        /deep/ label{width:5.11em !important;}
    }
    // 所有label 浅色字体色为 #999999
    .canEditCon{border-top:.5px solid #eceaea;margin-left:4%;position:relative;}
    .bankFixed{position:absolute;bottom:0;z-index:99;color:#999999;left:4.98em;}
</style>
