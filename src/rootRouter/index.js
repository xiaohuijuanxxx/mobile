import Vue from 'vue'
import Router from 'vue-router'
// import {route as logInMessageRouter} from '@/modules/custom_message'
import LogIn from '@/modules/custom_message/index.vue'
import startpage from '@/dataPass/startUp.js'
import home from '@/dataPass/home.vue'
import myApproval from '@/dataPass/myApp/myApproval.vue'
import userApprovalDetail from '@/dataPass/myApp/userApprovalDetail.vue'
import moreData from '@/dataPass/firstpage/moreDatasheet.vue'
import titleDetail from '@/dataPass/datasheet/titleDetail.vue'
import requirementApprovalDetail from '@/dataPass/myApp/requirementApprovalDetail.vue'
import approvalFinish from '@/dataPass/myApp/approvalFinish.vue'
import myNotice from '@/dataPass/myApp/myNotice.vue'
import myNoticeDetail from '@/dataPass/myApp/myNoticeDetail.vue'
import myAssistant from '@/dataPass/myApp/myAssistant.vue'
import showdonelist from '@/dataPass/myApp/showdonelist.vue'
import demo from '@/demo.vue'
import reviewdetail from '@/dataPass/myApp/reviewdetail.vue'
import myMessage from '@/dataPass/myApp/myMessage.vue'
import myMessageReceive from '@/dataPass/myApp/myMessageReceive.vue'
import myMessageLaunch from '@/dataPass/myApp/myMessageLaunch.vue'
import messageReceiveDetail from '@/dataPass/myApp/messageReceiveDetail.vue'
import messageLaunchDetail from '@/dataPass/myApp/messageLaunchDetail.vue'



Vue.use(Router)

