// Instead of opening a new database connection for every request, a connection pool:
// Keeps a set (pool) of ready-to-use connections
// Reuses them
// Improves performance
// Prevents too many open connections
//Pool is a collection of reusable PostgreSQL connections.

const { Pool } = require('pg');

const pool = new Pool({
  host: 'aws-1-ap-south-1.pooler.supabase.com',
  port: 6543,
  user: 'postgres.ckzvpiptwqkmyzgbfbrf',
  password: 'ABCroot$4004',   
  database: 'postgres',
  ssl: { rejectUnauthorized: false }
});

module.exports = pool;


