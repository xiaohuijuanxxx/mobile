var res = [
    {
        "zjlx": "1",
        "zjh": "2",
        "zh": "3",
        "hm": "4",
        "fzzh": "5",
        "cpbh": "6",
        "cpmc": "7",
        "khjg": "8",
        "khjgm": "9",
        "khrq": "10",
        "jzzt": "11",
        "zhzt": "12",
        "xhjg": "13",
        "xhjgm": "14",
        "xhgy": "15",
        "xhrq": "16",
    }
]
const labelNameMap = {
    "zjlx": "证件类型",
    "zjhm": "证件号",
    "zh": "账号",
    "hm": "户名",
    "fzzh": "负债账号",
    "cpbh": "产品编号",
    "cpmc": "产品名称",
    "khjg": "开户机构",
    "khjgm": "开户机构名",
    "khrq": "开户日期",
    "jzzt": "介质状态",
    "zhzt": "账户状态",
    "xhjg": "销户机构",
    "xhjgm": "销户机构名",
    "xhgy": "销户柜员",
    "xhrq": "销户日期",
}


export const handleData = function (data) {
    data = data || res ;
    return data.map(item => {
        return {
            id: item.zh,
            show: false,
            name: item.hm,
            list: Object.keys(item).reduce((acc,curr) => {
                return [
                    ...acc,
                    {
                        "label": labelNameMap[curr],
                        "value": item[curr]
                    }
                ]
            },[])
        }
    })
}

// console.log('handleData =>',handleData())