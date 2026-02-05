export async function before(m, { isAdmin, isBotAdmin }) {
  if (m.messageStubType === 68 || m.messageStubType === 69) {
    let chat = global.db.data.chats[m.chat];
    if (!chat?.antidelete) return true;
    
    let msg = m.message?.protocolMessage?.key;
    if (!msg) return;
    
    let deletedMsg = await this.loadMessage(msg.remoteJid, msg.id);
    if (!deletedMsg) return;
    
    let sender = deletedMsg.key.participant || deletedMsg.key.remoteJid;
    let name = await this.getName(sender);
    
    let antiDeleteMsg = `
╭━━━━━━━━━━━━━━━━━╮
┃ *ANTI DELETE* 🚫
╰━━━━━━━━━━━━━━━━━╯

👤 *User:* @${sender.split('@')[0]}
📝 *Tried to delete a message!*

_© YOUSAF-BALOCH-MD_
_No one can hide from me!_ 😎
`;
    
    await this.reply(m.chat, antiDeleteMsg, deletedMsg, { mentions: [sender] });
    await this.copyNForward(m.chat, deletedMsg, false);
  }
}
