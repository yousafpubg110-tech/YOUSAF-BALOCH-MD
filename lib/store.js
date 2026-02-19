/*
╭━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╮
┃     YOUSAF-BALOCH-MD Message Store     ┃
┃        Created by MR YOUSAF BALOCH     ┃
╰━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━╯

📱 WhatsApp: +923710636110
📺 YouTube: https://www.youtube.com/@Yousaf_Baloch_Tech
🎵 TikTok: https://tiktok.com/@loser_boy.110
💻 GitHub: https://github.com/musakhanbaloch03-sad
🤖 Bot Repo: https://github.com/musakhanbaloch03-sad/YOUSAF-BALOCH-MD
📢 Channel: https://whatsapp.com/channel/0029Vb3Uzps6buMH2RvGef0j
*/

class MessageStore {
  constructor() {
    this.messages = new Map();
    this.contacts = new Map();
    this.chats = new Map();
    this.groupMetadata = new Map();
    this.presences = new Map();

    this.maxMessages = 1000;
    this.maxContacts = 5000;
    this.maxChats = 1000;
  }

  // Message methods
  saveMessage(jid, message) {
    if (!jid || !message?.key) return;

    if (!this.messages.has(jid)) {
      this.messages.set(jid, []);
    }

    const messages = this.messages.get(jid);
    messages.push({
      key: message.key,
      message: message.message,
      messageTimestamp: message.messageTimestamp,
    });

    if (messages.length > this.maxMessages) {
      messages.shift();
    }
  }

  getMessage(jid, id) {
    if (!jid || !id) return null;
    const messages = this.messages.get(jid);
    if (!messages) return null;
    return messages.find(msg => msg.key?.id === id) || null;
  }

  getMessages(jid, limit = 50) {
    const messages = this.messages.get(jid) || [];
    return messages.slice(-limit);
  }

  deleteMessage(jid, id) {
    const messages = this.messages.get(jid);
    if (!messages) return false;
    const index = messages.findIndex(msg => msg.key?.id === id);
    if (index !== -1) {
      messages.splice(index, 1);
      return true;
    }
    return false;
  }

  clearMessages(jid) {
    this.messages.delete(jid);
  }

  // Contact methods
  saveContact(jid, contact) {
    if (!jid) return;
    this.contacts.set(jid, {
      jid,
      name: contact.name || contact.notify || contact.verifiedName || jid.split('@')[0],
      notify: contact.notify || '',
      verifiedName: contact.verifiedName || '',
      imgUrl: contact.imgUrl || '',
      status: contact.status || '',
    });

    if (this.contacts.size > this.maxContacts) {
      const firstKey = this.contacts.keys().next().value;
      this.contacts.delete(firstKey);
    }
  }

  getContact(jid) {
    return this.contacts.get(jid) || null;
  }

  getAllContacts() {
    return Array.from(this.contacts.values());
  }

  // Chat methods
  saveChat(jid, chat) {
    if (!jid) return;
    this.chats.set(jid, {
      jid,
      name: chat.name || jid.split('@')[0],
      conversationTimestamp: chat.conversationTimestamp || Date.now(),
      unreadCount: chat.unreadCount || 0,
      archived: chat.archived || false,
      pinned: chat.pinned || false,
      muted: chat.muted || false,
    });

    if (this.chats.size > this.maxChats) {
      const firstKey = this.chats.keys().next().value;
      this.chats.delete(firstKey);
    }
  }

  getChat(jid) {
    return this.chats.get(jid) || null;
  }

  getAllChats() {
    return Array.from(this.chats.values());
  }

  // Group metadata methods
  saveGroupMetadata(jid, metadata) {
    if (!jid) return;
    this.groupMetadata.set(jid, {
      jid,
      subject: metadata.subject || '',
      owner: metadata.owner || '',
      creation: metadata.creation || Date.now(),
      desc: metadata.desc || '',
      descOwner: metadata.descOwner || '',
      descId: metadata.descId || '',
      restrict: metadata.restrict || false,
      announce: metadata.announce || false,
      participants: metadata.participants || [],
      size: metadata.participants?.length || 0,
    });
  }

  getGroupMetadata(jid) {
    return this.groupMetadata.get(jid) || null;
  }

  updateGroupParticipants(jid, participants) {
    const metadata = this.groupMetadata.get(jid);
    if (metadata) {
      metadata.participants = participants;
      metadata.size = participants.length;
    }
  }

