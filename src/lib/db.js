import { createClient } from '@supabase/supabase-js'

export function getClient() {
    return createClient(process.env.SUPABASE_PRJ_URL, process.env.SUPABASE_ANON_KEY)
}
