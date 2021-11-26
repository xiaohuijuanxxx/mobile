<template>
  <div style="box-sizing:border-box;width:100%;overflow:hidden;background-color:#fafafa;" v-touch:right="tobackpage">
    <div style="margin-bottom:70px;">
      <x-header :left-options="backoptions" @on-click-back="tobackpage" class=" headerFixed bigFontSize">审批中心</x-header>
    </div>
    <!-- <Header :backoptions="backoptions" @tobackpage="tobackpage" title="审批中心" /> -->
    <div  v-if="isEdit">
      <flexbox class="appfirstboxt" @click.native="onOrOff(userStatus, userlist, 'userlist', 'userStatus')">
        <flexbox-item :span="2.5">
            <div class="midFontSize">用户审批</div>
        </flexbox-item>
        <flexbox-item :span="3.5">
          <x-icon v-show="!userStatus" type="ios-arrow-down"></x-icon>
          <x-icon v-show="userStatus" type="ios-arrow-up"></x-icon>
        </flexbox-item>
        <flexbox-item :span="2.5">
            <x-button mini style="background:#fff;color:#E64340" v-if="ifbatchReviewShow"  @click.native="toEdit">批量处理</x-button>
        </flexbox-item>
        <flexbox-item :span="1" v-if="userlist.length">
            <div style="display:block;height:0.4rem;width: 0.4rem; background:rgb(194, 27, 27);
            color:#fff;border-radius: 50%;margin-top: -0.07rem;" >
            <b style="padding:0.07rem 0.01rem 0.05rem 0;font-size: 0.25rem;display: block;text-align: center;">{{userlist.length}}</b>
          </div>
        </flexbox-item>
      </flexbox>
      <template  v-if="userlist.length">
          <div class="parent">
            <flexbox v-for="item in userlistMid" :key="item.applyId" class="appfirstbox">
              <flexbox-item  :span="2">
                  <!-- <div class="headeruser">{{item.name.substr((item.name.length-2),2)}}</div> -->
                  <!-- <x-img style="width:86%;" :src="item.mxUserInfo?item.mxUserInfo.avatarUrl:null" default-src='static/title_picture.png'></x-img> -->
                  <img v-if='item.mxUserInfo' style="width:86%;" :src="item.mxUserInfo.avatarUrl" />
                  <img v-else style="width:86%;" src="static/title_picture.png" />
              </flexbox-item>
              <flexbox-item  :span="6" class="myFlexItem">
                  <div class="approvalPeople minFontSize">{{item.name}}</div>
                  <div class="approvalThing minFontSizemid lineHei overTwo">{{gsh(item.applyType)}}</div>
              </flexbox-item>
              <flexbox-item>
                  <x-button class="ljManage minFontSizeMin" mini type="warn"  @click.native="gotoUserDetail(item)">立即处理</x-button>
              </flexbox-item>
            </flexbox>
        </div>
      </template>
      <template v-else >
        <div v-show="userStatus" class='nodatacss minFontSizemid'>暂无数据</div>
      </template>
    </div>
    <div v-else>
      <flexbox class="appfirstboxt" style="margin-top:1vh;padding-top:0.1rem">
        <el-checkbox class="my-el-checkbox" :indeterminate="toIndeterminate" v-model="checkUserAll" style="position:relative;">
          <div
                  style="
                    position: absolute;
                    left: -6px;
                    top: -3px;
                    width:30px;
                    height:10vh;
                    z-index: 99;
                  "
                  @click="handleCheckUserAllChange"
                ></div>
        </el-checkbox>
        <flexbox-item :span="5">
            <div><span class="midFontSize">用户审批</span></div>
        </flexbox-item>
        <flexbox-item :span="3">
            <x-button mini type="warn"  @click.native="showPlugin">批量处理</x-button>  
        </flexbox-item>
        <flexbox-item :span="2">
            <x-button mini style="background:#fff;color:#656565;" @click.native="toEdit">取消</x-button>  
        </flexbox-item>
      </flexbox>
      <template v-if="userlist.length">
          <div class="parent">
            <el-checkbox-group v-model="checkedUsers" >
              <el-checkbox v-for="item in userlistMid" :label="item.applyId" :key="item.applyId" :disabled="checkboxT(item)" class="appfirstbox" style="position:relative;">
                  <div
                  style="
                    position: absolute;
                    width: 0.5rem;
                    left: 0;
                    top: 2px;
                    bottom:2px;
                    z-index: 99;
                  "
                  v-show="!checkboxT(item)"
                  @click="setCheckMyselfUser(item.applyId)"
                ></div>
                  <div style="display:flex;">
                    <div style="width:1.2rem;">
                        <!-- <div class="headeruser">{{im.userName.substr((im.userName.length-2),2)}}</div>
                        <x-img style="width:86%;" :src="im.mxUserInfo?im.mxUserInfo.avatarUrl:null" default-src='static/title_picture.png'></x-img> -->
                        <img v-if='item.mxUserInfo' class="img" :src="item.mxUserInfo.avatarUrl" />
                        <img v-else class="img" src="static/title_picture.png" />                        
                    </div>
                    <div class="myflexItem">
                          <div class="approvalpeople minFontSize">{{item.name}}</div>
                          <div class=" approvalThing  minFontSizemid lineHei overone">{{gsh(item.applyType)}}</div>
                    </div>
                  </div> 
              </el-checkbox>
            </el-checkbox-group>
          </div>
      </template>
      <template v-else>
        <div class='nodatacss minFontSizemid'>暂无数据</div>
      </template>
      <actionsheet v-model="aonShow" :menus="menusall" :close-on-clicking-mask="false"></actionsheet>
      <actionsheet v-model="donShow" :menus="menusall" @on-click-menu-delete="toConfirm" show-cancel :close-on-clicking-mask="false"></actionsheet>  
      <div>
        <popup v-model="batchReviewVisible" :hide-on-blur="false">
          <popup-header left-text="取消" right-text="确定" title="请选择" :show-bottom-border="false" @on-click-left="batchReviewVisible=false" @on-click-right="rightReviewSubmit"></popup-header>
          <group gutter="0">
            <radio :options="selectlist" v-model="approvalResult"></radio>
          </group>
        </popup>
      </div>
    </div>
    <div v-if="isMeit">
    <flexbox class="appfirstboxt" @click.native="onOrOff(requireStatus, requirementlist, 'requirementlist', 'requireStatus')">
      <flexbox-item :span="2.5">
          <div class="midFontSize" >需求审批</div>
      </flexbox-item>
      <flexbox-item :span="3.5">
        <x-icon v-show="!requireStatus" type="ios-arrow-down"></x-icon>
        <x-icon v-show="requireStatus" type="ios-arrow-up"></x-icon>
      </flexbox-item>
      <flexbox-item :span="2.5">
        <x-button mini style="background:#fff;color:#E64340" v-if="ifbatchIndexShow" @click.native="toMeit">批量处理</x-button>
      </flexbox-item>
      <flexbox-item :span="1" v-if="requirementlist.length">
          <div style="display:block;height:0.4rem;width: 0.4rem; background:rgb(194, 27, 27);
            color:#fff;border-radius: 50%;margin-top: -0.07rem;" >
            <b style="padding:0.05rem 0 0.05rem 0;font-size: 0.25rem;display: block;text-align: center;">{{requirementlist.length}}</b>
          </div>
        </flexbox-item>
    </flexbox>
    <template v-if='requirementlist.length'>
       <div class="parent">
          <flexbox v-for="im in requirementlistMid" :key="im.requireId" class="appfirstbox">
            <flexbox-item  :span="2">
                <!-- <div class="headeruser">{{im.userName.substr((im.userName.length-2),2)}}</div> -->
                <!-- <x-img style="width:86%;" :src="im.mxUserInfo?im.mxUserInfo.avatarUrl:null" default-src='static/title_picture.png'></x-img> -->
                <img v-if='im.mxUserInfo' style="width:86%;" :src="im.mxUserInfo.avatarUrl" />
                <img v-else style="width:86%;" src="static/title_picture.png" />
            </flexbox-item>
            <flexbox-item  :span="6" class="myFlexItem">
                <div class="approvalPeople minFontSize">{{im.userName}}</div>
                <div class="approvalThing minFontSizemid lineHei overTwo">{{im.requireName}}</div>
            </flexbox-item>
            <flexbox-item>
                <x-button class="ljManage minFontSizeMin"  mini type="warn" @click.native="gotoRequirementDetail(im)">立即处理</x-button>
            </flexbox-item>
          </flexbox>
      </div>
    </template>
    <template v-else>
      <div v-show="requireStatus" class='nodatacss minFontSizemid'>暂无数据</div>
    </template>
  </div>
  <div v-else>
      <flexbox class="appfirstboxt" >
        <el-checkbox :indeterminate="isIndeterminate" class="my-el-checkbox" v-model="checkRequireAll" style="position:relative;">
          <div
                  style="
                    position: absolute;
                    left: -6px;
                    top: -3px;
                    width:30px;
                    height:10vh;
                    z-index: 99;
                  "
                  @click="handleCheckNeedChange"
                ></div>
        </el-checkbox>
          <flexbox-item :span="5">
              <div class="midFontSize">需求审批</div>
          </flexbox-item>
          <flexbox-item :span="3">
                <x-button mini type="warn"  @click.native="showFont">批量处理</x-button> 
            </flexbox-item>
            <flexbox-item :span="2">
                <x-button mini style="background:#fff;color:#656565;" @click.native="toMeit" >取消</x-button>  
            </flexbox-item>
      </flexbox>
      <template v-if="requirementlist.length">
          <div class="parent" >   
            <el-checkbox-group v-model="checkedRequires">
              <el-checkbox v-for="im in requirementlistMid" :label="im.requireId" :key="im.requireId" :disabled="checkboxF(im)"  class="appfirstbox" style="position:relative;">
                   <div
                  style="
                    position: absolute;
                    width: 0.5rem;
                    left: 0;
                    top: 2px;
                    bottom:2px;
                    z-index: 99;
                  "
                  v-show="!checkboxF(im)"
                  @click="setCheckMyself(im.requireId)"
                ></div>
                  <div style="display:flex;">
                    <div style="width:1.2rem;">
                        <!-- <div class="headeruser">{{im.userName.substr((im.userName.length-2),2)}}</div>
                        <x-img style="width:86%;" :src="im.mxUserInfo?im.mxUserInfo.avatarUrl:null" default-src='static/title_picture.png'></x-img> -->
                        <img v-if='im.mxUserInfo' class="img"  :src="im.mxUserInfo.avatarUrl" />
                        <img v-else class="img"  src="static/title_picture.png" />                        
                    </div>
                    <div class="myflexItem">
                        <div class="approvalpeople minFontSize">{{im.userName}}</div>
                        <div class="approvalThing  minFontSizemid lineHei overone">{{im.requireName}}</div>
                    </div>
                  </div>   
              </el-checkbox>
            </el-checkbox-group> 
          </div>
      </template>
      <template v-else>
        <div class='nodatacss minFontSizemid'>暂无数据</div>
      </template>
      <actionsheet v-model="bonShow" :menus="menusall" :close-on-clicking-mask="false"></actionsheet>
      <actionsheet v-model="conShow" :menus="menusall" @on-click-menu-delete="onConfirm" show-cancel :close-on-clicking-mask="false"></actionsheet>  
      <div>
        <popup v-model="batchIndexVisible" :hide-on-blur="false">
          <popup-header left-text="取消" right-text="确定" title="请选择" :show-bottom-border="false" @on-click-left="batchIndexVisible=false" @on-click-right="rightIndexSubmit"></popup-header>
          <group gutter="0">
            <radio :options="selectlist" v-model="approvalResult"></radio>
          </group>
        </popup>
      </div>
    </div>
    <!-- 特色需求 开始 -->
    <flexbox class="appfirstboxt" @click.native="onOrOff(tRequireStatus, tRequirementlist, 'tRequirementlist', 'tRequireStatus')">
        <flexbox-item :span="3.7">
            <div class="midFontSize">特色需求审批</div>
        </flexbox-item>
        <flexbox-item :span="5.07">
          <x-icon v-show="!tRequireStatus"  type="ios-arrow-down"></x-icon>
          <x-icon v-show="tRequireStatus" type="ios-arrow-up"></x-icon>
        </flexbox-item>
        <flexbox-item :span="1" v-if="tRequirementlist.length">
          <div style="display:block;height:0.4rem;width: 0.4rem; background:rgb(194, 27, 27);
            color:#fff;border-radius: 50%;margin-top: -0.07rem;" >
            <b style="padding:0.06rem 0.075rem 0.05rem 0.05rem;font-size: 0.25rem;display: block;text-align: center;">{{tRequirementlist.length}}</b>
          </div>
      </flexbox-item>
    </flexbox>
    <CharacterNeedList :tRequireStatus="tRequireStatus" :tRequirementlistMid="tRequirementlistMid" @showlist="turnOff" />
    <!-- 特色需求 结束 -->
    <!-- 特色下发申请 开始 -->
    <flexbox class="appfirstboxt" @click.native="onOrOff(dataDownStatus, dataDownlist, 'dataDownlist', 'dataDownStatus')">
        <flexbox-item :span="3.7">
            <div class="midFontSize">数据下发审批</div>
        </flexbox-item>
        <flexbox-item :span="5.07">
          <x-icon v-show="!dataDownStatus" type="ios-arrow-down"></x-icon>
          <x-icon v-show="dataDownStatus" type="ios-arrow-up"></x-icon>
        </flexbox-item>
        <flexbox-item :span="1" v-if="dataDownlist.length">
          <div style="display:block;height:0.4rem;width: 0.4rem; background:rgb(194, 27, 27);
            color:#fff;border-radius: 50%;margin-top: -0.07rem;" >
            <b style="padding:0.06rem 0.075rem 0.05rem 0.05rem;font-size: 0.25rem;display: block;text-align: center;">{{dataDownlist.length}}</b>
          </div>
      </flexbox-item>
    </flexbox>
    <CharacterNeedList :tRequireStatus="dataDownStatus" :tRequirementlistMid="dataDownlistMid" :isIssue='true' @showlist="turnOff"/>
    <!-- 特色下发申请 结束 -->
    <!-- 手工数据开始 -->
    <DataManualList :approveStatus="0" />
    <spRecordList :approveStatus="0" />

    <!-- 手工数据结束 -->
    <flexbox class="appfirstboxt" @click.native="onOrOff(pcStatus, noresponelist, 'noresponelist', 'pcStatus')">
      <flexbox-item :span="6.6">
          <div class="midFontSize">以下审批请在PC端处理
          </div>
      </flexbox-item>
      <flexbox-item :span="2.15">
        <x-icon v-show="!pcStatus" type="ios-arrow-down"></x-icon>
        <x-icon v-show="pcStatus" type="ios-arrow-up"></x-icon>
      </flexbox-item>
      <flexbox-item :span="1" v-if="noresponelist.length">
          <div style="display:block;height:0.41rem;width: 0.42rem; background:rgb(194, 27, 27);
            color:#fff;border-radius: 50%;margin-top: -0.07rem;" >
            <b style="padding:0.06rem 0.01rem 0.055rem 0;font-size: 0.25rem;display: block;text-align: center;">{{noresponelist.length}}</b>
          </div>
      </flexbox-item>
    </flexbox>
   <template v-if='noresponelist.length'>
      <div class="parent">
    <flexbox v-for="im in noresponelistMid" :key="im.id" class="appfirstbox" @click.native='movetopc'>
      <flexbox-item  :span="2">
          <!-- <div class="headeruser">{{im.userName.substr((im.userName.length-2),2)}}</div> -->
          <!-- <x-img style="width:86%;" :src="im.mxUserInfo?im.mxUserInfo.avatarUrl:null" default-src='static/title_picture.png'></x-img> -->
          <img v-if='im.mxUserInfo' style="width:86%;" :src="im.mxUserInfo.avatarUrl" />
          <img v-else style="width:86%;" src="static/title_picture.png" />
      </flexbox-item>
      <flexbox-item :span="6" class="myFlexItem">
          <div class="approvalPeople minFontSize">{{im.userName}}</div>
          <div class="approvalThing minFontSizemid lineHei overTwo">{{im.requireName}}</div>
      </flexbox-item>
    </flexbox>
   </div>
    </template>
    <template v-else>
      <div v-show="pcStatus" class='nodatacss minFontSizemid'>暂无数据</div>
    </template>
    <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet>
    <actionsheet v-model="succeed" :menus="menusall" :close-on-clicking-mask="false"></actionsheet>
    <actionsheet v-model="failure" :menus="menusall" :close-on-clicking-mask="false"></actionsheet>
  </div>
