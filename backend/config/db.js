import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, '..', 'data');
const DB_FILE = path.join(DATA_DIR, 'unisphere_db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

let dbMemory = null;

// Default empty schema collections
const defaultSchema = {
  users: [],
  clubs: [],
  requests: [],
  events: [],
  registrations: [],
  certificates: [],
  albums: [],
  volunteerLogs: [],
  feedbacks: [],
  notifications: []
};

// Load database from file into memory
export const loadDB = () => {
  if (dbMemory) return dbMemory;

  if (fs.existsSync(DB_FILE)) {
    try {
      const data = fs.readFileSync(DB_FILE, 'utf-8');
      dbMemory = { ...defaultSchema, ...JSON.parse(data) };
      return dbMemory;
    } catch (err) {
      console.error('Error reading database file, resetting to defaults:', err);
    }
  }

  dbMemory = { ...defaultSchema };
  saveDB(dbMemory);
  return dbMemory;
};

// Save memory database to file
export const saveDB = (data) => {
  dbMemory = data || dbMemory;
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(dbMemory, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving database to file:', err);
  }
};

// Generic Collection Repository Helpers
export const getCollection = (collectionName) => {
  const db = loadDB();
  return db[collectionName] || [];
};

export const saveCollection = (collectionName, items) => {
  const db = loadDB();
  db[collectionName] = items;
  saveDB(db);
  return items;
};

export const findById = (collectionName, id) => {
  const items = getCollection(collectionName);
  return items.find((item) => item.id === id || item._id === id);
};

export const findOne = (collectionName, predicate) => {
  const items = getCollection(collectionName);
  return items.find(predicate);
};

export const find = (collectionName, predicate = () => true) => {
  const items = getCollection(collectionName);
  return items.filter(predicate);
};

export const insertOne = (collectionName, item) => {
  const items = getCollection(collectionName);
  const newItem = {
    id: item.id || `${collectionName.slice(0, 3)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    createdAt: new Date().toISOString(),
    ...item
  };
  items.unshift(newItem);
  saveCollection(collectionName, items);
  return newItem;
};

export const updateById = (collectionName, id, updates) => {
  const items = getCollection(collectionName);
  let updatedItem = null;
  const newItems = items.map((item) => {
    if (item.id === id || item._id === id) {
      updatedItem = { ...item, ...updates, updatedAt: new Date().toISOString() };
      return updatedItem;
    }
    return item;
  });
  saveCollection(collectionName, newItems);
  return updatedItem;
};

export const deleteById = (collectionName, id) => {
  const items = getCollection(collectionName);
  const newItems = items.filter((item) => item.id !== id && item._id !== id);
  saveCollection(collectionName, newItems);
  return newItems;
};
