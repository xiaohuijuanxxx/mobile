<template>
  <div style="height:100%;" v-touch:right="tobackpage">
      <x-header :left-options="{backText:''}" style="position:fixed;top:0;width:100%;z-index:99;">发件箱</x-header>
      <div>
        <div style="margin:1.2rem 0.3rem 0.3rem 0.3rem">
            <div class="title lineFeed" style="width:100%;">{{list.messageTitle}}</div>
            <flexbox  class="appfirstbox information" style="position:relative;margin-top:0.2rem;padding-bottom:0.2rem">
                  <flexbox-item  :span="2" style="position:absolute;top:0;width:50%;">
                        <img  style="width:25%;position:absolute;top:0" src="static/title_picture.png" />
                  </flexbox-item>
                  <flexbox-item v-if="headDetails" style="margin-left:18%;" :span="10">
                    <flexbox>
                        <flexbox-item :span="3/5">
                            <flexbox>
                                <div class="approvalPeople minFontSizemid">{{name}}</div>
                                <img  v-if="list.attachmentPath!=='[]'" style="width:8%;vertical-align:middle;margin-left:0.15rem" src="static/accessory.png"/>
                            </flexbox> 
                        </flexbox-item>
                        <flexbox-item :span="1/5">
                            <div class="minFontSizemid lineHei overtime">{{list.messageSendTime.substring(5,10)}}</div>
                        </flexbox-item>
                        <flexbox-item >
                            <div class="minFontSizemid lineHei" @click="staffList" style="color:#E92323;">详情</div>
                        </flexbox-item>
                    </flexbox>
                  </flexbox-item>
                   <flexbox-item v-else style="margin-left:18%;" :span="10">

                    <flexbox orient="vertical" :gutter="0" style="margin-top:0.15rem;" >
                        <flexbox-item > 
                            <flexbox >
                                <flexbox-item :span="4/5">
                                    <flexbox >
                                      <div class="minFontSizemid lineHei logoColor" style="display: inline-block;width:32%;margin-right:-2.5%;">发件人：</div>                           
                                      <div class="minFontSizemid lineHei">{{name}}</div>
                                    </flexbox>
                                </flexbox-item>
                                <flexbox-item >
                                    <div class="minFontSizemid lineHei" @click="staffLista" style="color:#E92323;text-align:center;">隐藏</div>
                                </flexbox-item>
                            </flexbox>
                        </flexbox-item>
                        <flexbox-item style="margin-top:0.2rem;" v-if="list.roleName">  
                            <flexbox style="position:relative;">  
                                <div class="minFontSizemid lineHei logoColor" style="position:absolute;top:0;width:23%;">角&nbsp;&nbsp;&nbsp;&nbsp;色：</div>             
                                <div class=" minFontSizemid lineHei lineFeed" style="width:70%;margin-left:23%;">{{list.roleName}}</div>
                            </flexbox>
                        </flexbox-item>
                        <flexbox-item style="margin-top:0.2rem;">  
                            <flexbox style="position:relative;">  
                                <div class="minFontSizemid lineHei logoColor" style="position:absolute;top:0;width:25%;">收件人：</div>             
                                <div class=" minFontSizemid lineHei lineFeed" style="width:70%;margin-left:23%;">{{list.rcvUserName}}</div>
                            </flexbox>
                        </flexbox-item>
                        <flexbox-item style="margin-top:0.2rem;">
                            <flexbox > 
                            <div class="minFontSizemid lineHei logoColor" style="display: inline-block;width:23%; ">时&nbsp;&nbsp;&nbsp;&nbsp;间：</div>
                                                             
                            <div class=" minFontSizemid lineHei">{{list.messageSendTime}}</div>
                            </flexbox>
                        </flexbox-item>
                        <flexbox-item style="margin-top:0.2rem;" v-if="attachment">
                            <flexbox style="position:relative;">
                            <div class="minFontSizemid lineHei logoColor" style="position:absolute;top:0;width:23%;">附&nbsp;&nbsp;&nbsp;&nbsp;件：</div>                        
                            <div class="minFontSizemid lineHei lineFeed" style="width:70%;margin-left:23%;">
                                <span  v-for="item in newAccessory" :key='item.id'>
                                    <img src="static/greyAccessory.png" style="width:6%;">&nbsp;{{item.label}}&nbsp;
                                </span>
                                </div>
                            </flexbox>
                        </flexbox-item>
                    </flexbox>
                  </flexbox-item>
            </flexbox>
            <!-- <flexbox orient="vertical" class="content">
                <flexbox-item style="padding-top:0.6rem"> -->
                    <p class="minFontSizemid contentText">{{list.messageContent}}</p>
                <!-- </flexbox-item>
            </flexbox> -->
            </div>
            <div  v-if="toAccessory" style="border-top:0.01rem solid #E3E4E5;margin-bottom:0.3rem">
                <flexbox :gutter="0" v-for="item in newAccessory" :key='item.id' @click.native="downloadfile(item)" style="  border-bottom:0.01rem solid #E3E4E5;padding:9px 0;" > 
                    
                    <img :src="item.url"  style="width: 0.86rem;margin:0 0.3rem" />
                    <flexbox-item :span="8.5">
                        <div  class="minFontSizemid lineHei accessoryTitle lineFeed" >{{item.label}}</div>
                    </flexbox-item>
                    <img  style="width:2%;vertical-align:middle;" src="static/more.png" />
                </flexbox>
            </div>
        </div>
        <actionsheet v-model="actionSheetVisable" :menus="menusall"></actionsheet> 
  </div>
