
import * as path from "node:path"
import { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { $ } from "execa";

const __dirname = dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, '../');

(async () => {
    await $`rm -rf ${ROOT}/dist`;
    await $`mkdir ${ROOT}/dist`;
    await $`mkdir ${ROOT}/dist/server`;

    // fe
    await $`mv ${ROOT}/packages/site-fe/dist ${ROOT}/dist/fe`;

    // server
    await $`mv ${ROOT}/packages/site-server/dist/ ${ROOT}/dist/server/dist/`;
    await $`cp ${ROOT}/packages/site-server/.env.production ${ROOT}/dist/server`;
    await $`cp ${ROOT}/packages/site-server/package.json ${ROOT}/dist/server`;

    await $`cp -r ${ROOT}docs ${ROOT}dist`;
})()
