var express = require('express');
var r = express.Router();

// load pre-trained model
const model = require('./sdk/model.js');

// Bot Setting
const TelegramBot = require('node-telegram-bot-api');
const token = '1918739445:AAGwfICp5QCLQ4oefWhvvmoPK8VQs0cz1Ks'
const bot = new TelegramBot(token, {polling: true});


// bots
bot.onText(/\/start/, (msg) => { 
    console.log(msg)
    bot.sendMessage(
        msg.chat.id,
        `hello ${msg.chat.first_name}, welcome...\n
        click /predict`
    );   
});

state = 0
bot.onText(/\/predict/, (msg) => { 
    bot.sendMessage(
        msg.chat.id,
        `input nilai x1|x2|x3 contohnya 35|16|81 (sesuai dengan nilai pada dataset)`
    );   
    state = 1;
});

bot.on('message', (msg) => {
    if(state == 1){
        s = msg.text.split("|");
        x1 = s [0]
        y1 = s [1]
        model.predict(
            [
                parseFloat(s[0]), // string to float
                parseFloat(s[1]),
                parseFloat(s[2])
            ]
        ).then((jres)=>{
            bot.sendMessage(
                msg.chat.id,
                `nilai y1 yang diprediksi adalah ${jres [0]} `
                
            ); 
            bot.sendMessage(
                msg.chat.id,
                `nilai y2 yang diprediksi adalah ${jres [1]} `
            );
            
             bot.sendMessage(
                msg.chat.id,
                `nilai y3 yang diprediksi adalah ${jres [2]} `
            );
        })
    }else{
        state = 0
    }
})
// routers
r.get('/prediction/:x1/:x2/:x3', function(req, res, next) {    
    model.predict(
        [
            parseFloat(req.params.x1), // string to float
            parseFloat(req.params.x2),
            parseFloat(req.params.x3)
        ]
    ).then((jres)=>{
        res.json(jres);
    })
});

module.exports = r;
