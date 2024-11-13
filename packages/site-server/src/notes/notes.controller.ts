import { Controller, Get, HttpException, HttpStatus } from '@nestjs/common';
import { NotesService } from './notes.service';
import { withBaseUrl } from 'src/utils';

@Controller(withBaseUrl('notes'))
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    /**
     * 获取笔记列表
     */
    @Get('/list')
    async getList() {
        try {
            const list = await this.notesService.getList();
            return list;
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
