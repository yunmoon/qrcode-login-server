import {default as App} from '../models/app'
export default function (socket:any, next:any) {
    let appId = socket.handshake.query.app_id;
    if (!appId) {
        return next(new Error('authentication error'));
    }
    App.findOne({_id: appId}).exec().then(result => {
        if (!result) {
            return next(new Error('authentication error'));
        }
        next()
    }).catch(error => {
        next(error)
    })
}
