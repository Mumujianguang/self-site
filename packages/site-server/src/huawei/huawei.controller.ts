import { Body, Controller, Get, HttpException, HttpStatus, Post, Query } from '@nestjs/common';
import { HuaweiService } from './huawei.service';
import { HuaweiAccessTokenBody, HuaweiAccessTokenResponse, HuaweiActivityRecordsQuery, HuaweiActivityRecordsResponse } from './huawei.dto';
import { withBaseUrl } from 'src/utils';

@Controller(withBaseUrl('huawei'))
export class HuaweiController {
    constructor(private readonly huaweiService: HuaweiService) {}

    @Post('/accessToken')
    public async accessToken(@Body() body: HuaweiAccessTokenBody) {
        const { code } = body

        try {
            const token = await this.huaweiService.getAccessToken(code);
            
            return new HuaweiAccessTokenResponse(token);
        } catch (error) {
            const { error_description } = error.response?.data ?? {}

            const message = error_description ?? error.message
            const httpStatus = message === 'code expired' ? HttpStatus.UNAUTHORIZED : HttpStatus.INTERNAL_SERVER_ERROR
            
            throw new HttpException(message, httpStatus);
        }
    }

    @Get('/healthkit/activityRecords')
    public async activityRecords(@Query() params: HuaweiActivityRecordsQuery) {
        try {
            const records = await this.huaweiService.getActivityRecords(params);
            
            return new HuaweiActivityRecordsResponse(records);
        } catch (error) {
            console.log('activityRecords error', error.response?.data)
            throw new HttpException(
                error.response?.statusText ?? error.message,
                error.status ?? HttpStatus.INTERNAL_SERVER_ERROR
            );
        }
    }
}
