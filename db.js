// db.js
const DB_NAME = "ChatDB";
const DB_VERSION = 1;
const STORE_NAME = "messages";

let db;

function openDB(callback) {
  const request = indexedDB.open(DB_NAME, DB_VERSION);

  request.onupgradeneeded = function(e) {
    db = e.target.result;
    if (!db.objectStoreNames.contains(STORE_NAME)) {
      db.createObjectStore(STORE_NAME, { keyPath: "id", autoIncrement: true });
    }
  };

  request.onsuccess = function(e) {
    db = e.target.result;
    if (callback) callback();
  };

  request.onerror = function(e) {
    console.error("DB error:", e.target.error);
  };
}

// Save message
function saveMessage(text) {
  const tx = db.transaction(STORE_NAME, "readwrite");
  tx.objectStore(STORE_NAME).add({ text, date: new Date() });
}

// Get all messages
function getMessages(callback) {
  const tx = db.transaction(STORE_NAME, "readonly");
  const store = tx.objectStore(STORE_NAME);
  const req = store.getAll();
  req.onsuccess = () => callback(req.result);
}

// Initialize
openDB();

window.saveMessage = saveMessage;
window.getMessages = getMessages;
