import Database from 'better-sqlite3';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const db = new Database(path.join(__dirname, 'noor.db'));

db.exec(`
  CREATE TABLE IF NOT EXISTS tokens (
    token TEXT PRIMARY KEY,
    created_at INTEGER
  )
`);

const insertToken = db.prepare(
  'INSERT OR IGNORE INTO tokens (token, created_at) VALUES (?, ?)'
);
const selectAllTokens = db.prepare('SELECT token FROM tokens');

export function saveToken(token) {
  insertToken.run(token, Date.now());
}

export function getAllTokens() {
  return selectAllTokens.all().map((row) => row.token);
}
