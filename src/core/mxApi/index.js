import {queryString} from '../utils';
import store from '../../store/store'

function MXApi(callbacks) {
    var deviceReady = false;
    var taskQueue = [];
    document.addEventListener('deviceready', function deviceReadyHandler() {
        deviceReady = true;
        taskQueue.forEach(function(task) {
            applyApi.apply(null, task);
        })
        callbacks.ready && callbacks.ready();
        document.removeEventListener('deviceready', deviceReadyHandler, false);
    }, false)

    function applyApi(namespace, api, args) {
        if (window[namespace] && window[namespace][api]) {
            callbacks.beforeApply && callbacks.beforeApply(namespace, api, args);
            window[namespace][api].apply(null, args);
        } else if (!deviceReady){
            taskQueue.push([namespace, api, args]);
        } else {
            callbacks.error && callbacks.error(['该终端没有', namespace, '.', api, '方法!'].join(''), namespace, api);
            throw new Error(['该终端没有', namespace, '.', api, '方法!'].join(''));
        }
    }
    return applyApi;
}

const applyApi = MXApi({
    ready: function() {
        console.log('device ready!!');
    },
    error: function(err) {
        console.log(err);
    },
    beforeApply: function(namespace, api, args) {
    }
});


const makeApi = namespace => (api, ...args) => applyApi(namespace, api, args);
const MXCommon = makeApi('MXCommon');
const MXWebui = makeApi('MXWebui');
const MXContacts = makeApi('MXContacts');

export const hideWebViewTitle = () => MXWebui('hideWebViewTitle');

export const showOptionMenu = () => MXWebui('showOptionMenu');

export const closeWindow = () => MXWebui('closeWindow');

export const setCustomHeaderMenu = (...args) => MXWebui('setCustomHeaderMenu', ...args);

export const getCurrentUser = callback => new Promise((resolve, reject) => {
    MXCommon('getCurrentUser', resolve)
})

export const MXSelectUsers = () => new Promise((resolve, reject) => {
    MXContacts('selectUsers', function(result) {
        resolve(result);
    }, {
        enableSelectDept: false,
        canSelectSelf: true
    })
})

export const ajax = params => new Promise((resolve, reject) => {
    let token = store.state.ssoToken;
    params = Object.assign({}, params, {
        url: `${params.url}`,
        async: true,
        dataType:"json",
        headers: {'Accept':'application/json, text/plain, */*','Content-type':'application/json;charset=UTF-8','Authorization':token?token:undefined},
        success: function(data, status, xhr) {
            resolve({ data: JSON.parse(data), status });
        },
        error: function(data, status, xhr) {
            reject({ data, status });
        }
    })
    MXCommon('ajax', params);
})

export const ajaxtok = params => new Promise((resolve, reject) => {

    params = Object.assign({}, params, {
        url: `${params.url}`,
        async: true,
        headers: {'Accept':'application/json,text/plain,*/*','Content-type':'application/json;charset=UTF-8','Authorization':'Basic b21zLW1vYmxpZTpvbXMtbW9ibGll'},
        success: function(data, status, xhr) {
            resolve({ data: JSON.parse(data), status });
        },
        error: function(data, status, xhr) {
            reject({ data, status });
        }
    })
    MXCommon('ajax', params);
})

export const ajaxtdl = params => new Promise((resolve, reject) => {

    params = Object.assign({}, params, {
        url: `${params.url}`,
        headers: {'Accept':'application/json,text/plain,*/*','content-type':'application/x-www-form-urlencoded','Authorization':'Basic b21zLXdlYjpvbXMtd2Vi'},
        responseType: 'blob',
        success: function(data, status, xhr) {
            resolve({ data, status });
        },
        error: function(data, status, xhr) {
            reject({ data, status });
        }
    })
    MXCommon('ajax', params);
})

export const ajaxGet = (url, query) => {
    url = query ? `${url}?${queryString.stringify(query)}` : url;
    const params = {
        type: 'GET',
        url,
    }
    return ajax(params);
}

export const ajaxGetdl = (url, query) => {
    url = query ? `${url}?${queryString.stringify(query)}` : url;
    const params = {
        type: 'GET',
        url,
    }
    return ajaxtdl(params);
}

export const ajaxPost = (url, data) => {
    return ajax({
        type: 'POST',
        url,
        data
    })
}

export const ajaxtokenPost = (url, data) => {
    return ajaxtok({
        type: 'POST',
        url,
        data
    })
}

export const ajaxPut = (url, data) => {
    return ajax({
        type: 'PUT',
        url,
        data
    })
}

export const ajaxDelete = (url, id) => {
    return ajax({
        type: 'DELETE',
        url: `${url}/${id}`
    })
}






