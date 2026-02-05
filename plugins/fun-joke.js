import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  m.reply('😂 *Getting a joke...*');
  
  try {
    let response = await fetch('https://official-joke-api.appspot.com/random_joke');
    let json = await response.json();
    
    let jokeMsg = `
╭━━━━━━━━━━━━━━━━━╮
┃   *RANDOM JOKE* 😂
╰━━━━━━━━━━━━━━━━━╯

${json.setup}

💡 *Answer:* ${json.punchline}

_© YOUSAF-BALOCH-MD_
_Muhammad Yousaf Baloch_
`;
    
    await m.reply(jokeMsg);
  } catch (e) {
    console.error(e);
    return m.reply('❌ *Failed to get joke!*');
  }
};

handler.help = ['joke'];
handler.tags = ['fun'];
handler.command = /^(joke|jokes)$/i;

export default handler;
