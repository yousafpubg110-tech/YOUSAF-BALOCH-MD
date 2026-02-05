import mongoose from 'mongoose';

const mongoDBUrl = process.env.MONGODB_URI || '';

export class mongoDB {
  constructor(url) {
    this.url = url;
    this.data = {};
    this._schema = {};
    this._model = {};
    this.db = mongoose.createConnection(this.url);
  }

  async read() {
    try {
      this.conn = await mongoose.connect(this.url, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      return this.conn;
    } catch (e) {
      console.error('MongoDB Connection Error:', e);
      return null;
    }
  }

  async write(data) {
    try {
      if (!data || typeof data !== 'object') return null;
      for (let key in data) {
        if (this._model[key]) {
          await this._model[key].replaceOne({ _id: key }, data[key], { upsert: true });
        }
      }
      return true;
    } catch (e) {
      console.error('MongoDB Write Error:', e);
      return null;
    }
  }
}

export class mongoDBV2 {
  constructor(url, options = { useNewUrlParser: true, useUnifiedTopology: true }) {
    this.url = url;
    this.options = options;
    this.data = {};
    this.lists = [];
    this.list = {};
    this.db = null;
  }

  async connect() {
    try {
      this.db = await mongoose.connect(this.url, this.options);
      console.log('✅ MongoDB Connected Successfully!');
      return this.db;
    } catch (e) {
      console.error('❌ MongoDB Connection Failed:', e);
      throw e;
    }
  }

  async save(collectionName, data) {
    try {
      if (!this.db) await this.connect();
      const Schema = new mongoose.Schema({
        data: Object
      }, {
        strict: false
      });
      const Model = mongoose.models[collectionName] || mongoose.model(collectionName, Schema);
      const doc = new Model({ data });
      await doc.save();
      return doc;
    } catch (e) {
      console.error('MongoDB Save Error:', e);
      return null;
    }
  }

  async find(collectionName, query = {}) {
    try {
      if (!this.db) await this.connect();
      const Schema = new mongoose.Schema({
        data: Object
      }, {
        strict: false
      });
      const Model = mongoose.models[collectionName] || mongoose.model(collectionName, Schema);
      return await Model.find(query);
    } catch (e) {
      console.error('MongoDB Find Error:', e);
      return [];
    }
  }

  async delete(collectionName, query = {}) {
    try {
      if (!this.db) await this.connect();
      const Schema = new mongoose.Schema({
        data: Object
      }, {
        strict: false
      });
      const Model = mongoose.models[collectionName] || mongoose.model(collectionName, Schema);
      return await Model.deleteMany(query);
    } catch (e) {
      console.error('MongoDB Delete Error:', e);
      return null;
    }
  }
}

export default { mongoDB, mongoDBV2 };
