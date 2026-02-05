import fetch from 'node-fetch';

let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`❌ *Please provide a question!*\n\n*Example:*\n${usedPrefix + command} What is artificial intelligence?`);
  
  m.reply('🤖 *AI is thinking...*');
  
  try {
    let api = `https://api.agatz.xyz/api/gpt4?message=${encodeURIComponent(text)}`;
    let response = await fetch(api);
    let json = await response.json();
    
    if (!json.data) return m.reply('❌ *AI failed to respond!*');
    
    let aiResponse = `
╭━━━━━━━━━━━━━━━━━╮
┃   *CHATGPT AI* 🤖
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

handler.help = ['chatgpt', 'ai', 'gpt'];
handler.tags = ['ai'];
handler.command = /^(chatgpt|ai|gpt|openai)$/i;

export default handler;