const router =  new Router({
  routes: [
    {
      path: '/',
      name: 'auth',
      redirect: '/start'
    },
    startpage,
    {
      path: '/demo',
      name: 'demo',
      component: demo
    },
    {
      path: '/home',
      name: 'home',
      //component: home,
      component: () => import('@/dataPass/home.vue'),
      meta: {index: 0},
      // children: [
      //   {
      //     path: 'homeDetail',
      //     name: 'homeDetail',
      //     component: () => import('@/dataPass/firstpage/homeDetail.vue'),
      //     meta: {index: 0},
      //   },
      //   {
      //     path: 'moreDatasheet',
      //     name: 'moreDatasheet',
      //     component: () => import('@/dataPass/firstpage/moreDatasheet.vue'),
      //     meta: {index: 0},
      //   },
      //   {
      //     path: 'application',
      //     name: 'application',
      //     component: () => import('@/dataPass/myApp/application.vue'),
      //     meta: {index: 0},
      //   },
      //   {
      //     path: 'myinfo',
      //     name: 'myinfo',
      //     component: () => import('@/dataPass/myinfo/myinfo.vue'),
      //     meta: {index: 0},
      //   }
      // ]
    },
    {
      path: '/LogIn',
      name: 'LogIn',
      component: LogIn
    },
    {
      path: '/myApproval',
      name: 'myApproval',
      component: myApproval,
      meta:{index: 1}
    },
    {
      path: '/userApprovalDetail',
      name: 'userApprovalDetail',
      component: userApprovalDetail,
      meta:{index: 3}
    },
    {
      path: '/approvalFinish',
      name: 'approvalFinish',
      component: approvalFinish,
      meta:{index: 4}
    },
    {
      path: '/showdonelist',
      name: 'showdonelist',
      component: showdonelist
    },
    {
      path: '/more',
      name: 'moreData',
      component: moreData,
      meta:{index: 0}
    },
    {
      path: '/dataDetail/:id',
      name: 'titleDetail',
      component: titleDetail,
      meta:{index: 3}
    },
    {
      path: '/requirementApprovalDetail',
      name: 'requirementApprovalDetail',
      component: requirementApprovalDetail,
      meta:{index: 3}
    },              
    {
      path: '/myNotice',
      name: 'myNotice',
      //component: myNotice,
      component: () => import('@/dataPass/myApp/myNotice.vue'),
      meta:{index: 1}
    },  
    {
      path: '/myNoticeDetail',
      name: 'myNoticeDetail',
      component: () => import('@/dataPass/myApp/myNoticeDetail.vue'),
      // component: myNoticeDetail,
      meta:{index: 2}
    },  
    {
      path: '/myAssistant',
      name: 'myAssistant',
      component: myAssistant,
      meta:{index: 1}
    },
    {
      path: '/reviewdetail',
      name: 'reviewdetail',
      component: reviewdetail,
      meta:{index: 2}
    },
    {
      path: '/myMessage',
      name: 'myMessage',
      component: myMessage,
      meta:{index: 1}
    },
    {
      path: '/myMessageReceive/:order',
      name: 'myMessageReceive',
      component: myMessageReceive
    },
    {
      path: '/myMessageLaunch',
      name: 'myMessageLaunch',
      component: myMessageLaunch
    },
    {
      path: '/messageReceiveDetail',
      name: 'messageReceiveDetail',
      component: messageReceiveDetail,
      meta:{index: 2}
    },
    {
      path: '/messageLaunchDetail/:id',
      name: 'messageLaunchDetail',
      component: messageLaunchDetail,
      meta:{index: 2}
    },
      {
        path: '/myinfo',
        name: 'myinfo',
        component: () => import('@/dataPass/myinfo/myinfo'), // �ҵ�
        meta:{index:0},
      },
    {
      path: '/settings',
      name: 'settings',
      component: () => import('@/dataPass/myinfo/settings'), // �ҵ�-����
      meta:{index:1},
    },
    {
      path: '/agreeMentAndPolicy',
      name: 'agreeMentAndPolicy',
      component: () => import('@/dataPass/myinfo/agreeMentAndPolicy'), // �ҵ�-���ߡ�Э��
      meta:{index:1},
    },
    {
      path: '/personInfo',
      name: 'personInfo',
      component: () => import('@/dataPass/myinfo/personInfo'), // �ҵ�-������Ϣ�޸�
      meta:{index:3},
    },
    {
      path: '/aboutUs',
      name: 'aboutUs',
      component: () => import('@/dataPass/myinfo/aboutUs'), // �ҵ�-����-��������
      meta:{index:3},
    },
    {
      path: '/knowledgeDetail/:KbfileId',
      name: 'knowledgeDetail',
      component: () => import('@/dataPass/myApp/knowledgeDetail'),
      meta:{index: 3}
    },
    {
      path: '/knowledge',
      name: 'knowledge',
      component: () => import('@/dataPass/myApp/knowledge'),
      meta:{index: 1}
    },
    {
      path: '/qaDetail/:qaShareId',
      name: 'qaDetail',
      component: () => import('@/dataPass/myApp/qaDetail'),
      meta:{index: 3}
    },
    {
      path: '/numberDynamics',
      name: 'numberDynamics',
      component: () => import('@/dataPass/myApp/numberDynamics'),
      meta:{index: 1}
    },
    {
      path: '/characterSurvey', // /:portalQaId
      name: 'characterSurvey',
      component: () => import('@/dataPass/character/characterSurvey'),
      meta:{index: 3}
    },
    {
      path: '/transactorDealDetail', // /:portalQaId
      name: 'transactorDealDetail',
      component: () => import('@/dataPass/character/transactorDealDetail'),
      meta:{index: 3}
    },
    {
      path: '/characterIssueDeptDeal',//  /:dwpDataId
      name: 'characterIssueDeptDeal',
      component: () => import('@/dataPass/character/characterIssueDeptDeal'),
      meta:{index: 3}
    },
    {
      path: '/characterIssueHandlerDeal',//  /:dwpDataId
      name: 'characterIssueHandlerDeal',
      component: () => import('@/dataPass/character/characterIssueHandlerDeal'),
      meta:{index: 3}
    },
    {
      path: '/characterIssueOfficeInterfaceDeal',//  /:dwpDataId
      name: 'characterIssueOfficeInterfaceDeal',
      component: () => import('@/dataPass/character/characterIssueOfficeInterfaceDeal'),
      meta:{index: 3}
    },
    {
      path: '/characterNeedList',
      name: 'characterNeedList',
      component: () => import('@/dataPass/character/characterNeedList'),
      meta:{index: 1}
    },
    {
      path: '/characterIssueApply',//  /:dwpDataId
      name: 'characterIssueApply',
      component: () => import('@/dataPass/character/characterIssueApply'),
      meta:{index: 3}
    },
    {
      path: '/characterNeedApply',
      name: 'characterNeedApply',
      component: () => import('@/dataPass/character/characterNeedApply'),
      meta:{index: 3}
    },
    {
      path: '/characterNeedInterface',
      name: 'characterNeedInterface',
      component: () => import('@/dataPass/character/characterNeedInterface'),
      meta:{index: 3}
    },
    {
      path: '/setFont',
      name: 'setFont',
      component: () => import('@/dataPass/myinfo/setFont'),
      meta:{index: 3}
    },
    {
      path: '/dataManualDetail',
      name: 'dataManualDetail',
      component: () => import('@/dataPass/dataManaul/dataManualDetail'),
      meta:{index: 3}
    },
    {
      path: '/dataRecordDetail',
      name: 'dataRecordDetail',
      component: () => import('@/dataPass/dataManaul/dataRecordDetail'),
      meta:{index: 3}
    },
    {
      path: '/dataRecordList',
      name: 'dataRecordList',
      component: () => import('@/dataPass/dataManaul/dataRecordList'),
      meta:{index: 3}
    },
    {
    path: '/spRecordList',
    name: 'spRecordList',
    component: () => import('@/dataPass/dataManaul/spRecordList'),
    meta:{index: 3}
  }
  ]
})

// 全局导航守卫
router.beforeEach((to, from, next) => {
  document.body.scrollTop = 0;
  document.documentElement.scrollTop = 0;
  document.pageYOffset = 0;
  next()
})

export default router;