import mqttClient from '../services/mqtt'

mqttClient.on('connect', () =>{
    console.log('mqtt has connected')
})
export function socketListenServer(socket: any) {
    let handshake = socket.handshake;
    const appId = handshake.query.app_id;
    console.log(`appId ${appId} connected`)
    mqttClient.subscribe(`appid_${appId}`, (err)=> {
        if (err) {
            console.log(`subscribe appid ${appId} error`)
            console.error(err)
        } else {
            console.error(`subscribe appid ${appId} success`)
        }
    })
    mqttClient.on('message', function (topic, message) {
        socket.emit('login-success', JSON.parse(message.toString()))
    })
}
