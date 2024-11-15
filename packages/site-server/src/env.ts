import * as path from 'node:path';
import * as dotenv from 'dotenv';

const envFile = process.env.NODE_ENV === 'production' ? '.env.production' : '.env.development';

dotenv.config({
    path: path.resolve(__dirname, `../${envFile}`)
});