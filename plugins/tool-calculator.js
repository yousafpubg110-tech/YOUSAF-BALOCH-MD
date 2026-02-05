let handler = async (m, { conn, text, usedPrefix, command }) => {
  if (!text) return m.reply(`❌ *Please provide a mathematical expression!*\n\n*Example:*\n${usedPrefix + command} 25 * 4`);
  
  try {
    let result = new Function('return ' + text)();
    
    let calcMsg = `
╭━━━━━━━━━━━━━━━━━╮
┃   *CALCULATOR* 🔢
╰━━━━━━━━━━━━━━━━━╯

📝 *Expression:*
${text}

💡 *Result:*
${result}

_© YOUSAF-BALOCH-MD_
_Muhammad Yousaf Baloch_
`;
    
    await m.reply(calcMsg);
  } catch (e) {
    return m.reply('❌ *Invalid mathematical expression!*');
  }
};

handler.help = ['calculator', 'calc'];
handler.tags = ['tools'];
handler.command = /^(calculator|calc)$/i;

export default handler;
