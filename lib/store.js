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

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

class MessageStore {
  constructor() {
    this.messages = new Map();
    this.contacts = new Map();
    this.chats = new Map();
    this.groupMetadata = new Map();
    this.presences = new Map();
    
    // Store limits
    this.maxMessages = 1000;
    this.maxContacts = 5000;
    this.maxChats = 1000;
  }

  // Message methods
  saveMessage(jid, message) {
    if (!this.messages.has(jid)) {
      this.messages.set(jid, []);
    }

    const messages = this.messages.get(jid);
    messages.push({
      key: message.key,
      message: message.message,
      messageTimestamp: message.messageTimestamp
    });

    // Limit message storage
    if (messages.length > this.maxMessages) {
      messages.shift();
    }
  }

  getMessage(jid, id) {
    const messages = this.messages.get(jid);
    if (!messages) return null;

    return messages.find(msg => msg.key.id === id);
  }

  getMessages(jid, limit = 50) {
    const messages = this.messages.get(jid) || [];
    return messages.slice(-limit);
  }

  deleteMessage(jid, id) {
    const messages = this.messages.get(jid);
    if (!messages) return false;

    const index = messages.findIndex(msg => msg.key.id === id);
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
    this.contacts.set(jid, {
      jid,
      name: contact.name || contact.notify || contact.verifiedName || jid.split('@')[0],
      notify: contact.notify,
      verifiedName: contact.verifiedName,
      imgUrl: contact.imgUrl,
      status: contact.status
    });

    // Limit contact storage
    if (this.contacts.size > this.maxContacts) {
      const firstKey = this.contacts.keys().next().value;
      this.contacts.delete(firstKey);
    }
  }

  getContact(jid) {
    return this.contacts.get(jid);
  }

  getAllContacts() {
    return Array.from(this.contacts.values());
  }

  // Chat methods
  saveChat(jid, chat) {
    this.chats.set(jid, {
      jid,
      name: chat.name || jid.split('@')[0],
      conversationTimestamp: chat.conversationTimestamp,
      unreadCount: chat.unreadCount || 0,
      archived: chat.archived || false,
      pinned: chat.pinned || false,
      muted: chat.muted || false
    });

    // Limit chat storage
    if (this.chats.size > this.maxChats) {
      const firstKey = this.chats.keys().next().value;
      this.chats.delete(firstKey);
    }
  }

  getChat(jid) {
    return this.chats.get(jid);
  }

  getAllChats() {
    return Array.from(this.chats.values());
  }

  // Group metadata methods
  saveGroupMetadata(jid, metadata) {
    this.groupMetadata.set(jid, {
      jid,
      subject: metadata.subject,
      owner: metadata.owner,
      creation: metadata.creation,
      desc: metadata.desc,
      descOwner: metadata.descOwner,
      descId: metadata.descId,
      restrict: metadata.restrict,
      announce: metadata.announce,
      participants: metadata.participants,
      size: metadata.participants?.length || 0
    });
  }

  getGroupMetadata(jid) {
    return this.groupMetadata.get(jid);
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
    this.presences.set(jid, {
      jid,
      lastKnownPresence: presence.lastKnownPresence,
      lastSeen: presence.lastSeen || Date.now()
    });
  }

  getPresence(jid) {
    return this.presences.get(jid);
  }

  // Load message from key
  async loadMessage(jid, id) {
    const message = this.getMessage(jid, id);
    return message?.message;
  }

  // Clear all data
  clearAll() {
    this.messages.clear();
    this.contacts.clear();
    this.chats.clear();
    this.groupMetadata.clear();
    this.presences.clear();
  }

  // Get store stats
  getStats() {
    return {
      messages: this.messages.size,
      contacts: this.contacts.size,
      chats: this.chats.size,
      groups: this.groupMetadata.size,
      presences: this.presences.size
    };
  }

  // Bind to connection
  bind(conn) {
    conn.ev.on('messages.upsert', ({ messages }) => {
      for (const msg of messages) {
        if (msg.key && msg.key.remoteJid) {
          this.saveMessage(msg.key.remoteJid, msg);
        }
      }
    });

    conn.ev.on('contacts.update', (contacts) => {
      for (const contact of contacts) {
        if (contact.id) {
          this.saveContact(contact.id, contact);
        }
      }
    });

    conn.ev.on('chats.upsert', (chats) => {
      for (const chat of chats) {
        if (chat.id) {
          this.saveChat(chat.id, chat);
        }
      }
    });

    conn.ev.on('groups.update', (groups) => {
      for (const group of groups) {
        if (group.id) {
          const existing = this.getGroupMetadata(group.id);
          if (existing) {
            this.saveGroupMetadata(group.id, { ...existing, ...group });
          }
        }
      }
    });

    conn.ev.on('presence.update', ({ id, presences }) => {
      for (const [jid, presence] of Object.entries(presences)) {
        this.savePresence(jid, presence);
      }
    });
  }
}

export default new MessageStore();
