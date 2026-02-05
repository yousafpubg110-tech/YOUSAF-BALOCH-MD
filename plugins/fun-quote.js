import fetch from 'node-fetch';

let handler = async (m, { conn }) => {
  m.reply('✨ *Getting a quote...*');
  
  try {
    let response = await fetch('https://api.quotable.io/random');
    let json = await response.json();
    
    let quoteMsg = `
╭━━━━━━━━━━━━━━━━━╮
┃   *DAILY QUOTE* ✨
╰━━━━━━━━━━━━━━━━━╯

"${json.content}"

— *${json.author}*

_© YOUSAF-BALOCH-MD_
_Muhammad Yousaf Baloch_
`;
    
    await m.reply(quoteMsg);
  } catch (e) {
    console.error(e);
    return m.reply('❌ *Failed to get quote!*');
  }
};

handler.help = ['quote', 'quotes'];
handler.tags = ['fun'];
handler.command = /^(quote|quotes|motivate)$/i;

export default handler;
