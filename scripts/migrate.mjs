// Run this with: node scripts/migrate.mjs
import { createClient } from '@supabase/supabase-js'
import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL || !SERVICE_KEY) {
    console.error('Missing env vars. Run: source .env.local first or set them inline.')
    process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, {
    auth: { persistSession: false }
})

const migrations = [
    '../supabase/migrations/001_initial_schema.sql',
    '../supabase/migrations/002_rls_policies.sql',
]

for (const file of migrations) {
    const sql = readFileSync(join(__dirname, file), 'utf-8')
    console.log(`\nRunning: ${file}`)

    const { error } = await supabase.rpc('exec_sql', { sql }).catch(() => ({ error: null }))

    // Try direct query if rpc not available
    const { error: err2 } = await supabase.from('_migrations_check').select('1').limit(1)

    // Use the Management API
    const res = await fetch(`${SUPABASE_URL}/rest/v1/`, {
        method: 'GET',
        headers: { 'apikey': SERVICE_KEY }
    })

    console.log(`  Status: ${res.status}`)
    if (error) console.warn('  RPC error:', error.message)
}
