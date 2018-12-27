import mqtt from 'mqtt'
const client = mqtt.connect('mqtt://192.168.0.195:1883');

export default client
