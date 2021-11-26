<template>
    <div>
        <x-header @on-click-back="goback"   
                :left-options="{preventGoBack: true}">
                查询用户信息
                <a class="reset" @click="reset" slot="right">重置</a>
        </x-header>
        <group class="from-wrap">
            <x-input text-align="right" :isType="validIdNumber" required title="身份证"  v-model="idNumber" placeholder="请输入身份证"></x-input>
            <x-input text-align="right" required title="用户账号" v-model="countNumber" placeholder="请输入账户"></x-input>
            <datetime v-model="startDate" title="开始日期" placeholder="请输入开始日期"></datetime>
            <datetime v-model="endDate"  title="结束日期" placeholder="请输入结束日期"></datetime>
        </group>
        <box gap="10px 10px">
            <!-- <x-button :show-loading="loading" :disabled="canSubmit" @click.native="queryHandler($event)">查询</x-button> -->
            <x-button :show-loading="loading" @click.native="queryHandler">查询</x-button>
        </box>
        <group v-for="item in testArr" :key="item.id">
            <cell :title="`用户信息(${item.name})`" :value="openOrClose(item.show)" @click.native="openMessage(item.id)"></cell>
            <cell-form-preview :list="item.list" v-show="item.show"></cell-form-preview>
        </group>
        <div class="no-data" v-if="!testArr.length">暂时没有数据</div>
    </div>
</template>

<script>
    import messageData from './data.json'
    import { handleData } from './utils.js'
    import { queryMessage } from '../../core/api/query.js'
    import { hideWebViewTitle,closeWindow } from '../../core/mxApi'
    import { XHeader,Group, XInput, Datetime, XButton,Box,CellFormPreview,Cell,Toast} from 'vux'
    export default {
        created() {
            hideWebViewTitle()
        },
        data() {
            return {
                idNumber: '',
                countNumber: '',
                startDate: '',
                endDate: '',
                list: messageData,
                testArr: [],
                loading: false
            }
        },
        computed: {
            canSubmit() {
                return !this.idNumber || !this.countNumber || !this.startDate  || !this.endDate ;
            }
        },
        methods: {
            queryHandler(e) {
                e.preventDefault();
                if(this.canSubmit){
                    this.$vux.toast.text('请填写完整的查询信息')
                    return
                }
                var params = { 
                    IdentifyCard: this.idNumber,
                    Accounts: this.countNumber,
                    predate: this.startDate,
                    finaldate: this.endDate
                };
                const vm = this;
                this.loading = true;
                queryMessage(params).then(res=> {
                    vm.testArr = handleData(res.data)
                    vm.loading = false;
                }).catch(err => {
                    console.log(`err ==>> ${JSON.stringify(err)}`)
                    this.loading = false;
                    this.$vux.toast.text('查询出现错误!')
                })
            },
            validIdNumber(value) {
                if (value && (!(/\d{17}[\d|x]|\d{15}/).test(value) || (value.length !== 15 && value.length !== 18))) {
                    return { valid:false, msg:'请填写正确的身份证号码'}
                } else {
                    return { valid:true }
                }
            },
            goback() {
                closeWindow()
            },
            reset() {
                this.idNumber = '';
                this.countNumber = '';
                this.startDate = '';
                this.endDate = '';
                this.testArr = [];
            },
            openMessage(id) {
                this.testArr = this.testArr.map(item => {
                    return item.id === id ? {...item, show: !item.show} : item
                })
            },
            openOrClose(flag) {
                return flag ? '收起' : '展开' ;
            },
        },
        components: {
            XHeader,
            Group,
            XInput,
            Datetime,
            XButton,
            Box,
            CellFormPreview,
            Cell,
            Toast
        }
    }
</script>

<style scoped>
.vux-header{
    background: #ff4444;
    border-bottom: 8px solid #f3f2f7;
}
.vux-header >>> .vux-header-title{
    color: #fff;
}
.from-wrap{
    margin: 10px;
}
.vux-header >>> .reset{
    color: #fff
}
.vux-header >>> .vux-header-back{
    color: #fff
}
.no-data{
    padding: 30px 0;
    margin: 50px 10px;
    text-align: center;
    color: #ddd;
}
.weui-btn{
    background-color: #ff4444;
    color: #fff;
}
</style>