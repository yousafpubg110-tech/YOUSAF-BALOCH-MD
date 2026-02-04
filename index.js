const {
    default: makeWASocket,
    useMultiFileAuthState,
    DisconnectReason,
    fetchLatestBaileysVersion,
    generateForwardMessageContent,
    prepareWAMessageMedia,
    generateWAMessageFromContent,
    generateMessageID,
    downloadContentFromMessage,
    makeInMemoryStore,
    jidDecode,
    proto
} = require("@whiskeysockets/baileys")
const pino = require('pino')
const { Boom } = require('@hapi/boom')
const fs = require('fs')
const axios = require('axios')
const chalk = require('chalk')
const figlet = require('figlet')
require('./config')

async function startYousafMd() {
    const { state, saveCreds } = await useMultiFileAuthState(`./session`)
    const conn = makeWASocket({
        logger: pino({ level: 'silent' }),
        printQRInTerminal: true,
        auth: state,
        browser: ['Yousaf Baloch MD', 'Safari', '1.0.0']
    })

    conn.ev.on('messages.upsert', async chatUpdate => {
        try {
            const m = chatUpdate.messages[0]
            if (!m.message) return
            const type = Object.keys(m.message)[0]
            const body = (type === 'conversation') ? m.message.conversation : (type === 'extendedTextMessage') ? m.message.extendedTextMessage.text : (type === 'imageMessage') ? m.message.imageMessage.caption : (type === 'videoMessage') ? m.message.videoMessage.caption : ''
            const prefix = /^[?#!.]/.test(body) ? body.match(/^[?#!.]/)[0] : '/'
            const command = body.replace(prefix, '').trim().split(/ +/).shift().toLowerCase()
            const args = body.trim().split(/ +/).slice(1)
            const pushname = m.pushName || "User"
            const botNumber = await conn.decodeJid(conn.user.id)
            const itsMe = m.key.fromMe ? true : false
            const text = args.join(" ")
            const from = m.key.remoteJid

            // ================= [ YOUSAF BALOCH MD COMMANDS ] =================

            if (command === 'menu' || command === 'help') {
                let menuText = `🌟 *YOUSAF BALOCH MD* 🌟\n\n`
                menuText += `👤 *User:* ${pushname}\n`
                menuText += `👨‍💻 *Owner:* Yousaf Baloch\n`
                menuText += `📌 *Prefix:* [ ${prefix} ]\n\n`
                menuText += `*--- GROUP COMMANDS ---*\n`
                menuText += `• ${prefix}kick\n• ${prefix}add\n• ${prefix}promote\n• ${prefix}demote\n• ${prefix}tagall\n• ${prefix}hidetag\n\n`
                menuText += `*--- DOWNLOADER ---*\n`
                menuText += `• ${prefix}ytmp4\n• ${prefix}ytmp3\n• ${prefix}tiktok\n• ${prefix}facebook\n• ${prefix}instagram\n\n`
                menuText += `*--- GAMES ---*\n`
                menuText += `• ${prefix}akinator\n• ${prefix}math\n• ${prefix}truth\n• ${prefix}dare\n\n`
                menuText += `*--- OTHERS ---*\n`
                menuText += `• ${prefix}sticker\n• ${prefix}tourl\n• ${prefix}translate\n• ${prefix}ai\n\n`
                menuText += `_Created by Yousaf Baloch_`
                
                await conn.sendMessage(from, { 
                    text: menuText,
                    contextInfo: {
                        externalAdReply: {
                            title: 'YOUSAF BALOCH MD',
                            body: 'The Most Powerful WhatsApp Bot',
                            thumbnailUrl: 'https://telegra.ph/file/your-image.jpg',
                            sourceUrl: 'https://www.youtube.com/@Yousaf_Baloch_Tech',
                            mediaType: 1,
                            renderLargerThumbnail: true
                        }
                    }
                }, { quoted: m })
            }

            // AI Command
            if (command === 'ai' || command === 'gpt') {
                if (!text) return m.reply('Please provide a query!')
                const response = await axios.get(`https://api.simsimi.net/v2/?text=${encodeURIComponent(text)}&lc=en`)
                await conn.sendMessage(from, { text: response.data.success }, { quoted: m })
            }

            // Evaluation (Owner Only)
            if (command === 'eval') {
                if (!itsMe) return m.reply('This command is only for Yousaf Baloch!')
                try {
                    let evaled = await eval(text)
                    if (typeof evaled !== 'string') evaled = require('util').inspect(evaled)
                    m.reply(evaled)
                } catch (err) {
                    m.reply(String(err))
                }
            }

        } catch (err) {
            console.log(err)
        }
    })

    conn.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            let shouldReconnect = (lastDisconnect.error instanceof Boom)?.output?.statusCode !== DisconnectReason.loggedOut
            if (shouldReconnect) startYousafMd()
        } else if (connection === 'open') {
            console.log(chalk.green('YOUSAF BALOCH MD IS CONNECTED! ✅'))
        }
    })

    conn.ev.on('creds.update', saveCreds)
}

startYousafMd()
                          
