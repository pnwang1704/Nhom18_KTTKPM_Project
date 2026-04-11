const { Pool } = require('pg');
const { postgresUrl } = require('./env');

const pool = new Pool({
  connectionString: postgresUrl
});

module.exports = pool;