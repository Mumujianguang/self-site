import ResponseDto from "src/dto";
import { INotes } from "./notes.interface";
import { ApiProperty } from "@nestjs/swagger";

/**
 * response of notes list
 */
export class NotesListResponse extends ResponseDto<INotes['list']> {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            required: ['id', 'title'],
            properties: {
                id: { type: 'string' },
                icon: { type: 'string' },
                title: { type: 'string' },
            }
        },
        description: '笔记列表'
    })
    public data: INotes['list'];
}

/**
 * response of notes detail list
 */
export class NotesDetailListResponse extends ResponseDto<INotes['detailList']> {
    @ApiProperty({
        type: 'array',
        items: {
            type: 'object',
            required: ['id', 'title', 'content', 'summary'],
            properties: {
                id: { type: 'string' },
                icon: { type: 'string' },
                title: { type: 'string' },
                content: { type: 'string' },
                summary: { type: 'string' }
            }
        },
        description: '笔记详情列表'
    })
    public data: INotes['detailList'];
}

/**
 * response of notes detail
 */
export class NotesDetailResponse extends ResponseDto<string> {
    @ApiProperty({
        type: 'string',
        description: '笔记内容'
    })
    public data: string;
}