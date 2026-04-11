const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');
const { Pool } = require('pg');
const { postgresUrl } = require('./env');

const pool = new Pool({
	connectionString: postgresUrl
});

const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({
	adapter
});

module.exports = prisma;