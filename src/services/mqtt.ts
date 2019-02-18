import mqtt from 'mqtt'
import {mqtt as mqttConf} from '../configs/config'
const client = mqtt.connect(mqttConf.url);

export default client