</template>

<script>
import minxin from '@/common/commonfunction.js'
import { mapMutations } from 'vuex';
import { Popup, Group} from 'vux'
import { ajaxGet } from '../../core/mxApi';
let URL = require("../asssets/Api/api");
export default {
    mixins:[minxin],
     components: {
    Popup,
    Group
  },
    data(){
        return{
            actionSheetVisable: false,
            list:'',
            accessory:'',
            name:'',
            username:'',
            toAccessory:false,
            details:false,
            messageRcvUser:'',
            arr:[],
            headDetails:true,
            newAccessory:[],
            filePhoto:'',
            labelList:[],
            attachment:false,
        }
    },
    mounted() {
        this.getTable()
    },
    methods:{
        ...mapMutations(['setTransitionName']),
        tobackpage() {
            if (this.$route.query.hasOwnProperty("todoType")) {
                closeWindow();
                return;
                //Bus.$emit('refesh')
            }
            this.setTransitionName('slide-right')
            this.$router.push({ path: "/myMessage" });
            // this.push('myApproval')
        },
        // 查看附件
        downloadfile(item) {
      const params = { fileId: item.id };
      ajaxGet(URL.url.getFileUrl, params)
        .then((res) => {
          if (
            res.data.data != "" &&
            res.data.data != null &&
            res.data.data != "null"
          ) {
            let ul = URL.url.downApplyFile + res.data.data.fileUrl;
            this.getWpsFile(ul, item.id)
           // MXCommon.download(ul);
          } else {
            this.actionSheetVisable = true;
            this.sheet("该文件不存在");
          }
        })
        .catch((error) => {
          let omsg = this.outmsg(error);
          this.closeloading();
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
        });
    },
    getWpsFile(ul, fileId) {
      let user = JSON.parse(sessionStorage.getItem("currentUser"));
      const params = {
        userName: user.username,
        name: encodeURIComponent(user.name),
        fileId: fileId,
        httpFileUrl: ul
      }
       ajaxGet(URL.url.getWpsUrl, params)
        .then((res) => {
          if (
            res.data.data != "" &&
            res.data.data != null &&
            res.data.data != "null"
          ) {
            //window.open(res.data.data, '_blank')
            //MXCommon.download(res.data.data);
            MXCommon.openUrlPage(res.data.data)
          }
      }).catch(error => {
        let omsg = this.outmsg(error);
          this.closeloading();
          if (!omsg) {
            return;
          }
          this.actionSheetVisable = true;
          this.sheet(omsg);
      })
    },
        getTable(){
            let usernames=JSON.parse(sessionStorage.getItem('currentUser'))
            this.username=usernames.username
            this.name=usernames.name
            this.list=this.$route.params.id
            this.arr=this.list.rcvUserName.split(',')
            if(this.list.attachmentPath!=="[]"){
                this.attachment=true
                this.toAccessory=true
                this.accessory=JSON.parse(this.list.attachmentPath)
                this.accessory.forEach(res => {
                    this.labelList.push(res.label)
                    let newLabel=res.label
                    let index=newLabel.indexOf(".");
                    newLabel=newLabel.substring(index);
                    if(newLabel==".txt" || newLabel==".rtf" || newLabel==".odt"){
                        this.filePhoto="static/txtImg.png"
                    }else if(newLabel==".docx" || newLabel==".doc" || newLabel==".dotm"|| newLabel==".dot"|| newLabel==".xml"|| newLabel==".xps"){
                        this.filePhoto="static/wordImg.png"
                    }else if(newLabel==".xls" || newLabel==".xlsx" || newLabel==".xlsm" || newLabel==".xml" || newLabel==".xltx"){
                        this.filePhoto="static/excelImg.png"
                    }else if(newLabel==".mp4" || newLabel==".avi" || newLabel==".mov" || newLabel==".wmv" || newLabel==".mkv"){
                        this.filePhoto="static/mp4Img.png"
                    }else if(newLabel==".zip" || newLabel==".rar" || newLabel==".7z"){
                        this.filePhoto="static/zipImg.png"
                    }else if(newLabel==".ppt" || newLabel==".pptx"){
                        this.filePhoto="static/pptImg.png"
                    }else if(newLabel==".pdf"){
                        this.filePhoto="static/pdfImg.png"
                    }else {
                         this.filePhoto="static/defaultFile.png"
                    }
                    this.newAccessory.push({label:res.label,id:res.id,value:res.value,url:this.filePhoto})
                }) 
            }else{
                this.toAccessory=false
                this.attachment=false
            }
            if(this.arr.length>1){
                this.details=true
            }else{
                this.details=false
            }
        },
        staffList(){
            this.headDetails=false
        },
        staffLista(){
            this.headDetails=true
        }
    }
}
</script>

