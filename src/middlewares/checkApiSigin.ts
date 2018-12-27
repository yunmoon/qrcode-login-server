import {Request, Response, NextFunction} from 'express'
import {checkSign} from "../services/signUtility";
export default function (req: Request, res: Response, next: NextFunction) {
    let data = req.query
    if (req.method === 'POST') {
        data = Object.assign(req.body, data)
    }
    checkSign(data).then(() => {
        next()
    }, err => {
        next(err)
    })
}
