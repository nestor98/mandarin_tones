import Dexie from 'dexie';

export const db = new Dexie('tonePracticeDB');
db.version(1).stores({
  stats: '++id, date, correct, total',
});
