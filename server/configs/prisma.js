import { Pool, neonConfig } from '@neondatabase/serverless';
import { PrismaNeon } from '@prisma/adapter-neon';
import { PrismaClient } from '@prisma/client';
import ws from 'ws';

// Required for neon serverless connections from Node.js environments
neonConfig.webSocketConstructor = ws;

const connectionString = process.env.DATABASE_URL;

// Initialize the Prisma Client utilizing the Neon Adapter
const pool = new Pool({ connectionString });
const adapter = new PrismaNeon(pool);
const prisma = new PrismaClient({ adapter });

export default prisma;