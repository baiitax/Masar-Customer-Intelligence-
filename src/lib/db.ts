import {PrismaPg} from '@prisma/adapter-pg';
import {PrismaClient} from '@prisma/client';
const globalForPrisma=globalThis as unknown as {prisma?:PrismaClient};
function createClient(){const raw=process.env.DATABASE_URL;if(!raw)throw new Error('DATABASE_URL is not configured');const url=new URL(raw);url.searchParams.delete('sslmode');url.searchParams.delete('pgbouncer');const adapter=new PrismaPg({connectionString:url.toString(),ssl:{rejectUnauthorized:false}});return new PrismaClient({adapter});}
export const db=globalForPrisma.prisma??createClient();
if(process.env.NODE_ENV!=='production')globalForPrisma.prisma=db;
