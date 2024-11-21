import * as fs from 'node:fs'
import { Injectable } from '@nestjs/common';
import { INotes } from './notes.interface';

const NOTES_ROOT_DIR = process.env.NOTES_ROOT_DIR

@Injectable()
export class NotesService {
    private genPath(title: string) {
        return `${NOTES_ROOT_DIR}/${title}.md`
    }

    private parseTitle(title: string) {
        const lastIndex = title.lastIndexOf('.')
        return title.slice(0, lastIndex)
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

        return files.filter(file => file.endsWith('.md')).map((file, index) => {
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