<style lang='less' scoped>
@import '~vux/src/styles/1px.less';
.title{
    font-size:0.4rem !important;
    font-weight:650 !important;
}
.lineFeed{
    word-wrap: break-word;
    word-break: break-all;
    white-space: normal;
}
.information{
    padding-top:0.2rem;
    margin-bottom:0.2rem ;
    .accessoryTitle{
        width:95%;
        font-weight:500;
    }
    .logoColor{
        color:#9B9B9B;
    }
}
// .content{
//     margin-top:0.2rem;
//     border-top:.5px solid #E3E4E5;
    .contentText {
    padding-top: 0.45rem;
    border-top: 0.5px solid #e3e4e5;
    min-height: 500px;
    overflow: hidden;
    text-align: justify;
    text-indent: 2em;
    text-align: justify;
    white-space:pre;
    white-space:pre-wrap;
    color:#656565;
  }
// }
.nodatacss {
  font-size:0.3rem;
  text-align: center;
   color:#656565;
  padding:0.5rem 0 0.75rem 0;
  background-color:#ffffff;
}
.personnel{
    width:100%;
    background-color:#fff;
    border-radius:5px;
    .addresser{
        border-top:1px solid #000000;
        .addresserUser{
            padding-top:0.2rem;
        }
    }
}
.accessorySize{
    margin-top:0.2rem;
}
</style>