import {Router, Request, Response, NextFunction} from 'express'
import {qrcode} from '../configs/config'
import moment from 'moment'
import {default as Qrcode} from '../models/qrcode'
import async from 'async'
import {SuccessResponseData, getAppHost} from '../services/commonUtility'
import checkApiSigin from "../middlewares/checkApiSigin";
import mqttClient from '../services/mqtt'
import {HttpRequestError, HttpServerError} from '../exceptions/httpException'
let router: Router = Router()
import cors from 'cors'

enum Action {
    Scan = 'scan',
    Confirm = 'confirm',
    Cancel = 'cancel'
}

class PublicMessage {
    constructor (public action: Action,  public loginData?: any) {
    }
}

router.options('/getQrcode', cors())
router.get('/getQrcode',cors(),checkApiSigin, (req: Request, res: Response, next: NextFunction) => {
    const appId: string = req.query.app_id
    async.waterfall([
        (cb: any) => {
            Qrcode.create({app: appId, expired: moment().add(qrcode.expire, 'ms').toDate()}, cb)
        }
    ], (error, result: any) => {
        if (error) {
            return next(error)
        }
        return res.json(new SuccessResponseData('获取成功', {
            qrcode: `${getAppHost(req)}/qrcode/${result._id}`,
            expire: result.expired.getTime()
        }))
    })
})

router.route('/qrcode/:id')
    .get((req: Request, res: Response, next: NextFunction) => {
        const host = getAppHost(req)
        Qrcode.findOne({_id: req.params.id}).populate('app').exec().then((result: any) => {
            let url = host
            if (result) {
                url = result.app.appDownloadUrl || host
            }
            return res.redirect(url)
        }).catch(() => {
            return res.redirect(host)
        })
    })
    .post((req: Request, res: Response, next: NextFunction) => {
        const body = req.body
        if (!body.app_id) {
            next(new HttpRequestError('app_id 不能为空'))
        }
        const action: Action = body.action || 'scan'

        Qrcode.findOne({
            _id: req.params.id,
            expired: {
                $gte: new Date()
            }
        }).populate('app').exec().then((result: any) => {
            if (!result) {
                return next(new HttpRequestError('无效的二维码'))
            }
            if (body.app_id !== result.app._id.toString()) {
                return next(new HttpRequestError('app_id错误，或者无效的二维码'))
            }
            let message
            if (action === Action.Confirm) {
                message = new PublicMessage(action, body.loginData)
            } else {
                message = new PublicMessage(action)
            }
            mqttClient.publish(`appid_${result.app._id}`, JSON.stringify(message));
            return res.json(new SuccessResponseData('操作成功', null))
        }).catch((error) => {
            next(new HttpServerError(error.message))
        })
    });
export default router
