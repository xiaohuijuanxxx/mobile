<template>
    <div style="margin-top: 50px;height:100%" v-touch:right="back">
        <Header :backoptions="backoptions" @tobackpage="back" title="需求申请详情" />
        <UserInfoComn :cs="cs" />
    </div>
</template>
<script>
import Header from "@/common/header.vue";
import UserInfoComn from '@/common/userInfoComn.vue'
export default {
    components: {
        Header,
        UserInfoComn
    },
    data() {
        return {
            cs: {'userId': this.$route.query.dataManualUserId}, // 子组件请求所需参数
            path: 'getApplyerInfo', // 子组件请求路劲
        }
    }
}
</script>
<style scoped>

</style>