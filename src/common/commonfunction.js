import Vue from 'vue';
import { Loading } from 'element-ui';
import { hideWebViewTitle, closeWindow } from '../core/mxApi'
import { url } from '../dataPass/asssets/Api/api';
import { ajaxGet } from '../core/mxApi';
let myMixin = {
    data() {
        return {
            pageindex: null,
            actionSheetVisable: false, // 底部弹框是否显示
            menusall: null,
            actionSheetVisableJ: false,
            sure: '<div class="mySeetTop sheetColor">确定</div>'

        }
    },
    beforeRouteLeave(to, from, next) {
        hideWebViewTitle()
        //MXWebui.enableTranslucentHeader({    
        // height: '80',    
        //  onSuccess: function() {
        //  }, // 设置成功   
        //  onFail: function() {
        //  } // 设置失败 
        //  });
        // if (to.path === '/userApprovalDetail' || to.path === '/requirementApprovalDetail') {
        //     let tit = '',url = ''
        //     if (to.path === '/userApprovalDetail') {
        //         tit = '用户审批详情'
        //     }else {
        //         tit = '需求审批详情'
        //     }
        //     if (to.query.type === 'yhsp'){
        //         url = 'home'
        //           this.$store.commit({
        //           type: 'changepage',
        //           pageindex: 2,
        //         });
        //       }else {
        //         url = 'reviewdetail'
        //       }
        //     MXWebui.showWebViewTitle()
        //     document.addEventListener('deviceready',()=> {
        //         MXWebui.setCustomHeader({
        //           slot: {
        //             left_1: {
        //               action: () => {
        //                 hideWebViewTitle()
        //                 this.push(url)
        //             },
        //               preventDefault: true,
        //               content: 'mxIconResource://back'
        //             },
        //             left_2: { hidden: true },
        //             middle: { title: tit },
        //             right_1: { hidden: true },
        //             right_2: { hidden:  true }
        //           },
        //           onSuccess: function() {
        //     }, // 设置成功
        //           onFail: function() {} // 设置失败
        //         });
        //       })
        // }
        // if (to.path === '/personInfo') {
        //     MXWebui.showWebViewTitle()
        //     document.addEventListener('deviceready',()=> {
        //         MXWebui.setCustomHeader({
        //           slot: {
        //             left_1: {
        //               action: () => {
        //                 hideWebViewTitle()
        //                 this.push('home')
        //                 this.$store.commit({
        //                     type: 'changepage',
        //                     pageindex: 3,
        //                   });
        //             },
        //               preventDefault: true,
        //               content: 'mxIconResource://back'
        //             },
        //             left_2: { hidden: true },
        //             middle: { title:'个人信息'},
        //             right_1: { hidden: true },
        //             right_2: { hidden:  true }
        //           },
        //           onSuccess: function() {}, // 设置成功
        //           onFail: function() {} // 设置失败
        //         });
        //       })
        // }
        next()
    },
    methods: {
        // 判断字符长度
        judgeLength(val) {
            if (val.length > 0 && val.length < 52) {
                return true
            } else {
                //this.dataForm[name] = this.dataForm[name] + '/n'
                return false
            }
        },
        touchMove(ref, name, _this) {
            ref.addEventListener('touchstart', (e) => {
                this.startX = e.touches[0].pageX;
            })
            ref.addEventListener('touchmove', (e) => {
                var moveEndX = e.changedTouches[0].pageX;
                var X = moveEndX - this.startX;
                ref.style.position = 'relative';
                if (X < -50) {//左滑
                    ref.style.left = X + 'px';
                } if (X > 50) {//右滑
                    ref.style.left = X - 50 + 'px';
                }
            })
            ref.addEventListener('touchend', (e) => {
                if (ref.offsetLeft < -50) {
                    this.$router.push(name)
                }
                if (ref.offsetLeft > 50) {
                    this.$router.push(name)
                }
                else {
                    ref.style.left = 0 + 'px';
                }
            })
        },
        pushLoginOut() {
            ajaxGet(url.loginout)
                .then((res) => {
                    const {
                        data: { code, message, data },
                    } = res;
                    if (code == "0000") {
                        closeWindow();
                    }
                })
                .catch((err) => {
                    const omsg = this.outmsg(err);
                    this.closeloading();
                    if (!omsg) {
                        return;
                    }
                    this.actionSheetVisable = true;
                    this.sheet(omsg);
                });
        },
        openTableau(id) {
            const params = {
                userId: JSON.parse(sessionStorage.getItem('currentUser')).userId,
                userName: JSON.parse(sessionStorage.getItem('currentUser')).username,
                reportId: id,
            };
            ajaxGet(url.gettableau, params).then((res) => {
                MXCommon.openUrlPage(res.data.data)
                // this.src = res.data.data;
            }).catch(error => {
                this.actionSheetVisable = true;
                this.sheet(JSON.parse(error.data).message, 'info');
            });
        },
        push(url) {
            this.$router.push(url);
        },
        pop(n = -1) {
            let path = this.$router.currentRoute.path;
            if (path == 'home') {
                return
            }
            this.$router.go(n)
        },
        showloading() {
            this.$vux.loading.show({
                // text: 'Loading'
            })
        },
        closeloading() {
            this.$vux.loading.hide()
        },
        // showloading() {
        //     this.$loading({});        
        // closeloading() {
        //     this.$loading().close()
        // },
        isloading() {
            return this.$vux.loading.isVisible()
        },
        setcookie(key, value) {
            document.cookie = key + '=' + value
        },
        getcookie(key) {
            const cookieArr = document.cookie.split(';')
            for (let i = 0; i < cookieArr.length; i++) {
                let arr = cookieArr[i].split('=')
                if (arr[0] == key) {
                    return arr[1]
                }
            }
        },
        getquerystring(name) {
            let r = window.location.href, rvalue = ''
            if (r.indexOf('?') > -1) {
                let r1 = r.split('?')[1]
                let keyvalue = r1.split('&')
                keyvalue.forEach(item => {
                    let keys = item.split('=')
                    if (keys[0] == name) {
                        rvalue = keys[1]
                    }
                })
                if (rvalue) {
                    return rvalue
                }
                return null
            } else {
                return null
            }

        },
        message(title, type = 'text', time = '2000', mask = true, position = 'default') {
            this.$vux.toast.show({
                text: title,
                type,  //success,warn,cancel,text
                time,
                isShowMask: mask,
                position
            })
        },
        sheet(title, type = 'info') {
            let typarr = { info: '提示', warn: '警告', success: '成功' }
            this.menusall = {
                'title.noop': `<div class="mySeetTop minFontSize">${typarr[type]}</div><div class="mySeetTop minFontSizemid">${title}</div>`,
                delete: '<div class="mySeetTop sheetColor minFontSize">确定</div>'
            }
        },
        outmsg(data) {
            if (Object.keys(data).length === 0) {
                return false
            }
            if (typeof (data.data) == 'string') {
                if (data.data.indexOf('{') > -1) {
                    let datasm = JSON.parse(data.data).message
                    let datac = JSON.parse(data.data).code
                    if (datac == '0401') {
                        this.$vux.alert.show({
                            title: '警告',
                            content: '证书过期，请退出后重新打开数聚通',
                            onHide() {
                                closeWindow()
                            }
                        })
                        return false
                    }
                    if (datasm == 'Unauthorized') {
                        return '您没有权限'
                    } else {
                        return datasm
                    }
                } else {
                    return data.data
                }
            } else if (typeof (data.data.message) == 'string') {
                return data.data.message
            } else {
                return '未知错误'
            }
        },
    }
}
export default myMixin;
export function setCheckMyselves(item, checkedLists) {
    if (checkedLists.indexOf(item) == -1) {
        checkedLists.push(item)
    } else {
        const len = checkedLists.length
        let i = 0
        for (i; i < len; i++) {
            if (checkedLists[i] == item) {
                checkedLists.splice(i, 1)
            }
        }
    }
    return checkedLists
}
export function judgeFileType(file) {
    let index = file.indexOf(".");
    file = file.substring(index);
    if (file == ".txt" || file == ".rtf" || file == ".odt") {
        return "static/txtImg.png"
    } else if (file == ".docx" || file == ".doc" || file == ".dotm" || file == ".dot" || file == ".xml" || file == ".xps") {
        return "static/wordImg.png"
    } else if (file == ".xls" || file == ".xlsx" || file == ".xlsm" || file == ".xml" || file == ".xltx") {
        return "static/excelImg.png"
    } else if (file == ".mp4" || file == ".avi" || file == ".mov" || file == ".wmv" || file == ".mkv") {
        return "static/mp4Img.png"
    } else if (file == ".zip" || file == ".rar" || file == ".7z") {
        return "static/zipImg.png"
    } else if (file == ".ppt" || file == ".pptx") {
        return "static/pptImg.png"
    } else if (file == ".pdf") {
        return "static/pdfImg.png"
    } else {
        return "static/defaultFile.png"
    }
}
export function judgeFontType(val) {
    if (val == 0) {
        document.body.style.setProperty("--bigSize", "0.34rem");
        document.body.style.setProperty("--midSize", "0.336rem");
        document.body.style.setProperty("--minSize", "0.32rem");
        document.body.style.setProperty("--minSizemid", "0.28rem");
        document.body.style.setProperty("--userSizeZy", "0.28rem");
        document.body.style.setProperty("--minSizeMin", "0.24rem");
    } else if (val == 1) {
        document.body.style.setProperty("--bigSize", "0.38rem");
        document.body.style.setProperty("--midSize", "0.376rem");
        document.body.style.setProperty("--minSize", "0.36rem");
        document.body.style.setProperty("--minSizemid", "0.32rem");
        document.body.style.setProperty("--userSizeZy", "0.32rem");
        document.body.style.setProperty("--minSizeMin", "0.29rem");
    } else if (val == 2) {
        document.body.style.setProperty("--bigSize", "0.42rem");
        document.body.style.setProperty("--midSize", "0.416rem");
        document.body.style.setProperty("--minSize", "0.40rem");
        document.body.style.setProperty("--minSizemid", "0.335rem");
        document.body.style.setProperty("--userSizeZy", "0.325rem");
        document.body.style.setProperty("--minSizeMin", "0.30rem");
    } else {
        document.body.style.setProperty("--bigSize", "0.46rem");
        document.body.style.setProperty("--midSize", "0.42rem");
        document.body.style.setProperty("--minSize", "0.40rem");
        document.body.style.setProperty("--minSizemid", "0.345rem");
        document.body.style.setProperty("--userSizeZy", "0.327rem");
        document.body.style.setProperty("--minSizeMin", "0.315rem");
    }
}
