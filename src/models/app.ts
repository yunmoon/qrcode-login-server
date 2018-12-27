import mongoose from 'mongoose'
import moment from 'moment'

export interface AppModel {
    appName: string, //应用名称
    description: string,//应用描述
    _id: string,
    appSecret: string,
    appDownloadUrl: string,//应用下载地址
    createdAt: any
}

export class AppTransformer {
    public appName: string;
    public description: string;
    public appId: string | undefined;
    public appSecret: string | undefined;
    public created: string | undefined;
    public appDownloadUrl: string;
    constructor(appModel: AppModel) {
        this.appId = appModel._id;
        this.description = appModel.description;
        this.appName = appModel.appName;
        this.appSecret = appModel.appSecret;
        this.appDownloadUrl = appModel.appDownloadUrl
        this.created = moment(appModel.createdAt).format('YYYY-MM-DD HH:mm')
    }
}

const AppSchema = new mongoose.Schema({
    appName: String,
    description: String,
    appSecret: String,
    appDownloadUrl: String,
}, {timestamps: true})

const App = mongoose.model("App", AppSchema);

export default App;
