import { ajaxGet } from '../mxApi'

export function queryMessage(data) {
    return ajaxGet('/api/v1/users?limit=1') //测试接口
}
