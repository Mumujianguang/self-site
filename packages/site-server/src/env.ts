import * as path from 'node:path';
import * as dotenv from 'dotenv';

console.log(process.env.NODE_ENV)
const envFile = process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production';

dotenv.config({
    path: path.resolve(__dirname, `../${envFile}`)
});