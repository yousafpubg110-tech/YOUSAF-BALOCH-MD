const fs = require('fs');

global.botname = 'YOUSAF BALOCH MD';
global.ownername = 'Yousaf Baloch';
global.owner = ['923710636110']; //

global.socialLinks = {
    youtube: 'https://www.youtube.com/@Yousaf_Baloch_Tech',
    tiktok: 'tiktok.com/@loser_boy.110',
    whatsapp: 'https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j'
};

global.mess = {
    wait: ' Yusuf Baloch, MD is working on it. Please wait 😊...⏳ '
};

let file = require.resolve(__filename)
fs.watchFile(file, () => {
	fs.unwatchFile(file)
	console.log(`Update ${__filename}`)
	delete require.cache[file]
	require(file)
})

