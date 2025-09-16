// api/contacts.js — Vercel Serverless Function (Node.js)
import { neon } from '@neondatabase/serverless';

export default async function handler(req, res) {
try {
const sql = neon(process.env.DATABASE_URL);

if (req.method === 'GET') {
const rows = await sql`SELECT id, nom, email, message, date_envoi
FROM contacts
ORDER BY date_envoi DESC
LIMIT 200`;
return res.status(200).json(rows);
}

if (req.method === 'POST') {
const { nom, email, message } = req.body || {};
if (!nom || !email || !message) {
return res.status(400).json({ error: 'Champs requis: nom, email, message' });
}
await sql`INSERT INTO contacts (nom, email, message)
VALUES (${nom}, ${email}, ${message})`;
return res.status(200).json({ ok: true });
}

if (req.method === 'OPTIONS') {
res.setHeader('Access-Control-Allow-Methods', 'GET,POST,OPTIONS');
res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
return res.status(200).end();
}

return res.status(405).json({ error: 'Method not allowed' });
} catch (e) {
console.error(e);
return res.status(500).json({ error: 'Erreur serveur' });
}
}
