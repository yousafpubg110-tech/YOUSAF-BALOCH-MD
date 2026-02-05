import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`❌ *Please provide a question!*\n\n*Example:*\n${usedPrefix + command} Tell me about Muhammad Yousaf Baloch`);
  
  m.reply('💎 *Gemini AI is thinking...*');
  
  try {
    let api = `https://api.agatz.xyz/api/gemini?message=${encodeURIComponent(text)}`;
    let response = await fetch(api);
    let json = await response.json();
    
    if (!json.data) return m.reply('❌ *AI failed to respond!*');
    
    let aiResponse = `
╭━━━━━━━━━━━━━━━━━╮
┃   *GEMINI AI* 💎
╰━━━━━━━━━━━━━━━━━╯

📝 *Your Question:*
${text}

💬 *AI Response:*
${json.data}

_© YOUSAF-BALOCH-MD_
_Powered by Muhammad Yousaf Baloch_
`;
    
    await m.reply(aiResponse);
  } catch (e) {
    console.error(e);
    return m.reply('❌ *Error connecting to AI!*');
  }
};

handler.help = ['gemini', 'bard'];
handler.tags = ['ai'];
handler.command = /^(gemini|bard|palm)$/i;

export default handler;
