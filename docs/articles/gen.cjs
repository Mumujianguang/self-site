const fs = require('fs');
const path = require('path');

const ROOT_DIR = path.resolve(__dirname);

const files = fs.readdirSync(ROOT_DIR);
const metaJson = fs.readFileSync(path.resolve(ROOT_DIR, './meta.json'));
const meta = JSON.parse(metaJson);

const mdFiles = files.filter(file => {
    if (file.endsWith('.md')) {
        return true
    }

    if (fs.existsSync(path.resolve(ROOT_DIR, file, 'index.md'))) {
        return true
    }

    return false
});

mdFiles.forEach((file) => {
    const fileName = file.replace('.md', '');
    console.log(fileName)

    if (!meta[fileName]) {
        meta[fileName] = {
            summary: '',
            createTime: "2024-10-08 13:14:49",
        }
    }
})

console.log(meta)

fs.writeFileSync(path.resolve(ROOT_DIR, './meta.json'), JSON.stringify(meta, null, 4));