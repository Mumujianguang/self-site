import { Injectable } from '@nestjs/common';
import { INotes } from './notes.interface';

@Injectable()
export class NotesService {
    public async getList(): Promise<INotes['list']> {
        return []
    }
}
