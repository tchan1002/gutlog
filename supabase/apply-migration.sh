#!/bin/bash

# GutLog Database Migration Helper
# This script applies the initial schema migration to Supabase

set -e

PROJECT_REF="iolenyutbulfpgikfsfi"
MIGRATION_FILE="./migrations/20260403_initial_schema.sql"

echo "GutLog Database Migration"
echo "========================="
echo ""

# Check if migration file exists
if [ ! -f "$MIGRATION_FILE" ]; then
    echo "Error: Migration file not found at $MIGRATION_FILE"
    exit 1
fi

# Check if SUPABASE_ACCESS_TOKEN is set
if [ -z "$SUPABASE_ACCESS_TOKEN" ]; then
    echo "Error: SUPABASE_ACCESS_TOKEN environment variable is not set."
    echo ""
    echo "Please follow these steps:"
    echo "1. Go to https://supabase.com/dashboard/account/tokens"
    echo "2. Generate a new access token"
    echo "3. Run: export SUPABASE_ACCESS_TOKEN=\"your-token-here\""
    echo "4. Run this script again"
    exit 1
fi

echo "Checking Supabase CLI..."
if ! command -v supabase &> /dev/null; then
    echo "Error: Supabase CLI is not installed."
    echo "Install it with: brew install supabase/tap/supabase"
    exit 1
fi

echo "Supabase CLI found: $(supabase --version)"
echo ""

echo "Linking to project $PROJECT_REF..."
supabase link --project-ref "$PROJECT_REF"
echo ""

echo "Applying migration..."
supabase db execute --file "$MIGRATION_FILE"
echo ""

echo "Migration applied successfully!"
echo ""

echo "Verifying tables..."
supabase db execute --query "
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'food_library' as table_name, COUNT(*) as record_count FROM food_library
UNION ALL
SELECT 'food_logs' as table_name, COUNT(*) as record_count FROM food_logs
UNION ALL
SELECT 'gut_logs' as table_name, COUNT(*) as record_count FROM gut_logs;
"

echo ""
echo "Setup complete! Your database is ready to use."
