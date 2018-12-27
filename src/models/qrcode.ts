import mongoose from 'mongoose'

const QrcodeSchema = new mongoose.Schema({
    app: {
        type: mongoose.Schema.Types.ObjectId,
        ref:'App'
    },
    expired: Date //过期时间
}, {timestamps: true})

const Qrcode = mongoose.model("Qrcode", QrcodeSchema);

export default Qrcode;
