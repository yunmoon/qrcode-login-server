import appController from './controllers/appController'
import qrcodeController from './controllers/qrcodeController'
import {Router} from 'express'

let routers: Array<Router> = [appController, qrcodeController];

export default routers
