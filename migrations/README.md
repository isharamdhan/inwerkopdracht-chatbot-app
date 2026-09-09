# Migrations

The single source of truth for the database schema. `init.sql` is intentionally
empty — define the base tables here in `0001_init.sql`, and add one file per change
after that.

Migrations run every time the app starts, applying only what hasn't run yet. Each
applied file is recorded in the `schema_migrations` table, so nothing runs twice.

Prefer idempotent statements (`CREATE TABLE IF NOT EXISTS`, `ADD COLUMN IF NOT EXISTS`)
and never edit a migration once it has run — add a new one instead.

## Naming

Sequential, zero-padded, descriptive:

```
0001_add_message_index.sql
0002_add_session_archived_column.sql
```

## Add one

1. Create a new `.sql` file with the next number.
2. Write plain SQL (multiple statements allowed).
3. Restart the app (`docker compose up`) or run `npm run db:migrate` inside the container:
   `docker compose exec app npm run db:migrate`

## Example (`0002_add_message_index.sql`)

```sql
ALTER TABLE messages ADD INDEX idx_session (session_id);
```
