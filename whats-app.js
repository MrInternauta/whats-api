const { WAConnection, MessageType } = require('@adiwajshing/baileys');
let conn = null;
// CONECTA WHATS - SERVIDOR
module.exports.conectWhatsApp =  async function() {
    try {
        conn = new WAConnection();
        conn.connectOptions = {
            /** fails the connection if no data is received for X seconds */
            maxIdleTimeMs: 60_000,
            /** maximum attempts to connect */
            maxRetries: 10,
            /** max time for the phone to respond to a connectivity test */
            phoneResponseTime: 15_000,
            /** minimum time between new connections */
            connectCooldownMs: 4000,
            /** agent used for WS connections (could be a proxy agent) */
            agent: undefined,
            /** agent used for fetch requests -- uploading/downloading media */
            fetchAgent: undefined,
            /** always uses takeover for connecting */
            alwaysUseTakeover: false,
            /** log QR to terminal */
            logQR: true
        };
        conn.on('qr', qr => {
            // Now, use the 'qr' string to display in QR UI or send somewhere
            console.log('new QR generated', qr);
        })
        conn.on('close', (e) => {
            console.log('WhatsApp conection is closed', e);
        })
        conn.on('connection-phone-change', (state) => {
            console.log('WhatsApp connection-phone-change', state);
        })

        conn.on('ws-close', (e) => {
            console.log('WhatsApp ws-close', e);
        })

        conn.on('open', () => {
            // save credentials whenever updated
            console.log(`WhatsApp credentials updated!`)
        })


        if (conn.state !== 'open') {
            await conn.connect()
        }
        console.log(`WhatsApp conected`);
    } catch (error) {
        console.error(error);
    }
}
// ENVIAR MENSAJES

module.exports.sendMessage =  async function (req, res){
    try {
        //Create the id of the user by the phone number
        let clientejid = `${req.body.phone}@s.whatsapp.net`;
        //verify if existe conection with WhatsApp
        if (conn && conn.state !== 'open') {
            return res.json({ status: false, message: "Sin conexión a WhatsApp" })
        }
        //verify if the user is registered in WhatsApp
        let exists = await conn.isOnWhatsApp(clientejid)
        if (!exists) {
            return res.json({ status: exists, message: id + " no existe en WhatsApp" })
        }
        let message = req.body.message;
        //send the message
        return conn.sendMessage(clientejid, message, MessageType.text)
            .then(res.json({ status: true, message: 'Mensaje enviado' }))
            .catch(error => res.json({ status: false, message: "Error al enviar el mensaje", error }))
    } catch (error) {
        res.json({ status: false, message: "Error al enviar el mensaje", error })
    }
}