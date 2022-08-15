const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const whatsapp = require('./whats-app');

app.use(bodyParser.json())


app.post('/whatsapp/sendmessage', whatsapp.sendMessage);

app.listen(3001, async () => {
    await whatsapp.conectWhatsApp();
    console.log('conectado')
})