<template>
    <div class="marginHeader" style="height:100%;" v-touch:right="tobackpage">
       <Header :backoptions="backoptions" :title="this.$route.query.title" @tobackpage="tobackpage" />
        <!-- <x-header :left-options="backoptions" @on-click-back="tobackpage" class="cjHeader headerFixed">{{this.$route.query.title}}</x-header> -->
        <div style="padding:0.25rem 0.45rem;">
            <h3 style="text-align:center;padding:0.35rem 0 0.5rem 0;" class="minFontSize">{{title}}</h3>
            <p v-html="text"></p>
        </div>
    </div>
</template>

<script>
    import { mapMutations } from 'vuex';
    import minxin from '@/common/commonfunction.js';
    import Header from '@/common/header.vue'
    export default {
      name: 'feedback',
      components: {
      Header
    },
     mixins:[minxin],
      data() {
        return {
          backoptions: {
            preventGoBack: true,
            backText: '',
          },
          text: '',
          title: '',
        };
      },
      mounted() {
        if (this.$route.query.title === '用户协议') {
          this.title = '数聚通APP用户协议'
          this.text = `<p style='text-align:justify;color:#999999;' class="minFontSizeMin">&nbsp;&nbsp;&nbsp;&nbsp;在使用数据仓库门户提供的数据服务之前，请仔细阅读本《用户协议》。一旦登录或使用数据仓库门户，即视为用户已了解并明示 同意本协议各项内容，
          用户登录、使用本门户服务的全部活动将受到本协议的约束并承担相应的责任和义务。<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;数据仓库门户是数据仓库数据应用及展现、数据管理的综合平台，是北京银行总行各部门、
          各分行的数据分析人 员使用数据仓库数据的主要渠道。数据仓库门户用户在使用过程中应
          遵循“严格保密”、“授权使用”、“责任追究”的原则。<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;严格保密原则：数据仓库门户用户应做好数据安全保密工作，不泄露包括客户信息在内的任何
          业务 数据，用户应妥善保管数据查询系统登录名、密码， 不向他人泄露，并对使用该账户和
          密码所进行的一切行为承担全部责任。<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;授权使用原则：开通数据仓库门户使用权限的账户仅限于用户自身使用，严格控制在权限范 围
          内查询和分析相关数据，用户不得将该账户以任何形式向任何第三方转让、出租、出借、泄露、披露等。<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;责任追究原则：数据仓库门户用户应认真落实数据资产的保护、管理责任，不得用数据产品 和/或数据服
          务从事违反法律法规、社会公德和商业道德的活动。如用户违反法律法规和或不当使用相关数据、产品、
          数据服务的，数据管理部有权采取直接 暂停或终止数据仓库门户服务、要求用户立即删除相关数据、产品
          等措施，并按照总行关于信息安全的相关规定追究当事人责任。<br/>
          &nbsp;&nbsp;&nbsp;&nbsp;本用户协议最终解释权归数据管理部所有。</p>`
          } else {
            this.title = '数聚通APP用户隐私政策'
            this.text = `<p style="text-align:justify;color:#999999;" class="minFontSizeMin">&nbsp;&nbsp;&nbsp;&nbsp;以下隐私协议是本软件对用户隐私保护的许诺，请您务必仔细阅读本协议，以了解我们关于管理您个人信息的情况。本隐私协议的全部条款属于本软件用户服务协议的重要部份之一。<br/>
            为了给您提供更准确、更有针对性的服务，本软件可能会以如下方式，使用您提交的个人信息。但本软件会以高度的勤勉义务对待这些信息，在未征得您许可的情况下，不会将这些信息对外公开或向第三方提供。<br/>
            一、保有您提供的信息<br/>
            本软件会在您自愿选择服务或提供信息的情况下收集您的个人信息，并将这些信息进行整合，以便向您提供更好的用户服务。请您不要将您的帐号、密码转让或出借予他人使用。如您发现您的帐号遭他人非法使用，应立即通知本软件。因黑客行为或用户的保管疏忽导致帐号、密码遭他人非法使用，本软件不承担责任。<br/>
            二、保有您的使用记录<br/>
            当您使用本软件的服务时，服务器会自动记录一些信息，包括手机型号、IP地址等。
            在如下情况下，本软件会遵照您的意愿或法律的规定披露您的个人信息，由此引发的问题将由您个人承担：<br/>
            （1）事先获得您的授权；<br/> 
            （2）只有透露你的个人资料，才能提供你所要求的产品和服务；<br/> 
            （3）根据有关的法律法规要求；<br/>
            （4）按照相关政府主管部门的要求;<br/>
            （5）为维护本软件的合法权益。 <br/>
            （6）您同意让第三方共享资料。<br/> 
            （7）我们发现您违反了本软件的服务条款或使用规定。<br/>
            （8）我们需要向代表我们提供产品或服务的公司提供资料（除非我们另行通知你，否则这些公司无权使用你的身份识别资料）。<br/>
            三、本《隐私政策》不适用于以下情况：<br/>
            （1）通过我们的服务而接入的第三方服务（包括任何第三方网站）收集的信息。本政策仅适用于我们所收集的信息，并不适用于任何第三方提供的服务或第三方的信息使用规则，我们对任何第三方使用由您提供的信息不承担任何责任；<br/>
            （2）通过在我们服务中进行广告服务的其他公司或机构所收集的信息。<br/>
            四、隐私权政策的修订<br/>
            我们可能适时修订本政策的条款，修订政策也是构成本政策的一部分。如修订政策造成您在本政策下权利的实质减少，我们将在修订生效前通过在主页上显著位置提示或向您发送电子邮件或以其他方式通知您。在该种情况下，若您继续使用我们的服务，即表示同意受经修订的本政策的约束。<br/>
            五、用户如何更正或投诉个人信息<br/>
            如果您需要查询、修改或更正您的个人信息，或对个人信息保护问题有任何疑问或建议，您可以通过服务支持邮箱：shujutong@bankofbeijing.com.cn联系我们。</p>`  
       }
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
        tobackpage() {
          this.setTransitionName('slide-right')
          this.push('home')
        },
      },
    };
</script>

<style scoped>

</style>
