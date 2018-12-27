import {AppServer} from './server'
import routers from './routers'
import bodyParser from 'body-parser'
import {mongo} from './configs/config'
import mongoose from 'mongoose'
import {Request, Response, NextFunction} from 'express'
import {ErrorResponseData} from './services/commonUtility'
import {socketListenServer} from './services/socketServer'

let appServer = new AppServer(socketListenServer);
let app = appServer.getApp();
mongoose.connect(mongo.url, {useNewUrlParser: true}).then(() => {
    /** ready to use. The `mongoose.connect()` promise resolves to undefined. */
}).catch(error => {
    console.log("MongoDB connection error. Please make sure MongoDB is running. " + error);
})
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(routers);
app.use((error: any, req: Request, res: Response, next: NextFunction) => {
    console.error(error.stack)
    const statusCode = error.statusCode || 500
    return res.status(statusCode).json(new ErrorResponseData(error.message, null))
})
export {app}