</template>

<script>
let URL=require('../asssets/Api/api')
import { ajaxGet,ajaxPost } from '../../core/mxApi'
import minxin from '@/common/commonfunction.js'
import { mapState } from 'vuex';
import { PopupHeader, Popup, TransferDom, Group, Radio } from 'vux'
import Header from '@/common/header.vue'
import { setCheckMyselves } from "@/common/commonfunction.js";
import CharacterNeedList from '@/dataPass/character/characterNeedList.vue'
import DataManualList from "@/dataPass/dataManaul/dataManualList.vue"
import spRecordList from "@/dataPass/dataManaul/spRecordList.vue"

export default {
  components: {
    PopupHeader,
    Header,
    Popup,
    Group,
    Radio,
    CharacterNeedList,
    DataManualList,
    spRecordList
  },
  mixins: [minxin],
  computed: {
     ...mapState({
        characterSurveyNotMobile: state => state.characterSurveyNotMobile,
        characterIssueNotMobile: state => state.characterIssueNotMobile,
      }),
  },
  watch: {
    characterSurveyNotMobile() {
      this.characterSurveyNotMobile.forEach(item => {
        this.noresponelist.push({id:item.id,userName:item.createName,requireName:item.portalQaTitle,mxUserInfo:item.mxUserInfo})
      })
    }
  },
  methods: {
    onOrOff(status, list, name1, name2){
      if(!status) this.turnOn(list, name1, name2);
      if(status) this.turnOff(list, name1, name2);
      else return
    },
    //展开
    turnOn(list, name, status){
      this[`${name}Mid`] = list;
      this[status] = !this[status];
    },
    //收起
    turnOff(list, name, status){
      if(this[`${name}`].length != 0){
        this[`${name}Mid`] = [];
        this[status] = !this[status];
      }else{
        if(list.length){
          this[`${name}`] = list;
        }else{//暂无数据的时候
          this[status] = 0;
        }
      }
    },
    // checkbox选中需求审批
    setCheckMyself(item) {
      let linshi = this.dataNeed.slice(0)
      this.checkedRequires = setCheckMyselves(item, this.checkedRequires);
      this.dataNeed = linshi
      setTimeout(() => {
        this.handleCheckedNeedChange(this.checkedRequires)
      },20)
    },
    // CheckBox选中用户审批
    setCheckMyselfUser(item) {
      let linshi = this.dataUser.slice(0)
      this.checkedUsers = setCheckMyselves(item, this.checkedUsers);
      this.dataUser = linshi
      setTimeout(() => {
        this.handleCheckedUsersChange(this.checkedUsers)
      })
    },
    // 把特色需求、下发的不能在移动端处理问题放进来
    setCharacterNotMobile() {
      this.characterIssueNotMobile.forEach(item => {
        this.noresponelist.push({id:item.id,userName:item.createName,requireName:item.dwpDataApplyTitle,mxUserInfo:item.mxUserInfo})
      })
    },
    getTable1(){
      let _this=this
      _this.showloading()
      let usernames=JSON.parse(sessionStorage.getItem('currentUser'))
      let parmas={
        username: usernames.username, //usernames.username
        page: 1,
        per_page: 9999,
        approveStatus:1
      }
      ajaxGet(URL.url.getApproveList,parmas).then(res=> {
        let {data:{data,code}}=res
        if(code=='0000'){
          let recordsdata=_this.changephotos(data)
          recordsdata.forEach(item=>{
            if(item.node == '5'){
              _this.noresponelist.push({id:item.id,userName:item.name,requireName:_this.gshw(item.applyType),mxUserInfo:item.mxUserInfo})
            }
          })
          _this.userlist=recordsdata.filter(im=>{return im.node != '5'})
          _this.closeloading()
          _this.ifShow(_this.userlistMid)
          _this.isEdit=true
        }
        
      }).catch(err => {
        let omsg=_this.outmsg(err)
        _this.closeloading()
        if(!omsg){
          return
        }
        _this.actionSheetVisable=true
       _this.sheet(omsg)
      })
    },
    gshw(val) {
         if (val == 'user_update1' || val == 'user_update2') {
           return '用户变更申请'
         } else if (val == 'user_apply1' || val == 'user_apply2') {
           return '用户注册申请'
         } else if (val == 'user_delete2' || val == 'user_delete2') {
           return '用户注销申请'
         }
    },
    getTable2(){
      let _this=this
      let usernames=JSON.parse(sessionStorage.getItem('currentUser'))
      let ps2={
        userCode:usernames.username,
        page: 1, //_this.paget
        per_page: 9999,
      }
      ajaxGet(URL.url.getApprovalList,ps2).then(rej=> {
        let {data:{data,code}}=rej
        if(code=='0000' && data.records.length){
          let recordsdata=_this.changephotos(data.records)
          recordsdata.forEach(item=>{
            if(item.node == '4'){
              _this.noresponelist.push(item)
            }
          })
          _this.requirementlist=recordsdata.filter(its=>{
            return its.node != '4'
          })
          _this.closeloading()
          _this.onShow(_this.requirementlistMid)
          _this.isMeit=true 
        }
      }).catch(err => {
        let omsg=_this.outmsg(err)
        _this.closeloading()
        if(!omsg){
          return
        }
      _this.actionSheetVisable=true
       _this.sheet(omsg)
      })
    },
    changephotos(data){
      let usercd=JSON.parse(sessionStorage.getItem('jzUser'))
      let earacode = usercd.avatar_url.split('/')
      data.length && data.forEach(item=>{
        if(item.mxUserInfo){
          item.mxUserInfo.avatarUrl=`${earacode[0]}//${earacode[2]}${item.mxUserInfo.avatarUrl}`
        }
      })
      return data
    },
    movetopc() {
      this.actionSheetVisable = true
      this.sheet('此流程请在PC端处理')
    },
    gotoUserDetail (row){
      let vm=this,
      rowinfo=JSON.stringify(row)
      sessionStorage.setItem('userreviewitem',rowinfo)
      if (row.node == 5) {
        this.actionSheetVisable = true
        this.sheet('此流程请在PC端处理')
      }else {
        vm.push({path:'/userApprovalDetail',query: {node: row.node, applyId: row.applyId, type:'yhsp'}})
       //vm.push('userApprovalDetail')
      }
    },

    gotoRequirementDetail (row){
      let vm=this,
      rowinfom=JSON.stringify(row)
      sessionStorage.setItem('needreviewitem',rowinfom)
      if (row.node == 4) {
       this.actionSheetVisable = true
       this.sheet('此流程请在PC端处理')
      }else {
      vm.push({path:'/requirementApprovalDetail',query:{node:row.node, type:'yhsp'}})
      }
    },
    //用户审批
     ifShow(data) {
        let oran = 'no';   //no 不显示  yes 显示
        data.forEach(res => {
          if ((res.node === '3' || res.node === '4') && res.approveStatus === '1') {
            oran = 'yes';
            this.dataUser.push(res.applyId)
          }
        })
        if( oran == 'yes'){
          this.ifbatchReviewShow = true
        }else{
          this.ifbatchReviewShow = false
        }
      },
      toEdit(){
        this.isEdit=!this.isEdit;
        if (this.isEdit) {
          this.checkedUsers = []
          this.checkUserAll = false
        }
      },
      showPlugin() {
        this.aonShow=false;
        this.donShow = false
        if (this.checkedUsers.length === 0) {
          this.aonShow=true;
          this.sheet('至少选择一条数据')
        } else if (this.checkedUsers.length > 0) {
          this.donShow = true 
          this.sheet('数据需求可能涉及客户敏感信息的查询及导出，确定进行批量审批吗？')
        }
      },
      toConfirm() {
        this.batchReviewVisible = true;
      },
      handleCheckUserAllChange() {
        this.checkUserAll = !this.checkUserAll
        let val = this.checkUserAll
        this.checkedUsers =val?this.dataUser:[];
        this.toIndeterminate= false;
      },
      handleCheckedUsersChange(value) {
        let checkedUserCount = value.length;
        this.checkUserAll = checkedUserCount ===this.dataUser.length;
        this.toIndeterminate = checkedUserCount > 0 && checkedUserCount <this.dataUser.length;
      },
      rightReviewSubmit(){
        let data={ applyIds:JSON.stringify(this.checkedUsers),
                  'username':JSON.parse(sessionStorage.getItem('currentUser')).username,
	                'approvalResult': this.approvalResult
                  };        
        ajaxPost(URL.url.batchReview1,JSON.stringify(data)).then(res => {
          this.batchReviewVisible = false
          this.toIndeterminate= false
          this.checkedUsers=[]
          this.getTable1()
          this.succeed=true
          this.sheet("提交成功")
        }).catch(error => {
          let omsg=this.outmsg(error)
            this.closeloading()
              if(!omsg){
                return
              }
            this.actionSheetVisable=true
            this.sheet(omsg)
        })
      },
      checkboxT(row) {
        if (row.approveStatus === '1' && (row.node === '3' || row.node === '4')) {
          return false
        } else {
          return true
        }
      },

      // 需求审批
      toMeit(){
        this.isMeit=!this.isMeit;
        if (this.isMeit) {
          this.checkedRequires = []
          this.checkRequireAll = false
        }
        
      },
      showFont(){
        this.conShow = false;
        this.bonShow=false;
        if (this.checkedRequires.length ===0) {
          this.bonShow=true;
          this.sheet('至少选择一条数据')
        } else if (this.checkedRequires.length>0) {
          this.conShow = true
          this.sheet('数据需求可能涉及客户敏感信息的查询及导出，确定进行批量审批吗？')
        }
      },
      onConfirm () {
        this.batchIndexVisible= true;
      },
      onShow(data) {
        let tran = 'no'; //no 不显示  yes 显示
        data.forEach(res => {
          if (res.node == '5') {
              tran = 'yes'           
              this.dataNeed.push(res.requireId)            
          }
        })
        if( tran == 'yes'){
          this.ifbatchIndexShow = true
        }else{
          this.ifbatchIndexShow = false
        }
      },
      checkboxF(row) {
        if (row.node == '5') {
          return false
        } else {
          return true
        }
      },
      handleCheckNeedChange() {
        this.checkRequireAll = !this.checkRequireAll
        let val = this.checkRequireAll
        this.checkedRequires =val?this.dataNeed:[];
        this.isIndeterminate= false;
      },
      handleCheckedNeedChange(value) {  
        let checkedNeedCount = value.length 
        this.checkRequireAll = checkedNeedCount === this.dataNeed.length;
        this.isIndeterminate = checkedNeedCount > 0 && checkedNeedCount <this.dataNeed.length;
      },
      rightIndexSubmit(){
        let data={ requireIds:JSON.stringify(this.checkedRequires),
                  'username':JSON.parse(sessionStorage.getItem('currentUser')).username,
	                'approvalResult': this.approvalResult
                  };  
        ajaxPost(URL.url.batchReview2,JSON.stringify(data)).then(res => {
          this.batchIndexVisible = false
          this.isIndeterminate= false
          this.getTable2() 
          this.succeed=true
          this.sheet("提交成功")
        }).catch(error => {
          let omsg=this.outmsg(error)
            this.closeloading()
              if(!omsg){
                return
              }
            this.actionSheetVisable=true
            this.sheet(omsg)
        })
      },
      tobackpage() {
          this.push('home')
          this.$store.commit({
            type: 'changepage',
            pageindex: 2,
          });
        },
  },
  mounted() {
    this.noresponelist=[]
    this.getTable1()
    this.getTable2()
    this.setCharacterNotMobile()
  },
  data () {
    return {
      backoptions: {
        preventGoBack: true,
        backText: '',
      },
      //用户审批展开/收起
      userStatus: 0,
      //需求审批展开/收起
      requireStatus: 0,
      //特色需求审批展开/收起
      tRequireStatus: 0,
      //数据下发审批展开/收起
      dataDownStatus: 0,
      //pc端审批展开/收起
      pcStatus: 0,
      //用户审批列表
      userlist: [],
      //用户审批列表-展开/收起
      userlistMid: [],
      //需求审批列表
      requirementlist: [],
      //需求审批列表-展开/收起
      requirementlistMid: [],
      //特色需求审批列表
      tRequirementlist: [],
      //特色需求审批列表-展开/收起
      tRequirementlistMid: [],
      //数据下发审批列表
      dataDownlist: [],
      //数据下发审批列表-展开/收起
      dataDownlistMid: [],
      //pc端处理的数组
      noresponelist:[],
      //pc端处理的数组-展开、收起
      noresponelistMid:[],
      checkUserAll: false,
      checkRequireAll: false,
      dataUser:[],
      dataNeed:[],
      checkedUsers:[],
      checkedRequires:[],
      ifbatchReviewShow:false,
      ifbatchIndexShow:false,
      toIndeterminate: false,
      isIndeterminate: false,
      isEdit:true,
      isMeit:true,
      aonShow:false,
      bonShow:false,
      conShow:false,
      donShow:false,
      batchReviewVisible:false,
      batchIndexVisible: false,
      succeed:false,
      failure:false,
      approvalResult:"A",
      selectlist:[{key:"A", value: '同意'}, {key: "R", value: '退回'}],
      gsh(val) {
         if (val == 'user_update1' || val == 'user_update2') {
           return '用户变更申请'
         } else if (val == 'user_apply1' || val == 'user_apply2') {
           return '用户注册申请'
         } else if (val == 'user_delete2' || val == 'user_delete2') {
           return '用户注销申请'
         }
      }
    }
  }
}
</script>


