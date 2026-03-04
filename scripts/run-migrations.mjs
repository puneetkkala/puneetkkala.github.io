#!/usr/bin/env node
/**
 * Runs SQL migrations using Supabase's pg-meta endpoint (available with service role key).
 * Run: node scripts/run-migrations.mjs
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))

// Parse .env.local
const envContent = readFileSync(join(__dirname, '../.env.local'), 'utf-8')
const env = Object.fromEntries(
    envContent.split('\n')
        .filter(l => l.includes('=') && !l.startsWith('#'))
        .map(l => { const [k, ...v] = l.split('='); return [k.trim(), v.join('=').trim()] })
)

const SUPABASE_URL = env['NEXT_PUBLIC_SUPABASE_URL']
const SERVICE_KEY = env['SUPABASE_SERVICE_ROLE_KEY']
const PROJECT_REF = SUPABASE_URL.replace('https://', '').split('.')[0]

console.log(`▶ Project: ${PROJECT_REF}`)

async function runSQL(sql, label) {
    console.log(`\nRunning: ${label}`)

    // Supabase's internal pg-meta API, available via the anon/service role on the project's pg-meta endpoint
    const url = `${SUPABASE_URL}/pg-meta/v1/query`
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'apikey': SERVICE_KEY,
            'Authorization': `Bearer ${SERVICE_KEY}`,
        },
        body: JSON.stringify({ query: sql }),
    })

    const body = await res.text()
    if (res.ok) {
        console.log(`  ✅ ${label} — Success`)
        return true
    } else {
        console.log(`  ❌ Status ${res.status}: ${body.substring(0, 300)}`)
        return false
    }
}

const migrations = [
    { file: '../supabase/migrations/001_initial_schema.sql', label: '001_initial_schema' },
    { file: '../supabase/migrations/002_rls_policies.sql', label: '002_rls_policies' },
]

let allOk = true
for (const { file, label } of migrations) {
    const sql = readFileSync(join(__dirname, file), 'utf-8')
    const ok = await runSQL(sql, label)
    if (!ok) { allOk = false; break }
}

if (!allOk) {
    console.log(`
── MANUAL MIGRATION REQUIRED ─────────────────────────────────────
Open the Supabase SQL Editor and run the two migration files:
  https://supabase.com/dashboard/project/${PROJECT_REF}/sql/new

Files to run (in order):
  1. supabase/migrations/001_initial_schema.sql
  2. supabase/migrations/002_rls_policies.sql
──────────────────────────────────────────────────────────────────
`)
}
