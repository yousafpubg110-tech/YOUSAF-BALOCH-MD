export async function all(m) {
  let chat = global.db.data.chats[m.chat];
  
  if (m.chat.endsWith('status@broadcast')) {
    await this.readMessages([m.key]);
    
    let name = await this.getName(m.sender);
    
    console.log(`✅ Auto viewed status from: ${name}`);
  }
  
  return true;
}
