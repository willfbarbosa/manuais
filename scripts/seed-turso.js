import { createClient } from '@libsql/client';
import fs from 'fs';
import path from 'path';

const url = process.env.VITE_TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN;

if (!url || !authToken) {
  console.error('❌ Erro: Defina VITE_TURSO_DATABASE_URL e VITE_TURSO_AUTH_TOKEN nas suas variáveis de ambiente.');
  process.exit(1);
}

const client = createClient({ url, authToken });

async function main() {
  console.log('🚀 Inicializando esquema do Turso DB...');
  const schemaSql = fs.readFileSync(path.join(process.cwd(), 'schema.sql'), 'utf-8');
  
  // Split statements by semicolon
  const statements = schemaSql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0);

  for (const stmt of statements) {
    try {
      await client.execute(stmt);
    } catch (err) {
      console.warn('⚠️ Nota na execução:', err.message);
    }
  }

  console.log('✅ Esquema e marcas padrão inseridos no Turso com sucesso!');
}

main().catch(err => {
  console.error('❌ Erro ao popular banco:', err);
  process.exit(1);
});
