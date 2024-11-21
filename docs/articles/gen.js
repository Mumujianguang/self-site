const fs = require('fs');

const files = fs.readdirSync('./');
const metaJson = fs.readFileSync('./meta.json');
const meta = JSON.parse(metaJson);

const mdFiles = files.filter(file => file.endsWith('.md'));

mdFiles.forEach((file) => {
    const fileName = file.replace('.md', '');
    if (!meta[fileName]) {
        meta[fileName] = {
            summary: ''
        }
    }
})

fs.writeFileSync('./meta.json', JSON.stringify(meta, null, 4));