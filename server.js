const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

// Path where the session data will be stored
const SESSION_FILE_PATH = './session.json';

// Load the session data if it has been previously saved
let sessionData;
if (fs.existsSync(SESSION_FILE_PATH)) {
    sessionData = require(SESSION_FILE_PATH);
}

// Use the saved values
const client = new Client({
    authStrategy: new LocalAuth()
});

//QR CODE
client.on('qr', qr => {
    qrcode.generate(qr, { small: true });
});

// Save session values to the file upon successful auth
client.on('authenticated', () => {
    console.log('Authenticated');

});


client.on('ready', () => {
    console.log('Client is ready!');
});

client.on('message_create', handleMessage);

async function handleMessage(message) {
    switch (message.body) {
        case '!menu':
            console.log("incoming message: " + message.body);
            message.reply('!fig - Envie junto com a foto (video/gifs ainda não) para criar uma figurinha\n\n!menu - Para ver opções disponíveis\n\n Bot Vagabundo - feito por Vinicius G. Ferreira');
            break;
        case '!fig':
            console.log("incoming message: " + message.body);
            if (message.hasMedia) {
                const media = await message.downloadMedia();
                media.filename = 'sticker';
                const mediaPath = './upload/';
                const fullFilename = mediaPath + media.filename + '.jpg';
                console.log(fullFilename);

                try {
                    fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' });
                    console.log('File downloaded successfully!', fullFilename);
                    console.log(fullFilename);
                    MessageMedia.fromFilePath(filePath = fullFilename)
                    client.sendMessage(message.from, new MessageMedia(media.mimetype, media.data, media.filename), { sendMediaAsSticker: true, stickerAuthor: "Created By Bot", stickerName: "Stickers" })
                    fs.unlinkSync(fullFilename)
                    console.log(`File Deleted successfully!`,);
                } catch (err) {
                    console.log('Failed to save the file:', err);
                    console.log(`File Deleted successfully!`,);
                }

            }
    }
}

client.initialize();