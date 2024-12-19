import { Controller, Get, HttpStatus, Post } from '@nestjs/common';
import { AppService } from './app.service';
import { API_BASE_URL } from './constants';
import ResponseDto from './dto';

@Controller(API_BASE_URL)
export class AppController {
    constructor(private readonly appService: AppService) {}

    @Get()
    default() {
        return this.appService.default();
    }

    @Post('pv')
    pv() {
        const pv = this.appService.pv();

        return new ResponseDto(pv);
    }

}
