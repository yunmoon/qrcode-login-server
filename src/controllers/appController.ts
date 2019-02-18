import {Router, Request, Response, NextFunction} from 'express'
import {HttpRequestError} from '../exceptions/httpException'
import {check, validationResult} from 'express-validator/check'
import {default as App, AppModel, AppTransformer} from '../models/app'
import async from 'async'
import {generateMd5, SuccessResponseData} from '../services/commonUtility'

let router: Router = Router()

router.post('/app/create', [
    check('appName').custom(value => {
        if (!value) {
            throw new Error('appName 不能为空')
        }
        return true
    }),check('description').custom(value => {
        if (!value) {
            throw new Error('description 不能为空')
        }
        return true
    }),check('appDownloadUrl').custom(value => {
        if (!value) {
            throw new Error('appDownloadUrl 不能为空')
        }
        return true
    })
], (req: Request, res: Response, next: NextFunction) => {
    try {
        validationResult(req).throw();
        const body = req.body
        async.waterfall([
            (cb: any) => {
                App.create({
                    appName: body.appName,
                    description: body.description,
                    appDownloadUrl: body.appDownloadUrl
                },cb)
            },
            (app: AppModel, cb: any) => {
                const secret = generateMd5(app._id + new Date().getTime())
                App.updateOne({_id: app._id}, {appSecret: secret}, (error) => {
                    app.appSecret = secret
                    cb(error, app)
                })
            }
        ], (err, result: AppModel|any) => {
            if (err) {
                return next(err)
            } else {
                return res.json(new SuccessResponseData('创建成功', new AppTransformer(result)))
            }
        });
    } catch (err) {
        next(new HttpRequestError(err.array().shift()['msg']))
    }
});

router.get('/', (req: Request, res: Response, next: NextFunction) => {
    return res.send('欢迎使用二维码登录系统')
})

export default router
