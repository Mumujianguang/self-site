import { ApiResponse } from '@nestjs/swagger';
import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { withBaseUrl } from 'src/utils';
import { NotesService } from './notes.service';
import { NotesDetailListResponse, NotesDetailResponse, NotesListResponse } from './notes.dto';

@Controller(withBaseUrl('notes'))
export class NotesController {
    constructor(private readonly notesService: NotesService) {}

    /**
     * 获取笔记列表
     */
    @Get('/list')
    @ApiResponse({
        status: HttpStatus.OK,
        description: '笔记列表',
        type: NotesListResponse
    })
    async getList(): Promise<NotesListResponse> {
        try {
            const list = await this.notesService.getList();
            
            return new NotesListResponse(list);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @Get('/detailList')
    @ApiResponse({
        status: HttpStatus.OK,
        description: '笔记详情列表',
        type: NotesDetailListResponse
    })
    async getDetailList(): Promise<NotesDetailListResponse> {
        try {
            const list = await this.notesService.getDetailList();

            return new NotesDetailListResponse(list);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR)
        }
    }

    /**
     * 获取笔记详情
     * @param title 
     * @returns 
     */
    @Get('/detail')
    @ApiResponse({
        status: HttpStatus.OK,
        description: '笔记详情',
        type: NotesDetailResponse
    })
    async getNote(@Query('title') title: string): Promise<NotesDetailResponse> {
        try {
            const note = await this.notesService.getNote(title);

            return new NotesDetailResponse(note);
        } catch (error) {
            throw new HttpException(error.message, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}
