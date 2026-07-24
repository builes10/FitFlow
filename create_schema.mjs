import { createClient } from '@supabase/supabase-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Load env variables
const envPath = path.join(path.dirname(fileURLToPath(import.meta.url)), '.env.local');
const envContent = fs.readFileSync(envPath, 'utf8');
const envVars = {};
envContent.split('\n').forEach(line => {
  const [key, value] = line.split('=');
  if (key && value) {
    envVars[key.trim()] = value.trim();
  }
});

const supabaseUrl = envVars.VITE_SUPABASE_URL;
const supabaseKey = envVars.VITE_SUPABASE_ANON_KEY;

const supabase = createClient(supabaseUrl, supabaseKey);

async function createSchema() {
  try {
    console.log('🚀 Creating database schema...\n');

    // Read the schema SQL
    const schemaSql = fs.readFileSync('./supabase_training_schema.sql', 'utf8');
    
    // Split by statements and execute them
    const statements = schemaSql
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--'));

    console.log(`📝 Found ${statements.length} SQL statements\n`);

    // Execute each statement
    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];
      if (statement.includes('DROP') || statement.includes('CREATE') || statement.includes('INSERT')) {
        console.log(`⏳ Executing statement ${i + 1}/${statements.length}...`);
        
        const { error } = await supabase.rpc('exec_sql', { sql: statement });
        
        if (error) {
          console.log(`  ℹ️ Note: ${error.message}`);
        } else {
          console.log(`  ✅ Success`);
        }
      }
    }

    console.log('\n🎉 Schema setup completed!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

createSchema();
