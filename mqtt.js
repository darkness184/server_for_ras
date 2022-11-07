const mqtt = require('mqtt')
const model = require('./model')

const host = 'mqtt.flespi.io'
const port = '1883'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`

const connectUrl = `mqtt://${host}:${port}`

// connect mqtt borker
const client = mqtt.connect(connectUrl, {
    clientId,
    clean: true,
    connectTimeout: 4000,
    username: 'zZJo5310cERPEUhEyMT3W9FtOXAModBL0aZV2OJ4ioHK8OevoYobXTuzES9STAtJ',
    password: '',
    reconnectPeriod: 1000,
})

// subcrise topic to receive
const topicSub = 'python/mqtt/data_predict'
client.on('connect', () => {
    console.log('[*] connect mqtt broker success')
    client.subscribe([topicSub], () => {
        console.log(`[*] subscribe to topic [${topicSub}]`)
    })
})

// watch message receive


let data_input = []
const topicPub = 'js/mqtt/data_predict'
client.on('message', (topic, payload) => {
    console.log('\n[*] [1] Received Message:', '[', topic, ']', payload.toString())
    if (payload.toString().length > 5) {
        data_input = payload.toString().split(' ');
        model.predict_fats(data_input, (str_data) => send_data(str_data))
    }
})

function get_data_input() {
    return data_input
}

function send_data(data_pub) {
    client.publish(topicPub, data_pub, { qos: 0, retain: false }, (error) => {
        if (error) {
            console.error(error)
        } else {
            console.log(`[*] [5] send data to [${topicPub}] data [${data_pub}]`)
        }
    })
}

// publish data predict
// var delayInMilliseconds = 3000
// client.on('connect', () => {
//     delayInMilliseconds
//     client.publish(topicPub, '4.5 0.999999', { qos: 0, retain: false }, (error) => {
//         if (error) {
//             console.error(error)
//         } else {
//             console.log(`[*] send data to [${topicPub}]  data`)
//         }
//     })
// })

module.exports.get_data_input = get_data_input
module.exports.send_data = send_data
