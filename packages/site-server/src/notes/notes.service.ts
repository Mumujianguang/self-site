import * as fs from 'node:fs'
import * as path from 'node:path'
import { Injectable } from '@nestjs/common';
import { INotes } from './notes.interface';

const NOTES_ROOT_DIR = process.env.NOTES_ROOT_DIR

@Injectable()
export class NotesService {
    private genPath(title: string) {
        if (fs.existsSync(path.resolve(NOTES_ROOT_DIR, title, 'index.md'))) {
            return `${NOTES_ROOT_DIR}/${title}/index.md`;
        }

        return `${NOTES_ROOT_DIR}/${title}.md`
    }

    private parseTitle(title: string) {
        if (title.endsWith('.md')) {
            const lastIndex = title.lastIndexOf('.')
            return title.slice(0, lastIndex)
        }
        
        return title
    }

    private async getMetaJson() {
        const json = await fs.promises.readFile(`${NOTES_ROOT_DIR}/meta.json`, 'utf-8')
        return JSON.parse(json)
    }

    /**
     * 获取笔记列表
     * @returns
     */
    public async getList(): Promise<INotes['list']> {
        const files = await fs.promises.readdir(NOTES_ROOT_DIR)

        return files.filter(file => {
            if (file.endsWith('.md')) {
                return true;
            }

            if (fs.existsSync(path.resolve(NOTES_ROOT_DIR, file, 'index.md'))) {
                return true;
            }

            return false;
        }).map((file, index) => {
            const title = this.parseTitle(file)

            return {
                id: String(index + 1),
                title
            }
        })
    }

    /**
     * 获取笔记详情列表
     * @returns 
     */
    public async getDetailList(): Promise<INotes['detailList']> {
        const list = await this.getList()
        const metaJson = await this.getMetaJson()
        console.log(list)
        const detailList = await Promise.all(list.map(async item => {
            const content =  await fs.promises.readFile(this.genPath(item.title), 'utf-8')
            const summary = metaJson[item.title]?.summary || content.slice(0, 300)

            return {
                ...item,
                content,
                summary
            }
        }))

        return detailList
    }

    /**
     * 获取笔记
     * @param title
     */
    public async getNote(title: string): Promise<string> {
        const notes = await this.getList()

        const note = notes.find(item => item.title === title)
        if (!note) {
            throw new Error(`笔记不存在: [${title}]`)
        }

        const content = await fs.promises.readFile(this.genPath(title), 'utf-8')
        return content
    }
}