<style lang='less' scoped>
@import '~vux/src/styles/1px.less';

.headeruser {
  width: 3.5rem;
  height: 3.5rem;      
  background-color:#51b7de;      
  border-radius: 50%; 
  text-align: center;
  line-height: 3.5rem;     
  -moz-border-radius: 50%;      
  -webkit-border-radius: 50%;
}
.appfirstbox {
  padding:0.33rem 0;
  border-bottom:.5px solid #eceaea;
  width:100%;
  background-color:#ffffff;
}
.appfirstboxt {
  //margin-top: 0.43rem;
  margin-top: 22px;
  padding:0.35rem 0 0.25rem 4%;
  //width: 92%;
  max-height: 15rem;
  overflow: scroll;
  background-color:#ffffff;
}
.nodatacss {
  font-size:0.3rem;
  text-align: center;
   color:#656565;
  padding:0.5rem 0 0.75rem 0;
  background-color:#ffffff;
}
.otherreview {
  margin-left: 0.5rem;
  margin-top: 0.5rem;
}
.approvalpeople{
  padding-top:0.1rem;
  margin-bottom:0.2rem;
}
.img{
  width:86%;
  vertical-align:middle;
}
.myflexItem{
  word-break:break-all;
  padding-left:0.3rem;
  width:5rem;
}
.overone{
  text-overflow:ellipsis;
  white-space:nowrap;
  overflow: hidden;
}
.my-el-checkbox{
  /deep/ .el-checkbox__inner{top:4px;}
}
</style>