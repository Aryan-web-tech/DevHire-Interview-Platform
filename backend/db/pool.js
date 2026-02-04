// Instead of opening a new database connection for every request, a connection pool:
// Keeps a set (pool) of ready-to-use connections
// Reuses them
// Improves performance
// Prevents too many open connections
//Pool is a collection of reusable PostgreSQL connections.

import pkg from "pg";
const { Pool } = pkg;

const pool = new Pool({
  host: 'db.ckzvpiptwqkmyzgbfbrf.supabase.co',
  port: 5432,
  user: 'postgres',
  password: 'ABCroot$4004',   // PUT YOUR PASSWORD HERE DIRECTLY
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;


