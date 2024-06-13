import { openDB } from 'idb';

const DATABASE_NAME = 'myfreetunes-db';
const DATABASE_VERSION = 1;
const OBJECT_STORE_NAME = 'audio';

function getIndexedDB() {
  if (typeof window !== 'undefined') {
    return window.indexedDB;
  }
  return null;
}

async function initDB() {
  if (!getIndexedDB()) {
    console.log('IndexedDB is not supported');
    return;
  }

  const dbPromise = openDB(DATABASE_NAME, DATABASE_VERSION, {
    upgrade(database) {
      database.createObjectStore(OBJECT_STORE_NAME, { keyPath: 'id' });
    },
  });

  return dbPromise;
}

const OfflineAudioIdb = {
  async getSong(id) {
    if (!id) {
      return;
    }

    return (await initDB()).get(OBJECT_STORE_NAME, id);
  },

  async getAllSongs() {
    return (await initDB()).getAll(OBJECT_STORE_NAME);
  },

  async getNumbersOfOfflineSongs() {
    return (await (await initDB()).getAll(OBJECT_STORE_NAME)).length;
  },

  async putSong(song) {
    if (!song.hasOwnProperty('id')) {
      return;
    }

    return (await initDB()).put(OBJECT_STORE_NAME, song);
  },

  async deleteSong(id) {
    return (await initDB()).delete(OBJECT_STORE_NAME, id);
  },
};

export default OfflineAudioIdb;
