import * as fs from 'node:fs'
import { Injectable } from '@nestjs/common';
import { INotes } from './notes.interface';

const NOTES_ROOT_DIR = process.env.NOTES_ROOT_DIR

@Injectable()
export class NotesService {
    /**
     * 获取笔记列表
     * @returns
     */
    public async getList(): Promise<INotes['list']> {
        const files = await fs.promises.readdir(NOTES_ROOT_DIR)

        return files.map((file, index) => {
            const [title] = file.split('.')

            return {
                id: String(index + 1),
                title
            }
        })
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

        return fs.promises.readFile(`${NOTES_ROOT_DIR}/${title}.md`, 'utf-8')
    }
}
