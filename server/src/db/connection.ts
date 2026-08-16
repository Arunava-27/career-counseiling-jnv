import { createClient, type Client } from "@libsql/client";
import { mkdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { SCHEMA_SQL } from "./schema.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.resolve(__dirname, "../../data");
mkdirSync(dataDir, { recursive: true });

// Local file by default (offline laptop use, zero setup) — set TURSO_DATABASE_URL (+
// TURSO_AUTH_TOKEN) to point at a hosted Turso database instead, for a shared/deployed
// instance. Same SQLite-compatible engine either way, so the schema and queries don't change.
const remoteUrl = process.env.TURSO_DATABASE_URL;
const client: Client = remoteUrl
  ? createClient({ url: remoteUrl, authToken: process.env.TURSO_AUTH_TOKEN })
  : createClient({ url: `file:${path.join(dataDir, "career-counseling.db")}` });

type SqlArg = string | number | bigint | boolean | null | Uint8Array;
type Row = Record<string, unknown>;

interface PreparedStatement {
  get(...args: SqlArg[]): Promise<Row | undefined>;
  all(...args: SqlArg[]): Promise<Row[]>;
  run(...args: SqlArg[]): Promise<{ lastInsertRowid: bigint | undefined; changes: number }>;
}

function prepare(sql: string): PreparedStatement {
  return {
    async get(...args) {
      const result = await client.execute({ sql, args });
      return result.rows[0] as Row | undefined;
    },
    async all(...args) {
      const result = await client.execute({ sql, args });
      return result.rows as unknown as Row[];
    },
    async run(...args) {
      const result = await client.execute({ sql, args });
      return { lastInsertRowid: result.lastInsertRowid, changes: result.rowsAffected };
    },
  };
}

export const db = {
  prepare,
  async exec(sql: string) {
    await client.executeMultiple(sql);
  },
};

async function addColumnIfMissing(table: string, column: string, type: string) {
  try {
    await db.exec(`ALTER TABLE ${table} ADD COLUMN ${column} ${type};`);
  } catch (err) {
    // SQLite/libSQL has no "ADD COLUMN IF NOT EXISTS" — ignore if it's already there
    // (a database that was created before this column existed and has since been migrated).
    if (!(err instanceof Error) || !/duplicate column/i.test(err.message)) {
      throw err;
    }
  }
}

await db.exec("PRAGMA foreign_keys = ON;");
await db.exec(SCHEMA_SQL);

// Additive migrations for databases created before a column was added to schema.ts above.
// CREATE TABLE IF NOT EXISTS only affects brand-new tables, so existing ones need this too.
await addColumnIfMissing("curriculum_topics", "min_class_level", "INTEGER");
await addColumnIfMissing("curriculum_topics", "max_class_level", "INTEGER");
await addColumnIfMissing("assessment_instruments", "min_class_level", "INTEGER");
await addColumnIfMissing("assessment_instruments", "max_class_level", "INTEGER");
await addColumnIfMissing("assessment_instruments", "student_label", "TEXT");
await addColumnIfMissing("participants", "class_name", "TEXT");
await addColumnIfMissing("participants", "section", "TEXT");
