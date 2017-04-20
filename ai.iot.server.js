'use strict'

const apiai = require('apiai')
const bodyParser = require('body-parser')
var five = require('johnny-five')
// var board = new five.Board()
var path = require('path')
var express = require('express')
var server = express()

const appai = apiai('f8a6229347a64e3eac38a17f5972dffe')
let devices = {}

server.use(bodyParser.json())
server.use('/public', express.static('public'))
server.get('/', function(req, res) {
    res.send('welcome')
})

server.get('/speak', function(req, res) {
    res.sendFile(__dirname + '/speak.html')
})

server.post('/query', function(req, res) {
    let q = req.body.q
    let sId = 12345

    const request = appai.textRequest(q, { sessionId: sId })

    request.on('response', (response) => {
        res.send({ reply: response.result.fulfillment.speech })
        processResponse(response.result)
    })

    request.on('error', (error) => {
        console.log(error)
    })

    request.end()
})

// arduino ready
// board.on('ready', function() {
//     console.log('board ready')
//     const ledPin = new five.Led(13)
//     devices = {
//         led: ledPin
//     }
// })

server.listen(3000, '127.0.0.1')
console.log('server up at 3000')

// api ai response
const processResponse = (result) => {
    // intents
    switch (result.action) {
        case 'input.iot':
            iotAction(result.parameters, result.fulfillment.speech)
            break

        case 'input.welcome':
            console.log('input.welcome')
            break

        case 'input.unknown':
            console.log('input.unknown')
            break

        default:
            console.log('default')
            break
    }
}

const iotAction = (parameters, speech) => {
    if (parameters.fan !== '') motorAction(parameters.on, parameters.off, parameters.fan)
    else if (parameters.light !== '') ledAction(parameters.on, parameters.off, parameters.light)
    else if (parameters.sound !== '') beepActopm(parameters.on, parameters.off, parameters.sound)
    else if (parameters.temperature !== '') temperatureAction(parameters.on, parameters.off, parameters.temperature)
    else doNothing()
}

const motorAction = (on, off, fan) => {
    console.log(on, off, fan)
}

const ledAction = (on, off, light) => {
    console.log(on, off, light)
    // if (on === 'on' || (on === '' && off === ''))
    //     devices.led.on()
    // else
    //     devices.led.off()
}
