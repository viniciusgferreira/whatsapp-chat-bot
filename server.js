const qrcode = require('qrcode-terminal');
const fs = require('fs');
const { Client, LocalAuth, MessageMedia } = require('whatsapp-web.js');

// Use the saved values and start client
console.log('starting server...');
const client = new Client({
  ffmpegPath: '/usr/bin/ffmpeg',
  authStrategy: new LocalAuth(),
});

// QR CODE
client.on('qr', (qr) => {
  qrcode.generate(qr, { small: true });
});

// Save session values to the file upon successful auth
client.on('authenticated', () => {
  console.log('Authenticated');
});

client.on('ready', () => {
  console.log('Client is ready!');
});

async function handleMessage(message) {
  switch (message.body) {
    case '!menu':
      console.log(`incoming message: ${message.body}`);
      message.reply('!fig - Envie junto com a foto/video/gif para criar uma figurinha\n\n!menu - Para ver opções disponíveis\n\n Bot Vagabundo - feito por Vinicius G. Ferreira');
      break;
    case '!ping':
      console.log(`incoming message: ${message.body}`);
      message.reply('Estou trabalhando agora!\n\nBot Vagabundo');
      break;
    case '!fig':
      console.log(`incoming message: ${message.body}`);
      if (message.hasMedia) {
        const media = await message.downloadMedia();
        media.filename = 'sticker';
        console.log('Creating Sticker from file received');

        // CREATE FOLDER UPLOAD
        if (!fs.existsSync('./upload')) {
          console.log('creating ./upload folder');
          fs.mkdirSync('./upload');
        }

        const mediaPath = './upload/';
        const fullFilename = `${mediaPath + media.filename}.sticker`;

        try {
          fs.writeFileSync(fullFilename, media.data, { encoding: 'base64' });
          console.log('File downloaded successfully!', fullFilename);
          MessageMedia.fromFilePath(fullFilename);
          client.sendMessage(message.from, new MessageMedia(media.mimetype, media.data, media.filename), { sendMediaAsSticker: true, stickerAuthor: 'Created By Bot Vagabundo', stickerName: 'Stickers' });
          console.log('Sticker created and sent back to user.');
          fs.unlinkSync(fullFilename);
          console.log('File Deleted successfully!');
        } catch (err) {
          console.log('Failed to save the file:', err);
          console.log('File Deleted successfully!');
        }

        // DELETE FOLDER 'UPLOAD'
        fs.rmdirSync('./upload');
        console.log('upload folder deleted.');
      }

      break;
    default:
  }
}

client.on('message_create', handleMessage);

client.initialize();
