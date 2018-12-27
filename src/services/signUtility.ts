import crypto from 'crypto'
import {default as App, AppModel} from '../models/app'
import {HttpRequestError} from '../exceptions/httpException'
import async from 'async'
import qs from 'qs'

function objectSort(obj: any): any {
    const keys = Object.keys(obj).sort();
    let newObj: any = {}
    keys.forEach((val) => {
        newObj[val] = obj[val];
    })
    return newObj;
}

function formatStr(obj: any): string {
    return qs.stringify(obj)
}

let getReqSign = function(str: string, appKey: string) :string{
    str += `&app_key=${appKey}`
    const md5 = crypto.createHash('md5');
    return md5.update(str, 'utf8').digest('hex');
}

let checkSign = function (data: any) :Promise<any>{
    return new Promise((resolve, reject) => {
        if (!data.time_stamp || !data.app_id || !data.nonce_str || !data.sign) {
            return reject(new HttpRequestError('参数错误'));
        }
        const now = new Date().getTime();
        if (now - parseInt(data.time_stamp) > 5 * 60 * 1000) {
            return reject(new HttpRequestError('接口已过期'));
        }
        async.waterfall([
            (cb: (error: Error| null, app?:AppModel) => void) => {
                App.findById(data.app_id).exec().then((result: any) => {
                    if (!result) {
                        cb(new HttpRequestError('App 被锁定或删除'))
                    } else {
                        cb(null, result)
                    }
                }).catch(error => {
                    cb(error)
                })
            },
            (result: AppModel, cb:any) => {
                const appSecret = result.appSecret;
                const cpData = {...data};
                delete cpData.sign;
                const sign = getReqSign(formatStr(objectSort(cpData)), appSecret);
                console.log(sign);
                if (sign !== data.sign) {
                    return cb(new HttpRequestError('验证签名错误'))
                }
                cb()
            }
        ], (error) => {
            if (error) {
                reject(error)
            } else {
                resolve()
            }
        });
    })
}
export {getReqSign, checkSign}
