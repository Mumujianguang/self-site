import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';
import { API_BASE_URL } from './constants';

@Controller(API_BASE_URL)
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    default(): string {
        return this.appService.default();
    }
}