  // Presence methods
  savePresence(jid, presence) {
    if (!jid) return;
    this.presences.set(jid, {
      jid,
      lastKnownPresence: presence.lastKnownPresence || 'unavailable',
      lastSeen: presence.lastSeen || Date.now(),
    });
  }

  getPresence(jid) {
    return this.presences.get(jid) || null;
  }

  // FIX: loadMessage returns full message object — index.js ka getMessage use karta hai
  async loadMessage(jid, id) {
    if (!jid || !id) return null;
    const found = this.getMessage(jid, id);
    return found || null;
  }

  clearAll() {
    this.messages.clear();
    this.contacts.clear();
    this.chats.clear();
    this.groupMetadata.clear();
    this.presences.clear();
  }

  getStats() {
    return {
      messages: this.messages.size,
      contacts: this.contacts.size,
      chats: this.chats.size,
      groups: this.groupMetadata.size,
      presences: this.presences.size,
    };
  }

  // FIX: bind method — all events properly handled with null checks
  bind(conn) {
    if (!conn?.ev) return;

    conn.ev.on('messages.upsert', ({ messages }) => {
      if (!Array.isArray(messages)) return;
      for (const msg of messages) {
        if (msg?.key?.remoteJid) {
          this.saveMessage(msg.key.remoteJid, msg);
        }
      }
    });

    conn.ev.on('messages.update', (updates) => {
      if (!Array.isArray(updates)) return;
      for (const update of updates) {
        if (update?.key?.remoteJid && update?.key?.id) {
          const existing = this.getMessage(update.key.remoteJid, update.key.id);
          if (existing) {
            Object.assign(existing, update);
          }
        }
      }
    });

    conn.ev.on('contacts.upsert', (contacts) => {
      if (!Array.isArray(contacts)) return;
      for (const contact of contacts) {
        if (contact?.id) this.saveContact(contact.id, contact);
      }
    });

    conn.ev.on('contacts.update', (contacts) => {
      if (!Array.isArray(contacts)) return;
      for (const contact of contacts) {
        if (contact?.id) this.saveContact(contact.id, contact);
      }
    });

    conn.ev.on('chats.upsert', (chats) => {
      if (!Array.isArray(chats)) return;
      for (const chat of chats) {
        if (chat?.id) this.saveChat(chat.id, chat);
      }
    });

    conn.ev.on('chats.update', (chats) => {
      if (!Array.isArray(chats)) return;
      for (const chat of chats) {
        if (chat?.id) {
          const existing = this.getChat(chat.id);
          if (existing) {
            this.saveChat(chat.id, { ...existing, ...chat });
          }
        }
      }
    });

    conn.ev.on('groups.upsert', (groups) => {
      if (!Array.isArray(groups)) return;
      for (const group of groups) {
        if (group?.id) this.saveGroupMetadata(group.id, group);
      }
    });

    conn.ev.on('groups.update', (groups) => {
      if (!Array.isArray(groups)) return;
      for (const group of groups) {
        if (group?.id) {
          const existing = this.getGroupMetadata(group.id);
          this.saveGroupMetadata(group.id, { ...(existing || {}), ...group });
        }
      }
    });

    conn.ev.on('group-participants.update', ({ id, participants, action }) => {
      if (!id || !participants) return;
      const metadata = this.getGroupMetadata(id);
      if (!metadata) return;

      if (action === 'add') {
        const newParticipants = participants.map(p => ({ id: p, admin: null }));
        metadata.participants = [...(metadata.participants || []), ...newParticipants];
      } else if (action === 'remove') {
        metadata.participants = (metadata.participants || []).filter(p => !participants.includes(p.id));
      } else if (action === 'promote') {
        metadata.participants = (metadata.participants || []).map(p =>
          participants.includes(p.id) ? { ...p, admin: 'admin' } : p
        );
      } else if (action === 'demote') {
        metadata.participants = (metadata.participants || []).map(p =>
          participants.includes(p.id) ? { ...p, admin: null } : p
        );
      }

      metadata.size = metadata.participants.length;
    });

    conn.ev.on('presence.update', ({ id, presences }) => {
      if (!presences) return;
      for (const [jid, presence] of Object.entries(presences)) {
        this.savePresence(jid, presence);
      }
    });
  }
}

export default new MessageStore();
