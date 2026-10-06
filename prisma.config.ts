import {config as loadEnv} from 'dotenv';
import {defineConfig,env} from 'prisma/config';
loadEnv({path:'.env.local'});
export default defineConfig({schema:'prisma/schema.prisma',migrations:{path:'prisma/migrations'},datasource:{url:process.env.PRISMA_MIGRATION_URL||env('DATABASE_URL')}});
