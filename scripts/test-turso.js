import { createClient } from '@libsql/client';

const url = process.env.VITE_TURSO_DATABASE_URL || process.env.TURSO_DATABASE_URL;
const authToken = process.env.VITE_TURSO_AUTH_TOKEN || process.env.TURSO_AUTH_TOKEN;

console.log('----------------------------------------------------');
console.log('🧪 TESTE DE CONEXÃO AO BANCO DE DADOS TURSO (libSQL)');
console.log('----------------------------------------------------');

if (!url || !authToken) {
  console.log('⚠️ STATUS: Nenhuma variável de ambiente encontrada para o Turso.');
  console.log('ℹ️ Para testar a conexão real com o seu banco Turso na nuvem, execute:');
  console.log('   $env:VITE_TURSO_DATABASE_URL="libsql://seu-banco.turso.io"');
  console.log('   $env:VITE_TURSO_AUTH_TOKEN="seu-token"');
  console.log('   node scripts/test-turso.js');
  process.exit(0);
}

async function testConnection() {
  console.log(`🔌 Conectando ao Turso em: ${url}...`);
  const client = createClient({ url, authToken });

  try {
    const ping = await client.execute('SELECT 1 as connected');
    console.log('✅ CONEXÃO COM TURSO ESTABELECIDA COM SUCESSO! (Ping OK)');

    // Test tables
    try {
      const manualsRes = await client.execute('SELECT COUNT(*) as count FROM manuals');
      console.log(`📊 Tabela 'manuals': ${manualsRes.rows[0].count} registro(s)`);
    } catch (e) {
      console.log('⚠️ Tabela "manuals" ainda não criada. Execute schema.sql no Turso.');
    }

    try {
      const brandsRes = await client.execute('SELECT COUNT(*) as count FROM brands');
      console.log(`🏷️ Tabela 'brands': ${brandsRes.rows[0].count} marca(s)`);
    } catch (e) {
      console.log('⚠️ Tabela "brands" ainda não criada.');
    }

    try {
      const catRes = await client.execute('SELECT COUNT(*) as count FROM categories');
      console.log(`📂 Tabela 'categories': ${catRes.rows[0].count} categoria(s)`);
    } catch (e) {
      console.log('⚠️ Tabela "categories" ainda não criada.');
    }

    console.log('----------------------------------------------------');
    console.log('🎉 Teste concluído com sucesso!');
  } catch (err) {
    console.error('❌ FALHA NA CONEXÃO COM O TURSO:', err.message);
  }
}

testConnection();
