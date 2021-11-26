<template>
    <div style="height:100%;" v-touch:right="tobackpage">
        <Header :backoptions="backoptions" @tobackpage='tobackpage' title="需求审批详情" />
        <group>
            <group-title slot="title" class="myGroupTit midFontSize">申请人信息</group-title>
            <x-input title="申请人" v-model="userinfodata.name" readonly></x-input>
            <x-input title="工号" v-model="userinfodata.employeeNum" readonly></x-input>
            <x-input title="人力资源所属机构" v-model="userinfodata.organName" readonly></x-input>
            <x-input title="部门" v-model="userinfodata.department" readonly></x-input>
            <x-input title="固定电话" v-model="userinfodata.fixPhone" readonly></x-input>
            <x-input title="联系电话" v-model="userinfodata.mobilePhone" readonly></x-input>
            <x-textarea title="联系邮箱" v-model="userinfodata.email" readonly :rows='2'></x-textarea>
        </group>
        <group>
            <group-title slot="title" class="myGroupTit midFontSize">需求信息</group-title>
            <x-input title="需求名称" v-model="userlist.requireName" readonly></x-input>
            <x-input title="需求类型" v-model="userlist.requireType" readonly></x-input>
            <x-input title="业务类型" v-model="userlist.businessType" readonly></x-input>
            <x-input title="需求用途" v-model="userlist.requireUseDescT" readonly></x-input>
            <x-input title="是否包含敏感信息" v-model="userlist.ifSensitivity" readonly></x-input>
            <!-- <x-input v-if='userlist.ifSensitivity=="是"' title="敏感信息" v-model="userlist.sensitivity" readonly></x-input> -->
            <x-textarea v-if='userlist.ifSensitivity=="是"' title="敏感信息" v-model="userlist.sensitivity" readonly></x-textarea>
            <x-textarea title="需求描述" v-model="userlist.requireMemo" readonly></x-textarea>
            <div class='textareacss1'>
                <p class="midFontSize">附件</p>
                <div v-for="item in userlist.fileId" :key='item.fileId' class="midFontSize" style="padding-left:0.25rem;">{{item.fileName}}</div>
                <!-- color:blue; @click="downloadfile(item)" -->
            </div>
            <!-- <div class='textareacss'>
              <div>需求描述</div>
              <div>{{userlist.requireMemo}}</div>
            </div> -->

        </group>
        <group >
            <group-title slot="title" class="myGroupTit midFontSize">审批
                <span style="font-size:0.3rem;padding-left:0.5rem;color:gray">审批意见请点击查看<img style="width: 4.5%;vertical-align: sub;" src="static/mydown.png" /></span>
            </group-title>
        </group>
        <flow orientation="vertical" class='flowtitlecss' :style='flowm'>
            <!-- <div class="revicss midFontSize">审批</div> -->
            <flow-state v-if='statelist.length>0' state="1" :title="textRE(statelist[0].node)+statelist[0].userId+':'+statelist[0].orgName" :is-done="!!(Number(statelist[0].approveStatus)>1)"></flow-state>
            <flow-line v-if='statelist.length>1' :is-done='!!(Number(statelist[1].approveStatus)>1)' :line-span="15"></flow-line>
            <flow-state v-if='statelist.length>1' state="2" :title="textRE(statelist[1].node)+statelist[1].userId+':'+statelist[1].orgName" :is-done="!!(Number(statelist[1].approveStatus)>1)"></flow-state>
            <flow-line v-if='statelist.length>2' :is-done='!!(Number(statelist[2].approveStatus)>1)' :line-span="15"></flow-line>
            <flow-state v-if='statelist.length>2' state="3" :title="textRE(statelist[2].node)+statelist[2].userId+':'+statelist[2].orgName" :is-done="!!(Number(statelist[2].approveStatus)>1)"></flow-state>
            <flow-line v-if='statelist.length>3' :is-done='!!(Number(statelist[3].approveStatus)>1)' :line-span="15"></flow-line>
            <flow-state v-if='statelist.length>3' state="4" :title="textRE(statelist[3].node)+statelist[3].userId+':'+statelist[3].orgName" :is-done="!!(Number(statelist[3].approveStatus)>1)"></flow-state>
            <flow-line v-if='statelist.length>4' :is-done='!!(Number(statelist[4].approveStatus)>1)' :line-span="15"></flow-line>
            <flow-state v-if='statelist.length>4' state="5" :title="textRE(statelist[4].node)+statelist[4].userId+':'+statelist[4].orgName" :is-done="!!(Number(statelist[4].approveStatus)>1)"></flow-state>
        </flow>
    </div>
</template>
<script>
export default {
    data() {
        return {
            backoptions: {
                    preventGoBack:true,
                    backText: ''
                },
        }
    },
    mounted() {

    },
    methods: {
        tobackpage(){
            
        }
    }
}
</script>
<style scoped>

</style>