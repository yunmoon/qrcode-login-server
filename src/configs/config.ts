export let mongo = {
    url: 'mongodb://127.0.0.1:27017/qrcode-server' // mongodb连接地址
};

export let qrcode = {
    expire: 60000 //单位毫秒,有效时间
}

export let mqtt = {
    url: 'mqtt://192.168.0.195:1883' // mqtt连接地址
}
