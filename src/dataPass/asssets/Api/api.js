let host='http://10.51.241.47:9999/dlap'
//   10.51.229.92
//let host='http://data.bj.bob:9999/dlap'
// let host='http://10.160.43.232:8088/dlap' // 测试环境

let api= {
    /////////////////////////////// 手工数据备案流程开发使用接口
    checkDataRecordStatus:`${host}/portal/dataRecord/checkDataRecordStatus`,//手工数据判断流程状态
    getRecordApproveDeal:`${host}/portal/dataRecord/dataRecordApprove/deal`,//手工数据备案审批人栏目信息提交
    getRecordApproveList:`${host}/portal/dataRecord/dataRecordApprove/getMobileList`,//获取手工数据备案待处理list
    list:`${host}/portal/dataRecord/getMobileList`,//获取申请人手工数据备案申请list
    getApproveIn:`${host}/portal/dataRecord/getApproveIn`,//获取备案流程审批人栏目信息（部门内）
    getApproveOut:`${host}/portal/dataRecord/getApproveOut`,//获取备案流程审批人栏目信息（部门外）
    getMobileOne:`${host}/portal/dataRecord/getMobileOne`,//获取申请人手工数据备案流程申请人填写的信息
    //////////////////////////////////
    getRaed:`${host}/portal/kbFile/kbFileRead/add`,//new标识修改
    getStartBg: `${host}/portal/mobileStartPage/list`, // 获取启动页背景图
    getDataAuth: `${host}/uaa/auth/sysUserDataAuthority/getAllAndShow`,
    getToken:`${host}/uaa/oauth/token`,
    getAllLabel:`${host}/uaa/auth/sysLabelDefine/label1`,
    //getToDoList:`${host}/portal/report/todo/todoStatus/homeList`,
    getToDoList:`${host}/portal/report/todo/todoStatus/homeMobileList`,
    getPersonInfo:`${host}/uaa/user/get`,
    getApplyerInfo: `${host}/uaa/user/getOne`, // 获取申请详情中 申请人信息
    getNoticList:`${host}/uaa/auth/sysNotice/list`,
    getApproveList:`${host}/portal/userFlow/applyUser/getApprovalList`,
    getUserApproveList:`${host}/portal/userFlow/applyUser/getUserApprovalList`, // 智能助理点击时获取用户申请列表
    getApproveDetail:`${host}/portal/userFlow/applyUser/getApply`,
    approveDealPass:`${host}/portal/userFlow/applyUser/applyPass`,
    approveDealRefuse:`${host}/portal/userFlow/applyUser/applyRefuse`,
    getApprovalList:`${host}/portal/dataReq/RequireData/getApprovalList`,
    getApprovalListMobile:`${host}/portal/dataReq/RequireData/getApprovaListMobile`, // 智能助理点击时获取数据需求列表
    getLabel2:`${host}/uaa/auth/sysLabelDefine/label2`,
    getAllDict:`${host}/uaa/dict/getAllDict`,
    getBeforeLogin:`${host}/uaa/login/getBeforeLogin`,
    addEhrUser:`${host}/uaa/user/addEhrUser`,
    getRequireById:`${host}/portal/dataReq/RequireData/getRequireById`,
    getall:`${host}/uaa/user/getAll`,
    getReviewUserApply:`${host}/portal/dataReq/RequireData/getReviewUserApply`,
    getReviewUser:`${host}/portal/dataReq/RequireData/getReviewUser`,
    reqReviewAccept:`${host}/portal/dataReq/RequireData/reqReviewAccept`,
    getneedList:`${host}/portal/dataReq/RequireData/list`,
    getThemeList: `${host}/portal/report/reportUser/allList`, // 获取全部固定报表
    gettableau: `${host}/portal/report/reportDefine/getReportUrl`, // ??��?������3?�¨�a��y?Y?��?����3url
    getUserAddList: `${host}/portal/report/mobileReportDrag/getOneSetting`, // ??��?��y??��3��??��???����??��������3��?list
    saveOrUpdateSetting: `${host}/portal/report/mobileReportDrag/saveOrUpdateSetting`, // �����?��y??��3��??��???����??��������3��?list
    getBanner: `${host}/portal/imageSwiper/list`, // ??��?������3??2����?list
    batchDownloadFiles: `${host}/portal/dataQA/qaDefine/batchDownloadFiles`, // ??��?������3??2����?list
    downloadAttment:`${host}/portal/dataReq/RequireData/downloadAttment`,
    downloadFile: `${host}/portal/dataQA/qaDefine/downloadFile`,
    getFileUrl: `${host}/portal/innerMessage/getFileById`, // 获取站内信附件下载路径
    loginout:`${host}/uaa/login/logout`,
    getPersonApplyInfo: `${host}/portal/userFlow/applyUser/getLastApply`, // 获取数据通pc端用户申请时填写的个人信息
    getUserOrg: `${host}/uaa/auth/sysHeadDept/getUserDepts`, // 获取数据通pc端用户所属机构相关信息
    getUserDept: `${host}/uaa/auth/sysHeadDept/getUserDeptDirs`, // 获取数据通pc端用户所属机构下的部门信息
    saveUserInfo: `${host}/uaa/user/savePersonal`, // 保存用户基本信息
    getVersion: `${host}/uaa/auth/sysVersion/getCurrentVersion`, // 获取系统版本信息
    deptApprove: `${host}/portal/dataReq/RequireData/reqReviewOut`, // 部门负责人、条线总监审批
    deptInner: `${host}/portal/dataReq/RequireData/reqReviewInner`, // 部门内领导审批
    usersiting:`${host}/uaa/sysUserSetting/list`,
    editsetting:`${host}/uaa/sysUserSetting/edit`,
    getOneDict:`${host}/uaa/dict/getDict`,
    getUserStatus:`${host}/portal/userFlow/applyUser/getApprovalStatus`,
    getDataStatus:`${host}/portal/dataReq/requireApprove/getApprovalStatus`,
    getApproveList1:`${host}/portal/userFlow/applyUser/getApproveListApply`, // 获取审批进度list 展示 节点 1 2
    getApproveList2:`${host}/portal/userFlow/applyUser/getApproveList`, // 获取审批进度list 展示 节点 1 2
    getAllOrgDept: `${host}/uaa/auth/sysHeadDept/getDeptOrgById`, // 获取全部机构部门
    getRequirePeoMsg: `${host}/uaa/user/getOne`, // 获取数据需求申请人信息
    downApplyFile: `${host}/portal`, // 获取数据需求申请人信息
    batchReview1:`${host}/portal/userFlow/applyUser/batchReview`, //用户批量审批
    batchReview2:`${host}/portal/dataReq/RequireData/batchReview`,//需求批量审批
    getMessageReceive:`${host}/portal/innerMessage/list`,//获取收件箱列表
    getMessageLaunch:`${host}/portal/innerMessage/outBoxlist`,//获取发件箱列表
    doDeleteMessageReceive:`${host}/portal/innerMessage/doDelete`,//删除邮件
    saveOrUpdateMobileAppDrag:`${host}/uaa/mobileAppDrag/saveOrUpdateMobileAppDrag`,
    saveOrUpdatelist:`${host}/uaa/mobileAppDrag/list`,
    updateCheckStatus:`${host}/portal/innerMessage/updateCheckStatus`,//更新邮件未读状态
    getDocumentData: `${host}/portal/report/kbFile/kbFile/queryDocumentTypelist`, // 获取培训文档、制度文档数据数据
    getQaData: `${host}/portal/dataQA/qaShareDefine/list`, // 获取数据QA数据
    getMenu: `${host}/uaa/menu/getListByUserIdAndAppName`, // 获取知识库应用显示的菜单
    getMenuType: `${host}/portal/kbFile/kbFileType/getTypeByMenuName`, // 获取知识库应用显示的菜单的类型
    getKnowDetail: `${host}/portal/report/kbFile/kbFile/getOne` , // 获取知识库文档详情
    getQaDetail: `${host}/portal/dataQA/qaShareDefine/getOne` , // 获取知识库Qa详情
    // 特色需求 流程相关接口
    getCharacterNeedData: `${host}/portal/portalQa/portalQaApprove/list` , // 特色需求 部门审批数据list
    getCharacterNeedData1: `${host}/portal/portalQa/portalQaDeal/list`, // 特色需求 处理人审批数据list
    getCharacterNeedApplyMsg: `${host}/portal/portalQa/portalQaDefine/getOne` , // 特色需求 申请时填写的信息
    getCharacterNeedDealSpeed: `${host}/portal/portalQa/portalQaDefine/getAllApproveResult` , // 特色需求 部门审批人进度表格
    getCharacterNeedDeptDeal: `${host}/portal/portalQa/portalQaApprove/deal`, // 特色需求 部门审批
    getCharacterNeedDeptDealMsg: `${host}/portal/portalQa/portalQaApprove/getOne`, // 特色需求部门审批 填写的信息
    getCharacterNeedTransactorDeal: `${host}/portal/portalQa/portalQaDeal/deal`, // 特色需求 处理人审批
    getCharacterNeedTransactorPeople: `${host}/uaa/user/getUserListByRoleSign`, // 特色需求 处理人 转处理人数据list
    getCharacterNeedTransactorDealMsg: `${host}/portal/portalQa/portalQaDeal/getOne`, // 特色需求 处理人 填写的信息
    getCharacterNeedInterfaceDealMsg: `${host}/portal/portalQa/portalQaManage/getOne`, // 特色需求 接口人 填写的信息
    getAllRole: `${host}/uaa/role/getAll`, // 获取所有角色
    getCharacterAllData: `${host}/portal/portalQa/portalQaDefine/getAllApproveList`, // 获取特色需求所有节点数据list（即部门审批、接口人审批、处理人审批列表数据总和）
    // 特色下发申请 相关接口

    //数据下发批量审批--总行接口人
    characterIssueInterfaceDealBatch: `${host}/portal/dwpDataApply/dwpDataManage/batchDeal`,
    //数据下发批量审批--领导审批
    characterIssueHandlerDealBatch: `${host}/portal/dwpDataApply/dwpDataDeal/batchDeal`,

    getCharacterIssueApplyInfo: `${host}/uaa/user/getByName`, // 特色下发流程 申请人个人信息
    getCharacterIssueApplyMsg: `${host}/portal/dwpDataApply/dwpDataApplyDefine/getOne`, //  特色下发流程 申请时填写的信息
    getCharacterIssueAllData: `${host}/portal/dwpDataApply/dwpDataApplyDefine/getMobileApproveList`, // 特色下发流程 所有节点数据list（即部门审批、总行接口人审批、处理人审批列表数据总和）
    characterIssueDeptDeal: `${host}/portal/dwpDataApply/dwpDataApprove/deal`, //  特色下发流程 部门审批
    characterIssueInterfaceDeal: `${host}/portal/dwpDataApply/dwpDataManage/deal`, //  特色下发流程 总行接口人审批
    characterIssueHandlerDeal: `${host}/portal/dwpDataApply/dwpDataDeal/deal`, //  特色下发流程 处理人审批
    getCharacterIssueDeptSpeed: `${host}/portal/dwpDataApply/dwpDataApplyDefine/getAllApproveList`, //  特色下发流程 部门审批进度表格数据
    getCharacterIssueInterfaceSpeed: `${host}/portal/dwpDataApply/dwpDataManage/getAllApproveList`, //  特色下发流程 总行接口人审批进度表格数据
    handlerChangeDealPerson: `${host}/portal/dwpDataApply/dwpDataDeal/changeApproveUser`, // 特色下发流程 处理人审批 更改处理人
    deptChangeDealPerson: `${host}/portal/dwpDataApply/dwpDataApprove/changeApproveUser`, // 特色下发流程 部门审批 更改处理人
    getCharacterIssueHandlerSpeed: `${host}/portal/dwpDataApply/dwpDataDeal/getAllApproveList`, //  特色下发流程 数据/软开处理人审批进度表格数据
    getSjOrRkList: `${host}/uaa/user/getUserListByRoleSign`, //  获取管理部/软开部接口人列表
    getListByRoleType: `${host}/uaa/user/getUserListByRoleSign`, // 根据角色不同获取数聚
    getCurrentUserDeptMsg: `${host}/uaa/auth/sysHeadDept/getUserByDeptId`, // 获取部门经理、主管信息
    getCharacterIssueDeptDealMsg: `${host}/portal/dwpDataApply/dwpDataApprove/getOne`, // 特色下发流程 部门审批 填写的信息
    getCharacterIssueInterfaceDealMsg: `${host}/portal/dwpDataApply/dwpDataManage/getOne`, // 特色下发流程 总行接口人审批 填写的信息
    getCharacterIssueHandlerDealMsg: `${host}/portal/dwpDataApply/dwpDataDeal/getOne`, // 特色下发流程 数据/软开审批 填写的信息
    getRcvMesgDetail: `${host}/portal/innerMessage/getOne`, // 站内信收件箱根据id查看详情
    getWpsUrl: `${host}/portal/wpsReader/getWpsReaderUrl`, // 获取wps处理后带有水印文件地址
    // 手工数据模块 接口
    getManualWriteInfo:  `${host}/portal/dataManual/getMobileOne`, // 获取申请人手工数据申请人填写的信息
    getManualApplyList: `${host}/portal/dataManual/getMobileList`, // 获取申请人手工数据申请list
    getManualDealList: `${host}/portal/dataManualApprove/getMobileList`, // 获取手工数据待处理list
    getDealSpeedOut: `${host}/portal/dataManual/getApproveOut`, // 获取手工数据审批人栏目信息
    getDealSpeedIn: `${host}/portal/dataManual/getApproveIn`, // 获取手工数据审批人栏目信息
    dealManual: `${host}/portal/dataManualApprove/deal`, // 手工数据审批人栏目信息提交
    judgeManualStatus: `${host}/portal/dataManual/checkDataManualStatus`, // 手工数据判断流程状态
    batchManual: `${host}/portal/dataManualApprove/batchDeal`,// 手工数据批量审批
    qaNewChange: `${host}/portal/dataQA/qaShareDefineRead/add`,// 数据Q&A的new标识去掉
    getMyTable: `${host}/portal/report/publicReportDefine/getMyMobileReportList`,// 获取首页报表，与我的报表走同一个接口
    getAllPublicTable: `${host}/portal/report/publicReportDefine/getAllMobileReportList`,// 获取全部报表中的公共报表
    getAllPublicUrl: `${host}/portal/report/publicReportDefine/getPublicReportUrl`,// 获取公共报表url
    gettableau: `${host}/portal/report/reportDefine/getReportUrl`, // 获取固定报表url
    saveMyTable: `${host}/portal/report/xxx/xxx`,// 保存我的报表编辑，拖拽顺序等（包括固定报表和公共报表顺序，新增等问题）
}
export const url=api
